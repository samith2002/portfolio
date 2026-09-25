import type { ComponentType } from "react";
import AgentHarness from "./agent-harness";
import ToolCalling from "./tool-calling";
import Mcp from "./mcp";
import AgentMemory from "./agent-memory";
import ContextManagement from "./context-management";
import ContextOffloading from "./context-offloading";
import AiDataPipelines from "./ai-data-pipelines";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingTime: string;
  topic: string;
  Body: ComponentType;
};

// Newest first
export const posts: Post[] = [
  {
    slug: "context-offloading",
    title: "Context offloading: keep the window small and the work big",
    description:
      "Long-running agents drown in their own transcripts. Offloading moves bulky state out to files, stores and sub-agents so the model only sees what matters right now.",
    date: "2026-09-08",
    readingTime: "9 min",
    topic: "Context",
    Body: ContextOffloading,
  },
  {
    slug: "context-management",
    title: "Context is a budget, and every agent is overspending",
    description:
      "The context window is the agent's working memory. How to allocate it, what to compact, and why more tokens usually means worse answers.",
    date: "2026-08-19",
    readingTime: "10 min",
    topic: "Context",
    Body: ContextManagement,
  },
  {
    slug: "agent-memory",
    title: "Agent memory: what to remember, where to put it, when to forget",
    description:
      "Working, episodic, semantic and procedural memory for LLM agents, and the write, retrieve and decay policies that keep memory useful instead of noisy.",
    date: "2026-07-28",
    readingTime: "10 min",
    topic: "Memory",
    Body: AgentMemory,
  },
  {
    slug: "agent-harness",
    title: "The harness is the product",
    description:
      "The model is a function. The harness around it (the loop, tools, permissions, context and recovery) is what makes it an agent. A tour of the parts that matter.",
    date: "2026-07-02",
    readingTime: "11 min",
    topic: "Agents",
    Body: AgentHarness,
  },
  {
    slug: "mcp",
    title: "MCP from the wire up",
    description:
      "What the Model Context Protocol actually is: hosts, clients, servers, the JSON-RPC handshake, and the design decisions I've learned building MCP clients for enterprise data.",
    date: "2026-06-10",
    readingTime: "12 min",
    topic: "Protocols",
    Body: Mcp,
  },
  {
    slug: "tool-calling",
    title: "Tool calling is structured output with consequences",
    description:
      "How an LLM 'calls' a function, why tool design matters more than prompt design, and the patterns that make tool use reliable in production.",
    date: "2026-05-14",
    readingTime: "9 min",
    topic: "Agents",
    Body: ToolCalling,
  },
  {
    slug: "ai-data-pipelines",
    title: "Putting LLMs inside data pipelines without breaking them",
    description:
      "Lessons from wiring LLMs into Spark and Databricks pipelines: where they belong, where they don't, and how to keep a probabilistic step inside a deterministic system.",
    date: "2026-04-22",
    readingTime: "10 min",
    topic: "Data",
    Body: AiDataPipelines,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
