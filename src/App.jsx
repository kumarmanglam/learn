import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ─── Executable Code Runner ───
const CodeRunner = ({ code, title }) => {
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      const logs = [];
      const fakeConsole = {
        log: (...args) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
        error: (...args) => logs.push("❌ " + args.join(" ")),
        warn: (...args) => logs.push("⚠️ " + args.join(" ")),
      };
      try {
        const fn = new Function("console", code);
        fn(fakeConsole);
        if (logs.length === 0) logs.push("✅ Executed successfully (no output)");
      } catch (e) {
        logs.push("❌ Error: " + e.message);
      }
      setOutput(logs);
      setRunning(false);
    }, 300);
  };

  return (
    <div style={{ margin: "16px 0", background: "#0d1117", borderRadius: 10, overflow: "hidden", border: "1px solid #21262d" }}>
      {title && <div style={{ padding: "8px 14px", background: "#161b22", color: "#8b949e", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", borderBottom: "1px solid #21262d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{title}</span>
      </div>}
      <pre style={{ padding: "14px", margin: 0, color: "#e6edf3", fontSize: 13, lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace", overflowX: "auto", whiteSpace: "pre-wrap" }}>{code}</pre>
      <div style={{ padding: "8px 14px", borderTop: "1px solid #21262d", display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={run} disabled={running} style={{ background: running ? "#1f6feb55" : "#1f6feb", color: "#fff", border: "none", borderRadius: 6, padding: "6px 16px", cursor: running ? "default" : "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          {running ? "⏳ Running..." : "▶ Execute"}
        </button>
        {output && <button onClick={() => setOutput(null)} style={{ background: "transparent", color: "#8b949e", border: "1px solid #30363d", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>Clear</button>}
      </div>
      {output && (
        <div style={{ padding: "12px 14px", background: "#0a0e14", borderTop: "1px solid #21262d", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#7ee787" }}>
          <div style={{ color: "#8b949e", fontSize: 11, marginBottom: 6 }}>OUTPUT:</div>
          {output.map((l, i) => <div key={i} style={{ marginBottom: 3, color: l.startsWith("❌") ? "#f85149" : l.startsWith("⚠") ? "#d29922" : "#7ee787" }}>{l}</div>)}
        </div>
      )}
    </div>
  );
};

// ─── Quiz Component ───
const Quiz = ({ questions }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const q = questions[current];

  const handleSelect = (idx) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    if (idx === q.answer) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setDone(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setShowAnswer(false);
  };

  const reset = () => { setCurrent(0); setSelected(null); setScore(0); setDone(false); setShowAnswer(false); };

  if (done) return (
    <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
      <div style={{ color: "#e6edf3", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Quiz Complete!</div>
      <div style={{ color: "#7ee787", fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{score}/{questions.length}</div>
      <div style={{ color: "#8b949e", marginBottom: 16 }}>{score === questions.length ? "Perfect! You nailed it!" : score >= questions.length * 0.7 ? "Great job! Review the ones you missed." : "Keep studying and try again!"}</div>
      <button onClick={reset} style={{ background: "#1f6feb", color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>Retry Quiz</button>
    </div>
  );

  return (
    <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: 20, margin: "16px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ color: "#8b949e", fontSize: 13 }}>Question {current + 1}/{questions.length}</span>
        <span style={{ color: "#58a6ff", fontSize: 13 }}>Score: {score}</span>
      </div>
      <div style={{ color: "#e6edf3", fontSize: 15, fontWeight: 600, marginBottom: 14, lineHeight: 1.5 }}>{q.question}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {q.options.map((opt, i) => {
          let bg = "#161b22";
          let border = "#30363d";
          if (showAnswer) {
            if (i === q.answer) { bg = "#12261e"; border = "#238636"; }
            else if (i === selected) { bg = "#2d1418"; border = "#da3633"; }
          } else if (i === selected) { bg = "#1c2333"; border = "#1f6feb"; }
          return (
            <div key={i} onClick={() => handleSelect(i)} style={{ padding: "10px 14px", background: bg, border: `1px solid ${border}`, borderRadius: 8, color: "#e6edf3", cursor: showAnswer ? "default" : "pointer", fontSize: 14, transition: "all 0.15s" }}>
              <span style={{ color: "#8b949e", marginRight: 8 }}>{String.fromCharCode(65 + i)}.</span>{opt}
            </div>
          );
        })}
      </div>
      {showAnswer && (
        <div style={{ marginTop: 12 }}>
          <div style={{ color: "#8b949e", fontSize: 13, padding: "8px 12px", background: "#161b22", borderRadius: 6, lineHeight: 1.5 }}>
            💡 {q.explanation}
          </div>
          <button onClick={next} style={{ marginTop: 10, background: "#1f6feb", color: "#fff", border: "none", borderRadius: 6, padding: "8px 20px", cursor: "pointer", fontWeight: 600 }}>
            {current + 1 >= questions.length ? "See Results" : "Next →"}
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Diagram (SVG) ───
const Diagram = ({ svg, caption }) => (
  <div style={{ margin: "16px 0", textAlign: "center" }}>
    <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: 20, display: "inline-block", maxWidth: "100%" }} dangerouslySetInnerHTML={{ __html: svg }} />
    {caption && <div style={{ color: "#8b949e", fontSize: 12, marginTop: 6, fontStyle: "italic" }}>{caption}</div>}
  </div>
);

// ─── ALL TOPICS DATA ───
const TOPICS = [
  // ══════════════════════ JAVASCRIPT ══════════════════════
  {
    id: "closures",
    category: "JavaScript",
    title: "Closures",
    priority: "High",
    icon: "🔒",
    content: `## What is a Closure?

A **closure** is a function that **remembers** and can access variables from its **outer (enclosing) scope** even after the outer function has finished executing.

### Why does this happen?
JavaScript uses **lexical scoping** — a function's scope is determined by **where** it's written in code, not where it's called. When a function is returned from another function, it carries a reference to the outer function's variables.

### Three Pillars of Closures:
1. **Lexical Environment** — every function creates one
2. **Scope Chain** — inner function → outer function → global
3. **Persistence** — the environment survives even after outer returns

### How It Works Step by Step:
1. Outer function executes, creating its local variables
2. Inner function is defined — it captures a **reference** (not a copy!) to the outer variables
3. Outer function returns the inner function
4. Even though outer's execution context is popped off the call stack, its variables are NOT garbage collected because the inner function still references them
5. Calling the inner function later accesses those preserved variables

### Memory Perspective:
- Without closure: variables are garbage collected when function ends
- With closure: variables persist in memory as long as the inner function exists

### Real-World Use Cases:
- **Data privacy / encapsulation** (module pattern)
- **Function factories** (generate customized functions)
- **Event handlers** (preserve state across events)
- **Memoization / Caching** (remember previous results)
- **Partial application & currying** (pre-fill arguments)
- **Iterators** (maintain internal state)

### Common Pitfall — The Loop Problem:
Using \`var\` in loops creates closures that all share the same variable. Fix with \`let\` (block-scoped) or IIFE.

### Interview Speaking Points (3 min):
1. Define closure: function + its lexical environment
2. Explain lexical scoping vs dynamic scoping
3. Walk through the counter example step by step
4. Mention practical uses: data privacy, memoization, event handlers
5. Discuss the loop pitfall and solutions
6. Explain memory implications — closures can cause memory leaks if not careful`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <defs><linearGradient id="cg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1f6feb"/><stop offset="100%" stop-color="#388bfd"/></linearGradient></defs>
      <rect x="30" y="20" width="540" height="120" rx="12" fill="#161b22" stroke="#30363d"/>
      <text x="50" y="50" fill="#8b949e" font-size="13" font-family="monospace">outer() — Execution Context</text>
      <text x="50" y="75" fill="#e6edf3" font-size="14" font-family="monospace">let count = 0</text>
      <rect x="80" y="90" width="300" height="40" rx="8" fill="url(#cg1)" opacity="0.9"/>
      <text x="120" y="116" fill="#fff" font-size="13" font-weight="bold" font-family="monospace">inner() — Closure</text>
      <text x="400" y="116" fill="#7ee787" font-size="13" font-family="monospace">captures count</text>
      <path d="M380 110 L395 110" stroke="#7ee787" stroke-width="2" marker-end="url(#arr)"/>
      <rect x="400" y="160" width="160" height="50" rx="8" fill="#1c2333" stroke="#58a6ff"/>
      <text x="420" y="182" fill="#58a6ff" font-size="12" font-family="monospace">count</text>
      <text x="420" y="200" fill="#7ee787" font-size="12" font-family="monospace">persists in memory</text>
      <path d="M300 130 L480 160" stroke="#58a6ff" stroke-width="1.5" stroke-dasharray="4"/>
      <rect x="30" y="230" width="250" height="50" rx="8" fill="#0d1117" stroke="#30363d"/>
      <text x="50" y="252" fill="#8b949e" font-size="12" font-family="monospace">outer() finishes → popped</text>
      <text x="50" y="268" fill="#f85149" font-size="11" font-family="monospace">from call stack</text>
      <rect x="310" y="230" width="260" height="50" rx="8" fill="#12261e" stroke="#238636"/>
      <text x="330" y="252" fill="#7ee787" font-size="12" font-family="monospace">But count lives on!</text>
      <text x="330" y="268" fill="#7ee787" font-size="11" font-family="monospace">inner() still has reference</text>
    </svg>`,
    examples: [
      {
        title: "Basic Closure — Counter",
        code: `function makeCounter() {
  let count = 0; // closed-over variable
  return function() {
    count++;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

// Each call to makeCounter creates a NEW closure
const counter2 = makeCounter();
console.log(counter2()); // 1 (independent!)
console.log(counter());  // 4 (still counting)`
      },
      {
        title: "Data Privacy — Module Pattern",
        code: `function createBankAccount(initialBalance) {
  let balance = initialBalance; // private!
  
  return {
    deposit(amount) {
      balance += amount;
      console.log("Deposited: " + amount + " | Balance: " + balance);
    },
    withdraw(amount) {
      if (amount > balance) {
        console.log("Insufficient funds! Balance: " + balance);
        return;
      }
      balance -= amount;
      console.log("Withdrawn: " + amount + " | Balance: " + balance);
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(1000);
account.deposit(500);
account.withdraw(200);
console.log("Final balance:", account.getBalance());
// balance cannot be accessed directly!
// console.log(account.balance) → undefined`
      },
      {
        title: "Memoization with Closure",
        code: `function memoize(fn) {
  const cache = {}; // closed over
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache[key] !== undefined) {
      console.log("Cache HIT for:", key);
      return cache[key];
    }
    console.log("Cache MISS for:", key);
    cache[key] = fn(...args);
    return cache[key];
  };
}

const expensiveSquare = memoize((n) => {
  // Simulating expensive computation
  return n * n;
});

console.log(expensiveSquare(4));  // Cache MISS → 16
console.log(expensiveSquare(4));  // Cache HIT → 16
console.log(expensiveSquare(5));  // Cache MISS → 25
console.log(expensiveSquare(5));  // Cache HIT → 25`
      },
      {
        title: "Loop Pitfall & Fix",
        code: `// PROBLEM with var in loops
console.log("=== Problem with var ===");
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log("var i:", i); // All print 3!
  }, 100);
}

// FIX 1: Use let (block scope)
console.log("\\n=== Fix with let ===");
for (let j = 0; j < 3; j++) {
  setTimeout(function() {
    console.log("let j:", j); // 0, 1, 2
  }, 200);
}

// FIX 2: IIFE (creates new scope each iteration)
console.log("\\n=== Fix with IIFE ===");
for (var k = 0; k < 3; k++) {
  (function(k) {
    setTimeout(function() {
      console.log("iife k:", k); // 0, 1, 2
    }, 300);
  })(k);
}`
      },
      {
        title: "Function Factory",
        code: `function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const tenTimes = createMultiplier(10);

console.log(double(5));    // 10
console.log(triple(5));    // 15
console.log(tenTimes(5));  // 50

// Each function "remembers" its multiplier
console.log(double(100));  // 200
console.log(triple(100));  // 300`
      }
    ],
    quiz: [
      { question: "What is a closure?", options: ["A function inside a class", "A function that remembers its outer scope variables", "A way to close a function", "A type of loop"], answer: 1, explanation: "A closure is a function bundled with its lexical environment — it can access variables from its outer scope even after the outer function returns." },
      { question: "What determines a closure's scope in JavaScript?", options: ["Where the function is called (dynamic)", "Where the function is defined (lexical)", "The global scope only", "The nearest class"], answer: 1, explanation: "JavaScript uses lexical (static) scoping. A function's scope is determined by where it's written in code." },
      { question: "What happens to closed-over variables when the outer function finishes?", options: ["They are garbage collected", "They persist because the inner function holds a reference", "They become undefined", "They move to global scope"], answer: 1, explanation: "The variables persist in memory because the returned inner function still holds a reference to them via the closure." },
      { question: "In the loop pitfall using `var`, why do all callbacks print the same value?", options: ["var is function-scoped, so all callbacks share one i", "var doesn't work in loops", "setTimeout is broken", "Callbacks can't access loop variables"], answer: 0, explanation: "`var` is function-scoped, not block-scoped. All iterations share the same `i`, which is 3 by the time callbacks run." },
      { question: "Which is NOT a real use case for closures?", options: ["Memoization", "Data privacy", "Garbage collection", "Event handlers"], answer: 2, explanation: "Closures actually prevent garbage collection of closed-over variables. Memoization, data privacy, and event handlers are all valid closure use cases." }
    ]
  },
  {
    id: "currying",
    category: "JavaScript",
    title: "Currying & Partial Application",
    priority: "High",
    icon: "🍛",
    content: `## What is Currying?

**Currying** transforms a function that takes multiple arguments into a **sequence of functions**, each taking a **single argument**.

\`f(a, b, c)\` → \`f(a)(b)(c)\`

### Currying vs Partial Application:
- **Currying**: Always produces unary (single-argument) functions in a chain
- **Partial Application**: Fixes some arguments, returns a function taking the rest (may take multiple args)

### Why Currying Matters:
1. **Reusability** — create specialized functions from general ones
2. **Composition** — easier to compose single-argument functions
3. **Lazy evaluation** — defer computation until all args provided
4. **Configuration** — pre-configure functions with settings

### How It Works Internally:
1. Curried function checks: "Do I have enough arguments?"
2. If yes → execute the original function
3. If no → return a new function that collects more arguments
4. Repeat until all arguments are collected

### Real-World Uses:
- **Logger factories**: \`log("ERROR")(message)\`
- **Validators**: \`validate(rules)(data)\`
- **API builders**: \`request("GET")("/users")(params)\`
- **Event handlers**: \`handleEvent("click")(element)\`
- **Redux action creators**: curry pattern is everywhere

### Interview Speaking Points (3 min):
1. Define currying with the transformation formula
2. Distinguish from partial application
3. Show a manual curry example, then a generic curry utility
4. Explain practical benefits: reusability, composition
5. Mention how it's used in functional programming libraries (Lodash, Ramda)`,
    diagram: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <rect x="20" y="20" width="180" height="50" rx="8" fill="#1c2333" stroke="#58a6ff"/>
      <text x="45" y="50" fill="#58a6ff" font-size="14" font-family="monospace" font-weight="bold">add(a, b, c)</text>
      <text x="220" y="50" fill="#8b949e" font-size="20">→</text>
      <text x="240" y="35" fill="#f0883e" font-size="12" font-family="monospace">curry transform</text>
      <rect x="280" y="20" width="120" height="50" rx="8" fill="#1f6feb" stroke="#388bfd"/>
      <text x="295" y="50" fill="#fff" font-size="14" font-family="monospace">add(a)</text>
      <text x="410" y="50" fill="#8b949e" font-size="16">→</text>
      <rect x="430" y="20" width="70" height="50" rx="8" fill="#1f6feb" stroke="#388bfd"/>
      <text x="440" y="50" fill="#fff" font-size="14" font-family="monospace">(b)</text>
      <text x="510" y="50" fill="#8b949e" font-size="16">→</text>
      <rect x="530" y="20" width="55" height="50" rx="8" fill="#238636" stroke="#2ea043"/>
      <text x="540" y="50" fill="#fff" font-size="14" font-family="monospace">(c)</text>
      <text x="40" y="110" fill="#e6edf3" font-size="13" font-family="monospace">add(1, 2, 3)</text>
      <text x="220" y="110" fill="#8b949e" font-size="14">vs</text>
      <text x="290" y="110" fill="#7ee787" font-size="13" font-family="monospace">add(1)(2)(3)</text>
      <rect x="20" y="140" width="270" height="60" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="163" fill="#f0883e" font-size="12" font-weight="bold">Partial Application</text>
      <text x="40" y="185" fill="#e6edf3" font-size="12" font-family="monospace">const add5 = add.bind(null, 5)</text>
      <rect x="310" y="140" width="270" height="60" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="330" y="163" fill="#58a6ff" font-size="12" font-weight="bold">Currying</text>
      <text x="330" y="185" fill="#e6edf3" font-size="12" font-family="monospace">const add5 = curriedAdd(5)</text>
      <rect x="20" y="220" width="560" height="45" rx="8" fill="#12261e" stroke="#238636"/>
      <text x="40" y="248" fill="#7ee787" font-size="13">Both create reusable, specialized functions from general ones</text>
    </svg>`,
    examples: [
      {
        title: "Manual Currying",
        code: `// Non-curried
function add(a, b, c) {
  return a + b + c;
}
console.log(add(1, 2, 3)); // 6

// Manually curried
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

console.log(curriedAdd(1)(2)(3)); // 6

// Create specialized functions
const add10 = curriedAdd(10);
const add10and20 = add10(20);
console.log(add10and20(5));   // 35
console.log(add10and20(100)); // 130`
      },
      {
        title: "Generic Curry Utility",
        code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...args2) {
      return curried.apply(this, args.concat(args2));
    };
  };
}

// Usage
function multiply(a, b, c) { return a * b * c; }
const curriedMul = curry(multiply);

console.log(curriedMul(2)(3)(4));    // 24
console.log(curriedMul(2, 3)(4));    // 24 (partial works too!)
console.log(curriedMul(2)(3, 4));    // 24
console.log(curriedMul(2, 3, 4));    // 24 (all at once)`
      },
      {
        title: "Practical: Logger Factory",
        code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...args2) => curried(...args.concat(args2));
  };
}

const log = curry(function(level, module, message) {
  console.log("[" + level + "] [" + module + "] " + message);
});

// Create specialized loggers
const errorLog = log("ERROR");
const apiError = errorLog("API");
const dbError = errorLog("DATABASE");

apiError("Failed to fetch /users");
apiError("Timeout on /products");
dbError("Connection refused");

const infoLog = log("INFO");
infoLog("AUTH", "User logged in");
infoLog("CACHE", "Cache refreshed");`
      },
      {
        title: "Practical: Validator Pipeline",
        code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...a2) => curried(...args.concat(a2));
  };
}

const validate = curry(function(rule, errorMsg, value) {
  if (!rule(value)) return errorMsg;
  return null;
});

// Create reusable validators
const isRequired = validate(v => v !== "" && v != null, "Field is required");
const minLength = curry(function(min, value) {
  return value.length >= min ? null : "Min " + min + " chars required";
});
const isEmail = validate(v => v.includes("@"), "Invalid email");

// Use them!
console.log(isRequired("hello"));   // null (valid)
console.log(isRequired(""));        // "Field is required"
console.log(isEmail("test@a.com")); // null
console.log(isEmail("invalid"));    // "Invalid email"
console.log(minLength(5)("hi"));    // "Min 5 chars required"
console.log(minLength(5)("hello")); // null`
      }
    ],
    quiz: [
      { question: "What does currying do to a function?", options: ["Makes it faster", "Transforms multi-arg function into chain of single-arg functions", "Removes all arguments", "Makes it async"], answer: 1, explanation: "Currying transforms f(a,b,c) into f(a)(b)(c) — a sequence of single-argument functions." },
      { question: "What is the difference between currying and partial application?", options: ["They are identical", "Currying always returns unary functions; partial application fixes some args", "Partial application is slower", "Currying only works with 2 args"], answer: 1, explanation: "Currying produces a chain of unary (1-arg) functions. Partial application fixes some arguments upfront and may return a function accepting multiple remaining args." },
      { question: "In curry(fn), when does the original function execute?", options: ["Immediately", "When enough arguments are collected", "Only on the first call", "Never"], answer: 1, explanation: "The curried function collects arguments across calls and executes the original when it has received enough (args.length >= fn.length)." },
    ]
  },
  {
    id: "scope",
    category: "JavaScript",
    title: "Scope & Hoisting",
    priority: "High",
    icon: "🔭",
    content: `## Scope in JavaScript

**Scope** determines where variables are **accessible** in your code.

### Three Types:
1. **Global Scope** — accessible everywhere. Variables declared outside any function/block.
2. **Function Scope** — variables declared with \`var\` inside a function. Only accessible within that function.
3. **Block Scope** — variables declared with \`let\`/\`const\` inside \`{}\`. Only accessible within that block.

### var vs let vs const:
| Feature | var | let | const |
|---------|-----|-----|-------|
| Scope | Function | Block | Block |
| Hoisting | Yes (initialized as undefined) | Yes (TDZ) | Yes (TDZ) |
| Reassign | Yes | Yes | No |
| Redeclare | Yes | No | No |

### Hoisting:
JavaScript moves declarations to the top of their scope **before** execution.
- \`var\` → hoisted and initialized to \`undefined\`
- \`let\`/\`const\` → hoisted but NOT initialized (Temporal Dead Zone until declaration)
- Function declarations → fully hoisted (can call before definition)
- Function expressions → only the variable is hoisted

### Temporal Dead Zone (TDZ):
The period between entering the scope and the \`let\`/\`const\` declaration. Accessing the variable during TDZ throws \`ReferenceError\`.

### Scope Chain:
When a variable is used, JavaScript looks up the scope chain: current scope → parent scope → … → global scope. First match wins.

### Interview Speaking Points (3 min):
1. Define the three scopes with examples
2. Compare var/let/const with the table
3. Explain hoisting — what moves where
4. Explain TDZ and why it exists (catch bugs early)
5. Describe scope chain lookup process`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <rect x="20" y="10" width="560" height="280" rx="12" fill="#0d1117" stroke="#f0883e" stroke-dasharray="4"/>
      <text x="40" y="35" fill="#f0883e" font-size="13" font-weight="bold">Global Scope</text>
      <text x="40" y="55" fill="#e6edf3" font-size="12" font-family="monospace">var globalVar = "I'm global"</text>
      <rect x="50" y="70" width="500" height="100" rx="10" fill="#161b22" stroke="#58a6ff" stroke-dasharray="4"/>
      <text x="70" y="92" fill="#58a6ff" font-size="13" font-weight="bold">Function Scope (var lives here)</text>
      <text x="70" y="112" fill="#e6edf3" font-size="12" font-family="monospace">var funcVar = "I'm function-scoped"</text>
      <rect x="80" y="125" width="220" height="35" rx="6" fill="#1c2333" stroke="#7ee787"/>
      <text x="95" y="148" fill="#7ee787" font-size="11" font-family="monospace">{ let blockVar = "block" }</text>
      <rect x="310" y="125" width="220" height="35" rx="6" fill="#1c2333" stroke="#7ee787"/>
      <text x="325" y="148" fill="#7ee787" font-size="11" font-family="monospace">{ const x = "block too" }</text>
      <rect x="50" y="190" width="500" height="90" rx="10" fill="#161b22" stroke="#30363d"/>
      <text x="70" y="215" fill="#f0883e" font-size="13" font-weight="bold">Hoisting Behavior</text>
      <text x="70" y="237" fill="#8b949e" font-size="12" font-family="monospace">var → undefined (safe but confusing)</text>
      <text x="70" y="257" fill="#f85149" font-size="12" font-family="monospace">let/const → TDZ → ReferenceError!</text>
      <text x="70" y="272" fill="#7ee787" font-size="12" font-family="monospace">function → fully hoisted ✓</text>
    </svg>`,
    examples: [
      {
        title: "Scope Types Demonstrated",
        code: `var globalVar = "global";

function demo() {
  var funcVar = "function-scoped";
  
  if (true) {
    var varInBlock = "still function-scoped!";
    let letInBlock = "block-scoped";
    const constInBlock = "also block-scoped";
    console.log(letInBlock);   // ✅ "block-scoped"
    console.log(constInBlock); // ✅ "also block-scoped"
  }
  
  console.log(funcVar);    // ✅ "function-scoped"
  console.log(varInBlock); // ✅ "still function-scoped!" (var leaks!)
  
  try {
    console.log(letInBlock); // ❌ ReferenceError
  } catch(e) {
    console.log("letInBlock error:", e.message);
  }
}

demo();
console.log(globalVar); // ✅ "global"`
      },
      {
        title: "Hoisting in Action",
        code: `// var is hoisted (initialized as undefined)
console.log(a); // undefined (not an error!)
var a = 5;
console.log(a); // 5

// let is hoisted but in TDZ
try {
  console.log(b); // ReferenceError!
} catch(e) {
  console.log("let error:", e.message);
}
let b = 10;

// Function declaration — fully hoisted
console.log(greet()); // "Hello!" (works before definition)
function greet() { return "Hello!"; }

// Function expression — only variable hoisted
try {
  console.log(sayBye()); // TypeError!
} catch(e) {
  console.log("expression error:", e.message);
}
var sayBye = function() { return "Bye!"; };`
      }
    ],
    quiz: [
      { question: "What is the scope of `var`?", options: ["Block", "Function", "Global only", "Module"], answer: 1, explanation: "`var` is function-scoped. It's accessible throughout the entire function, even if declared inside a block like if/for." },
      { question: "What is the Temporal Dead Zone?", options: ["Time before script loads", "Period between scope entry and let/const declaration", "The global scope", "A memory leak"], answer: 1, explanation: "TDZ is the period between entering a scope and the let/const declaration line. Accessing the variable throws ReferenceError." },
      { question: "What does `console.log(x); var x = 5;` output?", options: ["5", "ReferenceError", "undefined", "null"], answer: 2, explanation: "`var x` is hoisted to the top and initialized as `undefined`. The assignment `x = 5` stays in place. So it logs `undefined`." }
    ]
  },
  {
    id: "this-keyword",
    category: "JavaScript",
    title: "this Keyword & Binding",
    priority: "High",
    icon: "👆",
    content: `## The \`this\` Keyword

\`this\` refers to the **object** that is executing the current function. Its value depends on **how** the function is called, not where it's defined.

### 5 Binding Rules (in order of precedence):
1. **new Binding** — \`this\` = newly created object
2. **Explicit Binding** — \`call()\`, \`apply()\`, \`bind()\` explicitly set \`this\`
3. **Implicit Binding** — object calling the method (left of the dot)
4. **Default Binding** — global object (window in browser, undefined in strict mode)
5. **Arrow Functions** — inherit \`this\` from enclosing lexical scope (NO own \`this\`)

### call vs apply vs bind:
- \`call(thisArg, arg1, arg2)\` — calls immediately with individual args
- \`apply(thisArg, [args])\` — calls immediately with args array
- \`bind(thisArg, arg1)\` — returns NEW function with \`this\` bound (doesn't call)

### Arrow Functions:
- Do NOT have their own \`this\`
- Inherit \`this\` from the enclosing scope at **definition time**
- Cannot be used as constructors
- \`call\`/\`apply\`/\`bind\` cannot change their \`this\`

### Interview Speaking Points (3 min):
1. State that \`this\` depends on call site, not definition
2. Walk through the 5 binding rules with examples
3. Explain call/apply/bind differences
4. Show how arrow functions solve the \`this\` problem in callbacks
5. Mention common pitfall: losing \`this\` when passing methods as callbacks`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="200" y="25" fill="#e6edf3" font-size="16" font-weight="bold">this Binding Rules</text>
      <rect x="20" y="40" width="130" height="60" rx="8" fill="#da3633" opacity="0.15" stroke="#da3633"/>
      <text x="35" y="65" fill="#f85149" font-size="12" font-weight="bold">1. new</text>
      <text x="35" y="82" fill="#e6edf3" font-size="10" font-family="monospace">this = {}</text>
      <rect x="160" y="40" width="130" height="60" rx="8" fill="#1f6feb" opacity="0.15" stroke="#1f6feb"/>
      <text x="175" y="65" fill="#58a6ff" font-size="12" font-weight="bold">2. Explicit</text>
      <text x="175" y="82" fill="#e6edf3" font-size="10" font-family="monospace">call/apply/bind</text>
      <rect x="300" y="40" width="130" height="60" rx="8" fill="#238636" opacity="0.15" stroke="#238636"/>
      <text x="315" y="65" fill="#7ee787" font-size="12" font-weight="bold">3. Implicit</text>
      <text x="315" y="82" fill="#e6edf3" font-size="10" font-family="monospace">obj.method()</text>
      <rect x="440" y="40" width="140" height="60" rx="8" fill="#f0883e" opacity="0.15" stroke="#f0883e"/>
      <text x="455" y="65" fill="#f0883e" font-size="12" font-weight="bold">4. Default</text>
      <text x="455" y="82" fill="#e6edf3" font-size="10" font-family="monospace">window/undefined</text>
      <text x="200" y="130" fill="#d2a8ff" font-size="14" font-weight="bold">↑ Priority Order (highest to lowest)</text>
      <rect x="20" y="150" width="560" height="70" rx="10" fill="#1c2333" stroke="#d2a8ff"/>
      <text x="40" y="175" fill="#d2a8ff" font-size="13" font-weight="bold">Arrow Function (Special)</text>
      <text x="40" y="198" fill="#e6edf3" font-size="12" font-family="monospace">() => {} → inherits this from parent scope, CANNOT be changed</text>
      <rect x="20" y="235" width="270" height="55" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="258" fill="#58a6ff" font-size="12" font-weight="bold">call(this, a, b)</text>
      <text x="40" y="278" fill="#8b949e" font-size="11">Invokes immediately, args listed</text>
      <rect x="300" y="235" width="130" height="55" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="315" y="258" fill="#58a6ff" font-size="12" font-weight="bold">apply(this, [])</text>
      <text x="315" y="278" fill="#8b949e" font-size="11">Args as array</text>
      <rect x="440" y="235" width="140" height="55" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="455" y="258" fill="#58a6ff" font-size="12" font-weight="bold">bind(this)</text>
      <text x="455" y="278" fill="#8b949e" font-size="11">Returns new fn</text>
    </svg>`,
    examples: [
      {
        title: "All Binding Rules",
        code: `const person = {
  name: "Kumar",
  greet() { 
    console.log("Hello, I'm " + this.name); 
  }
};

// 3. Implicit binding (left of dot)
person.greet(); // "Hello, I'm Kumar"

// 4. Default binding (loses context)
const greet = person.greet;
greet(); // "Hello, I'm undefined" (no object!)

// 2. Explicit binding
greet.call({ name: "Alice" });   // "Hello, I'm Alice"
greet.apply({ name: "Bob" });    // "Hello, I'm Bob"
const boundGreet = greet.bind({ name: "Charlie" });
boundGreet(); // "Hello, I'm Charlie"

// 1. new binding
function User(name) { this.name = name; }
const user = new User("Dev");
console.log(user.name); // "Dev"`
      },
      {
        title: "Arrow Function this",
        code: `const team = {
  name: "Engineering",
  members: ["Alice", "Bob", "Charlie"],
  
  // Regular function: this depends on call site
  showMembers() {
    console.log("Team:", this.name);
    
    // Arrow fn inherits this from showMembers
    this.members.forEach((member) => {
      console.log(member + " is in " + this.name);
    });
  },
  
  // Compare: regular function in forEach BREAKS
  showMembersBroken() {
    this.members.forEach(function(member) {
      // this is undefined/window here, NOT team!
      console.log(member + " is in " + this.name); // undefined
    });
  }
};

team.showMembers();     // ✅ Works!
console.log("---");
team.showMembersBroken(); // ❌ Broken!`
      },
      {
        title: "call vs apply vs bind",
        code: `function introduce(greeting, punctuation) {
  console.log(greeting + ", I'm " + this.name + punctuation);
}

const person = { name: "Kumar" };

// call — args listed individually
introduce.call(person, "Hi", "!");
// "Hi, I'm Kumar!"

// apply — args as array
introduce.apply(person, ["Hey", "!!"]);
// "Hey, I'm Kumar!!"

// bind — returns new function (doesn't call)
const intro = introduce.bind(person, "Hello");
intro(".");   // "Hello, I'm Kumar."
intro("!!!");  // "Hello, I'm Kumar!!!"

// Practical: Math.max with array
const nums = [3, 7, 1, 9, 4];
console.log(Math.max.apply(null, nums)); // 9
console.log(Math.max(...nums));          // 9 (modern)`
      }
    ],
    quiz: [
      { question: "In `obj.method()`, what is `this`?", options: ["global", "undefined", "obj", "method"], answer: 2, explanation: "This is implicit binding — `this` refers to the object to the left of the dot." },
      { question: "Can you change `this` of an arrow function with call/apply?", options: ["Yes", "No", "Only with bind", "Only in strict mode"], answer: 1, explanation: "Arrow functions inherit `this` from their lexical scope and it cannot be changed by call, apply, or bind." },
      { question: "What does `bind` return?", options: ["undefined", "The result of calling the function", "A new function with `this` bound", "The original function"], answer: 2, explanation: "`bind` returns a NEW function where `this` is permanently set to the provided value. It doesn't call the function." }
    ]
  },
  {
    id: "event-loop",
    category: "JavaScript",
    title: "Event Loop & Async",
    priority: "High",
    icon: "🔄",
    content: `## The Event Loop

JavaScript is **single-threaded** — it can only do one thing at a time. The event loop is the mechanism that allows it to handle asynchronous operations without blocking.

### Key Components:
1. **Call Stack** — LIFO stack where functions execute (one at a time)
2. **Web APIs** — browser-provided async APIs (setTimeout, fetch, DOM events)
3. **Callback Queue (Task Queue)** — holds callbacks from setTimeout, events, etc.
4. **Microtask Queue** — holds Promise callbacks (.then, async/await, MutationObserver)
5. **Event Loop** — continuously checks: Is call stack empty? If yes, push next task

### Execution Order:
1. Synchronous code runs first (all on call stack)
2. **Microtasks** (Promises) run next — ALL of them, before any macrotask
3. **Macrotasks** (setTimeout, setInterval) — one at a time, checking microtasks between each

### Priority: Sync > Microtask > Macrotask

### Common Async Patterns:
- \`setTimeout(fn, 0)\` — doesn't mean "run now", means "run after current sync + microtasks"
- \`Promise.resolve().then(fn)\` — runs before setTimeout even with 0ms delay
- \`queueMicrotask(fn)\` — explicitly add to microtask queue

### Interview Speaking Points (3 min):
1. Explain JS is single-threaded → needs event loop for async
2. Draw/describe the call stack, Web APIs, queues
3. Walk through a setTimeout + Promise example step by step
4. Emphasize: microtasks ALWAYS before macrotasks
5. Explain why this matters: UI responsiveness, avoiding blocking`,
    diagram: `<svg viewBox="0 0 620 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <rect x="10" y="10" width="140" height="190" rx="8" fill="#1c2333" stroke="#58a6ff"/>
      <text x="35" y="35" fill="#58a6ff" font-size="13" font-weight="bold">Call Stack</text>
      <rect x="20" y="50" width="120" height="28" rx="4" fill="#1f6feb" opacity="0.3" stroke="#1f6feb"/>
      <text x="35" y="69" fill="#e6edf3" font-size="11" font-family="monospace">main()</text>
      <rect x="20" y="85" width="120" height="28" rx="4" fill="#1f6feb" opacity="0.5" stroke="#1f6feb"/>
      <text x="35" y="104" fill="#e6edf3" font-size="11" font-family="monospace">fn()</text>
      <rect x="20" y="120" width="120" height="28" rx="4" fill="#1f6feb" opacity="0.7" stroke="#1f6feb"/>
      <text x="35" y="139" fill="#e6edf3" font-size="11" font-family="monospace">inner()</text>
      <text x="45" y="175" fill="#8b949e" font-size="10">LIFO ↑</text>
      <path d="M155 100 L220 70" stroke="#f0883e" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
      <rect x="220" y="10" width="170" height="80" rx="8" fill="#161b22" stroke="#f0883e"/>
      <text x="240" y="35" fill="#f0883e" font-size="13" font-weight="bold">Web APIs</text>
      <text x="240" y="55" fill="#e6edf3" font-size="11" font-family="monospace">setTimeout()</text>
      <text x="240" y="72" fill="#e6edf3" font-size="11" font-family="monospace">fetch(), DOM events</text>
      <path d="M305 90 L305 120" stroke="#f0883e" stroke-width="2" fill="none"/>
      <text x="310" y="112" fill="#f0883e" font-size="10">done ↓</text>
      <rect x="220" y="120" width="170" height="40" rx="8" fill="#161b22" stroke="#da3633"/>
      <text x="235" y="146" fill="#f85149" font-size="12" font-weight="bold">Macrotask Queue</text>
      <rect x="220" y="175" width="170" height="40" rx="8" fill="#12261e" stroke="#238636"/>
      <text x="235" y="200" fill="#7ee787" font-size="12" font-weight="bold">Microtask Queue ⭐</text>
      <rect x="420" y="60" width="180" height="160" rx="10" fill="#0d1117" stroke="#d2a8ff" stroke-width="2"/>
      <text x="445" y="90" fill="#d2a8ff" font-size="14" font-weight="bold">Event Loop</text>
      <text x="440" y="115" fill="#e6edf3" font-size="11">1. Stack empty?</text>
      <text x="440" y="137" fill="#7ee787" font-size="11">2. Run ALL microtasks</text>
      <text x="440" y="159" fill="#f85149" font-size="11">3. Run ONE macrotask</text>
      <text x="440" y="181" fill="#8b949e" font-size="11">4. Repeat forever</text>
      <text x="440" y="210" fill="#d2a8ff" font-size="11">🔁</text>
      <rect x="10" y="240" width="590" height="65" rx="8" fill="#1c2333" stroke="#58a6ff"/>
      <text x="30" y="265" fill="#58a6ff" font-size="13" font-weight="bold">Priority:</text>
      <text x="110" y="265" fill="#e6edf3" font-size="13">Sync Code</text>
      <text x="200" y="265" fill="#8b949e" font-size="13"> > </text>
      <text x="220" y="265" fill="#7ee787" font-size="13">Microtasks (Promises)</text>
      <text x="400" y="265" fill="#8b949e" font-size="13"> > </text>
      <text x="420" y="265" fill="#f85149" font-size="13">Macrotasks (setTimeout)</text>
      <text x="30" y="290" fill="#8b949e" font-size="11" font-family="monospace">console.log → .then() → setTimeout() callback</text>
    </svg>`,
    examples: [
      {
        title: "Classic Event Loop Question",
        code: `console.log("1 - Start");

setTimeout(() => {
  console.log("2 - setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("3 - Promise");
});

console.log("4 - End");

// Output order: 1, 4, 3, 2
// Why? Sync first (1,4), then microtask (3), then macrotask (2)`
      },
      {
        title: "Microtask vs Macrotask Deep Dive",
        code: `console.log("Start");

setTimeout(() => console.log("Timeout 1"), 0);
setTimeout(() => console.log("Timeout 2"), 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1");
    // Microtask inside microtask → runs BEFORE any setTimeout
    Promise.resolve().then(() => console.log("Promise 1-inner"));
  })
  .then(() => console.log("Promise 2"));

Promise.resolve().then(() => console.log("Promise 3"));

console.log("End");

// Order: Start, End, Promise 1, Promise 3, Promise 1-inner, Promise 2, Timeout 1, Timeout 2
// All microtasks drain before ANY setTimeout runs!`
      },
      {
        title: "async/await is Promise Sugar",
        code: `async function demo() {
  console.log("1 - async start"); // sync!
  
  const result = await Promise.resolve("resolved");
  // Everything after await is like .then() — microtask!
  
  console.log("2 - after await:", result);
  return "done";
}

console.log("3 - before calling demo");
demo().then(val => console.log("4 - demo returned:", val));
console.log("5 - after calling demo");

// Order: 3, 1, 5, 2, 4
// "1" runs sync (before await), "5" runs sync
// "2" and "4" are microtasks`
      }
    ],
    quiz: [
      { question: "What runs first: setTimeout(fn, 0) or Promise.resolve().then(fn)?", options: ["setTimeout", "Promise.then", "They run at the same time", "Neither"], answer: 1, explanation: "Promises go to the microtask queue which has higher priority than the macrotask queue (where setTimeout goes). ALL microtasks run before any macrotask." },
      { question: "JavaScript is:", options: ["Multi-threaded", "Single-threaded with event loop", "Dual-threaded", "Thread-free"], answer: 1, explanation: "JavaScript runs on a single thread but uses the event loop to handle async operations without blocking." },
      { question: "When does the event loop move tasks from the queue to the call stack?", options: ["Immediately", "When the call stack is empty", "Every 16ms", "When there are 5+ tasks"], answer: 1, explanation: "The event loop only pushes tasks from the queue to the call stack when the stack is completely empty." }
    ]
  },
  {
    id: "promises-async",
    category: "JavaScript",
    title: "Promises & Async/Await",
    priority: "High",
    icon: "⏳",
    content: `## Promises & Async/Await

### Promise States:
- **Pending** — initial state, neither fulfilled nor rejected
- **Fulfilled** — operation completed successfully
- **Rejected** — operation failed

### Promise Methods:
- \`.then(onFulfilled)\` — handle success
- \`.catch(onRejected)\` — handle error
- \`.finally(onSettled)\` — always runs
- \`Promise.all([])\` — wait for ALL (fails fast on any rejection)
- \`Promise.allSettled([])\` — wait for ALL (never fails, reports each)
- \`Promise.race([])\` — first to settle wins
- \`Promise.any([])\` — first to FULFILL wins

### Async/Await:
- \`async\` function always returns a Promise
- \`await\` pauses execution until the Promise settles
- Under the hood, \`await\` uses \`.then()\` — it's syntactic sugar
- Use \`try/catch\` for error handling

### Error Handling Patterns:
1. \`.catch()\` at end of chain
2. \`try/catch\` with async/await
3. Global: \`window.addEventListener('unhandledrejection', ...)\`

### Interview Speaking Points (3 min):
1. Explain the 3 states with a diagram
2. Show .then() chaining vs async/await
3. Compare Promise.all vs allSettled vs race vs any
4. Demonstrate error handling in both styles
5. Explain how async/await is sugar over Promises`,
    diagram: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <rect x="220" y="20" width="140" height="45" rx="8" fill="#f0883e" opacity="0.2" stroke="#f0883e"/>
      <text x="250" y="48" fill="#f0883e" font-size="14" font-weight="bold">Pending ⏳</text>
      <path d="M230 65 L130 100" stroke="#238636" stroke-width="2"/>
      <path d="M350 65 L450 100" stroke="#da3633" stroke-width="2"/>
      <rect x="40" y="100" width="170" height="45" rx="8" fill="#238636" opacity="0.2" stroke="#238636"/>
      <text x="60" y="128" fill="#7ee787" font-size="14" font-weight="bold">Fulfilled ✅</text>
      <rect x="380" y="100" width="170" height="45" rx="8" fill="#da3633" opacity="0.2" stroke="#da3633"/>
      <text x="410" y="128" fill="#f85149" font-size="14" font-weight="bold">Rejected ❌</text>
      <text x="80" y="170" fill="#8b949e" font-size="11" font-family="monospace">.then(value)</text>
      <text x="420" y="170" fill="#8b949e" font-size="11" font-family="monospace">.catch(error)</text>
      <text x="230" y="190" fill="#d2a8ff" font-size="11" font-family="monospace">.finally() — always runs</text>
    </svg>`,
    examples: [
      {
        title: "Promise Chaining vs Async/Await",
        code: `// Simulating API call
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) resolve({ id, name: "User_" + id });
      else reject(new Error("Invalid ID"));
    }, 100);
  });
}

// Promise chaining
fetchUser(1)
  .then(user => {
    console.log("Chain - Got:", user.name);
    return fetchUser(2); // chain another async
  })
  .then(user => console.log("Chain - Got:", user.name))
  .catch(err => console.log("Chain error:", err.message))
  .finally(() => console.log("Chain - Done!"));

// Same thing with async/await (cleaner!)
async function getUsers() {
  try {
    const user1 = await fetchUser(1);
    console.log("Await - Got:", user1.name);
    const user2 = await fetchUser(2);
    console.log("Await - Got:", user2.name);
  } catch (err) {
    console.log("Await error:", err.message);
  } finally {
    console.log("Await - Done!");
  }
}
getUsers();`
      },
      {
        title: "Promise.all vs allSettled vs race vs any",
        code: `const fast = new Promise(r => setTimeout(() => r("fast"), 50));
const slow = new Promise(r => setTimeout(() => r("slow"), 200));
const fail = new Promise((_, rej) => setTimeout(() => rej("error!"), 100));

// Promise.all — waits for ALL, fails on ANY rejection
Promise.all([fast, slow])
  .then(results => console.log("all:", results));

// Promise.all with failure
Promise.all([fast, fail, slow])
  .catch(err => console.log("all failed:", err));

// Promise.allSettled — waits for ALL, never rejects
Promise.allSettled([fast, fail, slow])
  .then(results => {
    results.forEach((r, i) => 
      console.log("allSettled[" + i + "]:", r.status, r.value || r.reason)
    );
  });

// Promise.race — first to SETTLE (fulfill or reject)
Promise.race([fast, slow])
  .then(result => console.log("race:", result));

// Promise.any — first to FULFILL (ignores rejections)
Promise.any([fail, fast, slow])
  .then(result => console.log("any:", result));`
      },
      {
        title: "Sequential vs Parallel Execution",
        code: `function delay(ms, val) {
  return new Promise(r => setTimeout(() => r(val), ms));
}

async function sequential() {
  console.time("sequential");
  const a = await delay(100, "A"); // wait 100ms
  const b = await delay(100, "B"); // wait another 100ms
  console.log("Sequential:", a, b);
  console.timeEnd("sequential"); // ~200ms
}

async function parallel() {
  console.time("parallel");
  const [a, b] = await Promise.all([
    delay(100, "A"), // both start immediately
    delay(100, "B"),
  ]);
  console.log("Parallel:", a, b);
  console.timeEnd("parallel"); // ~100ms
}

sequential();
parallel();`
      }
    ],
    quiz: [
      { question: "What are the 3 states of a Promise?", options: ["Start, Middle, End", "Pending, Fulfilled, Rejected", "Loading, Success, Error", "Init, Running, Done"], answer: 1, explanation: "A Promise is always in one of three states: pending (waiting), fulfilled (resolved with value), or rejected (failed with reason)." },
      { question: "What does Promise.all do if ONE promise rejects?", options: ["Ignores it", "Waits for the rest", "Immediately rejects", "Retries it"], answer: 2, explanation: "Promise.all fails fast — if any promise rejects, the entire Promise.all rejects immediately. Use Promise.allSettled to wait for all regardless." },
      { question: "async function always returns:", options: ["undefined", "A Promise", "The last value", "An object"], answer: 1, explanation: "An async function always returns a Promise. Even if you return a plain value, it's wrapped in Promise.resolve()." }
    ]
  },
  {
    id: "es6-features",
    category: "JavaScript",
    title: "ES6+ Features",
    priority: "High",
    icon: "✨",
    content: `## ES6+ Key Features

### Destructuring:
Extract values from arrays/objects into variables.
- **Object**: \`const { name, age } = person;\`
- **Array**: \`const [first, ...rest] = arr;\`
- **Nested**: \`const { address: { city } } = user;\`
- **Defaults**: \`const { name = "Unknown" } = obj;\`
- **Rename**: \`const { name: fullName } = obj;\`

### Spread (...) vs Rest (...):
- **Spread** = expands elements: \`[...arr1, ...arr2]\`, \`{...obj1, ...obj2}\`
- **Rest** = collects elements: \`function fn(...args)\`, \`const [a, ...rest] = arr\`
Same syntax, opposite operations!

### Template Literals:
Backtick strings with \`\${expression}\` interpolation and multi-line support.

### Optional Chaining (?.) & Nullish Coalescing (??):
- \`obj?.prop?.nested\` — returns undefined instead of throwing
- \`value ?? fallback\` — only falls back on null/undefined (not 0 or "")

### Other Key Features:
- **Arrow functions**: concise syntax, lexical \`this\`
- **Default parameters**: \`function fn(x = 10)\`
- **for...of**: iterate over iterables
- **Map/Set**: new data structures
- **Symbols**: unique identifiers
- **Modules**: import/export`,
    diagram: `<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <rect x="20" y="10" width="260" height="100" rx="8" fill="#161b22" stroke="#58a6ff"/>
      <text x="40" y="35" fill="#58a6ff" font-size="13" font-weight="bold">Spread (...) → Expands</text>
      <text x="40" y="60" fill="#e6edf3" font-size="11" font-family="monospace">[...arr1, ...arr2]</text>
      <text x="40" y="80" fill="#e6edf3" font-size="11" font-family="monospace">{...obj1, key: val}</text>
      <text x="40" y="100" fill="#7ee787" font-size="11">Copies + merges</text>
      <rect x="310" y="10" width="260" height="100" rx="8" fill="#161b22" stroke="#f0883e"/>
      <text x="330" y="35" fill="#f0883e" font-size="13" font-weight="bold">Rest (...) → Collects</text>
      <text x="330" y="60" fill="#e6edf3" font-size="11" font-family="monospace">const [a, ...rest] = arr</text>
      <text x="330" y="80" fill="#e6edf3" font-size="11" font-family="monospace">function fn(...args)</text>
      <text x="330" y="100" fill="#7ee787" font-size="11">Gathers remaining</text>
      <rect x="20" y="130" width="550" height="100" rx="8" fill="#161b22" stroke="#7ee787"/>
      <text x="40" y="155" fill="#7ee787" font-size="13" font-weight="bold">Destructuring</text>
      <text x="40" y="178" fill="#e6edf3" font-size="11" font-family="monospace">const { name, age = 0 } = obj    // Object</text>
      <text x="40" y="198" fill="#e6edf3" font-size="11" font-family="monospace">const [a, , c] = arr              // Array (skip 2nd)</text>
      <text x="40" y="218" fill="#e6edf3" font-size="11" font-family="monospace">const { x: renamed } = obj        // Rename</text>
    </svg>`,
    examples: [
      {
        title: "Destructuring Mastery",
        code: `// Object destructuring
const user = { name: "Kumar", age: 25, role: "Developer", city: "Bangalore" };
const { name, age, role: jobTitle, country = "India" } = user;
console.log(name, age, jobTitle, country);

// Nested destructuring
const response = {
  data: { users: [{ id: 1, name: "Alice" }], total: 100 },
  status: 200
};
const { data: { users: [firstUser], total }, status } = response;
console.log(firstUser, total, status);

// Array destructuring
const [a, , c, ...rest] = [1, 2, 3, 4, 5];
console.log(a, c, rest); // 1, 3, [4, 5]

// Swap variables
let x = 10, y = 20;
[x, y] = [y, x];
console.log("Swapped:", x, y); // 20, 10

// Function parameter destructuring
function createUser({ name, age = 18, role = "user" }) {
  console.log(name + " (" + age + ") - " + role);
}
createUser({ name: "Dev", age: 30 });
createUser({ name: "New" });`
      },
      {
        title: "Spread & Rest Operators",
        code: `// Spread: expanding arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];
console.log("Merged:", merged);

// Spread: shallow clone objects
const original = { a: 1, b: { c: 2 } };
const clone = { ...original, a: 99 }; // override a
console.log("Clone:", clone);
console.log("Original unchanged:", original.a);

// ⚠️ Shallow! Nested objects share reference
clone.b.c = 999;
console.log("Original.b.c also changed:", original.b.c); // 999!

// Rest: collecting arguments
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log("Sum:", sum(1, 2, 3, 4, 5));

// Rest in destructuring
const { a: first, ...remaining } = { a: 1, b: 2, c: 3 };
console.log("First:", first, "Rest:", remaining);`
      },
      {
        title: "Optional Chaining & Nullish Coalescing",
        code: `const user = {
  name: "Kumar",
  address: { city: "Bangalore" },
  // No phone property
};

// Without optional chaining — crashes!
try {
  console.log(user.phone.number);
} catch(e) {
  console.log("Error:", e.message);
}

// With optional chaining — safe!
console.log(user?.phone?.number);     // undefined
console.log(user?.address?.city);     // "Bangalore"
console.log(user?.getAge?.());        // undefined (method)
console.log(user?.hobbies?.[0]);      // undefined (array)

// Nullish Coalescing (??)
// Only falls back on null/undefined (NOT 0, "", false)
console.log(0 || "fallback");    // "fallback" (wrong!)
console.log(0 ?? "fallback");    // 0 (correct!)
console.log("" || "fallback");   // "fallback"
console.log("" ?? "fallback");   // ""
console.log(null ?? "fallback"); // "fallback"
console.log(undefined ?? "default"); // "default"`
      }
    ],
    quiz: [
      { question: "What's the difference between spread and rest?", options: ["They're the same", "Spread expands, Rest collects", "Spread is for arrays only", "Rest is for objects only"], answer: 1, explanation: "Spread (...) expands elements outward (merge/copy). Rest (...) collects multiple elements into one (gather)." },
      { question: "What does `const { a: b } = obj` do?", options: ["Creates property a and b", "Extracts a and renames it to b", "Sets a to b", "Deletes a"], answer: 1, explanation: "This destructures property `a` from obj and assigns it to a new variable named `b`." },
      { question: "What does `0 ?? 'fallback'` return?", options: ["'fallback'", "0", "null", "undefined"], answer: 1, explanation: "Nullish coalescing (??) only falls back for null/undefined. Since 0 is neither, it returns 0. (|| would return 'fallback' since 0 is falsy.)" }
    ]
  },
  {
    id: "array-methods",
    category: "JavaScript",
    title: "Array Methods (HOF)",
    priority: "High",
    icon: "📦",
    content: `## Higher-Order Functions & Array Methods

A **higher-order function** either takes a function as argument OR returns a function.

### The Big Three:
- **map(fn)** — transforms each element, returns new array (same length)
- **filter(fn)** — keeps elements where fn returns true, returns new array
- **reduce(fn, init)** — accumulates all elements into a single value

### Key Principle: These DON'T mutate the original array!

### Other Important Methods:
- **forEach** — like map but returns nothing (side effects only)
- **find** — returns first element matching condition
- **findIndex** — returns index of first match
- **some** — returns true if ANY element passes
- **every** — returns true if ALL elements pass
- **flat/flatMap** — flatten nested arrays
- **sort** — sorts in place (mutates!)

### Interview Focus:
- Implement map/filter/reduce from scratch
- Chain methods together for complex transformations
- Know when to use which method`,
    diagram: `<svg viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="30" y="25" fill="#e6edf3" font-size="11" font-family="monospace">[1, 2, 3, 4, 5]</text>
      <rect x="20" y="40" width="170" height="55" rx="8" fill="#1f6feb" opacity="0.15" stroke="#1f6feb"/>
      <text x="40" y="60" fill="#58a6ff" font-size="13" font-weight="bold">map(x => x*2)</text>
      <text x="40" y="82" fill="#e6edf3" font-size="11" font-family="monospace">[2, 4, 6, 8, 10]</text>
      <rect x="210" y="40" width="170" height="55" rx="8" fill="#238636" opacity="0.15" stroke="#238636"/>
      <text x="230" y="60" fill="#7ee787" font-size="13" font-weight="bold">filter(x => x>2)</text>
      <text x="230" y="82" fill="#e6edf3" font-size="11" font-family="monospace">[3, 4, 5]</text>
      <rect x="400" y="40" width="180" height="55" rx="8" fill="#f0883e" opacity="0.15" stroke="#f0883e"/>
      <text x="420" y="60" fill="#f0883e" font-size="13" font-weight="bold">reduce((a,x)=>a+x,0)</text>
      <text x="420" y="82" fill="#e6edf3" font-size="11" font-family="monospace">15</text>
      <rect x="20" y="120" width="560" height="50" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="145" fill="#d2a8ff" font-size="12" font-weight="bold">Chaining:</text>
      <text x="120" y="145" fill="#e6edf3" font-size="11" font-family="monospace">[1,2,3,4,5].filter(x=>x>2).map(x=>x*10).reduce((a,x)=>a+x, 0)</text>
      <text x="40" y="162" fill="#7ee787" font-size="11">→ 120</text>
      <rect x="20" y="185" width="560" height="45" rx="8" fill="#1c2333" stroke="#58a6ff"/>
      <text x="40" y="210" fill="#58a6ff" font-size="12">map → transform | filter → select | reduce → accumulate | find → first match</text>
      <text x="40" y="224" fill="#8b949e" font-size="11">None of these mutate the original array (except sort!)</text>
    </svg>`,
    examples: [
      {
        title: "map, filter, reduce in Action",
        code: `const products = [
  { name: "Laptop", price: 999, inStock: true },
  { name: "Phone", price: 699, inStock: false },
  { name: "Tablet", price: 499, inStock: true },
  { name: "Watch", price: 299, inStock: true },
  { name: "Earbuds", price: 149, inStock: false },
];

// filter: only in-stock items
const available = products.filter(p => p.inStock);
console.log("In stock:", available.map(p => p.name));

// map: get discounted prices
const discounted = products.map(p => ({
  ...p,
  salePrice: Math.round(p.price * 0.8) // 20% off
}));
console.log("On sale:", discounted.map(p => p.name + ": $" + p.salePrice));

// reduce: total of in-stock items
const total = products
  .filter(p => p.inStock)
  .reduce((sum, p) => sum + p.price, 0);
console.log("Total in-stock value: $" + total);

// Chaining: average price of in-stock items
const avg = products
  .filter(p => p.inStock)
  .map(p => p.price)
  .reduce((sum, price, _, arr) => sum + price / arr.length, 0);
console.log("Average in-stock price: $" + Math.round(avg));`
      },
      {
        title: "Implement reduce from Scratch",
        code: `// Custom reduce implementation
Array.prototype.myReduce = function(callback, initialValue) {
  let accumulator;
  let startIndex;
  
  if (initialValue !== undefined) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    if (this.length === 0) throw new TypeError("Reduce of empty array with no initial value");
    accumulator = this[0];
    startIndex = 1;
  }
  
  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }
  
  return accumulator;
};

// Test it!
console.log([1,2,3,4].myReduce((acc, val) => acc + val, 0)); // 10
console.log([1,2,3,4].myReduce((acc, val) => acc * val, 1)); // 24

// Build objects with reduce
const votes = ["yes", "no", "yes", "yes", "no", "yes"];
const tally = votes.myReduce((acc, vote) => {
  acc[vote] = (acc[vote] || 0) + 1;
  return acc;
}, {});
console.log("Tally:", tally); // { yes: 4, no: 2 }`
      },
      {
        title: "find, some, every, flat",
        code: `const users = [
  { name: "Alice", age: 25, active: true },
  { name: "Bob", age: 17, active: true },
  { name: "Charlie", age: 30, active: false },
];

// find — first match
const found = users.find(u => u.age > 20);
console.log("Found:", found.name); // Alice

// findIndex — index of first match
const idx = users.findIndex(u => !u.active);
console.log("Inactive at index:", idx); // 2

// some — at least one passes?
const hasMinor = users.some(u => u.age < 18);
console.log("Has minor:", hasMinor); // true

// every — all pass?
const allActive = users.every(u => u.active);
console.log("All active:", allActive); // false

// flat — flatten nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];
console.log("flat(1):", nested.flat(1));     // [1,2,3,4,[5,6]]
console.log("flat(Infinity):", nested.flat(Infinity)); // [1,2,3,4,5,6]

// flatMap — map + flat(1)
const sentences = ["hello world", "foo bar"];
const words = sentences.flatMap(s => s.split(" "));
console.log("Words:", words); // ["hello","world","foo","bar"]`
      }
    ],
    quiz: [
      { question: "What does `map` return?", options: ["The original array modified", "A new array of same length", "A single value", "undefined"], answer: 1, explanation: "map() always returns a NEW array of the same length, with each element transformed by the callback." },
      { question: "What does `reduce` do?", options: ["Removes elements", "Reduces array length by 1", "Accumulates all elements into a single value", "Makes array smaller"], answer: 2, explanation: "reduce() iterates through the array, accumulating elements into a single value using the callback function." },
      { question: "Which array method mutates the original array?", options: ["map", "filter", "sort", "reduce"], answer: 2, explanation: "sort() mutates the original array in place. map, filter, and reduce all return new arrays/values." }
    ]
  },
  {
    id: "debounce-throttle",
    category: "JavaScript",
    title: "Debounce & Throttle",
    priority: "High",
    icon: "⏱️",
    content: `## Debounce & Throttle — Rate Limiting

Both limit how often a function executes, but differently.

### Debounce:
Waits until the user **stops** doing something for N ms, then executes ONCE.
- Like an elevator: waits until people stop entering, then closes doors
- Use case: search input, resize handler, form validation, auto-save

### Throttle:
Executes at most once every N ms, regardless of how many times triggered.
- Like a metronome: fires at regular intervals
- Use case: scroll handler, game loop, rate limiting API calls, drag events

### Key Difference:
- **Debounce**: "Wait until they're done" (groups bursts into one call)
- **Throttle**: "At most once per interval" (regular spacing)

### Interview Speaking Points (3 min):
1. Define both with elevator/metronome analogy
2. Implement debounce (clearTimeout pattern)
3. Implement throttle (timestamp/flag pattern)
4. Give real-world use cases for each
5. Mention leading vs trailing edge options`,
    diagram: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="20" y="20" fill="#8b949e" font-size="12">Events: |||||||  (rapid clicks/keystrokes)</text>
      <rect x="20" y="35" width="260" height="70" rx="8" fill="#1f6feb" opacity="0.1" stroke="#1f6feb"/>
      <text x="40" y="58" fill="#58a6ff" font-size="14" font-weight="bold">Debounce (300ms)</text>
      <text x="40" y="78" fill="#e6edf3" font-size="11" font-family="monospace">|||||||........✓</text>
      <text x="40" y="95" fill="#8b949e" font-size="11">Fires ONCE after user stops</text>
      <rect x="310" y="35" width="260" height="70" rx="8" fill="#238636" opacity="0.1" stroke="#238636"/>
      <text x="330" y="58" fill="#7ee787" font-size="14" font-weight="bold">Throttle (300ms)</text>
      <text x="330" y="78" fill="#e6edf3" font-size="11" font-family="monospace">✓..||✓..||✓..|✓</text>
      <text x="330" y="95" fill="#8b949e" font-size="11">Fires at regular intervals</text>
      <rect x="20" y="120" width="260" height="60" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="142" fill="#58a6ff" font-size="12">Search input</text>
      <text x="40" y="158" fill="#58a6ff" font-size="12">Auto-save, resize</text>
      <text x="40" y="172" fill="#8b949e" font-size="10">Wait for final value</text>
      <rect x="310" y="120" width="260" height="60" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="330" y="142" fill="#7ee787" font-size="12">Scroll handler</text>
      <text x="330" y="158" fill="#7ee787" font-size="12">Game loop, drag</text>
      <text x="330" y="172" fill="#8b949e" font-size="10">Consistent updates</text>
    </svg>`,
    examples: [
      {
        title: "Implement Debounce",
        code: `function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId); // cancel previous timer
    timeoutId = setTimeout(() => {
      fn.apply(this, args); // execute after delay
    }, delay);
  };
}

// Simulate rapid typing
const search = debounce((query) => {
  console.log("🔍 API call for:", query);
}, 300);

// Simulating keystrokes
search("h");     // cancelled
search("he");    // cancelled
search("hel");   // cancelled
search("hello"); // ← only this one fires (after 300ms)

setTimeout(() => {
  console.log("--- After 500ms, only 'hello' was searched ---");
}, 500);`
      },
      {
        title: "Implement Throttle",
        code: `function throttle(fn, interval) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// Simulate scroll events
const onScroll = throttle((pos) => {
  console.log("📜 Scroll handler at position:", pos);
}, 200);

// Simulating rapid scroll events
for (let i = 0; i < 10; i++) {
  setTimeout(() => onScroll(i * 50), i * 50);
  // Events at 0, 50, 100, 150, 200, 250, 300, 350, 400, 450ms
  // Throttle fires at: 0, 200, 400 (every 200ms max)
}`
      },
      {
        title: "Debounce with Leading Edge",
        code: `function debounce(fn, delay, leading = false) {
  let timeoutId;
  let isLeadingInvoked = false;
  
  return function(...args) {
    // Leading edge: fire on first call
    if (leading && !isLeadingInvoked) {
      fn.apply(this, args);
      isLeadingInvoked = true;
    }
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (!leading) {
        fn.apply(this, args); // trailing edge
      }
      isLeadingInvoked = false; // reset for next burst
    }, delay);
  };
}

// Leading: fires immediately on first trigger
const leadingSearch = debounce(
  (q) => console.log("Leading:", q), 300, true
);

// Trailing (default): fires after pause
const trailingSearch = debounce(
  (q) => console.log("Trailing:", q), 300, false
);

leadingSearch("a");  // fires immediately!
leadingSearch("ab"); // ignored
leadingSearch("abc"); // ignored (waits for pause)

trailingSearch("x");  // waits...
trailingSearch("xy"); // waits...
trailingSearch("xyz"); // only this fires after 300ms`
      }
    ],
    quiz: [
      { question: "When does a debounced function execute?", options: ["Immediately", "After user stops triggering for N ms", "Every N ms", "On every trigger"], answer: 1, explanation: "Debounce waits until the user stops triggering the function for the specified delay, then executes once." },
      { question: "Which is better for a search input?", options: ["Throttle", "Debounce", "Neither", "Both"], answer: 1, explanation: "Debounce is ideal for search inputs because you want to wait until the user finishes typing before making an API call." },
      { question: "Which is better for scroll position tracking?", options: ["Debounce", "Throttle", "Neither", "setInterval"], answer: 1, explanation: "Throttle is better for scroll handlers because you want consistent updates at regular intervals, not just one call after scrolling stops." }
    ]
  },
  {
    id: "mutable-immutable",
    category: "JavaScript",
    title: "Mutable vs Immutable Objects",
    priority: "High",
    icon: "🧬",
    content: `## Mutability vs Immutability

### Primitives are Immutable:
\`string\`, \`number\`, \`boolean\`, \`null\`, \`undefined\`, \`symbol\`, \`bigint\`
When you "change" a primitive, you create a new value. The old one is untouched.

### Objects/Arrays are Mutable:
\`{}\`, \`[]\` can be changed in place. Multiple references point to the SAME object.

### Why Immutability Matters:
1. **Predictability** — no surprise side effects from shared references
2. **React optimization** — React uses reference equality (===) to detect changes
3. **Pure functions** — don't modify inputs
4. **Time-travel debugging** — Redux DevTools
5. **Concurrency safety** — no race conditions on shared data

### How to Achieve Immutability:
- **Spread**: \`{...obj, key: val}\`, \`[...arr, newItem]\`
- **Object.assign**: \`Object.assign({}, obj, changes)\`
- **Array methods**: map, filter, concat (NOT push, splice, sort)
- **Object.freeze()** — shallow freeze (nested objects still mutable!)
- **structuredClone()** — deep clone (modern)
- **JSON.parse(JSON.stringify())** — deep clone (loses functions, dates)
- **Libraries**: Immer (produce), Immutable.js

### Shallow vs Deep Copy:
- **Shallow**: copies top-level only, nested objects share reference
- **Deep**: copies everything recursively, fully independent

### Interview Speaking Points (3 min):
1. Define mutable vs immutable with examples
2. Explain reference vs value types
3. Show the shallow copy trap with nested objects
4. Explain why React needs immutability (state comparison)
5. List methods: spread, Object.freeze, structuredClone`,
    diagram: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <rect x="20" y="10" width="260" height="100" rx="8" fill="#238636" opacity="0.1" stroke="#238636"/>
      <text x="40" y="35" fill="#7ee787" font-size="14" font-weight="bold">Immutable (Primitives)</text>
      <text x="40" y="58" fill="#e6edf3" font-size="12" font-family="monospace">let a = "hello"</text>
      <text x="40" y="78" fill="#e6edf3" font-size="12" font-family="monospace">let b = a  // copy of VALUE</text>
      <text x="40" y="98" fill="#7ee787" font-size="11">b = "world" → a unchanged ✓</text>
      <rect x="310" y="10" width="270" height="100" rx="8" fill="#da3633" opacity="0.1" stroke="#da3633"/>
      <text x="330" y="35" fill="#f85149" font-size="14" font-weight="bold">Mutable (Objects/Arrays)</text>
      <text x="330" y="58" fill="#e6edf3" font-size="12" font-family="monospace">let a = { x: 1 }</text>
      <text x="330" y="78" fill="#e6edf3" font-size="12" font-family="monospace">let b = a  // copy of REFERENCE</text>
      <text x="330" y="98" fill="#f85149" font-size="11">b.x = 2 → a.x also 2! ⚠️</text>
      <rect x="20" y="125" width="560" height="55" rx="8" fill="#161b22" stroke="#58a6ff"/>
      <text x="40" y="148" fill="#58a6ff" font-size="13" font-weight="bold">Immutable Updates (create new, don't mutate)</text>
      <text x="40" y="170" fill="#e6edf3" font-size="11" font-family="monospace">const updated = { ...obj, key: newVal }  // spread = shallow copy + override</text>
      <rect x="20" y="195" width="270" height="55" rx="8" fill="#161b22" stroke="#f0883e"/>
      <text x="40" y="218" fill="#f0883e" font-size="12" font-weight="bold">Shallow Copy ⚠️</text>
      <text x="40" y="238" fill="#8b949e" font-size="11">Nested objects still shared</text>
      <rect x="310" y="195" width="270" height="55" rx="8" fill="#161b22" stroke="#7ee787"/>
      <text x="330" y="218" fill="#7ee787" font-size="12" font-weight="bold">Deep Copy ✓</text>
      <text x="330" y="238" fill="#8b949e" font-size="11">structuredClone() or JSON trick</text>
    </svg>`,
    examples: [
      {
        title: "Reference vs Value — The Core Problem",
        code: `// PRIMITIVES — copied by VALUE
let a = 10;
let b = a;
b = 20;
console.log("Primitive a:", a); // 10 (unchanged!)
console.log("Primitive b:", b); // 20

// OBJECTS — copied by REFERENCE
let obj1 = { name: "Kumar", skills: ["JS", "React"] };
let obj2 = obj1; // NOT a copy! Same object!
obj2.name = "Changed";
console.log("obj1.name:", obj1.name); // "Changed" ⚠️ MUTATED!

// Proof they're the same object
console.log("Same object?", obj1 === obj2); // true

// ARRAYS — same problem
let arr1 = [1, 2, 3];
let arr2 = arr1;
arr2.push(4);
console.log("arr1:", arr1); // [1, 2, 3, 4] ⚠️ MUTATED!`
      },
      {
        title: "Shallow vs Deep Copy",
        code: `const original = {
  name: "Kumar",
  scores: [90, 85, 95],
  address: { city: "Bangalore", pin: 560001 }
};

// SHALLOW copy (spread)
const shallow = { ...original };
shallow.name = "Changed";
console.log("original.name:", original.name); // ✅ "Kumar" (primitive copied)

shallow.scores.push(100);
console.log("original.scores:", original.scores); // ⚠️ [90,85,95,100] MUTATED!

shallow.address.city = "Mumbai";
console.log("original.address.city:", original.address.city); // ⚠️ "Mumbai" MUTATED!

// DEEP copy — structuredClone
const deep = structuredClone(original);
deep.scores.push(200);
deep.address.city = "Delhi";
console.log("After deep copy mutations:");
console.log("original.scores:", original.scores); // ✅ Not affected
console.log("original.address.city:", original.address.city); // ✅ Not affected`
      },
      {
        title: "Immutable Array & Object Patterns",
        code: `// ❌ MUTABLE operations
const arr = [1, 2, 3];
// arr.push(4)     — mutates
// arr.splice(1,1) — mutates
// arr.sort()      — mutates

// ✅ IMMUTABLE equivalents
const added = [...arr, 4];              // [1,2,3,4]
const removed = arr.filter((_, i) => i !== 1); // [1,3]
const sorted = [...arr].sort();         // copy first!
const updated = arr.map((v, i) => i === 0 ? 99 : v); // [99,2,3]

console.log("Original:", arr);      // [1,2,3] — untouched!
console.log("Added:", added);
console.log("Removed:", removed);
console.log("Sorted:", sorted);
console.log("Updated:", updated);

// ✅ IMMUTABLE object update
const user = { name: "Kumar", age: 25, role: "Dev" };
const updatedUser = { ...user, age: 26 }; // override age
const withoutRole = (({ role, ...rest }) => rest)(user); // remove key

console.log("Original user:", user);
console.log("Updated:", updatedUser);
console.log("Without role:", withoutRole);`
      },
      {
        title: "Object.freeze — Shallow!",
        code: `const config = Object.freeze({
  apiUrl: "https://api.example.com",
  timeout: 5000,
  nested: { retries: 3 }
});

// Top level is frozen
config.apiUrl = "changed";
console.log("apiUrl:", config.apiUrl); // unchanged!

// But nested objects are NOT frozen!
config.nested.retries = 99;
console.log("nested.retries:", config.nested.retries); // 99 ⚠️

// Deep freeze utility
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach(val => {
    if (typeof val === "object" && val !== null) {
      deepFreeze(val);
    }
  });
  return obj;
}

const frozen = deepFreeze({ a: 1, b: { c: 2 } });
frozen.b.c = 999;
console.log("Deep frozen b.c:", frozen.b.c); // 2 ✓`
      }
    ],
    quiz: [
      { question: "What happens when you assign an object to another variable?", options: ["A deep copy is created", "A shallow copy is created", "Only the reference is copied", "Nothing happens"], answer: 2, explanation: "Objects are reference types. Assigning copies the reference (memory address), not the object itself. Both variables point to the same object." },
      { question: "Does Object.freeze work on nested objects?", options: ["Yes, fully", "No, only top level (shallow)", "Only on arrays", "Only in strict mode"], answer: 1, explanation: "Object.freeze is shallow — it only freezes the top-level properties. Nested objects can still be mutated." },
      { question: "Why does React need immutability?", options: ["It's faster", "React uses === to detect state changes", "JavaScript requires it", "It uses less memory"], answer: 1, explanation: "React compares old vs new state/props using reference equality (===). If you mutate an object, the reference stays the same, so React doesn't detect the change and won't re-render." }
    ]
  },

  // ══════════════════════ REACT ══════════════════════
  {
    id: "react-hooks",
    category: "React",
    title: "Hooks Deep Dive",
    priority: "High",
    icon: "🪝",
    content: `## React Hooks

### useState:
- State updates are **asynchronous** (batched for performance)
- Use functional updates when new state depends on old: \`setState(prev => prev + 1)\`
- State is **immutable** — always create new objects/arrays

### useEffect:
- Runs after render (not blocking paint)
- Dependency array controls when it runs:
  - No array: runs after EVERY render
  - Empty []: runs ONCE on mount
  - [deps]: runs when deps change
- Cleanup function runs before next effect and on unmount
- Why it runs twice: React StrictMode (dev only) to catch bugs

### useRef:
- Persists value across renders WITHOUT causing re-render
- Two uses: DOM references and mutable containers
- \`.current\` property is mutable

### useMemo vs useCallback:
- **useMemo**: memoizes a **value** (result of computation)
- **useCallback**: memoizes a **function reference**
- useCallback(fn, deps) === useMemo(() => fn, deps)
- Only use when preventing expensive recalculations or unnecessary re-renders

### Custom Hooks:
- Functions starting with \`use\` that compose built-in hooks
- Share stateful logic between components
- Each component gets its OWN state instance

### Rules of Hooks:
1. Only call at the top level (no loops, conditions, nested functions)
2. Only call from React functions (components or other hooks)`,
    diagram: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="200" y="25" fill="#e6edf3" font-size="16" font-weight="bold">React Hooks Overview</text>
      <rect x="20" y="40" width="170" height="70" rx="8" fill="#1f6feb" opacity="0.15" stroke="#1f6feb"/>
      <text x="40" y="63" fill="#58a6ff" font-size="13" font-weight="bold">useState</text>
      <text x="40" y="82" fill="#e6edf3" font-size="10">State management</text>
      <text x="40" y="100" fill="#8b949e" font-size="10">Triggers re-render</text>
      <rect x="210" y="40" width="170" height="70" rx="8" fill="#238636" opacity="0.15" stroke="#238636"/>
      <text x="230" y="63" fill="#7ee787" font-size="13" font-weight="bold">useEffect</text>
      <text x="230" y="82" fill="#e6edf3" font-size="10">Side effects</text>
      <text x="230" y="100" fill="#8b949e" font-size="10">API calls, subscriptions</text>
      <rect x="400" y="40" width="170" height="70" rx="8" fill="#f0883e" opacity="0.15" stroke="#f0883e"/>
      <text x="420" y="63" fill="#f0883e" font-size="13" font-weight="bold">useRef</text>
      <text x="420" y="82" fill="#e6edf3" font-size="10">Mutable container</text>
      <text x="420" y="100" fill="#8b949e" font-size="10">No re-render on change</text>
      <rect x="20" y="125" width="270" height="65" rx="8" fill="#d2a8ff" opacity="0.1" stroke="#d2a8ff"/>
      <text x="40" y="148" fill="#d2a8ff" font-size="13" font-weight="bold">useMemo → cached VALUE</text>
      <text x="40" y="170" fill="#e6edf3" font-size="10" font-family="monospace">useMemo(() => compute(a,b), [a,b])</text>
      <text x="40" y="183" fill="#8b949e" font-size="9">Skip expensive recalculations</text>
      <rect x="310" y="125" width="260" height="65" rx="8" fill="#da3633" opacity="0.1" stroke="#da3633"/>
      <text x="330" y="148" fill="#f85149" font-size="13" font-weight="bold">useCallback → cached FUNCTION</text>
      <text x="330" y="170" fill="#e6edf3" font-size="10" font-family="monospace">useCallback(fn, [deps])</text>
      <text x="330" y="183" fill="#8b949e" font-size="9">Prevent child re-renders</text>
      <rect x="20" y="210" width="550" height="60" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="235" fill="#58a6ff" font-size="13" font-weight="bold">useEffect Dependency Array:</text>
      <text x="40" y="255" fill="#e6edf3" font-size="11" font-family="monospace">none → every render | [] → once | [a,b] → when a or b changes</text>
    </svg>`,
    examples: [
      {
        title: "useState — Async Batching & Functional Updates",
        code: `// Simulating React's useState behavior
function simulateState(initial) {
  let state = initial;
  const setState = (updater) => {
    if (typeof updater === 'function') {
      state = updater(state);  // functional update
    } else {
      state = updater;  // direct value
    }
    console.log("State is now:", state);
  };
  return [() => state, setState];
}

const [getCount, setCount] = simulateState(0);

// ❌ Problem: multiple setState with same stale value
setCount(getCount() + 1);  // 0 + 1 = 1
setCount(getCount() + 1);  // still uses stale 0... but our sim updates sync
// In React, both would use stale 0 due to batching!

console.log("\\n--- Functional updates (always correct) ---");
const [getScore, setScore] = simulateState(0);
setScore(prev => prev + 1);  // 0 → 1
setScore(prev => prev + 1);  // 1 → 2
setScore(prev => prev + 1);  // 2 → 3
console.log("Final:", getScore()); // 3 ✓

// ❌ Never mutate state directly
const [getUser, setUser] = simulateState({ name: "Kumar", age: 25 });
// user.age = 26  ← WRONG! Mutation!
setUser(prev => ({ ...prev, age: 26 })); // ✓ Create new object`
      },
      {
        title: "useEffect — Dependency Array Patterns",
        code: `// Simulating useEffect behavior
console.log("=== useEffect with NO dependency array ===");
console.log("Runs after EVERY render");
console.log("useEffect(() => { ... })  // no second arg");
console.log("");

console.log("=== useEffect with EMPTY array [] ===");
console.log("Runs ONCE on mount, cleanup on unmount");
console.log("useEffect(() => {");
console.log("  const sub = subscribe();");
console.log("  return () => sub.unsubscribe(); // cleanup");
console.log("}, [])");
console.log("");

console.log("=== useEffect with DEPS [a, b] ===");
console.log("Runs when a or b changes");
console.log("useEffect(() => {");
console.log("  fetchData(userId); // re-fetch when userId changes");
console.log("}, [userId])");
console.log("");

console.log("=== Why useEffect runs TWICE in dev? ===");
console.log("StrictMode mounts → unmounts → remounts");
console.log("Purpose: expose missing cleanup functions");
console.log("Example: if you subscribe but don't unsubscribe,");
console.log("you'd see DOUBLE subscriptions in dev mode.");
console.log("This ONLY happens in development, not production.");`
      },
      {
        title: "useRef — DOM & Mutable Values",
        code: `// useRef has TWO purposes:

// 1. DOM Reference
console.log("=== DOM Reference ===");
console.log("const inputRef = useRef(null);");
console.log("<input ref={inputRef} />");
console.log("inputRef.current.focus(); // direct DOM access");
console.log("");

// 2. Mutable container (persists without re-render)
console.log("=== Mutable Container ===");

// Simulating useRef
function createRef(initial) {
  return { current: initial };
}

const renderCount = createRef(0);
const prevValue = createRef(null);

// Simulate multiple renders
for (let render = 1; render <= 3; render++) {
  renderCount.current += 1; // doesn't trigger re-render!
  const currentValue = "value_" + render;
  
  console.log("Render #" + render);
  console.log("  Previous value:", prevValue.current);
  console.log("  Current value:", currentValue);
  console.log("  Total renders:", renderCount.current);
  
  prevValue.current = currentValue; // update for next render
}

console.log("");
console.log("Key: ref.current changes do NOT trigger re-renders!");
console.log("useState changes DO trigger re-renders.");`
      },
      {
        title: "Custom Hook — useFetch",
        code: `// Custom hooks extract reusable stateful logic
// Each component using the hook gets ITS OWN state

function useFetch(url) {
  // In real React, these would be useState/useEffect
  let data = null, loading = true, error = null;
  
  console.log("useFetch called with:", url);
  
  // Simulating async fetch
  try {
    // In real code: useEffect + fetch
    data = { users: ["Alice", "Bob"] }; // simulated response
    loading = false;
    console.log("  Data loaded:", JSON.stringify(data));
  } catch (e) {
    error = e.message;
    loading = false;
  }
  
  return { data, loading, error };
}

// Usage in components
console.log("=== Component A ===");
const users = useFetch("/api/users");
console.log("  Result:", JSON.stringify(users));

console.log("\\n=== Component B (own state!) ===");
const posts = useFetch("/api/posts");
console.log("  Result:", JSON.stringify(posts));

console.log("\\n--- Real implementation pattern ---");
console.log(\`
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
    return () => controller.abort(); // cleanup!
  }, [url]);
  
  return { data, loading, error };
}\`);`
      }
    ],
    quiz: [
      { question: "Why are React state updates asynchronous?", options: ["Bug in React", "For batching multiple updates into one re-render", "Because of Promises", "They're actually sync"], answer: 1, explanation: "React batches state updates for performance. Multiple setState calls in the same event handler result in a single re-render." },
      { question: "What does useEffect(() => {}, []) do?", options: ["Runs every render", "Runs once on mount", "Never runs", "Runs on unmount only"], answer: 1, explanation: "Empty dependency array means the effect runs once after the initial render (mount). The cleanup function runs on unmount." },
      { question: "What's the difference between useMemo and useCallback?", options: ["useMemo is faster", "useMemo caches a value, useCallback caches a function", "They're identical", "useCallback is deprecated"], answer: 1, explanation: "useMemo returns a memoized value (result of computation). useCallback returns a memoized function reference. useCallback(fn, deps) === useMemo(() => fn, deps)." },
      { question: "Does changing useRef.current trigger a re-render?", options: ["Yes", "No", "Only in StrictMode", "Only with DOM refs"], answer: 1, explanation: "No! That's the key difference from useState. useRef provides a mutable container whose changes don't trigger re-renders." }
    ]
  },
  {
    id: "virtual-dom",
    category: "React",
    title: "Virtual DOM & Reconciliation",
    priority: "High",
    icon: "🌳",
    content: `## Virtual DOM & Reconciliation

### What is the Virtual DOM?
A lightweight JavaScript representation of the real DOM. React uses it to batch and minimize expensive DOM operations.

### How React Updates UI:
1. State/props change → component re-renders
2. React creates a NEW Virtual DOM tree
3. React **diffs** the old and new Virtual DOM (reconciliation)
4. React computes the MINIMUM changes needed
5. React applies ONLY those changes to the real DOM (commit phase)

### Reconciliation Algorithm (Diffing):
- **Different element types**: tear down old tree, build new
- **Same element type**: update attributes, recurse on children
- **Lists**: use \`key\` prop to identify which items changed
- O(n) complexity (instead of O(n³) for generic tree diff)

### Why Keys Matter:
- Without keys: React re-renders entire list on change
- With keys: React knows which items moved, added, removed
- Use stable, unique IDs (NOT array index for dynamic lists!)

### Render vs Commit Phase:
- **Render**: pure computation, build virtual DOM (can be paused)
- **Commit**: actual DOM updates (must be synchronous)

### What Triggers Re-render:
1. setState called
2. Parent re-renders (unless memoized)
3. Context value changes
4. forceUpdate (class components)

### Interview Speaking Points:
1. Explain the real DOM is slow, Virtual DOM is a JS optimization
2. Walk through the 5-step update process
3. Explain why keys are important for lists
4. Mention React Fiber (concurrent rendering engine)`,
    diagram: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="180" y="25" fill="#e6edf3" font-size="15" font-weight="bold">React Update Cycle</text>
      <rect x="20" y="40" width="120" height="50" rx="8" fill="#da3633" opacity="0.2" stroke="#da3633"/>
      <text x="35" y="62" fill="#f85149" font-size="11" font-weight="bold">setState()</text>
      <text x="35" y="78" fill="#8b949e" font-size="10">trigger</text>
      <path d="M140 65 L170 65" stroke="#8b949e" stroke-width="1.5"/>
      <text x="150" y="58" fill="#8b949e" font-size="14">→</text>
      <rect x="170" y="40" width="130" height="50" rx="8" fill="#1f6feb" opacity="0.2" stroke="#1f6feb"/>
      <text x="185" y="62" fill="#58a6ff" font-size="11" font-weight="bold">New VDOM</text>
      <text x="185" y="78" fill="#8b949e" font-size="10">render phase</text>
      <path d="M300 65 L330 65" stroke="#8b949e" stroke-width="1.5"/>
      <text x="308" y="58" fill="#8b949e" font-size="14">→</text>
      <rect x="330" y="40" width="110" height="50" rx="8" fill="#f0883e" opacity="0.2" stroke="#f0883e"/>
      <text x="345" y="62" fill="#f0883e" font-size="11" font-weight="bold">Diff/Reconcile</text>
      <text x="345" y="78" fill="#8b949e" font-size="10">find changes</text>
      <path d="M440 65 L470 65" stroke="#8b949e" stroke-width="1.5"/>
      <text x="448" y="58" fill="#8b949e" font-size="14">→</text>
      <rect x="470" y="40" width="110" height="50" rx="8" fill="#238636" opacity="0.2" stroke="#238636"/>
      <text x="485" y="62" fill="#7ee787" font-size="11" font-weight="bold">Patch DOM</text>
      <text x="485" y="78" fill="#8b949e" font-size="10">commit phase</text>
      <rect x="20" y="110" width="270" height="80" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="135" fill="#58a6ff" font-size="12" font-weight="bold">Old VDOM</text>
      <text x="40" y="155" fill="#e6edf3" font-size="11" font-family="monospace">&lt;div&gt;&lt;h1&gt;Hello&lt;/h1&gt;&lt;/div&gt;</text>
      <text x="40" y="175" fill="#8b949e" font-size="11" font-family="monospace">&lt;p&gt;Count: 0&lt;/p&gt;</text>
      <rect x="310" y="110" width="270" height="80" rx="8" fill="#161b22" stroke="#238636"/>
      <text x="330" y="135" fill="#7ee787" font-size="12" font-weight="bold">New VDOM</text>
      <text x="330" y="155" fill="#e6edf3" font-size="11" font-family="monospace">&lt;div&gt;&lt;h1&gt;Hello&lt;/h1&gt;&lt;/div&gt;</text>
      <text x="330" y="175" fill="#7ee787" font-size="11" font-family="monospace">&lt;p&gt;Count: 1&lt;/p&gt;</text>
      <text x="450" y="175" fill="#f0883e" font-size="11">← changed!</text>
      <rect x="20" y="210" width="560" height="55" rx="8" fill="#1c2333" stroke="#f0883e"/>
      <text x="40" y="235" fill="#f0883e" font-size="13" font-weight="bold">Result: Only update &lt;p&gt; text node</text>
      <text x="40" y="255" fill="#8b949e" font-size="11">React applies MINIMUM changes to real DOM — that's why it's fast</text>
    </svg>`,
    examples: [
      {
        title: "Why Keys Matter (Simulation)",
        code: `// WITHOUT keys: React compares by index
console.log("=== Without keys (using index) ===");
const listBefore = ["Alice", "Bob", "Charlie"];
const listAfter =  ["Dave", "Alice", "Bob", "Charlie"]; // added Dave at start

console.log("Before:", listBefore.join(", "));
console.log("After:", listAfter.join(", "));
console.log("React thinks (by index):");
console.log("  [0] Alice → Dave (CHANGED - re-render)");
console.log("  [1] Bob → Alice (CHANGED - re-render)");
console.log("  [2] Charlie → Bob (CHANGED - re-render)");
console.log("  [3] new → Charlie (ADDED)");
console.log("  Result: 4 DOM operations! ❌");

console.log("\\n=== With keys (using unique ID) ===");
console.log("React tracks by key:");
console.log("  key=dave: new → INSERT at position 0");
console.log("  key=alice: same → no change");
console.log("  key=bob: same → no change");
console.log("  key=charlie: same → no change");
console.log("  Result: 1 DOM operation! ✅");

console.log("\\n⚠️ Never use index as key for dynamic lists!");
console.log("Index-key breaks when items are added/removed/reordered");`
      },
      {
        title: "React.memo — Preventing Re-renders",
        code: `// React.memo wraps a component to skip re-render
// if props haven't changed (shallow comparison)

console.log("=== Without React.memo ===");
console.log("Parent re-renders → ALL children re-render");
console.log("");

console.log("=== With React.memo ===");
console.log(\`
const ExpensiveList = React.memo(function({ items }) {
  console.log("ExpensiveList rendered");
  return items.map(item => <div key={item.id}>{item.name}</div>);
});

// Parent
function Parent() {
  const [count, setCount] = useState(0);
  const items = useMemo(() => fetchItems(), []); // stable reference
  
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <ExpensiveList items={items} />
      {/* ↑ Won't re-render when count changes! */}
    </div>
  );
}
\`);

console.log("Key insight: React.memo does SHALLOW comparison");
console.log("If you pass a new object/array reference each render,");
console.log("memo won't help! Use useMemo/useCallback for props.");`
      }
    ],
    quiz: [
      { question: "What is the Virtual DOM?", options: ["A copy of the browser's DOM", "A lightweight JS representation of the DOM", "A different browser API", "A database"], answer: 1, explanation: "The Virtual DOM is a plain JavaScript object tree that mirrors the structure of the real DOM. React uses it to efficiently batch and minimize DOM updates." },
      { question: "Why should you NOT use array index as key?", options: ["It's slower", "It breaks when items are reordered/added/removed", "React doesn't support it", "It uses more memory"], answer: 1, explanation: "Using index as key causes React to mismatch items when the list changes (add/remove/reorder), leading to incorrect updates and state bugs." },
      { question: "What triggers a React re-render?", options: ["Only setState", "setState, parent re-render, context change", "Any variable change", "Only props change"], answer: 1, explanation: "Re-renders are triggered by: setState, parent component re-rendering, context value changing, or forceUpdate." }
    ]
  },
  {
    id: "context-state",
    category: "React",
    title: "Context API & State Management",
    priority: "High",
    icon: "🌐",
    content: `## Context API & State Management

### Context API:
Provides a way to pass data through the component tree without passing props manually at every level ("prop drilling").

### When to Use Context:
- Theme (dark/light mode)
- Current user / auth state
- Locale / language
- UI state (sidebar open/closed)

### When NOT to Use Context:
- Frequently changing data (every keystroke) — causes ALL consumers to re-render
- Complex state logic — use Redux/Zustand
- Server state — use React Query/SWR

### Context Performance Pitfall:
When context value changes, ALL components consuming that context re-render. Split contexts by update frequency.

### State Management Spectrum:
1. **useState** — component-local state
2. **useReducer** — complex local state
3. **Context** — shared state (low frequency)
4. **Redux/Zustand** — global state (high frequency, complex)
5. **React Query/SWR** — server state

### Interview Speaking Points:
1. Explain prop drilling problem
2. Show createContext → Provider → useContext
3. Discuss when context vs Redux
4. Explain the re-render pitfall and splitting strategy`,
    diagram: `<svg viewBox="0 0 600 250" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="150" y="25" fill="#e6edf3" font-size="14" font-weight="bold">Prop Drilling vs Context</text>
      <rect x="20" y="40" width="250" height="200" rx="10" fill="#161b22" stroke="#da3633"/>
      <text x="70" y="62" fill="#f85149" font-size="12" font-weight="bold">❌ Prop Drilling</text>
      <rect x="80" y="75" width="120" height="25" rx="4" fill="#1c2333" stroke="#30363d"/>
      <text x="90" y="93" fill="#e6edf3" font-size="10" font-family="monospace">App (theme)</text>
      <path d="M140 100 L140 110" stroke="#f85149" stroke-width="1.5"/>
      <rect x="70" y="110" width="140" height="25" rx="4" fill="#1c2333" stroke="#30363d"/>
      <text x="80" y="128" fill="#8b949e" font-size="10" font-family="monospace">Layout (theme) ↓</text>
      <path d="M140 135 L140 145" stroke="#f85149" stroke-width="1.5"/>
      <rect x="60" y="145" width="160" height="25" rx="4" fill="#1c2333" stroke="#30363d"/>
      <text x="70" y="163" fill="#8b949e" font-size="10" font-family="monospace">Sidebar (theme) ↓↓</text>
      <path d="M140 170 L140 180" stroke="#f85149" stroke-width="1.5"/>
      <rect x="50" y="180" width="180" height="25" rx="4" fill="#1c2333" stroke="#da3633"/>
      <text x="60" y="198" fill="#f85149" font-size="10" font-family="monospace">Button (uses theme!)</text>
      <text x="55" y="225" fill="#8b949e" font-size="10">Every middle component</text>
      <text x="55" y="237" fill="#8b949e" font-size="10">passes props it doesn't use</text>
      <rect x="310" y="40" width="270" height="200" rx="10" fill="#161b22" stroke="#238636"/>
      <text x="390" y="62" fill="#7ee787" font-size="12" font-weight="bold">✅ Context</text>
      <rect x="370" y="75" width="150" height="30" rx="4" fill="#12261e" stroke="#238636"/>
      <text x="380" y="95" fill="#7ee787" font-size="10" font-family="monospace">ThemeProvider ⭐</text>
      <rect x="380" y="115" width="120" height="25" rx="4" fill="#1c2333" stroke="#30363d"/>
      <text x="395" y="133" fill="#e6edf3" font-size="10" font-family="monospace">App</text>
      <rect x="380" y="145" width="120" height="25" rx="4" fill="#1c2333" stroke="#30363d"/>
      <text x="395" y="163" fill="#e6edf3" font-size="10" font-family="monospace">Layout</text>
      <rect x="380" y="175" width="120" height="25" rx="4" fill="#1c2333" stroke="#30363d"/>
      <text x="395" y="193" fill="#e6edf3" font-size="10" font-family="monospace">Sidebar</text>
      <path d="M370 90 L350 210 L380 210" stroke="#7ee787" stroke-width="1.5" stroke-dasharray="4" fill="none"/>
      <rect x="380" y="205" width="120" height="25" rx="4" fill="#12261e" stroke="#238636"/>
      <text x="390" y="222" fill="#7ee787" font-size="10" font-family="monospace">Button 🎯</text>
      <text x="340" y="247" fill="#8b949e" font-size="10">Direct access, no prop passing!</text>
    </svg>`,
    examples: [
      {
        title: "Context API Complete Pattern",
        code: `// How Context works step by step
console.log("=== Context API Pattern ===");
console.log(\`
// 1. CREATE context
const ThemeContext = createContext('light'); // default value

// 2. PROVIDE context (wrap your tree)
function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />     {/* doesn't need theme prop */}
    </ThemeContext.Provider>
  );
}

// 3. CONSUME context (any descendant)
function Button() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button 
      style={{ background: theme === 'dark' ? '#333' : '#fff' }}
      onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
    >
      Toggle Theme
    </button>
  );
}
\`);

console.log("Key Points:");
console.log("1. createContext(defaultValue) — used when no Provider found");
console.log("2. Provider wraps the tree, passes value prop");
console.log("3. useContext(Context) — any child accesses the value");
console.log("4. When value changes, ALL consumers re-render!");`
      },
      {
        title: "useReducer for Complex State",
        code: `// useReducer is like a mini Redux inside a component
// Best for complex state transitions

function todosReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case "TOGGLE":
      return state.map(t => 
        t.id === action.id ? { ...t, done: !t.done } : t
      );
    case "DELETE":
      return state.filter(t => t.id !== action.id);
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

// Simulate useReducer
let state = [];
function dispatch(action) {
  state = todosReducer(state, action);
  console.log("After " + action.type + ":", JSON.stringify(state));
}

dispatch({ type: "ADD", text: "Learn React" });
dispatch({ type: "ADD", text: "Build project" });
dispatch({ type: "TOGGLE", id: state[0].id });
dispatch({ type: "DELETE", id: state[1].id });

console.log("\\nFinal state:", JSON.stringify(state, null, 2));`
      }
    ],
    quiz: [
      { question: "What problem does Context API solve?", options: ["Slow rendering", "Prop drilling", "Memory leaks", "API calls"], answer: 1, explanation: "Context API solves prop drilling — passing data through many intermediate components that don't need it, just to reach a deeply nested child." },
      { question: "When should you NOT use Context?", options: ["For themes", "For auth state", "For frequently changing data", "For language settings"], answer: 2, explanation: "Context causes ALL consumers to re-render when the value changes. Frequently updating data (like every keystroke in a form) will cause performance issues." },
    ]
  },
  // ══════════════════════ API INTEGRATION ══════════════════════
  {
    id: "api-integration",
    category: "API Integration",
    title: "Fetching, Error Handling & Patterns",
    priority: "High",
    icon: "🔗",
    content: `## API Integration in React

### Fetching Data:
- Always fetch in \`useEffect\` (not during render!)
- Handle 3 states: loading, data, error
- Use AbortController for cleanup (cancel on unmount)
- Don't forget error handling for non-2xx responses

### Error Handling Strategy:
1. **Component level**: try/catch + state
2. **Error Boundaries**: catch render errors (class component)
3. **Global**: interceptors (Axios) or wrapper functions
4. **User-facing**: show friendly messages, not raw errors

### Pagination Patterns:
- **Offset-based**: \`?page=2&limit=10\` — simple, skippable
- **Cursor-based**: \`?cursor=abc123&limit=10\` — consistent with real-time data

### Retry Logic:
- Exponential backoff: wait 1s → 2s → 4s
- Only retry on network errors / 5xx, NOT 4xx
- Set max retry count

### Debouncing API Calls:
- Search inputs → debounce 300-500ms
- Cancel previous request when new one fires

### Interview Speaking Points:
1. Show useEffect + fetch with loading/error/data states
2. Explain AbortController for cleanup
3. Compare offset vs cursor pagination
4. Implement retry with exponential backoff
5. Show search debouncing pattern`,
    diagram: `<svg viewBox="0 0 600 260" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="150" y="25" fill="#e6edf3" font-size="14" font-weight="bold">API Integration Flow in React</text>
      <rect x="20" y="40" width="120" height="45" rx="8" fill="#f0883e" opacity="0.2" stroke="#f0883e"/>
      <text x="35" y="68" fill="#f0883e" font-size="12" font-weight="bold">Component</text>
      <path d="M140 62 L175 62" stroke="#8b949e" stroke-width="1.5"/>
      <rect x="175" y="40" width="120" height="45" rx="8" fill="#1f6feb" opacity="0.2" stroke="#1f6feb"/>
      <text x="190" y="68" fill="#58a6ff" font-size="12" font-weight="bold">useEffect</text>
      <path d="M295 62 L330 62" stroke="#8b949e" stroke-width="1.5"/>
      <rect x="330" y="40" width="110" height="45" rx="8" fill="#d2a8ff" opacity="0.2" stroke="#d2a8ff"/>
      <text x="350" y="68" fill="#d2a8ff" font-size="12" font-weight="bold">fetch()</text>
      <path d="M440 62 L475 62" stroke="#8b949e" stroke-width="1.5"/>
      <rect x="475" y="40" width="100" height="45" rx="8" fill="#238636" opacity="0.2" stroke="#238636"/>
      <text x="495" y="68" fill="#7ee787" font-size="12" font-weight="bold">Server</text>
      <rect x="20" y="100" width="555" height="70" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="125" fill="#e6edf3" font-size="13" font-weight="bold">Three UI States:</text>
      <rect x="40" y="135" width="120" height="25" rx="4" fill="#f0883e" opacity="0.2" stroke="#f0883e"/>
      <text x="55" y="152" fill="#f0883e" font-size="11">⏳ Loading...</text>
      <rect x="180" y="135" width="160" height="25" rx="4" fill="#238636" opacity="0.2" stroke="#238636"/>
      <text x="195" y="152" fill="#7ee787" font-size="11">✅ Data rendered</text>
      <rect x="360" y="135" width="200" height="25" rx="4" fill="#da3633" opacity="0.2" stroke="#da3633"/>
      <text x="375" y="152" fill="#f85149" font-size="11">❌ Error + retry button</text>
      <rect x="20" y="185" width="270" height="65" rx="8" fill="#1c2333" stroke="#58a6ff"/>
      <text x="40" y="208" fill="#58a6ff" font-size="12" font-weight="bold">Offset Pagination</text>
      <text x="40" y="228" fill="#e6edf3" font-size="11" font-family="monospace">?page=2&limit=10</text>
      <text x="40" y="243" fill="#8b949e" font-size="10">Simple, allows page jumping</text>
      <rect x="310" y="185" width="270" height="65" rx="8" fill="#1c2333" stroke="#f0883e"/>
      <text x="330" y="208" fill="#f0883e" font-size="12" font-weight="bold">Cursor Pagination</text>
      <text x="330" y="228" fill="#e6edf3" font-size="11" font-family="monospace">?cursor=abc&limit=10</text>
      <text x="330" y="243" fill="#8b949e" font-size="10">Better for real-time, infinite scroll</text>
    </svg>`,
    examples: [
      {
        title: "Complete Fetch Pattern with Cleanup",
        code: `console.log(\`
// Complete data fetching pattern in React
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    async function fetchUsers() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/users', {
          signal: controller.signal // for cancellation
        });
        
        if (!res.ok) {
          throw new Error('HTTP ' + res.status);
        }
        
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
    
    // Cleanup: cancel request if component unmounts
    return () => controller.abort();
  }, []); // runs once on mount
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} onRetry={refetch} />;
  return <List users={users} />;
}
\`);

// Simulating the flow
console.log("1. Component mounts → loading: true");
console.log("2. fetch starts → waiting for response");
console.log("3a. Success → setUsers(data), loading: false");
console.log("3b. Error → setError(msg), loading: false");
console.log("4. Unmount → controller.abort() cancels request");`
      },
      {
        title: "Retry with Exponential Backoff",
        code: `async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log("Attempt " + (attempt + 1) + "...");
      
      // Simulating API call
      if (attempt < 2) {
        throw new Error("Server error (500)");
      }
      
      console.log("✅ Success on attempt " + (attempt + 1));
      return { data: "response data" };
      
    } catch (error) {
      if (attempt === maxRetries) {
        console.log("❌ All retries exhausted");
        throw error;
      }
      
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      console.log("  Retry in " + delay + "ms (exponential backoff)");
      
      // In real code: await new Promise(r => setTimeout(r, delay));
    }
  }
}

fetchWithRetry("/api/data")
  .then(result => console.log("Result:", JSON.stringify(result)))
  .catch(err => console.log("Final error:", err.message));`
      },
      {
        title: "Debounced Search with Cancel",
        code: `console.log(\`
// Debounced search in React
function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    // Cancel previous request
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    const controller = new AbortController();
    controllerRef.current = controller;
    
    // Debounce: wait 300ms after last keystroke
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          '/api/search?q=' + query,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    }, 300);
    
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);
}
\`);

// Simulating the flow
console.log("User types: H → He → Hel → Hello");
console.log("  H: timer starts (300ms)");
console.log("  He: previous timer cleared, new timer");
console.log("  Hel: previous timer cleared, new timer");
console.log("  Hello: previous timer cleared, new timer");
console.log("  ...300ms passes...");
console.log("  API call: /api/search?q=Hello ← only ONE call!");`
      }
    ],
    quiz: [
      { question: "Why use AbortController in useEffect?", options: ["To speed up requests", "To cancel ongoing requests when component unmounts", "To retry failed requests", "It's required by React"], answer: 1, explanation: "AbortController cancels in-flight requests when the component unmounts or the effect re-runs, preventing state updates on unmounted components." },
      { question: "In exponential backoff, what are the delays for 3 retries?", options: ["1s, 1s, 1s", "1s, 2s, 4s", "1s, 3s, 9s", "2s, 2s, 2s"], answer: 1, explanation: "Exponential backoff doubles the delay: 2⁰*1000=1s, 2¹*1000=2s, 2²*1000=4s. This reduces server load during outages." },
    ]
  },
  // ══════════════════════ CACHING ══════════════════════
  {
    id: "caching-frontend-backend",
    category: "Caching",
    title: "API Caching (Frontend & Backend)",
    priority: "High",
    icon: "💾",
    content: `## Caching Strategies

### Frontend Caching:

**In-Memory Cache (Map/Object)**:
- Fastest, but lost on page refresh
- Good for: API responses during session, computed values

**localStorage / sessionStorage**:
- localStorage: persists across sessions (5-10MB)
- sessionStorage: cleared when tab closes
- Only stores strings (JSON.stringify/parse)

**Stale-While-Revalidate (SWR)**:
1. Return cached (stale) data immediately → fast UI
2. Fetch fresh data in background
3. Update cache + UI when fresh data arrives
- Libraries: React Query (TanStack Query), SWR (Vercel)

**React Query / TanStack Query**:
- Automatic caching, deduplication, background refetch
- Stale time, cache time configuration
- Pagination, infinite queries, mutations
- DevTools for debugging cache

### Backend Caching:

**HTTP Cache Headers**:
- \`Cache-Control: max-age=3600\` — browser caches for 1hr
- \`ETag\` — content fingerprint for revalidation
- \`Last-Modified\` — timestamp-based revalidation

**CDN Caching**: Cloudflare, CloudFront — edge caching

**Server-side**: Redis, Memcached — in-memory stores

**Database Query Cache**: Cache frequent queries

### Cache Invalidation Strategies:
- **Time-based (TTL)**: auto-expire after N seconds
- **Event-based**: invalidate on write/update
- **Manual**: admin clears cache

### Interview Speaking Points:
1. Compare localStorage vs sessionStorage vs in-memory
2. Explain SWR pattern with diagram
3. Show a simple Map-based cache with TTL
4. Discuss HTTP caching headers
5. Mention React Query as the modern solution`,
    diagram: `<svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="150" y="25" fill="#e6edf3" font-size="14" font-weight="bold">Stale-While-Revalidate Pattern</text>
      <rect x="20" y="40" width="130" height="45" rx="8" fill="#f0883e" opacity="0.2" stroke="#f0883e"/>
      <text x="35" y="68" fill="#f0883e" font-size="12" font-weight="bold">1. User Request</text>
      <path d="M150 62 L185 45" stroke="#7ee787" stroke-width="2"/>
      <path d="M150 62 L185 80" stroke="#58a6ff" stroke-width="2" stroke-dasharray="4"/>
      <rect x="185" y="22" width="200" height="40" rx="8" fill="#238636" opacity="0.2" stroke="#238636"/>
      <text x="200" y="47" fill="#7ee787" font-size="12" font-weight="bold">2. Return stale data ⚡</text>
      <rect x="185" y="68" width="200" height="40" rx="8" fill="#1f6feb" opacity="0.2" stroke="#1f6feb"/>
      <text x="200" y="92" fill="#58a6ff" font-size="12" font-weight="bold">3. Fetch fresh (bg) 🔄</text>
      <path d="M385 88 L430 88" stroke="#58a6ff" stroke-width="1.5" stroke-dasharray="4"/>
      <rect x="430" y="70" width="80" height="35" rx="6" fill="#d2a8ff" opacity="0.2" stroke="#d2a8ff"/>
      <text x="445" y="92" fill="#d2a8ff" font-size="11">Server</text>
      <path d="M430 105 L400 130" stroke="#d2a8ff" stroke-width="1.5"/>
      <rect x="185" y="115" width="200" height="40" rx="8" fill="#7ee787" opacity="0.1" stroke="#7ee787"/>
      <text x="200" y="140" fill="#7ee787" font-size="12">4. Update cache + UI ✅</text>
      <rect x="20" y="170" width="560" height="100" rx="10" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="195" fill="#e6edf3" font-size="13" font-weight="bold">Caching Layers</text>
      <rect x="40" y="205" width="100" height="30" rx="4" fill="#1f6feb" opacity="0.2" stroke="#1f6feb"/>
      <text x="53" y="225" fill="#58a6ff" font-size="10">Memory (Map)</text>
      <rect x="155" y="205" width="110" height="30" rx="4" fill="#238636" opacity="0.2" stroke="#238636"/>
      <text x="163" y="225" fill="#7ee787" font-size="10">localStorage</text>
      <rect x="280" y="205" width="100" height="30" rx="4" fill="#f0883e" opacity="0.2" stroke="#f0883e"/>
      <text x="295" y="225" fill="#f0883e" font-size="10">HTTP Cache</text>
      <rect x="395" y="205" width="80" height="30" rx="4" fill="#d2a8ff" opacity="0.2" stroke="#d2a8ff"/>
      <text x="415" y="225" fill="#d2a8ff" font-size="10">CDN</text>
      <rect x="490" y="205" width="75" height="30" rx="4" fill="#da3633" opacity="0.2" stroke="#da3633"/>
      <text x="506" y="225" fill="#f85149" font-size="10">Redis</text>
      <text x="40" y="257" fill="#8b949e" font-size="11">⬅ Faster                                                                     More durable ➡</text>
    </svg>`,
    examples: [
      {
        title: "In-Memory Cache with TTL",
        code: `class APICache {
  constructor(ttlMs = 60000) { // default 1 min TTL
    this.cache = new Map();
    this.ttl = ttlMs;
  }
  
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      console.log("  Cache EXPIRED for:", key);
      return null;
    }
    
    console.log("  Cache HIT for:", key);
    return entry.data;
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl,
    });
    console.log("  Cache SET for:", key);
  }
  
  invalidate(key) {
    this.cache.delete(key);
    console.log("  Cache INVALIDATED:", key);
  }
  
  clear() {
    this.cache.clear();
    console.log("  Cache CLEARED");
  }
}

const cache = new APICache(5000); // 5s TTL

// Simulated API call with caching
async function fetchUser(id) {
  const key = "user_" + id;
  const cached = cache.get(key);
  if (cached) return cached;
  
  // Simulate API call
  console.log("  Fetching from API...");
  const data = { id, name: "User " + id };
  cache.set(key, data);
  return data;
}

console.log("First call:");
fetchUser(1).then(u => console.log("  Result:", JSON.stringify(u)));

console.log("\\nSecond call (cached):");
fetchUser(1).then(u => console.log("  Result:", JSON.stringify(u)));

console.log("\\nDifferent user:");
fetchUser(2).then(u => console.log("  Result:", JSON.stringify(u)));`
      },
      {
        title: "SWR Pattern Implementation",
        code: `// Stale-While-Revalidate from scratch
const swrCache = new Map();

async function fetchWithSWR(key, fetcher) {
  // 1. Return stale data immediately
  if (swrCache.has(key)) {
    console.log("📦 Returning stale data for:", key);
    const staleData = swrCache.get(key);
    
    // 2. Revalidate in background
    console.log("🔄 Revalidating in background...");
    fetcher().then(freshData => {
      swrCache.set(key, freshData);
      console.log("✅ Cache updated with fresh data:", JSON.stringify(freshData));
      // In React: would trigger re-render here
    });
    
    return staleData;
  }
  
  // First time: must wait for data
  console.log("🌐 First fetch for:", key);
  const data = await fetcher();
  swrCache.set(key, data);
  return data;
}

// Simulate
async function getUsers() {
  return { users: ["Alice", "Bob"], timestamp: new Date().toISOString() };
}

async function demo() {
  console.log("=== First request (no cache) ===");
  const r1 = await fetchWithSWR("users", getUsers);
  console.log("Got:", JSON.stringify(r1));
  
  console.log("\\n=== Second request (has stale cache) ===");
  const r2 = await fetchWithSWR("users", getUsers);
  console.log("Immediately got:", JSON.stringify(r2));
  console.log("(background refresh happening...)");
}

demo();`
      },
      {
        title: "localStorage Cache for API Responses",
        code: `// Simple localStorage wrapper with expiry
const storageCache = {
  set(key, data, ttlMs = 3600000) { // default 1hr
    const entry = {
      data,
      expiry: Date.now() + ttlMs,
    };
    // In browser: localStorage.setItem(key, JSON.stringify(entry));
    console.log("💾 Stored in localStorage:", key);
    console.log("  Expires:", new Date(entry.expiry).toISOString());
    // Simulating storage
    this._store = this._store || {};
    this._store[key] = JSON.stringify(entry);
  },
  
  get(key) {
    // In browser: const raw = localStorage.getItem(key);
    this._store = this._store || {};
    const raw = this._store[key];
    if (!raw) return null;
    
    const entry = JSON.parse(raw);
    if (Date.now() > entry.expiry) {
      delete this._store[key];
      console.log("⏰ Expired:", key);
      return null;
    }
    console.log("✅ Found in localStorage:", key);
    return entry.data;
  }
};

// Usage
storageCache.set("api/products", [
  { id: 1, name: "Widget" },
  { id: 2, name: "Gadget" }
], 5000);

console.log("\\nRetrieving:");
const products = storageCache.get("api/products");
console.log("Products:", JSON.stringify(products));

console.log("\\n=== When to use which? ===");
console.log("Map/Object cache → session-only, fastest");
console.log("localStorage → persists, good for user prefs/tokens");
console.log("sessionStorage → tab-only, good for form state");
console.log("React Query → automatic SWR + dedup + devtools");`
      }
    ],
    quiz: [
      { question: "What does Stale-While-Revalidate mean?", options: ["Only show stale data", "Show stale data immediately, fetch fresh in background", "Always wait for fresh data", "Delete stale data"], answer: 1, explanation: "SWR returns cached (stale) data instantly for fast UI, then fetches fresh data in the background and updates the cache and UI." },
      { question: "What's the key difference between localStorage and sessionStorage?", options: ["Size limit", "localStorage persists, sessionStorage clears on tab close", "Speed", "Data types supported"], answer: 1, explanation: "localStorage persists across browser sessions. sessionStorage is cleared when the tab or window is closed." },
      { question: "Why use in-memory cache (Map) over localStorage?", options: ["More storage", "Faster access, no serialization needed", "Persists forever", "Works offline"], answer: 1, explanation: "In-memory cache is much faster because it avoids JSON serialization/parsing and disk I/O. But it's lost on page refresh." }
    ]
  },
  // ══════════════════════ SYSTEM DESIGN ══════════════════════
  {
    id: "frontend-architecture",
    category: "System Design",
    title: "Frontend Architecture & Security",
    priority: "High",
    icon: "🏗️",
    content: `## Frontend Architecture & Security

### Project Structure (React):
\`\`\`
src/
├── components/    → Reusable UI (Button, Modal, Card)
├── pages/         → Route-level components
├── hooks/         → Custom hooks (useAuth, useFetch)
├── services/      → API layer (api.js, authService.js)
├── context/       → React Context providers
├── utils/         → Helper functions (formatDate, validators)
├── constants/     → Config values, enums
└── types/         → TypeScript interfaces
\`\`\`

### API Layer Abstraction:
Create a service layer to centralize API calls. Don't call fetch directly in components.

### Error Boundaries:
Class components that catch JavaScript errors in their child component tree and show fallback UI.

### JWT Token Storage:
- **httpOnly cookie** ← BEST (not accessible via JS)
- **Memory (variable)** — lost on refresh, but most secure in browser
- **localStorage** — vulnerable to XSS
- **sessionStorage** — slightly better, still XSS vulnerable

### Security Checklist:
1. Sanitize user input (prevent XSS)
2. Use httpOnly cookies for tokens
3. CSRF protection (SameSite cookies, CSRF tokens)
4. Content Security Policy headers
5. HTTPS everywhere
6. Validate on server (never trust client)

### Interview Speaking Points:
1. Describe folder structure and why separation matters
2. Show API service layer pattern
3. Explain Error Boundaries with componentDidCatch
4. JWT storage options — recommend httpOnly cookie
5. List top 3 security practices`,
    diagram: `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="130" y="25" fill="#e6edf3" font-size="14" font-weight="bold">Frontend Architecture Layers</text>
      <rect x="20" y="40" width="560" height="50" rx="8" fill="#1f6feb" opacity="0.15" stroke="#1f6feb"/>
      <text x="220" y="70" fill="#58a6ff" font-size="14" font-weight="bold">UI Components Layer</text>
      <rect x="20" y="100" width="560" height="50" rx="8" fill="#238636" opacity="0.15" stroke="#238636"/>
      <text x="200" y="130" fill="#7ee787" font-size="14" font-weight="bold">State Management Layer</text>
      <text x="200" y="145" fill="#8b949e" font-size="10">(Context / Redux / React Query)</text>
      <rect x="20" y="160" width="560" height="50" rx="8" fill="#f0883e" opacity="0.15" stroke="#f0883e"/>
      <text x="220" y="190" fill="#f0883e" font-size="14" font-weight="bold">API Service Layer</text>
      <text x="220" y="205" fill="#8b949e" font-size="10">(Centralized fetch, interceptors, error handling)</text>
      <rect x="20" y="220" width="560" height="50" rx="8" fill="#d2a8ff" opacity="0.15" stroke="#d2a8ff"/>
      <text x="230" y="250" fill="#d2a8ff" font-size="14" font-weight="bold">Backend API</text>
      <text x="230" y="265" fill="#8b949e" font-size="10">(REST / GraphQL)</text>
      <rect x="20" y="280" width="270" height="15" rx="3" fill="#12261e" stroke="#238636"/>
      <text x="40" y="292" fill="#7ee787" font-size="10">httpOnly Cookie (JWT)</text>
      <rect x="310" y="280" width="270" height="15" rx="3" fill="#2d1418" stroke="#da3633"/>
      <text x="330" y="292" fill="#f85149" font-size="10">❌ localStorage (XSS vulnerable)</text>
    </svg>`,
    examples: [
      {
        title: "API Service Layer Pattern",
        code: `// services/api.js — centralized API handler
class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async request(endpoint, options = {}) {
    const url = this.baseURL + endpoint;
    const config = {
      headers: { "Content-Type": "application/json" },
      ...options,
    };
    
    try {
      console.log(config.method || "GET", url);
      // Simulated response
      if (endpoint.includes("error")) throw new Error("Server error");
      return { data: { id: 1, name: "Result" }, status: 200 };
    } catch (error) {
      console.error("API Error:", error.message);
      throw error;
    }
  }
  
  get(endpoint) { return this.request(endpoint); }
  post(endpoint, data) { 
    return this.request(endpoint, { method: "POST", body: JSON.stringify(data) });
  }
  put(endpoint, data) {
    return this.request(endpoint, { method: "PUT", body: JSON.stringify(data) });
  }
  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

// Usage
const api = new ApiService("https://api.example.com");

async function demo() {
  const users = await api.get("/users");
  console.log("Users:", JSON.stringify(users));
  
  const newUser = await api.post("/users", { name: "Kumar" });
  console.log("Created:", JSON.stringify(newUser));
  
  try {
    await api.get("/error");
  } catch (e) {
    console.log("Caught error gracefully");
  }
}

demo();`
      },
      {
        title: "JWT Storage & Security",
        code: `console.log("=== Where to Store JWT Tokens ===\\n");

console.log("1. httpOnly Cookie (RECOMMENDED ✅)");
console.log("   Pros: Not accessible via JavaScript (XSS safe)");
console.log("   Cons: Need CSRF protection (SameSite=Strict helps)");
console.log("   Server sets: Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict");
console.log("");

console.log("2. Memory / React State");
console.log("   Pros: Most secure in browser, not in any storage");
console.log("   Cons: Lost on page refresh → need refresh token flow");
console.log("");

console.log("3. localStorage (NOT RECOMMENDED ❌)");
console.log("   Pros: Simple, persists");
console.log("   Cons: Accessible via JS → any XSS attack can steal token");
console.log("");

console.log("4. sessionStorage (SLIGHTLY BETTER)");
console.log("   Pros: Cleared on tab close");
console.log("   Cons: Still accessible via JS → XSS vulnerable");

console.log("\\n=== Common Attack Vectors ===");
console.log("XSS: Injecting scripts to steal tokens from localStorage");
console.log("CSRF: Tricking browser into making authenticated requests");
console.log("  → httpOnly + SameSite cookies protect against BOTH!");

console.log("\\n=== Your Universal Seal App ===");
console.log("Since Next.js frontend and Express backend are on different domains:");
console.log("  Option A: httpOnly cookie with SameSite=None; Secure");
console.log("  Option B: Next.js API route as proxy (same origin!)");`
      }
    ],
    quiz: [
      { question: "Where should you store JWT tokens?", options: ["localStorage", "sessionStorage", "httpOnly cookie", "Global variable"], answer: 2, explanation: "httpOnly cookies cannot be accessed by JavaScript, making them immune to XSS attacks. Combined with SameSite attribute, they protect against CSRF too." },
      { question: "What is an Error Boundary?", options: ["A try-catch in useEffect", "A class component that catches render errors in children", "A global error handler", "A CSS boundary"], answer: 1, explanation: "Error Boundaries are React class components that use componentDidCatch to catch JavaScript errors in their child component tree and display fallback UI." },
      { question: "Why create an API service layer?", options: ["It's faster", "Centralizes error handling, auth headers, and request logic", "React requires it", "To avoid using fetch"], answer: 1, explanation: "An API service layer centralizes all HTTP logic: base URL, headers, auth tokens, error handling, and interceptors. Components just call service methods." }
    ]
  },
  // ══════════════════════ MACHINE CODING ══════════════════════
  {
    id: "machine-coding",
    category: "Machine Coding",
    title: "Common Interview Patterns",
    priority: "High",
    icon: "⌨️",
    content: `## Machine Coding Patterns

These are the most common patterns tested in frontend interviews. For each, you should be able to code it in 30-45 minutes.

### Key Patterns:
1. **Todo App** — CRUD operations, state management, filters
2. **Search with Debounce** — input handling, API calls, loading states
3. **Data Table** — sorting, filtering, pagination
4. **Infinite Scroll** — scroll events, API pagination, loading indicator
5. **Form Validation** — custom validators, error display, submit handling

### What Interviewers Look For:
- Clean component structure
- Proper state management
- Edge case handling
- Performance considerations
- Code organization

### General Approach:
1. Clarify requirements (2 min)
2. Plan component structure (3 min)
3. Build core functionality first
4. Add features incrementally
5. Handle edge cases
6. Discuss optimizations`,
    diagram: `<svg viewBox="0 0 600 200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <text x="130" y="25" fill="#e6edf3" font-size="14" font-weight="bold">Machine Coding Interview Approach</text>
      <rect x="20" y="45" width="90" height="55" rx="6" fill="#da3633" opacity="0.15" stroke="#da3633"/>
      <text x="32" y="68" fill="#f85149" font-size="11" font-weight="bold">Clarify</text>
      <text x="32" y="85" fill="#8b949e" font-size="9">2 min</text>
      <rect x="125" y="45" width="90" height="55" rx="6" fill="#f0883e" opacity="0.15" stroke="#f0883e"/>
      <text x="145" y="68" fill="#f0883e" font-size="11" font-weight="bold">Plan</text>
      <text x="137" y="85" fill="#8b949e" font-size="9">3 min</text>
      <rect x="230" y="45" width="90" height="55" rx="6" fill="#1f6feb" opacity="0.15" stroke="#1f6feb"/>
      <text x="245" y="68" fill="#58a6ff" font-size="11" font-weight="bold">Build Core</text>
      <text x="242" y="85" fill="#8b949e" font-size="9">20 min</text>
      <rect x="335" y="45" width="90" height="55" rx="6" fill="#238636" opacity="0.15" stroke="#238636"/>
      <text x="345" y="68" fill="#7ee787" font-size="11" font-weight="bold">Add Features</text>
      <text x="347" y="85" fill="#8b949e" font-size="9">10 min</text>
      <rect x="440" y="45" width="90" height="55" rx="6" fill="#d2a8ff" opacity="0.15" stroke="#d2a8ff"/>
      <text x="450" y="68" fill="#d2a8ff" font-size="11" font-weight="bold">Edge Cases</text>
      <text x="452" y="85" fill="#8b949e" font-size="9">5 min</text>
      <rect x="20" y="120" width="510" height="65" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="145" fill="#e6edf3" font-size="12" font-weight="bold">Interviewer Checklist:</text>
      <text x="40" y="165" fill="#8b949e" font-size="11">✓ Clean code  ✓ State mgmt  ✓ Edge cases  ✓ Performance  ✓ Communication</text>
      <text x="40" y="180" fill="#7ee787" font-size="10">Talk through your decisions as you code!</text>
    </svg>`,
    examples: [
      {
        title: "Todo App (Core Logic)",
        code: `// Todo App — complete state management logic

let todos = [];
let nextId = 1;
let filter = "all"; // all | active | completed

function addTodo(text) {
  todos.push({ id: nextId++, text, completed: false });
  console.log("Added:", text);
}

function toggleTodo(id) {
  todos = todos.map(t => 
    t.id === id ? { ...t, completed: !t.completed } : t
  );
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
}

function editTodo(id, newText) {
  todos = todos.map(t =>
    t.id === id ? { ...t, text: newText } : t
  );
}

function getFilteredTodos() {
  if (filter === "active") return todos.filter(t => !t.completed);
  if (filter === "completed") return todos.filter(t => t.completed);
  return todos;
}

// Usage
addTodo("Learn closures");
addTodo("Build todo app");
addTodo("Practice interviews");
toggleTodo(1);
editTodo(2, "Build todo app with React");

console.log("\\nAll todos:");
todos.forEach(t => console.log(
  (t.completed ? "✅" : "⬜") + " [" + t.id + "] " + t.text
));

filter = "active";
console.log("\\nActive only:");
getFilteredTodos().forEach(t => console.log("⬜ " + t.text));

filter = "completed";
console.log("\\nCompleted only:");
getFilteredTodos().forEach(t => console.log("✅ " + t.text));

deleteTodo(3);
console.log("\\nAfter delete #3:", todos.length + " remaining");`
      },
      {
        title: "Debounced Search (Pattern)",
        code: `// Debounced search with cancel & loading state
function createSearchController() {
  let timeoutId = null;
  let abortController = null;
  
  return {
    search(query, callback) {
      // Cancel previous
      if (timeoutId) clearTimeout(timeoutId);
      if (abortController) abortController.abort();
      
      if (!query.trim()) {
        callback({ results: [], loading: false });
        return;
      }
      
      callback({ results: [], loading: true });
      
      timeoutId = setTimeout(async () => {
        abortController = new AbortController();
        console.log("🔍 Searching:", query);
        
        try {
          // Simulated API response
          const results = ["Result 1 for " + query, "Result 2 for " + query];
          callback({ results, loading: false });
          console.log("✅ Results:", results.length + " found");
        } catch (err) {
          if (err.name !== "AbortError") {
            callback({ results: [], loading: false, error: err.message });
          }
        }
      }, 300);
    },
    
    cancel() {
      if (timeoutId) clearTimeout(timeoutId);
      if (abortController) abortController.abort();
    }
  };
}

const searcher = createSearchController();

// Simulate typing "react"
const state = { results: [], loading: false };
const render = (newState) => {
  Object.assign(state, newState);
  if (state.loading) console.log("⏳ Loading...");
  else console.log("📋 Results:", JSON.stringify(state.results));
};

searcher.search("r", render);     // cancelled
searcher.search("re", render);    // cancelled
searcher.search("rea", render);   // cancelled
searcher.search("react", render); // ← fires after 300ms`
      },
      {
        title: "Form Validation Pattern",
        code: `// Reusable form validation system
const validators = {
  required: (value) => 
    (!value || !value.trim()) ? "This field is required" : null,
    
  email: (value) => 
    !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) ? "Invalid email" : null,
    
  minLength: (min) => (value) =>
    value.length < min ? "Min " + min + " characters" : null,
    
  maxLength: (max) => (value) =>
    value.length > max ? "Max " + max + " characters" : null,
    
  matches: (pattern, msg) => (value) =>
    !pattern.test(value) ? msg : null,
};

function validateForm(data, rules) {
  const errors = {};
  
  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      const error = rule(data[field] || "");
      if (error) {
        errors[field] = error;
        break; // first error wins
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// Define validation rules
const rules = {
  name: [validators.required, validators.minLength(2)],
  email: [validators.required, validators.email],
  password: [
    validators.required, 
    validators.minLength(8),
    validators.matches(/[A-Z]/, "Must include uppercase"),
    validators.matches(/[0-9]/, "Must include number"),
  ],
};

// Test
console.log("=== Valid form ===");
console.log(JSON.stringify(validateForm({
  name: "Kumar",
  email: "kumar@test.com",
  password: "MyPass123"
}, rules), null, 2));

console.log("\\n=== Invalid form ===");
console.log(JSON.stringify(validateForm({
  name: "",
  email: "not-email",
  password: "weak"
}, rules), null, 2));`
      }
    ],
    quiz: [
      { question: "What's the first thing to do in a machine coding interview?", options: ["Start coding immediately", "Clarify requirements", "Write tests", "Design the database"], answer: 1, explanation: "Always start by clarifying requirements (2 min). Understanding edge cases and expected features upfront saves you from rewriting later." },
      { question: "In a Todo app, why use filter() instead of splice() for deletion?", options: ["filter is faster", "filter creates a new array (immutable)", "splice doesn't work on arrays", "No difference"], answer: 1, explanation: "filter() returns a new array without the deleted item (immutable update). splice() mutates the original array, which React won't detect for re-rendering." }
    ]
  }
];

// ─── Category metadata ───
const CATEGORIES = {
  "JavaScript": { color: "#f0db4f", bg: "#f0db4f15", icon: "⚡" },
  "React": { color: "#61dafb", bg: "#61dafb15", icon: "⚛️" },
  "API Integration": { color: "#7ee787", bg: "#7ee78715", icon: "🔗" },
  "Caching": { color: "#d2a8ff", bg: "#d2a8ff15", icon: "💾" },
  "System Design": { color: "#f0883e", bg: "#f0883e15", icon: "🏗️" },
  "Machine Coding": { color: "#f85149", bg: "#f8514915", icon: "⌨️" },
};

// ─── MAIN APP ───
export default function LearningHub() {
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeTab, setActiveTab] = useState("learn");
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const contentRef = useRef(null);

  const filteredTopics = useMemo(() => {
    if (!searchQuery) return TOPICS;
    const q = searchQuery.toLowerCase();
    return TOPICS.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const groupedTopics = useMemo(() => {
    const groups = {};
    filteredTopics.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [filteredTopics]);

  const toggleComplete = (id) => {
    setCompletedTopics(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const topic = TOPICS.find(t => t.id === activeTopic);
  const progress = Math.round((completedTopics.size / TOPICS.length) * 100);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeTopic, activeTab]);

  // Render markdown-like content
  const renderContent = (text) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} style={{ color: "#e6edf3", fontSize: 20, fontWeight: 700, marginTop: 20, marginBottom: 10, borderBottom: "1px solid #21262d", paddingBottom: 8 }}>{line.replace("## ", "")}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} style={{ color: "#58a6ff", fontSize: 16, fontWeight: 600, marginTop: 16, marginBottom: 6 }}>{line.replace("### ", "")}</h3>;
      if (line.startsWith("- ")) return <div key={i} style={{ paddingLeft: 16, marginBottom: 4, color: "#c9d1d9", fontSize: 14, lineHeight: 1.6 }}>• {renderInline(line.slice(2))}</div>;
      if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ") || line.startsWith("5. ") || line.startsWith("6. ")) return <div key={i} style={{ paddingLeft: 16, marginBottom: 4, color: "#c9d1d9", fontSize: 14, lineHeight: 1.6 }}>{renderInline(line)}</div>;
      if (line.startsWith("|")) return null; // skip table rows (handled manually)
      if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
      if (line.startsWith("```")) return null;
      return <p key={i} style={{ color: "#c9d1d9", fontSize: 14, lineHeight: 1.7, marginBottom: 6 }}>{renderInline(line)}</p>;
    });
  };

  const renderInline = (text) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) return <code key={i} style={{ background: "#1c2333", padding: "2px 6px", borderRadius: 4, fontSize: 13, color: "#79c0ff", fontFamily: "'JetBrains Mono', monospace" }}>{part.slice(1, -1)}</code>;
      if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} style={{ color: "#e6edf3", fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      return part;
    });
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#010409", color: "#e6edf3", fontFamily: "'Söhne', -apple-system, sans-serif", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 300 : 0, minWidth: sidebarOpen ? 300 : 0, background: "#0d1117", borderRight: "1px solid #21262d", display: "flex", flexDirection: "column", transition: "all 0.2s", overflow: "hidden" }}>
        <div style={{ padding: "16px 14px 10px", borderBottom: "1px solid #21262d" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 22 }}>🧠</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3" }}>Interview Mastery</div>
              <div style={{ fontSize: 11, color: "#8b949e" }}>{TOPICS.length} topics • {completedTopics.size} completed</div>
            </div>
          </div>
          <div style={{ background: "#161b22", borderRadius: 6, height: 6, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ width: progress + "%", height: "100%", background: progress === 100 ? "#238636" : "#1f6feb", borderRadius: 6, transition: "width 0.3s" }} />
          </div>
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "8px 10px", background: "#161b22", border: "1px solid #30363d", borderRadius: 6, color: "#e6edf3", fontSize: 13, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {Object.entries(groupedTopics).map(([cat, topics]) => {
            const catInfo = CATEGORIES[cat] || { color: "#8b949e", icon: "📁" };
            return (
              <div key={cat} style={{ marginBottom: 4 }}>
                <div style={{ padding: "6px 14px", fontSize: 11, fontWeight: 700, color: catInfo.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {catInfo.icon} {cat}
                </div>
                {topics.map(t => (
                  <div
                    key={t.id}
                    onClick={() => { setActiveTopic(t.id); setActiveTab("learn"); }}
                    style={{
                      padding: "8px 14px 8px 24px",
                      cursor: "pointer",
                      background: activeTopic === t.id ? "#1c2333" : "transparent",
                      borderLeft: activeTopic === t.id ? "2px solid " + catInfo.color : "2px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "all 0.1s",
                    }}
                  >
                    <span
                      onClick={(e) => { e.stopPropagation(); toggleComplete(t.id); }}
                      style={{ fontSize: 14, cursor: "pointer", opacity: completedTopics.has(t.id) ? 1 : 0.4 }}
                    >
                      {completedTopics.has(t.id) ? "✅" : "⬜"}
                    </span>
                    <span style={{ fontSize: 13, color: activeTopic === t.id ? "#e6edf3" : "#8b949e", flex: 1 }}>{t.title}</span>
                    {t.priority === "High" && <span style={{ fontSize: 9, color: "#f85149", background: "#f8514920", padding: "1px 5px", borderRadius: 4 }}>HIGH</span>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ padding: "10px 20px", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", gap: 12, background: "#0d1117" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "1px solid #30363d", borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "#8b949e", fontSize: 16 }}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
          {topic && (
            <>
              <span style={{ fontSize: 20 }}>{topic.icon}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#e6edf3" }}>{topic.title}</span>
              <span style={{ fontSize: 12, color: CATEGORIES[topic.category]?.color, background: CATEGORIES[topic.category]?.bg, padding: "2px 8px", borderRadius: 10 }}>{topic.category}</span>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", gap: 2, background: "#161b22", borderRadius: 8, padding: 2 }}>
                {["learn", "examples", "quiz"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 6,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      background: activeTab === tab ? "#1f6feb" : "transparent",
                      color: activeTab === tab ? "#fff" : "#8b949e",
                    }}
                  >
                    {tab === "learn" ? "📖 Learn" : tab === "examples" ? "💻 Code" : "🧪 Quiz"}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "20px 24px 40px" }}>
          {!topic ? (
            <div style={{ textAlign: "center", paddingTop: 80 }}>
              <div style={{ fontSize: 50, marginBottom: 16 }}>🧠</div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#e6edf3", marginBottom: 8 }}>Interview Mastery Hub</h1>
              <p style={{ color: "#8b949e", fontSize: 15, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
                {TOPICS.length} topics across {Object.keys(CATEGORIES).length} categories. Each topic includes deep explanations, visual diagrams, executable code examples, and practice quizzes.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
                {Object.entries(CATEGORIES).map(([name, info]) => (
                  <div key={name} style={{ background: info.bg, border: "1px solid " + info.color + "30", borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{info.icon}</span>
                    <span style={{ color: info.color, fontSize: 13, fontWeight: 600 }}>{name}</span>
                    <span style={{ color: "#8b949e", fontSize: 12 }}>({TOPICS.filter(t => t.category === name).length})</span>
                  </div>
                ))}
              </div>
              <p style={{ color: "#58a6ff", fontSize: 13, marginTop: 24 }}>← Select a topic from the sidebar to begin</p>
            </div>
          ) : activeTab === "learn" ? (
            <div style={{ maxWidth: 800 }}>
              {renderContent(topic.content)}
              {topic.diagram && (
                <div style={{ margin: "20px 0" }}>
                  <h3 style={{ color: "#58a6ff", fontSize: 16, marginBottom: 10 }}>📊 Visual Diagram</h3>
                  <Diagram svg={topic.diagram} />
                </div>
              )}
              <div style={{ marginTop: 20, padding: 16, background: "#12261e", border: "1px solid #238636", borderRadius: 10 }}>
                <div style={{ color: "#7ee787", fontWeight: 700, marginBottom: 6 }}>✅ Ready to practice?</div>
                <div style={{ color: "#8b949e", fontSize: 13 }}>Switch to the <strong style={{ color: "#58a6ff" }}>Code</strong> tab for executable examples or <strong style={{ color: "#58a6ff" }}>Quiz</strong> tab to test your knowledge.</div>
              </div>
            </div>
          ) : activeTab === "examples" ? (
            <div style={{ maxWidth: 800 }}>
              <h2 style={{ color: "#e6edf3", fontSize: 20, marginBottom: 16 }}>💻 Executable Examples</h2>
              <p style={{ color: "#8b949e", fontSize: 13, marginBottom: 16 }}>Click ▶ Execute to run each example and see the output.</p>
              {topic.examples.map((ex, i) => (
                <div key={i} style={{ marginBottom: 24 }}>
                  <h3 style={{ color: "#58a6ff", fontSize: 15, marginBottom: 8 }}>Example {i + 1}: {ex.title}</h3>
                  <CodeRunner code={ex.code} title={ex.title} />
                </div>
              ))}
            </div>
          ) : activeTab === "quiz" ? (
            <div style={{ maxWidth: 700 }}>
              <h2 style={{ color: "#e6edf3", fontSize: 20, marginBottom: 16 }}>🧪 Practice Quiz</h2>
              <p style={{ color: "#8b949e", fontSize: 13, marginBottom: 16 }}>Test your understanding of {topic.title}.</p>
              <Quiz questions={topic.quiz} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}