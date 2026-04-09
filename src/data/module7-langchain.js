export const MODULE7_TOPICS = [
  // ─── 1. LangChain Basics ───────────────────────────────────────────────
  {
    id: "langchain-basics",
    category: "LangChain",
    title: "LangChain Basics",
    priority: "High",
    icon: "🔗",
    estimatedMinutes: 40,
    prerequisites: ["llm-api", "rag-fundamentals"],
    nextTopics: ["langchain-chains", "langchain-memory"],
    whyItMatters: "LangChain is the most popular framework for building LLM applications. It provides reusable abstractions for connecting LLMs to data sources, tools, and memory — patterns you'd otherwise have to build from scratch. Understanding LangChain means you can prototype AI apps in hours instead of days, and it gives you a shared vocabulary with the AI engineering community.",
    analogy: "LangChain is like Django for AI apps. Just as Django gives you ORM, views, and templates so you don't write raw SQL and HTTP parsing, LangChain gives you chains, retrievers, and prompt templates so you don't write raw API calls and context management. You can use it end-to-end or pick individual pieces.",
    content: `## LangChain Basics

### What is LangChain?
LangChain is a framework for developing applications powered by language models. Its core philosophy:

1. **Composability** — Build complex pipelines from simple, reusable components
2. **Data-aware** — Connect LLMs to external data sources
3. **Agentic** — Let LLMs decide which actions to take

### Core Architecture

\`\`\`
┌─────────────────────────────────────────────────┐
│              LangChain Ecosystem                │
├─────────────────────────────────────────────────┤
│  langchain-core    — Base abstractions (LCEL)   │
│  langchain         — Chains, agents, retrieval  │
│  langchain-community — 3rd party integrations   │
│  langgraph         — Stateful agent workflows   │
│  langserve         — Deploy chains as REST APIs │
│  langsmith         — Tracing & evaluation       │
└─────────────────────────────────────────────────┘
\`\`\`

### Installation

\`\`\`bash
pip install langchain langchain-anthropic langchain-openai langchain-community
\`\`\`

### Chat Models — The Foundation

\`\`\`python
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage

# Initialize a model
llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)

# Simple invocation
response = llm.invoke([
    SystemMessage(content="You are a helpful Python tutor."),
    HumanMessage(content="Explain list comprehensions in one sentence.")
])
print(response.content)
\`\`\`

### Prompt Templates

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate

# Template with variables
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert in {domain}. Answer concisely."),
    ("human", "{question}")
])

# Fill in variables — returns a list of messages
messages = prompt.invoke({"domain": "Python", "question": "What is a decorator?"})
response = llm.invoke(messages)
\`\`\`

### Output Parsers

\`\`\`python
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from pydantic import BaseModel, Field

# Simple string parser (extracts .content from AIMessage)
parser = StrOutputParser()
text = parser.invoke(response)  # str instead of AIMessage

# Structured output with Pydantic
class CodeReview(BaseModel):
    issues: list[str] = Field(description="List of issues found")
    score: int = Field(description="Quality score 1-10")
    suggestion: str = Field(description="Top improvement suggestion")

structured_llm = llm.with_structured_output(CodeReview)
review = structured_llm.invoke("Review this code: x = [i for i in range(100) if i%2==0]")
print(review.issues)  # typed access
\`\`\`

### LCEL — LangChain Expression Language

LCEL is the pipe (\`|\`) syntax for chaining components:

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Build a chain with pipe syntax
chain = prompt | llm | StrOutputParser()

# Invoke the whole chain
result = chain.invoke({"domain": "Docker", "question": "What is a multi-stage build?"})
print(result)  # just a string

# Chains support streaming, batching, and async out of the box
for chunk in chain.stream({"domain": "Python", "question": "What is GIL?"}):
    print(chunk, end="", flush=True)
\`\`\`

### Key Components Summary

| Component | Purpose | Example |
|-----------|---------|---------|
| **ChatModel** | LLM wrapper | \`ChatAnthropic\`, \`ChatOpenAI\` |
| **PromptTemplate** | Parameterized prompts | \`ChatPromptTemplate.from_messages()\` |
| **OutputParser** | Parse LLM output | \`StrOutputParser\`, \`JsonOutputParser\` |
| **LCEL chain** | Compose components | \`prompt \\| llm \\| parser\` |
| **Retriever** | Fetch relevant docs | \`vectorstore.as_retriever()\` |
| **Tool** | External action | Web search, calculator, API call |

### When to Use vs Not Use LangChain

| Use LangChain when... | Don't use when... |
|------------------------|-------------------|
| Rapid prototyping | You need minimal dependencies |
| Complex multi-step pipelines | Simple single API call |
| Need retrieval + agents + memory | Full control over every detail |
| Team uses shared abstractions | Performance-critical hot paths |
| Leveraging community integrations | You'd only use 5% of the framework |
`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="300" fill="#0d1117" rx="8"/>
      <text x="300" y="30" fill="#58a6ff" font-size="16" text-anchor="middle" font-family="monospace" font-weight="bold">LangChain LCEL Pipeline</text>
      <defs><marker id="lc1" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#58a6ff"/></marker></defs>
      <!-- Prompt Template -->
      <rect x="30" y="70" width="110" height="50" rx="6" fill="#1f6feb" opacity="0.9"/>
      <text x="85" y="92" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Prompt</text>
      <text x="85" y="108" fill="#c9d1d9" font-size="9" text-anchor="middle" font-family="monospace">Template</text>
      <!-- Pipe 1 -->
      <line x1="140" y1="95" x2="170" y2="95" stroke="#58a6ff" stroke-width="2" marker-end="url(#lc1)"/>
      <text x="155" y="88" fill="#f0883e" font-size="16" text-anchor="middle" font-family="monospace">|</text>
      <!-- LLM -->
      <rect x="170" y="70" width="110" height="50" rx="6" fill="#238636" opacity="0.9"/>
      <text x="225" y="92" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Chat</text>
      <text x="225" y="108" fill="#c9d1d9" font-size="9" text-anchor="middle" font-family="monospace">Model</text>
      <!-- Pipe 2 -->
      <line x1="280" y1="95" x2="310" y2="95" stroke="#58a6ff" stroke-width="2" marker-end="url(#lc1)"/>
      <text x="295" y="88" fill="#f0883e" font-size="16" text-anchor="middle" font-family="monospace">|</text>
      <!-- Output Parser -->
      <rect x="310" y="70" width="110" height="50" rx="6" fill="#8957e5" opacity="0.9"/>
      <text x="365" y="92" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Output</text>
      <text x="365" y="108" fill="#c9d1d9" font-size="9" text-anchor="middle" font-family="monospace">Parser</text>
      <!-- Result -->
      <line x1="420" y1="95" x2="450" y2="95" stroke="#58a6ff" stroke-width="2" marker-end="url(#lc1)"/>
      <rect x="450" y="70" width="110" height="50" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="505" y="92" fill="#c9d1d9" font-size="11" text-anchor="middle" font-family="monospace">Structured</text>
      <text x="505" y="108" fill="#c9d1d9" font-size="9" text-anchor="middle" font-family="monospace">Result</text>
      <!-- Input -->
      <rect x="30" y="150" width="530" height="60" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="45" y="172" fill="#58a6ff" font-size="11" font-family="monospace">chain = prompt | llm | parser</text>
      <text x="45" y="195" fill="#8b949e" font-size="10" font-family="monospace">chain.invoke({"domain": "Python", "question": "What is GIL?"})</text>
      <!-- Features row -->
      <rect x="30" y="230" width="120" height="40" rx="6" fill="#161b22" stroke="#238636"/>
      <text x="90" y="255" fill="#238636" font-size="10" text-anchor="middle" font-family="monospace">.stream()</text>
      <rect x="170" y="230" width="120" height="40" rx="6" fill="#161b22" stroke="#1f6feb"/>
      <text x="230" y="255" fill="#1f6feb" font-size="10" text-anchor="middle" font-family="monospace">.batch()</text>
      <rect x="310" y="230" width="120" height="40" rx="6" fill="#161b22" stroke="#8957e5"/>
      <text x="370" y="255" fill="#8957e5" font-size="10" text-anchor="middle" font-family="monospace">.ainvoke()</text>
      <rect x="450" y="230" width="120" height="40" rx="6" fill="#161b22" stroke="#f0883e"/>
      <text x="510" y="255" fill="#f0883e" font-size="10" text-anchor="middle" font-family="monospace">.astream()</text>
      <text x="300" y="290" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Every LCEL chain automatically supports streaming, batching, and async</text>
    </svg>`,
    examples: [
      {
        title: "LCEL chain with prompt template and structured output",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# ── Build components ──
llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an expert in {domain}. Give concise, practical answers."),
    ("human", "{question}")
])

parser = StrOutputParser()

# ── Compose with LCEL (pipe syntax) ──
chain = prompt | llm | parser

# ── Invoke ──
result = chain.invoke({
    "domain": "Python concurrency",
    "question": "When should I use threading vs multiprocessing vs asyncio?"
})
print(result)

# ── Batch multiple inputs ──
results = chain.batch([
    {"domain": "Docker", "question": "What is layer caching?"},
    {"domain": "Git", "question": "What is rebase vs merge?"},
])
for r in results:
    print(f"---\\n{r[:100]}...")

# ── Stream token by token ──
print("\\n--- Streaming ---")
for chunk in chain.stream({
    "domain": "REST APIs",
    "question": "What are idempotent methods?"
}):
    print(chunk, end="", flush=True)`,
        expectedOutput: `Threading: I/O-bound tasks (network calls, file I/O) — threads release the GIL during I/O waits.
Multiprocessing: CPU-bound tasks (data processing, ML training) — bypasses the GIL with separate processes.
Asyncio: High-concurrency I/O (web servers, many simultaneous connections) — single-threaded event loop, most efficient for I/O.

Rule of thumb: asyncio > threading for I/O, multiprocessing for CPU.
---
Docker uses layer caching to speed up builds. Each instruction in a Dockerfile creates a layer...
---
Rebase replays your commits on top of the target branch, creating a linear history...

--- Streaming ---
Idempotent HTTP methods produce the same result regardless of how many times...`
      },
      {
        title: "RAG chain with LangChain retriever",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

# ── Create a vector store with sample docs ──
docs = [
    "FastAPI uses Pydantic for automatic request validation and generates OpenAPI docs.",
    "Use asyncio.gather() to run multiple coroutines concurrently in Python.",
    "Docker multi-stage builds reduce final image size by separating build and runtime stages.",
    "Pydantic v2 uses pydantic-core (Rust) for validation, making it 5-50x faster than v1.",
    "Use @app.on_event('startup') in FastAPI to initialize database connections.",
]

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = FAISS.from_texts(docs, embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

# ── Build RAG chain ──
llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", "Answer based ONLY on the context below. Cite sources.\\n\\nContext:\\n{context}"),
    ("human", "{question}")
])

def format_docs(docs):
    return "\\n".join(f"[{i+1}] {d.page_content}" for i, d in enumerate(docs))

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# ── Ask questions ──
answer = rag_chain.invoke("How does Pydantic v2 differ from v1?")
print(answer)

answer2 = rag_chain.invoke("How do I run async tasks concurrently?")
print(f"\\n---\\n{answer2}")`,
        expectedOutput: `Based on the context, Pydantic v2 uses pydantic-core, which is built in Rust, for validation. This makes it 5-50x faster than v1 [4]. FastAPI uses Pydantic for automatic request validation [1], so upgrading to v2 also speeds up your API.

---
To run async tasks concurrently in Python, use asyncio.gather(). This allows you to run multiple coroutines concurrently [2]. For example: results = await asyncio.gather(task1(), task2(), task3())`
      }
    ],
    quiz: [
      { question: "What does the pipe `|` operator do in LCEL?", options: ["Creates a subprocess", "Chains components sequentially — output of left becomes input to right", "Runs components in parallel", "Creates a conditional branch"], answer: 1, explanation: "The pipe operator in LCEL connects components into a chain. Each component's output feeds into the next: `prompt | llm | parser` means the prompt's output goes to the LLM, whose output goes to the parser." },
      { question: "What is the purpose of `StrOutputParser()`?", options: ["Parses strings into JSON", "Extracts the `.content` string from an AIMessage", "Validates string length", "Converts output to bytes"], answer: 1, explanation: "StrOutputParser extracts the text content from an AIMessage object, giving you a plain string instead of the full message object. It's the most common parser in LCEL chains." },
      { question: "Which LangChain package contains base abstractions like LCEL and prompt templates?", options: ["langchain", "langchain-community", "langchain-core", "langgraph"], answer: 2, explanation: "langchain-core contains the foundational abstractions: LCEL, prompt templates, output parsers, message types, and the Runnable interface. The langchain package builds on top of core with higher-level constructs." },
      { question: "What is the advantage of `llm.with_structured_output(MyModel)` over manual JSON parsing?", options: ["It's faster at runtime", "It guarantees the output matches a Pydantic schema with typed fields", "It uses less tokens", "It bypasses the LLM entirely"], answer: 1, explanation: "with_structured_output uses tool calling or constrained generation to ensure the LLM output conforms to a Pydantic model. You get typed, validated data rather than raw strings you'd have to parse and validate yourself." },
      { question: "When should you avoid using LangChain?", options: ["When building RAG systems", "When you need agents with tools", "When making a simple single API call or need minimal dependencies", "When prototyping quickly"], answer: 2, explanation: "LangChain adds abstraction overhead. For simple use cases (one API call, no chains or retrieval), using the LLM provider's SDK directly is simpler and has fewer dependencies." }
    ],
    commonMistakes: [
      { mistake: "Using langchain instead of provider-specific packages", fix: "Install provider packages: `pip install langchain-anthropic` not just `langchain`. The community split means models are in their own packages." },
      { mistake: "Forgetting to call `.invoke()` on a chain", fix: "LCEL chains are lazy — building `prompt | llm | parser` doesn't execute anything. You must call `.invoke(input)` to run it." },
      { mistake: "Passing raw strings instead of dicts to chains", fix: "If your prompt has variables like `{domain}` and `{question}`, pass a dict: `chain.invoke({'domain': 'Python', 'question': '...'})`. A raw string won't fill the template variables." },
      { mistake: "Not using RunnablePassthrough in RAG chains", fix: "In RAG chains, use `RunnablePassthrough()` to forward the original question alongside retrieved context: `{'context': retriever | format_docs, 'question': RunnablePassthrough()}`." }
    ],
    cheatSheet: `# LangChain Basics Cheat Sheet

## Setup
pip install langchain langchain-anthropic langchain-core

## Chat Model
from langchain_anthropic import ChatAnthropic
llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)
response = llm.invoke("Hello")  # returns AIMessage

## Prompt Template
from langchain_core.prompts import ChatPromptTemplate
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a {role}."),
    ("human", "{question}")
])

## Output Parsers
from langchain_core.output_parsers import StrOutputParser
parser = StrOutputParser()  # AIMessage -> str

## LCEL Chain
chain = prompt | llm | parser
result = chain.invoke({"role": "tutor", "question": "What is X?"})

## Structured Output
structured_llm = llm.with_structured_output(MyPydanticModel)
result = structured_llm.invoke("...")  # returns typed object

## Streaming
for chunk in chain.stream({"role": "tutor", "question": "What is X?"}):
    print(chunk, end="")

## Batch
results = chain.batch([input1, input2, input3])

## Async
result = await chain.ainvoke(input)
async for chunk in chain.astream(input):
    print(chunk, end="")`,
    furtherReading: [
      { title: "LangChain Python Docs", url: "https://python.langchain.com/docs/get_started/introduction" },
      { title: "LCEL Conceptual Guide", url: "https://python.langchain.com/docs/concepts/lcel/" },
      { title: "LangChain Expression Language How-To", url: "https://python.langchain.com/docs/how_to/#langchain-expression-language-lcel" }
    ],
    flashcards: [
      { front: "What is LCEL?", back: "LangChain Expression Language — a pipe-based syntax for composing LangChain components into chains: `prompt | llm | parser`. Every chain built with LCEL automatically supports `.invoke()`, `.stream()`, `.batch()`, `.ainvoke()`, and `.astream()`." },
      { front: "What does `StrOutputParser()` do?", back: "Extracts the `.content` string from an AIMessage, converting the full message object into a plain string. Most common parser in LCEL chains." },
      { front: "How do you get structured output from a LangChain model?", back: "`structured_llm = llm.with_structured_output(MyPydanticModel)` — the LLM will return a typed Pydantic object instead of raw text." },
      { front: "What is `RunnablePassthrough()` used for?", back: "It forwards its input unchanged. Used in RAG chains to pass the original question alongside retrieved context: `{'context': retriever | format_docs, 'question': RunnablePassthrough()}`." },
      { front: "What's the difference between `langchain` and `langchain-core`?", back: "`langchain-core` has base abstractions (LCEL, prompts, parsers, messages). `langchain` builds on core with higher-level constructs (chains, agents, retrieval). Provider integrations are in separate packages like `langchain-anthropic`." }
    ]
  },

  // ─── 2. LangChain Chains & Retrieval ─────────────────────────────────────
  {
    id: "langchain-chains",
    category: "LangChain",
    title: "Chains & Retrieval",
    priority: "High",
    icon: "⛓️",
    estimatedMinutes: 45,
    prerequisites: ["langchain-basics", "rag-fundamentals", "vector-databases"],
    nextTopics: ["langchain-memory", "langchain-agents"],
    whyItMatters: "Chains are the core abstraction for building multi-step LLM workflows. Understanding how to compose retrieval, branching, fallbacks, and parallel execution lets you build production-grade pipelines that go far beyond simple prompt-response. Most real AI apps are chains of 5-10 steps, not single LLM calls.",
    analogy: "Chains are like Unix pipes on steroids. In Unix, `cat file | grep error | wc -l` processes data through a pipeline. LangChain chains do the same but with AI components: retrieve docs | format context | call LLM | parse output | validate. Each step transforms data and passes it to the next.",
    content: `## Chains & Retrieval

### Beyond Simple Chains

LCEL supports much more than linear \`a | b | c\` pipelines. You can build:

- **Parallel execution** — Run multiple chains simultaneously
- **Branching** — Route inputs to different chains based on conditions
- **Fallbacks** — Retry with a different model if the first fails
- **Dynamic routing** — Choose chain at runtime based on input

### RunnableParallel — Execute Steps Simultaneously

\`\`\`python
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

# Run multiple operations at the same time
parallel_chain = RunnableParallel(
    summary=summary_chain,
    sentiment=sentiment_chain,
    key_points=key_points_chain,
)

# All three chains run concurrently, result is a dict:
# {"summary": "...", "sentiment": "...", "key_points": "..."}
result = parallel_chain.invoke({"text": article})
\`\`\`

### RunnableLambda — Custom Functions in Chains

\`\`\`python
from langchain_core.runnables import RunnableLambda

def add_metadata(input_dict):
    input_dict["timestamp"] = "2024-01-15"
    input_dict["source"] = "internal-docs"
    return input_dict

chain = RunnableLambda(add_metadata) | prompt | llm | parser
\`\`\`

### Fallbacks — Graceful Degradation

\`\`\`python
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI

# Primary model with fallback
primary = ChatAnthropic(model="claude-sonnet-4-20250514")
fallback = ChatOpenAI(model="gpt-4o-mini")

llm_with_fallback = primary.with_fallbacks([fallback])

# If Claude fails (rate limit, error), automatically tries GPT
chain = prompt | llm_with_fallback | parser
\`\`\`

### Advanced Retrieval Chain

\`\`\`python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

# Multi-step retrieval: rewrite query → retrieve → generate
rewrite_prompt = ChatPromptTemplate.from_messages([
    ("system", "Rewrite this question to be more specific for document search."),
    ("human", "{question}")
])

answer_prompt = ChatPromptTemplate.from_messages([
    ("system", "Answer based only on the context. Cite [Doc N].\\n\\nContext:\\n{context}"),
    ("human", "{question}")
])

def format_docs(docs):
    return "\\n".join(f"[Doc {i+1}] {d.page_content}" for i, d in enumerate(docs))

# Chain: rewrite query → retrieve → generate answer
rag_chain = (
    {"question": rewrite_prompt | llm | StrOutputParser()}
    | RunnablePassthrough.assign(
        context=lambda x: format_docs(retriever.invoke(x["question"]))
    )
    | answer_prompt
    | llm
    | StrOutputParser()
)
\`\`\`

### Branching with RunnableBranch

\`\`\`python
from langchain_core.runnables import RunnableBranch

# Route based on input
router = RunnableBranch(
    (lambda x: "code" in x["topic"].lower(), code_review_chain),
    (lambda x: "bug" in x["topic"].lower(), bug_fix_chain),
    general_chain,  # default
)

result = router.invoke({"topic": "code quality", "content": "..."})
\`\`\`

### Document Loaders & Text Splitters

\`\`\`python
from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    WebBaseLoader,
    CSVLoader,
)
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Load from different sources
pdf_docs = PyPDFLoader("report.pdf").load()
web_docs = WebBaseLoader("https://example.com/docs").load()
csv_docs = CSVLoader("data.csv").load()

# Split into chunks
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    separators=["\\n\\n", "\\n", ". ", " "],
)
chunks = splitter.split_documents(pdf_docs)
print(f"{len(pdf_docs)} pages → {len(chunks)} chunks")
\`\`\`

### Building a Complete RAG Pipeline

\`\`\`python
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_anthropic import ChatAnthropic

# 1. Load & chunk
docs = PyPDFLoader("manual.pdf").load()
chunks = splitter.split_documents(docs)

# 2. Embed & store
vectorstore = FAISS.from_documents(chunks, OpenAIEmbeddings())
retriever = vectorstore.as_retriever(
    search_type="mmr",          # Maximum Marginal Relevance for diversity
    search_kwargs={"k": 4, "fetch_k": 10}
)

# 3. Build chain
llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | answer_prompt | llm | StrOutputParser()
)

# 4. Query
answer = rag_chain.invoke("What are the safety procedures for equipment X?")
\`\`\`

### Retriever Types

| Retriever | When to use |
|-----------|-------------|
| **VectorStore** | Default — similarity search on embeddings |
| **MMR** | Need diversity in results (avoid repetition) |
| **MultiQuery** | Complex queries that need reformulation |
| **Contextual Compression** | Long docs where only parts are relevant |
| **Ensemble** | Combine keyword (BM25) + semantic search |
| **Self-Query** | Query includes metadata filters ("papers from 2024") |
`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="300" fill="#0d1117" rx="8"/>
      <text x="300" y="28" fill="#58a6ff" font-size="15" text-anchor="middle" font-family="monospace" font-weight="bold">LangChain Chains & Retrieval</text>
      <defs><marker id="lc2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#58a6ff"/></marker></defs>
      <!-- Query -->
      <rect x="20" y="50" width="80" height="35" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="60" y="72" fill="#c9d1d9" font-size="10" text-anchor="middle" font-family="monospace">Query</text>
      <!-- Rewrite -->
      <line x1="100" y1="67" x2="130" y2="67" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#lc2)"/>
      <rect x="130" y="50" width="90" height="35" rx="6" fill="#1f6feb" opacity="0.9"/>
      <text x="175" y="72" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Rewrite</text>
      <!-- Retrieve -->
      <line x1="220" y1="67" x2="250" y2="67" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#lc2)"/>
      <rect x="250" y="50" width="90" height="35" rx="6" fill="#8957e5" opacity="0.9"/>
      <text x="295" y="72" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Retrieve</text>
      <!-- Format -->
      <line x1="340" y1="67" x2="370" y2="67" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#lc2)"/>
      <rect x="370" y="50" width="90" height="35" rx="6" fill="#f0883e" opacity="0.8"/>
      <text x="415" y="72" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Format</text>
      <!-- LLM -->
      <line x1="460" y1="67" x2="490" y2="67" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#lc2)"/>
      <rect x="490" y="50" width="80" height="35" rx="6" fill="#238636" opacity="0.9"/>
      <text x="530" y="72" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">LLM</text>
      <!-- Parallel section -->
      <rect x="20" y="110" width="555" height="80" rx="6" fill="#161b22" stroke="#30363d" stroke-dasharray="4,4"/>
      <text x="40" y="130" fill="#58a6ff" font-size="11" font-family="monospace">RunnableParallel</text>
      <rect x="40" y="140" width="150" height="35" rx="4" fill="#1f6feb" opacity="0.5"/>
      <text x="115" y="162" fill="#c9d1d9" font-size="10" text-anchor="middle" font-family="monospace">summary_chain</text>
      <rect x="210" y="140" width="150" height="35" rx="4" fill="#238636" opacity="0.5"/>
      <text x="285" y="162" fill="#c9d1d9" font-size="10" text-anchor="middle" font-family="monospace">sentiment_chain</text>
      <rect x="380" y="140" width="180" height="35" rx="4" fill="#8957e5" opacity="0.5"/>
      <text x="470" y="162" fill="#c9d1d9" font-size="10" text-anchor="middle" font-family="monospace">key_points_chain</text>
      <!-- Fallback section -->
      <rect x="20" y="210" width="555" height="70" rx="6" fill="#161b22" stroke="#30363d" stroke-dasharray="4,4"/>
      <text x="40" y="232" fill="#f0883e" font-size="11" font-family="monospace">Fallbacks</text>
      <rect x="40" y="240" width="140" height="30" rx="4" fill="#238636" opacity="0.7"/>
      <text x="110" y="260" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Claude Sonnet</text>
      <text x="200" y="260" fill="#f85149" font-size="12" font-family="monospace">fail?</text>
      <line x1="220" y1="255" x2="250" y2="255" stroke="#f85149" stroke-width="1.5" marker-end="url(#lc2)"/>
      <rect x="250" y="240" width="140" height="30" rx="4" fill="#1f6feb" opacity="0.7"/>
      <text x="320" y="260" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">GPT-4o-mini</text>
      <text x="410" y="260" fill="#f85149" font-size="12" font-family="monospace">fail?</text>
      <line x1="430" y1="255" x2="460" y2="255" stroke="#f85149" stroke-width="1.5" marker-end="url(#lc2)"/>
      <rect x="460" y="240" width="100" height="30" rx="4" fill="#f0883e" opacity="0.5"/>
      <text x="510" y="260" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Cached</text>
    </svg>`,
    examples: [
      {
        title: "Multi-step chain with parallel execution and fallbacks",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnableLambda

# ── Models ──
claude = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)
gpt = ChatOpenAI(model="gpt-4o-mini", temperature=0)
llm = claude.with_fallbacks([gpt])

# ── Three parallel analysis chains ──
summary_prompt = ChatPromptTemplate.from_messages([
    ("system", "Summarize in 2 sentences."),
    ("human", "{text}")
])
sentiment_prompt = ChatPromptTemplate.from_messages([
    ("system", "Classify sentiment as: positive, negative, or neutral. Reply with one word."),
    ("human", "{text}")
])
topics_prompt = ChatPromptTemplate.from_messages([
    ("system", "List the 3 main topics as bullet points."),
    ("human", "{text}")
])

parser = StrOutputParser()

analysis = RunnableParallel(
    summary=summary_prompt | llm | parser,
    sentiment=sentiment_prompt | llm | parser,
    topics=topics_prompt | llm | parser,
)

# ── Combine results ──
def format_analysis(result):
    return f"""ANALYSIS REPORT
==============
Summary: {result['summary']}

Sentiment: {result['sentiment']}

Topics:
{result['topics']}"""

chain = analysis | RunnableLambda(format_analysis)

# ── Run ──
text = """Python 3.12 introduces significant performance improvements, including
a more efficient interpreter and better error messages. The new type parameter
syntax (PEP 695) simplifies generic type definitions. However, some third-party
libraries may need updates to support the new version."""

result = chain.invoke({"text": text})
print(result)`,
        expectedOutput: `ANALYSIS REPORT
==============
Summary: Python 3.12 brings performance improvements with a more efficient interpreter and better error messages, plus new type parameter syntax. Some third-party libraries may require updates for compatibility.

Sentiment: positive

Topics:
- Performance improvements in Python 3.12
- New type parameter syntax (PEP 695)
- Third-party library compatibility concerns`
      },
      {
        title: "Full RAG pipeline with document loading and retrieval",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

# ── Simulate document loading ──
raw_docs = [
    "FastAPI is a modern Python web framework. It uses Pydantic for validation and supports async/await natively. Install with: pip install fastapi uvicorn.",
    "FastAPI route handlers can be async or sync. Use async def for I/O-bound endpoints. FastAPI runs sync handlers in a thread pool automatically.",
    "Dependency injection in FastAPI uses Depends(). Common uses: database sessions, auth checks, pagination parameters. Dependencies can be nested.",
    "FastAPI generates OpenAPI docs automatically at /docs (Swagger UI) and /redoc. Use response_model to document response schemas.",
    "Background tasks in FastAPI use BackgroundTasks. Add tasks with background_tasks.add_task(func, args). They run after the response is sent.",
    "FastAPI middleware intercepts all requests. Use @app.middleware('http') or add_middleware(). Common uses: CORS, logging, timing, auth.",
    "WebSocket support in FastAPI uses @app.websocket('/ws'). Accept connections, send/receive messages, handle disconnections.",
]

# ── Split & embed ──
splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=30)
from langchain_core.documents import Document
docs = [Document(page_content=t) for t in raw_docs]
chunks = splitter.split_documents(docs)

vectorstore = FAISS.from_documents(chunks, OpenAIEmbeddings(model="text-embedding-3-small"))
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# ── Build RAG chain ──
llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)

prompt = ChatPromptTemplate.from_messages([
    ("system", """Answer based ONLY on the context below. If the context doesn't contain
the answer, say "I don't have information about that."

Context:
{context}"""),
    ("human", "{question}")
])

def format_docs(docs):
    return "\\n".join(f"[{i+1}] {d.page_content}" for i, d in enumerate(docs))

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# ── Query ──
print("Q1:", "How does FastAPI handle sync endpoints?")
print("A1:", rag_chain.invoke("How does FastAPI handle sync endpoints?"))

print("\\nQ2:", "How do background tasks work?")
print("A2:", rag_chain.invoke("How do background tasks work in FastAPI?"))

print("\\nQ3:", "Does FastAPI support GraphQL?")
print("A3:", rag_chain.invoke("Does FastAPI support GraphQL?"))`,
        expectedOutput: `Q1: How does FastAPI handle sync endpoints?
A1: FastAPI runs sync route handlers in a thread pool automatically [2]. You can use either async def or regular def for route handlers — use async def for I/O-bound endpoints, and FastAPI will handle sync handlers appropriately.

Q2: How do background tasks work?
A2: Background tasks in FastAPI use the BackgroundTasks dependency. You add tasks with background_tasks.add_task(func, args), and they run after the response is sent to the client [5].

Q3: Does FastAPI support GraphQL?
A3: I don't have information about that. The provided context covers REST endpoints, WebSockets, middleware, and background tasks, but doesn't mention GraphQL support.`
      }
    ],
    quiz: [
      { question: "What does `RunnableParallel` do?", options: ["Runs chains in sequence", "Executes multiple chains concurrently and returns a dict of results", "Splits input into parallel streams", "Creates multiple copies of a chain"], answer: 1, explanation: "RunnableParallel runs multiple chains simultaneously on the same input and returns a dictionary with each chain's result keyed by the name you give it." },
      { question: "What does `.with_fallbacks([model2])` do?", options: ["Combines outputs from both models", "Runs both models and picks the best answer", "Uses model2 only if the primary model fails", "Averages the outputs of both models"], answer: 2, explanation: "with_fallbacks creates a chain that tries the primary model first, and only calls the fallback model(s) if the primary raises an exception (rate limit, error, timeout)." },
      { question: "What is the `search_type='mmr'` retriever option?", options: ["Maximum Memory Retrieval — caches results", "Maximum Marginal Relevance — balances relevance with diversity", "Multi-Model Retrieval — uses multiple embeddings", "Minimum Match Rate — filters low-quality results"], answer: 1, explanation: "MMR (Maximum Marginal Relevance) retrieves documents that are both relevant to the query AND diverse from each other, reducing redundancy in retrieved context." },
      { question: "What is `RunnableLambda` used for?", options: ["Creating anonymous functions", "Wrapping a regular Python function to be used as a step in an LCEL chain", "Running lambda functions on AWS", "Defining callback hooks"], answer: 1, explanation: "RunnableLambda wraps any Python function so it can be used with the pipe operator in LCEL chains. It turns a regular function into a Runnable with .invoke(), .stream(), etc." },
      { question: "Why use `RecursiveCharacterTextSplitter` over splitting on \\n?", options: ["It's faster", "It tries multiple separators in order, preserving semantic boundaries while respecting chunk size", "It uses AI to split text", "It handles binary files"], answer: 1, explanation: "RecursiveCharacterTextSplitter tries separators in priority order (paragraphs > newlines > sentences > words), keeping chunk size within limits while preserving semantic coherence." }
    ],
    commonMistakes: [
      { mistake: "Not setting chunk_overlap in text splitters", fix: "Always use overlap (10-20% of chunk_size) so context isn't lost at chunk boundaries: `RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)`." },
      { mistake: "Using RunnableParallel when chains have dependencies", fix: "RunnableParallel runs chains concurrently, so they can't depend on each other's output. Use sequential chaining with `|` for dependent steps." },
      { mistake: "Ignoring retriever search_type for production", fix: "Default similarity search can return redundant chunks. Use `search_type='mmr'` with `fetch_k` > `k` for better diversity: `retriever = vs.as_retriever(search_type='mmr', search_kwargs={'k': 4, 'fetch_k': 10})`." },
      { mistake: "Not handling the case when retrieval returns nothing relevant", fix: "Add instructions in your system prompt to say 'I don't know' when context doesn't contain the answer. This prevents hallucination when the retriever misses." }
    ],
    cheatSheet: `# Chains & Retrieval Cheat Sheet

## Parallel Execution
from langchain_core.runnables import RunnableParallel
chain = RunnableParallel(a=chain1, b=chain2, c=chain3)
result = chain.invoke(input)  # {"a": ..., "b": ..., "c": ...}

## Custom Function in Chain
from langchain_core.runnables import RunnableLambda
chain = RunnableLambda(my_func) | prompt | llm | parser

## Fallbacks
llm = primary_model.with_fallbacks([backup_model])

## Branching
from langchain_core.runnables import RunnableBranch
router = RunnableBranch(
    (condition1, chain1),
    (condition2, chain2),
    default_chain
)

## RAG Chain Pattern
rag = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt | llm | parser
)

## Text Splitting
from langchain_text_splitters import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = splitter.split_documents(docs)

## Retriever with MMR
retriever = vectorstore.as_retriever(
    search_type="mmr", search_kwargs={"k": 4, "fetch_k": 10}
)`,
    furtherReading: [
      { title: "LCEL How-To Guides", url: "https://python.langchain.com/docs/how_to/#langchain-expression-language-lcel" },
      { title: "Document Loaders", url: "https://python.langchain.com/docs/integrations/document_loaders/" },
      { title: "Retriever Concepts", url: "https://python.langchain.com/docs/concepts/retrievers/" }
    ],
    flashcards: [
      { front: "What does `RunnableParallel` do?", back: "Runs multiple chains concurrently on the same input and returns a dictionary of results. Use it when you need multiple independent analyses of the same data." },
      { front: "How do fallbacks work in LangChain?", back: "`model.with_fallbacks([backup])` creates a chain that tries the primary model first. If it raises an exception, it automatically retries with the backup model(s)." },
      { front: "What is `RunnableBranch` for?", back: "Routes input to different chains based on conditions. Provide (condition, chain) tuples and a default chain. First matching condition wins." },
      { front: "What does `search_type='mmr'` do for retrievers?", back: "Maximum Marginal Relevance — retrieves documents that are both relevant to the query AND diverse from each other, reducing redundant information in context." },
      { front: "Why use `RecursiveCharacterTextSplitter`?", back: "It tries multiple separators in priority order (paragraphs, newlines, sentences, words), preserving semantic coherence while keeping chunks within size limits. Always set chunk_overlap to avoid losing context at boundaries." }
    ]
  },

  // ─── 3. LangChain Memory & Agents ───────────────────────────────────────
  {
    id: "langchain-memory",
    category: "LangChain",
    title: "Memory & Agents",
    priority: "Medium",
    icon: "🧠",
    estimatedMinutes: 45,
    prerequisites: ["langchain-chains", "function-calling"],
    nextTopics: ["ai-agents-fundamentals"],
    whyItMatters: "Memory lets LLM apps maintain conversation context across interactions, and agents let LLMs dynamically decide which tools to call. Together, they turn static prompt-response into interactive, autonomous AI systems. Every chatbot needs memory; every complex AI workflow needs agents.",
    analogy: "Memory is like a notebook that your AI assistant carries between meetings. Without it, every conversation starts from scratch. Agents are like giving your assistant a phone, a calculator, and access to databases — now they can look things up, calculate, and take actions on their own instead of just answering from memory.",
    content: `## Memory & Agents

### Conversation Memory

LangChain provides memory classes that track conversation history and inject it into prompts.

#### Message History (Recommended)

\`\`\`python
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

store = {}  # session_id → history

def get_session_history(session_id: str):
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant."),
    ("placeholder", "{history}"),
    ("human", "{input}"),
])

chain = prompt | llm | StrOutputParser()

with_memory = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)

# Each call remembers previous conversation
config = {"configurable": {"session_id": "user-123"}}
print(with_memory.invoke({"input": "My name is Alice"}, config=config))
# "Hello Alice! How can I help you?"

print(with_memory.invoke({"input": "What is my name?"}, config=config))
# "Your name is Alice, as you mentioned earlier."
\`\`\`

#### Persistent Memory with Redis/PostgreSQL

\`\`\`python
from langchain_community.chat_message_histories import RedisChatMessageHistory

def get_session_history(session_id: str):
    return RedisChatMessageHistory(session_id, url="redis://localhost:6379")

# Same RunnableWithMessageHistory pattern, but history persists across restarts
\`\`\`

### Window & Summary Memory

\`\`\`python
# Keep only last N messages (sliding window)
from langchain_core.messages import trim_messages

trimmer = trim_messages(
    max_tokens=1000,
    strategy="last",              # keep most recent
    token_counter=llm,            # use LLM's tokenizer
    include_system=True,          # always keep system message
    allow_partial=False,
)

chain = trimmer | prompt | llm | StrOutputParser()
\`\`\`

### Agents — LLMs That Use Tools

Agents let the LLM decide which tools to call and in what order:

\`\`\`
User question → LLM decides tool → Execute tool → LLM reads result → Decide next step → ... → Final answer
\`\`\`

#### Defining Tools

\`\`\`python
from langchain_core.tools import tool

@tool
def search_docs(query: str) -> str:
    """Search the documentation for relevant information."""
    # In production: call vector DB, Elasticsearch, etc.
    docs = {"python": "Python is a programming language...",
            "docker": "Docker is a containerization platform..."}
    for key, val in docs.items():
        if key in query.lower():
            return val
    return "No relevant docs found."

@tool
def calculate(expression: str) -> str:
    """Calculate a mathematical expression. Use Python syntax."""
    try:
        return str(eval(expression))  # In production: use a safer evaluator
    except Exception as e:
        return f"Error: {e}"

@tool
def get_current_weather(city: str) -> str:
    """Get current weather for a city."""
    # Mock response
    weather = {"london": "15°C, cloudy", "tokyo": "22°C, sunny", "nyc": "8°C, rainy"}
    return weather.get(city.lower(), "Weather data not available")
\`\`\`

#### Creating an Agent

\`\`\`python
from langchain_anthropic import ChatAnthropic
from langgraph.prebuilt import create_react_agent

llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)
tools = [search_docs, calculate, get_current_weather]

# Create a ReAct agent (Reasoning + Acting)
agent = create_react_agent(llm, tools)

# The agent decides which tools to use
result = agent.invoke({
    "messages": [("human", "What's 15% of 340, and what's the weather in Tokyo?")]
})
# Agent will:
# 1. Call calculate("340 * 0.15") → "51.0"
# 2. Call get_current_weather("Tokyo") → "22°C, sunny"
# 3. Combine results into final answer
\`\`\`

#### Agent with System Prompt

\`\`\`python
agent = create_react_agent(
    llm,
    tools,
    prompt="You are a helpful research assistant. Always search docs before answering factual questions. Show your work for calculations.",
)

# Agent follows instructions about when to use tools
result = agent.invoke({
    "messages": [("human", "Tell me about Docker and calculate 2^10")]
})
\`\`\`

### Agent vs Chain — When to Use Which

| Feature | Chain | Agent |
|---------|-------|-------|
| **Flow** | Fixed, predetermined | Dynamic, LLM decides |
| **Tools** | Called in set order | Called as needed |
| **Loops** | No (linear) | Yes (can retry, explore) |
| **Predictability** | High | Lower |
| **Cost** | Fixed # of LLM calls | Variable # of LLM calls |
| **Best for** | Known workflows | Open-ended tasks |

### LangSmith — Tracing & Debugging

\`\`\`python
# Set environment variables
import os
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "ls__..."
os.environ["LANGCHAIN_PROJECT"] = "my-project"

# All chain/agent invocations are now traced in LangSmith
# View traces at: smith.langchain.com
# Each trace shows: inputs → every step → outputs → latency → token usage
\`\`\`
`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="300" fill="#0d1117" rx="8"/>
      <text x="300" y="28" fill="#58a6ff" font-size="15" text-anchor="middle" font-family="monospace" font-weight="bold">LangChain Agent Loop</text>
      <defs><marker id="lc3" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#58a6ff"/></marker></defs>
      <!-- User -->
      <rect x="30" y="50" width="90" height="40" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="75" y="75" fill="#c9d1d9" font-size="11" text-anchor="middle" font-family="monospace">User Query</text>
      <!-- Arrow to LLM -->
      <line x1="120" y1="70" x2="170" y2="70" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#lc3)"/>
      <!-- LLM Think -->
      <rect x="170" y="50" width="120" height="40" rx="6" fill="#1f6feb" opacity="0.9"/>
      <text x="230" y="68" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">LLM</text>
      <text x="230" y="82" fill="#c9d1d9" font-size="9" text-anchor="middle" font-family="monospace">(Reason)</text>
      <!-- Decision diamond -->
      <line x1="290" y1="70" x2="330" y2="70" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#lc3)"/>
      <polygon points="370,50 410,70 370,90 330,70" fill="#161b22" stroke="#f0883e" stroke-width="1.5"/>
      <text x="370" y="74" fill="#f0883e" font-size="9" text-anchor="middle" font-family="monospace">Tool?</text>
      <!-- Yes → Tool -->
      <line x1="370" y1="90" x2="370" y2="130" stroke="#238636" stroke-width="1.5" marker-end="url(#lc3)"/>
      <text x="380" y="115" fill="#238636" font-size="9" font-family="monospace">yes</text>
      <!-- Tools row -->
      <rect x="90" y="130" width="90" height="35" rx="4" fill="#238636" opacity="0.7"/>
      <text x="135" y="152" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">search</text>
      <rect x="200" y="130" width="90" height="35" rx="4" fill="#238636" opacity="0.7"/>
      <text x="245" y="152" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">calculate</text>
      <rect x="310" y="130" width="90" height="35" rx="4" fill="#238636" opacity="0.7"/>
      <text x="355" y="152" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">weather</text>
      <rect x="420" y="130" width="90" height="35" rx="4" fill="#238636" opacity="0.7"/>
      <text x="465" y="152" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">database</text>
      <!-- Tool result back to LLM -->
      <line x1="300" y1="165" x2="300" y2="195" stroke="#8957e5" stroke-width="1.5"/>
      <line x1="300" y1="195" x2="170" y2="195" stroke="#8957e5" stroke-width="1.5"/>
      <line x1="170" y1="195" x2="170" y2="90" stroke="#8957e5" stroke-width="1.5" marker-end="url(#lc3)"/>
      <text x="240" y="210" fill="#8957e5" font-size="9" font-family="monospace">tool result → back to LLM</text>
      <!-- No → Final Answer -->
      <line x1="410" y1="70" x2="470" y2="70" stroke="#f85149" stroke-width="1.5" marker-end="url(#lc3)"/>
      <text x="440" y="63" fill="#f85149" font-size="9" font-family="monospace">no</text>
      <rect x="470" y="50" width="100" height="40" rx="6" fill="#8957e5" opacity="0.9"/>
      <text x="520" y="68" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Final</text>
      <text x="520" y="82" fill="#c9d1d9" font-size="9" text-anchor="middle" font-family="monospace">Answer</text>
      <!-- Memory section -->
      <rect x="30" y="230" width="540" height="50" rx="6" fill="#161b22" stroke="#30363d" stroke-dasharray="4,4"/>
      <text x="50" y="250" fill="#58a6ff" font-size="11" font-family="monospace">Memory</text>
      <text x="50" y="268" fill="#8b949e" font-size="9" font-family="monospace">session_id → [msg1, msg2, ...] — persists across invocations (Redis/PostgreSQL/In-Memory)</text>
    </svg>`,
    examples: [
      {
        title: "Conversational agent with memory and tools",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from langchain_core.chat_history import InMemoryChatMessageHistory
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver

# ── Define tools ──
@tool
def search_knowledge_base(query: str) -> str:
    """Search internal knowledge base for information."""
    kb = {
        "refund": "Refund policy: Full refund within 30 days. Partial refund (50%) within 60 days. No refund after 60 days.",
        "shipping": "Standard shipping: 5-7 business days. Express: 2-3 days. Overnight available for +$25.",
        "returns": "Returns accepted within 30 days. Item must be unused and in original packaging.",
        "warranty": "All products come with a 1-year warranty. Extended warranty available for $49/year.",
    }
    for key, val in kb.items():
        if key in query.lower():
            return val
    return "No information found. Please contact support@example.com."

@tool
def check_order_status(order_id: str) -> str:
    """Check the status of an order by its ID."""
    orders = {
        "ORD-123": "Shipped, arriving March 15",
        "ORD-456": "Processing, estimated ship date March 12",
        "ORD-789": "Delivered on March 8",
    }
    return orders.get(order_id, f"Order {order_id} not found")

# ── Create agent with memory ──
llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)
memory = MemorySaver()

agent = create_react_agent(
    llm,
    [search_knowledge_base, check_order_status],
    prompt="You are a helpful customer support agent. Use tools to look up information before answering. Be friendly and concise.",
    checkpointer=memory,
)

# ── Simulate conversation ──
config = {"configurable": {"thread_id": "customer-42"}}

# Turn 1
r1 = agent.invoke({"messages": [("human", "Hi, I ordered something last week. Order ORD-456.")]}, config=config)
print("Agent:", r1["messages"][-1].content)

# Turn 2 (agent remembers the order ID)
r2 = agent.invoke({"messages": [("human", "What's your return policy?")]}, config=config)
print("\\nAgent:", r2["messages"][-1].content)

# Turn 3 (agent has full context)
r3 = agent.invoke({"messages": [("human", "If I don't like it when it arrives, can I return it?")]}, config=config)
print("\\nAgent:", r3["messages"][-1].content)`,
        expectedOutput: `Agent: I checked your order ORD-456 — it's currently processing with an estimated ship date of March 12. Is there anything else I can help with?

Agent: Our return policy allows returns within 30 days of delivery. The item must be unused and in its original packaging.

Agent: Absolutely! Since your order ORD-456 hasn't shipped yet, you'll have 30 days from delivery to return it if you're not satisfied. Just make sure it's unused and in the original packaging. You'd be eligible for a full refund within that 30-day window.`
      },
      {
        title: "Message trimming for long conversations",
        code: `from langchain_anthropic import ChatAnthropic
from langchain_core.messages import (
    SystemMessage, HumanMessage, AIMessage, trim_messages
)

llm = ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0)

# ── Simulate a long conversation ──
messages = [
    SystemMessage(content="You are a Python tutor. Be concise."),
    HumanMessage(content="What is a list?"),
    AIMessage(content="A list is an ordered, mutable collection: my_list = [1, 2, 3]"),
    HumanMessage(content="What is a tuple?"),
    AIMessage(content="A tuple is an ordered, immutable collection: my_tuple = (1, 2, 3)"),
    HumanMessage(content="What is a dict?"),
    AIMessage(content="A dict is a key-value mapping: my_dict = {'name': 'Alice', 'age': 30}"),
    HumanMessage(content="What is a set?"),
    AIMessage(content="A set is an unordered collection of unique elements: my_set = {1, 2, 3}"),
    HumanMessage(content="What are the differences between all of these?"),
]

# ── Trim to last few messages + system ──
trimmed = trim_messages(
    messages,
    max_tokens=200,
    strategy="last",
    token_counter=llm,
    include_system=True,    # always keep system message
    allow_partial=False,    # don't split messages
)

print(f"Original: {len(messages)} messages")
print(f"Trimmed: {len(trimmed)} messages")
for msg in trimmed:
    prefix = msg.__class__.__name__.replace("Message", "")
    print(f"  [{prefix}] {msg.content[:80]}...")

# The trimmed messages keep context without exceeding token budget
response = llm.invoke(trimmed)
print(f"\\nResponse: {response.content}")`,
        expectedOutput: `Original: 9 messages
Trimmed: 4 messages
  [System] You are a Python tutor. Be concise....
  [AI] A set is an unordered collection of unique elements: my_set = {1, 2, 3}...
  [Human] What are the differences between all of these?...

Response: Here are the key differences:
- **List**: ordered, mutable, allows duplicates — [1, 2, 2]
- **Tuple**: ordered, immutable, allows duplicates — (1, 2, 2)
- **Dict**: key-value pairs, keys unique, mutable — {"a": 1}
- **Set**: unordered, mutable, no duplicates — {1, 2, 3}`
      }
    ],
    quiz: [
      { question: "What does `RunnableWithMessageHistory` do?", options: ["Logs all messages to a file", "Automatically manages conversation history — saves new messages and injects history into prompts", "Creates a backup of messages", "Encrypts message history"], answer: 1, explanation: "RunnableWithMessageHistory wraps a chain to automatically save user/AI messages and inject previous history into the prompt, enabling multi-turn conversations." },
      { question: "What is a ReAct agent?", options: ["A React.js component", "An agent that reasons about what tool to use, acts by calling it, observes the result, and repeats", "An agent that only reacts to user input", "A reactive programming agent"], answer: 1, explanation: "ReAct (Reasoning + Acting) agents follow a loop: think about what to do → call a tool → observe the result → think about next step → repeat until done. They combine reasoning with action." },
      { question: "Why use `trim_messages` with `include_system=True`?", options: ["System messages are always the longest", "To ensure the system prompt stays even when trimming old messages", "System messages contain the API key", "To trim system messages first"], answer: 1, explanation: "include_system=True ensures the system message is always preserved when trimming conversation history, so the LLM's instructions and personality remain consistent even in long conversations." },
      { question: "When should you use a chain instead of an agent?", options: ["When you want the LLM to decide tool order", "When the workflow is known and predictable — fixed steps in a set order", "When you have many tools", "When you need dynamic routing"], answer: 1, explanation: "Chains are better when you know the exact steps in advance. They're more predictable, faster (fixed number of LLM calls), and easier to debug. Agents are for open-ended tasks where the LLM needs to decide what to do." },
      { question: "What is the `@tool` decorator used for?", options: ["Marking a function as deprecated", "Converting a Python function into a LangChain tool that an agent can discover and call", "Adding logging to a function", "Caching function results"], answer: 1, explanation: "The @tool decorator converts a regular Python function into a LangChain Tool object. The function's docstring becomes the tool description that the LLM reads to decide when to use it." }
    ],
    commonMistakes: [
      { mistake: "Not providing docstrings on @tool functions", fix: "The docstring is the tool's description — the LLM reads it to decide when to use the tool. No docstring = the agent won't know what the tool does." },
      { mistake: "Using legacy ConversationBufferMemory", fix: "Use `RunnableWithMessageHistory` with `InMemoryChatMessageHistory` (or Redis/PostgreSQL for persistence). The old Memory classes are deprecated in LangChain v0.3+." },
      { mistake: "Letting conversation history grow unbounded", fix: "Use `trim_messages` to keep conversation history within token limits. Without trimming, long conversations will eventually exceed context window." },
      { mistake: "Using agents for simple deterministic workflows", fix: "If you know exactly what steps to take, use a chain. Agents add latency and unpredictability. Only use agents when the workflow genuinely depends on LLM reasoning." }
    ],
    cheatSheet: `# Memory & Agents Cheat Sheet

## Conversation Memory
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

with_memory = RunnableWithMessageHistory(
    chain, get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)
result = with_memory.invoke({"input": "Hi"}, config={"configurable": {"session_id": "abc"}})

## Message Trimming
from langchain_core.messages import trim_messages
trimmer = trim_messages(max_tokens=1000, strategy="last",
                        token_counter=llm, include_system=True)

## Define Tools
from langchain_core.tools import tool
@tool
def my_tool(param: str) -> str:
    """Description the LLM reads to decide when to use this."""
    return result

## Create Agent (LangGraph)
from langgraph.prebuilt import create_react_agent
agent = create_react_agent(llm, [tool1, tool2], prompt="System prompt")
result = agent.invoke({"messages": [("human", "question")]})

## Agent with Memory
from langgraph.checkpoint.memory import MemorySaver
agent = create_react_agent(llm, tools, checkpointer=MemorySaver())
config = {"configurable": {"thread_id": "user-1"}}
result = agent.invoke({"messages": [("human", "Hi")]}, config=config)`,
    furtherReading: [
      { title: "LangGraph ReAct Agent", url: "https://langchain-ai.github.io/langgraph/how-tos/create-react-agent/" },
      { title: "Message History in LangChain", url: "https://python.langchain.com/docs/how_to/message_history/" },
      { title: "LangChain Tools", url: "https://python.langchain.com/docs/how_to/custom_tools/" }
    ],
    flashcards: [
      { front: "How does `RunnableWithMessageHistory` work?", back: "It wraps a chain to automatically: (1) load previous messages from a session store, (2) inject them into the prompt, (3) save new user/AI messages after each invocation. Use `session_id` in config to separate conversations." },
      { front: "What is the ReAct loop?", back: "Reason → Act → Observe → Repeat. The agent thinks about what to do, calls a tool, reads the result, and decides whether to call another tool or give the final answer. It loops until done." },
      { front: "Why are tool docstrings critical for agents?", back: "The LLM reads the docstring to understand what each tool does and when to use it. Without a clear docstring, the agent won't select the right tool or may skip it entirely." },
      { front: "What is `trim_messages` for?", back: "Limits conversation history to fit within a token budget. Use `strategy='last'` to keep recent messages, `include_system=True` to preserve system prompt. Prevents context window overflow in long conversations." },
      { front: "Chain vs Agent: when to use which?", back: "Chain: fixed, known workflow (predictable, cheaper). Agent: dynamic, open-ended tasks where the LLM needs to decide what tools to call and in what order (flexible but less predictable)." }
    ]
  }
];
