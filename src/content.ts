// All site copy lives here. Edit this file to update the portfolio.

export const profile = {
  name: "Samith Deshai Siddo",
  shortName: "Samith Siddo",
  role: "Forward Deployed AI Engineer",
  location: "Dallas, TX",
  timezone: "America/Chicago",
  email: "siddosamith10@gmail.com",
  linkedin: "https://www.linkedin.com/in/samith-deshai-siddo-787830353/",
  github: "https://github.com/samith2002",
  medium: "https://medium.com/@siddosamith",
  x: "https://x.com/SiddoSamith",
  resume: "/Samith-Siddo-Resume.pdf",
  siteUrl: "https://samithsiddo.com",
  status: "Forward Deployed AI Engineer at Data Color AI",
};

export const socials = [
  { label: "LinkedIn", handle: "samith-deshai-siddo", href: profile.linkedin },
  { label: "GitHub", handle: "@samith2002", href: profile.github },
  { label: "Medium", handle: "@siddosamith", href: profile.medium },
  { label: "X", handle: "@SiddoSamith", href: profile.x },
];

export const intro = {
  headline: ["I work inside your team,", "find where AI earns its place,", "and ship it to production."],
  body: "I'm a Forward Deployed AI Engineer at Data Color AI. I work directly with customer teams to understand how they work, figure out what AI can realistically do for them, and then build it: LLM agents, MCP integrations, retrieval systems and AI steps inside their data pipelines. I work across AWS, GCP and Azure, and I ship the whole stack.",
};

export type Work = {
  id: "atlas" | "steward" | "docuassist" | "mapping" | "pipelines";
  title: string;
  kind: string;
  summary: string;
  outcome?: string;
  stack: string[];
};

// Selected work from Data Color AI
export const work: Work[] = [
  {
    id: "atlas",
    title: "Atlas Co-Pilot",
    kind: "MCP client",
    summary:
      "A domain-specific co-pilot that connects to Salesforce and Informatica MDM through several MCP servers and gives support teams contextual recommendations.",
    outcome: "Cut support ticket volume by 40%",
    stack: ["MCP", "Salesforce", "Informatica MDM"],
  },
  {
    id: "steward",
    title: "AI Data Steward",
    kind: "Human-in-the-loop agent",
    summary:
      "When the same customer shows up twice in Reltio, a data steward has to decide whether to merge the records. This agent does the investigation for them. It compares the two records, checks what a merge would change and whether it breaks any data rules, then recommends merge, reject or wait. A person makes the final call, and every decision is recorded.",
    outcome: "Stewards review a recommendation instead of researching every pair",
    stack: ["Azure OpenAI", "Reltio MCP", "Service Bus", "Cosmos DB"],
  },
  {
    id: "docuassist",
    title: "DocuAssist",
    kind: "Document agent",
    summary:
      "An agent built on Informatica's AI Agent Engineering Platform. It turns unstructured documents into governed, structured data sources using RAG-based extraction and reasoning.",
    outcome: "Made document ingestion 3× faster",
    stack: ["RAG", "Informatica", "Hugging Face"],
  },
  {
    id: "mapping",
    title: "Smart Mapping",
    kind: "LLM matching · post-acquisition",
    summary:
      "When a company is acquired, its service codes live in its own ERP and CRM and look nothing like the parent's catalog. Smart Mapping has an LLM do the mapping. For each code, Gemini reads the description, weighs it against the closest catalog entries, and decides which one it is. Search and rules only narrow the options first. When Gemini isn't confident, the code goes to an analyst.",
    outcome: "20 acquired brands onboarded, about 70% of codes auto-accepted",
    stack: ["Gemini", "BigQuery VECTOR_SEARCH", "Cloud Run", "TF-IDF"],
  },
  {
    id: "pipelines",
    title: "AI-Native Data Pipelines",
    kind: "Data engineering",
    summary:
      "I build LLMs into data engineering pipelines. On Databricks, a Spark validation framework has LLMs profile the data and propose quality rules, a person reviews them, and they run at scale. Other LLM steps classify and enrich records along the way. MLflow tracks the results.",
    outcome: "Better data reliability and observability across pipelines",
    stack: ["Databricks", "Spark", "MLflow", "Hugging Face"],
  },
];

export type Project = {
  name: string;
  year: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  href?: string;
  linkLabel?: string;
  badge?: string;
};

export const projects: Project[] = [
  {
    name: "Prompt Weaver",
    year: "2025",
    tagline: "Turn napkin sketches into production prompts.",
    description:
      "A prompt engineering platform that turns sketches, screenshots, voice and screen recordings into structured prompts for AI coding tools. It's live and has paid subscriptions.",
    highlights: [
      "Three prompt modes, each tuned for a different kind of coding tool: general LLMs, Bolt/Lovable and Cursor/Windsurf",
      "Whiteboard drawing, screen-share animation capture, custom palettes and UI-to-ER diagram conversion",
      "Full subscription billing with usage tracking and plan enforcement through webhooks",
    ],
    stack: ["TypeScript", "React", "PostgreSQL", "LLMs"],
    href: "https://promptweaver.netlify.app/",
    linkLabel: "promptweaver.netlify.app",
  },
  {
    name: "MediCall",
    year: "2025",
    tagline: "A voice agent that books your doctor's appointment.",
    description:
      "A real-time voice AI receptionist. You call it and talk normally to book, reschedule or cancel medical appointments.",
    highlights: [
      "Gemini for reasoning, Deepgram for speech-to-text and ElevenLabs for natural-sounding speech",
      "LangChain tool calling, with the tools running as serverless functions",
      "Appointments sync to Supabase in real time while the call is happening",
    ],
    stack: ["Voice AI", "LangChain", "React", "Supabase"],
    href: "https://vapiiiii.netlify.app/",
    linkLabel: "Live demo",
    badge: "1st place, UNT GradInnoHack",
  },
  {
    name: "LectureForge",
    year: "2026",
    tagline: "Turn any lecture into a researched, cited course.",
    description:
      "A desktop app that turns a study video into a mini-course with lessons, a quiz, flashcards and a tutor. It checks the lecture against the live web and flags anything that's out of date.",
    highlights: [
      "Paste a video link or type a topic and get a full course: lessons at your level, a quiz and flashcards",
      "Fact-check badges on every claim. If the lecture is out of date, you see what it said, what's true now, and the sources",
      "Watch it work live in Mission Control as it plans, researches each concept and builds the course",
      "Ask the tutor anything. It answers from the course, searches the web, and draws charts and 3D scenes to explain",
      "Spaced-repetition review, a knowledge graph of what you've learned, one-click re-check of facts, and export to Notion",
    ],
    stack: ["Deep Agents", "Tavily", "MCP", "FastAPI", "React", "Tauri"],
  },
];

export const lectureForgeShots = [
  {
    src: "/lf/0.jpg",
    title: "Home",
    caption: "Paste a lecture video or type a topic, pick your level and model, and generate. Your courses sit below.",
  },
  {
    src: "/lf/1.jpg",
    title: "Mission Control",
    caption: "A run finishes: plan, research and forge phases, 95 tool calls and the course files the agent wrote.",
  },
  {
    src: "/lf/2.jpg",
    title: "Course reader",
    caption: "A lesson with an AI-coded 3D scene, the syllabus, and a tutor answering from cited sources.",
  },
  {
    src: "/lf/4.jpg",
    title: "Tutor draws",
    caption: "Asked to visualize context growth, the tutor draws a chart inline next to its explanation.",
  },
  {
    src: "/lf/3.jpg",
    title: "Interactive visual",
    caption: "Charts open full screen with zoom and pan: context use with a single agent vs. with subagents.",
  },
];

// Prompt Weaver demo videos (youtube.com/@promptweaver)
export const promptWeaverDemos = [
  { id: "u-AKIyOZln4", title: "Whiteboard", blurb: "Sketch a layout and turn it into a prompt", length: "1:53" },
  { id: "wuL0z_CinQY", title: "UI to prompt", blurb: "Upload a screenshot and get a detailed spec", length: "2:03" },
  { id: "q58I5nMqvaw", title: "Bolt & Lovable", blurb: "Prompts written for app builders", length: "2:03" },
  { id: "iAoAFU3_RFk", title: "Cursor & Windsurf", blurb: "Prompts written for agentic IDEs", length: "1:20" },
  { id: "RwZD1gj25Ak", title: "Existing project", blurb: "Reads your README for context", length: "1:23" },
  { id: "WQ1H3RzTObE", title: "Screen share", blurb: "Capture UI flows and animations", length: "3:37" },
  { id: "3Zgqhi7j1FI", title: "UI to ER", blurb: "Infer a database schema from a screen", length: "0:48" },
  { id: "Zxvkh55dN3A", title: "Code to flowchart", blurb: "Turn code logic into a diagram", length: "0:47" },
  { id: "t_3DLnW3xOE", title: "Voice", blurb: "Describe the UI out loud", length: "0:28" },
];

export const promptWeaverPlaylist = "https://www.youtube.com/playlist?list=PLHD7IBsEhhOu7EJ354L4aIIFUJDmEPSOh";

export const experience = [
  {
    company: "Data Color AI",
    role: "Forward Deployed AI Engineer",
    period: "2025 — Now",
    location: "Dallas, TX",
    points: [
      "Work directly with customer teams to understand their workflows and data, find the use cases where AI pays off, and take them from prototype to production.",
      "Build agentic AI products for enterprise master data management, connected to MDM, ERP and CRM systems through MCP.",
      "Built custom MCP servers that connect our agents to enterprise platforms, exposing each system's data and actions as tools the agents can call safely.",
      "Build AI into data engineering pipelines on Databricks and Spark, including LLM-generated data quality rules, enrichment and MLflow monitoring.",
      "Built secure integrations between MCP servers and third-party clients with AWS Cognito OAuth and the Bedrock AgentCore runtime.",
      "Deploy open-source Hugging Face embedding and instruction-tuned models in RAG pipelines, tuning them for latency and retrieval quality.",
    ],
  },
  {
    company: "Club InQuizitive",
    role: "Full Stack Developer",
    period: "2021 — 2023",
    location: "Hyderabad, India",
    points: [
      "Led a team of developers building the club's main site and several event platforms from scratch.",
      "Shipped responsive React and Tailwind apps with PostgreSQL and Firebase backends for live event registration.",
    ],
  },
];

export const recognition = [
  { year: "2025", title: "1st place, UNT GradInnoHack", detail: "Won for building MediCall" },
  {
    year: "2025",
    title: "Google Gemini × Pipecat Hackathon at Y Combinator",
    detail: "Voice and agentic AI hackathon during SF Tech Week",
  },
  {
    year: "2023",
    title: "IEEE publication",
    detail: "Design and implementation of a product recommendation system",
    href: "https://ieeexplore.ieee.org/document/10212422",
  },
  { year: "2020", title: "Flutter app on the Play Store", detail: "500+ users, 4.5★ rating" },
];

export const education = [
  {
    school: "University of North Texas",
    degree: "M.S. Computer Science",
    detail: "GPA 3.90 · NLP, Information Retrieval, Software Development for AI",
    year: "2025",
  },
  {
    school: "BV Raju Institute of Technology",
    degree: "B.Tech Computer Science",
    detail: "Data Structures, Operating Systems, Design Patterns",
    year: "2023",
  },
];

export type ToolGroup = { group: string; blurb: string; core: string[]; also: string[] };

// `core` items are highlighted; `also` items are listed quietly after them.
export const toolkit: ToolGroup[] = [
  {
    group: "Agents",
    blurb: "Loops, tools and guardrails",
    core: ["LangGraph", "MCP", "Tool calling", "Human-in-the-loop"],
    also: ["LangChain", "Agent memory", "Prompt caching", "Voice agents"],
  },
  {
    group: "Retrieval",
    blurb: "Getting the right context in",
    core: ["Hybrid RAG", "Vector search", "LLM re-ranking"],
    also: ["TF-IDF", "BigQuery VECTOR_SEARCH", "Pinecone", "Chroma", "Embeddings"],
  },
  {
    group: "Models",
    blurb: "Where the reasoning runs",
    core: ["AWS Bedrock", "Vertex AI · Gemini", "Azure OpenAI"],
    also: ["Bedrock AgentCore", "Claude", "Hugging Face", "Open-source LLMs"],
  },
  {
    group: "Data",
    blurb: "Pipelines AI plugs into",
    core: ["Databricks", "Spark", "BigQuery"],
    also: ["MLflow", "PostgreSQL", "Cosmos DB", "MongoDB", "Supabase"],
  },
  {
    group: "Cloud & infra",
    blurb: "Running it in production",
    core: ["GCP Cloud Run", "Azure Service Bus", "Docker"],
    also: ["Container Apps", "Artifact Registry", "GCS", "AWS Cognito", "OAuth"],
  },
  {
    group: "Product",
    blurb: "The rest of the stack",
    core: ["Python", "TypeScript", "React", "FastAPI"],
    also: ["Next.js", "Node.js", "Java", "Flutter", "pytest"],
  },
];

// How I work with customer teams, shown as a four-step strip
export const approach = [
  {
    step: "Discover",
    title: "Sit with the team",
    body: "I learn how the work happens today: the systems, the data, the handoffs, and where people lose hours.",
  },
  {
    step: "Scope",
    title: "Find where AI fits",
    body: "I separate what an LLM is actually good at from what a rule or a query should do, and agree on a number that defines success.",
  },
  {
    step: "Build",
    title: "Ship a working agent",
    body: "I build a prototype on their real data within days, then harden it with evals, guardrails and human review where mistakes are costly.",
  },
  {
    step: "Hand off",
    title: "Leave it running",
    body: "It goes live with monitoring, cost tracking, audit trails and documentation, so the team owns it after I step back.",
  },
];

export const certifications = [
  "MCP: Build Rich-Context AI Apps — Anthropic × DeepLearning.AI",
  "LangChain for LLM Application Development — DeepLearning.AI",
  "JavaScript RAG Web Apps with LlamaIndex — DeepLearning.AI",
];
