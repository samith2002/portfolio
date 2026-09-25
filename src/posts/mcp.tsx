import { Figure, Callout, Code, Compare } from "@/components/blog";
import { McpStyles, WiringFigure, HostFigure, LifecycleFigure, ApprovalFigure } from "./_figures/mcp-figures";

export default function Post() {
  return (
    <>
      <McpStyles />

      <p>
        Over the past year I&apos;ve built three MCP clients at Data Color AI. Atlas Co-Pilot talks to Salesforce and
        Informatica MDM servers at once. The AI Data Steward runs on top of the Reltio AgentFlow MCP server and
        sends every merge to a person for approval. The third project put MCP servers behind AWS Cognito OAuth
        and the Bedrock AgentCore runtime, so outside clients can reach them without anyone handing out
        credentials.
      </p>
      <p>
        Most explanations of the Model Context Protocol stop at &quot;it&apos;s like USB-C for AI.&quot; That
        comparison is fine for a slide, but it won&apos;t help you debug a client that hangs during the handshake
        or a model that keeps calling the wrong tool. This post covers what actually goes over the wire, and then
        what I&apos;ve learned building on it.
      </p>

      <h2>The problem it solves</h2>
      <p>
        Before MCP, connecting an LLM application to a system meant writing an integration for that exact pair.
        Your chat app needed a Salesforce connector. Your IDE agent needed its own. Your internal co-pilot needed a
        third, with slightly different auth and slightly different ideas about what an &quot;account&quot; is. With
        N applications and M systems you end up maintaining N×M connectors, and each one drifts in its own way.
      </p>
      <p>
        MCP turns this into an N+M problem. Each application implements the client side of the protocol once. Each
        system exposes a server once. Any client can then use any server, because both sides agree on how to
        discover capabilities, call tools, read data and report errors.
      </p>

      <Figure
        wide
        label="Fig. 1 · Integration count"
        caption="Three apps and four systems. Point-to-point wiring needs twelve connectors. With a shared protocol you build seven pieces, and adding a fifth system costs one server instead of three connectors."
      >
        <WiringFigure />
      </Figure>

      <h2>Hosts, clients and servers</h2>
      <p>The spec defines three roles, and it&apos;s easy to mix them up.</p>
      <ul>
        <li>
          <strong>Host.</strong> The application the user actually uses, such as Claude Desktop, an IDE, or in my
          case Atlas Co-Pilot. The host owns the LLM, the conversation and the user&apos;s trust. It decides which
          servers to connect to and what the model is allowed to do.
        </li>
        <li>
          <strong>Client.</strong> A connector inside the host. Each client keeps a stateful 1:1 session with
          exactly one server. If a host talks to three servers, it runs three clients.
        </li>
        <li>
          <strong>Server.</strong> A program that exposes capabilities (tools, resources, prompts) for one system
          or domain. It knows nothing about the model or the other servers.
        </li>
      </ul>
      <p>
        That isolation is deliberate. A server only sees the requests sent to it, never the full conversation, and
        never what the Salesforce server returned a moment ago. The host is where context gets combined, so the
        host is also where security decisions belong.
      </p>

      <Figure
        wide
        label="Fig. 2 · Atlas Co-Pilot"
        caption="One host, one model, three clients. Each client holds its own session with its own server. The host combines the results before anything reaches the model."
      >
        <HostFigure />
      </Figure>

      <h2>It&apos;s JSON-RPC underneath</h2>
      <p>
        Every MCP message is a JSON-RPC 2.0 message, and there are only three kinds. A <strong>request</strong> has
        an <code>id</code> and a <code>method</code> and expects a reply. A <strong>response</strong> carries the same{" "}
        <code>id</code> with either a <code>result</code> or an <code>error</code>. A <strong>notification</strong>{" "}
        has a method but no id, and nobody replies to it.
      </p>
      <p>
        Requests can go in both directions. The client calls the server&apos;s tools, but the server can also send
        requests to the client, such as asking it to run a completion or collect input from the user. Once you
        stop thinking of MCP as a REST API with extra steps, the rest of the spec is much easier to follow.
      </p>

      <h2>The handshake</h2>
      <p>
        Every session starts the same way. The client sends <code>initialize</code> with the protocol version it
        speaks, the capabilities it supports, and who it is. The server answers with the version it agrees to, its
        own capabilities, and its identity. The client then sends a <code>notifications/initialized</code>{" "}
        notification, and normal operation begins.
      </p>

      <Code lang="json" title="client → server">
        {`
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {},
      "elicitation": {}
    },
    "clientInfo": { "name": "atlas-copilot", "version": "1.4.0" }
  }
}
`}
      </Code>

      <Code lang="json" title="server → client">
        {`
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": { "listChanged": true },
      "resources": { "subscribe": true, "listChanged": true },
      "prompts": {},
      "logging": {}
    },
    "serverInfo": { "name": "informatica-mdm", "version": "0.9.2" },
    "instructions": "Search before you read. Entity IDs look like ent_XXXX."
  }
}
`}
      </Code>

      <p>
        Capability negotiation is the important part. A feature only exists in a session if both sides declared
        it. If the server didn&apos;t advertise <code>resources</code>, the client shouldn&apos;t call{" "}
        <code>resources/list</code>. If the client didn&apos;t advertise <code>sampling</code>, the server
        can&apos;t ask it for completions. The optional <code>instructions</code> field is easy to overlook, but
        it&apos;s a good place to give the model short, server-wide guidance.
      </p>

      <Figure
        label="Fig. 3 · Session lifecycle"
        caption="Initialization happens once per session. After that, requests flow both ways, and the server can tell the client its tool list changed without being asked."
      >
        <LifecycleFigure />
      </Figure>

      <h2>What a server offers</h2>
      <p>
        Servers expose three primitives. The difference between them comes down to who decides when each one is
        used.
      </p>

      <h3>Tools: the model decides</h3>
      <p>
        Tools are functions the model can call. The client discovers them with <code>tools/list</code>. Each one
        comes with a name, a description and a JSON Schema <code>inputSchema</code>, plus optional annotations
        like <code>readOnlyHint</code> and <code>destructiveHint</code>. When the model picks one, the host sends{" "}
        <code>tools/call</code>:
      </p>

      <Code lang="json" title="tools/call">
        {`
// request
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "search_entities",
    "arguments": { "query": "Acme", "entity_type": "Organization", "limit": 5 }
  }
}

// response
{
  "jsonrpc": "2.0",
  "id": 7,
  "result": {
    "content": [
      { "type": "text", "text": "3 matches: ent_1a2B3c Acme Corporation (Dallas) ..." }
    ],
    "isError": false
  }
}
`}
      </Code>

      <p>
        Pay attention to <code>isError</code>. If a tool fails in a way the model can react to, like a bad
        argument, no results or a permission problem, return a normal result with <code>isError: true</code> and a
        readable message. The model will read it and try again. Save JSON-RPC <code>error</code> responses for
        protocol-level failures such as an unknown tool or malformed params. With that split, an agent can
        recover from a bad call on its own instead of failing the whole run.
      </p>

      <h3>Resources: the application decides</h3>
      <p>
        Resources are read-only data addressed by URI, like <code>entity://ent_1a2B3c</code> or{" "}
        <code>file:///reports/q3.csv</code>. The client finds them with <code>resources/list</code> (or with URI
        templates) and fetches them with <code>resources/read</code>. If the server supports subscriptions, the
        client can ask to be notified when a resource changes. The host usually decides which resources go into
        context, often because a user picked or attached them, so the model isn&apos;t fetching data on a whim.
      </p>

      <h3>Prompts: the user decides</h3>
      <p>
        Prompts are reusable templates with arguments, discovered with <code>prompts/list</code> and filled in
        with <code>prompts/get</code>. Hosts usually show them as slash commands. They&apos;re the least discussed
        primitive, but they&apos;re a good way to ship a workflow, such as &quot;review this match rule,&quot;
        together with the server that knows how to run it.
      </p>

      <p>
        Here&apos;s what a small server looks like with the official Python SDK. Type hints become the input
        schema, and the docstring becomes the description the model reads.
      </p>

      <Code lang="python" title="mdm_server.py">
        {`
import json
from mcp.server.fastmcp import FastMCP

from mdm_client import mdm  # your own API wrapper

mcp = FastMCP("mdm-tools")

@mcp.tool()
def search_entities(query: str, entity_type: str = "Organization", limit: int = 10) -> str:
    """Find master data entities by name, ID or attribute.
    Returns at most \`limit\` compact matches with their entity IDs.
    Use get_entity for the full record."""
    return json.dumps(mdm.search(query, entity_type, limit))

@mcp.resource("entity://{entity_id}")
def entity(entity_id: str) -> str:
    """The full golden record for one entity, as JSON."""
    return json.dumps(mdm.get(entity_id))

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
`}
      </Code>

      <h2>What a client offers back</h2>
      <p>
        MCP isn&apos;t a one-way street. Clients can declare capabilities that let servers ask them for things:
      </p>
      <ul>
        <li>
          <strong>Sampling</strong> (<code>sampling/createMessage</code>). The server asks the host&apos;s model to
          generate a completion. The server gets LLM reasoning without its own API key, and the host stays in
          control of the model, the cost and the user&apos;s approval.
        </li>
        <li>
          <strong>Roots.</strong> The client tells the server which locations it may work in, usually{" "}
          <code>file://</code> directories. When they change, it sends{" "}
          <code>notifications/roots/list_changed</code>.
        </li>
        <li>
          <strong>Elicitation</strong> (<code>elicitation/create</code>). In the middle of an operation, the server
          asks the user for structured input with a small JSON schema, such as &quot;which of these two regions did
          you mean?&quot; The host shows the form, and the user can accept, decline or cancel.
        </li>
      </ul>
      <p>
        Notifications fill in the rest. When a server&apos;s tool set changes, it sends{" "}
        <code>notifications/tools/list_changed</code> and the client lists the tools again. Long operations can
        report progress against a <code>progressToken</code>, and either side can cancel a request that&apos;s
        still in flight.
      </p>

      <h2>Transports</h2>
      <p>
        The message format is the same everywhere. Only the pipe underneath changes, and the spec defines two.
      </p>

      <Compare
        leftTitle="stdio"
        rightTitle="Streamable HTTP"
        left={
          <>
            The host launches the server as a subprocess. Messages go over stdin and stdout as newline-delimited
            JSON, and stderr is free for logs. There&apos;s no network or auth to set up, and the server runs with
            the user&apos;s own permissions. It&apos;s the right choice for local tools and developer machines.
          </>
        }
        right={
          <>
            The server listens on a single HTTP endpoint. The client POSTs each message, and the server replies
            with plain JSON or opens an SSE stream when it has more to say. An <code>Mcp-Session-Id</code> header
            ties requests to a session. It&apos;s the right choice for remote, multi-user servers, and it&apos;s
            what everything I ship in production uses.
          </>
        }
      />

      <h2>Authorization for remote servers</h2>
      <p>
        Once a server sits behind HTTP, it needs real auth. MCP builds on OAuth 2.1. The MCP server acts as a
        resource server. It publishes protected resource metadata that points to its authorization server,
        returns <code>401</code> with a <code>WWW-Authenticate</code> header when a request has no token, and
        accepts bearer tokens after that. Clients go through a standard authorization code flow with PKCE, and
        tokens are meant to be issued for that specific server. A server should never pass a user&apos;s token
        along to some other API.
      </p>
      <p>
        For our servers, an AWS Cognito user pool is the authorization server. Third-party clients get app
        clients with narrow scopes, and each MCP server runs on the Bedrock AgentCore runtime with a JWT
        authorizer. The authorizer checks every token against the pool&apos;s signing keys, issuer, allowed
        clients and expiry before a request reaches our code. Inside the server we check scopes again for each
        tool, so a token that can search can&apos;t also merge.
      </p>

      <Callout title="What I'd tell my past self">
        Design your scopes around tools, not around the API behind them. A scope like <strong>mdm:read</strong>{" "}
        versus <strong>mdm:steward</strong> matches how the host shows risk to the user. A scope for each REST
        endpoint just leaks your backend&apos;s shape into your security model.
      </Callout>

      <h2>Lessons from building clients</h2>

      <h3>Don&apos;t mirror your REST API</h3>
      <p>
        The tempting first version turns every endpoint into a tool. The model then faces forty near-identical
        functions, and a simple question takes six calls. Design tools around what the user is trying to do.{" "}
        <code>find_duplicate_candidates(entity_id)</code> beats making the model chain search, fetch and compare
        itself. In my experience, fewer and higher-level tools with clear descriptions do more for reliability than
        rewriting the system prompt.
      </p>

      <h3>Budget every result</h3>
      <p>
        Whatever a tool returns goes into the context window. A search that returns 500 full records will crowd
        out the conversation. Return compact summaries with IDs, cap the result count, and let the model ask for
        details. For list operations, the spec&apos;s <code>cursor</code>/<code>nextCursor</code> pagination gives
        you a standard way to keep pages small.
      </p>

      <h3>Put a person in front of writes</h3>
      <p>
        Read tools can run on their own. Anything that changes data shouldn&apos;t. The AI Data Steward can
        investigate, simulate a merge and check governance rules without asking. The actual merge only happens
        after a data steward looks at the proposal and approves it. Tool annotations like{" "}
        <code>destructiveHint</code> help the host decide what needs confirmation. Treat them as hints, though, and
        enforce the rule in the host.
      </p>

      <Figure
        label="Fig. 4 · Human in the loop"
        caption="The agent does the investigation. A person makes the one decision that's hard to undo. Everything the reviewer needs is on one card: the call, both records, and the checks that passed."
      >
        <ApprovalFigure />
      </Figure>

      <h3>Namespace tools across servers</h3>
      <p>
        Connect two servers that both expose <code>search</code> and you&apos;ll get a collision. Even without one,
        the model has to guess which system a tool belongs to. A simple fix is to prefix every tool with its server
        name, like <code>salesforce__get_account</code> and <code>reltio__merge_entities</code>, and to say in each
        description which system it touches. It&apos;s a small change, and it removes a whole class of routing
        mistakes.
      </p>

      <h3>Watch the latency you add</h3>
      <p>
        Every MCP hop is a network round trip on top of model inference. Connect to servers in parallel when the
        host starts, cache <code>tools/list</code> until you get a <code>list_changed</code> notification, and run
        independent tool calls at the same time. For slow operations, send progress notifications so the user
        sees something happening instead of a spinner that looks frozen.
      </p>

      <h2>Where this leaves you</h2>
      <p>
        MCP is a small protocol: JSON-RPC, a handshake, three server primitives, a few client capabilities and two
        transports. You could read the whole spec in an afternoon. The hard part is everything around it:
        deciding which tools to expose, how much each result should cost in context, where a person has to sign
        off, and how auth maps to what the model is allowed to do. The protocol lets you connect any model to any
        system. Whether the result is actually useful comes down to those design choices.
      </p>
    </>
  );
}
