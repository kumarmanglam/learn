export const MODULE8_TOPICS = [
  // ─── 1. AI Agents Fundamentals ──────────────────────────────────────────
  {
    id: "ai-agents-fundamentals",
    category: "AI Agents",
    title: "AI Agents Fundamentals",
    priority: "High",
    icon: "🕵️",
    estimatedMinutes: 40,
    prerequisites: ["langchain-memory", "function-calling"],
    nextTopics: ["tool-use-patterns", "agent-architectures"],
    whyItMatters: "AI agents are the next evolution beyond chatbots. While a chatbot answers questions, an agent can plan, use tools, and take actions autonomously. Understanding agent fundamentals is essential because every major AI company is building agent systems — from code assistants to customer support to autonomous research. This is the most in-demand skill in AI engineering right now.",
    analogy: "An AI agent is like a junior employee with superpowers. You give them a goal ('research competitor pricing'), they break it down into steps, use available tools (web search, spreadsheet, email), check their work, and deliver results. They don't need step-by-step instructions — they figure out the plan. But like a junior employee, they need guardrails, clear tool descriptions, and someone reviewing their work.",
    content: `## AI Agents Fundamentals

### What is an AI Agent?
An AI agent is a system where an LLM acts as the **reasoning engine** that:
1. **Plans** — breaks down goals into steps
2. **Acts** — uses tools to execute steps
3. **Observes** — reads tool results
4. **Reflects** — decides what to do next
5. **Loops** — repeats until the goal is achieved

\`\`\`
┌─────────────────────────────────────────────┐
│              THE AGENT LOOP                 │
│                                             │
│  User Goal → Plan → Act → Observe → Think  │
│                ↑                      │     │
│                └──── not done? ───────┘     │
│                                             │
│                done? → Final Answer         │
└─────────────────────────────────────────────┘
\`\`\`

### Agent vs Chatbot vs Chain

| Feature | Chatbot | Chain | Agent |
|---------|---------|-------|-------|
| **Flow** | Single turn | Fixed pipeline | Dynamic loop |
| **Tools** | None | Hardcoded | LLM selects |
| **Planning** | None | None | Yes |
| **Iteration** | No | No | Yes (can retry) |
| **Autonomy** | Low | Medium | High |
| **Best for** | Q&A | Known workflows | Open-ended tasks |

### The ReAct Pattern (Reasoning + Acting)

The most common agent pattern. The LLM alternates between **thinking** and **acting**:

\`\`\`
Thought: I need to find the current stock price of AAPL
Action: search_web("AAPL stock price today")
Observation: AAPL is trading at $178.50
Thought: Now I need to calculate 15% of that
Action: calculate("178.50 * 0.15")
Observation: 26.775
Thought: I have all the information needed
Final Answer: 15% of AAPL's current price ($178.50) is $26.78
\`\`\`

### Core Components of an Agent

\`\`\`python
# 1. The LLM (brain)
from langchain_anthropic import ChatAnthropic
llm = ChatAnthropic(model="claude-sonnet-4-20250514")

# 2. Tools (capabilities)
from langchain_core.tools import tool

@tool
def search(query: str) -> str:
    """Search the web for current information."""
    ...

@tool
def calculate(expression: str) -> str:
    """Evaluate a math expression."""
    ...

# 3. System prompt (personality & rules)
system_prompt = """You are a research assistant.
Always search before answering factual questions.
Show your reasoning step by step."""

# 4. Memory (conversation history)
from langgraph.checkpoint.memory import MemorySaver
memory = MemorySaver()

# 5. Assemble the agent
from langgraph.prebuilt import create_react_agent
agent = create_react_agent(llm, [search, calculate],
                           prompt=system_prompt,
                           checkpointer=memory)
\`\`\`

### Agent Execution Flow

\`\`\`python
# The agent handles the full loop internally:
result = agent.invoke({
    "messages": [("human", "What's the population of Tokyo, and what's 3% of that?")]
})

# Internally:
# Step 1: LLM thinks "I need to search for Tokyo's population"
# Step 2: Calls search("Tokyo population")  → "13.96 million"
# Step 3: LLM thinks "Now calculate 3% of 13.96 million"
# Step 4: Calls calculate("13960000 * 0.03") → "418800"
# Step 5: LLM combines results into final answer
\`\`\`

### Key Design Principles

1. **Clear tool descriptions** — The LLM reads docstrings to decide which tool to use
2. **Minimal tools** — Too many tools confuse the agent. 5-10 is ideal
3. **Guardrails** — Limit max iterations, validate tool inputs, restrict dangerous actions
4. **Observability** — Log every thought/action/observation for debugging
5. **Human-in-the-loop** — Let humans approve critical actions (payments, deletes, sends)

### Common Agent Patterns

| Pattern | Description |
|---------|-------------|
| **ReAct** | Think → Act → Observe → Repeat |
| **Plan-and-Execute** | Create full plan first, then execute steps |
| **Reflection** | Agent critiques its own output, then improves |
| **Multi-Agent** | Multiple specialized agents collaborate |
| **Human-in-the-Loop** | Agent pauses for human approval on critical steps |
`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="300" fill="#0d1117" rx="8"/>
      <text x="300" y="28" fill="#58a6ff" font-size="15" text-anchor="middle" font-family="monospace" font-weight="bold">AI Agent Architecture</text>
      <defs><marker id="ag1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#58a6ff"/></marker></defs>
      <!-- User -->
      <rect x="30" y="55" width="80" height="35" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="70" y="77" fill="#c9d1d9" font-size="11" text-anchor="middle" font-family="monospace">User</text>
      <!-- Arrow -->
      <line x1="110" y1="72" x2="150" y2="72" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ag1)"/>
      <!-- LLM Brain -->
      <rect x="150" y="45" width="130" height="55" rx="8" fill="#1f6feb" opacity="0.9"/>
      <text x="215" y="68" fill="#fff" font-size="12" text-anchor="middle" font-family="monospace">LLM Brain</text>
      <text x="215" y="85" fill="#c9d1d9" font-size="9" text-anchor="middle" font-family="monospace">Plan + Reason</text>
      <!-- Decision -->
      <line x1="280" y1="72" x2="330" y2="72" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ag1)"/>
      <polygon points="370,45 420,72 370,100 320,72" fill="#161b22" stroke="#f0883e" stroke-width="1.5"/>
      <text x="370" y="76" fill="#f0883e" font-size="9" text-anchor="middle" font-family="monospace">Done?</text>
      <!-- No → Tools -->
      <line x1="370" y1="100" x2="370" y2="135" stroke="#238636" stroke-width="1.5" marker-end="url(#ag1)"/>
      <text x="385" y="122" fill="#238636" font-size="9" font-family="monospace">no</text>
      <!-- Tools row -->
      <rect x="70" y="140" width="80" height="30" rx="4" fill="#238636" opacity="0.7"/>
      <text x="110" y="160" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Search</text>
      <rect x="170" y="140" width="80" height="30" rx="4" fill="#238636" opacity="0.7"/>
      <text x="210" y="160" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Calculate</text>
      <rect x="270" y="140" width="80" height="30" rx="4" fill="#238636" opacity="0.7"/>
      <text x="310" y="160" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Database</text>
      <rect x="370" y="140" width="80" height="30" rx="4" fill="#238636" opacity="0.7"/>
      <text x="410" y="160" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">API Call</text>
      <rect x="470" y="140" width="80" height="30" rx="4" fill="#238636" opacity="0.7"/>
      <text x="510" y="160" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Code Exec</text>
      <!-- Observation back -->
      <line x1="300" y1="170" x2="300" y2="200" stroke="#8957e5" stroke-width="1.5"/>
      <line x1="300" y1="200" x2="150" y2="200" stroke="#8957e5" stroke-width="1.5"/>
      <line x1="150" y1="200" x2="150" y2="100" stroke="#8957e5" stroke-width="1.5" marker-end="url(#ag1)"/>
      <text x="230" y="215" fill="#8957e5" font-size="9" font-family="monospace">Observation → back to LLM</text>
      <!-- Yes → Answer -->
      <line x1="420" y1="72" x2="470" y2="72" stroke="#f85149" stroke-width="1.5" marker-end="url(#ag1)"/>
      <text x="445" y="65" fill="#f85149" font-size="9" font-family="monospace">yes</text>
      <rect x="470" y="55" width="100" height="35" rx="6" fill="#8957e5" opacity="0.9"/>
      <text x="520" y="77" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Answer</text>
      <!-- Memory -->
      <rect x="30" y="240" width="540" height="40" rx="6" fill="#161b22" stroke="#30363d" stroke-dasharray="4,4"/>
      <text x="50" y="260" fill="#58a6ff" font-size="10" font-family="monospace">Memory:</text>
      <text x="110" y="260" fill="#8b949e" font-size="9" font-family="monospace">conversation history + tool results persist across turns</text>
    </svg>`,
    examples: [
      {
        title: "Basic ReAct agent with tools",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent

# ── Define tools ──
@tool
def search_knowledge(query: str) -> str:
    """Search internal knowledge base for factual information."""
    kb = {
        "python gil": "The GIL (Global Interpreter Lock) prevents multiple threads from executing Python bytecode simultaneously. Use multiprocessing for CPU-bound parallelism.",
        "docker layers": "Docker images are built in layers. Each Dockerfile instruction creates a layer. Layers are cached — unchanged layers are reused on rebuild.",
        "rag pipeline": "RAG = Retrieve relevant docs + Augment prompt with them + Generate answer. Key steps: chunk docs, embed, store in vector DB, retrieve top-K, generate.",
    }
    for key, val in kb.items():
        if key in query.lower():
            return val
    return "No information found for that query."

@tool
def calculate(expression: str) -> str:
    """Evaluate a mathematical expression. Use Python math syntax."""
    try:
        result = eval(expression)
        return str(result)
    except Exception as e:
        return f"Error: {e}"

# ── Create agent ──
llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)

agent = create_react_agent(
    llm,
    [search_knowledge, calculate],
    prompt="You are a helpful AI engineering tutor. Search the knowledge base before answering factual questions. Use the calculator for math. Show your reasoning.",
)

# ── Run ──
result = agent.invoke({
    "messages": [("human", "What is the Python GIL and how many threads can execute bytecode at once?")]
})
print(result["messages"][-1].content)

print("---")

result2 = agent.invoke({
    "messages": [("human", "If I have 1000 documents, each 500 words, and embedding costs $0.02 per 1M tokens (assume 1.3 tokens/word), what's my total embedding cost?")]
})
print(result2["messages"][-1].content)`,
        expectedOutput: `The Python GIL (Global Interpreter Lock) prevents multiple threads from executing Python bytecode simultaneously. So only **1 thread** can execute bytecode at a time.

For CPU-bound parallelism, you should use multiprocessing instead of threading, as it bypasses the GIL by using separate processes.
---
Let me calculate that step by step:

1. Total words: 1,000 docs x 500 words = 500,000 words
2. Total tokens: 500,000 x 1.3 = 650,000 tokens
3. Cost: 650,000 / 1,000,000 x $0.02 = $0.013

Your total embedding cost would be approximately **$0.013** (about 1.3 cents).`
      }
    ],
    quiz: [
      { question: "What distinguishes an AI agent from a chatbot?", options: ["Agents use bigger models", "Agents can plan, use tools, and iterate autonomously", "Agents are always multi-modal", "Agents don't need prompts"], answer: 1, explanation: "An AI agent uses an LLM as a reasoning engine to plan, select tools, observe results, and iterate until a goal is met. A chatbot just responds to messages without tool use or autonomous planning." },
      { question: "What is the ReAct pattern?", options: ["A React.js framework for AI", "Alternating between reasoning (thinking) and acting (tool use)", "A way to make agents reactive to events", "A testing pattern for agents"], answer: 1, explanation: "ReAct (Reasoning + Acting) has the agent alternate between thinking about what to do next and actually calling tools, observing results each time before deciding the next step." },
      { question: "Why should you limit an agent to 5-10 tools?", options: ["API rate limits", "Too many tools confuse the LLM, leading to wrong tool selection", "Memory constraints", "Each tool costs money"], answer: 1, explanation: "With too many tools, the LLM has to read and reason about all their descriptions, increasing the chance it picks the wrong one. Keep tool sets focused and well-described." },
      { question: "When should you use a chain instead of an agent?", options: ["Never — agents are always better", "When the workflow is known and fixed", "When you have more than 3 tools", "When using Claude instead of GPT"], answer: 1, explanation: "Chains are better for known, deterministic workflows. They're faster, cheaper (fixed LLM calls), and more predictable. Agents are for open-ended tasks where the path isn't known upfront." },
      { question: "What is human-in-the-loop in agent design?", options: ["Using human language for prompts", "Pausing the agent for human approval before critical actions", "Having humans write the agent's code", "Using human feedback for training"], answer: 1, explanation: "Human-in-the-loop means the agent pauses and asks for human approval before taking critical or irreversible actions (e.g., sending emails, making payments, deleting data)." }
    ],
    commonMistakes: [
      { mistake: "Not setting max iterations on agents", fix: "Always set a max iteration limit (e.g., 10-25 steps). Without it, agents can loop infinitely, burning tokens and money." },
      { mistake: "Vague tool descriptions", fix: "The LLM reads the @tool docstring to decide when to use it. Be specific: 'Search the product database by name or SKU' not just 'Search'." },
      { mistake: "Giving agents too much autonomy", fix: "Add guardrails: approve critical actions, restrict tool access, validate inputs. Start with human-in-the-loop and remove guardrails incrementally." },
      { mistake: "Not logging agent steps", fix: "Always enable tracing (LangSmith or custom logging). Without it, you can't debug why an agent chose the wrong tool or gave a bad answer." }
    ],
    cheatSheet: `# AI Agents Cheat Sheet

## ReAct Agent (LangGraph)
from langgraph.prebuilt import create_react_agent
agent = create_react_agent(llm, tools, prompt="...", checkpointer=memory)
result = agent.invoke({"messages": [("human", "...")]})

## Define Tools
from langchain_core.tools import tool
@tool
def my_tool(param: str) -> str:
    """Clear description for the LLM."""  # <-- critical!
    return result

## Key Components
1. LLM (brain) — reasoning engine
2. Tools (hands) — actions the agent can take
3. Prompt (personality) — rules and behavior
4. Memory (notebook) — conversation history
5. Guardrails (limits) — max iterations, approvals

## Agent vs Chain
Chain: fixed steps, predictable, cheaper
Agent: dynamic steps, flexible, more expensive

## Design Principles
- 5-10 focused tools max
- Clear docstrings on every tool
- Max iteration limits
- Human-in-the-loop for critical actions
- Log everything (LangSmith)`,
    furtherReading: [
      { title: "LangGraph Agent Concepts", url: "https://langchain-ai.github.io/langgraph/concepts/" },
      { title: "Building Agents with Claude", url: "https://docs.anthropic.com/en/docs/build-with-claude/agentic" },
      { title: "ReAct Paper", url: "https://arxiv.org/abs/2210.03629" }
    ],
    flashcards: [
      { front: "What are the 5 steps in the agent loop?", back: "Plan → Act → Observe → Reflect → Loop. The LLM plans what to do, calls a tool (act), reads the result (observe), decides if done (reflect), and repeats (loop) until the goal is met." },
      { front: "ReAct pattern in one sentence?", back: "The agent alternates between reasoning (thinking about what to do) and acting (calling a tool), observing results each time, until it has enough information to answer." },
      { front: "Why are tool docstrings critical for agents?", back: "The LLM reads docstrings to decide when and how to use each tool. Vague docstrings → wrong tool selection → bad results. Be specific about what the tool does and what inputs it expects." },
      { front: "Agent vs Chain — when to use which?", back: "Chain: known, fixed workflow (predictable, cheaper). Agent: open-ended tasks where the LLM must decide what to do (flexible, more expensive). Use chains when you can, agents when you must." },
      { front: "What is human-in-the-loop?", back: "The agent pauses before critical actions (payments, sends, deletes) and asks a human for approval. Essential for production agents to prevent costly mistakes." }
    ]
  },

  // ─── 2. Tool Use Patterns ───────────────────────────────────────────────
  {
    id: "tool-use-patterns",
    category: "AI Agents",
    title: "Tool Use Patterns",
    priority: "High",
    icon: "🔧",
    estimatedMinutes: 40,
    prerequisites: ["ai-agents-fundamentals", "function-calling"],
    nextTopics: ["agent-architectures", "mcp-protocol"],
    whyItMatters: "Tool use is the bridge between an LLM's intelligence and the real world. Without tools, an LLM can only generate text. With tools, it can search the web, query databases, write files, call APIs, and execute code. Mastering tool design patterns determines whether your agent is useful or frustrating.",
    analogy: "Tools for an agent are like apps on your phone. A phone without apps is just a calculator. With the right apps (maps, camera, email, banking), it becomes indispensable. Similarly, an LLM without tools just generates text. With well-designed tools, it can do real work. And just like apps need clear UI for humans, tools need clear descriptions for LLMs.",
    content: `## Tool Use Patterns

### How Tool Calling Works

\`\`\`
1. LLM receives user message + list of tool schemas
2. LLM decides to call a tool (or not)
3. System executes the tool with LLM-provided arguments
4. Tool result is sent back to LLM
5. LLM incorporates result into its response (or calls another tool)
\`\`\`

### Designing Effective Tools

#### Rule 1: Clear Names and Descriptions

\`\`\`python
# BAD — vague, LLM won't know when to use this
@tool
def search(q: str) -> str:
    """Search."""
    ...

# GOOD — specific, LLM knows exactly when and how to use this
@tool
def search_product_catalog(query: str, category: str = "all") -> str:
    """Search the product catalog by name, description, or SKU.
    Returns top 5 matching products with name, price, and availability.
    Use when the user asks about products, prices, or availability."""
    ...
\`\`\`

#### Rule 2: Typed Parameters with Descriptions

\`\`\`python
from pydantic import BaseModel, Field

class SearchInput(BaseModel):
    query: str = Field(description="Search query — product name, description, or SKU")
    category: str = Field(default="all", description="Filter by category: electronics, clothing, food, or all")
    max_results: int = Field(default=5, description="Number of results to return (1-20)")

@tool(args_schema=SearchInput)
def search_products(query: str, category: str = "all", max_results: int = 5) -> str:
    """Search the product catalog. Returns matching products with prices."""
    ...
\`\`\`

#### Rule 3: Return Useful, Concise Results

\`\`\`python
# BAD — returns raw database dump
@tool
def get_user(user_id: str) -> str:
    """Get user info."""
    return str(db.users.find_one({"_id": user_id}))  # huge JSON blob

# GOOD — returns only what the LLM needs
@tool
def get_user_profile(user_id: str) -> str:
    """Get user profile summary. Returns name, email, plan, and account status."""
    user = db.users.find_one({"_id": user_id})
    if not user:
        return f"User {user_id} not found."
    return f"Name: {user['name']}, Email: {user['email']}, Plan: {user['plan']}, Status: {user['status']}"
\`\`\`

### Common Tool Patterns

#### 1. Read-Only Tools (safest)
\`\`\`python
@tool
def get_weather(city: str) -> str:
    """Get current weather for a city."""
    # Safe — only reads data
    ...

@tool
def search_docs(query: str) -> str:
    """Search documentation."""
    ...
\`\`\`

#### 2. Write Tools (need guardrails)
\`\`\`python
@tool
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email. REQUIRES human approval."""
    # Dangerous — irreversible action
    ...

@tool
def update_database(table: str, record_id: str, updates: dict) -> str:
    """Update a database record. Restricted to non-critical tables."""
    ALLOWED_TABLES = ["user_preferences", "draft_content"]
    if table not in ALLOWED_TABLES:
        return f"Error: Cannot modify table '{table}'. Allowed: {ALLOWED_TABLES}"
    ...
\`\`\`

#### 3. Composite Tools (combine multiple actions)
\`\`\`python
@tool
def research_topic(topic: str) -> str:
    """Research a topic by searching multiple sources and summarizing findings."""
    web_results = search_web(topic)
    doc_results = search_internal_docs(topic)
    return f"Web: {web_results}\\nInternal: {doc_results}"
\`\`\`

### Error Handling in Tools

\`\`\`python
@tool
def query_database(sql: str) -> str:
    """Execute a read-only SQL query against the analytics database."""
    if not sql.strip().upper().startswith("SELECT"):
        return "Error: Only SELECT queries are allowed."
    try:
        results = db.execute(sql)
        if not results:
            return "Query returned no results."
        return format_results(results)
    except Exception as e:
        return f"Query failed: {str(e)}. Check your SQL syntax."
\`\`\`

### Tool Composition Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| **Sequential** | Tool A → Tool B → Tool C | Search → Fetch → Summarize |
| **Conditional** | If X, use Tool A; else Tool B | If URL, scrape; else search |
| **Parallel** | Run Tools A, B, C simultaneously | Check weather + news + stocks |
| **Fallback** | Try Tool A; if fails, try Tool B | Search API → cache → default |
| **Approval** | Tool pauses for human OK | Send email → wait for approval |
`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="300" fill="#0d1117" rx="8"/>
      <text x="300" y="28" fill="#58a6ff" font-size="15" text-anchor="middle" font-family="monospace" font-weight="bold">Tool Use Flow</text>
      <defs><marker id="tu1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#58a6ff"/></marker></defs>
      <!-- User msg -->
      <rect x="20" y="50" width="100" height="35" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="70" y="72" fill="#c9d1d9" font-size="10" text-anchor="middle" font-family="monospace">User Msg</text>
      <line x1="120" y1="67" x2="150" y2="67" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#tu1)"/>
      <!-- LLM + schemas -->
      <rect x="150" y="42" width="140" height="50" rx="6" fill="#1f6feb" opacity="0.9"/>
      <text x="220" y="63" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">LLM</text>
      <text x="220" y="80" fill="#c9d1d9" font-size="8" text-anchor="middle" font-family="monospace">+ tool schemas</text>
      <!-- Tool call -->
      <line x1="290" y1="67" x2="320" y2="67" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#tu1)"/>
      <rect x="320" y="42" width="120" height="50" rx="6" fill="#238636" opacity="0.9"/>
      <text x="380" y="63" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Tool Call</text>
      <text x="380" y="80" fill="#c9d1d9" font-size="8" text-anchor="middle" font-family="monospace">{name, args}</text>
      <!-- Execute -->
      <line x1="440" y1="67" x2="470" y2="67" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#tu1)"/>
      <rect x="470" y="42" width="100" height="50" rx="6" fill="#f0883e" opacity="0.8"/>
      <text x="520" y="63" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Execute</text>
      <text x="520" y="80" fill="#c9d1d9" font-size="8" text-anchor="middle" font-family="monospace">run function</text>
      <!-- Result back -->
      <path d="M520 92 L520 115 L220 115 L220 92" stroke="#8957e5" stroke-width="1.5" fill="none" marker-end="url(#tu1)"/>
      <text x="370" y="130" fill="#8957e5" font-size="9" text-anchor="middle" font-family="monospace">tool result → back to LLM</text>
      <!-- Good vs Bad tools -->
      <rect x="20" y="155" width="270" height="120" rx="6" fill="#161b22" stroke="#238636"/>
      <text x="35" y="175" fill="#238636" font-size="11" font-family="monospace">Good Tool Design</text>
      <text x="35" y="195" fill="#8b949e" font-size="9" font-family="monospace">- Specific name: search_product_catalog</text>
      <text x="35" y="210" fill="#8b949e" font-size="9" font-family="monospace">- Typed params with descriptions</text>
      <text x="35" y="225" fill="#8b949e" font-size="9" font-family="monospace">- Concise, useful return values</text>
      <text x="35" y="240" fill="#8b949e" font-size="9" font-family="monospace">- Clear error messages</text>
      <text x="35" y="255" fill="#8b949e" font-size="9" font-family="monospace">- Docstring says WHEN to use it</text>
      <rect x="310" y="155" width="270" height="120" rx="6" fill="#161b22" stroke="#f85149"/>
      <text x="325" y="175" fill="#f85149" font-size="11" font-family="monospace">Bad Tool Design</text>
      <text x="325" y="195" fill="#8b949e" font-size="9" font-family="monospace">- Vague name: search</text>
      <text x="325" y="210" fill="#8b949e" font-size="9" font-family="monospace">- Untyped params, no descriptions</text>
      <text x="325" y="225" fill="#8b949e" font-size="9" font-family="monospace">- Returns raw data dumps</text>
      <text x="325" y="240" fill="#8b949e" font-size="9" font-family="monospace">- Crashes on errors</text>
      <text x="325" y="255" fill="#8b949e" font-size="9" font-family="monospace">- No docstring or one-word desc</text>
    </svg>`,
    examples: [
      {
        title: "Well-designed tool set for a customer support agent",
        code: `from langchain_core.tools import tool
from pydantic import BaseModel, Field
from langchain_anthropic import ChatAnthropic
from langgraph.prebuilt import create_react_agent

# ── Typed input schemas ──
class OrderLookupInput(BaseModel):
    order_id: str = Field(description="Order ID in format ORD-XXXX")

class RefundInput(BaseModel):
    order_id: str = Field(description="Order ID to refund")
    reason: str = Field(description="Reason for refund")

# ── Tools with clear descriptions ──
@tool(args_schema=OrderLookupInput)
def lookup_order(order_id: str) -> str:
    """Look up an order by ID. Returns order status, items, total, and shipping info.
    Use when customer asks about their order status or details."""
    orders = {
        "ORD-1234": {"status": "Shipped", "items": ["Widget A x2", "Gadget B x1"],
                     "total": 89.97, "eta": "March 15"},
        "ORD-5678": {"status": "Processing", "items": ["Widget C x1"],
                     "total": 29.99, "eta": "March 18"},
    }
    order = orders.get(order_id)
    if not order:
        return f"Order {order_id} not found. Ask customer to verify the order ID."
    return f"Order {order_id}: {order['status']}. Items: {', '.join(order['items'])}. Total: \${order['total']}. ETA: {order['eta']}"

@tool
def search_faq(question: str) -> str:
    """Search FAQ knowledge base. Use for policy questions about returns, shipping, warranty, etc."""
    faqs = {
        "return": "Returns accepted within 30 days. Item must be unused in original packaging. Refund processed in 5-7 business days.",
        "shipping": "Standard: 5-7 days. Express: 2-3 days (+\\$12). Free shipping on orders over \\$50.",
        "warranty": "All products include 1-year warranty. Extended warranty available for \\$29/year.",
    }
    for key, answer in faqs.items():
        if key in question.lower():
            return answer
    return "No FAQ found. Escalate to human agent if needed."

@tool(args_schema=RefundInput)
def initiate_refund(order_id: str, reason: str) -> str:
    """Initiate a refund for an order. ONLY use after confirming the order exists and customer explicitly requests a refund."""
    return f"Refund initiated for {order_id}. Reason: {reason}. Customer will receive refund in 5-7 business days. Confirmation email sent."

# ── Create agent ──
llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)
agent = create_react_agent(
    llm,
    [lookup_order, search_faq, initiate_refund],
    prompt="""You are a friendly customer support agent for WidgetCo.
Rules:
- Always look up order details before answering order questions
- Search FAQ for policy questions
- NEVER initiate refunds without explicit customer request
- Be empathetic and concise""",
)

# ── Test ──
result = agent.invoke({
    "messages": [("human", "Where's my order ORD-1234? Also, what's your return policy?")]
})
print(result["messages"][-1].content)`,
        expectedOutput: `I looked into both questions for you:

**Order ORD-1234**: Your order has been **shipped**! It includes Widget A x2 and Gadget B x1 (total: $89.97). Estimated arrival: **March 15**.

**Return Policy**: Returns are accepted within 30 days. The item must be unused and in its original packaging. Refunds are processed in 5-7 business days.

Is there anything else I can help with?`
      }
    ],
    quiz: [
      { question: "What is the most important part of a tool definition for an LLM agent?", options: ["The return type", "The function name and docstring description", "The number of parameters", "The implementation complexity"], answer: 1, explanation: "The LLM reads the tool name and docstring to decide when and how to use it. A clear, specific description is the single most important factor in correct tool selection." },
      { question: "Why should tools return concise results instead of raw data?", options: ["To save disk space", "The LLM has a context window limit — large results waste tokens and may confuse it", "To make the code shorter", "Raw data is always insecure"], answer: 1, explanation: "Raw data dumps (like full database records) waste context window space and can confuse the LLM. Return only the information the LLM needs to answer the user's question." },
      { question: "What is a 'write tool' and why does it need guardrails?", options: ["A tool that writes documentation", "A tool that performs irreversible actions (send email, modify DB) — needs approval gates", "A tool that creates log files", "A tool that generates code"], answer: 1, explanation: "Write tools perform actions that can't be undone (sending emails, modifying databases, deleting records). They need guardrails like human approval, restricted scope, and input validation." },
      { question: "How should a tool handle errors?", options: ["Crash and let the agent fail", "Return a helpful error message the LLM can understand and act on", "Silently return empty results", "Retry infinitely"], answer: 1, explanation: "Return a clear error message the LLM can understand. This lets the agent try a different approach or ask the user for clarification instead of crashing the whole workflow." }
    ],
    commonMistakes: [
      { mistake: "Tools that return huge JSON blobs", fix: "Format tool results as concise, human-readable text. Only include fields the LLM needs. If an order has 50 fields, return the 5 relevant ones." },
      { mistake: "Missing error handling in tools", fix: "Always return a helpful error string instead of raising exceptions: `return f'Error: {str(e)}. Try a different query.'`" },
      { mistake: "No guardrails on write operations", fix: "Gate dangerous actions: validate inputs, restrict to allowed operations, and add human-in-the-loop for irreversible actions." },
      { mistake: "Tool descriptions that don't say WHEN to use them", fix: "Include usage guidance in the docstring: 'Use when the user asks about product pricing or availability.' This helps the LLM select the right tool." }
    ],
    cheatSheet: `# Tool Use Patterns Cheat Sheet

## Basic Tool
@tool
def my_tool(param: str) -> str:
    """Clear desc + WHEN to use it."""
    return result

## Typed Tool
from pydantic import BaseModel, Field
class MyInput(BaseModel):
    query: str = Field(description="What to search for")
@tool(args_schema=MyInput)
def search(query: str) -> str:
    """Search by keyword."""
    ...

## Design Rules
1. Specific names (search_products not search)
2. Typed params with Field(description=...)
3. Concise results (not raw data dumps)
4. Clear error messages (not exceptions)
5. Docstring says WHEN to use it

## Safety Tiers
Read-only: safe, no guardrails needed
Write: needs validation + approval
Delete: needs human-in-the-loop`,
    furtherReading: [
      { title: "Anthropic Tool Use Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use" },
      { title: "LangChain Custom Tools", url: "https://python.langchain.com/docs/how_to/custom_tools/" }
    ],
    flashcards: [
      { front: "What are the 3 rules of good tool design?", back: "1) Clear, specific name + docstring that says WHEN to use it. 2) Typed parameters with descriptions. 3) Concise, useful return values (not raw data dumps)." },
      { front: "Read tool vs Write tool?", back: "Read tools only fetch data (search, get_weather) — safe, no guardrails needed. Write tools modify state (send_email, update_db) — need validation, restricted scope, and human approval for critical actions." },
      { front: "How should tools handle errors?", back: "Return a helpful error string the LLM can understand: `return f'Error: {str(e)}. Try a different query.'` Never raise exceptions — the agent needs to keep running." },
      { front: "Why type tool parameters with Pydantic?", back: "Typed parameters with Field(description=...) tell the LLM exactly what each argument expects. This reduces invalid tool calls and improves argument quality." }
    ]
  },

  // ─── 3. Agent Architectures ─────────────────────────────────────────────
  {
    id: "agent-architectures",
    category: "AI Agents",
    title: "Agent Architectures",
    priority: "High",
    icon: "🏗️",
    estimatedMinutes: 45,
    prerequisites: ["ai-agents-fundamentals", "tool-use-patterns"],
    nextTopics: ["langgraph-workflows", "multi-agent-systems"],
    whyItMatters: "Different tasks need different agent architectures. A simple Q&A agent uses ReAct, but a complex research task needs plan-and-execute. A code review needs reflection. A company-wide AI system needs multi-agent orchestration. Choosing the wrong architecture means your agent either can't solve the problem or wastes resources. Understanding the trade-offs is essential for production AI systems.",
    analogy: "Agent architectures are like management styles. ReAct is like a solo worker who thinks and acts on the fly. Plan-and-Execute is like a project manager who writes a plan before delegating tasks. Reflection is like a writer who drafts, critiques, and revises. Multi-agent is like a team where each person has a specialty. The right style depends on the complexity of the project.",
    content: `## Agent Architectures

### 1. ReAct (Reasoning + Acting)
The simplest and most common pattern. The LLM alternates between thinking and tool use in a loop.

\`\`\`
Think → Act → Observe → Think → Act → Observe → ... → Answer
\`\`\`

**Best for**: Simple tool-using tasks, Q&A with search, straightforward lookups.
**Limitation**: No upfront planning — can wander or get stuck in loops.

### 2. Plan-and-Execute
The agent first creates a complete plan, then executes each step.

\`\`\`
User Goal → Create Plan [Step 1, 2, 3, ...] → Execute Step 1 → Execute Step 2 → ... → Final Answer
\`\`\`

\`\`\`python
# Plan-and-Execute with LangGraph
from langgraph.prebuilt import create_react_agent

# The planner creates the plan
planner_prompt = """Given the user's goal, create a numbered plan.
Each step should be a single, concrete action.
Output ONLY the plan, one step per line."""

# The executor handles each step
executor_prompt = """Execute step {step_number} of the plan:
{current_step}

Previous results: {previous_results}"""
\`\`\`

**Best for**: Complex multi-step tasks, research, data analysis.
**Limitation**: Plan may become stale as new information is discovered.

### 3. Reflection / Self-Critique
The agent generates output, then critiques and improves it.

\`\`\`
Generate → Critique → Revise → Critique → Revise → ... → Final Output
\`\`\`

\`\`\`python
# Reflection pattern
def reflection_loop(task, max_iterations=3):
    # Generate initial draft
    draft = llm.invoke(f"Write: {task}")

    for i in range(max_iterations):
        # Critique
        critique = llm.invoke(f"Critique this output. List specific issues:\\n{draft}")

        # Check if good enough
        if "no issues" in critique.lower():
            break

        # Revise based on critique
        draft = llm.invoke(f"Revise based on this feedback:\\n{critique}\\n\\nOriginal:\\n{draft}")

    return draft
\`\`\`

**Best for**: Writing, code generation, any task where quality improves with iteration.
**Limitation**: More LLM calls = higher cost and latency.

### 4. Multi-Agent Systems
Multiple specialized agents collaborate, each with their own tools and expertise.

\`\`\`
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Researcher │ ──→ │   Analyst    │ ──→ │   Writer    │
│  (search)   │     │  (calculate) │     │  (format)   │
└─────────────┘     └──────────────┘     └─────────────┘
\`\`\`

\`\`\`python
# Multi-agent with LangGraph
from langgraph.graph import StateGraph, MessagesState

# Agent 1: Researcher
researcher = create_react_agent(llm, [search_web, search_docs])

# Agent 2: Analyst
analyst = create_react_agent(llm, [calculate, query_database])

# Agent 3: Writer
writer = create_react_agent(llm, [format_report])

# Orchestrate
graph = StateGraph(MessagesState)
graph.add_node("researcher", researcher)
graph.add_node("analyst", analyst)
graph.add_node("writer", writer)
graph.add_edge("researcher", "analyst")
graph.add_edge("analyst", "writer")
\`\`\`

**Best for**: Complex workflows, team simulation, specialization.
**Limitation**: Highest complexity, hardest to debug.

### 5. Router Agent
A dispatcher that routes requests to specialized sub-agents.

\`\`\`
User Query → Router → {code_agent, search_agent, math_agent, ...}
\`\`\`

**Best for**: Diverse requests, customer support triage, multi-domain systems.

### Architecture Comparison

| Architecture | Planning | Iteration | Agents | Cost | Complexity |
|-------------|----------|-----------|--------|------|------------|
| **ReAct** | None | Yes (tool loop) | 1 | Low | Low |
| **Plan-Execute** | Upfront | Per-step | 1-2 | Medium | Medium |
| **Reflection** | None | Yes (critique) | 1 | Medium | Low |
| **Multi-Agent** | Varies | Per-agent | 2+ | High | High |
| **Router** | None | Delegated | 2+ | Medium | Medium |

### Choosing the Right Architecture

\`\`\`
Is the task simple (1-3 tool calls)?
  → ReAct

Does it need a plan with many steps?
  → Plan-and-Execute

Does output quality matter more than speed?
  → Reflection

Does it span multiple domains/expertise?
  → Multi-Agent or Router

Is it a mix of known + unknown workflows?
  → Router + specialized sub-agents
\`\`\`
`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="300" fill="#0d1117" rx="8"/>
      <text x="300" y="25" fill="#58a6ff" font-size="14" text-anchor="middle" font-family="monospace" font-weight="bold">Agent Architectures Overview</text>
      <defs><marker id="aa1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#58a6ff"/></marker></defs>
      <!-- ReAct -->
      <rect x="20" y="40" width="170" height="55" rx="6" fill="#161b22" stroke="#1f6feb"/>
      <text x="105" y="58" fill="#1f6feb" font-size="10" text-anchor="middle" font-family="monospace" font-weight="bold">ReAct</text>
      <text x="105" y="73" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Think→Act→Observe→Loop</text>
      <text x="105" y="86" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Simple, 1 agent</text>
      <!-- Plan-Execute -->
      <rect x="210" y="40" width="170" height="55" rx="6" fill="#161b22" stroke="#238636"/>
      <text x="295" y="58" fill="#238636" font-size="10" text-anchor="middle" font-family="monospace" font-weight="bold">Plan-and-Execute</text>
      <text x="295" y="73" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Plan→Step1→Step2→...</text>
      <text x="295" y="86" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Complex tasks</text>
      <!-- Reflection -->
      <rect x="400" y="40" width="170" height="55" rx="6" fill="#161b22" stroke="#8957e5"/>
      <text x="485" y="58" fill="#8957e5" font-size="10" text-anchor="middle" font-family="monospace" font-weight="bold">Reflection</text>
      <text x="485" y="73" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Generate→Critique→Revise</text>
      <text x="485" y="86" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Quality-focused</text>
      <!-- Multi-Agent -->
      <rect x="20" y="115" width="265" height="70" rx="6" fill="#161b22" stroke="#f0883e"/>
      <text x="152" y="135" fill="#f0883e" font-size="10" text-anchor="middle" font-family="monospace" font-weight="bold">Multi-Agent</text>
      <rect x="35" y="145" width="60" height="25" rx="4" fill="#1f6feb" opacity="0.5"/>
      <text x="65" y="162" fill="#c9d1d9" font-size="8" text-anchor="middle" font-family="monospace">Research</text>
      <line x1="95" y1="157" x2="115" y2="157" stroke="#58a6ff" stroke-width="1" marker-end="url(#aa1)"/>
      <rect x="115" y="145" width="60" height="25" rx="4" fill="#238636" opacity="0.5"/>
      <text x="145" y="162" fill="#c9d1d9" font-size="8" text-anchor="middle" font-family="monospace">Analyze</text>
      <line x1="175" y1="157" x2="195" y2="157" stroke="#58a6ff" stroke-width="1" marker-end="url(#aa1)"/>
      <rect x="195" y="145" width="60" height="25" rx="4" fill="#8957e5" opacity="0.5"/>
      <text x="225" y="162" fill="#c9d1d9" font-size="8" text-anchor="middle" font-family="monospace">Write</text>
      <!-- Router -->
      <rect x="305" y="115" width="265" height="70" rx="6" fill="#161b22" stroke="#f85149"/>
      <text x="437" y="135" fill="#f85149" font-size="10" text-anchor="middle" font-family="monospace" font-weight="bold">Router</text>
      <rect x="340" y="145" width="50" height="25" rx="4" fill="#1f6feb" opacity="0.5"/>
      <text x="365" y="162" fill="#c9d1d9" font-size="7" text-anchor="middle" font-family="monospace">Code</text>
      <rect x="400" y="145" width="50" height="25" rx="4" fill="#238636" opacity="0.5"/>
      <text x="425" y="162" fill="#c9d1d9" font-size="7" text-anchor="middle" font-family="monospace">Search</text>
      <rect x="460" y="145" width="50" height="25" rx="4" fill="#f0883e" opacity="0.5"/>
      <text x="485" y="162" fill="#c9d1d9" font-size="7" text-anchor="middle" font-family="monospace">Math</text>
      <rect x="520" y="145" width="40" height="25" rx="4" fill="#8957e5" opacity="0.5"/>
      <text x="540" y="162" fill="#c9d1d9" font-size="7" text-anchor="middle" font-family="monospace">DB</text>
      <!-- Decision guide -->
      <rect x="20" y="205" width="550" height="80" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="225" fill="#58a6ff" font-size="10" font-family="monospace">Choosing Guide:</text>
      <text x="40" y="243" fill="#1f6feb" font-size="9" font-family="monospace">Simple tool use → ReAct</text>
      <text x="220" y="243" fill="#238636" font-size="9" font-family="monospace">Multi-step plan → Plan-Execute</text>
      <text x="420" y="243" fill="#8957e5" font-size="9" font-family="monospace">Quality → Reflection</text>
      <text x="40" y="263" fill="#f0883e" font-size="9" font-family="monospace">Multi-domain → Multi-Agent</text>
      <text x="220" y="263" fill="#f85149" font-size="9" font-family="monospace">Diverse requests → Router</text>
      <text x="420" y="263" fill="#8b949e" font-size="9" font-family="monospace">Cost: ReAct &lt; Reflect &lt; Multi</text>
    </svg>`,
    examples: [
      {
        title: "Reflection pattern — generate, critique, and revise",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0.7)
parser = StrOutputParser()

# ── Generator ──
generate_prompt = ChatPromptTemplate.from_messages([
    ("system", "You write concise, clear technical documentation."),
    ("human", "Write documentation for: {topic}")
])
generate_chain = generate_prompt | llm | parser

# ── Critic ──
critique_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a documentation reviewer. Critique the following doc.
List specific issues: missing info, unclear language, factual errors.
If the doc is good, say 'APPROVED: no issues found.'"""),
    ("human", "Review this documentation:\\n\\n{draft}")
])
critique_chain = critique_prompt | llm | parser

# ── Reviser ──
revise_prompt = ChatPromptTemplate.from_messages([
    ("system", "Revise the documentation based on the critique. Keep it concise."),
    ("human", "Critique:\\n{critique}\\n\\nOriginal draft:\\n{draft}\\n\\nRevised version:")
])
revise_chain = revise_prompt | llm | parser

# ── Reflection loop ──
def reflect_and_improve(topic, max_rounds=3):
    print(f"Generating documentation for: {topic}")
    draft = generate_chain.invoke({"topic": topic})
    print(f"\\n--- Draft ---\\n{draft[:200]}...")

    for i in range(max_rounds):
        critique = critique_chain.invoke({"draft": draft})
        print(f"\\n--- Critique {i+1} ---\\n{critique[:200]}...")

        if "APPROVED" in critique.upper():
            print(f"\\nApproved after {i+1} review(s)!")
            return draft

        draft = revise_chain.invoke({"critique": critique, "draft": draft})
        print(f"\\n--- Revision {i+1} ---\\n{draft[:200]}...")

    print(f"\\nMax rounds reached. Returning best version.")
    return draft

result = reflect_and_improve("Python asyncio.gather() function")
print(f"\\n=== FINAL ===\\n{result}")`,
        expectedOutput: `Generating documentation for: Python asyncio.gather() function

--- Draft ---
## asyncio.gather(*awaitables, return_exceptions=False)

Runs multiple awaitable objects concurrently. Returns a list of results in the same order as the input...

--- Critique 1 ---
Issues found:
1. Missing: what happens when one task fails and return_exceptions=False
2. Missing: comparison with asyncio.TaskGroup (Python 3.11+)
3. Could use a concrete example with error handling...

--- Revision 1 ---
## asyncio.gather(*awaitables, return_exceptions=False)

Runs multiple awaitable objects concurrently and returns results in input order...

--- Critique 2 ---
APPROVED: no issues found. The documentation covers usage, error handling, and alternatives clearly.

Approved after 2 review(s)!

=== FINAL ===
## asyncio.gather(*awaitables, return_exceptions=False)
...comprehensive docs with examples, error handling, and TaskGroup comparison...`
      }
    ],
    quiz: [
      { question: "When should you use Plan-and-Execute instead of ReAct?", options: ["Always — it's strictly better", "When the task requires multiple steps that benefit from upfront planning", "When you only have one tool", "When cost is the top priority"], answer: 1, explanation: "Plan-and-Execute is better when the task has many steps that benefit from being planned upfront (research projects, data analysis). ReAct is better for simpler tasks where step-by-step is sufficient." },
      { question: "What is the Reflection pattern best for?", options: ["Speed-critical applications", "Tasks where output quality improves with iterative critique and revision", "Simple lookups", "Real-time chat"], answer: 1, explanation: "Reflection shines when quality matters more than speed — writing, code generation, analysis. The generate-critique-revise loop systematically improves output at the cost of more LLM calls." },
      { question: "What is the main challenge of multi-agent systems?", options: ["They require multiple API keys", "Highest complexity — hardest to debug, coordinate, and maintain", "They can only use one model", "They're always slower than single agents"], answer: 1, explanation: "Multi-agent systems are the most complex architecture. Debugging requires tracing across multiple agents, coordination can fail, and the blast radius of errors is larger." },
      { question: "What does a Router agent do?", options: ["Routes network traffic", "Dispatches user requests to the most appropriate specialized sub-agent", "Creates routes in a web framework", "Manages database connections"], answer: 1, explanation: "A Router agent classifies the incoming request and delegates it to the right specialized agent. Like a help desk that triages tickets to the right department." }
    ],
    commonMistakes: [
      { mistake: "Using multi-agent when a single ReAct agent would suffice", fix: "Start with the simplest architecture that works. ReAct handles most tasks. Only upgrade when you hit clear limitations." },
      { mistake: "Reflection loops without a termination condition", fix: "Always set max iterations AND check for 'APPROVED' (or similar) in the critique to break early. Otherwise the agent loops forever." },
      { mistake: "Plan-and-Execute with no plan updates", fix: "Plans can become stale as new information appears. Allow the agent to revise the plan mid-execution when earlier steps reveal new information." },
      { mistake: "Multi-agent systems without clear agent boundaries", fix: "Each agent should have a clear role, distinct tools, and a focused system prompt. Overlapping responsibilities cause confusion." }
    ],
    cheatSheet: `# Agent Architectures Cheat Sheet

## ReAct (simple)
Think → Act → Observe → Loop → Answer
Best: 1-3 tool calls, Q&A

## Plan-and-Execute (structured)
Plan → Execute steps → Answer
Best: multi-step research, analysis

## Reflection (quality)
Generate → Critique → Revise → Loop
Best: writing, code gen, quality-critical

## Multi-Agent (team)
Agent1 → Agent2 → Agent3
Best: multi-domain, complex workflows

## Router (triage)
Query → Classify → Route to specialist
Best: diverse requests, customer support

## Decision Guide
Simple? → ReAct
Many steps? → Plan-Execute
Quality matters? → Reflection
Multi-domain? → Multi-Agent/Router`,
    furtherReading: [
      { title: "LangGraph Multi-Agent Patterns", url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/" },
      { title: "Anthropic Agent Patterns", url: "https://docs.anthropic.com/en/docs/build-with-claude/agentic" },
      { title: "Reflexion Paper", url: "https://arxiv.org/abs/2303.11366" }
    ],
    flashcards: [
      { front: "Name the 5 agent architectures and when to use each", back: "1) ReAct: simple tool use. 2) Plan-Execute: complex multi-step tasks. 3) Reflection: quality-critical output. 4) Multi-Agent: multi-domain teams. 5) Router: diverse request triage." },
      { front: "What is the Reflection pattern?", back: "Generate output → Critique it (list specific issues) → Revise based on critique → Repeat until approved or max rounds. Best for writing and code generation where quality improves with iteration." },
      { front: "Why start with the simplest architecture?", back: "Simpler = cheaper, faster, easier to debug. ReAct handles most tasks. Only upgrade to Plan-Execute, Reflection, or Multi-Agent when you hit clear limitations that simpler patterns can't solve." },
      { front: "How does a Router agent work?", back: "It classifies the incoming request and routes it to a specialized sub-agent. Like a help desk: 'billing question → billing agent, technical issue → tech agent, general → FAQ agent'." }
    ]
  },

  // ─── 4. LangGraph Workflows ─────────────────────────────────────────────
  {
    id: "langgraph-workflows",
    category: "AI Agents",
    title: "LangGraph Workflows",
    priority: "High",
    icon: "📊",
    estimatedMinutes: 50,
    prerequisites: ["agent-architectures", "langchain-chains"],
    nextTopics: ["multi-agent-systems", "mcp-protocol"],
    whyItMatters: "LangGraph is the production-grade framework for building stateful, multi-step AI workflows. While LangChain chains are linear pipelines, LangGraph lets you build graphs with loops, conditionals, parallel branches, and human-in-the-loop checkpoints. It's what powers production agent systems at scale — think of it as the state machine for AI.",
    analogy: "If LangChain chains are like a conveyor belt (items flow in one direction), LangGraph is like a factory floor with multiple stations, routing decisions, quality checkpoints, and the ability to go back to a previous station. You design the flow as a graph: nodes do work, edges decide what happens next.",
    content: `## LangGraph Workflows

### Why LangGraph?
LangChain LCEL chains are great for linear pipelines: \`A | B | C\`. But real-world agent workflows need:
- **Loops** — retry, refine, iterate
- **Conditionals** — route based on results
- **State** — accumulate information across steps
- **Checkpoints** — save/resume, human approval
- **Parallelism** — run branches concurrently

LangGraph provides all of these as a graph abstraction.

### Core Concepts

\`\`\`python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated
from operator import add

# 1. Define State — shared data that flows through the graph
class AgentState(TypedDict):
    messages: Annotated[list, add]    # append messages
    plan: str                          # current plan
    step: int                          # current step number
    results: Annotated[list, add]     # accumulated results

# 2. Define Nodes — functions that process state
def planner(state: AgentState) -> dict:
    # Create a plan based on the user's request
    plan = llm.invoke(f"Create a plan for: {state['messages'][-1]}")
    return {"plan": plan.content, "step": 0}

def executor(state: AgentState) -> dict:
    # Execute the current step
    result = llm.invoke(f"Execute step {state['step']}: {state['plan']}")
    return {"results": [result.content], "step": state["step"] + 1}

def evaluator(state: AgentState) -> str:
    # Decide: continue or finish
    if state["step"] >= 3:
        return "done"
    return "continue"

# 3. Build the Graph
graph = StateGraph(AgentState)
graph.add_node("planner", planner)
graph.add_node("executor", executor)

graph.add_edge(START, "planner")
graph.add_edge("planner", "executor")
graph.add_conditional_edges("executor", evaluator, {
    "continue": "executor",  # loop back
    "done": END,             # finish
})

app = graph.compile()
\`\`\`

### State Management

\`\`\`python
# Annotated[list, add] means: append new values to existing list
class State(TypedDict):
    messages: Annotated[list, add]  # each node adds messages

# Node returns ONLY the updates, not the full state
def my_node(state):
    return {"messages": [new_message]}  # appended to state["messages"]
\`\`\`

### Conditional Edges — Routing

\`\`\`python
def route(state) -> str:
    last_message = state["messages"][-1]
    if "tool_calls" in last_message:
        return "tools"     # go to tools node
    return "end"           # go to END

graph.add_conditional_edges("agent", route, {
    "tools": "tool_executor",
    "end": END,
})
\`\`\`

### Human-in-the-Loop with Checkpoints

\`\`\`python
from langgraph.checkpoint.memory import MemorySaver

# Compile with checkpointer
memory = MemorySaver()
app = graph.compile(checkpointer=memory, interrupt_before=["send_email"])

# Run until interrupt
config = {"configurable": {"thread_id": "user-1"}}
result = app.invoke(initial_state, config=config)
# → Pauses before send_email node

# Human reviews and approves
print("Agent wants to send:", result["draft_email"])
# input("Approve? (y/n)")

# Resume execution
result = app.invoke(None, config=config)  # continues from checkpoint
\`\`\`

### Prebuilt Agents

\`\`\`python
from langgraph.prebuilt import create_react_agent

# create_react_agent is a LangGraph graph under the hood
agent = create_react_agent(llm, tools, checkpointer=memory)

# It builds: agent_node → should_continue? → tool_node → agent_node → ...
\`\`\`

### Key Patterns

| Pattern | Implementation |
|---------|---------------|
| **Loop** | Conditional edge pointing back to earlier node |
| **Branch** | Conditional edges to different nodes |
| **Parallel** | Multiple outgoing edges from one node |
| **Checkpoint** | \`interrupt_before\` / \`interrupt_after\` |
| **Subgraph** | Graph as a node in another graph |
| **Retry** | Error handling node that loops back |
`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="300" fill="#0d1117" rx="8"/>
      <text x="300" y="25" fill="#58a6ff" font-size="14" text-anchor="middle" font-family="monospace" font-weight="bold">LangGraph Workflow</text>
      <defs><marker id="lg1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#58a6ff"/></marker><marker id="lg2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#238636"/></marker></defs>
      <!-- START -->
      <circle cx="50" cy="80" r="18" fill="#238636" opacity="0.9"/>
      <text x="50" y="84" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">START</text>
      <line x1="68" y1="80" x2="110" y2="80" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#lg1)"/>
      <!-- Planner -->
      <rect x="110" y="60" width="100" height="40" rx="6" fill="#1f6feb" opacity="0.9"/>
      <text x="160" y="84" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Planner</text>
      <line x1="210" y1="80" x2="250" y2="80" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#lg1)"/>
      <!-- Executor -->
      <rect x="250" y="60" width="100" height="40" rx="6" fill="#8957e5" opacity="0.9"/>
      <text x="300" y="84" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Executor</text>
      <line x1="350" y1="80" x2="390" y2="80" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#lg1)"/>
      <!-- Evaluator diamond -->
      <polygon points="430,55 470,80 430,105 390,80" fill="#161b22" stroke="#f0883e" stroke-width="1.5"/>
      <text x="430" y="83" fill="#f0883e" font-size="9" text-anchor="middle" font-family="monospace">Done?</text>
      <!-- Loop back -->
      <path d="M430 105 L430 135 L300 135 L300 100" stroke="#f85149" stroke-width="1.5" fill="none" marker-end="url(#lg1)"/>
      <text x="365" y="150" fill="#f85149" font-size="9" text-anchor="middle" font-family="monospace">continue</text>
      <!-- To END -->
      <line x1="470" y1="80" x2="520" y2="80" stroke="#238636" stroke-width="1.5" marker-end="url(#lg2)"/>
      <text x="495" y="72" fill="#238636" font-size="9" text-anchor="middle" font-family="monospace">done</text>
      <circle cx="540" cy="80" r="18" fill="#f85149" opacity="0.9"/>
      <text x="540" y="84" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">END</text>
      <!-- State box -->
      <rect x="30" y="170" width="540" height="50" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="50" y="190" fill="#58a6ff" font-size="10" font-family="monospace">State (shared):</text>
      <text x="50" y="208" fill="#8b949e" font-size="9" font-family="monospace">{"messages": [...], "plan": "...", "step": 2, "results": [...]}</text>
      <!-- Checkpoint -->
      <rect x="30" y="235" width="540" height="45" rx="6" fill="#161b22" stroke="#f0883e" stroke-dasharray="4,4"/>
      <text x="50" y="255" fill="#f0883e" font-size="10" font-family="monospace">Checkpoint:</text>
      <text x="145" y="255" fill="#8b949e" font-size="9" font-family="monospace">interrupt_before=["send_email"] → pause for human approval → resume</text>
    </svg>`,
    examples: [
      {
        title: "Custom LangGraph workflow with state, loops, and conditionals",
        code: `from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated
from operator import add
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)

# ── Define State ──
class ResearchState(TypedDict):
    topic: str
    queries: list[str]
    findings: Annotated[list, add]
    summary: str
    iteration: int

# ── Nodes ──
def generate_queries(state: ResearchState) -> dict:
    response = llm.invoke(
        f"Generate 3 specific search queries to research: {state['topic']}. "
        f"Return them as a numbered list."
    )
    queries = [line.strip() for line in response.content.split("\\n") if line.strip() and line.strip()[0].isdigit()]
    return {"queries": queries, "iteration": 0}

def research_step(state: ResearchState) -> dict:
    query = state["queries"][state["iteration"]] if state["iteration"] < len(state["queries"]) else state["topic"]
    # Simulate research (in production, this would call a search tool)
    response = llm.invoke(f"Provide a key finding about: {query}. Be concise (2 sentences max).")
    return {"findings": [response.content], "iteration": state["iteration"] + 1}

def should_continue(state: ResearchState) -> str:
    if state["iteration"] >= len(state["queries"]):
        return "summarize"
    return "research"

def summarize(state: ResearchState) -> dict:
    findings_text = "\\n".join(f"- {f}" for f in state["findings"])
    response = llm.invoke(
        f"Summarize these research findings about '{state['topic']}':\\n{findings_text}\\n\\n"
        f"Write a concise 3-sentence summary."
    )
    return {"summary": response.content}

# ── Build Graph ──
graph = StateGraph(ResearchState)
graph.add_node("generate_queries", generate_queries)
graph.add_node("research", research_step)
graph.add_node("summarize", summarize)

graph.add_edge(START, "generate_queries")
graph.add_edge("generate_queries", "research")
graph.add_conditional_edges("research", should_continue, {
    "research": "research",
    "summarize": "summarize",
})
graph.add_edge("summarize", END)

app = graph.compile()

# ── Run ──
result = app.invoke({"topic": "Python asyncio best practices", "queries": [], "findings": [], "summary": "", "iteration": 0})
print(f"Topic: {result['topic']}")
print(f"Queries researched: {len(result['queries'])}")
print(f"Findings collected: {len(result['findings'])}")
print(f"\\nSummary:\\n{result['summary']}")`,
        expectedOutput: `Topic: Python asyncio best practices
Queries researched: 3
Findings collected: 3

Summary:
Python asyncio best practices center on three key areas: using asyncio.gather() for concurrent I/O operations instead of sequential awaits, avoiding blocking calls in async code by using asyncio.to_thread() for CPU-bound work, and properly managing resources with async context managers. Error handling should use asyncio.TaskGroup (Python 3.11+) for structured concurrency, which ensures all tasks are properly cleaned up on failure. For production systems, always set timeouts with asyncio.wait_for() and use asyncio.run() as the single entry point rather than managing the event loop manually.`
      }
    ],
    quiz: [
      { question: "What does `Annotated[list, add]` mean in LangGraph state?", options: ["Creates an immutable list", "Each node's return value is appended to the existing list instead of replacing it", "Adds type checking to the list", "Creates a sorted list"], answer: 1, explanation: "Annotated[list, add] uses the `add` operator as a reducer — when a node returns {'messages': [new_msg]}, it's appended to the existing messages list rather than replacing it." },
      { question: "What is `interrupt_before` in LangGraph?", options: ["Cancels the workflow", "Pauses execution before a named node, allowing human review before continuing", "Interrupts the Python process", "Skips the specified node"], answer: 1, explanation: "interrupt_before pauses the graph before reaching the named node. The state is checkpointed, a human can review it, and execution resumes from that point with app.invoke(None, config)." },
      { question: "How do conditional edges work?", options: ["They randomly select a path", "A function examines the state and returns a string key that maps to the next node", "They check Python if/else statements", "They branch on boolean values only"], answer: 1, explanation: "A routing function receives the current state, returns a string key, and that key maps to the next node via a dictionary: {'continue': 'executor', 'done': END}." },
      { question: "Why use LangGraph over plain LCEL chains?", options: ["LCEL is deprecated", "LangGraph supports loops, conditionals, state, and checkpoints that LCEL can't do", "LangGraph is faster", "LCEL doesn't support streaming"], answer: 1, explanation: "LCEL chains are linear (A | B | C). LangGraph adds loops (go back to earlier nodes), conditionals (route based on state), persistent state, and checkpoints for human-in-the-loop." }
    ],
    commonMistakes: [
      { mistake: "Returning the full state from nodes instead of just updates", fix: "Nodes should return only the fields they're updating: `return {'findings': [new_finding]}`, not the entire state dict." },
      { mistake: "Forgetting to set a reducer for list fields", fix: "Without `Annotated[list, add]`, returning a list replaces the previous value. Use the annotation to accumulate values across iterations." },
      { mistake: "No termination condition on loops", fix: "Always add a conditional edge that can route to END. Without it, the graph loops forever. Use iteration counters or quality checks." },
      { mistake: "Not using checkpoints for long-running workflows", fix: "Use `MemorySaver()` (or PostgresSaver for production) so workflows can be paused, resumed, and recovered from failures." }
    ],
    cheatSheet: `# LangGraph Cheat Sheet

## State Definition
class MyState(TypedDict):
    messages: Annotated[list, add]  # append reducer
    count: int                       # replace reducer (default)

## Build Graph
graph = StateGraph(MyState)
graph.add_node("name", my_function)
graph.add_edge(START, "name")
graph.add_edge("name", END)

## Conditional Routing
def router(state) -> str:
    return "next_node_name"
graph.add_conditional_edges("node", router, {"a": "node_a", "b": END})

## Compile & Run
app = graph.compile()
result = app.invoke(initial_state)

## With Checkpoints
app = graph.compile(checkpointer=MemorySaver(), interrupt_before=["risky_node"])
result = app.invoke(state, {"configurable": {"thread_id": "1"}})
# Resume: app.invoke(None, config)

## Node Return (only updates)
def my_node(state):
    return {"messages": [new_msg]}  # only changed fields`,
    furtherReading: [
      { title: "LangGraph Documentation", url: "https://langchain-ai.github.io/langgraph/" },
      { title: "LangGraph Tutorials", url: "https://langchain-ai.github.io/langgraph/tutorials/" },
      { title: "LangGraph Checkpoints", url: "https://langchain-ai.github.io/langgraph/concepts/persistence/" }
    ],
    flashcards: [
      { front: "What is LangGraph?", back: "A framework for building stateful, multi-step AI workflows as graphs. Nodes = processing steps, edges = transitions, state = shared data. Supports loops, conditionals, checkpoints, and human-in-the-loop." },
      { front: "What does `Annotated[list, add]` do?", back: "It's a reducer: when a node returns `{'messages': [new_msg]}`, the new message is appended to the existing list instead of replacing it. Essential for accumulating data across iterations." },
      { front: "How does human-in-the-loop work in LangGraph?", back: "`graph.compile(interrupt_before=['risky_node'])` pauses before that node. Human reviews the state, then `app.invoke(None, config)` resumes from the checkpoint." },
      { front: "LangGraph vs LCEL chains?", back: "LCEL: linear pipelines (A | B | C). LangGraph: graphs with loops, conditionals, state, checkpoints. Use LCEL for simple chains, LangGraph for complex workflows." }
    ]
  },

  // ─── 5. Multi-Agent Systems ─────────────────────────────────────────────
  {
    id: "multi-agent-systems",
    category: "AI Agents",
    title: "Multi-Agent Systems",
    priority: "Medium",
    icon: "👥",
    estimatedMinutes: 45,
    prerequisites: ["langgraph-workflows", "agent-architectures"],
    nextTopics: ["mcp-protocol", "agent-evaluation"],
    whyItMatters: "Complex real-world problems often require multiple types of expertise. Multi-agent systems let you assign specialized roles — researcher, coder, reviewer, planner — each with their own tools and focus. This mirrors how effective teams work: specialists collaborate rather than one generalist doing everything. Companies like OpenAI, Google, and Anthropic are investing heavily in multi-agent architectures.",
    analogy: "A multi-agent system is like a startup team. You have a researcher who gathers information, an engineer who builds things, a designer who creates the interface, and a project manager who coordinates. Each person has their specialty and tools. They pass work between them, review each other's output, and produce better results than any one person alone.",
    content: `## Multi-Agent Systems

### Why Multiple Agents?
Single agents struggle with:
- **Complex tasks** spanning multiple domains
- **Quality control** — who checks the agent's work?
- **Tool overload** — too many tools confuse one agent
- **Specialization** — different tasks need different prompts and personalities

### Multi-Agent Patterns

#### 1. Sequential Pipeline
Agents process in order, each refining the previous output.

\`\`\`
Researcher → Analyst → Writer → Editor → Final Report
\`\`\`

#### 2. Supervisor Pattern
A supervisor agent delegates tasks and aggregates results.

\`\`\`
         ┌─────────────┐
         │  Supervisor  │
         └──────┬───────┘
        ┌───────┼───────┐
        ▼       ▼       ▼
    Research  Coding  Review
\`\`\`

#### 3. Debate / Adversarial
Two agents argue opposing views, a judge decides.

\`\`\`
Proposer → Critic → Judge → Final Answer
\`\`\`

#### 4. Swarm
Agents are peers, dynamically handing off to each other.

\`\`\`
Agent A ↔ Agent B ↔ Agent C
(each can hand off to any other)
\`\`\`

### Implementation with LangGraph

\`\`\`python
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.prebuilt import create_react_agent

# ── Specialized Agents ──
researcher = create_react_agent(
    llm,
    [search_web, search_papers],
    prompt="You are a research specialist. Find relevant information and cite sources."
)

coder = create_react_agent(
    llm,
    [execute_python, read_file, write_file],
    prompt="You are a Python developer. Write clean, tested code."
)

reviewer = create_react_agent(
    llm,
    [run_tests, lint_code],
    prompt="You are a code reviewer. Check for bugs, style issues, and missing tests."
)

# ── Router/Supervisor ──
def supervisor(state: MessagesState) -> str:
    last = state["messages"][-1].content.lower()
    if "research" in last or "find" in last:
        return "researcher"
    elif "code" in last or "implement" in last:
        return "coder"
    elif "review" in last or "check" in last:
        return "reviewer"
    return "done"

# ── Build Graph ──
graph = StateGraph(MessagesState)
graph.add_node("researcher", researcher)
graph.add_node("coder", coder)
graph.add_node("reviewer", reviewer)

graph.add_conditional_edges(START, supervisor, {
    "researcher": "researcher",
    "coder": "coder",
    "reviewer": "reviewer",
    "done": END,
})
# After each agent, go back to supervisor for next routing decision
graph.add_edge("researcher", "coder")  # research first, then code
graph.add_edge("coder", "reviewer")    # code, then review
graph.add_edge("reviewer", END)
\`\`\`

### Agent Communication

\`\`\`python
# Agents communicate through shared state (messages)
# Each agent reads previous messages and adds its own

# Researcher adds: "I found that asyncio.gather() runs coroutines concurrently..."
# Coder reads that and adds: "Here's the implementation based on the research..."
# Reviewer reads both and adds: "Code review: 2 issues found..."
\`\`\`

### Key Design Principles

1. **Clear role separation** — Each agent has a focused system prompt and relevant tools only
2. **Shared state** — Agents communicate via a shared message history
3. **Supervisor logic** — One agent or function coordinates the workflow
4. **Exit conditions** — Always have a way to terminate (max turns, explicit done signal)
5. **Error boundaries** — One agent's failure shouldn't crash the whole system

### When to Use Multi-Agent

| Scenario | Pattern |
|----------|---------|
| Research → Write | Sequential pipeline |
| Task delegation | Supervisor |
| Quality improvement | Debate / Review |
| Customer support triage | Router + specialists |
| Code generation + review | Sequential + Reflection |
`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="300" fill="#0d1117" rx="8"/>
      <text x="300" y="25" fill="#58a6ff" font-size="14" text-anchor="middle" font-family="monospace" font-weight="bold">Multi-Agent Supervisor Pattern</text>
      <defs><marker id="ma1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#58a6ff"/></marker></defs>
      <!-- Supervisor -->
      <rect x="220" y="45" width="160" height="45" rx="8" fill="#f0883e" opacity="0.9"/>
      <text x="300" y="65" fill="#fff" font-size="12" text-anchor="middle" font-family="monospace">Supervisor</text>
      <text x="300" y="80" fill="#1c1c1c" font-size="8" text-anchor="middle" font-family="monospace">routes + coordinates</text>
      <!-- Arrows down -->
      <line x1="250" y1="90" x2="100" y2="130" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ma1)"/>
      <line x1="300" y1="90" x2="300" y2="130" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ma1)"/>
      <line x1="350" y1="90" x2="500" y2="130" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ma1)"/>
      <!-- Researcher -->
      <rect x="40" y="130" width="120" height="55" rx="6" fill="#1f6feb" opacity="0.9"/>
      <text x="100" y="152" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Researcher</text>
      <text x="100" y="170" fill="#c9d1d9" font-size="8" text-anchor="middle" font-family="monospace">search, papers</text>
      <!-- Coder -->
      <rect x="240" y="130" width="120" height="55" rx="6" fill="#238636" opacity="0.9"/>
      <text x="300" y="152" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Coder</text>
      <text x="300" y="170" fill="#c9d1d9" font-size="8" text-anchor="middle" font-family="monospace">python, files</text>
      <!-- Reviewer -->
      <rect x="440" y="130" width="120" height="55" rx="6" fill="#8957e5" opacity="0.9"/>
      <text x="500" y="152" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Reviewer</text>
      <text x="500" y="170" fill="#c9d1d9" font-size="8" text-anchor="middle" font-family="monospace">tests, lint</text>
      <!-- Sequential arrows -->
      <line x1="160" y1="157" x2="240" y2="157" stroke="#238636" stroke-width="1.5" marker-end="url(#ma1)"/>
      <line x1="360" y1="157" x2="440" y2="157" stroke="#238636" stroke-width="1.5" marker-end="url(#ma1)"/>
      <!-- Shared state -->
      <rect x="40" y="210" width="520" height="40" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="60" y="230" fill="#58a6ff" font-size="10" font-family="monospace">Shared State:</text>
      <text x="155" y="230" fill="#8b949e" font-size="9" font-family="monospace">messages[] — each agent reads previous + adds own output</text>
      <!-- Result -->
      <rect x="200" y="265" width="200" height="25" rx="4" fill="#238636" opacity="0.5"/>
      <text x="300" y="282" fill="#c9d1d9" font-size="10" text-anchor="middle" font-family="monospace">Final Output (combined)</text>
    </svg>`,
    examples: [
      {
        title: "Sequential multi-agent: Research → Code → Review",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, AIMessage

llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)

# ── Simulated multi-agent pipeline ──
def researcher_agent(topic):
    response = llm.invoke([
        {"role": "system", "content": "You are a research specialist. Provide key findings concisely."},
        {"role": "user", "content": f"Research best practices for: {topic}. List 3 key findings."}
    ])
    return response.content

def coder_agent(research_findings, task):
    response = llm.invoke([
        {"role": "system", "content": "You are a Python developer. Write clean, working code based on research."},
        {"role": "user", "content": f"Based on this research:\\n{research_findings}\\n\\nWrite code for: {task}"}
    ])
    return response.content

def reviewer_agent(code):
    response = llm.invoke([
        {"role": "system", "content": "You are a code reviewer. Check for bugs, missing error handling, and improvements. Be concise."},
        {"role": "user", "content": f"Review this code:\\n{code}"}
    ])
    return response.content

# ── Run pipeline ──
topic = "Python async HTTP requests"

print("=== RESEARCHER ===")
findings = researcher_agent(topic)
print(findings)

print("\\n=== CODER ===")
code = coder_agent(findings, "async function to fetch multiple URLs concurrently with error handling")
print(code)

print("\\n=== REVIEWER ===")
review = reviewer_agent(code)
print(review)`,
        expectedOutput: `=== RESEARCHER ===
Key findings for Python async HTTP requests:

1. **Use aiohttp or httpx**: aiohttp is the most popular async HTTP library. httpx supports both sync and async with the same API.
2. **Use asyncio.gather() for concurrency**: Gather multiple requests to run them simultaneously, with return_exceptions=True for resilience.
3. **Always use async context managers**: Properly manage client sessions with \`async with\` to avoid resource leaks.

=== CODER ===
\`\`\`python
import asyncio
import httpx

async def fetch_urls(urls: list[str], timeout: float = 10.0) -> list[dict]:
    async with httpx.AsyncClient(timeout=timeout) as client:
        tasks = [client.get(url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    return [
        {"url": url, "status": r.status_code, "size": len(r.content)}
        if not isinstance(r, Exception)
        else {"url": url, "error": str(r)}
        for url, r in zip(urls, results)
    ]
\`\`\`

=== REVIEWER ===
Code review — 2 suggestions:
1. **Good**: Uses async context manager, asyncio.gather with return_exceptions, and httpx
2. **Add**: Consider adding retry logic for transient failures (httpx has built-in transport retries)
3. **Add**: Type hints for return dict values (consider a dataclass or TypedDict instead of plain dict)`
      }
    ],
    quiz: [
      { question: "What is the Supervisor pattern in multi-agent systems?", options: ["An agent that monitors CPU usage", "A coordinating agent that delegates tasks to specialized agents and aggregates results", "An admin panel for agents", "A testing framework"], answer: 1, explanation: "The Supervisor pattern uses one agent to receive tasks, decide which specialist to delegate to, and combine their results. It's like a project manager routing work to team members." },
      { question: "How do agents communicate in a LangGraph multi-agent system?", options: ["Direct function calls", "Through shared state (typically a message list)", "HTTP requests", "File system"], answer: 1, explanation: "In LangGraph, agents communicate through shared state — typically a list of messages. Each agent reads previous messages and appends its own output." },
      { question: "What is the main risk of multi-agent systems?", options: ["They use too much RAM", "Complexity — harder to debug, coordinate, and maintain than single agents", "They can only use one LLM provider", "They don't support streaming"], answer: 1, explanation: "Multi-agent systems are the most complex architecture. Errors can cascade between agents, debugging requires tracing across multiple agents, and coordination logic adds maintenance burden." }
    ],
    commonMistakes: [
      { mistake: "Agents with overlapping responsibilities", fix: "Each agent should have a clear, non-overlapping role. If two agents both search the web, consolidate into one researcher agent." },
      { mistake: "No termination condition for multi-agent loops", fix: "Always set max rounds or explicit 'DONE' signals. Without them, agents can bounce tasks back and forth indefinitely." },
      { mistake: "Overcomplicating with multi-agent when a single agent suffices", fix: "Start with one ReAct agent. Only split into multiple agents when you have clear evidence that one agent can't handle the task (too many tools, conflicting roles)." }
    ],
    cheatSheet: `# Multi-Agent Cheat Sheet

## Patterns
Sequential: A → B → C (pipeline)
Supervisor: Boss → delegates → aggregates
Debate: Proposer → Critic → Judge
Router: Classify → route to specialist

## LangGraph Multi-Agent
graph = StateGraph(MessagesState)
graph.add_node("researcher", researcher_agent)
graph.add_node("coder", coder_agent)
graph.add_edge("researcher", "coder")

## Design Rules
- Clear, non-overlapping roles
- Shared message-based communication
- Always have exit conditions
- Start simple, add agents only when needed`,
    furtherReading: [
      { title: "LangGraph Multi-Agent", url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/" },
      { title: "Anthropic Multi-Agent Patterns", url: "https://docs.anthropic.com/en/docs/build-with-claude/agentic" }
    ],
    flashcards: [
      { front: "Name 4 multi-agent patterns", back: "1) Sequential Pipeline: agents in order (research → code → review). 2) Supervisor: coordinator delegates to specialists. 3) Debate: proposer vs critic, judge decides. 4) Swarm: peers hand off dynamically." },
      { front: "How do agents share information?", back: "Through shared state — typically a message list. Each agent reads the full conversation history and appends its contribution." },
      { front: "When should you NOT use multi-agent?", back: "When a single ReAct agent can handle the task. Multi-agent adds complexity, cost, and debugging difficulty. Only use it when one agent clearly can't handle the job (too many tools, conflicting roles)." }
    ]
  },

  // ─── 6. MCP Protocol ────────────────────────────────────────────────────
  {
    id: "mcp-protocol",
    category: "AI Agents",
    title: "Model Context Protocol (MCP)",
    priority: "High",
    icon: "🔌",
    estimatedMinutes: 40,
    prerequisites: ["tool-use-patterns", "ai-agents-fundamentals"],
    nextTopics: ["agent-evaluation", "mcp-server-building"],
    whyItMatters: "MCP (Model Context Protocol) is an open standard created by Anthropic that standardizes how AI models connect to external tools, data sources, and services. Think of it as the 'USB-C for AI' — instead of building custom integrations for every tool, MCP provides a universal protocol. It's becoming the industry standard adopted by major IDE providers, AI frameworks, and tool builders.",
    analogy: "Before USB, every device had its own connector. Your printer, camera, and phone all needed different cables. USB standardized this — one cable works with everything. MCP does the same for AI tools. Before MCP, every AI app had to build custom integrations for every tool. With MCP, any AI client can connect to any MCP server using the same protocol.",
    content: `## Model Context Protocol (MCP)

### What is MCP?
MCP is an **open protocol** that standardizes how AI applications connect to external data and tools. It follows a client-server architecture:

\`\`\`
┌──────────────────┐     MCP Protocol     ┌──────────────────┐
│   MCP Client     │ ←──────────────────→ │   MCP Server     │
│  (Claude, IDE,   │    JSON-RPC 2.0      │  (tools, data,   │
│   your app)      │    over stdio/SSE    │   services)      │
└──────────────────┘                      └──────────────────┘
\`\`\`

### Why MCP?

| Without MCP | With MCP |
|-------------|----------|
| Build N custom integrations for N tools | Build 1 MCP client, connect to N servers |
| Each tool has different auth, protocol | Universal protocol for all tools |
| Fragmented ecosystem | Shared ecosystem of servers |
| Every app re-implements tool calling | Tools are reusable across all clients |

### MCP Capabilities

1. **Tools** — Functions the server exposes (search, calculate, query DB)
2. **Resources** — Data the server provides (files, database records, API data)
3. **Prompts** — Pre-built prompt templates the server suggests

### Architecture

\`\`\`
Your App (Host)
  └── MCP Client
        ├── MCP Server 1 (GitHub: repos, PRs, issues)
        ├── MCP Server 2 (Database: query, write)
        ├── MCP Server 3 (Slack: send, read channels)
        └── MCP Server 4 (Custom: your business logic)
\`\`\`

### Building an MCP Server (Python)

\`\`\`python
from mcp.server.fastmcp import FastMCP

# Create server
mcp = FastMCP("my-tools")

# Expose a tool
@mcp.tool()
def search_docs(query: str) -> str:
    """Search documentation for relevant information."""
    # Your search logic here
    return f"Results for: {query}"

# Expose a resource
@mcp.resource("docs://{topic}")
def get_doc(topic: str) -> str:
    """Get documentation for a specific topic."""
    docs = {"python": "Python guide...", "docker": "Docker guide..."}
    return docs.get(topic, "Not found")

# Expose a prompt template
@mcp.prompt()
def code_review(code: str) -> str:
    """Generate a code review prompt."""
    return f"Review this code for bugs, style, and performance:\\n\\n{code}"

# Run the server
if __name__ == "__main__":
    mcp.run()
\`\`\`

### Transport Protocols

| Transport | Use Case | How |
|-----------|----------|-----|
| **stdio** | Local servers, CLI tools | stdin/stdout pipes |
| **SSE** | Remote servers, web apps | HTTP Server-Sent Events |

### Using MCP with Claude Desktop

\`\`\`json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "my-tools": {
      "command": "python",
      "args": ["/path/to/server.py"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_..." }
    }
  }
}
\`\`\`

### Popular MCP Servers

| Server | Tools Provided |
|--------|---------------|
| **GitHub** | Search repos, read files, create PRs, manage issues |
| **Filesystem** | Read/write files, list directories |
| **PostgreSQL** | Query database, list tables, describe schema |
| **Slack** | Send messages, read channels, search history |
| **Brave Search** | Web search with Brave |
| **Puppeteer** | Browser automation, screenshots |

### MCP vs Direct Tool Calling

| Feature | Direct Tool Call | MCP |
|---------|-----------------|-----|
| **Reusability** | Per-app | Any MCP client |
| **Discovery** | Hardcoded | Dynamic (list_tools) |
| **Auth** | Custom | Protocol-level |
| **Ecosystem** | Build everything | Community servers |
| **Standard** | Proprietary | Open protocol |
`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="300" fill="#0d1117" rx="8"/>
      <text x="300" y="25" fill="#58a6ff" font-size="14" text-anchor="middle" font-family="monospace" font-weight="bold">Model Context Protocol (MCP)</text>
      <defs><marker id="mp1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#58a6ff"/></marker></defs>
      <!-- Host App -->
      <rect x="20" y="45" width="160" height="100" rx="8" fill="#161b22" stroke="#58a6ff"/>
      <text x="100" y="67" fill="#58a6ff" font-size="11" text-anchor="middle" font-family="monospace" font-weight="bold">Host Application</text>
      <rect x="35" y="78" width="130" height="25" rx="4" fill="#1f6feb" opacity="0.7"/>
      <text x="100" y="95" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">MCP Client</text>
      <rect x="35" y="110" width="130" height="25" rx="4" fill="#238636" opacity="0.5"/>
      <text x="100" y="127" fill="#c9d1d9" font-size="9" text-anchor="middle" font-family="monospace">LLM (Claude)</text>
      <!-- Protocol arrows -->
      <line x1="180" y1="75" x2="260" y2="55" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#mp1)"/>
      <line x1="180" y1="95" x2="260" y2="115" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#mp1)"/>
      <line x1="180" y1="115" x2="260" y2="175" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#mp1)"/>
      <line x1="180" y1="135" x2="260" y2="235" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#mp1)"/>
      <!-- Servers -->
      <rect x="260" y="40" width="150" height="35" rx="6" fill="#238636" opacity="0.8"/>
      <text x="335" y="55" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">GitHub Server</text>
      <text x="335" y="68" fill="#c9d1d9" font-size="7" text-anchor="middle" font-family="monospace">repos, PRs, issues</text>
      <rect x="260" y="100" width="150" height="35" rx="6" fill="#8957e5" opacity="0.8"/>
      <text x="335" y="115" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Database Server</text>
      <text x="335" y="128" fill="#c9d1d9" font-size="7" text-anchor="middle" font-family="monospace">query, schema, write</text>
      <rect x="260" y="160" width="150" height="35" rx="6" fill="#f0883e" opacity="0.8"/>
      <text x="335" y="175" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Slack Server</text>
      <text x="335" y="188" fill="#c9d1d9" font-size="7" text-anchor="middle" font-family="monospace">messages, channels</text>
      <rect x="260" y="220" width="150" height="35" rx="6" fill="#f85149" opacity="0.8"/>
      <text x="335" y="235" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Custom Server</text>
      <text x="335" y="248" fill="#c9d1d9" font-size="7" text-anchor="middle" font-family="monospace">your business logic</text>
      <!-- External services -->
      <line x1="410" y1="57" x2="450" y2="57" stroke="#30363d" stroke-width="1" marker-end="url(#mp1)"/>
      <text x="500" y="61" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">GitHub API</text>
      <line x1="410" y1="117" x2="450" y2="117" stroke="#30363d" stroke-width="1" marker-end="url(#mp1)"/>
      <text x="500" y="121" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">PostgreSQL</text>
      <line x1="410" y1="177" x2="450" y2="177" stroke="#30363d" stroke-width="1" marker-end="url(#mp1)"/>
      <text x="500" y="181" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Slack API</text>
      <line x1="410" y1="237" x2="450" y2="237" stroke="#30363d" stroke-width="1" marker-end="url(#mp1)"/>
      <text x="500" y="241" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Your APIs</text>
      <!-- Protocol label -->
      <text x="220" y="280" fill="#58a6ff" font-size="9" text-anchor="middle" font-family="monospace">JSON-RPC 2.0 (stdio / SSE)</text>
    </svg>`,
    examples: [
      {
        title: "Building a simple MCP server with FastMCP",
        code: `from mcp.server.fastmcp import FastMCP

# ── Create MCP server ──
mcp = FastMCP("knowledge-base")

# ── Tools (actions the LLM can take) ──
@mcp.tool()
def search_knowledge(query: str) -> str:
    """Search the knowledge base for information about Python, Docker, or AI topics."""
    kb = {
        "python async": "Use asyncio for concurrent I/O. asyncio.gather() runs multiple coroutines. Use async with for resource management.",
        "docker compose": "docker-compose.yml defines multi-container apps. Use 'docker compose up -d' to start. Define services, networks, and volumes.",
        "rag pipeline": "RAG = Retrieve + Augment + Generate. Steps: chunk docs, embed, store in vector DB, retrieve top-K, generate with context.",
        "mcp protocol": "MCP standardizes AI-tool connections. Servers expose tools/resources. Clients discover and call them via JSON-RPC.",
    }
    results = []
    for key, val in kb.items():
        if any(word in key for word in query.lower().split()):
            results.append(f"[{key}]: {val}")
    return "\\n".join(results) if results else "No results found."

@mcp.tool()
def run_python(code: str) -> str:
    """Execute Python code and return the output. Use for calculations and demonstrations."""
    try:
        import io, contextlib
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            exec(code)
        return output.getvalue() or "Code executed successfully (no output)."
    except Exception as e:
        return f"Error: {e}"

# ── Resources (data the LLM can read) ──
@mcp.resource("kb://topics")
def list_topics() -> str:
    """List all available knowledge base topics."""
    return "Available topics: python async, docker compose, rag pipeline, mcp protocol"

@mcp.resource("kb://topic/{name}")
def get_topic(name: str) -> str:
    """Get detailed information about a specific topic."""
    topics = {
        "python-async": "# Python Async\\n\\nasyncio is Python's async framework...",
        "docker": "# Docker\\n\\nDocker containers share the host kernel...",
    }
    return topics.get(name, f"Topic '{name}' not found.")

# ── Prompts (reusable prompt templates) ──
@mcp.prompt()
def explain_concept(concept: str) -> str:
    """Generate a prompt for explaining a technical concept."""
    return f"""Explain {concept} to a junior developer. Include:
1. What it is (1 sentence)
2. Why it matters
3. A simple code example
4. Common mistakes to avoid"""

# ── Run ──
if __name__ == "__main__":
    print("Starting MCP server: knowledge-base")
    print("Tools: search_knowledge, run_python")
    print("Resources: kb://topics, kb://topic/{{name}}")
    print("Prompts: explain_concept")
    # mcp.run()  # Uncomment to actually start the server
    print("Server ready! Connect via Claude Desktop or any MCP client.")`,
        expectedOutput: `Starting MCP server: knowledge-base
Tools: search_knowledge, run_python
Resources: kb://topics, kb://topic/{name}
Prompts: explain_concept
Server ready! Connect via Claude Desktop or any MCP client.`
      }
    ],
    quiz: [
      { question: "What is MCP?", options: ["A machine learning model", "An open protocol standardizing how AI apps connect to external tools and data", "A Python package manager", "A type of neural network"], answer: 1, explanation: "MCP (Model Context Protocol) is an open standard by Anthropic that provides a universal way for AI applications to connect to external tools, data sources, and services — like USB-C for AI integrations." },
      { question: "What are the three MCP capabilities?", options: ["Read, Write, Execute", "Tools (actions), Resources (data), Prompts (templates)", "Input, Process, Output", "Connect, Query, Respond"], answer: 1, explanation: "MCP servers can expose: Tools (functions the LLM can call), Resources (data the LLM can read), and Prompts (pre-built prompt templates)." },
      { question: "What transport protocols does MCP support?", options: ["HTTP and WebSocket", "stdio (local) and SSE (remote)", "TCP and UDP", "gRPC and REST"], answer: 1, explanation: "MCP supports stdio (stdin/stdout pipes) for local servers and SSE (Server-Sent Events over HTTP) for remote servers." },
      { question: "What is the main advantage of MCP over direct tool calling?", options: ["It's faster", "One protocol works with any MCP client — tools are reusable across applications", "It uses less memory", "It supports more languages"], answer: 1, explanation: "MCP's key advantage is reusability: build an MCP server once, and any MCP-compatible client can use it. No need to rebuild integrations for each app." },
      { question: "How do you configure MCP servers for Claude Desktop?", options: ["pip install", "Edit claude_desktop_config.json with server commands and environment variables", "Use the Claude API", "Create a Docker container"], answer: 1, explanation: "Claude Desktop reads server configurations from claude_desktop_config.json, where you specify the command to run each server and any required environment variables." }
    ],
    commonMistakes: [
      { mistake: "Exposing dangerous tools without safety checks", fix: "Always validate inputs, restrict file system access, and add human-in-the-loop for write operations. MCP servers can be called by any client." },
      { mistake: "Returning massive data from resources", fix: "Keep resource responses concise. If the data is large, provide pagination or summary endpoints instead of dumping everything." },
      { mistake: "Not providing clear tool descriptions", fix: "The @mcp.tool() docstring is what the LLM reads. Make it specific: what it does, when to use it, what it returns." },
      { mistake: "Hardcoding secrets in MCP server code", fix: "Use environment variables for API keys and secrets. Pass them via the 'env' field in claude_desktop_config.json." }
    ],
    cheatSheet: `# MCP Cheat Sheet

## Create Server
from mcp.server.fastmcp import FastMCP
mcp = FastMCP("my-server")

## Tool
@mcp.tool()
def my_tool(param: str) -> str:
    """Description for the LLM."""
    return result

## Resource
@mcp.resource("prefix://{id}")
def get_data(id: str) -> str:
    """Provide data to the LLM."""
    return data

## Prompt Template
@mcp.prompt()
def my_prompt(input: str) -> str:
    """Reusable prompt template."""
    return f"Do X with {input}"

## Run
mcp.run()  # starts stdio server

## Claude Desktop Config
{
  "mcpServers": {
    "name": {
      "command": "python",
      "args": ["server.py"],
      "env": {"API_KEY": "..."}
    }
  }
}`,
    furtherReading: [
      { title: "MCP Official Docs", url: "https://modelcontextprotocol.io" },
      { title: "MCP GitHub Repository", url: "https://github.com/modelcontextprotocol" },
      { title: "Building MCP Servers", url: "https://modelcontextprotocol.io/quickstart/server" }
    ],
    flashcards: [
      { front: "What is MCP?", back: "Model Context Protocol — an open standard by Anthropic for connecting AI apps to external tools and data. Like USB-C for AI: one protocol, any client, any server." },
      { front: "What 3 things can MCP servers expose?", back: "1) Tools: functions the LLM can call. 2) Resources: data the LLM can read. 3) Prompts: reusable prompt templates." },
      { front: "MCP transports?", back: "stdio (local — stdin/stdout pipes) for CLI tools, SSE (remote — HTTP Server-Sent Events) for web services." },
      { front: "How to create an MCP server?", back: "`mcp = FastMCP('name')`, then use `@mcp.tool()`, `@mcp.resource()`, `@mcp.prompt()` decorators to expose capabilities. Run with `mcp.run()`." }
    ]
  },

  // ─── 7. MCP Server Building ─────────────────────────────────────────────
  {
    id: "mcp-server-building",
    category: "AI Agents",
    title: "Building MCP Servers",
    priority: "Medium",
    icon: "🏗️",
    estimatedMinutes: 45,
    prerequisites: ["mcp-protocol", "tool-use-patterns"],
    nextTopics: ["agent-evaluation"],
    whyItMatters: "Building MCP servers is the practical skill that lets you extend any AI assistant's capabilities. Whether you want Claude to query your company's database, interact with your internal APIs, or automate your specific workflows — you build an MCP server. This is one of the most in-demand skills in AI engineering because it bridges the gap between powerful AI models and the real-world systems they need to interact with.",
    analogy: "Building an MCP server is like building an API — but your consumer is an AI instead of a human developer. Just like REST API design requires thinking about endpoints, parameters, error handling, and documentation, MCP server design requires thinking about tools, input schemas, error messages, and descriptions that an LLM can understand.",
    content: `## Building MCP Servers

### Setup

\`\`\`bash
# Install the MCP SDK
pip install mcp

# Project structure
my-mcp-server/
  ├── server.py        # Main server code
  ├── requirements.txt
  └── README.md
\`\`\`

### Minimal Server

\`\`\`python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("my-server")

@mcp.tool()
def hello(name: str) -> str:
    """Say hello to someone."""
    return f"Hello, {name}!"

if __name__ == "__main__":
    mcp.run()
\`\`\`

### Tools — Functions for the LLM

\`\`\`python
from mcp.server.fastmcp import FastMCP
from pydantic import Field

mcp = FastMCP("data-tools")

@mcp.tool()
def query_database(
    sql: str = Field(description="SQL SELECT query to execute"),
    limit: int = Field(default=10, description="Max rows to return")
) -> str:
    """Execute a read-only SQL query against the analytics database.
    Only SELECT queries are allowed. Returns results as a formatted table."""
    if not sql.strip().upper().startswith("SELECT"):
        return "Error: Only SELECT queries are allowed."
    # Execute query...
    return formatted_results

@mcp.tool()
def create_chart(
    data: str = Field(description="CSV data or JSON array"),
    chart_type: str = Field(description="Type: bar, line, pie, scatter"),
    title: str = Field(description="Chart title")
) -> str:
    """Create a chart from data. Returns a URL to the generated chart image."""
    # Generate chart...
    return f"Chart created: https://charts.example.com/{chart_id}"
\`\`\`

### Resources — Data for the LLM

\`\`\`python
@mcp.resource("db://tables")
def list_tables() -> str:
    """List all tables in the analytics database with row counts."""
    return "users (50K rows), orders (200K rows), products (5K rows)"

@mcp.resource("db://schema/{table}")
def get_schema(table: str) -> str:
    """Get the schema (columns, types) for a specific table."""
    schemas = {
        "users": "id INT, name VARCHAR, email VARCHAR, created_at TIMESTAMP",
        "orders": "id INT, user_id INT, total DECIMAL, status VARCHAR, created_at TIMESTAMP",
    }
    return schemas.get(table, f"Table '{table}' not found.")
\`\`\`

### Error Handling

\`\`\`python
@mcp.tool()
def fetch_url(url: str) -> str:
    """Fetch content from a URL. Returns the page text content."""
    import httpx
    try:
        response = httpx.get(url, timeout=10, follow_redirects=True)
        response.raise_for_status()
        return response.text[:5000]  # Limit response size
    except httpx.TimeoutException:
        return f"Error: Request to {url} timed out after 10 seconds."
    except httpx.HTTPStatusError as e:
        return f"Error: HTTP {e.response.status_code} from {url}."
    except Exception as e:
        return f"Error fetching {url}: {str(e)}"
\`\`\`

### Testing MCP Servers

\`\`\`bash
# Test with MCP Inspector (official tool)
npx @modelcontextprotocol/inspector python server.py

# Test with Claude Desktop
# Add to claude_desktop_config.json and restart Claude
\`\`\`

\`\`\`python
# Unit test tools directly
def test_search():
    result = search_knowledge("python async")
    assert "asyncio" in result

# Integration test with MCP client
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def test_server():
    server_params = StdioServerParameters(command="python", args=["server.py"])
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            tools = await session.list_tools()
            assert len(tools.tools) > 0
            result = await session.call_tool("search_knowledge", {"query": "python"})
            assert "asyncio" in result.content[0].text
\`\`\`

### Production Considerations

| Concern | Solution |
|---------|----------|
| **Auth** | Use environment variables for API keys |
| **Rate limiting** | Add delays between API calls in tools |
| **Input validation** | Validate all inputs before processing |
| **Response size** | Truncate large responses (< 5KB recommended) |
| **Timeouts** | Set timeouts on all external calls |
| **Logging** | Log tool calls for debugging and auditing |
| **Security** | Never expose write operations without guardrails |
`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="300" fill="#0d1117" rx="8"/>
      <text x="300" y="25" fill="#58a6ff" font-size="14" text-anchor="middle" font-family="monospace" font-weight="bold">MCP Server Architecture</text>
      <defs><marker id="ms1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#58a6ff"/></marker></defs>
      <!-- Server box -->
      <rect x="30" y="40" width="250" height="230" rx="8" fill="#161b22" stroke="#58a6ff"/>
      <text x="155" y="62" fill="#58a6ff" font-size="12" text-anchor="middle" font-family="monospace" font-weight="bold">MCP Server</text>
      <!-- Tools section -->
      <rect x="45" y="75" width="220" height="55" rx="4" fill="#238636" opacity="0.2" stroke="#238636"/>
      <text x="60" y="92" fill="#238636" font-size="10" font-family="monospace">Tools</text>
      <text x="60" y="108" fill="#8b949e" font-size="8" font-family="monospace">search_docs(query)</text>
      <text x="60" y="120" fill="#8b949e" font-size="8" font-family="monospace">query_database(sql)</text>
      <!-- Resources section -->
      <rect x="45" y="140" width="220" height="45" rx="4" fill="#1f6feb" opacity="0.2" stroke="#1f6feb"/>
      <text x="60" y="157" fill="#1f6feb" font-size="10" font-family="monospace">Resources</text>
      <text x="60" y="173" fill="#8b949e" font-size="8" font-family="monospace">db://tables, db://schema/{t}</text>
      <!-- Prompts section -->
      <rect x="45" y="195" width="220" height="40" rx="4" fill="#8957e5" opacity="0.2" stroke="#8957e5"/>
      <text x="60" y="212" fill="#8957e5" font-size="10" font-family="monospace">Prompts</text>
      <text x="60" y="225" fill="#8b949e" font-size="8" font-family="monospace">explain_concept, review_code</text>
      <!-- Arrows to external -->
      <line x1="280" y1="100" x2="330" y2="100" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ms1)"/>
      <line x1="280" y1="160" x2="330" y2="160" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ms1)"/>
      <line x1="280" y1="215" x2="330" y2="215" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ms1)"/>
      <!-- External services -->
      <rect x="330" y="80" width="130" height="40" rx="4" fill="#161b22" stroke="#30363d"/>
      <text x="395" y="105" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">Vector DB</text>
      <rect x="330" y="140" width="130" height="40" rx="4" fill="#161b22" stroke="#30363d"/>
      <text x="395" y="165" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">PostgreSQL</text>
      <rect x="330" y="200" width="130" height="35" rx="4" fill="#161b22" stroke="#30363d"/>
      <text x="395" y="222" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">External APIs</text>
      <!-- Client connection -->
      <rect x="480" y="110" width="100" height="80" rx="6" fill="#f0883e" opacity="0.3" stroke="#f0883e"/>
      <text x="530" y="135" fill="#f0883e" font-size="10" text-anchor="middle" font-family="monospace">Clients</text>
      <text x="530" y="152" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Claude</text>
      <text x="530" y="165" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">VS Code</text>
      <text x="530" y="178" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Your App</text>
      <line x1="460" y1="150" x2="480" y2="150" stroke="#f0883e" stroke-width="1.5" marker-end="url(#ms1)"/>
    </svg>`,
    examples: [
      {
        title: "Complete MCP server with tools, resources, and error handling",
        code: `from mcp.server.fastmcp import FastMCP

# ── Create server ──
mcp = FastMCP("project-assistant")

# ── In-memory data (simulating a database) ──
PROJECTS = {
    "proj-1": {"name": "AI Chatbot", "status": "active", "team": ["Alice", "Bob"], "tasks": 12, "completed": 8},
    "proj-2": {"name": "Data Pipeline", "status": "active", "team": ["Charlie", "Diana"], "tasks": 20, "completed": 15},
    "proj-3": {"name": "Mobile App", "status": "paused", "team": ["Eve"], "tasks": 8, "completed": 2},
}

# ── Tools ──
@mcp.tool()
def get_project_status(project_id: str) -> str:
    """Get the current status of a project by its ID (e.g., proj-1).
    Returns: name, status, team members, and task progress."""
    project = PROJECTS.get(project_id)
    if not project:
        return f"Project '{project_id}' not found. Available: {', '.join(PROJECTS.keys())}"
    pct = round(project['completed'] / project['tasks'] * 100)
    return (f"Project: {project['name']}\\n"
            f"Status: {project['status']}\\n"
            f"Team: {', '.join(project['team'])}\\n"
            f"Progress: {project['completed']}/{project['tasks']} tasks ({pct}%)")

@mcp.tool()
def search_projects(query: str) -> str:
    """Search projects by name or status. Returns matching projects summary."""
    matches = []
    for pid, p in PROJECTS.items():
        if query.lower() in p['name'].lower() or query.lower() in p['status'].lower():
            pct = round(p['completed'] / p['tasks'] * 100)
            matches.append(f"- {pid}: {p['name']} [{p['status']}] ({pct}% done)")
    return "\\n".join(matches) if matches else f"No projects matching '{query}'."

@mcp.tool()
def calculate_metrics() -> str:
    """Calculate overall project portfolio metrics. Use for dashboard summaries."""
    total_tasks = sum(p['tasks'] for p in PROJECTS.values())
    completed = sum(p['completed'] for p in PROJECTS.values())
    active = sum(1 for p in PROJECTS.values() if p['status'] == 'active')
    return (f"Portfolio: {len(PROJECTS)} projects ({active} active)\\n"
            f"Tasks: {completed}/{total_tasks} completed ({round(completed/total_tasks*100)}%)\\n"
            f"Team size: {len(set(m for p in PROJECTS.values() for m in p['team']))}")

# ── Resources ──
@mcp.resource("projects://list")
def list_projects() -> str:
    """List all project IDs and names."""
    return "\\n".join(f"{pid}: {p['name']}" for pid, p in PROJECTS.items())

@mcp.resource("projects://{project_id}/team")
def get_team(project_id: str) -> str:
    """Get team members for a specific project."""
    project = PROJECTS.get(project_id)
    if not project:
        return f"Project '{project_id}' not found."
    return ", ".join(project['team'])

# ── Prompt ──
@mcp.prompt()
def weekly_report() -> str:
    """Generate a prompt for creating a weekly project status report."""
    return """Create a weekly status report covering:
1. Overall portfolio health
2. Each project's progress and blockers
3. Key risks and action items
Use the available tools to gather current data."""

# ── Test the tools directly ──
if __name__ == "__main__":
    print("=== Project Status ===")
    print(get_project_status("proj-1"))
    print()
    print("=== Search Active ===")
    print(search_projects("active"))
    print()
    print("=== Metrics ===")
    print(calculate_metrics())
    print()
    print("=== All Projects ===")
    print(list_projects())`,
        expectedOutput: `=== Project Status ===
Project: AI Chatbot
Status: active
Team: Alice, Bob
Progress: 8/12 tasks (67%)

=== Search Active ===
- proj-1: AI Chatbot [active] (67% done)
- proj-2: Data Pipeline [active] (75% done)

=== Metrics ===
Portfolio: 3 projects (2 active)
Tasks: 25/40 completed (62%)
Team size: 5

=== All Projects ===
proj-1: AI Chatbot
proj-2: Data Pipeline
proj-3: Mobile App`
      }
    ],
    quiz: [
      { question: "What Python package is used to build MCP servers?", options: ["flask", "mcp (with FastMCP)", "fastapi", "langchain"], answer: 1, explanation: "The official MCP Python SDK provides FastMCP for building servers: `from mcp.server.fastmcp import FastMCP`." },
      { question: "How should MCP tools handle errors?", options: ["Raise Python exceptions", "Return helpful error strings the LLM can understand", "Return None", "Log and ignore"], answer: 1, explanation: "Tools should catch exceptions and return clear error messages as strings. This lets the LLM understand what went wrong and try a different approach, rather than crashing." },
      { question: "What is the MCP Inspector used for?", options: ["Monitoring network traffic", "Testing MCP servers by calling their tools and viewing results interactively", "Inspecting Python code", "Checking for security vulnerabilities"], answer: 1, explanation: "The MCP Inspector (`npx @modelcontextprotocol/inspector`) lets you test your server interactively — list tools, call them with arguments, and see results." },
      { question: "What is the recommended max response size for MCP tool results?", options: ["1 KB", "Under 5 KB", "1 MB", "No limit"], answer: 1, explanation: "Keep tool responses under ~5KB. Large responses waste the LLM's context window and may cause issues. Truncate or paginate large datasets." }
    ],
    commonMistakes: [
      { mistake: "No input validation on tools", fix: "Always validate inputs: check SQL starts with SELECT, verify IDs exist, sanitize strings. MCP tools are called by AI, which can generate unexpected inputs." },
      { mistake: "Returning massive responses from tools", fix: "Truncate or paginate large results. Return summaries with an option to drill down. Keep responses under 5KB." },
      { mistake: "Hardcoding API keys in server code", fix: "Use environment variables: `os.environ['API_KEY']`. Pass them via the 'env' field in MCP client configuration." },
      { mistake: "No timeout on external API calls in tools", fix: "Always set timeouts: `httpx.get(url, timeout=10)`. Without them, a slow API can hang the entire server." }
    ],
    cheatSheet: `# Building MCP Servers Cheat Sheet

## Setup
pip install mcp

## Server Template
from mcp.server.fastmcp import FastMCP
mcp = FastMCP("name")

@mcp.tool()
def my_tool(param: str) -> str:
    """Description."""
    return result

@mcp.resource("prefix://{id}")
def my_resource(id: str) -> str:
    """Data provider."""
    return data

@mcp.prompt()
def my_prompt() -> str:
    """Template."""
    return "prompt text"

mcp.run()

## Testing
npx @modelcontextprotocol/inspector python server.py

## Production Checklist
- Input validation on all tools
- Timeouts on external calls
- Error handling returns strings
- Response size limits (< 5KB)
- Secrets in env vars
- Logging for debugging`,
    furtherReading: [
      { title: "MCP Server Quickstart", url: "https://modelcontextprotocol.io/quickstart/server" },
      { title: "FastMCP Documentation", url: "https://github.com/modelcontextprotocol/python-sdk" },
      { title: "MCP Inspector", url: "https://modelcontextprotocol.io/docs/tools/inspector" }
    ],
    flashcards: [
      { front: "What are the 3 things an MCP server can expose?", back: "@mcp.tool() — functions the LLM can call. @mcp.resource() — data the LLM can read. @mcp.prompt() — reusable prompt templates." },
      { front: "How to test an MCP server?", back: "1) Unit test tool functions directly. 2) Use MCP Inspector: `npx @modelcontextprotocol/inspector python server.py`. 3) Add to Claude Desktop config and test interactively." },
      { front: "MCP production checklist?", back: "Input validation, timeouts on external calls, error handling (return strings not exceptions), response size limits (<5KB), secrets in env vars, logging." }
    ]
  },

  // ─── 8. Agent Evaluation ────────────────────────────────────────────────
  {
    id: "agent-evaluation",
    category: "AI Agents",
    title: "Agent Evaluation & Testing",
    priority: "Medium",
    icon: "🧪",
    estimatedMinutes: 35,
    prerequisites: ["ai-agents-fundamentals", "tool-use-patterns"],
    nextTopics: [],
    whyItMatters: "You can't improve what you can't measure. Agent evaluation is how you know if your agent actually works — does it use the right tools, in the right order, with the right arguments? Does it give correct answers? Does it fail gracefully? Without systematic evaluation, you're guessing. With it, you can iterate with confidence, catch regressions, and compare approaches.",
    analogy: "Evaluating agents is like testing a new employee. You give them test scenarios (evaluation cases), check if they take the right actions (tool call correctness), verify their answers (output quality), measure how long they take (latency), and track how much they cost (token usage). A good evaluation suite is your quality assurance process.",
    content: `## Agent Evaluation & Testing

### What to Evaluate

| Dimension | What to Measure | Example |
|-----------|----------------|---------|
| **Correctness** | Is the final answer right? | Did it return the correct order status? |
| **Tool selection** | Did it pick the right tools? | Used search_docs, not calculate |
| **Tool arguments** | Were the arguments correct? | Passed "ORD-123" not "order 123" |
| **Efficiency** | How many steps did it take? | 2 tool calls vs 8 unnecessary calls |
| **Cost** | How many tokens were used? | 5K tokens vs 50K tokens |
| **Latency** | How long did it take? | 3 seconds vs 30 seconds |
| **Safety** | Did it avoid harmful actions? | Didn't delete data without approval |

### Evaluation Framework

\`\`\`python
import json
import time

class AgentEvaluator:
    def __init__(self, agent):
        self.agent = agent
        self.results = []

    def evaluate(self, test_cases: list[dict]) -> dict:
        for case in test_cases:
            start = time.time()
            result = self.agent.invoke({"messages": [("human", case["query"])]})
            elapsed = time.time() - start

            # Extract agent's answer
            answer = result["messages"][-1].content

            # Check correctness
            correct = case["expected_answer"].lower() in answer.lower()

            # Check tool usage
            tool_calls = [m for m in result["messages"] if hasattr(m, "tool_calls")]
            tools_used = [tc["name"] for m in tool_calls for tc in m.tool_calls]
            correct_tools = set(case.get("expected_tools", [])) == set(tools_used)

            self.results.append({
                "query": case["query"],
                "correct": correct,
                "correct_tools": correct_tools,
                "tools_used": tools_used,
                "steps": len(result["messages"]),
                "latency": elapsed,
            })

        # Summary
        n = len(self.results)
        return {
            "accuracy": sum(r["correct"] for r in self.results) / n,
            "tool_accuracy": sum(r["correct_tools"] for r in self.results) / n,
            "avg_steps": sum(r["steps"] for r in self.results) / n,
            "avg_latency": sum(r["latency"] for r in self.results) / n,
        }
\`\`\`

### Test Case Design

\`\`\`python
test_cases = [
    {
        "query": "What's the status of order ORD-123?",
        "expected_answer": "shipped",
        "expected_tools": ["lookup_order"],
        "category": "simple_lookup",
    },
    {
        "query": "If product X costs $50 and I buy 3 with 10% discount, what's the total?",
        "expected_answer": "135",
        "expected_tools": ["calculate"],
        "category": "calculation",
    },
    {
        "query": "What's the weather in Tokyo and the return policy?",
        "expected_answer": "weather.*return",  # regex for both
        "expected_tools": ["get_weather", "search_faq"],
        "category": "multi_tool",
    },
    {
        "query": "Delete all user data",
        "expected_answer": "cannot|not allowed|permission",  # should refuse
        "expected_tools": [],
        "category": "safety",
    },
]
\`\`\`

### LLM-as-Judge Evaluation

\`\`\`python
def llm_judge(query, agent_answer, reference_answer):
    """Use an LLM to evaluate another LLM's response."""
    judge_prompt = f"""Rate the following response on a scale of 1-5.

Question: {query}
Reference Answer: {reference_answer}
Agent's Answer: {agent_answer}

Criteria:
- Correctness: Does it answer the question accurately?
- Completeness: Does it include all necessary information?
- Conciseness: Is it appropriately brief?

Respond with ONLY a JSON: {{"score": N, "reason": "..."}}"""

    response = llm.invoke(judge_prompt)
    return json.loads(response.content)
\`\`\`

### Regression Testing

\`\`\`python
# Run after every agent change to catch regressions
def test_agent_regression():
    evaluator = AgentEvaluator(agent)
    results = evaluator.evaluate(test_cases)

    assert results["accuracy"] >= 0.9, f"Accuracy dropped: {results['accuracy']}"
    assert results["avg_steps"] <= 10, f"Too many steps: {results['avg_steps']}"
    assert results["avg_latency"] <= 15, f"Too slow: {results['avg_latency']}s"
\`\`\`

### Observability with LangSmith

\`\`\`python
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "ls__..."

# Every agent invocation is traced:
# - Full message history
# - Each tool call with arguments and results
# - Token usage per step
# - Latency breakdown
# - Success/failure status
\`\`\`

### Key Metrics for Production

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Task success rate** | > 90% | Correct final answer |
| **Tool accuracy** | > 95% | Right tools, right args |
| **Avg steps** | < 5 | Message count per task |
| **P95 latency** | < 10s | End-to-end time |
| **Cost per query** | < $0.05 | Token usage × pricing |
| **Safety violations** | 0 | Unauthorized actions |
`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="300" fill="#0d1117" rx="8"/>
      <text x="300" y="25" fill="#58a6ff" font-size="14" text-anchor="middle" font-family="monospace" font-weight="bold">Agent Evaluation Pipeline</text>
      <defs><marker id="ae1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#58a6ff"/></marker></defs>
      <!-- Test Cases -->
      <rect x="20" y="50" width="120" height="55" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="80" y="70" fill="#c9d1d9" font-size="10" text-anchor="middle" font-family="monospace">Test Cases</text>
      <text x="80" y="85" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">query + expected</text>
      <text x="80" y="97" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">answer + tools</text>
      <line x1="140" y1="77" x2="175" y2="77" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ae1)"/>
      <!-- Agent -->
      <rect x="175" y="50" width="100" height="55" rx="6" fill="#1f6feb" opacity="0.9"/>
      <text x="225" y="72" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Agent</text>
      <text x="225" y="88" fill="#c9d1d9" font-size="8" text-anchor="middle" font-family="monospace">under test</text>
      <line x1="275" y1="77" x2="310" y2="77" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ae1)"/>
      <!-- Evaluator -->
      <rect x="310" y="50" width="120" height="55" rx="6" fill="#238636" opacity="0.9"/>
      <text x="370" y="72" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Evaluator</text>
      <text x="370" y="88" fill="#c9d1d9" font-size="8" text-anchor="middle" font-family="monospace">compare results</text>
      <line x1="430" y1="77" x2="465" y2="77" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ae1)"/>
      <!-- Metrics -->
      <rect x="465" y="45" width="115" height="65" rx="6" fill="#161b22" stroke="#f0883e"/>
      <text x="522" y="65" fill="#f0883e" font-size="10" text-anchor="middle" font-family="monospace">Metrics</text>
      <text x="522" y="80" fill="#238636" font-size="8" text-anchor="middle" font-family="monospace">accuracy: 95%</text>
      <text x="522" y="92" fill="#238636" font-size="8" text-anchor="middle" font-family="monospace">latency: 2.3s</text>
      <text x="522" y="104" fill="#238636" font-size="8" text-anchor="middle" font-family="monospace">cost: $0.02</text>
      <!-- Dimensions row -->
      <rect x="20" y="130" width="560" height="75" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="150" fill="#58a6ff" font-size="10" font-family="monospace">Evaluation Dimensions:</text>
      <rect x="35" y="158" width="90" height="25" rx="4" fill="#238636" opacity="0.3"/>
      <text x="80" y="175" fill="#238636" font-size="8" text-anchor="middle" font-family="monospace">Correctness</text>
      <rect x="135" y="158" width="90" height="25" rx="4" fill="#1f6feb" opacity="0.3"/>
      <text x="180" y="175" fill="#1f6feb" font-size="8" text-anchor="middle" font-family="monospace">Tool Choice</text>
      <rect x="235" y="158" width="80" height="25" rx="4" fill="#8957e5" opacity="0.3"/>
      <text x="275" y="175" fill="#8957e5" font-size="8" text-anchor="middle" font-family="monospace">Efficiency</text>
      <rect x="325" y="158" width="70" height="25" rx="4" fill="#f0883e" opacity="0.3"/>
      <text x="360" y="175" fill="#f0883e" font-size="8" text-anchor="middle" font-family="monospace">Latency</text>
      <rect x="405" y="158" width="60" height="25" rx="4" fill="#f85149" opacity="0.3"/>
      <text x="435" y="175" fill="#f85149" font-size="8" text-anchor="middle" font-family="monospace">Cost</text>
      <rect x="475" y="158" width="65" height="25" rx="4" fill="#da3633" opacity="0.3"/>
      <text x="508" y="175" fill="#da3633" font-size="8" text-anchor="middle" font-family="monospace">Safety</text>
      <!-- LLM Judge -->
      <rect x="20" y="225" width="260" height="55" rx="6" fill="#161b22" stroke="#8957e5"/>
      <text x="150" y="245" fill="#8957e5" font-size="10" text-anchor="middle" font-family="monospace">LLM-as-Judge</text>
      <text x="150" y="265" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Use LLM to evaluate open-ended quality</text>
      <!-- Regression -->
      <rect x="300" y="225" width="280" height="55" rx="6" fill="#161b22" stroke="#f85149"/>
      <text x="440" y="245" fill="#f85149" font-size="10" text-anchor="middle" font-family="monospace">Regression Tests</text>
      <text x="440" y="265" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">assert accuracy >= 0.9 after every change</text>
    </svg>`,
    examples: [
      {
        title: "Agent evaluation framework with test cases",
        code: `import time

# ── Simulated agent for testing ──
class MockAgent:
    def invoke(self, input_dict):
        query = input_dict["messages"][0][1].lower()
        if "order" in query:
            return {"messages": [
                {"role": "human", "content": query},
                {"role": "assistant", "content": "Order ORD-123 is shipped, arriving March 15.",
                 "tool_calls": [{"name": "lookup_order", "args": {"order_id": "ORD-123"}}]}
            ]}
        elif "weather" in query:
            return {"messages": [
                {"role": "human", "content": query},
                {"role": "assistant", "content": "Tokyo: 22C, sunny.",
                 "tool_calls": [{"name": "get_weather", "args": {"city": "Tokyo"}}]}
            ]}
        return {"messages": [{"role": "human", "content": query},
                             {"role": "assistant", "content": "I don't have that information."}]}

# ── Test cases ──
test_cases = [
    {"query": "What's the status of order ORD-123?", "expected_answer": "shipped",
     "expected_tools": ["lookup_order"], "category": "lookup"},
    {"query": "What's the weather in Tokyo?", "expected_answer": "22",
     "expected_tools": ["get_weather"], "category": "lookup"},
    {"query": "Tell me a joke", "expected_answer": "don't have",
     "expected_tools": [], "category": "out_of_scope"},
]

# ── Evaluator ──
def evaluate_agent(agent, cases):
    results = []
    for case in cases:
        start = time.time()
        result = agent.invoke({"messages": [("human", case["query"])]})
        elapsed = time.time() - start

        answer = result["messages"][-1].get("content", "")
        correct = case["expected_answer"].lower() in answer.lower()

        tools_used = []
        for msg in result["messages"]:
            if isinstance(msg, dict) and "tool_calls" in msg:
                tools_used.extend([tc["name"] for tc in msg["tool_calls"]])

        results.append({
            "query": case["query"][:50],
            "correct": correct,
            "tools_match": set(tools_used) == set(case["expected_tools"]),
            "tools_used": tools_used,
            "latency_ms": round(elapsed * 1000, 1),
            "category": case["category"],
        })

    # Print results
    print("=" * 60)
    print("AGENT EVALUATION REPORT")
    print("=" * 60)
    for r in results:
        status = "PASS" if r["correct"] and r["tools_match"] else "FAIL"
        print(f"[{status}] {r['query']}")
        print(f"       Tools: {r['tools_used']} | Latency: {r['latency_ms']}ms")

    n = len(results)
    acc = sum(r["correct"] for r in results) / n * 100
    tool_acc = sum(r["tools_match"] for r in results) / n * 100
    avg_lat = sum(r["latency_ms"] for r in results) / n

    print(f"\\n{'='*60}")
    print(f"Accuracy:      {acc:.0f}% ({sum(r['correct'] for r in results)}/{n})")
    print(f"Tool Accuracy: {tool_acc:.0f}%")
    print(f"Avg Latency:   {avg_lat:.1f}ms")
    print(f"{'='*60}")

    return {"accuracy": acc, "tool_accuracy": tool_acc, "avg_latency": avg_lat}

# ── Run evaluation ──
agent = MockAgent()
metrics = evaluate_agent(agent, test_cases)`,
        expectedOutput: `============================================================
AGENT EVALUATION REPORT
============================================================
[PASS] What's the status of order ORD-123?
       Tools: ['lookup_order'] | Latency: 0.1ms
[PASS] What's the weather in Tokyo?
       Tools: ['get_weather'] | Latency: 0.1ms
[PASS] Tell me a joke
       Tools: [] | Latency: 0.1ms

============================================================
Accuracy:      100% (3/3)
Tool Accuracy: 100%
Avg Latency:   0.1ms
============================================================`
      }
    ],
    quiz: [
      { question: "What are the key dimensions of agent evaluation?", options: ["Just correctness", "Correctness, tool selection, efficiency, latency, cost, and safety", "Speed and accuracy only", "User satisfaction surveys"], answer: 1, explanation: "A comprehensive evaluation checks: Is the answer correct? Did it use the right tools? Was it efficient (few steps)? Was it fast? Was it cost-effective? Did it avoid unsafe actions?" },
      { question: "What is LLM-as-Judge?", options: ["An LLM trained for legal tasks", "Using an LLM to evaluate another LLM's responses by scoring quality", "A benchmark dataset", "A testing framework"], answer: 1, explanation: "LLM-as-Judge uses a (usually stronger) LLM to evaluate another LLM's output. It scores responses on criteria like correctness, completeness, and conciseness — useful when automated metrics aren't enough." },
      { question: "Why run regression tests after agent changes?", options: ["To make the agent faster", "To catch accuracy drops or behavioral changes introduced by modifications", "To save money", "To update documentation"], answer: 1, explanation: "Agent behavior is sensitive to prompt changes, tool modifications, and model updates. Regression tests catch unexpected degradation: assert accuracy >= 0.9 after every change." }
    ],
    commonMistakes: [
      { mistake: "No evaluation at all — just 'it seems to work'", fix: "Build a test suite from day one. Start with 10-20 diverse test cases. Run them after every change." },
      { mistake: "Only testing happy paths", fix: "Include edge cases, out-of-scope queries, adversarial inputs, and safety tests in your evaluation suite." },
      { mistake: "Not measuring cost alongside accuracy", fix: "Track tokens per query. A 95% accurate agent using 50K tokens is worse than a 93% accurate one using 5K tokens for most production use cases." },
      { mistake: "One-time evaluation instead of continuous", fix: "Integrate evaluation into CI/CD. Run regression tests on every PR that touches agent code, prompts, or tools." }
    ],
    cheatSheet: `# Agent Evaluation Cheat Sheet

## Test Case Structure
{"query": "...", "expected_answer": "...",
 "expected_tools": [...], "category": "..."}

## Key Metrics
- Accuracy: correct answers / total
- Tool accuracy: right tools chosen / total
- Avg steps: messages per query
- P95 latency: end-to-end time
- Cost per query: tokens × price

## LLM-as-Judge
judge_prompt = f"Rate response 1-5: {response} vs {reference}"

## Regression Test
assert accuracy >= 0.9
assert avg_steps <= 10
assert avg_latency <= 15.0

## Observability
LANGCHAIN_TRACING_V2=true
→ LangSmith traces all tool calls + latency`,
    furtherReading: [
      { title: "LangSmith Evaluation", url: "https://docs.smith.langchain.com/evaluation" },
      { title: "Evaluating LLM Applications", url: "https://www.anthropic.com/research/evaluating-ai-systems" }
    ],
    flashcards: [
      { front: "What 6 dimensions should you evaluate in an agent?", back: "1) Correctness (right answer). 2) Tool selection (right tools). 3) Tool arguments (right inputs). 4) Efficiency (few steps). 5) Cost (tokens used). 6) Safety (no harmful actions)." },
      { front: "What is LLM-as-Judge?", back: "Using an LLM to evaluate another LLM's responses. A judge LLM scores the response on criteria like correctness, completeness, and conciseness. Useful when automated metrics fall short." },
      { front: "Why regression test agents?", back: "Agent behavior is fragile — small prompt/tool changes can break things. Run test suites after every change: assert accuracy >= 0.9, avg_steps <= 10, latency <= 15s." }
    ]
  }
];
