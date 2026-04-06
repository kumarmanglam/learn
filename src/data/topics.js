// ─── ALL TOPICS DATA ───
export const TOPICS = [
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/users', { signal });

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
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchUsers(controller.signal);

    return () => controller.abort();
  }, [fetchUsers]);

  if (loading) return <Spinner />;
  if (error)
    return (
      <Error
        message={error}
        onRetry={() => fetchUsers()} // retry works now
      />
    );

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
  },

  // ─── PURE FUNCTIONS ───
  {
    id: "pure-functions",
    category: "JavaScript",
    title: "Pure Functions",
    priority: "High",
    icon: "✨",
    content: `## What is a Pure Function?

A **pure function** is a function that:
1. **Always returns the same output** for the same input (deterministic)
2. **Has no side effects** — doesn't modify anything outside its scope

### Why "Pure"?
The word comes from mathematics. In math, \`f(x) = x + 1\` ALWAYS gives 4 when x is 3. Pure functions work the same way — they're **predictable**, **testable**, and **composable**.

### The Two Rules in Depth:

### Rule 1 — Same Input → Same Output (Referential Transparency):
- The function depends ONLY on its parameters
- It does NOT read from global state, random values, current time, or external APIs
- You could replace the function call with its return value and the program would behave identically — this is called **referential transparency**

### Rule 2 — No Side Effects:
A side effect is ANYTHING that affects the world outside the function:
- Modifying a global variable or external state
- Mutating input arguments (objects/arrays)
- Writing to DOM, console, files, or databases
- Making network requests (fetch, XHR)
- Setting timers or intervals
- Throwing errors (changes control flow externally)

### Pure vs Impure Comparison:

**Impure**: \`let total = 0; function add(x) { total += x; return total; }\`
- Modifies external \`total\` — side effect
- Returns different results each call — not deterministic

**Pure**: \`function add(a, b) { return a + b; }\`
- Only uses its inputs — no external state
- Always returns same result for same inputs

### Why Pure Functions Matter:

1. **Testability** — no mocks, no setup, no teardown. Just \`expect(fn(input)).toBe(output)\`
2. **Cacheability (Memoization)** — since same input = same output, cache results safely
3. **Parallelization** — no shared state means safe to run in parallel/web workers
4. **Debugging** — function behavior depends only on args, easy to trace bugs
5. **React relies on them** — React components, reducers, and selectors should all be pure
6. **Time-travel debugging** — Redux depends on pure reducers to replay state history
7. **Composability** — pure functions snap together like LEGO blocks via \`compose\` / \`pipe\`

### Pure Functions in React:
- **Components** should be pure: same props → same JSX
- **Reducers** must be pure: \`(state, action) => newState\` with no side effects
- **Selectors** should be pure for memoization (\`useMemo\`, \`reselect\`)
- **Side effects** go in \`useEffect\`, event handlers, or middleware — NOT in render

### Functional Programming Connection:
Pure functions are the foundation of **functional programming** (FP). Key FP concepts built on purity:
- **Immutability** — never mutate, always return new
- **Higher-order functions** — map, filter, reduce are pure
- **Function composition** — chain pure functions together
- **Currying** — create specialized pure functions

### Common Pitfall — Hidden Impurity:
- \`Math.random()\` — not pure (different each call)
- \`new Date()\` — not pure (time changes)
- \`array.sort()\` — IMPURE! It mutates the original array. Use \`[...arr].sort()\`
- \`console.log()\` — technically a side effect

### Interview Speaking Points (3 min):
1. Define the two rules: deterministic output + no side effects
2. Give pure vs impure examples (counter with external state vs pure add)
3. Explain referential transparency and why it enables memoization
4. Connect to React: components should be pure, side effects in useEffect
5. Discuss benefits: testability, cacheability, parallelization, debugging
6. Mention that Redux reducers MUST be pure for time-travel debugging
7. Acknowledge that real apps need side effects — the goal is to push them to the boundaries`,
    diagram: `<svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" style="width:100%">
      <text x="200" y="25" fill="#e6edf3" font-size="15" font-weight="bold">Pure vs Impure Functions</text>
      <rect x="20" y="40" width="260" height="130" rx="10" fill="#12261e" stroke="#238636"/>
      <text x="100" y="65" fill="#7ee787" font-size="14" font-weight="bold">PURE ✅</text>
      <text x="40" y="90" fill="#c9d1d9" font-size="12" font-family="monospace">function add(a, b) {</text>
      <text x="40" y="110" fill="#c9d1d9" font-size="12" font-family="monospace">  return a + b;</text>
      <text x="40" y="130" fill="#c9d1d9" font-size="12" font-family="monospace">}</text>
      <text x="40" y="155" fill="#7ee787" font-size="11">Same input → Same output</text>
      <rect x="320" y="40" width="260" height="130" rx="10" fill="#2a1215" stroke="#f85149"/>
      <text x="400" y="65" fill="#f85149" font-size="14" font-weight="bold">IMPURE ❌</text>
      <text x="340" y="90" fill="#c9d1d9" font-size="12" font-family="monospace">let total = 0;</text>
      <text x="340" y="110" fill="#c9d1d9" font-size="12" font-family="monospace">function add(x) {</text>
      <text x="340" y="130" fill="#c9d1d9" font-size="12" font-family="monospace">  total += x; return total;</text>
      <text x="340" y="155" fill="#f85149" font-size="11">Modifies external state</text>
      <rect x="20" y="190" width="560" height="50" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="212" fill="#58a6ff" font-size="13" font-weight="bold">Benefits of Purity:</text>
      <text x="40" y="230" fill="#c9d1d9" font-size="11">Testable • Cacheable • Parallelizable • Debuggable • Composable</text>
      <rect x="20" y="255" width="560" height="50" rx="8" fill="#1c2333" stroke="#58a6ff"/>
      <text x="40" y="277" fill="#58a6ff" font-size="13" font-weight="bold">In React:</text>
      <text x="40" y="295" fill="#c9d1d9" font-size="11">Components = Pure | Reducers = Pure | Side Effects → useEffect / Event Handlers</text>
    </svg>`,
    examples: [
      {
        title: "Pure vs Impure — Side by Side",
        code: `// ❌ IMPURE — modifies external state
let total = 0;
function addToTotal(x) {
  total += x;     // side effect: mutates external variable
  return total;
}

console.log("=== Impure Function ===");
console.log(addToTotal(5));   // 5
console.log(addToTotal(5));   // 10 — DIFFERENT result for same input!
console.log(addToTotal(5));   // 15 — unpredictable!

// ✅ PURE — depends only on inputs, no side effects
function add(a, b) {
  return a + b;
}

console.log("\\n=== Pure Function ===");
console.log(add(5, 3));  // 8
console.log(add(5, 3));  // 8 — ALWAYS the same!
console.log(add(5, 3));  // 8 — predictable!`
      },
      {
        title: "Array Mutation Trap — sort() is Impure!",
        code: `// ❌ IMPURE — Array.sort() mutates the original array!
const original = [3, 1, 4, 1, 5, 9];
console.log("Before sort:", JSON.stringify(original));
const sorted = original.sort((a, b) => a - b);
console.log("After sort:", JSON.stringify(original));  // MUTATED!
console.log("Same reference?", original === sorted);   // true — same array!

// ✅ PURE — spread first to avoid mutation
const nums = [3, 1, 4, 1, 5, 9];
console.log("\\nBefore pure sort:", JSON.stringify(nums));
const pureSorted = [...nums].sort((a, b) => a - b);
console.log("After pure sort:", JSON.stringify(nums));  // unchanged!
console.log("Sorted copy:", JSON.stringify(pureSorted));
console.log("Same reference?", nums === pureSorted);    // false — new array!`
      },
      {
        title: "Pure Object Updates (Immutable Pattern)",
        code: `// ❌ IMPURE — mutates the original object
function updateAge(user, newAge) {
  user.age = newAge;  // mutates input!
  return user;
}

const person = { name: "Kumar", age: 25 };
const updated = updateAge(person, 30);
console.log("=== Impure Update ===");
console.log("Original mutated?", person.age);  // 30 — YES, mutated!
console.log("Same reference?", person === updated);  // true

// ✅ PURE — returns a new object
function pureUpdateAge(user, newAge) {
  return { ...user, age: newAge };  // spread = new object
}

const person2 = { name: "Kumar", age: 25 };
const updated2 = pureUpdateAge(person2, 30);
console.log("\\n=== Pure Update ===");
console.log("Original preserved?", person2.age);  // 25 — untouched!
console.log("Updated:", updated2.age);              // 30
console.log("Same reference?", person2 === updated2);  // false — new object`
      },
      {
        title: "Memoization Works ONLY with Pure Functions",
        code: `// Memoization: cache results because pure = same input always = same output
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      console.log("  CACHE HIT for", key);
      return cache[key];
    }
    console.log("  Computing for", key);
    cache[key] = fn(...args);
    return cache[key];
  };
}

// ✅ Works perfectly — pure function
const pureMultiply = memoize((a, b) => a * b);
console.log("=== Memoized Pure Function ===");
console.log(pureMultiply(4, 5));  // Computing → 20
console.log(pureMultiply(4, 5));  // Cache HIT → 20
console.log(pureMultiply(3, 7));  // Computing → 21
console.log(pureMultiply(3, 7));  // Cache HIT → 21

// ❌ Broken — impure function (uses external state)
let multiplier = 2;
const impureMultiply = memoize((x) => x * multiplier);
console.log("\\n=== Memoized Impure Function (BROKEN) ===");
console.log(impureMultiply(5));  // Computing → 10
multiplier = 10;
console.log(impureMultiply(5));  // Cache HIT → 10 — WRONG! Should be 50`
      },
      {
        title: "Pure Reducer Pattern (Redux Style)",
        code: `// Redux reducers MUST be pure — (state, action) => newState
function todoReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case "TOGGLE":
      return state.map(todo =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo
      );
    case "DELETE":
      return state.filter(todo => todo.id !== action.id);
    default:
      return state;
  }
}

let state = [];
console.log("Initial:", JSON.stringify(state));

state = todoReducer(state, { type: "ADD", text: "Learn pure functions" });
state = todoReducer(state, { type: "ADD", text: "Build React app" });
console.log("After adds:", JSON.stringify(state, null, 2));

const firstId = state[0].id;
state = todoReducer(state, { type: "TOGGLE", id: firstId });
console.log("After toggle:", JSON.stringify(state, null, 2));

state = todoReducer(state, { type: "DELETE", id: firstId });
console.log("After delete:", JSON.stringify(state, null, 2));`
      }
    ],
    quiz: [
      { question: "Which of the following is a pure function?", options: ["function f() { return Math.random(); }", "function f(x) { console.log(x); return x; }", "function f(x) { return x * 2; }", "function f(x) { globalVar = x; return x; }"], answer: 2, explanation: "f(x) = x * 2 is pure: same input always gives the same output and it has no side effects. The others use randomness, console.log (side effect), or mutate global state." },
      { question: "Why is Array.sort() considered impure?", options: ["It's slow", "It returns undefined", "It mutates the original array", "It uses global state"], answer: 2, explanation: "Array.sort() sorts in-place, mutating the original array. Use [...arr].sort() for a pure alternative." },
      { question: "What enables memoization to work correctly?", options: ["Side effects", "Referential transparency (same input = same output)", "Global state", "Async functions"], answer: 1, explanation: "Memoization caches results keyed by inputs. This only works when the same inputs always produce the same output (referential transparency), which is guaranteed by pure functions." },
      { question: "In React, where should side effects go?", options: ["Inside the render function", "In pure components", "In useEffect or event handlers", "In Redux reducers"], answer: 2, explanation: "React components and reducers should be pure. Side effects (API calls, DOM manipulation, timers) belong in useEffect hooks or event handlers." },
      { question: "Which is NOT a benefit of pure functions?", options: ["Easy to test", "Safe to memoize", "Can modify external state", "Safe to run in parallel"], answer: 2, explanation: "Pure functions cannot modify external state — that's literally what makes them pure. Testability, memoizability, and parallelizability are all benefits of purity." }
    ]
  },

  // ─── TANSTACK QUERY ───
  {
    id: "tanstack-query",
    category: "React",
    title: "TanStack Query (React Query)",
    priority: "High",
    icon: "🔄",
    content: `## TanStack Query — Server State Management

**TanStack Query** (formerly React Query) is a **data-fetching and server state management** library. It solves a fundamental problem: **server state is not the same as client state**, and managing it with useState/useEffect is painful.

### The Problem It Solves:

Without TanStack Query, fetching data requires:
- \`useState\` for data, loading, error states
- \`useEffect\` for triggering fetch
- Manual cache management
- No deduplication (same data fetched multiple times)
- No background refetching
- No retry logic
- No pagination/infinite scroll support

That's 50+ lines of boilerplate PER endpoint. TanStack Query reduces it to 3 lines.

### Core Concepts:

### 1. Queries — Reading Data (\`useQuery\`):
- \`queryKey\`: unique cache identifier (like a key in a Map)
- \`queryFn\`: the async function that fetches data
- Returns: \`{ data, isLoading, isError, error, refetch, isFetching }\`
- Automatically caches, deduplicates, and refetches

### 2. Mutations — Writing Data (\`useMutation\`):
- For POST, PUT, PATCH, DELETE operations
- Returns: \`{ mutate, mutateAsync, isLoading, isError }\`
- Supports \`onSuccess\`, \`onError\`, \`onSettled\` callbacks
- Used with \`queryClient.invalidateQueries()\` to refresh stale data

### 3. Query Keys — Cache Identity:
- Simple: \`['todos']\`
- With params: \`['todos', { status: 'active' }]\`
- Hierarchical: \`['todos', todoId, 'comments']\`
- Used for cache lookup, invalidation, and deduplication

### 4. Cache Lifecycle — Stale Time vs Cache Time:
- **staleTime** (default 0): How long data is considered "fresh". During stale time, cached data is returned WITHOUT refetching.
- **gcTime** (formerly cacheTime, default 5min): How long UNUSED cache entries are kept in memory before garbage collection.
- Fresh → returns cache, no refetch
- Stale → returns cache immediately, refetches in background (SWR)
- Deleted → no cache, full loading state on next query

### 5. Automatic Refetching Triggers:
- Component mounts (configurable)
- Window regains focus (\`refetchOnWindowFocus\`)
- Network reconnects (\`refetchOnReconnect\`)
- Polling interval (\`refetchInterval\`)
- Manual (\`refetch()\`)

### 6. Query Invalidation:
After a mutation (e.g., creating a todo), invalidate related queries:
\`queryClient.invalidateQueries({ queryKey: ['todos'] })\`
This marks them as stale and triggers a background refetch.

### 7. Optimistic Updates:
Update the UI BEFORE the server responds:
1. Cancel in-flight queries
2. Snapshot previous data
3. Optimistically update cache
4. If mutation fails, rollback to snapshot

### Architecture — How It Works Under the Hood:
1. **QueryClient** holds the cache (a Map of queryKey → data)
2. **QueryClientProvider** gives React tree access via context
3. **useQuery** subscribes a component to a specific cache entry
4. Multiple components using the same queryKey share ONE cache entry
5. Request deduplication: if query is already in-flight, new subscribers wait for the same request

### TanStack Query vs Alternatives:
- vs **useState+useEffect**: TQ handles caching, retries, deduplication, background refetch automatically
- vs **Redux**: Redux is for client state. TQ is for server state. Don't store API responses in Redux.
- vs **SWR (Vercel)**: Similar concept but TQ has more features (mutations, devtools, infinite queries, selectors)
- vs **RTK Query**: Built into Redux Toolkit, good if already using Redux

### Interview Speaking Points (3 min):
1. Explain the server state problem: loading/error/cache boilerplate
2. Show useQuery with queryKey and queryFn — compare to useState+useEffect
3. Explain stale-while-revalidate: return cache immediately, refetch in background
4. Discuss staleTime vs gcTime and the cache lifecycle
5. Show mutation + invalidation pattern for writes
6. Mention query key hierarchy and request deduplication
7. Compare vs Redux: "Redux for client state, TanStack Query for server state"`,
    diagram: `<svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" style="width:100%">
      <text x="160" y="25" fill="#e6edf3" font-size="15" font-weight="bold">TanStack Query — Cache Lifecycle</text>
      <rect x="20" y="40" width="120" height="45" rx="8" fill="#238636" opacity="0.3" stroke="#238636"/>
      <text x="38" y="58" fill="#7ee787" font-size="11" font-weight="bold">FRESH</text>
      <text x="38" y="75" fill="#7ee787" font-size="10">Return cache only</text>
      <path d="M140 62 L170 62" stroke="#8b949e" stroke-width="2" marker-end="url(#arr)"/>
      <text x="145" y="55" fill="#8b949e" font-size="9">staleTime</text>
      <rect x="175" y="40" width="150" height="45" rx="8" fill="#1f6feb" opacity="0.3" stroke="#1f6feb"/>
      <text x="193" y="58" fill="#58a6ff" font-size="11" font-weight="bold">STALE</text>
      <text x="193" y="75" fill="#58a6ff" font-size="10">Cache + bg refetch</text>
      <path d="M325 62 L355 62" stroke="#8b949e" stroke-width="2"/>
      <text x="330" y="55" fill="#8b949e" font-size="9">gcTime</text>
      <rect x="360" y="40" width="130" height="45" rx="8" fill="#f85149" opacity="0.3" stroke="#f85149"/>
      <text x="378" y="58" fill="#f85149" font-size="11" font-weight="bold">DELETED</text>
      <text x="378" y="75" fill="#f85149" font-size="10">Full loading state</text>
      <rect x="20" y="105" width="470" height="80" rx="10" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="130" fill="#e6edf3" font-size="13" font-weight="bold">useQuery Flow:</text>
      <rect x="40" y="140" width="90" height="30" rx="6" fill="#f0883e" opacity="0.2" stroke="#f0883e"/>
      <text x="48" y="160" fill="#f0883e" font-size="10">Component</text>
      <path d="M130 155 L155 155" stroke="#7ee787" stroke-width="1.5"/>
      <rect x="155" y="140" width="100" height="30" rx="6" fill="#1f6feb" opacity="0.2" stroke="#1f6feb"/>
      <text x="165" y="160" fill="#58a6ff" font-size="10">QueryCache</text>
      <path d="M255 155 L280 155" stroke="#7ee787" stroke-width="1.5"/>
      <rect x="280" y="140" width="80" height="30" rx="6" fill="#d2a8ff" opacity="0.2" stroke="#d2a8ff"/>
      <text x="293" y="160" fill="#d2a8ff" font-size="10">queryFn</text>
      <path d="M360 155 L385 155" stroke="#7ee787" stroke-width="1.5"/>
      <rect x="385" y="140" width="80" height="30" rx="6" fill="#7ee787" opacity="0.2" stroke="#7ee787"/>
      <text x="400" y="160" fill="#7ee787" font-size="10">Server</text>
      <rect x="20" y="200" width="560" height="60" rx="10" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="225" fill="#e6edf3" font-size="13" font-weight="bold">useMutation Flow:</text>
      <text x="40" y="245" fill="#c9d1d9" font-size="11">mutate() → Server → onSuccess → invalidateQueries → Auto Refetch</text>
      <rect x="20" y="275" width="560" height="50" rx="10" fill="#1c2333" stroke="#58a6ff"/>
      <text x="40" y="297" fill="#58a6ff" font-size="12" font-weight="bold">Key Insight:</text>
      <text x="40" y="315" fill="#c9d1d9" font-size="11">Same queryKey in multiple components = ONE request, shared cache entry</text>
    </svg>`,
    examples: [
      {
        title: "Without TanStack Query — The Boilerplate Problem",
        code: `// This is what you'd write WITHOUT TanStack Query
// For EVERY API endpoint. Painful!

function useFetchTodos() {
  let data = null;
  let loading = true;
  let error = null;

  // Simulating the useState + useEffect pattern
  console.log("=== Without TanStack Query ===");
  console.log("You need to manage:");
  console.log("  - useState for data");
  console.log("  - useState for loading");
  console.log("  - useState for error");
  console.log("  - useEffect for fetching");
  console.log("  - Cleanup / abort controller");
  console.log("  - No caching");
  console.log("  - No deduplication");
  console.log("  - No background refetch");
  console.log("  - No retry on error");
  console.log("  - No stale-while-revalidate");
  console.log("");
  console.log("That's ~40 lines per endpoint!");

  console.log("");
  console.log("=== With TanStack Query ===");
  console.log("const { data, isLoading, error } = useQuery({");
  console.log("  queryKey: ['todos'],");
  console.log("  queryFn: () => fetch('/api/todos').then(r => r.json())");
  console.log("});");
  console.log("");
  console.log("3 lines. Caching, retries, dedup — all included!");
}

useFetchTodos();`
      },
      {
        title: "useQuery — Core API Pattern",
        code: `// TanStack Query useQuery pattern breakdown

// 1. Query Keys — cache identity
const queryKeys = {
  todos:      ["todos"],
  todoById:   (id) => ["todos", id],
  todoComments: (id) => ["todos", id, "comments"],
  filteredTodos: (filter) => ["todos", { filter }],
};

console.log("=== Query Key Examples ===");
console.log("All todos:", JSON.stringify(queryKeys.todos));
console.log("Todo #5:", JSON.stringify(queryKeys.todoById(5)));
console.log("Comments:", JSON.stringify(queryKeys.todoComments(5)));
console.log("Filtered:", JSON.stringify(queryKeys.filteredTodos("active")));

// 2. staleTime vs gcTime
console.log("\\n=== Cache Timing ===");
const config = {
  staleTime: 5 * 60 * 1000,  // 5 min — data considered fresh
  gcTime: 10 * 60 * 1000,    // 10 min — unused cache kept
};
console.log("staleTime:", config.staleTime / 1000, "sec — no refetch during this");
console.log("gcTime:", config.gcTime / 1000, "sec — garbage collect after this");

// 3. Return value shape
console.log("\\n=== useQuery Return Values ===");
const states = {
  "isLoading": "First load, no cache (show spinner)",
  "isFetching": "Any fetch happening (including background)",
  "isError": "Query failed",
  "isSuccess": "Data available",
  "data": "The resolved data",
  "error": "The error object",
  "refetch": "Function to manually trigger refetch",
};
Object.entries(states).forEach(([key, desc]) => {
  console.log("  " + key + ": " + desc);
});`
      },
      {
        title: "Mutation + Invalidation Pattern",
        code: `// Simulating TanStack Query mutation + cache invalidation

class FakeQueryClient {
  constructor() {
    this.cache = new Map();
    this.listeners = [];
  }

  setQueryData(key, data) {
    this.cache.set(JSON.stringify(key), { data, updatedAt: Date.now() });
    console.log("  Cache SET:", JSON.stringify(key));
  }

  getQueryData(key) {
    const entry = this.cache.get(JSON.stringify(key));
    return entry ? entry.data : undefined;
  }

  invalidateQueries(key) {
    const keyStr = JSON.stringify(key);
    console.log("  Cache INVALIDATED:", keyStr, "→ will refetch");
    this.cache.delete(keyStr);
  }
}

const queryClient = new FakeQueryClient();

// Simulate: fetch todos
queryClient.setQueryData(["todos"], [
  { id: 1, text: "Learn TanStack Query", done: false },
  { id: 2, text: "Build app", done: false },
]);

console.log("=== Current Cache ===");
console.log(JSON.stringify(queryClient.getQueryData(["todos"]), null, 2));

// Simulate: useMutation for adding a todo
console.log("\\n=== Mutation: Add Todo ===");
function addTodoMutation(newTodo) {
  // 1. Call server (simulated)
  console.log("  Sending to server:", newTodo.text);

  // 2. onSuccess: invalidate queries to trigger refetch
  queryClient.invalidateQueries(["todos"]);

  // 3. In real app, the refetch would get fresh data from server
  // Here we simulate the refetch result
  const current = queryClient.getQueryData(["todos"]) || [];
  queryClient.setQueryData(["todos"], [...current, newTodo]);
}

addTodoMutation({ id: 3, text: "Master caching", done: false });

console.log("\\n=== Updated Cache ===");
console.log(JSON.stringify(queryClient.getQueryData(["todos"]), null, 2));`
      },
      {
        title: "Optimistic Update Pattern",
        code: `// Optimistic Updates — update UI before server confirms

class OptimisticQueryClient {
  constructor() { this.cache = new Map(); }
  get(key) { return this.cache.get(key); }
  set(key, data) { this.cache.set(key, data); }
}

const qc = new OptimisticQueryClient();
qc.set("todos", [
  { id: 1, text: "Learn React", done: false },
  { id: 2, text: "Learn TanStack Query", done: false },
]);

console.log("=== Initial State ===");
console.log(JSON.stringify(qc.get("todos"), null, 2));

// Optimistic update: toggle todo done
function toggleTodoOptimistic(todoId, serverSucceeds) {
  // Step 1: Snapshot previous data (for rollback)
  const previousTodos = qc.get("todos");
  console.log("\\n1. Snapshot saved for rollback");

  // Step 2: Optimistically update cache
  const optimistic = previousTodos.map(t =>
    t.id === todoId ? { ...t, done: !t.done } : t
  );
  qc.set("todos", optimistic);
  console.log("2. UI updated optimistically (instant!)");
  console.log("   " + JSON.stringify(qc.get("todos")));

  // Step 3: Send to server
  if (serverSucceeds) {
    console.log("3. Server confirmed ✅ — keep optimistic state");
  } else {
    // Step 4: Rollback on error!
    console.log("3. Server FAILED ❌ — rolling back!");
    qc.set("todos", previousTodos);
    console.log("   " + JSON.stringify(qc.get("todos")));
  }
}

console.log("\\n--- Scenario 1: Server succeeds ---");
toggleTodoOptimistic(1, true);

console.log("\\n--- Scenario 2: Server fails ---");
toggleTodoOptimistic(2, false);`
      }
    ],
    quiz: [
      { question: "What problem does TanStack Query primarily solve?", options: ["Client-side state management", "CSS-in-JS styling", "Server state management (caching, fetching, syncing)", "Routing"], answer: 2, explanation: "TanStack Query manages server state — data that lives on the server and needs to be fetched, cached, synchronized, and updated. It replaces the useState+useEffect data fetching boilerplate." },
      { question: "What does staleTime control?", options: ["How long before cache is deleted", "How long data is considered fresh (no refetch)", "How often to poll the server", "The request timeout"], answer: 1, explanation: "staleTime (default 0) controls how long fetched data is considered 'fresh'. During this time, useQuery returns cached data WITHOUT triggering a background refetch." },
      { question: "What happens when multiple components use the same queryKey?", options: ["Each makes its own request", "They share one cache entry and one request", "An error is thrown", "Only the first component gets data"], answer: 1, explanation: "TanStack Query deduplicates requests. Multiple components using the same queryKey share a single cache entry. If a fetch is already in-flight, new subscribers wait for the same request." },
      { question: "After a mutation, how do you refresh related queries?", options: ["Call setState manually", "Use queryClient.invalidateQueries()", "Reload the page", "Use useEffect"], answer: 1, explanation: "After a mutation (create/update/delete), call queryClient.invalidateQueries({ queryKey: ['todos'] }) to mark related queries as stale and trigger a background refetch." },
      { question: "What is TanStack Query's stale-while-revalidate pattern?", options: ["Show loading spinner, then data", "Show cached (stale) data immediately, refetch in background", "Only show fresh data, never stale", "Cache data forever"], answer: 1, explanation: "SWR returns cached (potentially stale) data instantly for a fast UI, then refetches in the background. When fresh data arrives, the UI updates seamlessly." }
    ]
  },

  // ─── REACT FIBER ───
  {
    id: "react-fiber",
    category: "React",
    title: "React Fiber & Concurrent Rendering",
    priority: "High",
    icon: "🧬",
    content: `## React Fiber — The Concurrent Rendering Engine

**React Fiber** is React's internal reconciliation engine, introduced in React 16. It completely rewrote how React processes updates, enabling **concurrent rendering** — the ability to pause, interrupt, and prioritize work.

### The Problem Fiber Solves:

Before Fiber (React 15 and earlier — the "Stack Reconciler"):
- Rendering was **synchronous and blocking**
- Once React started rendering a component tree, it couldn't stop until done
- A large update (e.g., rendering 10,000 list items) blocked the **main thread**
- User interactions (typing, clicking) froze during renders
- Animations stuttered because the browser couldn't paint frames

### What is a Fiber?

A **Fiber** is a JavaScript object that represents a **unit of work**. Each React element (component, DOM node) gets its own Fiber node. Think of it as an enhanced virtual DOM node with scheduling capabilities.

### Fiber Node Structure (key fields):
- \`type\` — component function/class or DOM tag ('div')
- \`key\` — reconciliation key
- \`child\` — first child Fiber
- \`sibling\` — next sibling Fiber
- \`return\` — parent Fiber
- \`stateNode\` — actual DOM node or component instance
- \`pendingProps\` / \`memoizedProps\` — props
- \`memoizedState\` — current state (linked list of hooks)
- \`effectTag\` — what needs to happen (PLACEMENT, UPDATE, DELETION)
- \`alternate\` — the "work-in-progress" copy (double buffering)

### How Fiber Works — Two Phases:

### Phase 1: Render (Reconciliation) — Interruptible!
- Builds a work-in-progress Fiber tree
- Compares new elements with current Fiber tree (diffing)
- Marks Fibers with effect tags (what changed)
- Can be **paused, aborted, or restarted** — this is the key innovation
- No visible DOM changes happen here
- Uses \`requestIdleCallback\` concept (now a custom scheduler)

### Phase 2: Commit — Synchronous, NOT Interruptible
- Applies all the DOM mutations at once
- Calls lifecycle methods / useEffect cleanup + setup
- Must run to completion (no partial DOM updates)
- Very fast because all the work was done in Phase 1

### The Fiber Tree — Linked List Structure:
Unlike a traditional tree (with children arrays), Fiber uses a **linked list**:
- \`child\` → first child
- \`sibling\` → next sibling
- \`return\` → parent

This enables incremental traversal: process one Fiber, save your place, come back later.

### Double Buffering (current vs workInProgress):
React maintains TWO Fiber trees:
- **current** — what's on screen now
- **workInProgress** — being built during reconciliation
- When commit is done, workInProgress becomes the new current (pointer swap)
- The old current becomes available for the next update (recycled)

### Concurrent Features Built on Fiber:

**\`startTransition\`** — mark updates as non-urgent:
- Urgent: typing in an input (must be instant)
- Transition: filtering a large list (can be deferred)
- React can interrupt transition renders to handle urgent updates

**\`useDeferredValue\`** — defer re-renders for expensive computations:
- Returns the "old" value while a new one is computing
- Prevents UI freezes on expensive renders

**\`Suspense\`** — pause rendering while waiting for data:
- Shows fallback UI during async loading
- Fiber enables this by tracking suspended components

**Automatic Batching (React 18+)**:
- Multiple state updates in the same event = one render
- Before React 18, batching only worked in React event handlers
- Now works everywhere: promises, timeouts, native events

### Priority Levels (Lanes):
React Fiber assigns priority levels to updates:
1. **Sync** — discrete user events (click, keypress)
2. **InputContinuous** — continuous events (scroll, mouse move)
3. **Default** — normal updates (data fetch results)
4. **Transition** — startTransition updates
5. **Idle** — very low priority (prefetching)

### Time Slicing:
Fiber breaks rendering work into small chunks (~5ms each).
After each chunk, it yields back to the browser so it can:
- Process user input
- Paint frames (60fps = 16ms budget)
- Run animations
Then it resumes rendering. This keeps the UI responsive even during heavy renders.

### Interview Speaking Points (3 min):
1. Explain the problem: Stack Reconciler was synchronous, blocking main thread
2. Define Fiber: a JS object representing a unit of work, linked list tree
3. Describe the two phases: Render (interruptible, no DOM changes) and Commit (synchronous, applies changes)
4. Explain time slicing: work in 5ms chunks, yield to browser for input/paint
5. Show how double buffering works: current vs workInProgress trees
6. Connect to concurrent features: startTransition, useDeferredValue, Suspense
7. Mention priority lanes: user clicks > scroll > data fetch > transitions`,
    diagram: `<svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" style="width:100%">
      <text x="150" y="25" fill="#e6edf3" font-size="15" font-weight="bold">React Fiber — Two Phase Architecture</text>
      <rect x="20" y="40" width="260" height="120" rx="10" fill="#1f6feb" opacity="0.15" stroke="#1f6feb"/>
      <text x="60" y="65" fill="#58a6ff" font-size="14" font-weight="bold">Phase 1: Render</text>
      <text x="40" y="85" fill="#58a6ff" font-size="11">⏸ INTERRUPTIBLE</text>
      <text x="40" y="105" fill="#c9d1d9" font-size="11">• Build workInProgress tree</text>
      <text x="40" y="120" fill="#c9d1d9" font-size="11">• Diff (reconciliation)</text>
      <text x="40" y="135" fill="#c9d1d9" font-size="11">• Mark effects (no DOM yet)</text>
      <text x="40" y="150" fill="#7ee787" font-size="10">Can pause/resume/abort</text>
      <rect x="320" y="40" width="260" height="120" rx="10" fill="#238636" opacity="0.15" stroke="#238636"/>
      <text x="370" y="65" fill="#7ee787" font-size="14" font-weight="bold">Phase 2: Commit</text>
      <text x="340" y="85" fill="#7ee787" font-size="11">🔒 SYNCHRONOUS</text>
      <text x="340" y="105" fill="#c9d1d9" font-size="11">• Apply DOM mutations</text>
      <text x="340" y="120" fill="#c9d1d9" font-size="11">• Run effects/lifecycles</text>
      <text x="340" y="135" fill="#c9d1d9" font-size="11">• Swap trees (double buffer)</text>
      <text x="340" y="150" fill="#f0883e" font-size="10">Must run to completion</text>
      <path d="M280 100 L320 100" stroke="#8b949e" stroke-width="2" stroke-dasharray="4"/>
      <rect x="20" y="180" width="560" height="80" rx="10" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="205" fill="#e6edf3" font-size="13" font-weight="bold">Fiber Linked List Tree:</text>
      <rect x="240" y="210" width="70" height="25" rx="4" fill="#1f6feb" opacity="0.3" stroke="#1f6feb"/>
      <text x="253" y="228" fill="#58a6ff" font-size="10">App</text>
      <path d="M275 235 L200 250" stroke="#58a6ff" stroke-width="1"/>
      <path d="M275 235 L350 250" stroke="#58a6ff" stroke-width="1"/>
      <text x="155" y="248" fill="#8b949e" font-size="9">child↓</text>
      <text x="315" y="248" fill="#8b949e" font-size="9">child↓</text>
      <rect x="20" y="275" width="560" height="45" rx="8" fill="#1c2333" stroke="#58a6ff"/>
      <text x="40" y="297" fill="#58a6ff" font-size="12" font-weight="bold">Priority Lanes:</text>
      <text x="40" y="312" fill="#c9d1d9" font-size="10">Sync (click) → InputContinuous (scroll) → Default → Transition → Idle</text>
      <rect x="20" y="335" width="560" height="35" rx="8" fill="#12261e" stroke="#238636"/>
      <text x="40" y="357" fill="#7ee787" font-size="11">Time Slicing: Work 5ms → Yield to browser → Resume → Keeps UI at 60fps</text>
    </svg>`,
    examples: [
      {
        title: "Fiber Node Structure (Simplified)",
        code: `// What a Fiber node looks like internally
// Each React element becomes one of these

const fiberNode = {
  // Identity
  tag: "FunctionComponent",   // or HostComponent, ClassComponent, etc
  type: "TodoList",            // component function/class or 'div'
  key: null,                   // reconciliation key

  // Tree structure (linked list, not array!)
  child: "/* first child Fiber */",
  sibling: "/* next sibling Fiber */",
  return: "/* parent Fiber */",

  // Instance
  stateNode: "/* DOM node or component instance */",

  // Props & State
  pendingProps: { todos: [] },
  memoizedProps: { todos: [] },
  memoizedState: "/* linked list of hooks */",

  // Effects
  flags: "Update | Placement | Deletion",

  // Double buffering
  alternate: "/* the other version of this Fiber */",

  // Priority
  lanes: "/* which priority lane this update belongs to */",
};

console.log("=== Fiber Node Key Fields ===");
Object.entries(fiberNode).forEach(([key, val]) => {
  console.log("  " + key + ": " + val);
});

console.log("\\n=== Why Linked List? ===");
console.log("Traditional tree: parent.children = [child1, child2, child3]");
console.log("Fiber linked list: parent.child → child1.sibling → child2.sibling → child3");
console.log("Advantage: Can stop at ANY node and resume later (incremental work)");`
      },
      {
        title: "Time Slicing Simulation",
        code: `// Simulate how Fiber's time slicing works
// Instead of processing everything at once, work in small chunks

function simulateTimeSlicing(items, chunkSize) {
  let processed = 0;
  let chunks = 0;

  console.log("Processing " + items.length + " items with time slicing...");
  console.log("Chunk size: " + chunkSize + " items (~5ms each)\\n");

  while (processed < items.length) {
    chunks++;
    const chunkEnd = Math.min(processed + chunkSize, items.length);

    // Process this chunk
    const chunkItems = [];
    for (let i = processed; i < chunkEnd; i++) {
      chunkItems.push("Item " + i);
    }

    console.log("Chunk " + chunks + ": Processed items " + processed + "-" + (chunkEnd - 1));
    console.log("  → Yield to browser (handle input, paint frame)");

    processed = chunkEnd;
  }

  console.log("\\nTotal: " + items.length + " items in " + chunks + " chunks");
  console.log("Browser stayed responsive throughout!");
  console.log("\\n=== Without Time Slicing (Stack Reconciler) ===");
  console.log("All " + items.length + " items at once → UI frozen for entire duration");
}

simulateTimeSlicing(new Array(20).fill(0), 5);`
      },
      {
        title: "startTransition — Priority-Based Rendering",
        code: `// startTransition marks updates as low-priority
// React can interrupt transition renders for urgent updates

console.log("=== startTransition Pattern ===\\n");

// Simulate: User types in search input that filters a huge list
function simulateSearchWithTransition(searchText) {
  console.log("User types: '" + searchText + "'");

  // URGENT update — update the input value immediately
  console.log("  [URGENT] Input value updated instantly: '" + searchText + "'");

  // TRANSITION update — filter the list (can be interrupted)
  console.log("  [TRANSITION] Start filtering 10,000 items...");

  // If user types another letter before filtering completes:
  console.log("  [INTERRUPTED] User typed another letter!");
  console.log("  [TRANSITION] Abort old filter, start new one");
  console.log("  [TRANSITION] Filtering with new value...");
  console.log("  [TRANSITION] Done — UI updated smoothly");
}

simulateSearchWithTransition("rea");

console.log("\\n=== Code Pattern ===");
console.log("function SearchPage() {");
console.log("  const [input, setInput] = useState('');");
console.log("  const [results, setResults] = useState([]);");
console.log("");
console.log("  function handleChange(e) {");
console.log("    setInput(e.target.value);  // URGENT — instant");
console.log("    startTransition(() => {");
console.log("      setResults(filterHugeList(e.target.value));  // can wait");
console.log("    });");
console.log("  }");
console.log("}");

console.log("\\n=== Priority Levels ===");
console.log("1. Sync       — clicks, keypresses (can't wait)");
console.log("2. Continuous  — scroll, mouse move");
console.log("3. Default     — data fetch results");
console.log("4. Transition  — startTransition updates");
console.log("5. Idle        — prefetching, analytics");`
      },
      {
        title: "Double Buffering — Current vs WorkInProgress",
        code: `// React Fiber maintains TWO trees at all times
// Like double buffering in graphics programming

function simulateDoubleBuffering() {
  // Current tree (what's on screen)
  let current = {
    type: "App",
    children: [
      { type: "Header", text: "My App" },
      { type: "Counter", count: 5 },
      { type: "Footer", text: "2024" },
    ]
  };

  console.log("=== Current Tree (on screen) ===");
  current.children.forEach(c => {
    console.log("  <" + c.type + "> " + (c.text || "count=" + c.count));
  });

  // User clicks — triggers update
  console.log("\\n--- User clicks 'increment' ---\\n");

  // Phase 1: Build workInProgress tree
  console.log("=== Phase 1: Render (build workInProgress) ===");
  let workInProgress = {
    type: "App",
    children: [
      { type: "Header", text: "My App", changed: false },
      { type: "Counter", count: 6, changed: true },
      { type: "Footer", text: "2024", changed: false },
    ]
  };

  workInProgress.children.forEach(c => {
    const status = c.changed ? "← CHANGED (marked for update)" : "(unchanged, reuse)";
    console.log("  <" + c.type + "> " + (c.text || "count=" + c.count) + " " + status);
  });

  // Phase 2: Commit
  console.log("\\n=== Phase 2: Commit ===");
  console.log("  Apply DOM mutation: Counter 5 → 6");
  console.log("  Swap trees: workInProgress becomes current");

  current = workInProgress;
  console.log("\\n=== New Current Tree ===");
  current.children.forEach(c => {
    console.log("  <" + c.type + "> " + (c.text || "count=" + c.count));
  });

  console.log("\\nOld current tree is now available for next update (recycled)");
}

simulateDoubleBuffering();`
      }
    ],
    quiz: [
      { question: "What was the main problem with React's Stack Reconciler (pre-Fiber)?", options: ["It was too slow", "It was synchronous and blocked the main thread", "It didn't support hooks", "It couldn't handle large trees"], answer: 1, explanation: "The Stack Reconciler processed the entire component tree synchronously. Once it started, it couldn't stop — blocking the main thread and causing UI freezes during large updates." },
      { question: "What is a Fiber node?", options: ["A CSS class", "A JavaScript object representing a unit of work", "A DOM element", "A Web Worker"], answer: 1, explanation: "A Fiber is a plain JavaScript object that represents a unit of work. Each React element gets its own Fiber node, forming a linked list tree structure that enables incremental rendering." },
      { question: "Which phase of Fiber's rendering can be interrupted?", options: ["The Commit phase", "The Render (Reconciliation) phase", "Both phases", "Neither phase"], answer: 1, explanation: "The Render phase (reconciliation) is interruptible — React can pause, abort, or restart it. The Commit phase must run synchronously to avoid partial DOM updates." },
      { question: "What does startTransition do?", options: ["Starts a CSS animation", "Marks a state update as non-urgent so React can interrupt it", "Transitions between routes", "Starts the commit phase"], answer: 1, explanation: "startTransition marks state updates as non-urgent (transition priority). React can interrupt transition renders to handle urgent updates (like typing) first, keeping the UI responsive." },
      { question: "What is 'double buffering' in React Fiber?", options: ["Using two useState hooks", "Maintaining current and workInProgress Fiber trees", "Rendering twice for safety", "Using two event handlers"], answer: 1, explanation: "React maintains two Fiber trees: 'current' (what's displayed) and 'workInProgress' (being built). After commit, the workInProgress becomes the new current via a pointer swap." }
    ]
  },

  // ─── HTTP CACHING ───
  {
    id: "http-caching",
    category: "Caching",
    title: "HTTP Caching",
    priority: "High",
    icon: "🌐",
    content: `## HTTP Caching — Browser & Proxy Caching

HTTP caching is the **first line of defense** against unnecessary network requests. It uses **HTTP headers** to tell browsers and proxies when they can reuse a previously fetched response.

### Why HTTP Caching Matters:
- Reduces **latency** (cached = instant, no round trip)
- Saves **bandwidth** (no data transfer for cached responses)
- Reduces **server load** (fewer requests reach your server)
- Improves **Core Web Vitals** (faster LCP, better UX)

### The Two Mechanisms:

### 1. Strong Caching (Cache-Control / Expires):
The browser stores the response and uses it directly — **no server contact at all**.

**\`Cache-Control\`** header (modern, preferred):
- \`max-age=3600\` — cache for 1 hour from response time
- \`s-maxage=86400\` — cache on shared caches (CDN) for 24 hours
- \`no-cache\` — store in cache, but ALWAYS revalidate before using
- \`no-store\` — don't cache at all (sensitive data, banking)
- \`public\` — any cache can store (CDN, proxies, browser)
- \`private\` — only the browser can cache (user-specific data)
- \`immutable\` — content never changes (hashed static assets)
- \`stale-while-revalidate=60\` — use stale for 60s while refetching

**\`Expires\`** header (legacy):
- Absolute date: \`Expires: Wed, 09 Jun 2025 10:18:14 GMT\`
- Superseded by Cache-Control (which takes priority if both present)

### 2. Conditional Caching (ETag / Last-Modified):
When strong cache expires, the browser asks the server: "Has this changed?"

**ETag (Entity Tag)** — content fingerprint:
- Server sends: \`ETag: "abc123"\`
- Browser asks: \`If-None-Match: "abc123"\`
- If unchanged: server returns \`304 Not Modified\` (no body — saves bandwidth!)
- If changed: server returns \`200 OK\` with new data + new ETag

**Last-Modified** — timestamp based:
- Server sends: \`Last-Modified: Mon, 01 Jan 2024 00:00:00 GMT\`
- Browser asks: \`If-Modified-Since: Mon, 01 Jan 2024 00:00:00 GMT\`
- Same 304 / 200 logic as ETag

### Cache Flow Decision Tree:
1. Browser needs a resource
2. Is it in cache? → No → Fetch from server
3. Is it fresh (max-age not expired)? → Yes → Use cache directly (200 from cache)
4. Is it stale? → Send conditional request with ETag/Last-Modified
5. Server says 304? → Use cached version (update freshness)
6. Server says 200? → Use new response, update cache

### Caching Strategies for Different Assets:

**Static assets (JS, CSS, images)** — hash in filename:
- \`app.a1b2c3.js\` — file changes = new hash = new URL
- \`Cache-Control: public, max-age=31536000, immutable\`
- Cache forever, cache-bust via filename change

**HTML pages**:
- \`Cache-Control: no-cache\` — always revalidate
- Or short max-age: \`max-age=300\` (5 min)

**API responses**:
- \`Cache-Control: private, max-age=60\` for user-specific data
- \`Cache-Control: public, s-maxage=300\` for shared data via CDN

**Sensitive data (banking, auth tokens)**:
- \`Cache-Control: no-store\` — never cache

### Common Pitfalls:
- \`no-cache\` does NOT mean "don't cache" — it means "always revalidate"
- \`no-store\` is what you want for truly uncacheable responses
- Forgetting \`Vary\` header for content negotiation (e.g., \`Vary: Accept-Encoding\`)
- Not using content hashing for static assets → stale JS after deploys
- Setting aggressive caching on HTML → users see old HTML pointing to new assets

### Interview Speaking Points (3 min):
1. Two mechanisms: strong caching (Cache-Control) vs conditional (ETag/Last-Modified)
2. Walk through Cache-Control directives: max-age, no-cache, no-store, public/private
3. Explain the 304 Not Modified flow with ETag
4. Strategy: immutable hashed assets, revalidate HTML, private for user data
5. Common pitfall: no-cache vs no-store confusion
6. Mention stale-while-revalidate header for progressive enhancement`,
    diagram: `<svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" style="width:100%">
      <text x="160" y="25" fill="#e6edf3" font-size="15" font-weight="bold">HTTP Caching — Request Flow</text>
      <rect x="30" y="45" width="100" height="40" rx="6" fill="#1f6feb" opacity="0.3" stroke="#1f6feb"/>
      <text x="45" y="70" fill="#58a6ff" font-size="12" font-weight="bold">Browser</text>
      <path d="M130 65 L175 65" stroke="#8b949e" stroke-width="1.5"/>
      <text x="133" y="58" fill="#8b949e" font-size="9">check cache</text>
      <rect x="175" y="45" width="120" height="40" rx="6" fill="#f0883e" opacity="0.2" stroke="#f0883e"/>
      <text x="190" y="70" fill="#f0883e" font-size="12" font-weight="bold">Cache Fresh?</text>
      <path d="M235 85 L235 110" stroke="#7ee787" stroke-width="1.5"/>
      <text x="245" y="100" fill="#7ee787" font-size="10">YES</text>
      <rect x="180" y="110" width="110" height="30" rx="6" fill="#238636" opacity="0.2" stroke="#238636"/>
      <text x="188" y="130" fill="#7ee787" font-size="10">200 (from cache)</text>
      <path d="M295 65 L370 65" stroke="#f85149" stroke-width="1.5"/>
      <text x="315" y="58" fill="#f85149" font-size="10">NO (stale)</text>
      <rect x="370" y="45" width="120" height="40" rx="6" fill="#d2a8ff" opacity="0.2" stroke="#d2a8ff"/>
      <text x="378" y="63" fill="#d2a8ff" font-size="10">Conditional Req</text>
      <text x="378" y="78" fill="#d2a8ff" font-size="9">If-None-Match: ETag</text>
      <path d="M430 85 L430 115" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="4"/>
      <rect x="370" y="115" width="120" height="30" rx="6" fill="#1c2333" stroke="#30363d"/>
      <text x="398" y="135" fill="#c9d1d9" font-size="10">Server</text>
      <path d="M370 145 L340 175" stroke="#7ee787" stroke-width="1.5"/>
      <text x="310" y="170" fill="#7ee787" font-size="9">unchanged</text>
      <rect x="260" y="175" width="100" height="25" rx="4" fill="#238636" opacity="0.2" stroke="#238636"/>
      <text x="268" y="193" fill="#7ee787" font-size="10">304 No Body</text>
      <path d="M490 145 L510 175" stroke="#58a6ff" stroke-width="1.5"/>
      <text x="500" y="170" fill="#58a6ff" font-size="9">changed</text>
      <rect x="470" y="175" width="110" height="25" rx="4" fill="#1f6feb" opacity="0.2" stroke="#1f6feb"/>
      <text x="478" y="193" fill="#58a6ff" font-size="10">200 + New Data</text>
      <rect x="30" y="220" width="540" height="55" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="50" y="242" fill="#e6edf3" font-size="12" font-weight="bold">Cache-Control Directives:</text>
      <text x="50" y="262" fill="#c9d1d9" font-size="10">max-age=N | no-cache (revalidate) | no-store (never cache) | public | private | immutable</text>
      <rect x="30" y="290" width="540" height="50" rx="8" fill="#1c2333" stroke="#58a6ff"/>
      <text x="50" y="310" fill="#58a6ff" font-size="12" font-weight="bold">Strategy:</text>
      <text x="50" y="328" fill="#c9d1d9" font-size="10">Hashed assets → immutable, 1yr | HTML → no-cache | API → private, short TTL | Secrets → no-store</text>
    </svg>`,
    examples: [
      {
        title: "Cache-Control Directives Explained",
        code: `// All Cache-Control directives and when to use them

const directives = {
  "max-age=3600": {
    meaning: "Cache for 1 hour, no server contact needed",
    use: "API responses, moderate freshness needs"
  },
  "s-maxage=86400": {
    meaning: "CDN/proxy can cache for 24 hours",
    use: "Public content served via CDN"
  },
  "no-cache": {
    meaning: "STORE in cache, but ALWAYS revalidate with server first",
    use: "HTML pages — always get fresh, but save bandwidth with 304"
  },
  "no-store": {
    meaning: "NEVER store in cache. Not disk, not memory, nowhere",
    use: "Banking, auth tokens, sensitive data"
  },
  "public": {
    meaning: "Any cache can store (browser, CDN, proxy)",
    use: "Static assets, shared content"
  },
  "private": {
    meaning: "Only browser cache, NOT CDN/proxies",
    use: "User-specific data (profile, cart)"
  },
  "immutable": {
    meaning: "Content will NEVER change at this URL",
    use: "Hashed static files: app.a1b2c3.js"
  },
  "stale-while-revalidate=60": {
    meaning: "OK to use stale for 60s while refetching in background",
    use: "Good UX — instant load + freshness"
  }
};

console.log("=== Cache-Control Directives ===\\n");
Object.entries(directives).forEach(([dir, info]) => {
  console.log(dir);
  console.log("  What: " + info.meaning);
  console.log("  When: " + info.use);
  console.log("");
});

console.log("⚠️  COMMON MISTAKE:");
console.log("no-cache ≠ 'don't cache'");
console.log("no-cache = 'cache it, but check with server every time'");
console.log("no-store = 'truly never cache'");`
      },
      {
        title: "ETag / 304 Not Modified Flow",
        code: `// Simulate ETag-based conditional caching

function simulateETAGFlow() {
  // Server has a resource
  let serverData = { users: ["Alice", "Bob"] };
  let serverETag = '"v1-abc123"';  // content hash

  // FIRST REQUEST — no cache
  console.log("=== Request 1: No Cache ===");
  console.log("Browser: GET /api/users");
  console.log("Server response:");
  console.log("  Status: 200 OK");
  console.log("  ETag: " + serverETag);
  console.log("  Body: " + JSON.stringify(serverData));
  console.log("  → Browser stores in cache with ETag\\n");

  // SECOND REQUEST — cache is stale, revalidate
  console.log("=== Request 2: Cache Stale, Revalidate ===");
  console.log("Browser: GET /api/users");
  console.log("  If-None-Match: " + serverETag);
  // Server checks: has data changed?
  let dataChanged = false;
  if (!dataChanged) {
    console.log("Server: Data unchanged!");
    console.log("  Status: 304 Not Modified");
    console.log("  Body: (empty — saves bandwidth!)");
    console.log("  → Browser uses cached version\\n");
  }

  // THIRD REQUEST — data has changed
  console.log("=== Request 3: Data Changed ===");
  serverData = { users: ["Alice", "Bob", "Charlie"] };
  serverETag = '"v2-def456"';
  console.log("Browser: GET /api/users");
  console.log("  If-None-Match: " + '"v1-abc123"');
  console.log("Server: Data changed! New ETag: " + serverETag);
  console.log("  Status: 200 OK");
  console.log("  ETag: " + serverETag);
  console.log("  Body: " + JSON.stringify(serverData));
  console.log("  → Browser updates cache");
}

simulateETAGFlow();`
      },
      {
        title: "Caching Strategy by Asset Type",
        code: `// Real-world caching strategies for different asset types

const strategies = [
  {
    type: "Static JS/CSS (hashed filenames)",
    example: "app.a1b2c3.js, styles.d4e5f6.css",
    header: "Cache-Control: public, max-age=31536000, immutable",
    why: "Hash changes when content changes → new URL → cache forever"
  },
  {
    type: "HTML Pages",
    example: "index.html",
    header: "Cache-Control: no-cache",
    why: "Always check for new version (HTML refs hashed JS/CSS)"
  },
  {
    type: "Images (with CDN)",
    example: "hero.webp, logo.svg",
    header: "Cache-Control: public, max-age=86400, s-maxage=604800",
    why: "Browser: 1 day, CDN: 1 week. CDN can purge on deploy"
  },
  {
    type: "API — Public Data",
    example: "GET /api/products",
    header: "Cache-Control: public, s-maxage=300, stale-while-revalidate=60",
    why: "CDN caches 5 min, allow stale for 60s during refetch"
  },
  {
    type: "API — User-Specific",
    example: "GET /api/profile",
    header: "Cache-Control: private, max-age=60",
    why: "Only browser caches (not CDN), short TTL"
  },
  {
    type: "Sensitive Data",
    example: "GET /api/bank/balance",
    header: "Cache-Control: no-store",
    why: "NEVER cache — not in browser, not on disk, nowhere"
  }
];

console.log("=== Caching Strategy by Asset Type ===\\n");
strategies.forEach(s => {
  console.log("📦 " + s.type);
  console.log("   Example: " + s.example);
  console.log("   Header:  " + s.header);
  console.log("   Why:     " + s.why);
  console.log("");
});`
      }
    ],
    quiz: [
      { question: "What does 'Cache-Control: no-cache' actually mean?", options: ["Don't cache the response at all", "Cache it, but always revalidate with the server before using", "Cache for 0 seconds", "Only cache in memory"], answer: 1, explanation: "'no-cache' means the browser CAN store the response, but MUST revalidate with the server (via ETag/Last-Modified) before using it. 'no-store' is what truly prevents caching." },
      { question: "What HTTP status code means 'Not Modified — use your cached version'?", options: ["200", "301", "304", "404"], answer: 2, explanation: "304 Not Modified is returned when the server confirms the cached resource hasn't changed. The response has no body — saving bandwidth. The browser uses its cached version." },
      { question: "What's the best caching strategy for app.a1b2c3.js (hashed filename)?", options: ["Cache-Control: no-store", "Cache-Control: no-cache", "Cache-Control: public, max-age=31536000, immutable", "Cache-Control: private, max-age=60"], answer: 2, explanation: "Hashed filenames change when content changes (new hash = new URL). So you can safely cache forever (1 year) with 'immutable'. Old URLs are never requested after deploy." },
      { question: "What's the difference between ETag and Last-Modified?", options: ["ETag is faster", "ETag uses content hash, Last-Modified uses timestamp", "They are the same thing", "Last-Modified is more accurate"], answer: 1, explanation: "ETag is a content fingerprint (hash) — changes when content changes. Last-Modified is a timestamp — less precise (1-second resolution) and can be wrong if file is touched without changing." },
      { question: "Why should HTML pages use 'no-cache' instead of long max-age?", options: ["HTML files are too large to cache", "HTML references hashed JS/CSS — stale HTML would point to old assets", "Browsers can't cache HTML", "HTML changes every second"], answer: 1, explanation: "HTML pages reference hashed JS/CSS files. If HTML is cached with a long max-age, after a deploy the user sees old HTML pointing to old (possibly deleted) asset URLs. Always revalidate HTML." }
    ]
  },

  // ─── DATABASE CACHING ───
  {
    id: "database-caching",
    category: "Caching",
    title: "Database Caching",
    priority: "High",
    icon: "🗄️",
    content: `## Database Caching — Reducing Query Load

Database caching stores **frequently accessed query results** in a faster storage layer, reducing the load on your database and dramatically improving response times.

### Why Database Caching?
- Database queries are **expensive** (disk I/O, network, CPU for joins)
- Many queries return the **same results** (product catalog, user profiles)
- Database connections are **limited** (connection pool exhaustion under load)
- Caching can reduce response times from **100ms+ to <1ms**

### Caching Layers (closest to farthest from DB):

### 1. Database Query Cache (Built-in):
- MySQL/MariaDB have a built-in query cache
- Caches exact query text → result mapping
- Invalidated on ANY write to the table (even unrelated rows)
- PostgreSQL relies on OS page cache instead
- Useful but limited — any write flushes the cache

### 2. Application-Level Cache:
Cache at the application layer using in-memory stores:

**Redis** (most popular):
- In-memory key-value store with persistence options
- Supports TTL, pub/sub, data structures (lists, sets, sorted sets)
- Single-threaded (no race conditions)
- Typical latency: <1ms

**Memcached**:
- Pure in-memory cache (no persistence)
- Simpler than Redis, multi-threaded
- Good for simple key-value caching

### 3. ORM/Query Builder Cache:
- Prisma, Sequelize, TypeORM can cache query results
- Transparent to application code
- Often backed by Redis

### Caching Patterns:

### Cache-Aside (Lazy Loading) — Most Common:
1. Application checks cache first
2. Cache HIT → return cached data
3. Cache MISS → query database → store in cache → return
- Pros: Only caches what's actually requested, cache failure = degrade to DB
- Cons: First request always slow (cache miss), potential stale data

### Write-Through:
1. Application writes to cache AND database simultaneously
2. Read always hits cache (always fresh)
- Pros: Cache is always up-to-date
- Cons: Write latency (two writes), cache may store rarely-read data

### Write-Behind (Write-Back):
1. Application writes to cache only
2. Cache asynchronously writes to database later
- Pros: Very fast writes
- Cons: Risk of data loss if cache crashes before DB write

### Read-Through:
1. Application only talks to cache
2. Cache handles DB queries on miss automatically
- Pros: Simple application code
- Cons: Cache library must understand DB queries

### Cache Invalidation Strategies:
- **TTL (Time-to-Live)**: Auto-expire after N seconds. Simple, eventual consistency.
- **Event-based**: Invalidate on write/update events. More complex, stronger consistency.
- **Version-based**: Increment version number on write. Old versions auto-invalidate.
- **Tag-based**: Group related cache entries, invalidate by tag.

### What to Cache vs What NOT to Cache:

**Good candidates**:
- Frequently read, rarely changed data (product catalog, configuration)
- Expensive computed results (aggregations, reports, leaderboards)
- Session data
- User profiles and permissions

**Bad candidates**:
- Rapidly changing data (real-time stock prices)
- Write-heavy data (logging, analytics events)
- Very large datasets that exceed cache memory
- Data requiring strict consistency (financial transactions)

### Cache Stampede Problem:
When a popular cache entry expires, many requests simultaneously hit the DB:
- **Mutex lock**: Only one request fetches, others wait
- **Stale-while-revalidate**: Serve stale, refresh in background
- **Early expiration**: Refresh before actual expiry (jitter)

### Interview Speaking Points (3 min):
1. Explain why: DB queries expensive, many are repetitive, caching gives <1ms
2. Describe Cache-Aside pattern with step-by-step flow
3. Compare Write-Through vs Write-Behind tradeoffs
4. Discuss invalidation: TTL (simple) vs event-based (consistent)
5. Mention Redis as the go-to solution and its key features
6. Bring up cache stampede and solutions (mutex, stale-while-revalidate)
7. Know what to cache (reads >> writes) vs what not to (rapidly changing data)`,
    diagram: `<svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" style="width:100%">
      <text x="160" y="25" fill="#e6edf3" font-size="15" font-weight="bold">Cache-Aside (Lazy Loading) Pattern</text>
      <rect x="30" y="50" width="100" height="45" rx="8" fill="#1f6feb" opacity="0.3" stroke="#1f6feb"/>
      <text x="43" y="78" fill="#58a6ff" font-size="12" font-weight="bold">Application</text>
      <path d="M130 72 L180 55" stroke="#7ee787" stroke-width="1.5"/>
      <text x="135" y="55" fill="#7ee787" font-size="9">1. Check cache</text>
      <rect x="180" y="40" width="130" height="35" rx="6" fill="#f0883e" opacity="0.2" stroke="#f0883e"/>
      <text x="200" y="63" fill="#f0883e" font-size="12" font-weight="bold">Redis Cache</text>
      <path d="M245 75 L245 100" stroke="#7ee787" stroke-width="1.5"/>
      <text x="255" y="92" fill="#7ee787" font-size="10">HIT? ✅</text>
      <rect x="195" y="100" width="100" height="25" rx="4" fill="#238636" opacity="0.2" stroke="#238636"/>
      <text x="203" y="118" fill="#7ee787" font-size="10">Return cached</text>
      <path d="M130 80 L180 120" stroke="#f85149" stroke-width="1.5" stroke-dasharray="4"/>
      <text x="105" y="105" fill="#f85149" font-size="9">MISS ❌</text>
      <path d="M80 95 L80 155" stroke="#58a6ff" stroke-width="1.5" stroke-dasharray="4"/>
      <text x="10" y="130" fill="#58a6ff" font-size="9">2. Query DB</text>
      <rect x="30" y="155" width="100" height="40" rx="6" fill="#d2a8ff" opacity="0.2" stroke="#d2a8ff"/>
      <text x="42" y="180" fill="#d2a8ff" font-size="12" font-weight="bold">Database</text>
      <path d="M130 170 L180 150" stroke="#d2a8ff" stroke-width="1.5"/>
      <text x="135" y="148" fill="#d2a8ff" font-size="9">3. Store in cache</text>
      <rect x="30" y="215" width="540" height="50" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="50" y="237" fill="#e6edf3" font-size="12" font-weight="bold">Caching Patterns:</text>
      <text x="50" y="255" fill="#c9d1d9" font-size="10">Cache-Aside (lazy) | Write-Through (sync) | Write-Behind (async) | Read-Through (auto)</text>
      <rect x="30" y="280" width="540" height="45" rx="8" fill="#1c2333" stroke="#58a6ff"/>
      <text x="50" y="300" fill="#58a6ff" font-size="12" font-weight="bold">Invalidation:</text>
      <text x="50" y="316" fill="#c9d1d9" font-size="10">TTL (time-based) | Event-based (on write) | Version-based | Tag-based</text>
    </svg>`,
    examples: [
      {
        title: "Cache-Aside Pattern Implementation",
        code: `// Cache-Aside (Lazy Loading) — the most common pattern

class CacheAside {
  constructor(ttl = 60000) {
    this.cache = new Map();
    this.ttl = ttl;
    this.stats = { hits: 0, misses: 0 };
  }

  // Simulate Redis GET
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  // Simulate Redis SET with TTL
  set(key, value) {
    this.cache.set(key, { value, expiry: Date.now() + this.ttl });
  }

  // The Cache-Aside pattern
  async getUser(userId) {
    const cacheKey = "user:" + userId;

    // Step 1: Check cache
    const cached = this.get(cacheKey);
    if (cached) {
      this.stats.hits++;
      console.log("  CACHE HIT for " + cacheKey);
      return cached;
    }

    // Step 2: Cache miss → query database
    this.stats.misses++;
    console.log("  CACHE MISS for " + cacheKey + " → querying DB...");
    const user = this.queryDatabase(userId);

    // Step 3: Store in cache for next time
    this.set(cacheKey, user);
    console.log("  Stored in cache (TTL: " + this.ttl + "ms)");

    return user;
  }

  // Simulate database query
  queryDatabase(userId) {
    const users = {
      1: { id: 1, name: "Kumar", role: "admin" },
      2: { id: 2, name: "Priya", role: "user" },
      3: { id: 3, name: "Raj", role: "user" },
    };
    return users[userId] || null;
  }
}

const cache = new CacheAside(5000);

console.log("=== Cache-Aside Pattern Demo ===\\n");

// First requests — all misses
console.log("--- First Access ---");
cache.getUser(1);
cache.getUser(2);
cache.getUser(1);

// Second requests — cache hits
console.log("\\n--- Second Access ---");
cache.getUser(1);
cache.getUser(2);
cache.getUser(1);

console.log("\\nStats:", JSON.stringify(cache.stats));
console.log("Hit rate: " + Math.round(cache.stats.hits / (cache.stats.hits + cache.stats.misses) * 100) + "%");`
      },
      {
        title: "Write-Through vs Write-Behind",
        code: `// Comparing Write-Through and Write-Behind patterns

console.log("=== Write-Through Pattern ===");
console.log("Write to BOTH cache and DB simultaneously\\n");

function writeThrough(cache, db, key, value) {
  console.log("1. Writing to cache: " + key + " = " + JSON.stringify(value));
  cache[key] = value;

  console.log("2. Writing to DB: " + key + " = " + JSON.stringify(value));
  db[key] = value;

  console.log("   Both updated ✅ (slower write, always consistent)\\n");
}

let wtCache = {}, wtDB = {};
writeThrough(wtCache, wtDB, "user:1", { name: "Kumar", age: 30 });
console.log("Cache:", JSON.stringify(wtCache));
console.log("DB:", JSON.stringify(wtDB));

console.log("\\n=== Write-Behind (Write-Back) Pattern ===");
console.log("Write to cache ONLY, async flush to DB later\\n");

let wbCache = {}, wbDB = {};
const writeQueue = [];

function writeBehind(cache, key, value) {
  console.log("1. Writing to cache ONLY: " + key);
  cache[key] = value;
  writeQueue.push({ key, value });
  console.log("   Queued for async DB write ⚡ (very fast!)");
}

function flushToDb(db) {
  console.log("\\n--- Async Flush ---");
  while (writeQueue.length > 0) {
    const { key, value } = writeQueue.shift();
    db[key] = value;
    console.log("   Flushed to DB: " + key);
  }
  console.log("   All caught up ✅");
}

writeBehind(wbCache, "user:1", { name: "Kumar" });
writeBehind(wbCache, "user:2", { name: "Priya" });
console.log("\\nCache:", JSON.stringify(wbCache));
console.log("DB:", JSON.stringify(wbDB), "(empty — not flushed yet!)");

flushToDb(wbDB);
console.log("DB:", JSON.stringify(wbDB), "(now synced)");

console.log("\\n=== Tradeoff Summary ===");
console.log("Write-Through: Consistent but slower writes (2 writes)");
console.log("Write-Behind:  Fast writes but risk data loss if cache crashes");`
      },
      {
        title: "Cache Stampede Protection",
        code: `// Cache Stampede: when a popular cache entry expires,
// hundreds of requests simultaneously hit the database

class StampedeProtectedCache {
  constructor() {
    this.cache = new Map();
    this.locks = new Map();
  }

  // Without protection — STAMPEDE!
  getWithoutProtection(key, fetchFn) {
    const cached = this.cache.get(key);
    if (cached) return cached;

    // 100 concurrent requests all see cache miss
    // All 100 hit the database simultaneously!
    console.log("  ⚠️ DB query fired (no protection)");
    return fetchFn();
  }

  // With mutex lock — only ONE request hits DB
  getWithMutex(key, fetchFn) {
    const cached = this.cache.get(key);
    if (cached) return cached;

    // Check if someone else is already fetching
    if (this.locks.has(key)) {
      console.log("  🔒 Waiting for lock on: " + key);
      return "waiting..."; // In real code, await the lock's promise
    }

    // Acquire lock
    this.locks.set(key, true);
    console.log("  🔑 Acquired lock, querying DB for: " + key);
    const result = fetchFn();
    this.cache.set(key, result);
    this.locks.delete(key);
    return result;
  }
}

const cache = new StampedeProtectedCache();
const fetchProduct = () => ({ id: 1, name: "Widget", price: 29.99 });

console.log("=== WITHOUT Protection (Stampede) ===");
console.log("Popular cache entry expires, 5 requests arrive:");
for (let i = 0; i < 5; i++) {
  cache.getWithoutProtection("product:1", fetchProduct);
}
console.log("Result: 5 DB queries! 💥\\n");

console.log("=== WITH Mutex Protection ===");
console.log("Same scenario, but with lock:");
const cache2 = new StampedeProtectedCache();
for (let i = 0; i < 5; i++) {
  cache2.getWithMutex("product:1", fetchProduct);
}
console.log("Result: Only 1 DB query, others waited 🛡️");

console.log("\\n=== Other Solutions ===");
console.log("1. Mutex lock (shown above)");
console.log("2. Stale-while-revalidate: serve stale, refresh in bg");
console.log("3. Early refresh: renew cache before it expires");
console.log("4. Probabilistic early expiry: random jitter on TTL");`
      }
    ],
    quiz: [
      { question: "What is the Cache-Aside (Lazy Loading) pattern?", options: ["Write to cache and DB at the same time", "Cache auto-loads from DB", "App checks cache first, on miss queries DB and stores result", "DB pushes to cache on every write"], answer: 2, explanation: "Cache-Aside: the application checks cache first. On a cache miss, it queries the database, stores the result in cache, and returns it. Only requested data gets cached." },
      { question: "What is a cache stampede?", options: ["Cache growing too large", "Many requests hitting DB simultaneously when a popular cache entry expires", "Cache entries being deleted too fast", "Writing to cache too often"], answer: 1, explanation: "A cache stampede occurs when a popular cache entry expires and many concurrent requests see the miss simultaneously, all querying the database at once — potentially overwhelming it." },
      { question: "What's the main risk of Write-Behind caching?", options: ["Slow reads", "Data loss if cache crashes before flushing to DB", "Too much memory usage", "Complex invalidation"], answer: 1, explanation: "Write-Behind writes to cache only and asynchronously flushes to the database later. If the cache crashes before flushing, those writes are lost. This tradeoff gives faster writes but less durability." },
      { question: "Which data is a POOR candidate for database caching?", options: ["Product catalog (reads >> writes)", "User sessions", "Real-time stock prices (rapidly changing)", "Configuration settings"], answer: 2, explanation: "Real-time stock prices change every millisecond. Caching them would serve stale data almost immediately, and constant invalidation would negate the caching benefit." },
      { question: "Why is Redis the most popular choice for database caching?", options: ["It's a relational database", "In-memory speed (<1ms), TTL support, rich data structures, optional persistence", "It's free", "It replaces the database entirely"], answer: 1, explanation: "Redis stores data in memory for sub-millisecond latency, supports TTL for automatic expiry, offers rich data structures (lists, sets, hashes), and can optionally persist data to disk." }
    ]
  },

  // ─── SERVER-SIDE CACHING ───
  {
    id: "server-side-caching",
    category: "Caching",
    title: "Server-Side Caching",
    priority: "High",
    icon: "🖥️",
    content: `## Server-Side Caching — Application Layer Performance

Server-side caching stores computed results, rendered pages, or processed data **in the server's memory or an external cache store** to avoid redundant computation and database queries.

### Why Server-Side Caching?

Without caching, every request to your server:
1. Hits your application code
2. Queries the database (possibly multiple joins)
3. Processes/transforms the data
4. Serializes to JSON
5. Sends the response

With caching, repeated requests for the same data skip steps 2-4 entirely.

### Types of Server-Side Caching:

### 1. In-Memory Caching (Process Memory):
Store data directly in your Node.js/Python/Java process memory.
- **Fastest** — no network call, no serialization
- **Per-process** — not shared between instances
- **Lost on restart** — no persistence
- **Memory limit** — bounded by server RAM
- Tools: Simple Map/Object, node-cache, lru-cache

### 2. Distributed Cache (Redis / Memcached):
External cache shared across all server instances.
- **Shared state** — all servers see the same cache
- **Survives restarts** (Redis has persistence)
- **Network hop** — slightly slower than in-memory (~1ms)
- **Scalable** — can cluster/shard for more capacity
- Tools: Redis, Memcached, AWS ElastiCache

### 3. Full-Page / Response Caching:
Cache the entire HTTP response for a given URL.
- Perfect for pages that don't change per-user
- Frameworks: Next.js ISR, Nginx proxy_cache, Varnish
- Invalidate on content change

### 4. Fragment Caching:
Cache parts of a page/response separately.
- Header, sidebar, footer cached separately
- Dynamic parts rendered fresh
- Used in Rails, Django, Next.js RSC

### 5. Computed/Aggregation Caching:
Cache expensive computations:
- Dashboard metrics, analytics summaries
- Search results, recommendation lists
- Leaderboards, trending feeds

### Caching Architecture Patterns:

### Multi-Layer Cache:
\`Request → In-Memory → Redis → Database\`
- Each layer is a fallback for the previous
- In-memory: <0.1ms (L1 cache)
- Redis: ~1ms (L2 cache)
- Database: ~10-100ms (source of truth)

### Session Caching:
- Store session data in Redis instead of database
- Every authenticated request needs session lookup
- Redis: <1ms vs Database: ~10ms per request
- Use \`express-session\` + \`connect-redis\`

### Rate Limiting with Cache:
- Track request counts per IP/user in Redis
- \`INCR\` command atomically increments counter
- \`EXPIRE\` command sets TTL for the window
- Efficient: one Redis call per request

### Cache Warming:
Pre-populate cache before traffic hits:
- On deploy: fetch and cache popular data
- On schedule: cron job refreshes cache
- Prevents cold-start cache misses

### Monitoring & Metrics:
- **Hit rate**: % of requests served from cache (target: >90%)
- **Miss rate**: % requiring DB query
- **Eviction rate**: cache entries removed due to memory pressure
- **Latency**: cache response time (should be <5ms)

### Interview Speaking Points (3 min):
1. Explain the multi-layer caching hierarchy: in-memory → Redis → DB
2. Compare in-memory (fast, per-process) vs distributed (shared, network hop)
3. Describe session caching with Redis — why every auth'd request benefits
4. Show a practical caching implementation with TTL and invalidation
5. Discuss cache warming for preventing cold-start performance issues
6. Mention monitoring: hit rate (>90%), eviction rate, latency
7. Real-world: Express middleware that caches API responses`,
    diagram: `<svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" style="width:100%">
      <text x="150" y="25" fill="#e6edf3" font-size="15" font-weight="bold">Multi-Layer Server-Side Cache</text>
      <rect x="30" y="45" width="100" height="40" rx="6" fill="#f0883e" opacity="0.2" stroke="#f0883e"/>
      <text x="48" y="70" fill="#f0883e" font-size="11" font-weight="bold">Request</text>
      <path d="M130 65 L165 65" stroke="#7ee787" stroke-width="1.5"/>
      <rect x="165" y="45" width="120" height="40" rx="6" fill="#238636" opacity="0.2" stroke="#238636"/>
      <text x="176" y="63" fill="#7ee787" font-size="10" font-weight="bold">L1: In-Memory</text>
      <text x="176" y="78" fill="#7ee787" font-size="9">&lt;0.1ms</text>
      <path d="M285 65 L310 65" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="3"/>
      <text x="288" y="57" fill="#f85149" font-size="8">MISS</text>
      <rect x="310" y="45" width="110" height="40" rx="6" fill="#1f6feb" opacity="0.2" stroke="#1f6feb"/>
      <text x="328" y="63" fill="#58a6ff" font-size="10" font-weight="bold">L2: Redis</text>
      <text x="328" y="78" fill="#58a6ff" font-size="9">~1ms</text>
      <path d="M420 65 L445 65" stroke="#8b949e" stroke-width="1.5" stroke-dasharray="3"/>
      <text x="423" y="57" fill="#f85149" font-size="8">MISS</text>
      <rect x="445" y="45" width="120" height="40" rx="6" fill="#d2a8ff" opacity="0.2" stroke="#d2a8ff"/>
      <text x="460" y="63" fill="#d2a8ff" font-size="10" font-weight="bold">L3: Database</text>
      <text x="460" y="78" fill="#d2a8ff" font-size="9">10-100ms</text>
      <rect x="30" y="105" width="535" height="85" rx="10" fill="#161b22" stroke="#30363d"/>
      <text x="50" y="130" fill="#e6edf3" font-size="13" font-weight="bold">Common Server-Side Cache Uses:</text>
      <rect x="50" y="140" width="100" height="25" rx="4" fill="#1f6feb" opacity="0.15" stroke="#1f6feb"/>
      <text x="58" y="158" fill="#58a6ff" font-size="10">Sessions</text>
      <rect x="165" y="140" width="100" height="25" rx="4" fill="#238636" opacity="0.15" stroke="#238636"/>
      <text x="173" y="158" fill="#7ee787" font-size="10">API Results</text>
      <rect x="280" y="140" width="110" height="25" rx="4" fill="#f0883e" opacity="0.15" stroke="#f0883e"/>
      <text x="288" y="158" fill="#f0883e" font-size="10">Full Pages</text>
      <rect x="405" y="140" width="130" height="25" rx="4" fill="#d2a8ff" opacity="0.15" stroke="#d2a8ff"/>
      <text x="413" y="158" fill="#d2a8ff" font-size="10">Aggregations</text>
      <text x="50" y="180" fill="#8b949e" font-size="10">Target hit rate: >90% | Evictions: monitor for memory pressure</text>
      <rect x="30" y="210" width="535" height="90" rx="10" fill="#1c2333" stroke="#58a6ff"/>
      <text x="50" y="235" fill="#58a6ff" font-size="13" font-weight="bold">Cache Invalidation Approaches:</text>
      <text x="50" y="255" fill="#c9d1d9" font-size="11">TTL-based: auto-expire after N seconds (simple, eventual consistency)</text>
      <text x="50" y="275" fill="#c9d1d9" font-size="11">Event-based: invalidate on write (complex, strong consistency)</text>
      <text x="50" y="295" fill="#c9d1d9" font-size="11">Cache warming: pre-populate on deploy or schedule (prevents cold start)</text>
    </svg>`,
    examples: [
      {
        title: "Multi-Layer Cache Implementation",
        code: `// Multi-layer cache: In-Memory (L1) → Redis-like (L2) → Database (L3)

class MultiLayerCache {
  constructor() {
    this.l1 = new Map();  // In-memory (fastest)
    this.l2 = new Map();  // Simulated Redis (shared)
    this.db = new Map();  // Simulated Database (slowest)
    this.stats = { l1Hits: 0, l2Hits: 0, dbHits: 0 };
  }

  seedDB(key, value) {
    this.db.set(key, value);
  }

  get(key) {
    // L1: In-memory check (~0.1ms)
    if (this.l1.has(key)) {
      this.stats.l1Hits++;
      console.log("  L1 HIT (in-memory) ⚡");
      return this.l1.get(key);
    }

    // L2: Redis check (~1ms)
    if (this.l2.has(key)) {
      this.stats.l2Hits++;
      console.log("  L2 HIT (Redis) 🔵");
      // Promote to L1
      this.l1.set(key, this.l2.get(key));
      return this.l2.get(key);
    }

    // L3: Database query (~50ms)
    if (this.db.has(key)) {
      this.stats.dbHits++;
      console.log("  L3 HIT (Database) 🐢");
      const value = this.db.get(key);
      // Populate both caches
      this.l2.set(key, value);
      this.l1.set(key, value);
      return value;
    }

    console.log("  NOT FOUND anywhere");
    return null;
  }

  printStats() {
    const total = this.stats.l1Hits + this.stats.l2Hits + this.stats.dbHits;
    console.log("\\n=== Cache Stats ===");
    console.log("L1 (memory) hits: " + this.stats.l1Hits);
    console.log("L2 (Redis) hits:  " + this.stats.l2Hits);
    console.log("L3 (DB) hits:     " + this.stats.dbHits);
    console.log("Overall hit rate: " + (total > 0 ? Math.round((this.stats.l1Hits + this.stats.l2Hits) / total * 100) : 0) + "%");
  }
}

const cache = new MultiLayerCache();
cache.seedDB("user:1", { name: "Kumar", role: "admin" });
cache.seedDB("user:2", { name: "Priya", role: "dev" });

console.log("=== Request 1: user:1 (cold) ===");
cache.get("user:1");

console.log("\\n=== Request 2: user:1 (warm — L1) ===");
cache.get("user:1");

console.log("\\n=== Request 3: user:2 (cold) ===");
cache.get("user:2");

console.log("\\n=== Request 4: user:1 (still L1) ===");
cache.get("user:1");

console.log("\\n=== Request 5: user:2 (L1 now) ===");
cache.get("user:2");

cache.printStats();`
      },
      {
        title: "Express-Style Cache Middleware",
        code: `// Simulating an Express caching middleware pattern

class ResponseCache {
  constructor(ttl = 30000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry;
  }

  set(key, data, statusCode) {
    this.cache.set(key, {
      data,
      statusCode,
      expiry: Date.now() + this.ttl,
      cachedAt: new Date().toISOString()
    });
  }
}

const responseCache = new ResponseCache(30000);

// Simulate Express middleware
function cacheMiddleware(req, handler) {
  const cacheKey = req.method + ":" + req.url;

  // Check cache
  const cached = responseCache.get(cacheKey);
  if (cached) {
    console.log("  📦 CACHE HIT: " + cacheKey);
    console.log("  Response: " + JSON.stringify(cached.data));
    console.log("  Cached at: " + cached.cachedAt);
    return;
  }

  // Cache miss — call handler
  console.log("  🔍 CACHE MISS: " + cacheKey + " → calling handler");
  const response = handler(req);
  responseCache.set(cacheKey, response, 200);
  console.log("  Response: " + JSON.stringify(response));
  console.log("  Stored in cache (TTL: 30s)");
}

// API handlers
const handlers = {
  "/api/products": () => [
    { id: 1, name: "Widget", price: 29.99 },
    { id: 2, name: "Gadget", price: 49.99 },
  ],
  "/api/stats": () => ({
    totalUsers: 15000,
    activeToday: 3200,
    revenue: "$45,000"
  })
};

console.log("=== Request 1: GET /api/products ===");
cacheMiddleware({ method: "GET", url: "/api/products" }, handlers["/api/products"]);

console.log("\\n=== Request 2: GET /api/products (cached) ===");
cacheMiddleware({ method: "GET", url: "/api/products" }, handlers["/api/products"]);

console.log("\\n=== Request 3: GET /api/stats ===");
cacheMiddleware({ method: "GET", url: "/api/stats" }, handlers["/api/stats"]);

console.log("\\n=== Request 4: GET /api/stats (cached) ===");
cacheMiddleware({ method: "GET", url: "/api/stats" }, handlers["/api/stats"]);`
      },
      {
        title: "LRU Cache (Least Recently Used)",
        code: `// LRU Cache — evicts least recently used entries when full
// Used by servers to bound memory usage

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Map preserves insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first entry in Map)
      const lruKey = this.cache.keys().next().value;
      console.log("  🗑️ Evicting LRU entry: " + lruKey);
      this.cache.delete(lruKey);
    }
    this.cache.set(key, value);
  }

  display() {
    const entries = [];
    this.cache.forEach((v, k) => entries.push(k + "=" + v));
    console.log("  Cache [" + entries.join(", ") + "] (capacity: " + this.capacity + ")");
  }
}

const lru = new LRUCache(3);

console.log("=== LRU Cache (capacity: 3) ===\\n");

lru.put("A", 1); console.log("PUT A=1"); lru.display();
lru.put("B", 2); console.log("PUT B=2"); lru.display();
lru.put("C", 3); console.log("PUT C=3"); lru.display();

console.log("\\nGET B →", lru.get("B"), "(B moves to most recent)");
lru.display();

console.log("\\nPUT D=4 (cache full, evict LRU)");
lru.put("D", 4); lru.display();

console.log("\\nPUT E=5 (evict next LRU)");
lru.put("E", 5); lru.display();

console.log("\\nGET C →", lru.get("C"), "(was evicted!)");`
      }
    ],
    quiz: [
      { question: "What's the main difference between in-memory and distributed caching?", options: ["Speed only", "In-memory is per-process and fastest; distributed (Redis) is shared across servers", "Distributed is always faster", "In-memory can persist data"], answer: 1, explanation: "In-memory caching lives in the process (fastest but not shared, lost on restart). Distributed caching (Redis/Memcached) is shared across all server instances via network, with optional persistence." },
      { question: "In a multi-layer cache (L1 → L2 → L3), what happens on an L2 hit?", options: ["Only return data", "Return data and promote to L1 for faster future access", "Delete from L2", "Query L3 anyway"], answer: 1, explanation: "On an L2 (Redis) hit, the data is returned AND promoted to L1 (in-memory) so the next request for the same key is served from the fastest layer." },
      { question: "What is cache warming?", options: ["Heating up the server", "Pre-populating cache with frequently accessed data before traffic arrives", "Increasing cache TTL", "Using a hot standby"], answer: 1, explanation: "Cache warming means proactively loading popular data into the cache (on deploy or via cron) so users don't experience cold-start cache misses." },
      { question: "What does an LRU cache do when it reaches capacity?", options: ["Crashes", "Doubles in size", "Evicts the least recently used entry", "Stops accepting new entries"], answer: 2, explanation: "An LRU (Least Recently Used) cache evicts the entry that hasn't been accessed for the longest time. This keeps the most popular data cached within bounded memory." }
    ]
  },

  // ─── CDN CACHING ───
  {
    id: "cdn-caching",
    category: "Caching",
    title: "CDN Caching",
    priority: "High",
    icon: "🌍",
    content: `## CDN Caching — Edge Network Performance

A **CDN (Content Delivery Network)** is a **globally distributed network of servers** that caches your content at **edge locations** close to users, reducing latency and offloading traffic from your origin server.

### How CDN Caching Works:
1. User in Mumbai requests \`https://example.com/app.js\`
2. DNS routes to the nearest CDN **edge server** (Mumbai PoP)
3. Edge checks its cache:
   - **HIT** → Returns cached copy instantly (~5-20ms)
   - **MISS** → Fetches from origin server → caches it → returns to user
4. Subsequent Mumbai users get the cached copy (~5ms vs ~200ms from US origin)

### CDN Terminology:
- **PoP (Point of Presence)**: physical data center location
- **Edge server**: server at a PoP that serves cached content
- **Origin server**: your actual server where content originates
- **Cache HIT**: content served from edge (fast)
- **Cache MISS**: edge fetches from origin (first request)
- **Cache PURGE / Invalidation**: force-remove cached content
- **TTL**: how long edge caches content

### What CDNs Cache:

**Static assets** (primary use case):
- JavaScript, CSS, images, fonts, videos
- Hashed filenames → cache forever
- CDN serves these from edge, origin never touched

**Dynamic content** (with caveats):
- API responses (with short TTL or stale-while-revalidate)
- Server-rendered HTML (SSR pages via ISR in Next.js)
- GraphQL responses (cache by query hash)

### CDN Cache Headers:
CDNs respect HTTP cache headers from your origin:
- \`Cache-Control: public, s-maxage=86400\` — CDN caches for 24h
- \`s-maxage\` is specifically for shared caches (CDN/proxies)
- \`Surrogate-Control\` — CDN-specific header (Fastly, Varnish)
- \`CDN-Cache-Control\` — newer standard for CDN-specific caching

### CDN Invalidation Strategies:

**Version/Hash in URL** (preferred):
- \`app.a1b2c3.js\` → new deploy = new hash = new URL
- Old URLs naturally expire, no purge needed
- Works perfectly with immutable caching

**Purge/Ban API**:
- CDNs provide APIs to purge specific URLs or patterns
- Cloudflare: purge by URL, tag, prefix, or everything
- Instant but costs money at scale

**Short TTL + Stale-While-Revalidate**:
- \`s-maxage=60, stale-while-revalidate=300\`
- CDN serves stale for 5min while refetching
- Good balance of freshness and performance

### Popular CDN Providers:
- **Cloudflare**: free tier, Workers (edge compute), huge network
- **AWS CloudFront**: integrated with S3, Lambda@Edge
- **Vercel Edge Network**: automatic for Next.js deploys
- **Fastly**: real-time purging, VCL configuration
- **Akamai**: enterprise, largest network

### CDN + Caching Architecture:
\`User → CDN Edge (cache) → Load Balancer → App Server → Redis → Database\`

Each layer reduces load on the next:
- CDN handles ~80-90% of static asset requests
- Server handles only cache misses and dynamic requests
- Redis handles repeated database queries
- Database handles only truly unique queries

### Edge Computing (CDN + Compute):
Modern CDNs can run code at the edge:
- **Cloudflare Workers**: run JS at 300+ locations
- **Vercel Edge Functions**: server-side logic at edge
- **AWS Lambda@Edge**: run functions in CloudFront PoPs
- Use case: A/B testing, auth checks, personalization, geolocation

### Performance Impact:
- Without CDN: user in India → US server → ~200ms latency
- With CDN: user in India → Mumbai edge → ~10ms latency
- 95% reduction in latency for cached content
- Origin server load reduced by 60-90%

### Common Pitfalls:
- Caching user-specific responses at CDN (serving user A's data to user B)
- Forgetting \`Vary\` header → same cache for different Accept-Encoding
- Not purging after deploy → stale HTML referencing new hashed assets
- Over-caching dynamic content → stale data for too long

### Interview Speaking Points (3 min):
1. Explain what a CDN is: distributed edge servers caching content near users
2. Walk through a cache HIT vs MISS flow
3. Describe what to cache: static assets (forever) vs dynamic (short TTL)
4. Explain \`s-maxage\` vs \`max-age\` — CDN vs browser caching
5. Discuss invalidation: hash-in-URL (preferred) vs purge API
6. Mention edge computing: Cloudflare Workers, Lambda@Edge
7. Quantify: ~200ms → ~10ms latency, 80-90% origin offload`,
    diagram: `<svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg" style="width:100%">
      <text x="180" y="25" fill="#e6edf3" font-size="15" font-weight="bold">CDN — Edge Caching Flow</text>
      <rect x="240" y="45" width="120" height="40" rx="20" fill="#d2a8ff" opacity="0.2" stroke="#d2a8ff"/>
      <text x="258" y="70" fill="#d2a8ff" font-size="12" font-weight="bold">Origin Server</text>
      <circle cx="100" cy="140" r="30" fill="#1f6feb" opacity="0.2" stroke="#1f6feb"/>
      <text x="75" y="144" fill="#58a6ff" font-size="10" font-weight="bold">Edge EU</text>
      <circle cx="300" cy="140" r="30" fill="#1f6feb" opacity="0.2" stroke="#1f6feb"/>
      <text x="272" y="144" fill="#58a6ff" font-size="10" font-weight="bold">Edge Asia</text>
      <circle cx="500" cy="140" r="30" fill="#1f6feb" opacity="0.2" stroke="#1f6feb"/>
      <text x="477" y="144" fill="#58a6ff" font-size="10" font-weight="bold">Edge US</text>
      <path d="M180 80 L120 115" stroke="#8b949e" stroke-width="1" stroke-dasharray="3"/>
      <path d="M300 85 L300 110" stroke="#8b949e" stroke-width="1" stroke-dasharray="3"/>
      <path d="M380 80 L480 115" stroke="#8b949e" stroke-width="1" stroke-dasharray="3"/>
      <rect x="50" y="190" width="45" height="25" rx="4" fill="#7ee787" opacity="0.2" stroke="#7ee787"/>
      <text x="57" y="207" fill="#7ee787" font-size="9">User</text>
      <path d="M97 195 L100 170" stroke="#7ee787" stroke-width="1.5"/>
      <text x="105" y="185" fill="#7ee787" font-size="8">~10ms</text>
      <rect x="255" y="190" width="45" height="25" rx="4" fill="#7ee787" opacity="0.2" stroke="#7ee787"/>
      <text x="262" y="207" fill="#7ee787" font-size="9">User</text>
      <path d="M280 190 L300 170" stroke="#7ee787" stroke-width="1.5"/>
      <text x="305" y="185" fill="#7ee787" font-size="8">~10ms</text>
      <rect x="20" y="230" width="560" height="45" rx="8" fill="#161b22" stroke="#30363d"/>
      <text x="40" y="250" fill="#e6edf3" font-size="12" font-weight="bold">Cache Strategy:</text>
      <text x="40" y="268" fill="#c9d1d9" font-size="10">Static (hashed) → s-maxage=31536000 | HTML → no-cache | API → s-maxage=60, SWR</text>
      <rect x="20" y="290" width="560" height="40" rx="8" fill="#12261e" stroke="#238636"/>
      <text x="40" y="310" fill="#7ee787" font-size="12" font-weight="bold">Impact:</text>
      <text x="40" y="325" fill="#7ee787" font-size="10">200ms → 10ms latency | 80-90% origin offload | Global availability</text>
    </svg>`,
    examples: [
      {
        title: "CDN Cache Flow Simulation",
        code: `// Simulate how a CDN serves requests from edge caches

class CDN {
  constructor() {
    this.edges = {
      "Mumbai": new Map(),
      "London": new Map(),
      "Virginia": new Map(),
    };
    this.origin = {
      "/app.js": { body: "console.log('hello')", size: "250KB" },
      "/styles.css": { body: "body{margin:0}", size: "45KB" },
      "/api/products": { body: JSON.stringify([{id:1,name:"Widget"}]), size: "2KB" },
    };
    this.stats = { edgeHits: 0, originFetches: 0 };
  }

  request(url, userLocation) {
    const edge = this.edges[userLocation];

    // Check edge cache
    if (edge.has(url)) {
      this.stats.edgeHits++;
      console.log("  ⚡ EDGE HIT at " + userLocation + " (~10ms)");
      return edge.get(url);
    }

    // Cache miss — fetch from origin
    this.stats.originFetches++;
    console.log("  🌐 EDGE MISS → fetching from origin (~200ms)");
    const data = this.origin[url];
    if (data) {
      edge.set(url, data);
      console.log("  📦 Cached at " + userLocation + " edge for future requests");
    }
    return data;
  }
}

const cdn = new CDN();

console.log("=== CDN Cache Simulation ===\\n");

console.log("1. User in Mumbai requests /app.js");
cdn.request("/app.js", "Mumbai");

console.log("\\n2. Another user in Mumbai requests /app.js");
cdn.request("/app.js", "Mumbai");

console.log("\\n3. User in London requests /app.js");
cdn.request("/app.js", "London");

console.log("\\n4. User in London requests /app.js again");
cdn.request("/app.js", "London");

console.log("\\n5. User in Mumbai requests /styles.css");
cdn.request("/styles.css", "Mumbai");

console.log("\\n=== Stats ===");
console.log("Edge cache hits: " + cdn.stats.edgeHits);
console.log("Origin fetches:  " + cdn.stats.originFetches);
console.log("Cache hit rate:  " + Math.round(cdn.stats.edgeHits / (cdn.stats.edgeHits + cdn.stats.originFetches) * 100) + "%");`
      },
      {
        title: "CDN Cache Headers Configuration",
        code: `// How to set cache headers for different content types

function getCacheHeaders(contentType, path) {
  // Static assets with hash in filename
  if (/\\.[a-f0-9]{8,}\\.(js|css)$/.test(path)) {
    return {
      "Cache-Control": "public, max-age=31536000, immutable",
      reason: "Hashed filename — content never changes at this URL"
    };
  }

  // Images
  if (/\\.(png|jpg|webp|svg|gif)$/.test(path)) {
    return {
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
      reason: "Browser: 1 day, CDN: 1 week"
    };
  }

  // HTML pages
  if (/\\.html?$/.test(path) || path === "/") {
    return {
      "Cache-Control": "no-cache",
      reason: "Always revalidate — HTML refs hashed assets"
    };
  }

  // Public API
  if (path.startsWith("/api/public")) {
    return {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      reason: "CDN caches 5min, serve stale 60s during refetch"
    };
  }

  // Private API (user-specific)
  if (path.startsWith("/api/user")) {
    return {
      "Cache-Control": "private, max-age=60",
      reason: "Browser only (not CDN), 1 min TTL"
    };
  }

  // Sensitive data
  if (path.startsWith("/api/auth") || path.startsWith("/api/bank")) {
    return {
      "Cache-Control": "no-store",
      reason: "NEVER cache sensitive data"
    };
  }

  return { "Cache-Control": "no-cache", reason: "Default: revalidate" };
}

const paths = [
  "/static/app.a1b2c3d4.js",
  "/images/hero.webp",
  "/index.html",
  "/api/public/products",
  "/api/user/profile",
  "/api/auth/token",
];

console.log("=== Cache Headers by Content Type ===\\n");
paths.forEach(path => {
  const headers = getCacheHeaders(null, path);
  console.log("📄 " + path);
  console.log("   " + headers["Cache-Control"]);
  console.log("   Why: " + headers.reason);
  console.log("");
});`
      },
      {
        title: "CDN Purge / Invalidation Strategies",
        code: `// CDN cache invalidation — different approaches

console.log("=== CDN Invalidation Strategies ===\\n");

// Strategy 1: Hash in URL (BEST — no purge needed!)
console.log("1. 🏆 HASH IN URL (Preferred)");
console.log("   app.a1b2c3.js → deploy → app.d4e5f6.js");
console.log("   Old URL naturally expires, new URL is a fresh cache miss");
console.log("   Cost: $0 | Speed: instant | Reliability: 100%");
console.log("");

// Strategy 2: Purge API
console.log("2. 🔧 PURGE API");
const purgeExamples = [
  { provider: "Cloudflare", command: "POST /zones/{id}/purge_cache", scope: "by URL, tag, prefix, all" },
  { provider: "CloudFront", command: "POST /distribution/{id}/invalidation", scope: "by path pattern" },
  { provider: "Fastly", command: "POST /service/{id}/purge/{key}", scope: "by URL, surrogate key (instant)" },
];
purgeExamples.forEach(p => {
  console.log("   " + p.provider + ": " + p.command);
  console.log("   Scope: " + p.scope);
});
console.log("");

// Strategy 3: Short TTL + Stale-While-Revalidate
console.log("3. ⏱️ SHORT TTL + SWR");
console.log("   Cache-Control: s-maxage=60, stale-while-revalidate=300");
console.log("   CDN serves stale for 5min while refetching in background");
console.log("   Good for: API responses, SSR pages");
console.log("");

// Strategy 4: Versioned URLs
console.log("4. 🔢 VERSIONED URLs");
console.log("   /api/v2/products → bump version on breaking changes");
console.log("   /styles.css?v=1234 → query param versioning (less reliable)");
console.log("   Note: Some CDNs ignore query params by default!");
console.log("");

// Recommendations
console.log("=== Recommendations ===");
console.log("Static assets: Hash in filename (always)");
console.log("HTML/SSR pages: Short TTL + revalidate");
console.log("API responses: Short s-maxage or purge on write");
console.log("Emergency fix: Purge API (manual)");`
      }
    ],
    quiz: [
      { question: "What is a CDN 'edge server'?", options: ["Your origin server", "A server at a PoP location close to users that caches content", "A DNS server", "A database replica"], answer: 1, explanation: "An edge server is a CDN server at a Point of Presence (PoP) — a data center close to end users. It caches content from your origin server, serving it with low latency to nearby users." },
      { question: "What does s-maxage control vs max-age?", options: ["They're the same", "s-maxage is for shared caches (CDN/proxy), max-age is for browser cache", "max-age is for CDN, s-maxage for browser", "s-maxage is slower"], answer: 1, explanation: "s-maxage (shared max-age) controls caching on shared caches like CDNs and proxies. max-age controls the browser cache. You can set different TTLs: s-maxage=3600 (CDN: 1hr) + max-age=60 (browser: 1min)." },
      { question: "Why is hash-in-URL the preferred CDN invalidation strategy?", options: ["It's the cheapest", "New content gets a new URL automatically — no purge needed", "It's the fastest", "CDNs require it"], answer: 1, explanation: "With content-hashed filenames (app.a1b2c3.js), any content change produces a new filename/URL. The old URL naturally expires, and the new URL is a fresh cache miss. No purge API calls needed." },
      { question: "What's the typical latency improvement from CDN caching?", options: ["10% faster", "50% faster", "From ~200ms to ~10ms (95% reduction)", "No improvement"], answer: 2, explanation: "Without CDN, a user in India hitting a US server might see ~200ms latency. With a CDN edge in India, cached content is served in ~10ms — a ~95% latency reduction." },
      { question: "What's a common CDN caching pitfall?", options: ["Caching too little", "Caching user-specific responses at the edge (serving user A's data to user B)", "Using too many PoPs", "Setting TTL too short"], answer: 1, explanation: "If you cache user-specific responses (profiles, carts) at the CDN without proper Vary headers or private directive, user A's data could be served to user B — a serious security issue." }
    ]
  }
];

// ─── Category metadata ───
export const CATEGORIES = {
  "JavaScript": { color: "#f0db4f", bg: "#f0db4f15", icon: "⚡" },
  "React": { color: "#61dafb", bg: "#61dafb15", icon: "⚛️" },
  "API Integration": { color: "#7ee787", bg: "#7ee78715", icon: "🔗" },
  "Caching": { color: "#d2a8ff", bg: "#d2a8ff15", icon: "💾" },
  "System Design": { color: "#f0883e", bg: "#f0883e15", icon: "🏗️" },
  "Machine Coding": { color: "#f85149", bg: "#f8514915", icon: "⌨️" },
};
