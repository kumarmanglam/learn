export const MODULE5_TOPICS = [
  // ─── 1. LLM API Basics ───────────────────────────────────────────────
  {
    id: "llm-api",
    category: "LLM Integration",
    title: "LLM API Basics (Anthropic & OpenAI)",
    priority: "High",
    icon: "🔌",
    estimatedMinutes: 45,
    prerequisites: ["prompt-engineering", "pydantic"],
    nextTopics: ["streaming-async", "function-calling"],
    whyItMatters: "Every AI application starts with an API call. The Anthropic Messages API and OpenAI Chat Completions API have different patterns, defaults, and gotchas. Understanding message roles, token counting, error handling, and rate limiting is the difference between a demo that works once and a production system that works at scale. Misunderstanding the API structure is the #1 cause of 'why is my AI app broken?' tickets.",
    analogy: "An LLM API call is like ordering food at a restaurant. The system prompt is the restaurant's menu rules ('We only serve Italian'). The user message is your order. The assistant response is the dish. Tool use is asking the waiter to check if an ingredient is available before cooking. Streaming is the waiter bringing courses as they're ready rather than waiting for everything at once.",
    content: `## LLM API Basics: Anthropic & OpenAI

### Anthropic Messages API

\`\`\`python
from anthropic import Anthropic

client = Anthropic()  # reads ANTHROPIC_API_KEY from env

response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system="You are a helpful Python tutor.",  # system prompt (string or list)
    messages=[
        {"role": "user", "content": "Explain list comprehensions"},
    ],
    temperature=0.7,
)

# Response structure
print(response.content[0].text)       # the actual text
print(response.model)                 # model used
print(response.usage.input_tokens)    # input token count
print(response.usage.output_tokens)   # output token count
print(response.stop_reason)           # "end_turn", "max_tokens", "tool_use"
\`\`\`

### OpenAI Chat Completions API

\`\`\`python
from openai import OpenAI

client = OpenAI()  # reads OPENAI_API_KEY from env

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful Python tutor."},
        {"role": "user", "content": "Explain list comprehensions"},
    ],
    max_tokens=1024,
    temperature=0.7,
)

print(response.choices[0].message.content)
print(response.usage.prompt_tokens)
print(response.usage.completion_tokens)
\`\`\`

### Key Differences

| Feature | Anthropic | OpenAI |
|---------|-----------|--------|
| **System prompt** | Separate \`system\` param | In messages array |
| **Response** | \`response.content[0].text\` | \`response.choices[0].message.content\` |
| **Token counting** | \`input_tokens\`, \`output_tokens\` | \`prompt_tokens\`, \`completion_tokens\` |
| **Stop reason** | \`stop_reason\` | \`finish_reason\` |
| **Multi-modal** | Content blocks (text, image) | Content parts |
| **Tool use** | \`tools\` + \`tool_choice\` | \`tools\` + \`tool_choice\` |

### Multi-Turn Conversations

Both APIs are **stateless** — you must send the entire conversation each time:

\`\`\`python
messages = [
    {"role": "user", "content": "What's Python's GIL?"},
    {"role": "assistant", "content": "The GIL (Global Interpreter Lock) is..."},
    {"role": "user", "content": "How does asyncio work around it?"},
]

# Every call sends ALL messages — the API has no memory
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=messages,
)
\`\`\`

### Error Handling

\`\`\`python
import anthropic

try:
    response = client.messages.create(...)
except anthropic.RateLimitError:
    # 429 — too many requests, implement backoff
    time.sleep(30)
except anthropic.APIStatusError as e:
    # 400, 401, 403, 500, etc.
    print(f"Status {e.status_code}: {e.message}")
except anthropic.APIConnectionError:
    # Network issue
    print("Connection failed — check network")
\`\`\`

### Rate Limiting & Retry

\`\`\`python
from anthropic import Anthropic
from tenacity import retry, wait_exponential, retry_if_exception_type

client = Anthropic()

@retry(
    wait=wait_exponential(multiplier=1, min=1, max=60),
    retry=retry_if_exception_type(anthropic.RateLimitError),
)
def call_claude(messages: list, max_tokens: int = 1024) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=max_tokens,
        messages=messages,
    )
    return response.content[0].text
\`\`\`

### Cost Tracking

\`\`\`python
# Track costs per call
PRICES = {
    "claude-sonnet-4-20250514": {"input": 3.0, "output": 15.0},  # per million tokens
    "claude-3-haiku-20240307": {"input": 0.25, "output": 1.25},
}

def track_cost(response, model: str) -> float:
    prices = PRICES[model]
    cost = (
        response.usage.input_tokens * prices["input"] / 1_000_000
        + response.usage.output_tokens * prices["output"] / 1_000_000
    )
    return cost
\`\`\`

### Prompt Caching (Anthropic)

Static system prompts can be cached for 90% cost reduction:

\`\`\`python
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": LONG_SYSTEM_PROMPT,
        "cache_control": {"type": "ephemeral"}
    }],
    messages=[{"role": "user", "content": user_query}],
)
# First call: caches the system prompt
# Subsequent calls: 90% cheaper for the cached prefix
\`\`\``,
    diagram: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <defs>
        <marker id="arr6" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#58a6ff"/>
        </marker>
      </defs>
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">LLM API Request → Response Flow</text>
      <!-- Your App -->
      <rect x="20" y="50" width="150" height="180" rx="10" fill="#161b22" stroke="#1f6feb"/>
      <text x="95" y="75" fill="#58a6ff" font-size="12" text-anchor="middle" font-weight="bold" font-family="monospace">Your App</text>
      <rect x="32" y="85" width="126" height="22" rx="4" fill="#1c2333"/>
      <text x="95" y="100" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">system prompt</text>
      <rect x="32" y="112" width="126" height="22" rx="4" fill="#1c2333"/>
      <text x="95" y="127" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">messages[]</text>
      <rect x="32" y="139" width="126" height="22" rx="4" fill="#1c2333"/>
      <text x="95" y="154" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">model, max_tokens</text>
      <rect x="32" y="166" width="126" height="22" rx="4" fill="#1c2333"/>
      <text x="95" y="181" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">tools[], temperature</text>
      <rect x="32" y="193" width="126" height="22" rx="4" fill="#12261e"/>
      <text x="95" y="208" fill="#7ee787" font-size="9" text-anchor="middle" font-family="monospace">cache_control</text>
      <!-- Arrow right -->
      <line x1="170" y1="140" x2="230" y2="140" stroke="#58a6ff" stroke-width="2" marker-end="url(#arr6)"/>
      <text x="200" y="133" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">POST</text>
      <!-- API -->
      <rect x="230" y="80" width="140" height="120" rx="10" fill="#0d1117" stroke="#238636"/>
      <text x="300" y="105" fill="#7ee787" font-size="12" text-anchor="middle" font-weight="bold" font-family="monospace">Anthropic API</text>
      <text x="300" y="125" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Tokenize</text>
      <text x="300" y="142" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Forward pass</text>
      <text x="300" y="159" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Sample tokens</text>
      <text x="300" y="176" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Count usage</text>
      <!-- Arrow right -->
      <line x1="370" y1="140" x2="430" y2="140" stroke="#58a6ff" stroke-width="2" marker-end="url(#arr6)"/>
      <text x="400" y="133" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">JSON</text>
      <!-- Response -->
      <rect x="430" y="50" width="150" height="180" rx="10" fill="#161b22" stroke="#f0883e"/>
      <text x="505" y="75" fill="#f0883e" font-size="12" text-anchor="middle" font-weight="bold" font-family="monospace">Response</text>
      <rect x="442" y="85" width="126" height="22" rx="4" fill="#271d03"/>
      <text x="505" y="100" fill="#e3b341" font-size="9" text-anchor="middle" font-family="monospace">content[0].text</text>
      <rect x="442" y="112" width="126" height="22" rx="4" fill="#271d03"/>
      <text x="505" y="127" fill="#e3b341" font-size="9" text-anchor="middle" font-family="monospace">stop_reason</text>
      <rect x="442" y="139" width="126" height="22" rx="4" fill="#271d03"/>
      <text x="505" y="154" fill="#e3b341" font-size="9" text-anchor="middle" font-family="monospace">usage.input_tokens</text>
      <rect x="442" y="166" width="126" height="22" rx="4" fill="#271d03"/>
      <text x="505" y="181" fill="#e3b341" font-size="9" text-anchor="middle" font-family="monospace">usage.output_tokens</text>
      <rect x="442" y="193" width="126" height="22" rx="4" fill="#271d03"/>
      <text x="505" y="208" fill="#e3b341" font-size="9" text-anchor="middle" font-family="monospace">model, id</text>
      <!-- Cost note -->
      <rect x="100" y="248" width="400" height="28" rx="6" fill="#0d1117" stroke="#21262d"/>
      <text x="300" y="266" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Cost = (input_tokens × $3/M) + (output_tokens × $15/M) for Sonnet</text>
    </svg>`,
    examples: [
      {
        title: "Complete Anthropic API call with error handling & cost tracking",
        code: `import json
from anthropic import Anthropic
import anthropic

client = Anthropic()

PRICES = {
    "claude-sonnet-4-20250514": {"input": 3.0, "output": 15.0},
    "claude-3-haiku-20240307": {"input": 0.25, "output": 1.25},
}

def ask_claude(
    user_message: str,
    system: str = "You are a helpful assistant.",
    model: str = "claude-sonnet-4-20250514",
    max_tokens: int = 1024,
    temperature: float = 0.7,
) -> dict:
    """Call Claude with full error handling and cost tracking."""
    try:
        response = client.messages.create(
            model=model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system,
            messages=[{"role": "user", "content": user_message}],
        )

        prices = PRICES.get(model, {"input": 0, "output": 0})
        cost = (
            response.usage.input_tokens * prices["input"] / 1_000_000
            + response.usage.output_tokens * prices["output"] / 1_000_000
        )

        return {
            "text": response.content[0].text,
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
            "cost_usd": round(cost, 6),
            "stop_reason": response.stop_reason,
        }

    except anthropic.RateLimitError:
        return {"error": "Rate limited — wait and retry"}
    except anthropic.APIStatusError as e:
        return {"error": f"API error {e.status_code}: {e.message}"}
    except anthropic.APIConnectionError:
        return {"error": "Connection failed"}

# Usage
result = ask_claude("What is Python's GIL in one sentence?")
print(f"Response: {result['text']}")
print(f"Tokens: {result['input_tokens']} in / {result['output_tokens']} out")
print(f"Cost: \${result['cost_usd']}")`,
        expectedOutput: `Response: The GIL (Global Interpreter Lock) is a mutex in CPython that allows only one thread to execute Python bytecode at a time, limiting true parallelism for CPU-bound tasks.
Tokens: 28 in / 42 out
Cost: $0.000714`
      },
      {
        title: "Multi-turn conversation management",
        code: `from anthropic import Anthropic

client = Anthropic()

class Conversation:
    """Manages multi-turn conversation with token tracking."""

    def __init__(self, system: str, model: str = "claude-sonnet-4-20250514"):
        self.system = system
        self.model = model
        self.messages = []
        self.total_input_tokens = 0
        self.total_output_tokens = 0

    def say(self, user_message: str) -> str:
        self.messages.append({"role": "user", "content": user_message})

        response = client.messages.create(
            model=self.model,
            max_tokens=1024,
            system=self.system,
            messages=self.messages,
        )

        assistant_text = response.content[0].text
        self.messages.append({"role": "assistant", "content": assistant_text})

        self.total_input_tokens += response.usage.input_tokens
        self.total_output_tokens += response.usage.output_tokens

        return assistant_text

    @property
    def turn_count(self):
        return len(self.messages) // 2

    def __repr__(self):
        return (
            f"Conversation(turns={self.turn_count}, "
            f"tokens={self.total_input_tokens}+{self.total_output_tokens})"
        )

# Usage
chat = Conversation(system="You are a concise Python tutor. Answer in 1-2 sentences.")
print(chat.say("What is a decorator?"))
print(chat.say("Give me a one-line example"))
print(chat.say("How does @functools.wraps help?"))
print(f"\\nStats: {chat}")`,
        expectedOutput: `A decorator is a function that wraps another function to modify its behavior without changing its source code, using the @decorator syntax.

@timer def slow(): time.sleep(1) — the @timer wraps slow() to measure execution time.

@functools.wraps preserves the original function's __name__, __doc__, and other metadata on the wrapper, which aids debugging and introspection.

Stats: Conversation(turns=3, tokens=187+89)`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "Why must you send the full conversation history with every API call?", options: ["To increase token count", "LLM APIs are stateless — the model has no memory between calls, so you provide context by resending all prior messages", "To improve response quality", "It's optional, not required"], answer: 1, explanation: "LLM APIs are completely stateless. Each HTTP request is independent — the model receives only what's in that request. There's no session or stored state. To maintain a conversation, you must send all prior user/assistant message pairs every time. This is why token management and context window limits matter." },
      { difficulty: "medium", question: "What is the difference between Anthropic's system param and OpenAI's system message?", options: ["They are identical", "Anthropic uses a separate 'system' parameter outside messages; OpenAI embeds the system prompt as the first message in the messages array with role 'system'", "Only OpenAI supports system prompts", "Anthropic's system prompt doesn't count toward token limits"], answer: 1, explanation: "Anthropic's API has a dedicated `system` parameter (string or list of content blocks) separate from the messages array. OpenAI includes the system prompt as a message with role='system' inside the messages array. Functionally similar, but Anthropic's separation makes it easier to apply cache_control to the system prompt independently." },
      { difficulty: "hard", question: "What does Anthropic's prompt caching with cache_control do?", options: ["Saves responses to disk for offline use", "Caches the KV-pair computation for the static prefix of the prompt — subsequent calls with the same prefix pay 90% less for those cached tokens", "Stores the system prompt in a database", "Compresses the prompt to save bandwidth"], answer: 1, explanation: "Prompt caching caches the attention key-value pairs for the system prompt prefix. When you make repeated calls with the same long system prompt, the provider reuses the cached computation — charging only 10% of the normal input token price for cached tokens. The dynamic portion (new user messages) is still charged at full price. Requires cache_control: {type: 'ephemeral'} on the content block." }
    ],
    commonMistakes: [
      { mistake: "Not tracking token usage and costs in production", whyItHappens: "Costs seem negligible during development with short prompts", howToAvoid: "Log input_tokens and output_tokens for every call. Multiply by per-model pricing. A long system prompt + multi-turn conversation can hit $0.10+ per request at scale. Set up cost alerts and per-user budgets." },
      { mistake: "Not handling rate limits with exponential backoff", whyItHappens: "Works fine in development with low request volume", howToAvoid: "Use tenacity or backoff library: @retry(wait=wait_exponential(min=1, max=60), retry=retry_if_exception_type(RateLimitError)). Without this, production traffic will fail intermittently." }
    ],
    cheatSheet: `## LLM API Cheat Sheet
- **Anthropic**: client.messages.create() → response.content[0].text
- **OpenAI**: client.chat.completions.create() → response.choices[0].message.content
- **Stateless**: send full conversation history every call
- **Errors**: catch RateLimitError, APIStatusError, APIConnectionError
- **Retry**: exponential backoff on 429 (rate limit)
- **Caching**: cache_control on system prompt → 90% cheaper
- **Cost**: track usage.input_tokens × price per call`,
    furtherReading: [
      { type: "docs", title: "Anthropic API Reference", url: "https://docs.anthropic.com/en/api/messages", whyRead: "Complete Messages API reference. Essential for understanding all parameters, response structure, and error codes." },
      { type: "docs", title: "Anthropic Prompt Caching", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching", whyRead: "How to reduce costs by 90% for repeated long system prompts. Critical for production cost optimization." }
    ],
    flashcards: [
      { front: "Why are LLM APIs stateless?", back: "Each HTTP request is independent — no session, no stored context. You must send the entire conversation history (all prior messages) in every call for the model to have context." },
      { front: "How does Anthropic prompt caching work?", back: "Add cache_control: {type: 'ephemeral'} to system prompt content block. KV-pairs for that prefix are cached. Subsequent calls with the same prefix pay 10% of normal input token cost for cached portion." },
      { front: "What error should you always handle in production LLM calls?", back: "RateLimitError (429) — implement exponential backoff with tenacity. Also APIStatusError (400/401/500) and APIConnectionError (network)." },
      { front: "What's Anthropic's response structure?", back: "response.content[0].text (the text), response.usage.input_tokens/output_tokens (for cost), response.stop_reason ('end_turn', 'max_tokens', 'tool_use')." }
    ]
  },

  // ─── 2. Streaming & Async ────────────────────────────────────────────
  {
    id: "streaming-async",
    category: "LLM Integration",
    title: "Streaming & Async LLM Calls",
    priority: "High",
    icon: "🌊",
    estimatedMinutes: 35,
    prerequisites: ["llm-api", "async-programming"],
    nextTopics: ["function-calling"],
    whyItMatters: "Without streaming, users stare at a blank screen for 5-30 seconds while the model generates a response. Streaming shows tokens as they arrive — reducing perceived latency from seconds to milliseconds. Async calls let you make concurrent API requests (e.g., process 100 documents in parallel). Together, streaming + async are the foundation of responsive, scalable AI applications.",
    analogy: "Non-streaming is like ordering a meal and waiting for the entire plate to arrive. Streaming is like a sushi conveyor belt — each piece arrives as it's ready. Async is like placing orders at 5 different restaurants simultaneously instead of sequentially. In AI apps, streaming makes the UI feel instant; async makes batch processing fast.",
    content: `## Streaming & Async LLM Calls

### Why Streaming Matters

Without streaming:
\`\`\`
User sends prompt → [5-30 second wait] → Full response appears
\`\`\`

With streaming:
\`\`\`
User sends prompt → [100ms] first token → tokens flow in continuously
\`\`\`

**Time-to-first-token (TTFT)** drops from 5-30s to ~100-500ms.

### Anthropic Streaming

\`\`\`python
from anthropic import Anthropic

client = Anthropic()

# Stream with context manager
with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain Python generators"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# Get final message after streaming completes
final = stream.get_final_message()
print(f"\\nTokens: {final.usage.input_tokens} + {final.usage.output_tokens}")
\`\`\`

### Streaming Events (Low-Level)

\`\`\`python
with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            print(event.delta.text, end="")
        elif event.type == "message_start":
            print(f"Model: {event.message.model}")
        elif event.type == "message_stop":
            print("\\n[Done]")
\`\`\`

### Async API Calls

\`\`\`python
import asyncio
from anthropic import AsyncAnthropic

client = AsyncAnthropic()

async def ask(question: str) -> str:
    response = await client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=256,
        messages=[{"role": "user", "content": question}],
    )
    return response.content[0].text

# Concurrent requests — process 10 questions in parallel
async def batch_ask(questions: list[str]) -> list[str]:
    tasks = [ask(q) for q in questions]
    return await asyncio.gather(*tasks)

questions = [
    "What is a Python decorator?",
    "What is asyncio?",
    "What is a generator?",
    "What is a context manager?",
    "What is the GIL?",
]

results = asyncio.run(batch_ask(questions))
for q, a in zip(questions, results):
    print(f"Q: {q}\\nA: {a[:80]}...\\n")
\`\`\`

### Async Streaming

\`\`\`python
async def stream_response(prompt: str):
    async with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        async for text in stream.text_stream:
            print(text, end="", flush=True)

    final = await stream.get_final_message()
    return final
\`\`\`

### Batching with Concurrency Control

\`\`\`python
import asyncio
from anthropic import AsyncAnthropic

client = AsyncAnthropic()

async def process_document(doc: str, semaphore: asyncio.Semaphore) -> dict:
    async with semaphore:  # limit concurrent requests
        response = await client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=200,
            messages=[{"role": "user", "content": f"Summarize: {doc[:500]}"}],
        )
        return {
            "summary": response.content[0].text,
            "tokens": response.usage.input_tokens + response.usage.output_tokens,
        }

async def batch_process(documents: list[str], max_concurrent: int = 10):
    semaphore = asyncio.Semaphore(max_concurrent)
    tasks = [process_document(doc, semaphore) for doc in documents]
    return await asyncio.gather(*tasks)

# Process 100 documents, max 10 concurrent API calls
docs = [f"Document {i} content..." for i in range(100)]
results = asyncio.run(batch_process(docs))
print(f"Processed {len(results)} documents")
total_tokens = sum(r["tokens"] for r in results)
print(f"Total tokens: {total_tokens}")
\`\`\`

### FastAPI + Streaming (Server-Sent Events)

\`\`\`python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from anthropic import Anthropic

app = FastAPI()
client = Anthropic()

@app.post("/chat")
async def chat(user_message: str):
    async def generate():
        with client.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[{"role": "user", "content": user_message}],
        ) as stream:
            for text in stream.text_stream:
                yield f"data: {text}\\n\\n"
        yield "data: [DONE]\\n\\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
\`\`\``,
    diagram: `<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">Streaming vs Non-Streaming Timeline</text>
      <!-- Non-streaming -->
      <text x="20" y="55" fill="#8b949e" font-size="11" font-family="monospace">Without streaming:</text>
      <rect x="20" y="62" width="60" height="28" rx="4" fill="#1f6feb"/>
      <text x="50" y="80" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Prompt</text>
      <rect x="80" y="62" width="360" height="28" rx="4" fill="#2d1515" stroke="#f85149" stroke-dasharray="4"/>
      <text x="260" y="80" fill="#f85149" font-size="10" text-anchor="middle" font-family="monospace">⏳ User waits 5-30 seconds (blank screen)</text>
      <rect x="440" y="62" width="140" height="28" rx="4" fill="#238636"/>
      <text x="510" y="80" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Full response appears</text>
      <!-- Streaming -->
      <text x="20" y="120" fill="#7ee787" font-size="11" font-family="monospace">With streaming:</text>
      <rect x="20" y="127" width="60" height="28" rx="4" fill="#1f6feb"/>
      <text x="50" y="145" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Prompt</text>
      <rect x="80" y="127" width="30" height="28" rx="4" fill="#12261e" stroke="#238636"/>
      <text x="95" y="142" fill="#7ee787" font-size="8" text-anchor="middle" font-family="monospace">100</text>
      <text x="95" y="151" fill="#7ee787" font-size="8" text-anchor="middle" font-family="monospace">ms</text>
      <!-- Streaming tokens -->
      <rect x="112" y="130" width="468" height="22" rx="4" fill="#12261e"/>
      <text x="120" y="145" fill="#7ee787" font-size="10" font-family="monospace">The │ GIL │ is │ a │ mutex │ in │ CPython │ that │ allows │ ...</text>
      <!-- Async section -->
      <text x="20" y="185" fill="#d2a8ff" font-size="11" font-family="monospace">Async concurrent (5 calls):</text>
      <rect x="20" y="192" width="110" height="16" rx="3" fill="#1e1533" stroke="#8b5cf6"/>
      <text x="75" y="204" fill="#d2a8ff" font-size="8" text-anchor="middle" font-family="monospace">Call 1 ─────────</text>
      <rect x="20" y="210" width="90" height="16" rx="3" fill="#1e1533" stroke="#8b5cf6"/>
      <text x="65" y="222" fill="#d2a8ff" font-size="8" text-anchor="middle" font-family="monospace">Call 2 ───────</text>
      <rect x="20" y="228" width="105" height="8" rx="2" fill="#1e1533" stroke="#8b5cf6" opacity="0.7"/>
      <rect x="20" y="238" width="80" height="8" rx="2" fill="#1e1533" stroke="#8b5cf6" opacity="0.5"/>
      <rect x="20" y="248" width="95" height="8" rx="2" fill="#1e1533" stroke="#8b5cf6" opacity="0.3"/>
      <text x="200" y="225" fill="#8b949e" font-size="10" font-family="monospace">All 5 run simultaneously!</text>
      <text x="200" y="242" fill="#d2a8ff" font-size="10" font-family="monospace">Total time ≈ slowest single call</text>
    </svg>`,
    examples: [
      {
        title: "Streaming with progress display",
        code: `import time
from anthropic import Anthropic

client = Anthropic()

def stream_with_stats(prompt: str) -> str:
    """Stream a response and show real-time stats."""
    full_text = ""
    token_count = 0
    start = time.time()

    with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=512,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        for text in stream.text_stream:
            full_text += text
            token_count += 1  # approximate (1 chunk ≈ 1 token)
            print(text, end="", flush=True)

    elapsed = time.time() - start
    final = stream.get_final_message()

    print(f"\\n\\n--- Stats ---")
    print(f"Time to complete: {elapsed:.1f}s")
    print(f"Input tokens:  {final.usage.input_tokens}")
    print(f"Output tokens: {final.usage.output_tokens}")
    print(f"Tokens/sec:    {final.usage.output_tokens / elapsed:.0f}")
    return full_text

stream_with_stats("Explain Python's asyncio in 3 sentences.")`,
        expectedOutput: `Asyncio is Python's built-in library for writing concurrent code using async/await syntax, running on a single-threaded event loop. It excels at I/O-bound tasks like HTTP requests and database queries by switching between coroutines while waiting for I/O. Use asyncio.gather() to run multiple coroutines concurrently and asyncio.run() to start the event loop.

--- Stats ---
Time to complete: 2.3s
Input tokens: 18
Output tokens: 67
Tokens/sec: 29`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What is time-to-first-token (TTFT)?", options: ["Total response generation time", "The delay from sending a prompt to receiving the first streamed token — typically 100-500ms with streaming vs. 5-30s without", "Model inference latency", "Network round-trip time"], answer: 1, explanation: "TTFT is the delay before the first token appears. Without streaming, users wait for the entire response. With streaming, the first token appears in ~100-500ms and subsequent tokens flow continuously. This dramatically improves perceived latency even though total generation time is the same." },
      { difficulty: "medium", question: "Why use asyncio.Semaphore when batching LLM API calls?", options: ["To make calls faster", "To limit the number of concurrent requests — preventing rate limit errors and controlling resource usage", "To enable streaming", "To save memory"], answer: 1, explanation: "Without a semaphore, asyncio.gather() on 1000 tasks would fire 1000 simultaneous API requests — guaranteed rate limit errors. A Semaphore(10) ensures at most 10 requests are in-flight simultaneously. The remaining tasks wait until a slot opens. This lets you process large batches without hitting rate limits." },
      { difficulty: "hard", question: "Why use AsyncAnthropic instead of regular Anthropic in an async context?", options: ["It's faster", "The sync Anthropic client blocks the event loop — AsyncAnthropic uses aiohttp internally, so await client.messages.create() yields to the event loop during I/O, allowing other coroutines to run concurrently", "It's required by the API", "It supports more models"], answer: 1, explanation: "The sync Anthropic client uses requests (blocking). If you call it inside an async function, it blocks the entire event loop during the HTTP request — defeating the purpose of asyncio. AsyncAnthropic uses aiohttp, which is truly async: await client.messages.create() suspends the coroutine during I/O, letting other coroutines run. This is essential for concurrent batch processing." }
    ],
    commonMistakes: [
      { mistake: "Using the sync client inside an async function", whyItHappens: "The sync API looks simpler", howToAvoid: "Always use AsyncAnthropic inside async functions. The sync client blocks the event loop. If you must use sync in async, wrap with asyncio.to_thread(sync_fn)." },
      { mistake: "Not limiting concurrency when batching API calls", whyItHappens: "asyncio.gather() runs everything at once by default", howToAvoid: "Use asyncio.Semaphore(N) to cap concurrent requests at N (typically 10-50). Without this, you'll hit rate limits and get 429 errors." }
    ],
    cheatSheet: `## Streaming & Async Cheat Sheet
- **Streaming**: client.messages.stream() → stream.text_stream → token-by-token
- **TTFT**: ~100-500ms with streaming vs. 5-30s without
- **Async**: AsyncAnthropic + await client.messages.create()
- **Batch**: asyncio.gather() + Semaphore(N) for concurrent requests
- **FastAPI**: StreamingResponse + SSE for real-time chat UIs
- **Never**: use sync client in async context (blocks event loop)`,
    furtherReading: [
      { type: "docs", title: "Anthropic Streaming Reference", url: "https://docs.anthropic.com/en/api/streaming", whyRead: "Complete streaming API reference with event types, error handling during streams, and async patterns." }
    ],
    flashcards: [
      { front: "What is streaming in LLM APIs?", back: "Receiving tokens as they're generated instead of waiting for the full response. Reduces perceived latency (TTFT) from 5-30s to 100-500ms. The total generation time is the same." },
      { front: "Why use AsyncAnthropic instead of sync Anthropic?", back: "Sync client blocks the event loop during HTTP I/O. AsyncAnthropic yields to the event loop via aiohttp, enabling concurrent coroutines. Essential for batch processing and async web frameworks." },
      { front: "How do you limit concurrent API calls in async?", back: "asyncio.Semaphore(N) limits N concurrent requests. Use 'async with semaphore:' before each API call. Prevents rate limiting when processing large batches." }
    ]
  },

  // ─── 3. Function Calling / Tool Use ──────────────────────────────────
  {
    id: "function-calling",
    category: "LLM Integration",
    title: "Function Calling & Tool Use",
    priority: "High",
    icon: "🔧",
    estimatedMinutes: 45,
    prerequisites: ["llm-api", "structured-output"],
    nextTopics: ["rag-fundamentals", "ai-agents-intro"],
    whyItMatters: "Function calling (tool use) is how LLMs interact with the real world — executing code, querying databases, calling APIs. It's the bridge from chatbot to agent. Every AI agent framework (LangChain, CrewAI, Anthropic's agent SDK) is built on function calling under the hood. Understanding the raw tool use protocol makes you effective with any framework, and lets you build custom agent loops without framework overhead.",
    analogy: "Tool use is like a chef working with specialized kitchen staff. The chef (LLM) decides what dish to make, but asks the sous chef (a tool) to actually dice the onions or check the fridge inventory. The chef gets the result back and incorporates it into the dish. The LLM decides WHICH tool to call and with WHAT arguments; your code actually EXECUTES the tool and returns the result.",
    content: `## Function Calling & Tool Use

### The Tool Use Loop

\`\`\`
User message → LLM decides to call a tool
            → LLM outputs tool_use block (name + input)
            → Your code executes the function
            → You send the result back as tool_result
            → LLM incorporates the result into its response
\`\`\`

### Defining Tools (Anthropic)

\`\`\`python
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location. Use when the user asks about weather.",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City name, e.g., 'San Francisco, CA'"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature unit"
                }
            },
            "required": ["location"]
        }
    },
    {
        "name": "search_documents",
        "description": "Search internal knowledge base for relevant documents.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search query"},
                "max_results": {"type": "integer", "description": "Max results to return", "default": 5}
            },
            "required": ["query"]
        }
    }
]
\`\`\`

### The Complete Tool Use Loop

\`\`\`python
from anthropic import Anthropic

client = Anthropic()

def get_weather(location: str, unit: str = "celsius") -> dict:
    """Actual implementation — calls weather API."""
    # In production, call a real weather API
    return {"temp": 22, "unit": unit, "condition": "sunny", "location": location}

def search_documents(query: str, max_results: int = 5) -> list:
    """Actual implementation — searches vector DB."""
    return [{"title": "Doc 1", "snippet": f"Results for: {query}"}]

# Map tool names to functions
TOOL_FUNCTIONS = {
    "get_weather": get_weather,
    "search_documents": search_documents,
}

def agent_loop(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=tools,
            messages=messages,
        )

        # If model wants to use a tool
        if response.stop_reason == "tool_use":
            # Process all tool calls in the response
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    func = TOOL_FUNCTIONS[block.name]
                    result = func(**block.input)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result),
                    })

            # Add assistant response + tool results to conversation
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})
            continue  # loop back for model to process results

        # No more tool calls — return final text
        return response.content[0].text
\`\`\`

### Parallel Tool Use

Claude can call multiple tools simultaneously:

\`\`\`python
# User: "What's the weather in NYC and SF?"
# Claude returns TWO tool_use blocks in one response:
# [tool_use: get_weather(location="NYC"), tool_use: get_weather(location="SF")]
#
# You execute BOTH, send BOTH results back, Claude combines them.
\`\`\`

### Tool Choice Control

\`\`\`python
# Let model decide which tool(s) to use
tool_choice = {"type": "auto"}  # default

# Force a specific tool
tool_choice = {"type": "tool", "name": "get_weather"}

# Force the model to use at least one tool
tool_choice = {"type": "any"}

# Prevent tool use entirely
tool_choice = {"type": "none"}
\`\`\`

### Designing Good Tool Descriptions

Good descriptions are critical — the LLM uses them to decide WHEN and HOW to call tools:

\`\`\`python
# ❌ Bad: vague, no guidance
{"name": "search", "description": "Search things"}

# ✓ Good: specific, explains when to use
{
    "name": "search_knowledge_base",
    "description": "Search the company's internal knowledge base for policy documents, procedures, and FAQs. Use when the user asks about company policies, benefits, or procedures. Do NOT use for general knowledge questions.",
}
\`\`\`

### Error Handling in Tool Results

\`\`\`python
try:
    result = func(**block.input)
    tool_results.append({
        "type": "tool_result",
        "tool_use_id": block.id,
        "content": json.dumps(result),
    })
except Exception as e:
    tool_results.append({
        "type": "tool_result",
        "tool_use_id": block.id,
        "content": json.dumps({"error": str(e)}),
        "is_error": True,
    })
\`\`\``,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <defs>
        <marker id="arr7" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#58a6ff"/>
        </marker>
        <marker id="arr7r" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto">
          <path d="M8,0 L8,6 L0,3 z" fill="#7ee787"/>
        </marker>
      </defs>
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">Tool Use Loop: LLM ↔ Your Code</text>
      <!-- User -->
      <rect x="20" y="45" width="100" height="40" rx="8" fill="#1f6feb" opacity="0.8"/>
      <text x="70" y="70" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">User</text>
      <!-- Arrow to LLM -->
      <line x1="120" y1="65" x2="190" y2="65" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#arr7)"/>
      <text x="155" y="58" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">message</text>
      <!-- LLM -->
      <rect x="190" y="38" width="220" height="55" rx="10" fill="#161b22" stroke="#1f6feb"/>
      <text x="300" y="60" fill="#58a6ff" font-size="12" text-anchor="middle" font-weight="bold" font-family="monospace">Claude (LLM)</text>
      <text x="300" y="78" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Decides: call tool or respond?</text>
      <!-- Arrow down to tool call -->
      <line x1="300" y1="93" x2="300" y2="125" stroke="#f0883e" stroke-width="1.5" marker-end="url(#arr7)"/>
      <text x="350" y="112" fill="#f0883e" font-size="9" font-family="monospace">tool_use</text>
      <!-- Tool call block -->
      <rect x="190" y="125" width="220" height="45" rx="8" fill="#271d03" stroke="#f0883e"/>
      <text x="300" y="145" fill="#e3b341" font-size="11" text-anchor="middle" font-family="monospace">tool_use: get_weather</text>
      <text x="300" y="161" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">{"location": "NYC"}</text>
      <!-- Arrow to your code -->
      <line x1="300" y1="170" x2="300" y2="200" stroke="#f0883e" stroke-width="1.5" marker-end="url(#arr7)"/>
      <text x="350" y="190" fill="#8b949e" font-size="9" font-family="monospace">execute</text>
      <!-- Your code -->
      <rect x="190" y="200" width="220" height="45" rx="8" fill="#12261e" stroke="#238636"/>
      <text x="300" y="220" fill="#7ee787" font-size="11" text-anchor="middle" font-family="monospace">Your Code</text>
      <text x="300" y="236" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">get_weather("NYC") → result</text>
      <!-- Arrow back up -->
      <path d="M410 222 L480 222 L480 65 L410 65" stroke="#7ee787" stroke-width="1.5" fill="none" marker-end="url(#arr7r)"/>
      <text x="510" y="145" fill="#7ee787" font-size="9" font-family="monospace">tool_result</text>
      <!-- Final response arrow -->
      <path d="M190 55 L150 55 L150 280 L300 280" stroke="#58a6ff" stroke-width="1.5" fill="none" stroke-dasharray="5" marker-end="url(#arr7)"/>
      <text x="225" y="276" fill="#58a6ff" font-size="9" font-family="monospace">Final text response (after tools)</text>
    </svg>`,
    examples: [
      {
        title: "Complete tool use agent loop",
        code: `import json
from anthropic import Anthropic

client = Anthropic()

# Define tools
tools = [
    {
        "name": "calculate",
        "description": "Evaluate a mathematical expression. Use for any arithmetic or math.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {"type": "string", "description": "Math expression, e.g., '(15 * 3) + 42'"}
            },
            "required": ["expression"]
        }
    },
    {
        "name": "lookup_price",
        "description": "Look up the price of a product by name.",
        "input_schema": {
            "type": "object",
            "properties": {
                "product": {"type": "string", "description": "Product name"}
            },
            "required": ["product"]
        }
    }
]

# Tool implementations
PRICES = {"laptop": 999.99, "mouse": 29.99, "keyboard": 79.99, "monitor": 349.99}

def calculate(expression: str) -> str:
    try:
        result = eval(expression)  # safe in this demo context
        return str(result)
    except Exception as e:
        return f"Error: {e}"

def lookup_price(product: str) -> str:
    price = PRICES.get(product.lower())
    if price:
        return json.dumps({"product": product, "price": price, "currency": "USD"})
    return json.dumps({"error": f"Product '{product}' not found"})

TOOL_MAP = {"calculate": calculate, "lookup_price": lookup_price}

def run_agent(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    for _ in range(5):  # max 5 tool-use rounds
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            tools=tools,
            messages=messages,
        )

        if response.stop_reason == "tool_use":
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    fn = TOOL_MAP[block.name]
                    result = fn(**block.input)
                    print(f"  🔧 {block.name}({block.input}) → {result}")
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result,
                    })

            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})
        else:
            return response.content[0].text

    return "Max tool rounds exceeded"

# Test
print(run_agent("I want to buy a laptop and 2 mice. What's the total cost?"))`,
        expectedOutput: `  🔧 lookup_price({"product": "laptop"}) → {"product": "laptop", "price": 999.99, "currency": "USD"}
  🔧 lookup_price({"product": "mouse"}) → {"product": "mouse", "price": 29.99, "currency": "USD"}
  🔧 calculate({"expression": "999.99 + (2 * 29.99)"}) → 1059.97

The total cost for a laptop ($999.99) and 2 mice ($29.99 each = $59.98) is **$1,059.97**.`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "Who executes tools in the function calling flow?", options: ["The LLM runs the function on its server", "Your code executes the function — the LLM only decides WHICH tool to call and with WHAT arguments", "The cloud provider runs it", "Tools execute automatically"], answer: 1, explanation: "The LLM never executes code. It outputs a structured tool_use block with the tool name and input arguments. Your code receives this, calls the actual function, and sends the result back as a tool_result message. This separation is essential for security — you control what gets executed." },
      { difficulty: "medium", question: "Why is the tool use flow a loop rather than a single call?", options: ["To increase API costs", "The model may need multiple tools sequentially — using one tool's output to decide the next step, or combining results from multiple tools before giving a final answer", "Loops are faster", "It's required by the API"], answer: 1, explanation: "Complex queries may require: (1) call tool A, (2) use result to call tool B, (3) combine results into final answer. Example: 'What's the weather in my city?' → get_user_location() → get_weather(city) → respond. Each tool call requires a round-trip: model outputs tool_use → your code executes → you send result → model continues." },
      { difficulty: "hard", question: "What is tool_choice and when would you use type: 'tool' vs type: 'auto'?", options: ["They are identical", "'auto' lets the model decide whether to use tools; 'tool' forces a specific tool — use forced when you need guaranteed structured extraction (e.g., always extract entities), use auto when the model should decide (e.g., only search if needed)", "'tool' is faster", "'auto' costs less"], answer: 1, explanation: "tool_choice: {type: 'auto'} — model decides if any tool is needed. tool_choice: {type: 'tool', name: 'extract_entities'} — model MUST call that tool. Use 'auto' for conversational agents (tool isn't always needed). Use 'tool' for structured extraction pipelines where you always want the schema output (similar to JSON mode but with guaranteed schema adherence)." }
    ],
    commonMistakes: [
      { mistake: "Not sending tool results back properly after a tool_use response", whyItHappens: "The multi-step flow is confusing at first", howToAvoid: "After receiving stop_reason='tool_use': (1) append full assistant response to messages, (2) execute tools, (3) append tool_results as a user message, (4) call API again. Missing any step breaks the conversation." },
      { mistake: "Writing vague tool descriptions", whyItHappens: "Treating descriptions like comments rather than documentation", howToAvoid: "The LLM uses descriptions to decide WHEN to call a tool. Be specific: what it does, when to use it, when NOT to use it. Bad: 'Search things'. Good: 'Search internal docs for company policies. Use for company-specific questions, NOT general knowledge.'" }
    ],
    cheatSheet: `## Function Calling Cheat Sheet
- **Define tools**: name + description + input_schema (JSON Schema)
- **Loop**: send message → check stop_reason → if "tool_use" → execute → send result → repeat
- **tool_choice**: auto (model decides), tool (force specific), any (force some tool), none (no tools)
- **Parallel tools**: Claude can call multiple tools in one response
- **Error handling**: send is_error: true in tool_result for failures
- **Good descriptions**: explain WHEN to use the tool, not just what it does
- **Security**: validate tool inputs, never eval() untrusted expressions`,
    furtherReading: [
      { type: "docs", title: "Anthropic Tool Use Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", whyRead: "Complete guide with examples for all tool use patterns: single tool, multi-tool, parallel, forced, and streaming with tools." }
    ],
    flashcards: [
      { front: "Who executes tools in function calling?", back: "Your code, not the LLM. The model outputs a tool_use block (name + args). You execute the function, then send the result back as tool_result. The LLM never runs code." },
      { front: "What is the tool use loop?", back: "1) Send message with tools. 2) If stop_reason='tool_use', execute tool(s). 3) Send results back. 4) Repeat until model gives final text. May take 1-5 rounds for complex queries." },
      { front: "When to use tool_choice='tool' vs 'auto'?", back: "'auto': model decides if tools needed (conversational agents). 'tool': force specific tool always (structured extraction, guaranteed schema output). 'any': force some tool. 'none': disable tools." }
    ]
  },

  // ─── 4. AI Safety & Ethics ───────────────────────────────────────────
  {
    id: "ai-safety-ethics",
    category: "LLM Integration",
    title: "AI Safety & Responsible AI",
    priority: "Medium",
    icon: "⚖️",
    estimatedMinutes: 30,
    prerequisites: ["prompt-injection", "llm-api"],
    nextTopics: ["rag-fundamentals"],
    whyItMatters: "Building AI products that people trust requires understanding alignment, safety guardrails, and the ethical implications of AI-generated content. Companies are being held legally and reputationally accountable for their AI systems' outputs. Understanding AI safety isn't just ethics — it's engineering. Hallucination mitigation, bias detection, content filtering, and safe agent design are practical engineering problems you must solve.",
    analogy: "AI safety is like car safety engineering. You don't just build a fast engine — you add seatbelts (guardrails), airbags (content filters), crash testing (red-teaming), speed limits (rate limiting and scope restrictions), and crumple zones (human-in-the-loop for irreversible actions). A car without safety features will eventually hurt someone; an AI system without guardrails will eventually cause harm.",
    content: `## AI Safety & Responsible AI

### Key AI Safety Challenges

| Challenge | Description | Mitigation |
|-----------|-------------|------------|
| **Hallucination** | Model generates plausible-sounding but false information | RAG, citations, "I don't know" training |
| **Bias** | Model reflects or amplifies biases from training data | Diverse eval sets, bias testing, RLHF |
| **Prompt injection** | Adversarial inputs override system behavior | Structural separation, validation |
| **Harmful content** | Model generates toxic, illegal, or dangerous content | Content filters, safety classifiers |
| **Privacy** | Model memorizes / leaks training data | PII filtering, data governance |
| **Overreliance** | Users trust AI outputs without verification | Confidence signals, disclaimers |

### Hallucination Mitigation

Hallucination is the biggest practical risk. Strategies:

\`\`\`python
# Strategy 1: Constrain to provided context only (RAG)
system = """Answer ONLY from the provided documents.
If the documents don't contain the answer, say 'I don't have information about that.'
Never make up facts not in the documents.
Cite which document you're using: [Doc 1], [Doc 2], etc."""

# Strategy 2: Ask for confidence
system = """After your answer, rate your confidence:
- HIGH: answer is clearly supported by provided data
- MEDIUM: answer is partially supported, some inference needed
- LOW: answer requires significant inference, may not be accurate
If LOW, warn the user to verify independently."""

# Strategy 3: Verify with a second call
def verified_answer(question: str, context: str) -> dict:
    answer = generate_answer(question, context)
    verification = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=100,
        messages=[{
            "role": "user",
            "content": f"Is this answer fully supported by the context? Context: {context}. Answer: {answer}. Reply YES or NO with explanation."
        }]
    )
    return {"answer": answer, "verified": "YES" in verification.content[0].text}
\`\`\`

### Content Safety Layers

\`\`\`
User input → [Input filter] → LLM → [Output filter] → User
                ↓                          ↓
         Block harmful requests    Block harmful outputs
\`\`\`

\`\`\`python
# Input classification
def classify_input(text: str) -> str:
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=20,
        system="Classify as SAFE or UNSAFE. Only respond with one word.",
        messages=[{"role": "user", "content": f"Is this request safe? '{text}'"}]
    )
    return response.content[0].text.strip()

# Output filtering
BLOCKED_PATTERNS = ["credit card", "social security", "password"]
def filter_output(response: str) -> str:
    for pattern in BLOCKED_PATTERNS:
        if pattern in response.lower():
            return "I cannot share that information."
    return response
\`\`\`

### Red-Teaming Your AI System

Systematically test adversarial scenarios before launch:

1. **Prompt injection**: try to override system prompt
2. **Jailbreaking**: try to bypass content policies
3. **Data extraction**: try to leak system prompt or training data
4. **Bias testing**: test across demographics, languages, cultures
5. **Edge cases**: empty inputs, very long inputs, non-English, code injection
6. **Hallucination probing**: ask about topics just outside the model's knowledge

### Responsible AI Checklist

\`\`\`markdown
□ Hallucination mitigation (RAG, citations, confidence signals)
□ Content safety filters (input + output)
□ Prompt injection defenses (XML separation, validation)
□ Bias evaluation (test across diverse inputs)
□ Human-in-the-loop for high-stakes actions
□ Audit logging (track all AI inputs/outputs)
□ Graceful degradation (what happens when the LLM is down?)
□ User transparency (disclose when content is AI-generated)
□ Rate limiting (prevent abuse)
□ Data privacy (no PII in prompts/logs unless necessary)
\`\`\`

### Alignment in Practice
- **RLHF**: Reinforcement Learning from Human Feedback — how models learn to be helpful and safe
- **Constitutional AI**: Anthropic's approach to self-improvement with principles
- **Red-teaming**: adversarial testing before deployment
- **Evals**: continuous monitoring of safety metrics in production`,
    diagram: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">Safety Layers in an AI Application</text>
      <defs>
        <marker id="arr8" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#58a6ff"/></marker>
      </defs>
      <!-- Input flow -->
      <rect x="20" y="50" width="80" height="40" rx="6" fill="#1f6feb" opacity="0.8"/>
      <text x="60" y="74" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">User</text>
      <line x1="100" y1="70" x2="130" y2="70" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#arr8)"/>
      <!-- Input filter -->
      <rect x="130" y="45" width="100" height="50" rx="6" fill="#2d1515" stroke="#f85149"/>
      <text x="180" y="65" fill="#f85149" font-size="10" text-anchor="middle" font-family="monospace">Input Filter</text>
      <text x="180" y="82" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">injection check</text>
      <line x1="230" y1="70" x2="260" y2="70" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#arr8)"/>
      <!-- LLM -->
      <rect x="260" y="45" width="80" height="50" rx="6" fill="#161b22" stroke="#238636"/>
      <text x="300" y="65" fill="#7ee787" font-size="11" text-anchor="middle" font-family="monospace">LLM</text>
      <text x="300" y="82" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">+guardrails</text>
      <line x1="340" y1="70" x2="370" y2="70" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#arr8)"/>
      <!-- Output filter -->
      <rect x="370" y="45" width="100" height="50" rx="6" fill="#271d03" stroke="#f0883e"/>
      <text x="420" y="65" fill="#e3b341" font-size="10" text-anchor="middle" font-family="monospace">Output Filter</text>
      <text x="420" y="82" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">PII, harmful</text>
      <line x1="470" y1="70" x2="500" y2="70" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#arr8)"/>
      <!-- Output -->
      <rect x="500" y="50" width="80" height="40" rx="6" fill="#238636" opacity="0.8"/>
      <text x="540" y="74" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Safe</text>
      <!-- Safety layers list -->
      <rect x="20" y="120" width="560" height="130" rx="8" fill="#0d1117" stroke="#21262d"/>
      <text x="300" y="142" fill="#e6edf3" font-size="12" text-anchor="middle" font-weight="bold" font-family="monospace">Defense-in-Depth Safety Layers</text>
      <text x="40" y="162" fill="#f85149" font-size="11" font-family="monospace">1. Input validation</text>
      <text x="200" y="162" fill="#8b949e" font-size="10" font-family="monospace">— block injection, harmful requests</text>
      <text x="40" y="180" fill="#e3b341" font-size="11" font-family="monospace">2. System prompt guardrails</text>
      <text x="200" y="180" fill="#8b949e" font-size="10" font-family="monospace">— role boundaries, "I don't know"</text>
      <text x="40" y="198" fill="#7ee787" font-size="11" font-family="monospace">3. Output filtering</text>
      <text x="200" y="198" fill="#8b949e" font-size="10" font-family="monospace">— PII removal, toxic content blocking</text>
      <text x="40" y="216" fill="#58a6ff" font-size="11" font-family="monospace">4. Human review</text>
      <text x="200" y="216" fill="#8b949e" font-size="10" font-family="monospace">— high-stakes actions, edge cases</text>
      <text x="40" y="234" fill="#d2a8ff" font-size="11" font-family="monospace">5. Monitoring & logging</text>
      <text x="200" y="234" fill="#8b949e" font-size="10" font-family="monospace">— detect anomalies, track safety metrics</text>
    </svg>`,
    examples: [
      {
        title: "Hallucination-resistant RAG response",
        code: `from anthropic import Anthropic

client = Anthropic()

def grounded_answer(question: str, documents: list[str]) -> dict:
    """Generate a grounded answer that only uses provided documents."""

    formatted_docs = "\\n\\n".join(
        f"[Document {i+1}]: {doc}" for i, doc in enumerate(documents)
    )

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=500,
        temperature=0,
        system="""You are a factual assistant. Rules:
1. Answer ONLY from the provided documents
2. Cite every claim: [Document N]
3. If the answer isn't in the documents, say "Not found in provided documents"
4. Rate confidence: HIGH/MEDIUM/LOW
5. Never fabricate information""",
        messages=[{
            "role": "user",
            "content": f"Documents:\\n{formatted_docs}\\n\\nQuestion: {question}"
        }]
    )

    text = response.content[0].text

    # Check for "not found" response
    not_found = any(phrase in text.lower() for phrase in [
        "not found", "don't have", "no information", "not in the"
    ])

    return {
        "answer": text,
        "grounded": not not_found,
        "cited_docs": [f"Doc {i+1}" for i in range(len(documents)) if f"[Document {i+1}]" in text],
    }

# Test
docs = [
    "Python 3.12 was released on October 2, 2023 with improved error messages.",
    "The GIL in CPython prevents true parallel execution of Python threads.",
]
result = grounded_answer("When was Python 3.12 released?", docs)
print(f"Answer: {result['answer']}")
print(f"Grounded: {result['grounded']}")
print(f"Citations: {result['cited_docs']}")

# Test with question NOT in docs
result2 = grounded_answer("What is Python 4's release date?", docs)
print(f"\\nAnswer: {result2['answer']}")
print(f"Grounded: {result2['grounded']}")`,
        expectedOutput: `Answer: Python 3.12 was released on October 2, 2023 [Document 1]. The release included improved error messages.

Confidence: HIGH

Grounded: True
Citations: ['Doc 1']

Answer: Not found in provided documents. The documents don't contain information about Python 4's release date.

Confidence: N/A

Grounded: False`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What is hallucination in LLMs?", options: ["The model refusing to answer", "The model generating plausible-sounding but factually incorrect information that it presents as fact", "The model being too slow", "The model repeating itself"], answer: 1, explanation: "Hallucination is when an LLM generates text that sounds confident and plausible but is factually wrong. The model isn't 'lying' — it's generating the most probable next tokens, which sometimes produce false statements that read as authoritative. This is the #1 practical risk in production AI systems." },
      { difficulty: "medium", question: "What is the most effective technique for reducing hallucination?", options: ["Higher temperature", "RAG (Retrieval-Augmented Generation) — grounding the model's response in retrieved factual documents and instructing it to cite sources", "More parameters", "Longer prompts"], answer: 1, explanation: "RAG provides the model with actual source documents, then instructs it to answer only from those documents and cite its sources. This grounds responses in verifiable facts rather than the model's parametric memory. Combine with: explicit 'I don't know' instructions, confidence ratings, and verification via a second LLM call." },
      { difficulty: "hard", question: "What is Constitutional AI and why does Anthropic use it?", options: ["A legal framework for AI companies", "A training method where the model critiques and revises its own outputs against a set of principles, reducing the need for human feedback on harmful outputs", "A way to encrypt model weights", "A model architecture"], answer: 1, explanation: "Constitutional AI (Bai et al., 2022) is Anthropic's training methodology. Instead of relying entirely on human feedback (RLHF) to teach the model what's harmful, CAI defines a set of principles (the 'constitution'). The model generates responses, then critiques its own output against these principles, and revises. This is more scalable than pure RLHF and makes safety principles explicit and auditable." }
    ],
    commonMistakes: [
      { mistake: "Assuming the LLM will never hallucinate with good prompts", whyItHappens: "Model outputs are convincing and often correct", howToAvoid: "All LLMs hallucinate. Even with RAG and grounding, always add citations, confidence signals, and encourage users to verify critical information. Don't build trust architectures that assume 100% accuracy." },
      { mistake: "Not logging AI interactions in production", whyItHappens: "Seems like a privacy concern or unnecessary overhead", howToAvoid: "Log inputs/outputs (redacting PII) to detect: hallucination patterns, injection attempts, bias incidents, and quality degradation. You can't improve what you can't measure." }
    ],
    cheatSheet: `## AI Safety Cheat Sheet
- **Hallucination**: use RAG + citations + "I don't know" + confidence ratings
- **Prompt injection**: XML tags + input validation + least privilege
- **Content safety**: input filters + output filters + human review
- **Bias**: test across demographics, languages, edge cases
- **Red-teaming**: systematically attack your system before launch
- **Logging**: track all AI interactions (redact PII)
- **Human-in-the-loop**: require for irreversible / high-stakes actions`,
    furtherReading: [
      { type: "paper", title: "Constitutional AI: Harmlessness from AI Feedback", url: "https://arxiv.org/abs/2212.08073", whyRead: "Anthropic's core safety methodology. Explains how Claude is trained to be helpful, harmless, and honest." }
    ],
    flashcards: [
      { front: "What is hallucination in LLMs?", back: "Generating plausible-sounding but factually incorrect information. The model isn't lying — it's producing the most probable tokens, which sometimes create false but confident-sounding statements." },
      { front: "How does RAG reduce hallucination?", back: "Provide source documents in the prompt → instruct model to answer only from those documents → require citations. Grounds responses in verifiable facts instead of parametric memory." },
      { front: "What is Constitutional AI?", back: "Anthropic's training method: model generates, self-critiques against a set of principles (constitution), then revises. More scalable than pure RLHF, makes safety rules explicit and auditable." },
      { front: "What is the defense-in-depth approach to AI safety?", back: "Multiple layers: input validation → system prompt guardrails → output filtering → human review → monitoring/logging. No single layer is sufficient alone." }
    ]
  }
];
