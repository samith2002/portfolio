import { Figure, Callout, Code } from "@/components/blog";
import { WireFigure, MessageTrace, ToolDesign, SideEffectTiers } from "./_figures/tool-calling-figures";

export default function Post() {
  return (
    <>
      <p>
        The first time you watch a model &quot;call a function&quot;, it looks like the model reached out and did
        something. It didn&apos;t. The model wrote a small block of JSON that says which function it wants and with
        which arguments. Your code read that JSON and decided whether to run anything.
      </p>
      <p>
        That distinction is the whole game. Tool calling is structured output that has consequences, and nearly
        every reliability problem I&apos;ve hit with agents comes down to how well the tools were designed and how
        carefully the harness handled what the model wrote.
      </p>

      <h2>What actually happens</h2>
      <p>
        A tool-enabled request has three parts: a system prompt, a list of tool definitions and the conversation so
        far. Each tool definition is a name, a description and a JSON Schema for its arguments. The model reads all
        of it as text. It has no special access to your functions. It only knows what the schema and description
        tell it.
      </p>

      <Code lang="json" title="one tool definition">{`
{
  "name": "find_customer",
  "description": "Search customer master records by legal name. Returns up to 'limit' candidates with id, name, country and tax_id. Call this before any tool that needs a customer_id.",
  "input_schema": {
    "type": "object",
    "properties": {
      "name":    { "type": "string", "description": "Full or partial legal name, e.g. 'Acme Corp'" },
      "country": { "type": "string", "enum": ["US", "DE", "IN", "GB"], "description": "ISO code. Omit to search all countries." },
      "limit":   { "type": "integer", "minimum": 1, "maximum": 20, "default": 5 }
    },
    "required": ["name"]
  }
}
`}</Code>

      <p>
        When the model decides a tool would help, it replies with a <code>tool_use</code> block (a function call, in
        OpenAI&apos;s terms) containing an ID, the tool name and the arguments as JSON. It also sets a stop reason
        that says &quot;I&apos;m waiting on a tool&quot;. Then it stops generating. From here on, it&apos;s your
        turn.
      </p>

      <Figure
        label="Fig. 1"
        caption="The model only produces the right-hand box. Validating, executing and continuing all happen in the harness."
        wide
      >
        <WireFigure />
      </Figure>

      <p>
        The harness validates the arguments, runs the function and appends a <code>tool_result</code> message that
        references the call&apos;s ID. With Anthropic&apos;s API, that result goes inside a user message; with
        OpenAI&apos;s, it&apos;s a message with the <code>tool</code> role. Then you call the model again with the
        longer conversation. The model reads the result as text and decides what to do next: call another tool or
        answer.
      </p>

      <Code lang="text" title="message trace">{`
user        Are "Acme Corp" and "ACME Corporation GmbH" the same customer?

assistant   tool_use     toolu_01  find_customer {"name": "Acme Corp"}
            tool_use     toolu_02  find_customer {"name": "ACME Corporation GmbH"}
            stop_reason: tool_use

user        tool_result  toolu_01  [{"id": "C-10482", "country": "DE", "tax_id": "DE811…07"}]
            tool_result  toolu_02  [{"id": "C-20931", "country": "DE", "tax_id": "DE811…07"}]

assistant   Very likely the same company. Both records share tax ID DE811…07 ...
            stop_reason: end_turn
`}</Code>

      <h3>Parallel calls</h3>
      <p>
        Notice the assistant asked for two lookups in a single turn. Modern models can emit several independent tool
        calls at once, and the harness can run them concurrently and return all the results together. For
        lookups like these, that halves the number of round trips.
      </p>
      <p>
        The catch is that the model decides what&apos;s independent. Two reads are fine in parallel. A read
        followed by a write that depends on it is not. If your tools have ordering constraints, enforce them in the
        harness, or turn parallel calls off for that agent.
      </p>

      <Figure
        label="Fig. 2"
        caption="The same trace as a timeline. The two lookups go out in one assistant turn and come back as two results with matching IDs."
      >
        <MessageTrace />
      </Figure>

      <h2>Tool design matters more than prompt design</h2>
      <p>
        When an agent picks the wrong tool or passes bad arguments, my first instinct used to be adding a line to
        the system prompt. Now I look at the tool first. The model sees the tool definitions on every call, and a
        precise schema does more than a paragraph of instructions ever will.
      </p>

      <Figure
        label="Fig. 3"
        caption="Same underlying API, two very different tools. The first one hands the model a raw CRM. The second gives it one clear job and an error message it can use."
        wide
      >
        <ToolDesign />
      </Figure>

      <h3>Fewer, sharper tools</h3>
      <p>
        Every tool you add is one more option the model has to weigh on every step. I aim for the smallest set that
        covers the task, where each tool has one clear job. If two tools overlap, the model will sometimes choose the
        wrong one, and you&apos;ll spend days figuring out why.
      </p>

      <h3>Names and descriptions are prompts</h3>
      <p>
        <code>find_customer</code> tells the model what the tool does. <code>crm_query_v2</code> doesn&apos;t. The
        description should say what the tool returns, when to use it and when <em>not</em> to. &quot;Call this before
        any tool that needs a customer_id&quot; prevents a whole class of made-up IDs.
      </p>

      <h3>Types over prose</h3>
      <p>
        If an argument has five valid values, make it an enum. If it&apos;s a number with limits, put the limits in
        the schema. Many providers now offer strict modes that constrain generation to your schema, which removes
        most malformed calls outright. You still validate on your side, but you&apos;ll catch far fewer problems.
      </p>

      <h3>Return what the model needs, not what the API returns</h3>
      <p>
        Tool results land in the context window and stay there. A tool that returns a full API response pushes out
        the information the model actually needs, and it gets billed on every later turn. I shape results down to
        the fields that matter, cap list lengths and paginate. If the model needs more, it can ask.
      </p>

      <h3>Errors the model can act on</h3>
      <p>
        &quot;HTTP 500&quot; leaves the model with nothing to do except retry. &quot;No customer named &apos;Acme
        Corp&apos; in DE. Two matches in AT. Retry with country=&apos;AT&apos; or search by tax_id&quot; gives it a next
        step. Write errors for the model as the reader, the same way you&apos;d write them for a junior engineer.
      </p>

      <h3>Controlling when tools get called</h3>
      <p>
        By default the model decides whether to call a tool at all. Most APIs let you override that with a{" "}
        <code>tool_choice</code> setting: let the model decide, require some tool, require one specific tool or
        allow none. I use a forced single tool mainly for extraction steps, where the &quot;tool&quot; is really a
        schema for the output I want. Classifying a record or pulling fields from a document works this way, and
        the model can&apos;t reply in free text instead.
      </p>
      <p>
        The other lever is which tools you expose at each step. An agent in a triage phase doesn&apos;t need the
        merge tool in its list. Dropping tools that don&apos;t apply to the current phase shrinks the prompt and
        rules out a whole category of mistakes before the model has a chance to make them.
      </p>

      <h2>The consequences part</h2>
      <p>
        A tool that reads data and a tool that merges customer records can look the same to the model. They
        shouldn&apos;t look the same to your harness. I tag every tool with a side-effect tier and attach a policy
        to each tier.
      </p>

      <Figure
        label="Fig. 4"
        caption="Three tiers cover most enterprise tools. The model never sees the tier; the harness enforces it on every call."
      >
        <SideEffectTiers />
      </Figure>

      <p>A few habits make the write tiers safe:</p>
      <ul>
        <li>
          <strong>Validate twice.</strong> Check the JSON against the schema first, then apply business rules. The
          schema can confirm that <code>customer_id</code> is a string. Only your code can confirm the customer
          exists and the user is allowed to touch it.
        </li>
        <li>
          <strong>Make writes idempotent.</strong> Models retry, networks drop and harnesses resume from
          checkpoints. Derive an idempotency key from the call so the same request can&apos;t create two tasks or
          send two emails.
        </li>
        <li>
          <strong>Never trust IDs you didn&apos;t hand out.</strong> If the model passes a record ID, confirm it came
          from an earlier tool result in this run. A made-up ID that happens to match a real record is the worst
          kind of bug.
        </li>
        <li>
          <strong>Gate the irreversible.</strong> Anything that can&apos;t be undone waits for a person. I cover how
          that fits into the loop in <a href="/writing/agent-harness">the harness is the product</a>.
        </li>
      </ul>

      <h2>How it goes wrong</h2>
      <p>These are the failure modes I see most, and the fix that usually works:</p>
      <ol>
        <li>
          <strong>Invented arguments.</strong> The model fills in an ID or email it never saw. Fix: require a lookup
          tool first, say so in the description, and verify IDs against earlier results.
        </li>
        <li>
          <strong>The wrong tool.</strong> Two tools with overlapping descriptions. Fix: merge them, or make their
          descriptions say explicitly when to use each one.
        </li>
        <li>
          <strong>Retry loops.</strong> The same failing call over and over. Fix: actionable error messages plus
          loop detection in the harness.
        </li>
        <li>
          <strong>Context flooding.</strong> One oversized result pushes out everything else. Fix: shape and cap
          outputs, and offload large payloads to a file or store the model can query.
        </li>
        <li>
          <strong>Ignoring results.</strong> The model answers from its own assumptions and not from what the tool
          returned. Fix: keep results short and structured, and put the key fact first.
        </li>
      </ol>

      <Callout title="A quick test">
        Give your tool definitions to a colleague with no other context and ask them to complete a task using only
        those tools. Wherever they hesitate or guess, the model will too, just less visibly.
      </Callout>

      <h2>Close</h2>
      <p>
        Tool calling is simple mechanics: a schema in the request, JSON coming back and a result going in. The
        engineering is in everything around that exchange. Design tools like an API for a capable colleague who
        can&apos;t ask follow-up questions, and let the harness enforce the rules the model can&apos;t be trusted
        to remember.
      </p>
    </>
  );
}
