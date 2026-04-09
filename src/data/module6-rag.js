export const MODULE6_TOPICS = [
  // ─── 1. RAG Fundamentals ─────────────────────────────────────────────
  {
    id: "rag-fundamentals",
    category: "RAG",
    title: "RAG Fundamentals",
    priority: "High",
    icon: "📚",
    estimatedMinutes: 40,
    prerequisites: ["tokens-embeddings", "llm-api"],
    nextTopics: ["chunking-strategies", "vector-databases"],
    whyItMatters: "RAG (Retrieval-Augmented Generation) is the most important pattern in production AI. It solves hallucination by grounding LLM responses in actual documents. Every enterprise AI app — chatbots, document Q&A, customer support, code assistants — uses RAG. Without RAG, LLMs can only use knowledge frozen at training time. With RAG, they can answer questions about your private data, today's news, or any custom corpus.",
    analogy: "RAG is like an open-book exam vs. a closed-book exam. Without RAG, the LLM takes a closed-book exam — it can only use what it memorized during training. With RAG, the LLM gets to search through a reference library (your documents) before answering. It finds the most relevant pages, reads them, and then writes an answer grounded in those specific sources.",
    content: `## RAG Fundamentals

### What is RAG?
**Retrieval-Augmented Generation** adds a retrieval step before the LLM generates a response:

\`\`\`
User query → Retrieve relevant documents → Inject into prompt → LLM generates grounded answer
\`\`\`

### Why RAG > Fine-Tuning for Most Use Cases

| Factor | RAG | Fine-Tuning |
|--------|-----|-------------|
| **Data freshness** | Real-time (just update docs) | Stale (must retrain) |
| **Cost** | Low (just embeddings + storage) | High (GPU training hours) |
| **Transparency** | Can cite sources | Black box |
| **Setup time** | Hours | Days to weeks |
| **Hallucination** | Reduced (grounded in docs) | Still possible |
| **Best for** | Knowledge retrieval, Q&A | Style, format, behavior changes |

### The RAG Pipeline

\`\`\`
┌──────────────────────────────────────────────────┐
│                 INDEXING (offline)                │
│  Documents → Chunk → Embed → Store in Vector DB  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                RETRIEVAL (online)                 │
│  Query → Embed → Search Vector DB → Top-K chunks │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│               GENERATION (online)                │
│  System prompt + Retrieved chunks + Query → LLM  │
└──────────────────────────────────────────────────┘
\`\`\`

### Step 1: Indexing

\`\`\`python
from openai import OpenAI
import numpy as np

client = OpenAI()

def embed_texts(texts: list[str]) -> np.ndarray:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    return np.array([r.embedding for r in response.data])

# Chunk documents
documents = [
    "Python 3.12 introduced improved error messages and f-string parsing.",
    "FastAPI uses Pydantic for request validation and automatic docs.",
    "Docker containers share the host kernel, unlike virtual machines.",
    # ... hundreds more chunks
]

# Embed all chunks (one-time cost)
embeddings = embed_texts(documents)
# Store embeddings + documents in vector DB (Pinecone, Chroma, pgvector, etc.)
\`\`\`

### Step 2: Retrieval

\`\`\`python
def retrieve(query: str, documents: list[str], embeddings: np.ndarray, k: int = 3) -> list[str]:
    query_emb = embed_texts([query])[0]
    similarities = embeddings @ query_emb / (
        np.linalg.norm(embeddings, axis=1) * np.linalg.norm(query_emb)
    )
    top_indices = np.argsort(similarities)[-k:][::-1]
    return [documents[i] for i in top_indices]
\`\`\`

### Step 3: Generation

\`\`\`python
from anthropic import Anthropic

claude = Anthropic()

def rag_answer(query: str, retrieved_docs: list[str]) -> str:
    context = "\\n\\n".join(f"[Doc {i+1}]: {doc}" for i, doc in enumerate(retrieved_docs))

    response = claude.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        temperature=0,
        system="""Answer the user's question using ONLY the provided documents.
Cite your sources as [Doc N]. If the answer isn't in the documents, say so.""",
        messages=[{
            "role": "user",
            "content": f"Documents:\\n{context}\\n\\nQuestion: {query}"
        }]
    )
    return response.content[0].text
\`\`\`

### Key Metrics for RAG Systems

| Metric | What It Measures |
|--------|-----------------|
| **Retrieval recall** | % of relevant docs found in top-K |
| **Retrieval precision** | % of top-K docs that are relevant |
| **Answer faithfulness** | Does the answer match the retrieved docs? |
| **Answer relevance** | Does the answer address the query? |
| **Latency** | End-to-end time (embed + search + generate) |

### Common RAG Failure Modes
1. **Wrong chunks retrieved** → improve chunking, embeddings, or add metadata filtering
2. **Right chunks, wrong answer** → improve system prompt, add citations requirement
3. **Answer not in corpus** → model hallucinates instead of saying "I don't know"
4. **Too many/few chunks** → tune K and chunk size for your domain`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <defs>
        <marker id="ra1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#58a6ff"/></marker>
      </defs>
      <text x="300" y="22" fill="#e6edf3" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">RAG Pipeline: Index → Retrieve → Generate</text>
      <!-- Indexing row -->
      <text x="30" y="55" fill="#8b949e" font-size="11" font-family="monospace">INDEXING (offline):</text>
      <rect x="30" y="62" width="80" height="35" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="70" y="84" fill="#c9d1d9" font-size="10" text-anchor="middle" font-family="monospace">Documents</text>
      <line x1="110" y1="80" x2="140" y2="80" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ra1)"/>
      <rect x="140" y="62" width="70" height="35" rx="6" fill="#1f6feb" opacity="0.8"/>
      <text x="175" y="84" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Chunk</text>
      <line x1="210" y1="80" x2="240" y2="80" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ra1)"/>
      <rect x="240" y="62" width="70" height="35" rx="6" fill="#238636" opacity="0.8"/>
      <text x="275" y="84" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Embed</text>
      <line x1="310" y1="80" x2="340" y2="80" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ra1)"/>
      <rect x="340" y="62" width="100" height="35" rx="6" fill="#6e40c9" opacity="0.8"/>
      <text x="390" y="84" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Vector DB</text>
      <!-- Retrieval row -->
      <text x="30" y="130" fill="#7ee787" font-size="11" font-family="monospace">RETRIEVAL (online):</text>
      <rect x="30" y="137" width="80" height="35" rx="6" fill="#12261e" stroke="#238636"/>
      <text x="70" y="159" fill="#7ee787" font-size="10" text-anchor="middle" font-family="monospace">Query</text>
      <line x1="110" y1="155" x2="140" y2="155" stroke="#7ee787" stroke-width="1.5" marker-end="url(#ra1)"/>
      <rect x="140" y="137" width="70" height="35" rx="6" fill="#238636" opacity="0.8"/>
      <text x="175" y="159" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Embed</text>
      <line x1="210" y1="155" x2="240" y2="155" stroke="#7ee787" stroke-width="1.5" marker-end="url(#ra1)"/>
      <rect x="240" y="137" width="100" height="35" rx="6" fill="#6e40c9" opacity="0.8"/>
      <text x="290" y="159" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Search</text>
      <line x1="340" y1="155" x2="370" y2="155" stroke="#7ee787" stroke-width="1.5" marker-end="url(#ra1)"/>
      <rect x="370" y="137" width="100" height="35" rx="6" fill="#12261e" stroke="#238636"/>
      <text x="420" y="159" fill="#7ee787" font-size="10" text-anchor="middle" font-family="monospace">Top-K chunks</text>
      <!-- Generation row -->
      <text x="30" y="205" fill="#58a6ff" font-size="11" font-family="monospace">GENERATION (online):</text>
      <rect x="30" y="212" width="100" height="35" rx="6" fill="#161b22" stroke="#1f6feb"/>
      <text x="80" y="234" fill="#58a6ff" font-size="10" text-anchor="middle" font-family="monospace">System Prompt</text>
      <text x="140" y="234" fill="#c9d1d9" font-size="14" font-family="monospace">+</text>
      <rect x="155" y="212" width="100" height="35" rx="6" fill="#12261e" stroke="#238636"/>
      <text x="205" y="234" fill="#7ee787" font-size="10" text-anchor="middle" font-family="monospace">Retrieved Docs</text>
      <text x="265" y="234" fill="#c9d1d9" font-size="14" font-family="monospace">+</text>
      <rect x="280" y="212" width="70" height="35" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="315" y="234" fill="#c9d1d9" font-size="10" text-anchor="middle" font-family="monospace">Query</text>
      <line x1="350" y1="230" x2="390" y2="230" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ra1)"/>
      <rect x="390" y="212" width="70" height="35" rx="6" fill="#1f6feb" opacity="0.9"/>
      <text x="425" y="234" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">LLM</text>
      <line x1="460" y1="230" x2="490" y2="230" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ra1)"/>
      <rect x="490" y="212" width="90" height="35" rx="6" fill="#238636" opacity="0.9"/>
      <text x="535" y="228" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Grounded</text>
      <text x="535" y="242" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Answer</text>
      <!-- Bottom note -->
      <text x="300" y="280" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Retrieval reduces hallucination by grounding responses in actual source documents</text>
    </svg>`,
    examples: [
      {
        title: "Minimal RAG pipeline (end-to-end)",
        code: `import numpy as np
from openai import OpenAI
from anthropic import Anthropic

openai_client = OpenAI()
anthropic_client = Anthropic()

# ── Step 1: Index documents ──
documents = [
    "Python's GIL (Global Interpreter Lock) prevents true parallel execution of threads in CPython. Use multiprocessing for CPU-bound parallelism.",
    "FastAPI is built on Starlette and Pydantic. It generates OpenAPI docs automatically and supports async/await natively.",
    "Docker containers share the host OS kernel, making them lighter than VMs. Use multi-stage builds to reduce image size.",
    "Pydantic v2 uses Rust-based validation (pydantic-core), making it 5-50x faster than v1. Use BaseModel for data validation.",
    "asyncio uses a single-threaded event loop. Use asyncio.gather() for concurrent I/O tasks and asyncio.to_thread() for blocking calls.",
]

def embed(texts):
    r = openai_client.embeddings.create(model="text-embedding-3-small", input=texts)
    return np.array([d.embedding for d in r.data])

doc_embeddings = embed(documents)

# ── Step 2: Retrieve ──
def retrieve(query, k=2):
    q_emb = embed([query])[0]
    sims = doc_embeddings @ q_emb / (np.linalg.norm(doc_embeddings, axis=1) * np.linalg.norm(q_emb))
    top_k = np.argsort(sims)[-k:][::-1]
    return [(documents[i], float(sims[i])) for i in top_k]

# ── Step 3: Generate ──
def ask(question):
    retrieved = retrieve(question, k=2)
    context = "\\n".join(f"[Doc {i+1}] (score: {s:.2f}): {doc}" for i, (doc, s) in enumerate(retrieved))

    response = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=300,
        temperature=0,
        system="Answer using ONLY the provided docs. Cite as [Doc N]. If not found, say so.",
        messages=[{"role": "user", "content": f"Context:\\n{context}\\n\\nQuestion: {question}"}],
    )
    return response.content[0].text, retrieved

# ── Test ──
for q in ["How does Python's GIL affect threading?", "What makes Pydantic v2 faster?"]:
    answer, docs = ask(q)
    print(f"Q: {q}")
    print(f"A: {answer}")
    print(f"Sources: {[f'{s:.2f}' for _, s in docs]}\\n")`,
        expectedOutput: `Q: How does Python's GIL affect threading?
A: The GIL prevents true parallel execution of threads in CPython [Doc 1]. For CPU-bound parallelism, use multiprocessing instead of threading [Doc 1].
Sources: ['0.89', '0.52']

Q: What makes Pydantic v2 faster?
A: Pydantic v2 uses Rust-based validation via pydantic-core, making it 5-50x faster than v1 [Doc 1].
Sources: ['0.87', '0.48']`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What problem does RAG solve?", options: ["Makes models train faster", "Grounds LLM responses in actual documents, reducing hallucination and enabling answers about private/fresh data", "Replaces the need for LLMs", "Compresses documents for storage"], answer: 1, explanation: "RAG solves two key problems: (1) Hallucination — by grounding responses in actual source documents rather than parametric memory. (2) Knowledge staleness — the model can answer about documents added after training. It's the #1 pattern for enterprise AI applications." },
      { difficulty: "medium", question: "Why is RAG usually preferred over fine-tuning for knowledge retrieval?", options: ["RAG is always better", "RAG is cheaper, data stays fresh (just update docs), responses can cite sources, and setup takes hours not days — fine-tuning is better for changing model behavior/style", "Fine-tuning doesn't work", "RAG uses less compute"], answer: 1, explanation: "RAG and fine-tuning serve different purposes. RAG excels at knowledge retrieval: cheap, real-time data updates, source citations, hours to set up. Fine-tuning excels at behavior changes: new writing style, domain-specific reasoning patterns, output format adherence. For most enterprise Q&A use cases, RAG is the right choice." },
      { difficulty: "hard", question: "What are the main failure modes of a RAG system?", options: ["Only slow performance", "Wrong chunks retrieved (retrieval failure), right chunks but wrong answer (generation failure), answer not in corpus but model hallucinates anyway, and too many/few chunks degrading quality", "Only hallucination", "RAG systems don't have failure modes"], answer: 1, explanation: "RAG has four main failure modes: (1) Retrieval failure — wrong chunks found due to poor embeddings, chunking, or metadata. (2) Generation failure — correct chunks but LLM misinterprets or ignores them. (3) Coverage failure — answer isn't in the corpus and model fabricates one. (4) Context dilution — too many chunks overwhelm the LLM. Each requires different fixes: better embeddings, better prompts, 'I don't know' instructions, tuning K." }
    ],
    commonMistakes: [
      { mistake: "Skipping the 'I don't know' instruction in the system prompt", whyItHappens: "Focus on the happy path where documents contain the answer", howToAvoid: "Always instruct: 'If the answer is not in the provided documents, say I don't have that information.' Without this, the model fills gaps with hallucinated information that sounds authoritative." },
      { mistake: "Retrieving too many chunks and flooding the context", whyItHappens: "More context seems better", howToAvoid: "Start with K=3-5 chunks. More chunks dilute relevance and trigger the 'lost in the middle' problem. Use a relevance score threshold (e.g., cosine similarity > 0.7) to filter out low-quality matches." }
    ],
    cheatSheet: `## RAG Cheat Sheet
- **Pipeline**: Index (chunk→embed→store) → Retrieve (embed query→search→top-K) → Generate (prompt+docs→LLM)
- **Embedding model**: text-embedding-3-small (cheap, 1536d) or 3-large (better, 3072d)
- **Vector DB**: Chroma (local), Pinecone (managed), pgvector (Postgres)
- **K value**: start with 3-5, tune per domain
- **System prompt**: MUST include "answer only from docs" + "cite sources" + "say I don't know"
- **Metrics**: retrieval recall/precision, answer faithfulness, latency`,
    furtherReading: [
      { type: "paper", title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks", url: "https://arxiv.org/abs/2005.11401", whyRead: "The original RAG paper by Lewis et al. (Meta). Foundational understanding of why retrieval + generation outperforms either alone." }
    ],
    flashcards: [
      { front: "What is RAG?", back: "Retrieval-Augmented Generation: retrieve relevant documents, inject them into the LLM's prompt, generate a grounded answer. Reduces hallucination by anchoring responses to actual source documents." },
      { front: "What are the 3 stages of a RAG pipeline?", back: "1) Indexing: chunk docs → embed → store in vector DB (offline). 2) Retrieval: embed query → search vector DB → top-K chunks (online). 3) Generation: system prompt + retrieved docs + query → LLM answer (online)." },
      { front: "When to use RAG vs fine-tuning?", back: "RAG: knowledge retrieval, Q&A, fresh data, citations needed. Fine-tuning: behavior/style changes, domain-specific reasoning. RAG is cheaper, faster to set up, and data stays current." },
      { front: "What are RAG failure modes?", back: "1) Wrong chunks retrieved. 2) Right chunks, wrong answer. 3) Answer not in corpus → hallucination. 4) Too many chunks → context dilution. Fix: better embeddings, better prompts, 'I don't know' instruction, tune K." }
    ]
  },

  // ─── 2. Chunking Strategies ──────────────────────────────────────────
  {
    id: "chunking-strategies",
    category: "RAG",
    title: "Chunking Strategies",
    priority: "High",
    icon: "✂️",
    estimatedMinutes: 35,
    prerequisites: ["rag-fundamentals", "tokens-embeddings"],
    nextTopics: ["vector-databases"],
    whyItMatters: "Chunking is the most underestimated component of RAG systems. Bad chunking ruins retrieval quality regardless of how good your embedding model or LLM is. A chunk that's too large dilutes the embedding signal; too small loses context. Chunks that split mid-sentence create orphaned information. Getting chunking right is the single highest-ROI optimization for RAG quality.",
    analogy: "Chunking is like organizing a library's card catalog. If each card covers an entire book, searching for 'Python decorators' returns a 500-page book — mostly irrelevant. If each card covers a single sentence, you lose context — 'Use @wraps' makes no sense alone. The sweet spot: each card covers a coherent section (a few paragraphs on one topic) with enough context to stand alone.",
    content: `## Chunking Strategies for RAG

### Why Chunking Matters
The embedding model converts each chunk into a single vector. That vector must represent the chunk's meaning well enough for similarity search to work.

\`\`\`
Too large (full document):  Vector is averaged over many topics → poor retrieval
Too small (single sentence): No context → embedding is ambiguous
Sweet spot (200-800 tokens): Focused enough for good embedding, enough context to be useful
\`\`\`

### Chunking Methods

#### 1. Fixed-Size Chunking
Split every N tokens/characters with overlap:
\`\`\`python
def fixed_size_chunks(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
    return chunks
\`\`\`
**Pros**: Simple, predictable size. **Cons**: Splits mid-sentence, mid-paragraph.

#### 2. Recursive Character Splitting (LangChain default)
Split by hierarchy: paragraph → sentence → word:
\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,       # target size in characters
    chunk_overlap=50,     # overlap between chunks
    separators=["\\n\\n", "\\n", ". ", " ", ""],  # try each in order
)

chunks = splitter.split_text(document_text)
\`\`\`
**Pros**: Respects paragraph/sentence boundaries. **Cons**: Chunk sizes vary.

#### 3. Semantic Chunking
Group sentences by semantic similarity — split when topic shifts:
\`\`\`python
# Conceptual approach:
# 1. Split into sentences
# 2. Embed each sentence
# 3. Compute similarity between consecutive sentences
# 4. Split where similarity drops below threshold

def semantic_chunk(sentences: list[str], embeddings: np.ndarray, threshold: float = 0.75):
    chunks = []
    current_chunk = [sentences[0]]
    for i in range(1, len(sentences)):
        sim = cosine_similarity(embeddings[i-1], embeddings[i])
        if sim < threshold:
            chunks.append(" ".join(current_chunk))
            current_chunk = [sentences[i]]
        else:
            current_chunk.append(sentences[i])
    chunks.append(" ".join(current_chunk))
    return chunks
\`\`\`
**Pros**: Chunks are topically coherent. **Cons**: Expensive (embed every sentence), variable size.

#### 4. Document-Structure Aware Chunking
Use document structure (headers, sections, code blocks):
\`\`\`python
def markdown_chunk(text: str) -> list[str]:
    """Chunk by markdown headers — each section is a chunk."""
    sections = []
    current = []
    for line in text.split("\\n"):
        if line.startswith("## ") and current:
            sections.append("\\n".join(current))
            current = []
        current.append(line)
    if current:
        sections.append("\\n".join(current))
    return sections
\`\`\`
**Pros**: Preserves document logic. **Cons**: Requires format-specific parsing.

### Chunk Size Guidelines

| Document Type | Recommended Chunk Size | Why |
|--------------|----------------------|-----|
| Technical docs | 300-500 tokens | Dense, specific information |
| Legal/contracts | 200-400 tokens | Precise clauses matter |
| Chat logs | 500-800 tokens | Need conversational context |
| Code files | By function/class | Logical units |
| General text | 400-600 tokens | Balanced |

### Overlap Strategy
Overlap prevents losing information at chunk boundaries:
\`\`\`
Chunk 1: [   content A   |overlap|]
Chunk 2:                  [overlap|   content B   |overlap|]
Chunk 3:                                          [overlap|   content C   ]
\`\`\`
Typical overlap: 10-20% of chunk size.

### Metadata Enrichment
Attach metadata to each chunk for filtering:
\`\`\`python
chunk = {
    "text": "FastAPI uses Pydantic for validation...",
    "metadata": {
        "source": "docs/fastapi-guide.md",
        "section": "Request Validation",
        "page": 12,
        "date_indexed": "2024-01-15",
        "doc_type": "documentation"
    }
}
# Metadata enables filtered search: "find chunks from fastapi-guide.md only"
\`\`\``,
    diagram: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">Chunking: Too Big vs. Too Small vs. Just Right</text>
      <!-- Too big -->
      <rect x="20" y="40" width="170" height="140" rx="8" fill="#0d1117" stroke="#f85149"/>
      <text x="105" y="62" fill="#f85149" font-size="11" text-anchor="middle" font-weight="bold" font-family="monospace">Too Large</text>
      <rect x="32" y="70" width="146" height="90" rx="4" fill="#2d1515"/>
      <text x="105" y="88" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">Topic A content...</text>
      <text x="105" y="102" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">Topic B content...</text>
      <text x="105" y="116" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">Topic C content...</text>
      <text x="105" y="130" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">Topic D content...</text>
      <text x="105" y="150" fill="#f85149" font-size="9" text-anchor="middle" font-family="monospace">→ embedding is diluted</text>
      <text x="105" y="192" fill="#f85149" font-size="10" text-anchor="middle" font-family="monospace">Poor retrieval</text>
      <!-- Too small -->
      <rect x="215" y="40" width="170" height="140" rx="8" fill="#0d1117" stroke="#f0883e"/>
      <text x="300" y="62" fill="#f0883e" font-size="11" text-anchor="middle" font-weight="bold" font-family="monospace">Too Small</text>
      <rect x="227" y="70" width="146" height="18" rx="3" fill="#271d03"/>
      <text x="300" y="83" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">"Use @wraps"</text>
      <rect x="227" y="94" width="146" height="18" rx="3" fill="#271d03"/>
      <text x="300" y="107" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">"for debugging"</text>
      <rect x="227" y="118" width="146" height="18" rx="3" fill="#271d03"/>
      <text x="300" y="131" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">"in decorators"</text>
      <text x="300" y="155" fill="#f0883e" font-size="9" text-anchor="middle" font-family="monospace">→ no context, ambiguous</text>
      <text x="300" y="192" fill="#f0883e" font-size="10" text-anchor="middle" font-family="monospace">Meaningless alone</text>
      <!-- Just right -->
      <rect x="410" y="40" width="170" height="140" rx="8" fill="#0d1117" stroke="#238636"/>
      <text x="495" y="62" fill="#7ee787" font-size="11" text-anchor="middle" font-weight="bold" font-family="monospace">Just Right</text>
      <rect x="422" y="70" width="146" height="70" rx="4" fill="#12261e"/>
      <text x="495" y="88" fill="#7ee787" font-size="9" text-anchor="middle" font-family="monospace">## Decorators</text>
      <text x="495" y="102" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">@wraps preserves metadata</text>
      <text x="495" y="116" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">for debugging. Example:</text>
      <text x="495" y="130" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">@functools.wraps(func)...</text>
      <text x="495" y="155" fill="#7ee787" font-size="9" text-anchor="middle" font-family="monospace">→ focused, self-contained</text>
      <text x="495" y="192" fill="#7ee787" font-size="10" text-anchor="middle" font-family="monospace">Accurate retrieval!</text>
      <!-- Bottom guideline -->
      <rect x="50" y="210" width="500" height="40" rx="6" fill="#161b22" stroke="#21262d"/>
      <text x="300" y="228" fill="#58a6ff" font-size="11" text-anchor="middle" font-family="monospace">Target: 200-800 tokens per chunk, with 10-20% overlap</text>
      <text x="300" y="243" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Each chunk should make sense when read in isolation</text>
    </svg>`,
    examples: [
      {
        title: "Comparing chunking strategies",
        code: `from langchain.text_splitter import RecursiveCharacterTextSplitter

document = """## Python Decorators

Decorators are functions that modify other functions. They use the @syntax
and are essential for frameworks like Flask and FastAPI.

### Basic Decorator Pattern

A decorator takes a function, wraps it, and returns the wrapper:

def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before call")
        result = func(*args, **kwargs)
        print("After call")
        return result
    return wrapper

### Using @functools.wraps

Always use @functools.wraps to preserve the original function's metadata:

import functools
def my_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

## Context Managers

Context managers handle resource cleanup with the 'with' statement.
They implement __enter__ and __exit__ methods."""

# Method 1: Fixed size (naive)
words = document.split()
fixed_chunks = []
for i in range(0, len(words), 30):
    fixed_chunks.append(" ".join(words[i:i+30]))

print(f"Fixed-size ({len(fixed_chunks)} chunks):")
for i, c in enumerate(fixed_chunks[:3]):
    print(f"  [{i}]: {c[:80]}...")

# Method 2: Recursive (smart)
splitter = RecursiveCharacterTextSplitter(
    chunk_size=300, chunk_overlap=30,
    separators=["\\n## ", "\\n### ", "\\n\\n", "\\n", " "]
)
recursive_chunks = splitter.split_text(document)

print(f"\\nRecursive ({len(recursive_chunks)} chunks):")
for i, c in enumerate(recursive_chunks):
    print(f"  [{i}]: {c[:80]}...")`,
        expectedOutput: `Fixed-size (6 chunks):
  [0]: ## Python Decorators Decorators are functions that modify other functions. They...
  [1]: def my_decorator(func): def wrapper(*args, **kwargs): print("Before call") result...
  [2]: print("After call") return result return wrapper ### Using @functools.wraps Always...

Recursive (3 chunks):
  [0]: ## Python Decorators\n\nDecorators are functions that modify other functions...
  [1]: ### Using @functools.wraps\n\nAlways use @functools.wraps to preserve the original...
  [2]: ## Context Managers\n\nContext managers handle resource cleanup with the 'with'...`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "Why not just embed entire documents instead of chunking them?", options: ["Documents are too long for embedding models", "A single embedding for a long document averages over many topics, making it poor at matching specific queries — chunks focus the embedding on one topic", "Embedding models can't handle documents", "To save storage space"], answer: 1, explanation: "An embedding is a single vector representing the 'meaning' of the text. A 10-page document about many topics produces a vector that's the average of all those topics — it matches nothing well. A focused 200-token chunk about decorators produces a vector that precisely matches 'how do decorators work?' queries." },
      { difficulty: "medium", question: "What is chunk overlap and why is it important?", options: ["Duplicating chunks for backup", "Overlapping portions between adjacent chunks so information at boundaries isn't lost — a sentence split across chunks is captured in both", "Compressing chunks", "Making chunks larger"], answer: 1, explanation: "Without overlap, a key sentence split between chunk boundaries is incomplete in both chunks — neither retrieves well. With 10-20% overlap, boundary sentences appear in both adjacent chunks, ensuring no information is orphaned. The trade-off: slightly more storage and embeddings, but significantly better retrieval quality at boundaries." },
      { difficulty: "hard", question: "When would you use semantic chunking over recursive character splitting?", options: ["Always — it's strictly better", "When your documents have topic shifts that don't align with structural markers (headers, paragraphs) — semantic chunking detects topic boundaries from embedding similarity", "When documents are very short", "When you need smaller chunks"], answer: 1, explanation: "Recursive splitting uses structural markers (headers, paragraphs, sentences). Works well for well-structured docs like markdown or HTML. Semantic chunking embeds sentences and splits where cosine similarity drops — detecting topic shifts even in unstructured text (chat logs, transcripts, emails). More expensive (embed every sentence) but produces topically coherent chunks in unstructured content." }
    ],
    commonMistakes: [
      { mistake: "Using a single chunk size for all document types", whyItHappens: "Simplicity", howToAvoid: "Dense technical docs need smaller chunks (200-400 tokens). Conversational content needs larger chunks (500-800) for context. Code should be chunked by function/class, not by character count." },
      { mistake: "Not adding metadata to chunks", whyItHappens: "Seems like extra work that doesn't help retrieval", howToAvoid: "Metadata enables filtered search (e.g., 'search only docs from Q4 2024'). Store: source file, section heading, page number, date, document type. This is essential for production RAG systems." }
    ],
    cheatSheet: `## Chunking Cheat Sheet
- **Size**: 200-800 tokens, varies by document type
- **Overlap**: 10-20% of chunk size to prevent boundary loss
- **Fixed-size**: simplest, splits mid-sentence (avoid for production)
- **Recursive**: respects paragraphs/sentences (recommended default)
- **Semantic**: detects topic shifts via embedding similarity (best for unstructured text)
- **Structure-aware**: uses headers/sections (best for markdown, HTML, code)
- **Metadata**: always attach source, section, date to each chunk`,
    furtherReading: [
      { type: "docs", title: "LangChain Text Splitters", url: "https://python.langchain.com/docs/how_to/#text-splitters", whyRead: "Comprehensive overview of all chunking strategies with code examples. RecursiveCharacterTextSplitter is the recommended default." }
    ],
    flashcards: [
      { front: "Why does chunk size matter in RAG?", back: "Embeddings represent the 'average meaning' of the chunk. Too large: diluted, matches nothing well. Too small: no context, ambiguous. Sweet spot: 200-800 tokens, one coherent topic." },
      { front: "What is chunk overlap?", back: "Adjacent chunks share 10-20% of content. Prevents information loss at chunk boundaries — sentences split across chunks appear complete in at least one chunk." },
      { front: "When to use semantic vs recursive chunking?", back: "Recursive: structured docs (markdown, HTML) — uses headers/paragraphs as split points. Semantic: unstructured text (chat, transcripts) — detects topic shifts via embedding similarity." }
    ]
  },

  // ─── 3. Vector Databases ─────────────────────────────────────────────
  {
    id: "vector-databases",
    category: "RAG",
    title: "Vector Databases",
    priority: "High",
    icon: "🗄️",
    estimatedMinutes: 40,
    prerequisites: ["tokens-embeddings", "rag-fundamentals"],
    nextTopics: ["advanced-retrieval"],
    whyItMatters: "Vector databases are the storage backbone of RAG systems. Choosing the right one (Chroma for prototyping, pgvector for Postgres shops, Pinecone for managed scale) and understanding indexing algorithms (HNSW, IVF) determines whether your RAG system retrieves in 10ms or 10 seconds. Production RAG systems must handle millions of vectors with sub-100ms latency.",
    analogy: "A vector database is like a library with a magical librarian who understands meaning. You ask 'books about machine learning' and she doesn't just search for those exact words — she pulls books about neural networks, deep learning, and AI too, because they're semantically close. Under the hood, she uses a spatial index (HNSW) to find the nearest books in 'meaning space' without comparing to every single book.",
    content: `## Vector Databases

### What is a Vector Database?
A specialized database that stores high-dimensional vectors (embeddings) and efficiently retrieves the most similar ones.

\`\`\`python
# Core operations:
db.add(id="doc1", vector=[0.1, 0.2, ...], metadata={"source": "readme.md"})
results = db.query(vector=[0.15, 0.22, ...], top_k=5)  # nearest neighbors
\`\`\`

### Vector DB Comparison

| Database | Type | Best For | Persistence |
|----------|------|----------|-------------|
| **Chroma** | Embedded | Prototyping, local dev | Local file |
| **pgvector** | Postgres extension | Teams already using Postgres | Postgres |
| **Pinecone** | Managed cloud | Production at scale | Cloud |
| **Weaviate** | Self-hosted / cloud | Hybrid search (vector + keyword) | Both |
| **Qdrant** | Self-hosted / cloud | High performance, filtering | Both |
| **FAISS** | In-memory library | Batch processing, research | None (serialize manually) |

### Chroma (Local / Prototyping)

\`\`\`python
import chromadb
from chromadb.utils import embedding_functions

# Create client and collection
client = chromadb.PersistentClient(path="./chroma_db")
ef = embedding_functions.OpenAIEmbeddingFunction(model_name="text-embedding-3-small")
collection = client.get_or_create_collection("docs", embedding_function=ef)

# Add documents (auto-embeds)
collection.add(
    ids=["doc1", "doc2", "doc3"],
    documents=[
        "Python's GIL prevents true thread parallelism",
        "FastAPI uses Pydantic for validation",
        "Docker containers share the host kernel"
    ],
    metadatas=[
        {"topic": "python"}, {"topic": "web"}, {"topic": "devops"}
    ]
)

# Query (auto-embeds the query)
results = collection.query(query_texts=["How does Python handle threads?"], n_results=2)
print(results["documents"])     # matched documents
print(results["distances"])      # similarity scores
print(results["metadatas"])      # metadata for filtering
\`\`\`

### pgvector (Postgres)

\`\`\`sql
-- Enable extension
CREATE EXTENSION vector;

-- Create table with vector column
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding vector(1536),  -- 1536 dimensions
    metadata JSONB
);

-- Create index for fast similarity search
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

-- Insert
INSERT INTO documents (content, embedding, metadata)
VALUES ('Python GIL prevents...', '[0.1, 0.2, ...]', '{"topic": "python"}');

-- Query: find top 5 most similar
SELECT content, 1 - (embedding <=> query_vector) AS similarity
FROM documents
ORDER BY embedding <=> '[0.15, 0.22, ...]'::vector
LIMIT 5;
\`\`\`

### Similarity Search Algorithms

#### HNSW (Hierarchical Navigable Small World)
The most common algorithm. Builds a multi-layer graph:
\`\`\`
Layer 3: ○ ─── ○ (sparse, long jumps)
Layer 2: ○ ─ ○ ─── ○ ─ ○
Layer 1: ○─○─○─○─○─○─○─○ (dense, short hops)
Layer 0: ○○○○○○○○○○○○○○○ (all vectors)
\`\`\`
- Start at top layer, greedy search downward
- **O(log N)** query time, high recall (>95%)
- Trade-off: more memory (2-4x raw vectors)

#### IVF (Inverted File Index)
Partitions vectors into clusters, searches only relevant clusters:
- **Faster to build** than HNSW
- **Less memory** but lower recall
- Good for very large datasets (100M+ vectors)

### Metadata Filtering
Combine vector search with traditional filters:
\`\`\`python
# "Find Python docs from 2024 that are relevant to GIL"
results = collection.query(
    query_texts=["Python GIL threading"],
    n_results=5,
    where={
        "$and": [
            {"topic": {"$eq": "python"}},
            {"year": {"$gte": 2024}}
        ]
    }
)
\`\`\`

### Hybrid Search (Vector + Keyword)
Combine semantic search with BM25 keyword search:
\`\`\`
Score = α × vector_similarity + (1-α) × BM25_score
\`\`\`
- Catches exact terms that semantic search might miss
- Weaviate and Qdrant support this natively`,
    diagram: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">Vector DB: Store Embeddings → Retrieve by Similarity</text>
      <!-- Storage side -->
      <rect x="20" y="45" width="250" height="190" rx="10" fill="#0d1117" stroke="#6e40c9"/>
      <text x="145" y="68" fill="#d2a8ff" font-size="12" text-anchor="middle" font-weight="bold" font-family="monospace">Vector Database</text>
      <!-- Rows -->
      <rect x="32" y="78" width="226" height="25" rx="4" fill="#1e1533"/>
      <text x="40" y="95" fill="#d2a8ff" font-size="9" font-family="monospace">id:1</text>
      <text x="75" y="95" fill="#8b949e" font-size="9" font-family="monospace">[0.12, 0.84, -0.3, ...]</text>
      <text x="205" y="95" fill="#7ee787" font-size="8" font-family="monospace">python</text>
      <rect x="32" y="106" width="226" height="25" rx="4" fill="#1e1533"/>
      <text x="40" y="123" fill="#d2a8ff" font-size="9" font-family="monospace">id:2</text>
      <text x="75" y="123" fill="#8b949e" font-size="9" font-family="monospace">[0.45, 0.21, 0.67, ...]</text>
      <text x="205" y="123" fill="#58a6ff" font-size="8" font-family="monospace">web</text>
      <rect x="32" y="134" width="226" height="25" rx="4" fill="#1e1533"/>
      <text x="40" y="151" fill="#d2a8ff" font-size="9" font-family="monospace">id:3</text>
      <text x="75" y="151" fill="#8b949e" font-size="9" font-family="monospace">[-0.1, 0.93, 0.22, ...]</text>
      <text x="205" y="151" fill="#f0883e" font-size="8" font-family="monospace">devops</text>
      <text x="145" y="182" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">HNSW index for O(log N) search</text>
      <text x="145" y="196" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">+ metadata for filtering</text>
      <!-- Query side -->
      <rect x="320" y="45" width="260" height="90" rx="10" fill="#161b22" stroke="#1f6feb"/>
      <text x="450" y="68" fill="#58a6ff" font-size="12" text-anchor="middle" font-weight="bold" font-family="monospace">Query</text>
      <text x="450" y="88" fill="#c9d1d9" font-size="10" text-anchor="middle" font-family="monospace">"How does Python GIL work?"</text>
      <text x="450" y="108" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">→ embed → [0.11, 0.82, -0.28, ...]</text>
      <!-- Arrow -->
      <line x1="450" y1="135" x2="450" y2="160" stroke="#58a6ff" stroke-width="1.5"/>
      <polygon points="446,160 454,160 450,168" fill="#58a6ff"/>
      <!-- Results -->
      <rect x="320" y="170" width="260" height="65" rx="10" fill="#12261e" stroke="#238636"/>
      <text x="450" y="193" fill="#7ee787" font-size="12" text-anchor="middle" font-weight="bold" font-family="monospace">Top-K Results</text>
      <text x="340" y="212" fill="#7ee787" font-size="10" font-family="monospace">1. id:1 (sim: 0.94) python</text>
      <text x="340" y="226" fill="#8b949e" font-size="10" font-family="monospace">2. id:3 (sim: 0.61) devops</text>
    </svg>`,
    examples: [
      {
        title: "Chroma vector DB with metadata filtering",
        code: `import chromadb

# Persistent local storage
client = chromadb.PersistentClient(path="./my_vectordb")
collection = client.get_or_create_collection(
    name="tech_docs",
    metadata={"hnsw:space": "cosine"}  # cosine similarity
)

# Add documents with metadata
collection.upsert(
    ids=["py1", "py2", "web1", "web2", "ops1"],
    documents=[
        "Python's GIL prevents true thread parallelism in CPython",
        "Use asyncio.gather() for concurrent I/O operations in Python",
        "FastAPI auto-generates OpenAPI docs from type annotations",
        "React Server Components render on the server for better performance",
        "Docker multi-stage builds reduce image size by 80%",
    ],
    metadatas=[
        {"topic": "python", "year": 2024, "difficulty": "intermediate"},
        {"topic": "python", "year": 2024, "difficulty": "intermediate"},
        {"topic": "web", "year": 2024, "difficulty": "beginner"},
        {"topic": "web", "year": 2024, "difficulty": "advanced"},
        {"topic": "devops", "year": 2024, "difficulty": "intermediate"},
    ]
)

# Basic query
results = collection.query(query_texts=["How to handle concurrency in Python?"], n_results=3)
print("=== Basic query ===")
for doc, dist in zip(results["documents"][0], results["distances"][0]):
    print(f"  [{1-dist:.2f}] {doc[:60]}...")

# Filtered query: only Python docs
results = collection.query(
    query_texts=["How to handle concurrency?"],
    n_results=3,
    where={"topic": "python"}
)
print("\\n=== Filtered (Python only) ===")
for doc, dist in zip(results["documents"][0], results["distances"][0]):
    print(f"  [{1-dist:.2f}] {doc[:60]}...")

print(f"\\nCollection size: {collection.count()} documents")`,
        expectedOutput: `=== Basic query ===
  [0.89] Use asyncio.gather() for concurrent I/O operations in Py...
  [0.82] Python's GIL prevents true thread parallelism in CPython...
  [0.41] React Server Components render on the server for better ...

=== Filtered (Python only) ===
  [0.89] Use asyncio.gather() for concurrent I/O operations in Py...
  [0.82] Python's GIL prevents true thread parallelism in CPython...

Collection size: 5 documents`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What does a vector database store?", options: ["SQL rows", "High-dimensional vectors (embeddings) that represent the meaning of text, enabling similarity search", "Raw document text only", "Model weights"], answer: 1, explanation: "Vector databases store embedding vectors alongside metadata and optionally the source text. The key operation is 'nearest neighbor search' — given a query vector, find the K most similar stored vectors. This powers semantic search: find documents similar in meaning, not just keyword matches." },
      { difficulty: "medium", question: "When would you choose pgvector over Pinecone?", options: ["Always — pgvector is strictly better", "When your team already uses Postgres — pgvector adds vector search as an extension, avoiding a new infrastructure dependency while keeping vectors alongside your relational data", "When you need faster search", "When you have more than 1M vectors"], answer: 1, explanation: "pgvector is ideal when: you already use Postgres (no new infra), you want vectors alongside relational data (JOINs with user tables), you want self-hosted control. Pinecone is better when: you need managed scale (10M+ vectors), you want zero-ops, you're scaling rapidly and don't want to tune Postgres. For most startups starting with < 1M vectors, pgvector is the pragmatic choice." },
      { difficulty: "hard", question: "What is HNSW and why is it the default vector search algorithm?", options: ["A compression algorithm", "A multi-layer graph where top layers enable fast long-range jumps and bottom layers enable precise local search — achieving O(log N) query time with >95% recall", "A type of neural network", "A database query language"], answer: 1, explanation: "HNSW (Hierarchical Navigable Small World) builds a multi-layer proximity graph. Layer 0 has all vectors with short-range edges. Higher layers have fewer vectors with long-range edges. Query: start at top layer, greedily navigate toward the query vector, drop to lower layers for precision. O(log N) time, >95% recall, very fast in practice. Trade-off: 2-4x memory overhead for the graph edges." }
    ],
    commonMistakes: [
      { mistake: "Using FAISS in production without a persistence layer", whyItHappens: "FAISS is fast and popular in tutorials", howToAvoid: "FAISS is an in-memory library — vectors disappear on restart. For production, use Chroma (local persistent), pgvector (Postgres), or Pinecone (managed). FAISS is great for batch processing and research, not serving." },
      { mistake: "Not using metadata filtering when you should", whyItHappens: "Vector similarity search feels sufficient", howToAvoid: "Without filters, a query about 'Python decorators' might retrieve a JavaScript article with similar concepts. Metadata filters (topic, date, source) narrow the search space before vector similarity, improving relevance and speed." }
    ],
    cheatSheet: `## Vector Database Cheat Sheet
- **Chroma**: local, prototyping, pip install chromadb
- **pgvector**: Postgres extension, production, self-hosted
- **Pinecone**: managed cloud, zero-ops, pay per usage
- **HNSW**: default search algo, O(log N), >95% recall
- **Metadata**: always store source, topic, date for filtering
- **Hybrid search**: vector + BM25 for best of both worlds
- **Cosine similarity**: standard distance metric for text embeddings`,
    furtherReading: [
      { type: "docs", title: "Chroma Documentation", url: "https://docs.trychroma.com/", whyRead: "Easiest vector DB to start with. Python-native, zero config, good for prototyping RAG systems." }
    ],
    flashcards: [
      { front: "What is a vector database?", back: "Stores embedding vectors and enables fast nearest-neighbor search. Core operation: given a query vector, find the K most similar vectors. Powers semantic search in RAG systems." },
      { front: "When to use Chroma vs pgvector vs Pinecone?", back: "Chroma: prototyping, local dev. pgvector: team uses Postgres, <1M vectors. Pinecone: managed cloud, 10M+ vectors, zero ops." },
      { front: "What is HNSW?", back: "Hierarchical Navigable Small World — multi-layer graph for fast approximate nearest neighbor search. O(log N) query time, >95% recall. Default index in most vector DBs. Trade-off: 2-4x memory overhead." }
    ]
  },

  // ─── 4. Advanced Retrieval ───────────────────────────────────────────
  {
    id: "advanced-retrieval",
    category: "RAG",
    title: "Advanced Retrieval Techniques",
    priority: "Medium",
    icon: "🔍",
    estimatedMinutes: 40,
    prerequisites: ["rag-fundamentals", "chunking-strategies", "vector-databases"],
    nextTopics: ["rag-evaluation"],
    whyItMatters: "Basic RAG (embed query → top-K) works for simple cases but fails on complex queries, multi-hop reasoning, and when the user's question doesn't match document terminology. Advanced retrieval techniques — query expansion, reranking, hybrid search, and HyDE — can improve retrieval recall from 60% to 90%+ without changing your embedding model or LLM.",
    analogy: "Basic retrieval is like a Google search with a single query. Advanced retrieval is like a research librarian who: rephrases your question multiple ways (query expansion), asks clarifying questions (multi-query), checks multiple catalog systems (hybrid search), and then re-examines the top results more carefully (reranking).",
    content: `## Advanced Retrieval Techniques

### Problem: Basic RAG Limitations
\`\`\`
User: "Why is my FastAPI app slow?"
Basic RAG retrieves: docs about FastAPI features (not performance)
                     ↑ query doesn't mention "performance" or "latency"

Advanced RAG: expand query → also search "FastAPI performance" + "API latency"
              → rerank results → get relevant performance docs
\`\`\`

### 1. Query Expansion / Multi-Query

Use the LLM to generate multiple search queries:

\`\`\`python
def expand_query(original_query: str) -> list[str]:
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=200,
        temperature=0.3,
        system="Generate 3 different search queries that would help answer the user's question. Return one per line, no numbering.",
        messages=[{"role": "user", "content": original_query}]
    )
    queries = [q.strip() for q in response.content[0].text.strip().split("\\n") if q.strip()]
    return [original_query] + queries

# "Why is my FastAPI app slow?" →
# ["Why is my FastAPI app slow?",
#  "FastAPI performance optimization",
#  "API response time latency debugging",
#  "Python async performance bottlenecks"]
\`\`\`

### 2. HyDE (Hypothetical Document Embeddings)

Instead of embedding the query, generate a hypothetical answer and embed THAT:

\`\`\`python
def hyde_retrieve(query: str, collection, k: int = 5):
    # Step 1: Generate hypothetical answer
    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=200,
        temperature=0,
        messages=[{
            "role": "user",
            "content": f"Write a short paragraph answering: {query}"
        }]
    )
    hypothetical_doc = response.content[0].text

    # Step 2: Embed the hypothetical doc (not the query!)
    # This produces an embedding in "document space" instead of "query space"
    results = collection.query(query_texts=[hypothetical_doc], n_results=k)
    return results
\`\`\`

**Why it works**: The hypothetical answer uses vocabulary and style similar to actual documents, bridging the query-document gap.

### 3. Reranking

After initial retrieval, rerank results with a more powerful model:

\`\`\`python
def rerank(query: str, documents: list[str], top_k: int = 3) -> list[str]:
    """Use LLM to rerank documents by relevance."""
    prompt = f"""Rate each document's relevance to the query (0-10).
Return JSON: [{{"index": 0, "score": 8}}, ...]

Query: {query}

Documents:
{chr(10).join(f'[{i}]: {doc[:200]}' for i, doc in enumerate(documents))}"""

    response = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=200,
        temperature=0,
        messages=[{"role": "user", "content": prompt}]
    )
    scores = json.loads(response.content[0].text)
    ranked = sorted(scores, key=lambda x: x["score"], reverse=True)
    return [documents[r["index"]] for r in ranked[:top_k]]
\`\`\`

Alternatively, use a dedicated cross-encoder model (Cohere Rerank, BGE Reranker) for faster, cheaper reranking.

### 4. Hybrid Search (Vector + BM25)

\`\`\`python
from rank_bm25 import BM25Okapi

def hybrid_search(query: str, documents: list[str], doc_embeddings, alpha: float = 0.7, k: int = 5):
    # Vector search scores
    q_emb = embed([query])[0]
    vector_scores = doc_embeddings @ q_emb / (
        np.linalg.norm(doc_embeddings, axis=1) * np.linalg.norm(q_emb)
    )

    # BM25 keyword scores
    tokenized = [doc.lower().split() for doc in documents]
    bm25 = BM25Okapi(tokenized)
    bm25_scores = bm25.get_scores(query.lower().split())

    # Normalize both to [0, 1]
    v_norm = (vector_scores - vector_scores.min()) / (vector_scores.max() - vector_scores.min() + 1e-8)
    b_norm = (bm25_scores - bm25_scores.min()) / (bm25_scores.max() - bm25_scores.min() + 1e-8)

    # Combine
    combined = alpha * v_norm + (1 - alpha) * b_norm
    top_k = np.argsort(combined)[-k:][::-1]
    return [(documents[i], float(combined[i])) for i in top_k]
\`\`\`

### 5. Parent-Child Retrieval

Retrieve small chunks for precision, but return the larger parent chunk for context:

\`\`\`
Parent chunk: "## Decorators\\n\\nDecorators are functions...\\n\\n### @wraps\\n..."
                ↑ returned to LLM (full context)
Child chunks: ["Decorators are functions...", "@wraps preserves...", "Example: @timer"]
               ↑ embedded and searched (precise)
\`\`\`

### Retrieval Strategy Comparison

| Technique | When to Use | Improvement |
|-----------|------------|-------------|
| **Multi-query** | User queries are ambiguous | 10-20% recall boost |
| **HyDE** | Short queries, vocabulary mismatch | 15-25% recall boost |
| **Reranking** | Need precision over recall | Better top-K quality |
| **Hybrid** | Exact terms matter (IDs, names) | Catches keyword matches |
| **Parent-child** | Need context around retrieved chunks | Better generation quality |`,
    diagram: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">Advanced Retrieval Pipeline</text>
      <defs><marker id="ra2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#58a6ff"/></marker></defs>
      <!-- Query -->
      <rect x="20" y="42" width="90" height="35" rx="6" fill="#1f6feb" opacity="0.8"/>
      <text x="65" y="64" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Query</text>
      <line x1="110" y1="60" x2="140" y2="60" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ra2)"/>
      <!-- Multi-query -->
      <rect x="140" y="42" width="100" height="35" rx="6" fill="#161b22" stroke="#d2a8ff"/>
      <text x="190" y="58" fill="#d2a8ff" font-size="9" text-anchor="middle" font-family="monospace">Multi-Query</text>
      <text x="190" y="70" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">3-5 variants</text>
      <line x1="240" y1="60" x2="270" y2="60" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ra2)"/>
      <!-- Vector search + BM25 -->
      <rect x="270" y="35" width="100" height="22" rx="4" fill="#12261e" stroke="#238636"/>
      <text x="320" y="50" fill="#7ee787" font-size="9" text-anchor="middle" font-family="monospace">Vector Search</text>
      <rect x="270" y="60" width="100" height="22" rx="4" fill="#271d03" stroke="#f0883e"/>
      <text x="320" y="75" fill="#e3b341" font-size="9" text-anchor="middle" font-family="monospace">BM25 Keyword</text>
      <line x1="370" y1="60" x2="400" y2="60" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ra2)"/>
      <!-- Merge & Rerank -->
      <rect x="400" y="42" width="80" height="35" rx="6" fill="#161b22" stroke="#f85149"/>
      <text x="440" y="58" fill="#f85149" font-size="9" text-anchor="middle" font-family="monospace">Rerank</text>
      <text x="440" y="70" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">cross-encoder</text>
      <line x1="480" y1="60" x2="510" y2="60" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ra2)"/>
      <!-- Top-K -->
      <rect x="510" y="42" width="70" height="35" rx="6" fill="#238636" opacity="0.8"/>
      <text x="545" y="64" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Top-K</text>
      <!-- Improvement bars -->
      <text x="30" y="115" fill="#8b949e" font-size="11" font-family="monospace">Recall improvement by technique:</text>
      <text x="30" y="140" fill="#d2a8ff" font-size="10" font-family="monospace">Multi-query</text>
      <rect x="150" y="128" width="120" height="16" rx="3" fill="#1e1533" stroke="#8b5cf6"/>
      <text x="280" y="141" fill="#d2a8ff" font-size="10" font-family="monospace">+10-20%</text>
      <text x="30" y="164" fill="#58a6ff" font-size="10" font-family="monospace">HyDE</text>
      <rect x="150" y="152" width="150" height="16" rx="3" fill="#1c2333" stroke="#1f6feb"/>
      <text x="310" y="165" fill="#58a6ff" font-size="10" font-family="monospace">+15-25%</text>
      <text x="30" y="188" fill="#f85149" font-size="10" font-family="monospace">Reranking</text>
      <rect x="150" y="176" width="100" height="16" rx="3" fill="#2d1515" stroke="#f85149"/>
      <text x="260" y="189" fill="#f85149" font-size="10" font-family="monospace">precision++</text>
      <text x="30" y="212" fill="#f0883e" font-size="10" font-family="monospace">Hybrid search</text>
      <rect x="150" y="200" width="130" height="16" rx="3" fill="#271d03" stroke="#f0883e"/>
      <text x="290" y="213" fill="#f0883e" font-size="10" font-family="monospace">+exact terms</text>
      <text x="300" y="248" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Stack techniques for cumulative improvement</text>
    </svg>`,
    examples: [
      {
        title: "Multi-query + reranking pipeline",
        code: `import json
from anthropic import Anthropic

client = Anthropic()

def expand_query(query: str) -> list[str]:
    """Generate multiple search queries from the user's question."""
    r = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=150,
        temperature=0.3,
        system="Generate 3 alternative search queries for this question. One per line, no numbering.",
        messages=[{"role": "user", "content": query}]
    )
    variants = [q.strip() for q in r.content[0].text.strip().split("\\n") if q.strip()]
    return [query] + variants[:3]

def rerank_results(query: str, docs: list[str], top_k: int = 3) -> list[tuple]:
    """Rerank documents by relevance using LLM."""
    doc_list = "\\n".join(f"[{i}] {d[:150]}" for i, d in enumerate(docs))
    r = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=200,
        temperature=0,
        messages=[{
            "role": "user",
            "content": f"Rate each document 0-10 for relevance to: '{query}'\\n\\n{doc_list}\\n\\nReturn JSON array: [{{\"i\": 0, \"s\": 8}}, ...]"
        }]
    )
    scores = json.loads(r.content[0].text)
    ranked = sorted(scores, key=lambda x: x["s"], reverse=True)
    return [(docs[r["i"]], r["s"]) for r in ranked[:top_k]]

# Demo
query = "Why is my FastAPI app slow?"
expanded = expand_query(query)
print("Expanded queries:")
for q in expanded:
    print(f"  - {q}")

# Simulate retrieval results
retrieved_docs = [
    "FastAPI supports async/await for non-blocking request handling.",
    "Use connection pooling and async database drivers to reduce API latency.",
    "FastAPI automatically generates OpenAPI documentation from type hints.",
    "Profile your endpoints with py-spy or cProfile to find bottlenecks.",
    "Pydantic validation adds ~1ms overhead per request, negligible for most apps.",
]

reranked = rerank_results(query, retrieved_docs)
print("\\nReranked results:")
for doc, score in reranked:
    print(f"  [{score}/10] {doc[:70]}...")`,
        expectedOutput: `Expanded queries:
  - Why is my FastAPI app slow?
  - FastAPI performance optimization techniques
  - API response time latency debugging Python
  - Python async web server slow response bottleneck

Reranked results:
  [9/10] Profile your endpoints with py-spy or cProfile to find bottleneck...
  [8/10] Use connection pooling and async database drivers to reduce API la...
  [6/10] FastAPI supports async/await for non-blocking request handling...`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What is query expansion in RAG?", options: ["Making queries longer", "Using the LLM to generate multiple variant search queries from the user's question, retrieving results for each variant to improve recall", "Expanding the vector database", "Adding more documents"], answer: 1, explanation: "Query expansion generates 3-5 reformulations of the user's query. 'Why is my app slow?' becomes: original + 'performance optimization' + 'latency debugging' + 'bottleneck identification'. Each variant searches independently, and results are merged. This catches relevant documents that wouldn't match the original phrasing." },
      { difficulty: "medium", question: "What is HyDE and why does it work?", options: ["A new embedding model", "Generate a hypothetical answer, then embed THAT instead of the query — the hypothetical answer uses document-like vocabulary, bridging the vocabulary gap between questions and documents", "A vector database", "A chunking strategy"], answer: 1, explanation: "HyDE (Hypothetical Document Embeddings) works because queries and documents live in different 'linguistic spaces'. A query like 'Why is Python slow?' uses question vocabulary. Documents use declarative vocabulary: 'The GIL prevents parallel thread execution...' By generating a hypothetical answer first, you get an embedding in 'document space' that matches better against actual documents." },
      { difficulty: "hard", question: "When would hybrid search (vector + BM25) outperform pure vector search?", options: ["Always", "When queries contain specific identifiers, names, error codes, or technical terms that must be matched exactly — BM25 catches exact keyword matches that semantic similarity might miss", "When you have more documents", "When using smaller embedding models"], answer: 1, explanation: "Vector search finds semantically similar documents but may miss exact term matches. Searching for 'CUDA error 11' semantically might return GPU docs that don't mention that specific error code. BM25 keyword matching finds 'CUDA error 11' exactly. Hybrid search combines both: semantic understanding for concepts + keyword matching for specifics. Particularly important for technical domains with jargon, error codes, and identifiers." }
    ],
    commonMistakes: [
      { mistake: "Using only basic vector search for all RAG applications", whyItHappens: "Works in demos, seems sufficient", howToAvoid: "Basic vector search has ~60-70% recall on complex queries. Adding multi-query + reranking can reach 85-95%. Measure retrieval quality on your data and add techniques incrementally until quality is sufficient." },
      { mistake: "Reranking too many documents", whyItHappens: "Reranking all 100 results seems thorough", howToAvoid: "LLM-based reranking is expensive. Retrieve top-20 with fast vector search, then rerank those 20 to get top-5. This gives you the precision of reranking without the cost of reranking the entire corpus." }
    ],
    cheatSheet: `## Advanced Retrieval Cheat Sheet
- **Multi-query**: LLM generates 3-5 query variants, retrieve for each
- **HyDE**: generate hypothetical answer, embed that instead of query
- **Reranking**: initial retrieval top-20 → LLM/cross-encoder rerank → top-5
- **Hybrid**: vector (semantic) + BM25 (keyword), weighted combination
- **Parent-child**: embed small chunks, return parent for context
- **Stack techniques**: multi-query + hybrid + rerank = best results`,
    furtherReading: [
      { type: "paper", title: "Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE)", url: "https://arxiv.org/abs/2212.10496", whyRead: "The HyDE paper — a surprisingly simple technique that significantly improves retrieval by embedding hypothetical answers instead of queries." }
    ],
    flashcards: [
      { front: "What is query expansion?", back: "Use LLM to generate 3-5 variant search queries from the user's question. Retrieve for each variant, merge results. Catches documents that match reformulations but not the original phrasing." },
      { front: "How does HyDE improve retrieval?", back: "Generate a hypothetical answer, embed THAT instead of the query. The answer uses document-like vocabulary, bridging the question-document vocabulary gap. 15-25% recall improvement." },
      { front: "When does hybrid search beat pure vector search?", back: "When queries contain specific terms (error codes, IDs, names) that must match exactly. BM25 handles exact keyword matching; vectors handle semantic similarity. Combine for best of both." }
    ]
  },

  // ─── 5. RAG Evaluation ───────────────────────────────────────────────
  {
    id: "rag-evaluation",
    category: "RAG",
    title: "RAG Evaluation",
    priority: "Medium",
    icon: "📏",
    estimatedMinutes: 30,
    prerequisites: ["rag-fundamentals", "model-evaluation"],
    nextTopics: ["production-rag"],
    whyItMatters: "You can't improve what you can't measure. RAG systems have two separate failure points — retrieval and generation — and you need metrics for both. Without evaluation, you're tuning blindly: is the bad answer caused by wrong chunks being retrieved, or the LLM misinterpreting good chunks? Evaluation frameworks (RAGAS, custom evals) separate these concerns and guide optimization.",
    analogy: "Evaluating a RAG system is like evaluating a research assistant. You check two things separately: (1) Did they find the right sources? (retrieval quality). (2) Did they write a good answer from those sources? (generation quality). A brilliant writer with wrong sources produces wrong answers. A bad writer with right sources wastes good information. You need to diagnose which is failing.",
    content: `## RAG Evaluation

### The Two Failure Points

\`\`\`
Query → [Retrieval] → Chunks → [Generation] → Answer
         ↑ failure 1              ↑ failure 2
         Wrong docs retrieved      Right docs, wrong answer
\`\`\`

### Retrieval Metrics

**Context Recall**: Did we retrieve the relevant documents?
\`\`\`python
def context_recall(retrieved_docs: list[str], ground_truth_docs: list[str]) -> float:
    """What fraction of relevant docs were retrieved?"""
    relevant_found = sum(1 for gt in ground_truth_docs if any(gt in r for r in retrieved_docs))
    return relevant_found / len(ground_truth_docs) if ground_truth_docs else 0
\`\`\`

**Context Precision**: Are the retrieved docs relevant (not noise)?
\`\`\`python
def context_precision(retrieved_docs: list[str], query: str, judge_model) -> float:
    """What fraction of retrieved docs are actually relevant?"""
    relevant = 0
    for doc in retrieved_docs:
        judgment = judge_model(f"Is this document relevant to '{query}'? {doc}")
        if "yes" in judgment.lower():
            relevant += 1
    return relevant / len(retrieved_docs)
\`\`\`

### Generation Metrics

**Faithfulness**: Does the answer only use information from the retrieved docs?
\`\`\`python
def check_faithfulness(answer: str, retrieved_docs: str, judge) -> float:
    prompt = f"""Given these source documents and an answer, rate faithfulness 0-1.
1.0 = every claim in the answer is supported by the documents
0.0 = answer contains fabricated information not in documents

Documents: {retrieved_docs}
Answer: {answer}

Return only a number 0-1."""
    score = float(judge(prompt))
    return score
\`\`\`

**Answer Relevance**: Does the answer address the question?
\`\`\`python
def check_relevance(question: str, answer: str, judge) -> float:
    prompt = f"""Rate how well this answer addresses the question (0-1).
1.0 = fully answers the question
0.0 = completely off-topic

Question: {question}
Answer: {answer}

Return only a number 0-1."""
    return float(judge(prompt))
\`\`\`

### Building an Evaluation Dataset

\`\`\`python
eval_dataset = [
    {
        "question": "How do I create a FastAPI endpoint?",
        "ground_truth_answer": "Use @app.get('/path') decorator with a function...",
        "relevant_doc_ids": ["fastapi-basics-1", "fastapi-basics-2"],
    },
    {
        "question": "What is Python's GIL?",
        "ground_truth_answer": "The Global Interpreter Lock prevents...",
        "relevant_doc_ids": ["python-concurrency-1"],
    },
    # ... 50-100+ test cases
]
\`\`\`

### RAGAS Framework

\`\`\`python
# pip install ragas
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_recall, context_precision
from datasets import Dataset

# Prepare data
data = {
    "question": ["What is RAG?"],
    "answer": ["RAG combines retrieval with generation..."],
    "contexts": [["RAG paper: retrieval augmented generation..."]],
    "ground_truth": ["RAG retrieves relevant documents and uses them..."],
}

dataset = Dataset.from_dict(data)
results = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_recall, context_precision])
print(results)
\`\`\`

### End-to-End Evaluation Pipeline

\`\`\`python
def evaluate_rag_system(rag_fn, eval_dataset: list[dict]) -> dict:
    scores = {"faithfulness": [], "relevance": [], "retrieval_recall": []}

    for case in eval_dataset:
        answer, retrieved = rag_fn(case["question"])

        scores["faithfulness"].append(check_faithfulness(answer, retrieved))
        scores["relevance"].append(check_relevance(case["question"], answer))
        scores["retrieval_recall"].append(
            context_recall(retrieved, case.get("relevant_docs", []))
        )

    return {k: sum(v)/len(v) for k, v in scores.items()}
\`\`\`

### What Good Scores Look Like

| Metric | Poor | Good | Excellent |
|--------|------|------|-----------|
| **Faithfulness** | < 0.7 | 0.8-0.9 | > 0.95 |
| **Relevance** | < 0.6 | 0.7-0.85 | > 0.9 |
| **Context recall** | < 0.5 | 0.7-0.85 | > 0.9 |
| **Context precision** | < 0.4 | 0.6-0.8 | > 0.85 |`,
    diagram: `<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">RAG Evaluation: Diagnose Retrieval vs Generation Failures</text>
      <!-- Pipeline -->
      <rect x="20" y="45" width="80" height="35" rx="6" fill="#1f6feb" opacity="0.8"/>
      <text x="60" y="67" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Query</text>
      <line x1="100" y1="62" x2="130" y2="62" stroke="#58a6ff" stroke-width="1.5"/>
      <rect x="130" y="45" width="120" height="35" rx="6" fill="#161b22" stroke="#d2a8ff"/>
      <text x="190" y="67" fill="#d2a8ff" font-size="10" text-anchor="middle" font-family="monospace">Retrieval</text>
      <line x1="250" y1="62" x2="280" y2="62" stroke="#58a6ff" stroke-width="1.5"/>
      <rect x="280" y="45" width="120" height="35" rx="6" fill="#161b22" stroke="#238636"/>
      <text x="340" y="67" fill="#7ee787" font-size="10" text-anchor="middle" font-family="monospace">Generation</text>
      <line x1="400" y1="62" x2="430" y2="62" stroke="#58a6ff" stroke-width="1.5"/>
      <rect x="430" y="45" width="80" height="35" rx="6" fill="#238636" opacity="0.8"/>
      <text x="470" y="67" fill="#fff" font-size="10" text-anchor="middle" font-family="monospace">Answer</text>
      <!-- Retrieval metrics -->
      <rect x="115" y="100" width="155" height="120" rx="8" fill="#0d1117" stroke="#d2a8ff"/>
      <text x="192" y="120" fill="#d2a8ff" font-size="11" text-anchor="middle" font-weight="bold" font-family="monospace">Retrieval Metrics</text>
      <text x="130" y="142" fill="#c9d1d9" font-size="10" font-family="monospace">Context Recall</text>
      <text x="130" y="160" fill="#8b949e" font-size="9" font-family="monospace">Did we find the right docs?</text>
      <text x="130" y="182" fill="#c9d1d9" font-size="10" font-family="monospace">Context Precision</text>
      <text x="130" y="200" fill="#8b949e" font-size="9" font-family="monospace">Are results relevant?</text>
      <!-- Generation metrics -->
      <rect x="310" y="100" width="155" height="120" rx="8" fill="#0d1117" stroke="#238636"/>
      <text x="387" y="120" fill="#7ee787" font-size="11" text-anchor="middle" font-weight="bold" font-family="monospace">Generation Metrics</text>
      <text x="325" y="142" fill="#c9d1d9" font-size="10" font-family="monospace">Faithfulness</text>
      <text x="325" y="160" fill="#8b949e" font-size="9" font-family="monospace">Only uses provided docs?</text>
      <text x="325" y="182" fill="#c9d1d9" font-size="10" font-family="monospace">Answer Relevance</text>
      <text x="325" y="200" fill="#8b949e" font-size="9" font-family="monospace">Addresses the question?</text>
    </svg>`,
    examples: [
      {
        title: "Simple RAG evaluation pipeline",
        code: `from anthropic import Anthropic
import json

client = Anthropic()

def llm_judge(prompt: str) -> str:
    r = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=50, temperature=0,
        messages=[{"role": "user", "content": prompt}]
    )
    return r.content[0].text.strip()

def evaluate_answer(question: str, answer: str, context: str) -> dict:
    faithfulness = float(llm_judge(
        f"Rate 0.0-1.0: Does this answer ONLY use info from the context?\\nContext: {context}\\nAnswer: {answer}\\nReturn number only."
    ))
    relevance = float(llm_judge(
        f"Rate 0.0-1.0: Does this answer address the question?\\nQuestion: {question}\\nAnswer: {answer}\\nReturn number only."
    ))
    return {"faithfulness": faithfulness, "relevance": relevance}

# Test cases
cases = [
    {
        "question": "What is Python's GIL?",
        "context": "The GIL is a mutex in CPython preventing parallel thread execution.",
        "answer": "The GIL (Global Interpreter Lock) is a mutex in CPython that prevents true parallel thread execution.",
    },
    {
        "question": "What is Python's GIL?",
        "context": "The GIL is a mutex in CPython preventing parallel thread execution.",
        "answer": "Python was created by Guido van Rossum in 1991.",  # unfaithful + irrelevant
    },
]

for case in cases:
    scores = evaluate_answer(case["question"], case["answer"], case["context"])
    print(f"Q: {case['question']}")
    print(f"A: {case['answer'][:60]}...")
    print(f"Faithfulness: {scores['faithfulness']:.1f} | Relevance: {scores['relevance']:.1f}\\n")`,
        expectedOutput: `Q: What is Python's GIL?
A: The GIL (Global Interpreter Lock) is a mutex in CPython th...
Faithfulness: 1.0 | Relevance: 1.0

Q: What is Python's GIL?
A: Python was created by Guido van Rossum in 1991...
Faithfulness: 0.0 | Relevance: 0.1`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What does faithfulness measure in RAG evaluation?", options: ["How fast the response is", "Whether the answer only contains information supported by the retrieved documents — no hallucinated facts", "How many documents were retrieved", "User satisfaction"], answer: 1, explanation: "Faithfulness measures grounding: does every claim in the answer come from the retrieved documents? A faithfulness score of 1.0 means no hallucination — the model only used provided context. Low faithfulness means the model added information not in the documents (hallucination)." },
      { difficulty: "medium", question: "Why evaluate retrieval and generation separately?", options: ["It's faster", "Different components fail differently — wrong chunks need retrieval fixes (better embeddings, chunking); right chunks with wrong answers need generation fixes (better prompts, models)", "They can't be evaluated together", "To reduce costs"], answer: 1, explanation: "Separate evaluation enables targeted debugging. If faithfulness is low but context recall is high → the LLM is ignoring good chunks (fix: better system prompt). If context recall is low but the LLM is faithful to whatever it gets → retrieval is failing (fix: better embeddings, chunking, or advanced retrieval). Without separation, you can't diagnose which component needs improvement." }
    ],
    commonMistakes: [
      { mistake: "Only evaluating end-to-end answer quality", whyItHappens: "Easier to check the final answer than break down components", howToAvoid: "Always measure retrieval (recall, precision) AND generation (faithfulness, relevance) separately. When the final answer is wrong, you need to know whether to fix retrieval or generation." },
      { mistake: "Using fewer than 50 evaluation examples", whyItHappens: "Creating test cases is time-consuming", howToAvoid: "50-100 diverse test cases is the minimum for reliable evaluation. Include easy cases, hard cases, edge cases, and 'answer not in corpus' cases. Use LLM-as-judge for scalable scoring." }
    ],
    cheatSheet: `## RAG Evaluation Cheat Sheet
- **Separate**: evaluate retrieval and generation independently
- **Retrieval**: context recall (found right docs?) + precision (results relevant?)
- **Generation**: faithfulness (grounded in docs?) + relevance (answers question?)
- **Dataset**: 50-100+ diverse test cases including edge cases
- **LLM-as-judge**: scalable scoring with Haiku/GPT-4
- **RAGAS**: open-source framework for RAG evaluation
- **Good scores**: faithfulness > 0.9, recall > 0.8, relevance > 0.8`,
    furtherReading: [
      { type: "docs", title: "RAGAS Documentation", url: "https://docs.ragas.io/en/latest/", whyRead: "The standard open-source framework for RAG evaluation. Implements faithfulness, relevance, recall, precision metrics with LLM-as-judge." }
    ],
    flashcards: [
      { front: "What are the two separate failure points in RAG?", back: "1) Retrieval failure: wrong/irrelevant chunks retrieved. 2) Generation failure: right chunks but LLM produces wrong/unfaithful answer. Evaluate each independently to diagnose issues." },
      { front: "What does faithfulness measure?", back: "Whether every claim in the answer is supported by the retrieved documents. 1.0 = fully grounded, 0.0 = hallucinated. The most critical RAG metric for production systems." },
      { front: "How many eval examples do you need?", back: "Minimum 50-100 diverse test cases: easy, hard, edge cases, and 'answer not in corpus' cases. Use LLM-as-judge (Haiku) for scalable scoring." }
    ]
  },

  // ─── 6. Production RAG ───────────────────────────────────────────────
  {
    id: "production-rag",
    category: "RAG",
    title: "Production RAG Systems",
    priority: "Medium",
    icon: "🏭",
    estimatedMinutes: 35,
    prerequisites: ["rag-fundamentals", "vector-databases", "advanced-retrieval", "rag-evaluation"],
    nextTopics: ["langchain-basics"],
    whyItMatters: "Moving from a RAG prototype to production involves challenges that don't appear in demos: document updates, stale embeddings, scaling to millions of chunks, monitoring retrieval quality over time, and handling multi-tenant data isolation. This topic covers the engineering that separates a demo that works on 10 documents from a system that serves thousands of users reliably.",
    analogy: "A prototype RAG is like cooking for yourself — any pot works, no timing matters, cleanup is optional. Production RAG is like running a restaurant kitchen: you need a supply chain (document ingestion pipeline), prep stations (chunking + embedding), a walk-in cooler (vector DB), quality control (evaluation), and health inspectors (monitoring). The recipe is the same, but the operational requirements are completely different.",
    content: `## Production RAG Systems

### From Prototype to Production

| Concern | Prototype | Production |
|---------|-----------|------------|
| **Data volume** | 100 docs | 100K-10M docs |
| **Updates** | Re-index manually | Continuous ingestion pipeline |
| **Latency** | "It works" | p95 < 500ms |
| **Multi-tenant** | Single user | Isolated per customer |
| **Monitoring** | Print statements | Metrics, alerts, dashboards |
| **Failures** | Crash and debug | Graceful degradation |

### Document Ingestion Pipeline

\`\`\`python
# Production ingestion pipeline
class RAGIngestionPipeline:
    def __init__(self, collection, embedder, chunker):
        self.collection = collection
        self.embedder = embedder
        self.chunker = chunker

    def ingest(self, document: dict):
        """Process a single document into the vector DB."""
        doc_id = document["id"]
        content = document["content"]
        metadata = document["metadata"]

        # 1. Remove old chunks for this document (re-indexing)
        self.collection.delete(where={"doc_id": doc_id})

        # 2. Chunk the document
        chunks = self.chunker.split(content)

        # 3. Embed and store with metadata
        for i, chunk in enumerate(chunks):
            chunk_id = f"{doc_id}_chunk_{i}"
            self.collection.add(
                ids=[chunk_id],
                documents=[chunk],
                metadatas=[{
                    **metadata,
                    "doc_id": doc_id,
                    "chunk_index": i,
                    "indexed_at": datetime.utcnow().isoformat(),
                }]
            )

    def bulk_ingest(self, documents: list[dict], batch_size: int = 100):
        for i in range(0, len(documents), batch_size):
            batch = documents[i:i+batch_size]
            for doc in batch:
                self.ingest(doc)
            print(f"Ingested {min(i+batch_size, len(documents))}/{len(documents)}")
\`\`\`

### Multi-Tenant Data Isolation

\`\`\`python
# Option 1: Metadata filtering (simple)
def search_for_tenant(query: str, tenant_id: str, collection, k: int = 5):
    return collection.query(
        query_texts=[query],
        n_results=k,
        where={"tenant_id": tenant_id}  # isolation via filter
    )

# Option 2: Separate collections (stronger isolation)
def get_tenant_collection(tenant_id: str, client):
    return client.get_or_create_collection(
        name=f"tenant_{tenant_id}",
        metadata={"hnsw:space": "cosine"}
    )
\`\`\`

### Caching for Cost and Latency

\`\`\`python
import hashlib
import json

class RAGCache:
    """Cache RAG results to avoid repeated LLM calls for identical queries."""

    def __init__(self, ttl_seconds: int = 3600):
        self.cache = {}
        self.ttl = ttl_seconds

    def _key(self, query: str, tenant_id: str) -> str:
        return hashlib.md5(f"{tenant_id}:{query}".encode()).hexdigest()

    def get(self, query: str, tenant_id: str) -> dict | None:
        key = self._key(query, tenant_id)
        entry = self.cache.get(key)
        if entry and (time.time() - entry["timestamp"]) < self.ttl:
            return entry["result"]
        return None

    def set(self, query: str, tenant_id: str, result: dict):
        key = self._key(query, tenant_id)
        self.cache[key] = {"result": result, "timestamp": time.time()}
\`\`\`

### Monitoring and Observability

\`\`\`python
import logging
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class RAGMetrics:
    query: str
    retrieved_count: int
    top_similarity: float
    latency_ms: float
    model: str
    input_tokens: int
    output_tokens: int
    cost_usd: float
    timestamp: datetime = field(default_factory=datetime.utcnow)

def log_rag_call(metrics: RAGMetrics):
    logging.info(json.dumps({
        "event": "rag_query",
        "query": metrics.query[:100],
        "retrieved": metrics.retrieved_count,
        "top_sim": metrics.top_similarity,
        "latency_ms": metrics.latency_ms,
        "tokens": metrics.input_tokens + metrics.output_tokens,
        "cost": metrics.cost_usd,
    }))

# Alert on low retrieval quality
if metrics.top_similarity < 0.5:
    logging.warning(f"Low relevance: top sim {metrics.top_similarity:.2f} for '{metrics.query[:50]}'")
\`\`\`

### Graceful Degradation

\`\`\`python
def robust_rag_answer(query: str, collection) -> dict:
    try:
        results = collection.query(query_texts=[query], n_results=5)

        if not results["documents"][0]:
            return {"answer": "I don't have relevant information.", "source": "no_results"}

        top_similarity = 1 - results["distances"][0][0]
        if top_similarity < 0.5:
            return {"answer": "I found some results but they may not be relevant.", "source": "low_confidence", "similarity": top_similarity}

        # Normal RAG generation
        answer = generate_with_context(query, results["documents"][0])
        return {"answer": answer, "source": "rag", "similarity": top_similarity}

    except Exception as e:
        logging.error(f"RAG failure: {e}")
        return {"answer": "I'm having trouble searching right now. Please try again.", "source": "error"}
\`\`\`

### Performance Optimization Checklist
\`\`\`markdown
□ Embedding batch size: embed in batches of 100-500, not one at a time
□ Async embedding: parallel API calls for embedding pipeline
□ Connection pooling: reuse DB connections
□ Approximate search: use HNSW (not exact brute force)
□ Metadata pre-filtering: narrow search space before vector similarity
□ Caching: cache frequent queries and embeddings
□ CDN/edge: serve static embeddings from edge if applicable
□ Monitoring: track p50/p95 latency, retrieval quality, costs
\`\`\``,
    diagram: `<svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">Production RAG Architecture</text>
      <defs><marker id="ra3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#58a6ff"/></marker></defs>
      <!-- Ingestion pipeline (top) -->
      <rect x="20" y="40" width="560" height="50" rx="8" fill="#0d1117" stroke="#21262d"/>
      <text x="30" y="60" fill="#8b949e" font-size="10" font-family="monospace">Ingestion:</text>
      <rect x="105" y="48" width="70" height="30" rx="4" fill="#161b22" stroke="#30363d"/>
      <text x="140" y="67" fill="#c9d1d9" font-size="9" text-anchor="middle" font-family="monospace">Documents</text>
      <text x="182" y="67" fill="#58a6ff" font-size="12" font-family="monospace">→</text>
      <rect x="198" y="48" width="70" height="30" rx="4" fill="#1f6feb" opacity="0.7"/>
      <text x="233" y="67" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Chunk</text>
      <text x="275" y="67" fill="#58a6ff" font-size="12" font-family="monospace">→</text>
      <rect x="290" y="48" width="70" height="30" rx="4" fill="#238636" opacity="0.7"/>
      <text x="325" y="67" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Embed</text>
      <text x="367" y="67" fill="#58a6ff" font-size="12" font-family="monospace">→</text>
      <rect x="382" y="48" width="90" height="30" rx="4" fill="#6e40c9" opacity="0.8"/>
      <text x="427" y="67" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Vector DB</text>
      <text x="479" y="67" fill="#58a6ff" font-size="12" font-family="monospace">→</text>
      <rect x="492" y="48" width="78" height="30" rx="4" fill="#161b22" stroke="#30363d"/>
      <text x="531" y="67" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">Metadata</text>
      <!-- Query flow (middle) -->
      <rect x="20" y="105" width="560" height="55" rx="8" fill="#0d1117" stroke="#1f6feb"/>
      <text x="30" y="125" fill="#58a6ff" font-size="10" font-family="monospace">Query:</text>
      <rect x="80" y="113" width="60" height="30" rx="4" fill="#1f6feb" opacity="0.8"/>
      <text x="110" y="132" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">User</text>
      <text x="147" y="132" fill="#58a6ff" font-size="12" font-family="monospace">→</text>
      <rect x="158" y="113" width="62" height="30" rx="4" fill="#161b22" stroke="#d2a8ff"/>
      <text x="189" y="132" fill="#d2a8ff" font-size="9" text-anchor="middle" font-family="monospace">Cache?</text>
      <text x="227" y="132" fill="#58a6ff" font-size="12" font-family="monospace">→</text>
      <rect x="238" y="113" width="70" height="30" rx="4" fill="#238636" opacity="0.7"/>
      <text x="273" y="132" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Retrieve</text>
      <text x="315" y="132" fill="#58a6ff" font-size="12" font-family="monospace">→</text>
      <rect x="325" y="113" width="60" height="30" rx="4" fill="#f85149" opacity="0.7"/>
      <text x="355" y="132" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Rerank</text>
      <text x="392" y="132" fill="#58a6ff" font-size="12" font-family="monospace">→</text>
      <rect x="403" y="113" width="60" height="30" rx="4" fill="#1f6feb" opacity="0.9"/>
      <text x="433" y="132" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">LLM</text>
      <text x="470" y="132" fill="#58a6ff" font-size="12" font-family="monospace">→</text>
      <rect x="480" y="113" width="90" height="30" rx="4" fill="#238636" opacity="0.9"/>
      <text x="525" y="132" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Answer</text>
      <!-- Monitoring (bottom) -->
      <rect x="20" y="175" width="560" height="60" rx="8" fill="#0d1117" stroke="#f0883e"/>
      <text x="30" y="195" fill="#e3b341" font-size="10" font-family="monospace">Monitoring:</text>
      <rect x="110" y="183" width="80" height="22" rx="4" fill="#271d03"/>
      <text x="150" y="198" fill="#e3b341" font-size="9" text-anchor="middle" font-family="monospace">Latency p95</text>
      <rect x="200" y="183" width="90" height="22" rx="4" fill="#271d03"/>
      <text x="245" y="198" fill="#e3b341" font-size="9" text-anchor="middle" font-family="monospace">Retrieval quality</text>
      <rect x="300" y="183" width="80" height="22" rx="4" fill="#271d03"/>
      <text x="340" y="198" fill="#e3b341" font-size="9" text-anchor="middle" font-family="monospace">Cost/query</text>
      <rect x="390" y="183" width="80" height="22" rx="4" fill="#271d03"/>
      <text x="430" y="198" fill="#e3b341" font-size="9" text-anchor="middle" font-family="monospace">Error rate</text>
      <rect x="480" y="183" width="90" height="22" rx="4" fill="#271d03"/>
      <text x="525" y="198" fill="#e3b341" font-size="9" text-anchor="middle" font-family="monospace">Faithfulness</text>
      <text x="300" y="225" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">Alert on: low similarity, high latency, high error rate, cost anomalies</text>
    </svg>`,
    examples: [
      {
        title: "Production RAG with caching and monitoring",
        code: `import time
import hashlib
import logging
from anthropic import Anthropic

client = Anthropic()
logging.basicConfig(level=logging.INFO)

class ProductionRAG:
    def __init__(self, collection):
        self.collection = collection
        self.cache = {}
        self.metrics = []

    def query(self, question: str, tenant_id: str = "default", k: int = 5) -> dict:
        start = time.time()

        # Check cache
        cache_key = hashlib.md5(f"{tenant_id}:{question}".encode()).hexdigest()
        if cache_key in self.cache:
            return {**self.cache[cache_key], "cached": True}

        # Retrieve with tenant isolation
        results = self.collection.query(
            query_texts=[question],
            n_results=k,
            where={"tenant_id": tenant_id} if tenant_id != "default" else None,
        )

        docs = results["documents"][0]
        distances = results["distances"][0]

        if not docs:
            return {"answer": "No relevant documents found.", "confidence": "none"}

        top_sim = 1 - distances[0]

        # Low confidence check
        if top_sim < 0.5:
            logging.warning(f"Low similarity {top_sim:.2f} for: {question[:50]}")
            return {"answer": "I found some results but they may not be relevant. Please rephrase your question.", "confidence": "low"}

        # Generate answer
        context = "\\n".join(f"[{i+1}] {d}" for i, d in enumerate(docs))
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=500, temperature=0,
            system="Answer from the documents only. Cite as [N]. If unsure, say so.",
            messages=[{"role": "user", "content": f"Docs:\\n{context}\\n\\nQ: {question}"}],
        )

        result = {
            "answer": response.content[0].text,
            "confidence": "high" if top_sim > 0.8 else "medium",
            "sources": len(docs),
            "top_similarity": round(top_sim, 3),
            "latency_ms": round((time.time() - start) * 1000),
            "cached": False,
        }

        # Cache and log
        self.cache[cache_key] = result
        logging.info(f"RAG query: sim={top_sim:.2f} latency={result['latency_ms']}ms")
        return result

# Usage
# rag = ProductionRAG(collection)
# result = rag.query("How does auth work?", tenant_id="acme_corp")
# print(result)`,
        expectedOutput: `INFO:root:RAG query: sim=0.87 latency=1250ms
{
  "answer": "Authentication uses JWT tokens issued on login [1]. Tokens expire after 24h and must be refreshed via /auth/refresh [2].",
  "confidence": "high",
  "sources": 5,
  "top_similarity": 0.872,
  "latency_ms": 1250,
  "cached": false
}`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "Why do production RAG systems need document re-indexing?", options: ["To improve embedding quality", "Documents change over time — updated content needs re-chunked, re-embedded, and replaced in the vector DB to keep answers current", "To use less storage", "It's not needed"], answer: 1, explanation: "Production documents change: policies are updated, code docs evolve, knowledge bases grow. If you don't re-index, your RAG system serves stale answers. A good ingestion pipeline deletes old chunks for a document before inserting new ones, maintaining freshness." },
      { difficulty: "medium", question: "What is multi-tenant data isolation in RAG and why does it matter?", options: ["Using multiple LLM models", "Ensuring each customer's data is only accessible to them — either via metadata filtering (tenant_id) or separate collections — preventing data leaks between tenants", "Running multiple RAG pipelines", "Using different embedding models per tenant"], answer: 1, explanation: "In SaaS products, each customer's documents must be isolated. Without tenant filtering, Company A's query could retrieve Company B's confidential documents. Two approaches: metadata filter (where={tenant_id: 'acme'}) — simpler, shared collection. Separate collections per tenant — stronger isolation, more overhead. Both are valid; choice depends on security requirements." }
    ],
    commonMistakes: [
      { mistake: "Not implementing graceful degradation for low-confidence retrievals", whyItHappens: "Works in testing with curated queries", howToAvoid: "In production, queries will be vague, off-topic, or about topics not in your corpus. Check top similarity score; if below threshold (e.g., 0.5), respond with 'I don't have relevant information' rather than hallucinating from poor context." },
      { mistake: "Not monitoring retrieval quality in production", whyItHappens: "Evaluation seems like a pre-launch task", howToAvoid: "Track top-K similarity scores, latency, and periodically run automated eval. Quality degrades over time as new documents change the corpus distribution. Alert on sustained drops in average similarity." }
    ],
    cheatSheet: `## Production RAG Cheat Sheet
- **Ingestion**: delete old chunks → re-chunk → re-embed → upsert
- **Tenant isolation**: metadata filtering or separate collections
- **Caching**: hash query+tenant → cache result for 1h+
- **Monitoring**: track similarity, latency, cost, error rate
- **Graceful degradation**: low similarity → "I don't have that info"
- **Performance**: batch embeddings, async calls, HNSW index, metadata pre-filter
- **Eval**: periodic automated evaluation against test set`,
    furtherReading: [
      { type: "article", title: "Building Production-Ready RAG Applications", url: "https://docs.anthropic.com/en/docs/build-with-claude/retrieval-augmented-generation", whyRead: "Anthropic's guide to building RAG with Claude. Covers prompt caching for RAG, citation patterns, and production best practices." }
    ],
    flashcards: [
      { front: "What's the biggest difference between prototype and production RAG?", back: "Production needs: document ingestion pipeline, re-indexing, multi-tenant isolation, caching, monitoring, graceful degradation, and latency SLAs. Prototype just needs chunk→embed→search→generate." },
      { front: "How do you handle multi-tenant data in RAG?", back: "1) Metadata filtering: add tenant_id to each chunk, filter on query (simpler). 2) Separate collections per tenant (stronger isolation, more overhead). Never let Tenant A's query see Tenant B's docs." },
      { front: "What should you monitor in production RAG?", back: "Top-K similarity scores, end-to-end latency (p50/p95), cost per query, error rate, and periodic automated faithfulness/relevance evaluation." }
    ]
  },

  // ─── 7. Document Parsing ─────────────────────────────────────────────
  {
    id: "document-parsing",
    category: "RAG",
    title: "Document Parsing & Ingestion",
    priority: "Medium",
    icon: "📄",
    estimatedMinutes: 30,
    prerequisites: ["rag-fundamentals", "chunking-strategies"],
    nextTopics: ["production-rag"],
    whyItMatters: "Real-world RAG systems must ingest PDFs, Word docs, HTML pages, Markdown files, spreadsheets, and code repositories. Raw document parsing determines the quality of everything downstream — if you lose table structure, code formatting, or header hierarchy during parsing, no amount of chunking or retrieval optimization can recover that information.",
    analogy: "Document parsing is like food prep in a kitchen. You can't make a great dish from poorly prepped ingredients. Parsing a PDF and losing all table structure is like mincing ingredients that should have been diced — the final dish suffers even with perfect cooking. Good parsing preserves the structure and relationships in the original document.",
    content: `## Document Parsing & Ingestion

### The Parsing Challenge
Real documents aren't clean text. They contain:
- **Tables** (structured data that loses meaning when linearized)
- **Headers** (document hierarchy)
- **Code blocks** (must preserve formatting)
- **Images, charts** (may need OCR or captioning)
- **Multi-column layouts** (PDFs)
- **Footnotes, references** (cross-references)

### Parsing Libraries by Format

| Format | Library | Notes |
|--------|---------|-------|
| **PDF** | PyMuPDF (fitz), pdfplumber | pdfplumber better for tables |
| **Word** | python-docx | Preserves formatting well |
| **HTML** | BeautifulSoup, trafilatura | trafilatura extracts article text |
| **Markdown** | markdown-it, custom | Preserve headers for chunking |
| **CSV/Excel** | pandas | Convert rows to text chunks |
| **Code** | tree-sitter, AST | Parse by function/class |
| **Any (AI)** | LlamaParse, Unstructured | AI-powered extraction |

### PDF Parsing

\`\`\`python
# pip install pymupdf pdfplumber
import fitz  # PyMuPDF
import pdfplumber

def parse_pdf_pymupdf(path: str) -> list[dict]:
    """Extract text with page numbers."""
    doc = fitz.open(path)
    pages = []
    for i, page in enumerate(doc):
        text = page.get_text()
        if text.strip():
            pages.append({"page": i + 1, "text": text.strip()})
    return pages

def parse_pdf_tables(path: str) -> list[dict]:
    """Extract tables from PDF (pdfplumber is better for tables)."""
    tables = []
    with pdfplumber.open(path) as pdf:
        for i, page in enumerate(pdf.pages):
            for table in page.extract_tables():
                # Convert table to markdown format
                headers = table[0]
                rows = table[1:]
                md = "| " + " | ".join(str(h) for h in headers) + " |\\n"
                md += "| " + " | ".join("---" for _ in headers) + " |\\n"
                for row in rows:
                    md += "| " + " | ".join(str(c) for c in row) + " |\\n"
                tables.append({"page": i + 1, "table_md": md})
    return tables
\`\`\`

### Web Scraping for RAG

\`\`\`python
# pip install trafilatura
import trafilatura

def scrape_article(url: str) -> dict | None:
    """Extract main article text from a web page."""
    downloaded = trafilatura.fetch_url(url)
    if not downloaded:
        return None

    text = trafilatura.extract(downloaded, include_tables=True, include_links=True)
    metadata = trafilatura.extract(downloaded, output_format="json")

    return {"text": text, "metadata": metadata, "url": url}
\`\`\`

### Code Repository Parsing

\`\`\`python
import ast
from pathlib import Path

def parse_python_file(path: str) -> list[dict]:
    """Extract functions and classes from Python files."""
    source = Path(path).read_text()
    tree = ast.parse(source)
    chunks = []

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            lines = source.split("\\n")
            func_text = "\\n".join(lines[node.lineno - 1 : node.end_lineno])
            docstring = ast.get_docstring(node) or ""
            chunks.append({
                "type": "function",
                "name": node.name,
                "text": func_text,
                "docstring": docstring,
                "file": path,
                "line": node.lineno,
            })
        elif isinstance(node, ast.ClassDef):
            lines = source.split("\\n")
            class_text = "\\n".join(lines[node.lineno - 1 : node.end_lineno])
            chunks.append({
                "type": "class",
                "name": node.name,
                "text": class_text,
                "file": path,
                "line": node.lineno,
            })
    return chunks
\`\`\`

### Universal Ingestion Pipeline

\`\`\`python
from pathlib import Path

PARSERS = {
    ".pdf": parse_pdf_pymupdf,
    ".py": parse_python_file,
    ".md": lambda p: [{"text": Path(p).read_text()}],
    ".txt": lambda p: [{"text": Path(p).read_text()}],
}

def ingest_directory(directory: str) -> list[dict]:
    """Parse all supported files in a directory."""
    all_chunks = []
    for path in Path(directory).rglob("*"):
        parser = PARSERS.get(path.suffix.lower())
        if parser:
            try:
                chunks = parser(str(path))
                for chunk in chunks:
                    chunk["source"] = str(path)
                all_chunks.extend(chunks)
            except Exception as e:
                print(f"Error parsing {path}: {e}")
    return all_chunks
\`\`\`

### Handling Tables and Structured Data
Tables lose meaning when converted to plain text. Best practices:
1. Convert tables to markdown format (preserves structure for LLM)
2. Add header context: "Table from Section 3.2: Revenue by Quarter"
3. For large tables, chunk by row groups with headers repeated
4. Consider storing table data in structured DB alongside vector DB`,
    diagram: `<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">Document Parsing Pipeline</text>
      <defs><marker id="ra4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#58a6ff"/></marker></defs>
      <!-- Input formats -->
      <rect x="20" y="45" width="120" height="150" rx="8" fill="#0d1117" stroke="#21262d"/>
      <text x="80" y="68" fill="#8b949e" font-size="11" text-anchor="middle" font-weight="bold" font-family="monospace">Input Formats</text>
      <text x="35" y="90" fill="#f85149" font-size="10" font-family="monospace">📕 PDF</text>
      <text x="35" y="108" fill="#58a6ff" font-size="10" font-family="monospace">📘 Word</text>
      <text x="35" y="126" fill="#7ee787" font-size="10" font-family="monospace">🌐 HTML</text>
      <text x="35" y="144" fill="#d2a8ff" font-size="10" font-family="monospace">📝 Markdown</text>
      <text x="35" y="162" fill="#e3b341" font-size="10" font-family="monospace">🐍 Python</text>
      <text x="35" y="180" fill="#8b949e" font-size="10" font-family="monospace">📊 CSV/Excel</text>
      <!-- Arrow -->
      <line x1="140" y1="120" x2="175" y2="120" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ra4)"/>
      <!-- Parser -->
      <rect x="175" y="55" width="120" height="130" rx="8" fill="#161b22" stroke="#1f6feb"/>
      <text x="235" y="78" fill="#58a6ff" font-size="11" text-anchor="middle" font-weight="bold" font-family="monospace">Parsers</text>
      <text x="190" y="98" fill="#8b949e" font-size="9" font-family="monospace">PyMuPDF</text>
      <text x="190" y="114" fill="#8b949e" font-size="9" font-family="monospace">python-docx</text>
      <text x="190" y="130" fill="#8b949e" font-size="9" font-family="monospace">trafilatura</text>
      <text x="190" y="146" fill="#8b949e" font-size="9" font-family="monospace">AST parser</text>
      <text x="190" y="162" fill="#8b949e" font-size="9" font-family="monospace">pandas</text>
      <!-- Arrow -->
      <line x1="295" y1="120" x2="330" y2="120" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ra4)"/>
      <!-- Structured output -->
      <rect x="330" y="55" width="130" height="130" rx="8" fill="#12261e" stroke="#238636"/>
      <text x="395" y="78" fill="#7ee787" font-size="11" text-anchor="middle" font-weight="bold" font-family="monospace">Structured</text>
      <text x="345" y="98" fill="#7ee787" font-size="9" font-family="monospace">Clean text</text>
      <text x="345" y="114" fill="#7ee787" font-size="9" font-family="monospace">Tables → markdown</text>
      <text x="345" y="130" fill="#7ee787" font-size="9" font-family="monospace">Code → functions</text>
      <text x="345" y="146" fill="#7ee787" font-size="9" font-family="monospace">Headers preserved</text>
      <text x="345" y="162" fill="#7ee787" font-size="9" font-family="monospace">Metadata attached</text>
      <!-- Arrow -->
      <line x1="460" y1="120" x2="495" y2="120" stroke="#58a6ff" stroke-width="1.5" marker-end="url(#ra4)"/>
      <!-- Chunking -->
      <rect x="495" y="75" width="85" height="90" rx="8" fill="#161b22" stroke="#d2a8ff"/>
      <text x="537" y="98" fill="#d2a8ff" font-size="11" text-anchor="middle" font-weight="bold" font-family="monospace">Chunk</text>
      <text x="537" y="118" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">& Embed</text>
      <text x="537" y="138" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">→ Vector DB</text>
      <!-- Note -->
      <text x="300" y="220" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Parsing quality determines RAG quality — garbage in, garbage out</text>
    </svg>`,
    examples: [
      {
        title: "Multi-format document ingestion",
        code: `from pathlib import Path
import json

def parse_markdown(path: str) -> list[dict]:
    """Chunk markdown by sections."""
    text = Path(path).read_text()
    sections = []
    current_section = {"header": "Introduction", "content": []}

    for line in text.split("\\n"):
        if line.startswith("## "):
            if current_section["content"]:
                sections.append({
                    "text": f"{current_section['header']}\\n{''.join(current_section['content'])}",
                    "section": current_section["header"],
                })
            current_section = {"header": line, "content": []}
        else:
            current_section["content"].append(line + "\\n")

    if current_section["content"]:
        sections.append({
            "text": f"{current_section['header']}\\n{''.join(current_section['content'])}",
            "section": current_section["header"],
        })
    return sections

def parse_python(path: str) -> list[dict]:
    """Extract functions from Python files."""
    import ast
    source = Path(path).read_text()
    tree = ast.parse(source)
    chunks = []
    lines = source.split("\\n")
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            text = "\\n".join(lines[node.lineno - 1 : node.end_lineno])
            chunks.append({"text": text, "name": node.name, "type": "function"})
    return chunks

# Demo
md_content = """## Installation
Install with pip install fastapi uvicorn.

## Basic Usage
Create an app with app = FastAPI().
Add routes with @app.get decorators.

## Authentication
Use OAuth2 with JWT tokens for auth."""

# Write temp file and parse
Path("/tmp/demo.md").write_text(md_content)
sections = parse_markdown("/tmp/demo.md")
print(f"Parsed {len(sections)} sections:")
for s in sections:
    print(f"  Section: {s['section'][:30]} ({len(s['text'])} chars)")`,
        expectedOutput: `Parsed 3 sections:
  Section: ## Installation            (54 chars)
  Section: ## Basic Usage             (87 chars)
  Section: ## Authentication           (59 chars)`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "Why is parsing quality important for RAG?", options: ["It makes embeddings faster", "Parsing determines the raw input quality — if table structure, code formatting, or headers are lost during parsing, no downstream optimization can recover that information", "It reduces storage costs", "It's not that important"], answer: 1, explanation: "Garbage in, garbage out. If a PDF table is parsed as jumbled text, the chunk embedding won't represent the table's meaning correctly, and the LLM won't be able to answer questions about the data. Good parsing preserves document structure (tables as markdown, code blocks intact, headers for hierarchy)." },
      { difficulty: "medium", question: "How should tables in PDFs be handled for RAG?", options: ["Ignore them — tables aren't important", "Convert to markdown table format to preserve structure, add section context, and for large tables chunk by row groups with headers repeated", "Store as images", "Convert to CSV files"], answer: 1, explanation: "Tables contain dense, structured information. Converting to markdown preserves the column/row structure that LLMs can understand. Adding context ('Table from Section 3: Revenue by Quarter') helps retrieval. Large tables should be chunked by row groups with headers repeated in each chunk so each chunk is self-contained." }
    ],
    commonMistakes: [
      { mistake: "Using a single parser for all document types", whyItHappens: "Simplicity — one function seems easier", howToAvoid: "PDFs, Word docs, HTML, code, and markdown each have different structures. Use format-specific parsers: PyMuPDF for PDFs, python-docx for Word, trafilatura for web, AST for code. A universal parser like Unstructured can help but format-specific parsers usually produce better results." },
      { mistake: "Losing table structure during parsing", whyItHappens: "Default text extraction flattens tables into lines", howToAvoid: "Use pdfplumber for PDF tables (better than PyMuPDF for tables). Convert tables to markdown format. Test your parser on documents with tables and verify the output preserves row/column relationships." }
    ],
    cheatSheet: `## Document Parsing Cheat Sheet
- **PDF**: PyMuPDF (text), pdfplumber (tables)
- **HTML**: trafilatura (article extraction)
- **Code**: AST parser (Python), tree-sitter (multi-language)
- **Word**: python-docx
- **Tables**: convert to markdown, add section context
- **Headers**: preserve hierarchy for structure-aware chunking
- **Metadata**: attach source, page, section to every chunk`,
    furtherReading: [
      { type: "docs", title: "Unstructured.io", url: "https://unstructured.io/", whyRead: "AI-powered document parsing library that handles PDFs, Word, HTML, images, and more. Good for complex documents where simple parsers fail." }
    ],
    flashcards: [
      { front: "Why does parsing quality matter for RAG?", back: "Parsing determines raw input quality. Lost table structure, code formatting, or headers can't be recovered by better embeddings or prompts. Garbage in → garbage out." },
      { front: "How should you parse PDF tables for RAG?", back: "Use pdfplumber (not PyMuPDF) for table extraction. Convert to markdown format to preserve structure. Add section context. For large tables, chunk by row groups with headers repeated." },
      { front: "How should code be parsed for RAG?", back: "Parse by logical units: functions and classes (not fixed character counts). Use AST for Python, tree-sitter for multi-language. Each function becomes a chunk with its docstring and metadata." }
    ]
  }
];
