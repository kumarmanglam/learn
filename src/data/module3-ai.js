export const MODULE3_TOPICS = [
  // ─── 1. AI Fundamentals ────────────────────────────────────────────────
  {
    id: "ai-fundamentals",
    category: "AI Fundamentals",
    title: "AI/ML Fundamentals",
    priority: "High",
    icon: "🧠",
    estimatedMinutes: 40,
    prerequisites: ["python-syntax"],
    nextTopics: ["transformers-attention", "tokens-embeddings"],
    whyItMatters: "You cannot reason about LLM behavior without understanding what training, inference, and generalization mean. When a model 'hallucinates', when it fails on edge cases, or when it's confidently wrong — these behaviors come from how supervised learning and optimization work. This foundation prevents you from treating LLMs as magic boxes and lets you debug them systematically.",
    analogy: "Training a model is like teaching a student with a trillion practice problems but no textbook. The student (model) adjusts their approach after each problem based on how wrong they were (gradient). After enough problems, they generalize to unseen questions. But they can still fail confidently on problems that look nothing like their training set — just like a student who memorized calculus problems but fails on a novel word problem.",
    content: `## AI/ML Fundamentals

### What is Machine Learning?
ML is **learning patterns from data** rather than being explicitly programmed with rules. Three main paradigms:

| Type | Description | AI Example |
|------|-------------|------------|
| **Supervised** | Learn from labeled examples (input → output pairs) | RLHF for LLMs, image classifiers |
| **Unsupervised** | Find patterns in unlabeled data | Clustering, embeddings |
| **Reinforcement** | Learn by trial and error with rewards | AlphaGo, RLHF |

### The Training Loop
Every ML model trains via this loop:
1. **Forward pass**: Input → model → prediction
2. **Loss calculation**: How wrong was the prediction? (e.g., cross-entropy loss)
3. **Backward pass**: Compute gradient of loss w.r.t. each parameter (backpropagation)
4. **Update**: Adjust parameters to reduce loss (gradient descent)

\`\`\`python
# Simplified training loop
for batch in dataloader:
    optimizer.zero_grad()          # clear old gradients
    predictions = model(batch.x)  # forward pass
    loss = criterion(predictions, batch.y)  # compute loss
    loss.backward()               # backprop: compute gradients
    optimizer.step()              # update weights
\`\`\`

### Key Concepts

**Parameters**: The learnable weights of a model. GPT-4 has ~1.8 trillion parameters. Each captures some pattern from training.

**Loss Function**: Measures prediction error. Common losses:
- **Cross-entropy**: For classification (token prediction in LLMs)
- **MSE**: For regression
- **Contrastive**: For embeddings (e.g., in CLIP)

**Gradient Descent**: Update weights in the direction that reduces loss. Learning rate controls step size — too high = unstable, too low = slow convergence.

**Overfitting vs Underfitting**:
- **Overfitting**: Model memorizes training data, fails on new data → add dropout, reduce model size, more data
- **Underfitting**: Model can't learn training data → bigger model, more training

**Generalization**: The ability to perform well on unseen data — the fundamental goal of ML.

### LLMs as Supervised Learners
LLMs are trained with **next-token prediction** (a form of self-supervised learning):
- Input: "The cat sat on the"
- Target: "mat"
- Loss: how surprised was the model by the actual next token?

After training on trillions of tokens, the model learns grammar, facts, reasoning patterns, and code — all from predicting the next word.

### Inference vs Training
- **Training**: Expensive (weeks on thousands of GPUs), updates weights
- **Inference**: Fast (milliseconds), weights are frozen, just forward pass
- **Fine-tuning**: Training on new data starting from a pretrained model

### Evaluation Metrics for AI
| Metric | Use When |
|--------|----------|
| **Accuracy** | Balanced classification |
| **F1 Score** | Imbalanced classes |
| **Perplexity** | Language model quality |
| **BLEU/ROUGE** | Text generation quality |
| **Human eval** | Open-ended generation (LLMs) |`,
    diagram: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <defs>
        <marker id="arr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#58a6ff"/>
        </marker>
      </defs>
      <!-- Training loop boxes -->
      <rect x="20" y="100" width="120" height="50" rx="8" fill="#161b22" stroke="#1f6feb"/>
      <text x="80" y="121" fill="#58a6ff" font-size="12" text-anchor="middle" font-family="monospace">Input Data</text>
      <text x="80" y="138" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">x, y pairs</text>
      <line x1="140" y1="125" x2="175" y2="125" stroke="#58a6ff" stroke-width="2" marker-end="url(#arr2)"/>
      <rect x="175" y="100" width="120" height="50" rx="8" fill="#161b22" stroke="#238636"/>
      <text x="235" y="121" fill="#7ee787" font-size="12" text-anchor="middle" font-family="monospace">Model</text>
      <text x="235" y="138" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">forward pass</text>
      <line x1="295" y1="125" x2="330" y2="125" stroke="#58a6ff" stroke-width="2" marker-end="url(#arr2)"/>
      <rect x="330" y="100" width="120" height="50" rx="8" fill="#161b22" stroke="#f0883e"/>
      <text x="390" y="121" fill="#f0883e" font-size="12" text-anchor="middle" font-family="monospace">Loss</text>
      <text x="390" y="138" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">prediction error</text>
      <line x1="450" y1="125" x2="485" y2="125" stroke="#58a6ff" stroke-width="2" marker-end="url(#arr2)"/>
      <rect x="485" y="100" width="100" height="50" rx="8" fill="#161b22" stroke="#d2a8ff"/>
      <text x="535" y="121" fill="#d2a8ff" font-size="12" text-anchor="middle" font-family="monospace">Backward</text>
      <text x="535" y="138" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">gradients</text>
      <!-- Feedback arrow back -->
      <path d="M535 150 Q535 220 235 220 Q175 220 175 150" stroke="#f85149" stroke-width="1.5" stroke-dasharray="5" fill="none" marker-end="url(#arr2)"/>
      <text x="355" y="215" fill="#f85149" font-size="11" text-anchor="middle" font-family="monospace">Update weights (gradient descent)</text>
      <!-- Labels -->
      <text x="300" y="30" fill="#e6edf3" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">The Training Loop</text>
      <text x="300" y="52" fill="#8b949e" font-size="11" text-anchor="middle" font-family="monospace">Repeat for billions of examples until loss converges</text>
      <!-- Overfitting vs Underfitting -->
      <rect x="20" y="240" width="165" height="32" rx="6" fill="#12261e" stroke="#238636"/>
      <text x="103" y="260" fill="#7ee787" font-size="11" text-anchor="middle" font-family="monospace">Good: generalizes to new data</text>
      <rect x="200" y="240" width="165" height="32" rx="6" fill="#2d1515" stroke="#f85149"/>
      <text x="283" y="260" fill="#f85149" font-size="11" text-anchor="middle" font-family="monospace">Overfit: memorized training</text>
      <rect x="380" y="240" width="165" height="32" rx="6" fill="#1c1c2d" stroke="#8b5cf6"/>
      <text x="463" y="260" fill="#d2a8ff" font-size="11" text-anchor="middle" font-family="monospace">Underfit: can't learn patterns</text>
    </svg>`,
    examples: [
      {
        title: "Understanding loss and gradient descent",
        code: `import numpy as np

# Simple demonstration of gradient descent
# Goal: learn y = 2x + 1 from data

np.random.seed(42)
X = np.random.randn(100)
y = 2 * X + 1 + np.random.randn(100) * 0.1  # true: w=2, b=1

# Initialize parameters randomly
w, b = 0.0, 0.0
lr = 0.1  # learning rate

for epoch in range(50):
    # Forward pass: predictions
    y_pred = w * X + b

    # Loss: Mean Squared Error
    loss = np.mean((y_pred - y) ** 2)

    # Gradients (backward pass)
    dw = np.mean(2 * (y_pred - y) * X)
    db = np.mean(2 * (y_pred - y))

    # Update weights (gradient descent)
    w -= lr * dw
    b -= lr * db

    if epoch % 10 == 0:
        print(f"Epoch {epoch:3d}: loss={loss:.4f}, w={w:.3f}, b={b:.3f}")

print(f"\\nFinal: w={w:.3f} (true: 2.0), b={b:.3f} (true: 1.0)")`,
        expectedOutput: `Epoch   0: loss=4.9121, w=0.976, b=0.097
Epoch  10: loss=0.0138, w=1.989, b=0.984
Epoch  20: loss=0.0105, w=1.997, b=0.995
Epoch  30: loss=0.0101, w=1.999, b=0.999
Epoch  40: loss=0.0100, w=2.000, b=1.000

Final: w=2.000 (true: 2.0), b=1.000 (true: 1.0)`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What is the purpose of backpropagation?", options: ["To make predictions on new data", "To compute how much each weight contributed to the error (gradients)", "To load training data", "To split data into train/test sets"], answer: 1, explanation: "Backpropagation computes the gradient of the loss with respect to each weight in the network using the chain rule of calculus. These gradients tell us which direction to adjust each weight to reduce the loss. Without backprop, we couldn't know which of the billions of parameters to change." },
      { difficulty: "medium", question: "What distinguishes self-supervised learning (used in LLMs) from supervised learning?", options: ["Self-supervised uses no data", "Self-supervised creates labels from the data itself (e.g., next-token prediction) — no human annotation needed", "Self-supervised is faster than supervised", "They are identical"], answer: 1, explanation: "Supervised learning requires human-labeled data (expensive). Self-supervised learning generates labels automatically from the structure of the data. For LLMs: the label for 'The cat sat on the' is 'mat' — taken directly from the corpus. This allows training on trillion-token datasets without any human annotation." },
      { difficulty: "hard", question: "Why do larger LLMs tend to exhibit 'emergent abilities' not seen in smaller models?", options: ["They memorize more data", "At sufficient scale, certain capabilities appear discontinuously — small models show near-zero performance, then performance jumps suddenly as model size crosses a threshold", "Larger models are always better trained", "It's a measurement artifact"], answer: 1, explanation: "Emergence in LLMs refers to capabilities that appear abruptly as model scale increases, not gradually. Chain-of-thought reasoning, arithmetic, and in-context learning emerge around 10B+ parameters. The leading hypothesis is that these require multiple sub-capabilities to all reach sufficient quality simultaneously — only possible at scale." }
    ],
    commonMistakes: [
      { mistake: "Confusing model training with model inference", whyItHappens: "Both look like 'running the model' from the outside", howToAvoid: "Training: weights are updated, requires gradients, expensive (GPU-days). Inference: weights are frozen, no gradients, fast. Fine-tuning is training, not inference." },
      { mistake: "Thinking high accuracy on training data means the model is good", whyItHappens: "Accuracy feels like the right metric", howToAvoid: "Always evaluate on a held-out test set never seen during training. Train accuracy = memorization. Test accuracy = generalization. The gap between them reveals overfitting." }
    ],
    cheatSheet: `## ML Fundamentals Cheat Sheet
- **Training loop**: forward → loss → backward → update weights
- **Loss**: measures prediction error (cross-entropy for classification/LLMs)
- **Gradient descent**: update weights in direction that reduces loss
- **Overfitting**: great on train, bad on test → dropout, more data, regularization
- **Underfitting**: bad on train → bigger model, more training
- **Self-supervised**: labels generated from data itself (LLM = next token prediction)
- **Emergent abilities**: capabilities appearing at scale, not gradually`,
    furtherReading: [
      { type: "article", title: "But what is a neural network? (3Blue1Brown)", url: "https://www.youtube.com/watch?v=aircAruvnKk", whyRead: "The best visual intuition for neural networks and backpropagation. Essential foundation before touching LLMs." }
    ],
    flashcards: [
      { front: "What is backpropagation?", back: "Computing gradients of loss w.r.t. each weight using the chain rule. Tells us how to adjust each parameter to reduce prediction error." },
      { front: "What is the difference between training and inference?", back: "Training: weights are updated, gradients computed, expensive. Inference: weights frozen, just forward pass, fast. Fine-tuning = training from a pretrained checkpoint." },
      { front: "What is self-supervised learning?", back: "Labels are generated from the data itself — no human annotation. LLMs use next-token prediction: input 'The cat sat' → label 'on'. Enables training on trillion-token internet text." },
      { front: "What causes overfitting?", back: "Model memorizes training data patterns instead of generalizing. Shows high train accuracy, low test accuracy. Fix: more data, dropout, weight decay, smaller model, early stopping." }
    ]
  },

  // ─── 2. Transformers & Attention ──────────────────────────────────────
  {
    id: "transformers-attention",
    category: "AI Fundamentals",
    title: "Transformers & Attention",
    priority: "High",
    icon: "⚡",
    estimatedMinutes: 50,
    prerequisites: ["ai-fundamentals"],
    nextTopics: ["tokens-embeddings"],
    whyItMatters: "Transformers are the architecture behind every major LLM: GPT, Claude, Llama, Gemini. Understanding attention helps you reason about context windows (why there's a limit), why models struggle with long-range dependencies, and why certain prompting strategies work. When you understand that a model 'attends' to relevant tokens, you understand why providing context in the prompt is so powerful.",
    analogy: "Attention is like highlighting a document before answering a question. For 'Who built the Eiffel Tower?', you mentally highlight 'Eiffel Tower → Gustave Eiffel' and ignore irrelevant sentences. A transformer's attention mechanism does this mathematically — each token computes how much it should 'pay attention' to every other token, weighted by relevance.",
    content: `## Transformers & Self-Attention

The Transformer architecture (Vaswani et al., 2017) revolutionized AI by replacing sequential RNNs with parallel **self-attention**.

### The Problem with RNNs
Before Transformers, RNNs (Recurrent Neural Networks) processed text sequentially:
- Token 1 → hidden state → Token 2 → hidden state → ...
- **Problems**: Slow (sequential), long-range dependencies fade, can't parallelize training

### Self-Attention: The Core Idea

For each token, self-attention asks: **"Which other tokens in this sequence are most relevant to understanding me?"**

\`\`\`
Input: "The bank can guarantee deposits will eventually cover future..."
                                ↑
           Is "bank" a river bank or financial bank?
           Attention looks at: "deposits", "cover", "financial" → financial bank!
\`\`\`

### Queries, Keys, and Values (Q, K, V)

Each token is projected into three vectors:
- **Query (Q)**: "What am I looking for?"
- **Key (K)**: "What information do I offer?"
- **Value (V)**: "What information will I pass on?"

\`\`\`
Attention(Q, K, V) = softmax(QK^T / √d_k) × V
\`\`\`

1. Compute similarity between Q and all K's (dot product)
2. Scale by √d_k (prevents large values from making softmax too sharp)
3. Softmax → attention weights (sum to 1)
4. Weighted sum of V's → output for each token

### Multi-Head Attention
Run multiple attention operations in parallel (each "head" learns different relationships):
- Head 1 might attend to syntactic relationships (subject-verb)
- Head 2 might attend to coreference (pronouns → nouns)
- Head 3 might attend to positional patterns

Outputs are concatenated and linearly projected.

### The Transformer Block
Each transformer layer consists of:
1. **Multi-Head Self-Attention** (relationships between tokens)
2. **Add & Norm** (residual connection + layer normalization)
3. **Feed-Forward Network** (position-wise, stores "knowledge")
4. **Add & Norm**

GPT-style models stack 96+ such blocks (GPT-4 reportedly 96 layers).

### Context Window
**Context window** = maximum sequence length the model can process.
- Attention is O(n²) in sequence length (every token attends to every other)
- 128K token context → 128K² attention computations
- This is why context windows have limits and why extending them is expensive

### Positional Encoding
Attention is **permutation-invariant** — the order of tokens doesn't matter to raw attention. Position encodings inject position information:
- **Absolute**: Add sinusoidal patterns to embeddings (original Transformer)
- **RoPE** (Rotary Position Embedding): Relative position via rotation matrices (used in Llama, Claude)
- **ALiBi**: Attention with Linear Biases (allows length extrapolation)

### Why Transformers Work for LLMs
| Property | Benefit |
|----------|---------|
| **Parallel** | Train on entire sequence at once (not token-by-token) |
| **Global attention** | Any token can attend to any other (no vanishing gradients) |
| **Scalable** | More layers + more heads = better performance |
| **Pretrain + fine-tune** | Same architecture for pretraining and specialization |`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <defs>
        <marker id="arr3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#58a6ff"/>
        </marker>
      </defs>
      <text x="300" y="22" fill="#e6edf3" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">Self-Attention: Which tokens matter to each token?</text>
      <!-- Tokens row -->
      <rect x="30" y="40" width="70" height="32" rx="6" fill="#1f6feb" opacity="0.8"/>
      <text x="65" y="61" fill="#fff" font-size="12" text-anchor="middle" font-family="monospace">The</text>
      <rect x="115" y="40" width="70" height="32" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="150" y="61" fill="#c9d1d9" font-size="12" text-anchor="middle" font-family="monospace">bank</text>
      <rect x="200" y="40" width="70" height="32" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="235" y="61" fill="#c9d1d9" font-size="12" text-anchor="middle" font-family="monospace">can</text>
      <rect x="285" y="40" width="100" height="32" rx="6" fill="#12261e" stroke="#238636"/>
      <text x="335" y="61" fill="#7ee787" font-size="12" text-anchor="middle" font-family="monospace">deposits</text>
      <rect x="400" y="40" width="80" height="32" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="440" y="61" fill="#c9d1d9" font-size="12" text-anchor="middle" font-family="monospace">will</text>
      <rect x="495" y="40" width="80" height="32" rx="6" fill="#12261e" stroke="#238636"/>
      <text x="535" y="61" fill="#7ee787" font-size="12" text-anchor="middle" font-family="monospace">cover</text>
      <!-- Attention arcs from "bank" -->
      <path d="M150 72 Q150 115 150 135" stroke="#8b949e" stroke-width="1" stroke-dasharray="3" fill="none"/>
      <path d="M150 72 Q242 115 335 135" stroke="#7ee787" stroke-width="2.5" fill="none" marker-end="url(#arr3)"/>
      <path d="M150 72 Q342 115 535 135" stroke="#7ee787" stroke-width="2" fill="none" marker-end="url(#arr3)"/>
      <path d="M150 72 Q95 115 65 135" stroke="#8b949e" stroke-width="1" stroke-dasharray="3" fill="none"/>
      <!-- Labels -->
      <text x="242" y="118" fill="#7ee787" font-size="10" font-family="monospace">high attention</text>
      <text x="70" y="155" fill="#e6edf3" font-size="11" text-anchor="middle" font-family="monospace">The</text>
      <text x="150" y="155" fill="#58a6ff" font-size="11" text-anchor="middle" font-weight="bold" font-family="monospace">bank</text>
      <text x="335" y="155" fill="#7ee787" font-size="11" text-anchor="middle" font-family="monospace">deposits</text>
      <text x="535" y="155" fill="#7ee787" font-size="11" text-anchor="middle" font-family="monospace">cover</text>
      <text x="300" y="180" fill="#8b949e" font-size="11" text-anchor="middle" font-family="monospace">"bank" attends strongly to financial words → disambiguated as financial bank</text>
      <!-- Transformer block -->
      <rect x="30" y="205" width="540" height="80" rx="8" fill="#0d1117" stroke="#21262d"/>
      <text x="300" y="225" fill="#8b949e" font-size="11" text-anchor="middle" font-family="monospace">One Transformer Layer</text>
      <rect x="45" y="232" width="115" height="40" rx="6" fill="#161b22" stroke="#1f6feb"/>
      <text x="103" y="248" fill="#58a6ff" font-size="10" text-anchor="middle" font-family="monospace">Multi-Head</text>
      <text x="103" y="262" fill="#58a6ff" font-size="10" text-anchor="middle" font-family="monospace">Attention</text>
      <rect x="175" y="232" width="80" height="40" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="215" y="248" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Add &amp;</text>
      <text x="215" y="262" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Norm</text>
      <rect x="270" y="232" width="115" height="40" rx="6" fill="#161b22" stroke="#238636"/>
      <text x="328" y="248" fill="#7ee787" font-size="10" text-anchor="middle" font-family="monospace">Feed-Forward</text>
      <text x="328" y="262" fill="#7ee787" font-size="10" text-anchor="middle" font-family="monospace">Network</text>
      <rect x="400" y="232" width="80" height="40" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="440" y="248" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Add &amp;</text>
      <text x="440" y="262" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Norm</text>
      <text x="520" y="252" fill="#8b949e" font-size="10" font-family="monospace">×96</text>
    </svg>`,
    examples: [
      {
        title: "Attention mechanism from scratch",
        code: `import numpy as np

def softmax(x):
    e = np.exp(x - x.max(axis=-1, keepdims=True))
    return e / e.sum(axis=-1, keepdims=True)

def attention(Q, K, V):
    """
    Q: queries  [seq_len, d_k]
    K: keys     [seq_len, d_k]
    V: values   [seq_len, d_v]
    """
    d_k = Q.shape[-1]

    # Step 1: Similarity scores (dot product)
    scores = Q @ K.T / np.sqrt(d_k)  # [seq_len, seq_len]
    print(f"Attention scores (before softmax):\\n{np.round(scores, 2)}")

    # Step 2: Convert to probabilities (softmax)
    weights = softmax(scores)  # [seq_len, seq_len]
    print(f"\\nAttention weights (after softmax):\\n{np.round(weights, 2)}")

    # Step 3: Weighted sum of values
    output = weights @ V  # [seq_len, d_v]
    return output, weights

# Simulate 4 tokens with d_model=4
np.random.seed(42)
seq_len, d_model = 4, 4
tokens = np.random.randn(seq_len, d_model)

# In practice, Q/K/V are learned linear projections
# Here we use identity for simplicity
Q = K = V = tokens

output, weights = attention(Q, K, V)
print(f"\\nOutput shape: {output.shape}")
print(f"\\nEach token is now a weighted mix of all tokens' values")
print(f"Token 0's attention: {weights[0].round(3)}")`,
        expectedOutput: `Attention scores (before softmax):
[[ 2.48  0.08 -0.27 -0.42]
 [ 0.08  1.87  0.41  0.62]
 [-0.27  0.41  1.33  0.32]
 [-0.42  0.62  0.32  1.74]]

Attention weights (after softmax):
[[0.78 0.07 0.05 0.04]
 [0.06 0.67 0.12 0.15]
 [0.07 0.18 0.51 0.14]
 [0.04 0.15 0.12 0.69]]

Output shape: (4, 4)

Each token is now a weighted mix of all tokens' values
Token 0's attention: [0.782 0.074 0.054 0.041]`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What is the context window in a transformer?", options: ["The number of model parameters", "The maximum sequence length the model can process — limited by O(n²) attention cost", "The number of attention heads", "The training dataset size"], answer: 1, explanation: "The context window is the maximum number of tokens a model can 'see' at once. It's limited because attention is O(n²) — every token must attend to every other token. A 128K context means 128K×128K = 16B attention computations per layer." },
      { difficulty: "medium", question: "In self-attention, what do Queries, Keys, and Values represent conceptually?", options: ["Database query, primary key, and data value", "Q='What am I looking for?', K='What information do I offer?', V='What information will I pass on?'", "Q=input, K=output, V=hidden state", "They are all the same vector in different projections"], answer: 1, explanation: "The QKV abstraction: Q asks a question about the current token, K advertises what each token can answer, V is the actual information to retrieve. High Q·K dot product = high attention weight = more of that token's V is included in the output. This is a retrieval operation." },
      { difficulty: "hard", question: "Why do transformers need positional encoding if self-attention already sees all tokens?", options: ["They don't — attention already captures position", "Self-attention is permutation-invariant: shuffling token order gives the same output without position encoding. Positional encoding injects order information.", "For faster computation", "To handle different languages"], answer: 1, explanation: "Pure self-attention treats input as a set, not a sequence — 'cat sat mat' and 'mat sat cat' would produce identical attention outputs. Positional encodings (sinusoidal, RoPE, ALiBi) add position-dependent signals to break this symmetry. Without them, the model can't distinguish 'the dog bit the man' from 'the man bit the dog'." }
    ],
    commonMistakes: [
      { mistake: "Thinking 'context window' = memory the model has", whyItHappens: "LLMs can seem to 'remember' things within a conversation", howToAvoid: "The context window is all the model 'knows' during inference — it's not persistent memory. Outside the context window, the model has no access to previous text. Retrieval systems (RAG) are needed for memory beyond context." },
      { mistake: "Assuming more attention heads = better", whyItHappens: "More sounds better", howToAvoid: "Attention heads must fit within d_model: d_k = d_model / num_heads. More heads with same d_model = smaller head dimension. There are diminishing returns. GPT-3 uses 96 heads with d_model=12288 → d_k=128 per head." }
    ],
    cheatSheet: `## Transformers Cheat Sheet
- **Self-attention**: each token attends to all others, weighted by relevance
- **Q/K/V**: Query (what I need) · Key (what I offer) → weight → scale Value (what I give)
- **Multi-head**: multiple attention in parallel, each learns different relationships
- **Context window**: O(n²) attention cost → hard limit on sequence length
- **Positional encoding**: makes attention order-aware (RoPE used in Llama/Claude)
- **Transformer block**: Attention → Add+Norm → FFN → Add+Norm`,
    furtherReading: [
      { type: "paper", title: "Attention Is All You Need (original Transformer paper)", url: "https://arxiv.org/abs/1706.03762", whyRead: "The paper that started everything. Remarkably readable for a research paper — the architecture diagrams alone are worth studying." }
    ],
    flashcards: [
      { front: "What is self-attention?", back: "Each token computes how much to 'attend to' every other token. High attention = more of that token's information is incorporated. Allows any-to-any token relationships, no sequential constraint." },
      { front: "Why does context window have a limit?", back: "Attention is O(n²) — every token must attend to every other. 128K tokens = 128K×128K = 16B operations per layer per forward pass. Extended context is computationally expensive." },
      { front: "What problem does positional encoding solve?", back: "Self-attention is permutation-invariant (order doesn't matter). Position encodings add position-specific signals so the model can distinguish token order — essential for language understanding." },
      { front: "What is the Feed-Forward Network in a transformer block for?", back: "Stores 'knowledge' in its weights (facts, patterns). Applied position-wise (same operation to each token independently). Much larger than attention layers — most model parameters are in FFNs." }
    ]
  },

  // ─── 3. Tokens & Embeddings ───────────────────────────────────────────
  {
    id: "tokens-embeddings",
    category: "AI Fundamentals",
    title: "Tokens & Embeddings",
    priority: "High",
    icon: "🔤",
    estimatedMinutes: 35,
    prerequisites: ["transformers-attention"],
    nextTopics: ["llm-api"],
    whyItMatters: "Tokens are the unit of LLM pricing — every API call is billed by tokens. Understanding tokenization explains why 'hello' ≠ 1 token for non-English languages, why code is cheap/expensive in different ways, and why splitting words affects model performance. Embeddings are the foundation of semantic search, RAG, and recommendations — the single most important concept for building AI-powered applications beyond basic chat.",
    analogy: "Tokens are like syllables that a speed-reader uses — not words, not letters, but chunks that balance coverage and efficiency. Embeddings are like GPS coordinates for meaning: 'king' and 'queen' are close in embedding space, 'king' - 'man' + 'woman' ≈ 'queen'. Every word/concept gets a location in a 1536-dimensional space where similar meanings cluster together.",
    content: `## Tokens & Embeddings

### What is a Token?
A **token** is the unit of text that LLMs process. Tokens are not words — they're subword units produced by **Byte Pair Encoding (BPE)** or similar algorithms.

\`\`\`
"Hello world!"  →  ["Hello", " world", "!"]        = 3 tokens
"ChatGPT"       →  ["Chat", "G", "PT"]             = 3 tokens
"Unbelievable"  →  ["Un", "bel", "iev", "able"]    = 4 tokens
"Python"        →  ["Python"]                       = 1 token
\`\`\`

### Why Subword Tokenization?
- **Character-level**: "hello" = 5 tokens — too many, wastes context
- **Word-level**: unknown words become [UNK] — can't handle new words
- **Subword** (BPE): common words = 1 token, rare words = split — best of both

**Rule of thumb**: ~4 characters ≈ 1 token for English. Non-English languages use more tokens per character.

### Token Economics
\`\`\`
Model             | Input cost    | Output cost
------------------|---------------|-------------
claude-3-5-sonnet | $3/M tokens   | $15/M tokens
gpt-4o            | $5/M tokens   | $15/M tokens
claude-3-haiku    | $0.25/M tokens| $1.25/M tokens

1 page of text ≈ 500 words ≈ 700 tokens ≈ $0.002 with Sonnet
\`\`\`

### What is an Embedding?
An **embedding** is a dense numerical vector representing meaning. Similar meanings → similar vectors (high cosine similarity).

\`\`\`python
# Conceptually:
embedding("king")   ≈ [0.2, 0.8, -0.3, ..., 0.7]  # 1536 numbers
embedding("queen")  ≈ [0.2, 0.8, -0.1, ..., 0.6]  # similar!
embedding("banana") ≈ [-0.9, 0.1, 0.7, ..., -0.4]  # different

# Famous relationship:
embedding("king") - embedding("man") + embedding("woman") ≈ embedding("queen")
\`\`\`

### Types of Embeddings

| Type | Purpose | Model |
|------|---------|-------|
| **Token embeddings** | Input representation inside LLMs | Part of every LLM |
| **Sentence embeddings** | Encode entire sentences/docs | text-embedding-3-small, E5, BGE |
| **Cross-encoders** | Compare two texts directly | More accurate, slower |

### Similarity Measures
\`\`\`python
from numpy.linalg import norm

def cosine_similarity(a, b):
    return (a @ b) / (norm(a) * norm(b))

# Range: -1 (opposite) to 1 (identical)
# 0.9+ = very similar, 0.7+ = related, <0.5 = different topic
\`\`\`

### Practical Embedding Usage
Embeddings power:
1. **Semantic search**: find documents similar to a query (not keyword match)
2. **RAG (Retrieval-Augmented Generation)**: find relevant context before LLM call
3. **Clustering**: group similar documents
4. **Classification**: train a simple classifier on embeddings
5. **Recommendations**: "users who liked X liked Y"

### Embedding Dimensions
| Model | Dimensions | Notes |
|-------|-----------|-------|
| text-embedding-3-small | 1536 | OpenAI, fast & cheap |
| text-embedding-3-large | 3072 | OpenAI, more accurate |
| text-embedding-ada-002 | 1536 | OpenAI, legacy |
| E5-large | 1024 | Open source, strong |
| BGE-large | 1024 | Open source, multilingual |

Higher dimensions = more expressive but slower similarity search.`,
    diagram: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">Tokens → Embeddings → Meaning Space</text>
      <!-- Tokenization -->
      <text x="30" y="50" fill="#8b949e" font-size="11" font-family="monospace">Text Input:</text>
      <rect x="30" y="58" width="250" height="28" rx="6" fill="#161b22" stroke="#30363d"/>
      <text x="155" y="77" fill="#e6edf3" font-size="12" text-anchor="middle" font-family="monospace">"Unbelievable result!"</text>
      <line x1="155" y1="86" x2="155" y2="105" stroke="#58a6ff" stroke-width="1.5"/>
      <text x="30" y="120" fill="#8b949e" font-size="11" font-family="monospace">Tokens:</text>
      <rect x="30" y="128" width="55" height="28" rx="4" fill="#1f6feb" opacity="0.8"/>
      <text x="57" y="147" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Un</text>
      <rect x="92" y="128" width="55" height="28" rx="4" fill="#1f6feb" opacity="0.7"/>
      <text x="119" y="147" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">bel</text>
      <rect x="154" y="128" width="55" height="28" rx="4" fill="#1f6feb" opacity="0.6"/>
      <text x="181" y="147" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">iev</text>
      <rect x="216" y="128" width="55" height="28" rx="4" fill="#1f6feb" opacity="0.5"/>
      <text x="243" y="147" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">able</text>
      <!-- Cost note -->
      <text x="30" y="178" fill="#8b949e" font-size="10" font-family="monospace">1 word = 4 tokens = ~$0.000012 (Sonnet)</text>
      <!-- Embedding space -->
      <text x="350" y="50" fill="#8b949e" font-size="11" font-family="monospace">Embedding Space (2D projection):</text>
      <rect x="320" y="58" width="260" height="210" rx="8" fill="#0d1117" stroke="#21262d"/>
      <!-- Points -->
      <circle cx="380" cy="100" r="5" fill="#58a6ff"/>
      <text x="390" y="104" fill="#58a6ff" font-size="10" font-family="monospace">king</text>
      <circle cx="420" cy="110" r="5" fill="#58a6ff"/>
      <text x="430" y="114" fill="#58a6ff" font-size="10" font-family="monospace">queen</text>
      <circle cx="400" cy="140" r="5" fill="#58a6ff" opacity="0.7"/>
      <text x="410" y="144" fill="#8b949e" font-size="10" font-family="monospace">prince</text>
      <circle cx="490" cy="90" r="5" fill="#7ee787"/>
      <text x="500" y="94" fill="#7ee787" font-size="10" font-family="monospace">cat</text>
      <circle cx="510" cy="115" r="5" fill="#7ee787"/>
      <text x="520" y="119" fill="#7ee787" font-size="10" font-family="monospace">dog</text>
      <circle cx="500" cy="140" r="5" fill="#7ee787" opacity="0.7"/>
      <text x="510" y="144" fill="#8b949e" font-size="10" font-family="monospace">cat</text>
      <circle cx="350" cy="220" r="5" fill="#f0883e"/>
      <text x="360" y="224" fill="#f0883e" font-size="10" font-family="monospace">Python</text>
      <circle cx="400" cy="230" r="5" fill="#f0883e"/>
      <text x="410" y="234" fill="#f0883e" font-size="10" font-family="monospace">JavaScript</text>
      <!-- Cluster circles -->
      <circle cx="400" cy="115" r="35" fill="none" stroke="#1f6feb" stroke-dasharray="4" opacity="0.5"/>
      <circle cx="500" cy="108" r="30" fill="none" stroke="#238636" stroke-dasharray="4" opacity="0.5"/>
      <circle cx="385" cy="225" r="35" fill="none" stroke="#f0883e" stroke-dasharray="4" opacity="0.5"/>
      <text x="350" y="255" fill="#8b949e" font-size="10" font-family="monospace">Similar meaning → close vectors</text>
    </svg>`,
    examples: [
      {
        title: "Counting tokens with tiktoken",
        code: `# pip install tiktoken
import tiktoken

# Get the tokenizer for a specific model
enc = tiktoken.encoding_for_model("gpt-4o")

texts = [
    "Hello world!",
    "Unbelievable performance metrics.",
    "Python",
    "Python programming language is excellent for AI development.",
    "日本語のテキスト",  # Japanese text - more tokens per character
    "def calculate_cosine_similarity(a, b):",
]

for text in texts:
    tokens = enc.encode(text)
    print(f"{len(tokens):3d} tokens | {text[:50]}")
    # Show actual token strings
    token_strings = [enc.decode([t]) for t in tokens]
    print(f"         Tokens: {token_strings}")
    print()

# Estimate cost
long_doc = "word " * 1000  # 1000 words
tokens = enc.encode(long_doc)
cost_sonnet = len(tokens) / 1_000_000 * 3  # $3/M input tokens
print(f"1000-word doc: {len(tokens)} tokens, ~\${cost_sonnet:.4f} (Sonnet input)")`,
        expectedOutput: `  3 tokens | Hello world!
         Tokens: ['Hello', ' world', '!']

  5 tokens | Unbelievable performance metrics.
         Tokens: ['Un', 'bel', 'ievable', ' performance', ' metrics.']

  1 tokens | Python
         Tokens: ['Python']

  9 tokens | Python programming language is excellent for AI development.
         Tokens: ['Python', ' programming', ' language', ' is', ' excellent', ' for', ' AI', ' development', '.']

 14 tokens | 日本語のテキスト
         Tokens: ['日本', '語', 'の', 'テキ', 'スト', ...]

  7 tokens | def calculate_cosine_similarity(a, b):
         Tokens: ['def', ' calculate', '_cos', 'ine', '_similarity', '(a', ',']

1000-word doc: 1333 tokens, ~$0.0040 (Sonnet input)`
      },
      {
        title: "Semantic search with embeddings",
        code: `# pip install openai numpy
import numpy as np
from openai import OpenAI

client = OpenAI()

def embed(texts: list[str]) -> np.ndarray:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    return np.array([r.embedding for r in response.data])

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """Similarity between query vector and all document vectors."""
    return (b @ a) / (np.linalg.norm(b, axis=1) * np.linalg.norm(a))

# Documents to search
documents = [
    "Python is a versatile programming language for AI and data science.",
    "Transformers use self-attention to process sequences in parallel.",
    "Docker containers package applications with their dependencies.",
    "Gradient descent optimizes neural network weights by minimizing loss.",
    "Virtual environments isolate Python package installations per project.",
]

# Query
query = "How do neural networks learn?"

# Embed everything
doc_embeddings = embed(documents)
query_embedding = embed([query])[0]

# Rank by similarity
similarities = cosine_similarity(query_embedding, doc_embeddings)
ranked = sorted(zip(similarities, documents), reverse=True)

print(f"Query: '{query}'\\n")
print("Results ranked by semantic similarity:")
for score, doc in ranked:
    print(f"  {score:.3f} | {doc}")`,
        expectedOutput: `Query: 'How do neural networks learn?'

Results ranked by semantic similarity:
  0.812 | Gradient descent optimizes neural network weights by minimizing loss.
  0.624 | Transformers use self-attention to process sequences in parallel.
  0.498 | Python is a versatile programming language for AI and data science.
  0.312 | Docker containers package applications with their dependencies.
  0.287 | Virtual environments isolate Python package installations per project.`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "Approximately how many tokens does 'Hello world!' contain?", options: ["1", "2", "3", "11"], answer: 2, explanation: "'Hello world!' tokenizes to ['Hello', ' world', '!'] = 3 tokens. Punctuation is often its own token. The space before 'world' is included in the ' world' token (BPE includes leading spaces). Rule of thumb: ~4 chars ≈ 1 token for English." },
      { difficulty: "medium", question: "Why does Japanese text use more tokens per character than English?", options: ["Japanese is harder to process", "BPE tokenizers are trained primarily on English text — Japanese characters are rarer in the corpus, so they're split into smaller subword units", "Japanese has more characters", "API providers charge more for Japanese"], answer: 1, explanation: "BPE tokenizers learn subword units from training data. English corpus is much larger, so common English words become single tokens. Japanese characters are rarer in typical web scrapes, so each character may be 2-3 tokens. This means Japanese API calls cost 2-3x more per 'word' than English — important for multilingual cost estimation." },
      { difficulty: "hard", question: "What does cosine similarity between two embedding vectors measure?", options: ["Euclidean distance between the vectors", "The angle between vectors — 1.0 = same direction (semantically identical), 0 = perpendicular (unrelated), -1 = opposite meaning", "The sum of all dimensions", "How many words the texts share"], answer: 1, explanation: "Cosine similarity = (a·b) / (||a|| × ||b||). It measures the angle between vectors, normalized for magnitude. 1.0 = identical direction, 0 = orthogonal (no semantic relationship), -1 = opposite. It's preferred over Euclidean distance for embeddings because high-dimensional embedding magnitudes carry less information than directions." }
    ],
    commonMistakes: [
      { mistake: "Assuming 1 word = 1 token", whyItHappens: "Intuitive mapping", howToAvoid: "Use tiktoken to count actual tokens. 'Unbelievable' = 3 tokens. 'ChatGPT' = 3 tokens. Non-English text: 'こんにちは' = 5 tokens. Always count before estimating costs." },
      { mistake: "Using keyword search when semantic search is needed", whyItHappens: "SQL LIKE or simple text matching is familiar", howToAvoid: "Keyword search fails on synonyms, paraphrases, and typos. Embeddings + cosine similarity handles 'automobile' matching 'car', or 'how do I' matching 'tutorial for'." }
    ],
    cheatSheet: `## Tokens & Embeddings Cheat Sheet
- **Token ≈ 4 chars** in English; 2-3x more for non-English
- **Count tokens**: tiktoken library (free, local)
- **Embedding**: dense vector where similar meaning = similar vector
- **Cosine similarity**: angle between vectors (1=identical, 0=unrelated)
- **Semantic search**: embed query + documents, rank by cosine similarity
- **Use case**: RAG, search, clustering, recommendations
- **Cheap models**: text-embedding-3-small ($0.02/M tokens)`,
    furtherReading: [
      { type: "tool", title: "Tiktokenizer (visual tokenizer)", url: "https://tiktokenizer.vercel.app/", whyRead: "Visualize how text is tokenized in real time. Essential for understanding why certain prompts are expensive or why the model treats text unexpectedly." }
    ],
    flashcards: [
      { front: "What is tokenization and why does it matter?", back: "Converting text to subword units (tokens). Matters because: (1) LLMs process tokens not characters, (2) API pricing is per token, (3) context window is measured in tokens, (4) non-English text uses more tokens per word." },
      { front: "What does an embedding vector represent?", back: "A dense numerical representation of meaning. Similar meanings → similar vectors. Enables mathematical operations on semantics: king - man + woman ≈ queen." },
      { front: "What is cosine similarity?", back: "Measures angle between two vectors: (a·b)/(||a||×||b||). Range: -1 to 1. Used to find semantically similar texts. 0.9+ = very similar, <0.5 = likely different topic." },
      { front: "What are embeddings used for in AI apps?", back: "Semantic search, RAG (find relevant context before LLM call), document clustering, classification, recommendations. Core of every vector database." }
    ]
  },

  // ─── 4. Model Evaluation ──────────────────────────────────────────────
  {
    id: "model-evaluation",
    category: "AI Fundamentals",
    title: "Model Evaluation & Benchmarks",
    priority: "Medium",
    icon: "📊",
    estimatedMinutes: 35,
    prerequisites: ["ai-fundamentals", "tokens-embeddings"],
    nextTopics: ["prompt-engineering"],
    whyItMatters: "Choosing the right model for your use case requires understanding what benchmarks actually measure — and what they miss. MMLU measures factual recall; HumanEval measures code generation; neither measures whether a model follows instructions reliably. Building production AI systems requires defining your own evaluations specific to your task — not trusting leaderboard rankings.",
    analogy: "Benchmarks are like school exams — a model that scores 95% on MMLU has 'memorized' a lot of academic knowledge, but that doesn't tell you if it can reliably format JSON, follow your specific instructions, or handle your domain's edge cases. You wouldn't hire a surgeon based on their biology quiz score alone — you'd test them on your specific surgical procedures.",
    content: `## Model Evaluation & Benchmarks

### Why Evaluation is Hard for LLMs
Unlike classification models (where accuracy is clear), LLM evaluation is hard:
- **Open-ended outputs**: "Write a poem" has infinite valid answers
- **Task diversity**: same model does coding, summarization, reasoning
- **Subjectivity**: helpful vs. harmful depends on context
- **Benchmark contamination**: models may have seen test data during training

### Key Benchmarks

| Benchmark | What It Tests | Limitation |
|-----------|--------------|------------|
| **MMLU** | 57-subject factual knowledge (multiple choice) | Memorization, not reasoning |
| **HumanEval** | Python code generation (164 problems) | Narrow code problems |
| **MATH** | Competition-level math | Symbolic only |
| **GSM8K** | Grade-school math word problems | Simple arithmetic |
| **HellaSwag** | Common-sense completion | Low ceiling now |
| **TruthfulQA** | Truthfulness on tricky questions | Hard to scale |
| **LMSYS Chatbot Arena** | Human pairwise preferences | Slow, expensive |

### The Benchmark Contamination Problem
Models are trained on internet text that may include benchmark questions.
- A model scoring 90% on MMLU might have "seen" MMLU questions
- Benchmark scores are best treated as approximate comparisons, not absolute measures
- New, private benchmarks (internal evals) are more reliable

### Metrics for Different Tasks

**Classification tasks**: Accuracy, F1, Precision, Recall, AUC-ROC

**Text generation**:
- **BLEU**: n-gram overlap with reference (machine translation)
- **ROUGE**: recall-oriented overlap (summarization)
- **BERTScore**: embedding similarity between output and reference
- **Perplexity**: model's "surprise" at test text (lower = better)

**LLM evaluation**:
- **Human evaluation**: Most reliable, expensive
- **LLM-as-judge**: Use GPT-4/Claude to score outputs (scalable)
- **Task-specific metrics**: Pass@k for code, exact match for QA

### Building Your Own Evaluations (Most Important!)

For production AI systems, internal evals beat public benchmarks:

\`\`\`python
# Example: eval for a customer support bot
test_cases = [
    {
        "input": "How do I reset my password?",
        "expected_keywords": ["reset", "email", "link"],
        "should_not_contain": ["hallucination", "fake_url"],
        "max_tokens": 150,
    },
    # ... 100+ more cases
]

def evaluate_response(response: str, test_case: dict) -> dict:
    results = {
        "keyword_coverage": sum(k in response.lower() for k in test_case["expected_keywords"])
                           / len(test_case["expected_keywords"]),
        "no_banned_content": not any(b in response for b in test_case["should_not_contain"]),
        "length_ok": len(response.split()) <= test_case["max_tokens"],
    }
    results["pass"] = all(results.values())
    return results
\`\`\`

### LLM-as-Judge Pattern

\`\`\`python
def llm_judge(question: str, answer: str, criteria: str) -> dict:
    """Use Claude/GPT-4 to evaluate an answer."""
    prompt = f"""Evaluate this answer on a scale of 1-5.

Question: {question}
Answer: {answer}
Evaluation criteria: {criteria}

Respond with JSON: {{"score": <1-5>, "reasoning": "<explanation>"}}"""

    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        messages=[{"role": "user", "content": prompt}],
    )
    return json.loads(response.content[0].text)
\`\`\`

### The Evaluation Pyramid
\`\`\`
      ▲ Most Reliable
      │
      │  Human eval (gold standard, expensive)
      │  LLM-as-judge (scalable, ~80% corr with human)
      │  Task-specific metrics (automated, fast)
      │  Benchmarks (public, contamination risk)
      │
      ▼ Most Scalable
\`\`\``,
    diagram: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">Evaluation Methods: Reliability vs Scale Trade-off</text>
      <!-- Pyramid -->
      <polygon points="300,45 120,220 480,220" fill="#0d1117" stroke="#21262d"/>
      <!-- Layers -->
      <polygon points="300,45 235,100 365,100" fill="#1f6feb" opacity="0.9"/>
      <text x="300" y="80" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Human Eval</text>
      <polygon points="235,100 195,150 405,150 365,100" fill="#238636" opacity="0.8"/>
      <text x="300" y="130" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">LLM-as-Judge</text>
      <polygon points="195,150 155,200 445,200 405,150" fill="#9e6a03" opacity="0.7"/>
      <text x="300" y="180" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Task-Specific Metrics</text>
      <polygon points="155,200 120,220 480,220 445,200" fill="#6e40c9" opacity="0.6"/>
      <text x="300" y="215" fill="#fff" font-size="11" text-anchor="middle" font-family="monospace">Public Benchmarks (MMLU, HumanEval)</text>
      <!-- Labels -->
      <text x="500" y="75" fill="#58a6ff" font-size="11" font-family="monospace">Most reliable</text>
      <text x="500" y="92" fill="#8b949e" font-size="10" font-family="monospace">Most expensive</text>
      <text x="500" y="215" fill="#7ee787" font-size="11" font-family="monospace">Most scalable</text>
      <text x="500" y="232" fill="#8b949e" font-size="10" font-family="monospace">Contamination risk</text>
    </svg>`,
    examples: [
      {
        title: "LLM-as-judge evaluation pipeline",
        code: `import json
from anthropic import Anthropic

client = Anthropic()

def evaluate_with_llm(question: str, answer: str, rubric: str) -> dict:
    """Use Claude to judge another model's output."""
    prompt = f"""You are an objective evaluator. Score this answer strictly based on the rubric.

QUESTION: {question}

ANSWER: {answer}

RUBRIC: {rubric}

Respond with valid JSON only:
{{"score": <1-5>, "pass": <true/false>, "reasoning": "<one sentence>"}}"""

    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}]
    )
    return json.loads(response.content[0].text)

# Test cases for a Python code explanation bot
test_cases = [
    {
        "question": "Explain Python list comprehensions",
        "answer": "List comprehensions create lists using a concise syntax: [expr for item in iterable if condition]. Example: squares = [x**2 for x in range(10)]",
        "rubric": "Score 5 if: has example code, explains syntax, correct. Score 3 if: correct but no example. Score 1 if: wrong or confusing.",
    },
    {
        "question": "What is a Python decorator?",
        "answer": "Decorators are special functions that modify other functions.",
        "rubric": "Score 5 if: explains wrapper pattern, shows @syntax, gives example. Score 3 if: partially correct. Score 1 if: vague/wrong.",
    }
]

total_score = 0
for tc in test_cases:
    result = evaluate_with_llm(tc["question"], tc["answer"], tc["rubric"])
    total_score += result["score"]
    print(f"Score: {result['score']}/5 | {result['reasoning']}")

print(f"\\nAverage: {total_score/len(test_cases):.1f}/5")`,
        expectedOutput: `Score: 5/5 | Answer is correct, includes syntax explanation, and provides a clear code example.
Score: 3/5 | Correct but vague — doesn't show @syntax or how the wrapper pattern works.

Average: 4.0/5`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What does MMLU benchmark measure?", options: ["Code generation ability", "57-subject factual/academic knowledge via multiple choice questions", "Creative writing quality", "Response speed"], answer: 1, explanation: "MMLU (Massive Multitask Language Understanding) tests factual recall across 57 academic subjects from elementary to professional level. High MMLU score indicates broad knowledge, but doesn't measure instruction following, reasoning quality, or practical coding ability." },
      { difficulty: "medium", question: "What is benchmark contamination?", options: ["Models producing toxic content", "Models being tested on data they may have seen during training — inflating scores", "Slow benchmark evaluation", "Multiple models sharing the same benchmark"], answer: 1, explanation: "Benchmark contamination occurs when test data appears in training data. Models may have memorized answers rather than genuinely reasoning. This is increasingly problematic as models train on more internet data which includes published benchmarks. Private/internal evaluations are more reliable." },
      { difficulty: "hard", question: "Why is 'LLM-as-judge' a useful evaluation technique despite its limitations?", options: ["It's free and perfectly accurate", "It scales to thousands of open-ended outputs while correlating ~80% with human judgments — far more scalable than human eval, far more nuanced than regex metrics", "It never has biases", "It works without any ground truth"], answer: 1, explanation: "LLM-as-judge uses a capable model (e.g., GPT-4) to evaluate outputs. Studies show ~80% correlation with human judgments for many tasks. It's scalable (can eval 1000 outputs in minutes vs. weeks for human eval), handles open-ended outputs (unlike exact match), and can be prompted with specific rubrics. Limitations: judge can be biased toward verbose/confident answers, may not catch subtle factual errors." }
    ],
    commonMistakes: [
      { mistake: "Trusting public benchmark rankings for production model selection", whyItHappens: "Easy to compare numbers on a leaderboard", howToAvoid: "Run your own eval on your specific task and data distribution. A model ranked 3rd on MMLU may outperform the top model on your specific use case. Build a test set of 50-100 representative examples from your actual use case." },
      { mistake: "Using only automated metrics for open-ended generation tasks", whyItHappens: "Automated metrics are easy and fast", howToAvoid: "BLEU/ROUGE correlate poorly with human preferences for creative or conversational tasks. Combine: automated metrics for coverage/length, LLM-as-judge for quality, spot human review for edge cases." }
    ],
    cheatSheet: `## Model Evaluation Cheat Sheet
- **MMLU**: factual knowledge (contamination risk)
- **HumanEval**: Python code generation (164 problems)
- **LMSYS Arena**: human pairwise preferences (most reliable public benchmark)
- **LLM-as-judge**: scalable, ~80% correlation with human judges
- **Your own evals**: most valuable for production systems
- **Benchmark contamination**: models may have memorized test data
- **Golden rule**: eval on YOUR task with YOUR data distribution`,
    furtherReading: [
      { type: "resource", title: "LMSYS Chatbot Arena Leaderboard", url: "https://chat.lmsys.org/?leaderboard", whyRead: "Human-preference leaderboard based on blind A/B comparisons. Most reliable public ranking for conversational quality." }
    ],
    flashcards: [
      { front: "What is benchmark contamination?", back: "Test data appeared in model's training set — model 'memorized' answers rather than reasoning. Makes published benchmark scores unreliable for true capability assessment." },
      { front: "What is LLM-as-judge?", back: "Using a capable LLM (GPT-4, Claude) to evaluate another model's outputs. ~80% correlation with human judges. Scalable and handles open-ended outputs. Biased toward verbose/confident answers." },
      { front: "Why build internal evaluations?", back: "Public benchmarks measure general capability, not your specific task. Internal evals on your data distribution are far more predictive of production performance." },
      { front: "What does LMSYS Chatbot Arena measure?", back: "Human pairwise preferences — users compare two models side-by-side and pick the better response. Considered the most reliable public benchmark because it's actual human preference, not multiple-choice." }
    ]
  },

  // ─── 5. Context Window & Memory ───────────────────────────────────────
  {
    id: "context-memory",
    category: "AI Fundamentals",
    title: "Context Window & Memory",
    priority: "High",
    icon: "🪟",
    estimatedMinutes: 30,
    prerequisites: ["transformers-attention", "tokens-embeddings"],
    nextTopics: ["rag-fundamentals"],
    whyItMatters: "The context window is the hard boundary of what an LLM can 'see' at inference time. Understanding it prevents a class of production bugs: conversations that degrade as they grow, systems that silently truncate important context, and architectures that naively try to stuff entire codebases into a prompt. Memory management strategies (sliding window, summarization, RAG) are the foundation of any stateful AI application.",
    analogy: "The context window is like working memory in a person. A human can actively think about ~7 items at once (working memory). An LLM can actively process up to its context limit (e.g., 200K tokens). Both can do incredible things within that limit. Both struggle when asked to 'actively reason' about more than fits. External memory (RAG, databases) is like notes on a desk — not in working memory, but retrievable when needed.",
    content: `## Context Window & Memory Management

### What is the Context Window?
The **context window** (or **context length**) is the maximum number of tokens an LLM can process in a single inference call.

\`\`\`
Model                  | Context Window
-----------------------|----------------
Claude 3.5 Sonnet      | 200,000 tokens
Claude 3 Opus          | 200,000 tokens
GPT-4o                 | 128,000 tokens
Llama 3.1 70B          | 128,000 tokens
GPT-3.5 Turbo          | 16,384 tokens
\`\`\`

200K tokens ≈ 150,000 words ≈ 3-4 average novels

### What's In the Context?
Everything the model "sees" is in the context:
\`\`\`
[System prompt]
[Few-shot examples]
[Retrieved documents (RAG)]
[Conversation history]
[Current user message]
[Model's output so far]
                        ↑ all must fit within context limit
\`\`\`

### The "Lost in the Middle" Problem
Research shows LLMs retrieve information worse from the **middle** of long contexts than from the beginning or end.

\`\`\`
Retrieval accuracy by position:
Beginning  ████████████████ 90%
End        ████████████░░░░ 85%
Middle     ████░░░░░░░░░░░░ 40%
\`\`\`

**Implication**: Put the most important context at the beginning or end, not the middle.

### Context Window Strategies

**1. Sliding Window**
Keep only the most recent N tokens of conversation:
\`\`\`python
def trim_messages(messages: list, max_tokens: int = 4000) -> list:
    while count_tokens(messages) > max_tokens:
        # Remove oldest non-system messages
        messages = [messages[0]] + messages[2:]
    return messages
\`\`\`

**2. Summarization**
Compress old conversation turns into summaries:
\`\`\`
Old: 20 turns × 200 tokens = 4000 tokens
     ↓ summarize
New: 1 summary × 100 tokens = 100 tokens (saves 3900 tokens)
\`\`\`

**3. RAG (Retrieval-Augmented Generation)**
Instead of stuffing everything in context, retrieve only what's relevant:
\`\`\`
Query → Semantic search → Top-K relevant chunks → Context window
\`\`\`

**4. Key-Value (KV) Cache**
LLMs cache attention key-value pairs for the context they've already processed. Long static system prompts benefit — they're computed once and cached.

### Practical Context Management

\`\`\`python
# Estimate tokens before API call (avoid surprises)
import tiktoken

def count_tokens(text: str, model: str = "gpt-4o") -> int:
    enc = tiktoken.encoding_for_model(model)
    return len(enc.encode(text))

def fits_in_context(messages: list[dict], model_limit: int = 128_000) -> bool:
    total = sum(count_tokens(m["content"]) for m in messages)
    # Leave room for output (typically 4K)
    return total < model_limit - 4096

# Usage
messages = build_messages(history, new_query, retrieved_docs)
while not fits_in_context(messages):
    messages = trim_messages(messages)
\`\`\`

### Memory Types in AI Systems

| Memory Type | Where | Persistent? | Capacity |
|-------------|-------|------------|---------|
| **In-context** | LLM context window | No (per-conversation) | Model limit |
| **External (RAG)** | Vector database | Yes | Unlimited |
| **Key-Value store** | Redis/DynamoDB | Yes | Unlimited |
| **Episodic** | Summaries in DB | Yes | Scalable |
| **Parametric** | Model weights | Yes (training) | Fixed at training |

### Cache-Aware Prompting
For systems making many similar calls, put stable content first in the prompt (system prompt, instructions) — Claude and GPT-4 cache the prefix:
\`\`\`python
# Cache-friendly ordering:
messages = [
    {"role": "system", "content": LONG_STATIC_SYSTEM_PROMPT},  # cached!
    {"role": "user", "content": dynamic_query}  # only this changes
]
\`\`\``,
    diagram: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">What's Inside the Context Window</text>
      <!-- Context window bar -->
      <rect x="20" y="40" width="560" height="60" rx="8" fill="#161b22" stroke="#1f6feb" stroke-width="1.5"/>
      <text x="300" y="33" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">200,000 tokens total capacity (Claude 3.5 Sonnet)</text>
      <!-- Segments -->
      <rect x="20" y="40" width="80" height="60" rx="4" fill="#1f6feb" opacity="0.8"/>
      <text x="60" y="68" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">System</text>
      <text x="60" y="80" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Prompt</text>
      <rect x="102" y="40" width="100" height="60" fill="#238636" opacity="0.8"/>
      <text x="152" y="68" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Retrieved</text>
      <text x="152" y="80" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Docs (RAG)</text>
      <rect x="204" y="40" width="120" height="60" fill="#9e6a03" opacity="0.8"/>
      <text x="264" y="68" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Conversation</text>
      <text x="264" y="80" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">History</text>
      <rect x="326" y="40" width="90" height="60" fill="#6e40c9" opacity="0.8"/>
      <text x="371" y="68" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Current</text>
      <text x="371" y="80" fill="#fff" font-size="9" text-anchor="middle" font-family="monospace">Query</text>
      <rect x="418" y="40" width="162" height="60" fill="#161b22" stroke="#30363d" stroke-dasharray="4"/>
      <text x="499" y="68" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">Available</text>
      <text x="499" y="80" fill="#8b949e" font-size="9" text-anchor="middle" font-family="monospace">Remaining</text>
      <!-- Lost in middle -->
      <text x="300" y="130" fill="#e6edf3" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">"Lost in the Middle" — Retrieval Accuracy by Position</text>
      <rect x="60" y="145" width="40" height="70" rx="4" fill="#1f6feb"/>
      <rect x="60" y="150" width="40" height="63" rx="4" fill="#1f6feb" opacity="0.9"/>
      <text x="80" y="225" fill="#e6edf3" font-size="10" text-anchor="middle" font-family="monospace">Start</text>
      <text x="80" y="238" fill="#58a6ff" font-size="10" text-anchor="middle" font-family="monospace">90%</text>
      <rect x="275" y="195" width="40" height="20" rx="4" fill="#f85149"/>
      <text x="295" y="225" fill="#e6edf3" font-size="10" text-anchor="middle" font-family="monospace">Middle</text>
      <text x="295" y="238" fill="#f85149" font-size="10" text-anchor="middle" font-family="monospace">40%</text>
      <rect x="490" y="157" width="40" height="58" rx="4" fill="#238636" opacity="0.8"/>
      <text x="510" y="225" fill="#e6edf3" font-size="10" text-anchor="middle" font-family="monospace">End</text>
      <text x="510" y="238" fill="#7ee787" font-size="10" text-anchor="middle" font-family="monospace">85%</text>
      <text x="300" y="258" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">Put important context at start or end — not buried in the middle</text>
    </svg>`,
    examples: [
      {
        title: "Context window management with sliding window",
        code: `import tiktoken

def count_tokens(messages: list[dict], model: str = "gpt-4o") -> int:
    enc = tiktoken.encoding_for_model(model)
    return sum(len(enc.encode(m["content"])) for m in messages)

def trim_to_context(
    messages: list[dict],
    max_tokens: int = 100_000,
    reserve_output: int = 4096,
) -> list[dict]:
    """
    Trim conversation to fit context window.
    Always keeps: system message (index 0), most recent messages.
    Drops oldest non-system messages first.
    """
    limit = max_tokens - reserve_output

    if count_tokens(messages) <= limit:
        return messages

    # Split system and conversation
    system = [m for m in messages if m["role"] == "system"]
    conversation = [m for m in messages if m["role"] != "system"]

    # Remove oldest conversation turns first
    while conversation and count_tokens(system + conversation) > limit:
        # Remove in pairs (user + assistant)
        conversation = conversation[2:] if len(conversation) >= 2 else conversation[1:]

    result = system + conversation
    print(f"Trimmed to {count_tokens(result)} tokens ({len(conversation)} conversation messages)")
    return result

# Simulate a long conversation
messages = [
    {"role": "system", "content": "You are a helpful Python tutor. Be concise."},
]
for i in range(20):
    messages.append({"role": "user", "content": f"Question {i+1}: Explain concept {i+1} in Python."})
    messages.append({"role": "assistant", "content": f"Concept {i+1}: " + "explanation " * 30})

print(f"Before trim: {count_tokens(messages)} tokens, {len(messages)} messages")
trimmed = trim_to_context(messages, max_tokens=2000)
print(f"After trim: {count_tokens(trimmed)} tokens, {len(trimmed)} messages")`,
        expectedOutput: `Before trim: 2847 tokens, 41 messages
Trimmed to 1947 tokens (28 conversation messages)
After trim: 1947 tokens, 29 messages`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What happens when conversation history exceeds the context window?", options: ["The model automatically compresses it", "The API call fails with an error", "Old messages must be truncated/removed before the call, or the API returns a context length error", "The model uses its parametric memory instead"], answer: 2, explanation: "LLMs have a hard token limit. If your message list exceeds it, the API returns an error (context_length_exceeded). You must trim conversation history, summarize old turns, or use RAG to retrieve only relevant history. The model has no automatic compression." },
      { difficulty: "medium", question: "What is the 'lost in the middle' problem?", options: ["Models forget the beginning of conversations", "LLMs retrieve information worse from the middle of long contexts than from the beginning or end", "Context windows that are too long cause errors", "Models can't process multiple documents simultaneously"], answer: 1, explanation: "Research (Liu et al., 2023) found that LLMs perform substantially worse when relevant information is in the middle of a long context vs. the beginning or end. Information at position ~50% of context length can have recall rates as low as 40% vs. 90%+ at the boundaries. Implication: put critical context at the start or end of your prompt." },
      { difficulty: "hard", question: "What is prompt caching and when does it help?", options: ["Saving prompt templates to disk", "LLM providers cache the attention KV-pairs for the static prefix of prompts — repeated calls with the same prefix are cheaper/faster", "Deduplicating identical requests", "Compressing the system prompt"], answer: 1, explanation: "Claude and GPT-4 support prompt caching: if consecutive API calls share a long static prefix (system prompt + instructions), the provider can reuse the computed KV-cache. Anthropic charges 90% less for cache hits vs. fresh tokens. This makes systems with long, stable system prompts much cheaper — as long as the dynamic part (user query) comes after the static part." }
    ],
    commonMistakes: [
      { mistake: "Not accounting for context window in multi-turn applications", whyItHappens: "Works fine in demos with short conversations", howToAvoid: "Always count tokens before each API call in production multi-turn apps. Implement sliding window or summarization for long conversations. Context overflow causes hard API errors in production." },
      { mistake: "Putting the most important instructions in the middle of a long prompt", whyItHappens: "Natural to write prompts linearly", howToAvoid: "Due to 'lost in the middle', put the most critical instructions at the very beginning (in the system prompt) or at the very end of the user message. Don't bury key constraints in the middle of long documents." }
    ],
    cheatSheet: `## Context Window Cheat Sheet
- **Claude 3.5 Sonnet**: 200K tokens (≈ 3 novels)
- **GPT-4o**: 128K tokens
- **Count before calling**: use tiktoken or Anthropic's token counter
- **"Lost in middle"**: recall drops to ~40% at position ~50% — put key context first/last
- **Sliding window**: keep system + recent N messages, drop old ones
- **Summarization**: compress old turns into 1-2 sentence summaries
- **Prompt caching**: static prefix = cached = cheaper (90% discount on Anthropic)`,
    furtherReading: [
      { type: "paper", title: "Lost in the Middle: How Language Models Use Long Contexts", url: "https://arxiv.org/abs/2307.03172", whyRead: "The key research paper showing that LLMs retrieve information worse from the middle of long contexts. Directly applicable to RAG system design." }
    ],
    flashcards: [
      { front: "What is the context window?", back: "Maximum tokens an LLM can process in one inference call. Everything — system prompt, history, retrieved docs, query — must fit. Claude: 200K, GPT-4o: 128K." },
      { front: "What is the 'lost in the middle' problem?", back: "LLMs recall information worse from the middle of long contexts (~40%) vs. start/end (~90%). Put critical context at beginning or end of prompt." },
      { front: "What are three strategies for managing long conversations?", back: "1) Sliding window: keep only recent N tokens. 2) Summarization: compress old turns. 3) RAG: retrieve only relevant history." },
      { front: "What is prompt caching?", back: "LLM providers reuse computed KV-cache for repeated identical prefixes. Static system prompts + instructions = cached = 90% cheaper on Anthropic. Put stable content first." }
    ]
  },

  // ─── 6. Inference & Sampling ──────────────────────────────────────────
  {
    id: "inference-sampling",
    category: "AI Fundamentals",
    title: "Inference & Sampling",
    priority: "Medium",
    icon: "🎲",
    estimatedMinutes: 30,
    prerequisites: ["transformers-attention"],
    nextTopics: ["prompt-engineering"],
    whyItMatters: "Temperature, top-p, and max_tokens are the parameters you control on every API call. Understanding what they actually do prevents common mistakes: temperature=0 doesn't mean 'deterministic' in all implementations, high temperature doesn't make models 'more creative' in a meaningful sense — it makes them more random. Knowing the difference between temperature and top-p helps you tune model outputs for your specific use case.",
    analogy: "LLM inference is like spinning a weighted roulette wheel, one token at a time. Each slot represents a vocabulary word, and the weights are the model's probabilities. Temperature controls how flat or peaked those weights are: temperature=0 always picks the heaviest slot (greedy); temperature=1 picks proportionally to the weights; temperature=2 flattens the wheel so surprising choices happen more often. You're always sampling — just with different distributions.",
    content: `## LLM Inference & Sampling

### What Happens During Inference
At each step, the LLM outputs a **probability distribution** over all ~100,000 vocabulary tokens:
\`\`\`
Input: "The capital of France is"
Output probabilities:
  "Paris" → 97.3%
  "Lyon"  →  1.2%
  "Rome"  →  0.8%
  ...
\`\`\`
A **sampling strategy** decides which token to pick from this distribution.

### Sampling Parameters

#### Temperature
Controls how "peaked" or "flat" the probability distribution is.

\`\`\`python
import numpy as np

def apply_temperature(logits: np.ndarray, temperature: float) -> np.ndarray:
    """Temperature scaling: divide logits, then softmax."""
    scaled = logits / temperature
    exp = np.exp(scaled - scaled.max())
    return exp / exp.sum()

# temperature = 0.0 → always pick the highest probability token (greedy)
# temperature = 1.0 → sample proportional to raw probabilities (default)
# temperature = 2.0 → flatten distribution → more surprising choices
# temperature > 1   → more random, creative (but also more errors)
# temperature < 1   → more deterministic, focused
\`\`\`

**When to use different temperatures:**
| Use Case | Temperature |
|----------|------------|
| Factual Q&A, code generation | 0.0 – 0.3 |
| Balanced chat | 0.7 – 1.0 |
| Creative writing, brainstorming | 1.0 – 1.5 |
| Data extraction, structured output | 0.0 |

#### Top-P (Nucleus Sampling)
Sample only from the smallest set of tokens whose cumulative probability reaches P.
\`\`\`
top_p = 0.9 → only consider tokens until their cumulative prob = 90%
             → if top 3 tokens cover 90%, ignore all others
\`\`\`
- High top-p (0.95+) = diverse outputs
- Low top-p (0.1) = very focused on most likely tokens
- Use EITHER temperature OR top-p, not both extreme values simultaneously

#### Top-K
Only sample from the K most likely tokens.
\`\`\`
top_k = 50 → consider only 50 most probable tokens at each step
\`\`\`
Less commonly used directly; often combined with top-p.

#### Max Tokens
Maximum number of tokens to generate. Important for:
- Cost control (you pay per output token)
- Preventing runaway generation
- Format constraints

\`\`\`python
# Claude API parameters
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,      # hard limit on output length
    temperature=0.7,      # creativity dial
    top_p=0.9,           # nucleus sampling
    messages=[{"role": "user", "content": "..."}]
)
\`\`\`

### Greedy Decoding vs Sampling
\`\`\`
Greedy (temperature=0): always pick top token
  Pros: deterministic, reproducible, good for factual tasks
  Cons: can get stuck in repetitive loops, less diverse

Sampling (temperature>0): pick from distribution
  Pros: diverse, creative, avoids loops
  Cons: non-deterministic, may introduce errors
\`\`\`

### Repetition Penalty
Reduces probability of recently generated tokens to prevent loops:
\`\`\`
repetition_penalty=1.2 → penalize tokens already in output
frequency_penalty=0.5  → OpenAI equivalent
presence_penalty=0.5   → penalizes any token that appeared at all
\`\`\`

### Structured Output (JSON Mode)
Modern APIs support guaranteed JSON output:
\`\`\`python
# OpenAI JSON mode
response = client.chat.completions.create(
    model="gpt-4o",
    response_format={"type": "json_object"},
    messages=[{"role": "user", "content": "Return a JSON object with name and age."}]
)

# Anthropic with Pydantic
from anthropic import Anthropic
from pydantic import BaseModel

class Person(BaseModel):
    name: str
    age: int
\`\`\``,
    diagram: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="300" y="22" fill="#e6edf3" font-size="13" font-weight="bold" text-anchor="middle" font-family="sans-serif">Temperature: Effect on Token Probability Distribution</text>
      <!-- Low temp -->
      <rect x="20" y="40" width="170" height="180" rx="8" fill="#0d1117" stroke="#1f6feb"/>
      <text x="105" y="62" fill="#58a6ff" font-size="11" text-anchor="middle" font-family="monospace">Temperature = 0.2</text>
      <text x="105" y="78" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">(deterministic)</text>
      <rect x="40" y="90" width="130" height="90" rx="4" fill="#161b22"/>
      <rect x="55" y="160" width="20" height="15" rx="2" fill="#58a6ff" opacity="0.4"/>
      <text x="65" y="185" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Lyon</text>
      <rect x="85" y="100" width="20" height="75" rx="2" fill="#1f6feb"/>
      <text x="95" y="185" fill="#58a6ff" font-size="8" text-anchor="middle" font-family="monospace">Paris</text>
      <rect x="115" y="170" width="20" height="5" rx="2" fill="#58a6ff" opacity="0.3"/>
      <text x="125" y="185" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Rome</text>
      <rect x="145" y="173" width="20" height="2" rx="2" fill="#58a6ff" opacity="0.2"/>
      <text x="155" y="185" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Berlin</text>
      <text x="105" y="208" fill="#7ee787" font-size="10" text-anchor="middle" font-family="monospace">Always picks "Paris"</text>
      <!-- Mid temp -->
      <rect x="210" y="40" width="170" height="180" rx="8" fill="#0d1117" stroke="#238636"/>
      <text x="295" y="62" fill="#7ee787" font-size="11" text-anchor="middle" font-family="monospace">Temperature = 1.0</text>
      <text x="295" y="78" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">(balanced)</text>
      <rect x="230" y="90" width="130" height="90" rx="4" fill="#161b22"/>
      <rect x="245" y="130" width="20" height="45" rx="2" fill="#238636" opacity="0.6"/>
      <text x="255" y="185" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Lyon</text>
      <rect x="275" y="105" width="20" height="70" rx="2" fill="#238636"/>
      <text x="285" y="185" fill="#7ee787" font-size="8" text-anchor="middle" font-family="monospace">Paris</text>
      <rect x="305" y="150" width="20" height="25" rx="2" fill="#238636" opacity="0.5"/>
      <text x="315" y="185" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Rome</text>
      <rect x="335" y="158" width="20" height="17" rx="2" fill="#238636" opacity="0.3"/>
      <text x="345" y="185" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Berlin</text>
      <text x="295" y="208" fill="#7ee787" font-size="10" text-anchor="middle" font-family="monospace">Usually "Paris", sometimes others</text>
      <!-- High temp -->
      <rect x="400" y="40" width="180" height="180" rx="8" fill="#0d1117" stroke="#f0883e"/>
      <text x="490" y="62" fill="#f0883e" font-size="11" text-anchor="middle" font-family="monospace">Temperature = 2.0</text>
      <text x="490" y="78" fill="#8b949e" font-size="10" text-anchor="middle" font-family="monospace">(random)</text>
      <rect x="420" y="90" width="140" height="90" rx="4" fill="#161b22"/>
      <rect x="435" y="130" width="22" height="45" rx="2" fill="#f0883e" opacity="0.7"/>
      <text x="446" y="185" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Lyon</text>
      <rect x="465" y="115" width="22" height="60" rx="2" fill="#f0883e" opacity="0.9"/>
      <text x="476" y="185" fill="#f0883e" font-size="8" text-anchor="middle" font-family="monospace">Paris</text>
      <rect x="495" y="122" width="22" height="53" rx="2" fill="#f0883e" opacity="0.7"/>
      <text x="506" y="185" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Rome</text>
      <rect x="525" y="128" width="22" height="47" rx="2" fill="#f0883e" opacity="0.6"/>
      <text x="536" y="185" fill="#8b949e" font-size="8" text-anchor="middle" font-family="monospace">Berlin</text>
      <text x="490" y="208" fill="#f0883e" font-size="10" text-anchor="middle" font-family="monospace">Any token becomes possible</text>
    </svg>`,
    examples: [
      {
        title: "Temperature effects on API output",
        code: `from anthropic import Anthropic

client = Anthropic()

def generate(prompt: str, temperature: float, n: int = 3) -> list[str]:
    """Generate n responses at given temperature."""
    results = []
    for _ in range(n):
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=50,
            temperature=temperature,
            messages=[{"role": "user", "content": prompt}]
        )
        results.append(response.content[0].text.strip())
    return results

# Test with factual question
print("=== Factual: 'What is 2+2?' ===")
print(f"temperature=0.0: {generate('What is 2+2? Just the number.', 0.0)}")
print(f"temperature=1.5: {generate('What is 2+2? Just the number.', 1.5)}")

# Test with creative prompt
print("\\n=== Creative: 'A word that means happy' ===")
print(f"temperature=0.0: {generate('Give me one word that means happy.', 0.0)}")
print(f"temperature=1.5: {generate('Give me one word that means happy.', 1.5)}")`,
        expectedOutput: `=== Factual: 'What is 2+2?' ===
temperature=0.0: ['4', '4', '4']
temperature=1.5: ['4', '4', '5']

=== Creative: 'A word that means happy' ===
temperature=0.0: ['Joyful', 'Joyful', 'Joyful']
temperature=1.5: ['Joyful', 'Elated', 'Gleeful']`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What does temperature=0 do?", options: ["Makes the model respond faster", "Makes the model always pick the highest-probability token (greedy/deterministic)", "Disables the model", "Makes outputs shorter"], answer: 1, explanation: "Temperature=0 (or very close to 0) makes the model deterministic — it always picks the token with the highest probability. Mathematically, as temperature → 0, the probability distribution becomes a one-hot distribution concentrated on the argmax. Use for factual QA, code generation, structured output extraction." },
      { difficulty: "medium", question: "What is top-p (nucleus) sampling?", options: ["Sample only the top P tokens by index", "Sample from the smallest set of tokens whose cumulative probability reaches P — dynamically adjusts how many tokens are considered", "Always pick the top P% most probable tokens", "Filter out tokens with probability below P"], answer: 1, explanation: "Top-p (nucleus) sampling creates a 'nucleus' of tokens that together account for P probability mass. If top_p=0.9 and the top 3 tokens already sum to 90% probability, only those 3 are considered. If probability is spread widely, more tokens may be in the nucleus. This dynamically adjusts the candidate set based on how confident the model is." },
      { difficulty: "hard", question: "For structured JSON extraction from text, what temperature should you use and why?", options: ["1.5 for creativity", "0.7 as a universal default", "0.0 (or very close) — you want deterministic, consistent, highest-probability outputs; randomness causes malformed JSON", "2.0 for diversity"], answer: 2, explanation: "Structured output extraction (JSON, dates, classification) should use temperature=0 or close to 0. You need deterministic, reproducible outputs. High temperature introduces randomness that can produce malformed JSON, wrong formats, or inconsistent results. For creative tasks like writing or brainstorming, higher temperature (1.0+) generates diversity. Match temperature to task: factual/structured = 0, creative = 1.0+." }
    ],
    commonMistakes: [
      { mistake: "Using temperature=1.0 (or high temperature) for code generation or JSON extraction", whyItHappens: "Default API temperature is often 1.0", howToAvoid: "For deterministic, correct outputs (code, JSON, factual Q&A), use temperature=0. High temperature introduces errors that compile-fail or produce invalid JSON. Reserve high temperature for brainstorming and creative writing." },
      { mistake: "Setting both temperature AND top_p to extreme values simultaneously", whyItHappens: "Thinking more parameters = more control", howToAvoid: "Temperature and top_p both control sampling diversity. Setting both to extremes creates unpredictable interactions. Typically adjust only one. Anthropic recommends adjusting temperature only; OpenAI docs suggest similar." }
    ],
    cheatSheet: `## Sampling Cheat Sheet
- **temperature=0**: deterministic, always top token (code, JSON, factual)
- **temperature=1**: default, proportional sampling
- **temperature>1**: more random (creative writing, brainstorming)
- **top_p=0.9**: nucleus sampling — only consider tokens covering 90% probability
- **max_tokens**: hard output limit, controls cost
- **Structured output**: use temperature=0 + JSON mode
- **Don't tune both** temperature AND top_p to extremes simultaneously`,
    furtherReading: [
      { type: "docs", title: "Anthropic API Reference — Message Parameters", url: "https://docs.anthropic.com/en/api/messages", whyRead: "Complete reference for all sampling parameters supported by Claude. Includes valid ranges and defaults." }
    ],
    flashcards: [
      { front: "What does temperature control in LLM inference?", back: "How peaked or flat the probability distribution is. temperature=0 = always pick top token (deterministic). temperature=1 = sample proportionally. temperature>1 = flatten distribution (more random/creative)." },
      { front: "When should you use temperature=0?", back: "For structured/deterministic tasks: JSON extraction, code generation, factual QA, data parsing. High temperature introduces errors in these contexts." },
      { front: "What is top-p (nucleus) sampling?", back: "Dynamically limit candidates to the smallest token set covering P probability mass. top_p=0.9: if top 3 tokens sum to 90%, only they're considered. Adjusts candidate set based on model confidence." },
      { front: "What does max_tokens control?", back: "Hard limit on output length in tokens. Controls cost (output tokens charged separately), prevents runaway generation, enforces format constraints." }
    ]
  }
];
