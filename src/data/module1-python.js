export const MODULE1_TOPICS = [
  // ─── 1. Environment Setup ───────────────────────────────────────────
  {
    id: "env-setup",
    category: "Python Foundations",
    title: "Environment Setup",
    priority: "High",
    icon: "🛠️",
    estimatedMinutes: 30,
    prerequisites: [],
    nextTopics: ["python-syntax"],
    whyItMatters: "Every production Python project at companies like Anthropic, Google, and Meta starts with isolated virtual environments. Skipping this leads to the classic 'it works on my machine' failure — where conflicting package versions silently corrupt results. For AI/ML work specifically, torch==2.0 and torch==2.1 have different CUDA kernels that produce different numerical outputs, meaning a missing venv can corrupt your entire experiment.",
    analogy: "A virtual environment is like a separate apartment for each project. Your system Python is the apartment building. Each venv gets its own furniture (packages) and rules (versions). One tenant using torch 2.0 doesn't affect the neighbour running torch 2.1. Without venvs, everyone shares one room and constantly fights over versions.",
    content: `## Environment Setup: venv, pip, VSCode, and PEP 8

The goal is a **reproducible, isolated** development environment for every Python project.

### Why Isolation Matters
Python packages have complex dependency trees. \`transformers 4.40\` requires \`tokenizers>=0.19\`, which may conflict with your other project needing \`tokenizers==0.15\`. Virtual environments give each project its own isolated package space.

### Virtual Environments with venv
Python's built-in \`venv\` module creates isolated environments. Each venv has its own Python interpreter copy and pip, completely separate from your system Python.

\`\`\`bash
python3 -m venv .venv          # create env in .venv/ folder
source .venv/bin/activate      # Linux/Mac activate
.venv\\Scripts\\activate        # Windows activate
deactivate                      # exit the env
\`\`\`

**Always activate your venv** before installing packages. The activated shell shows \`(.venv)\` prefix.

### pip: Package Management
\`pip\` installs from PyPI (Python Package Index). Freeze your dependencies so teammates reproduce the exact environment.

\`\`\`bash
pip install fastapi uvicorn       # install packages
pip freeze > requirements.txt     # snapshot all installed versions
pip install -r requirements.txt   # reproduce from snapshot
pip install -e .                  # editable install (your own package)
\`\`\`

**Use exact pins in production**: \`fastapi==0.111.0\` not \`fastapi>=0.100\`. Unpinned deps cause silent upgrade breakage.

### pyproject.toml (Modern Standard)
\`pyproject.toml\` is the modern way to define project metadata and dependencies (PEP 517/518). Tools like \`uv\`, \`poetry\`, and \`hatch\` use it.

### VSCode Setup for Python
1. Install **Python** extension (ms-python.python)
2. Install **Pylance** for type checking and autocomplete
3. Select interpreter: \`Ctrl+Shift+P\` → "Python: Select Interpreter" → choose your venv
4. Install **Ruff** extension for ultra-fast linting (replaces flake8)

### PEP 8 — Python Style Guide
PEP 8 is the official Python style guide. Key rules:
- **Indentation**: 4 spaces (never tabs)
- **Line length**: max 79 chars (88 for Black formatter)
- **Naming**: \`snake_case\` for functions/variables, \`PascalCase\` for classes, \`UPPER_CASE\` for constants
- **Blank lines**: 2 blank lines between top-level definitions, 1 inside classes
- **Imports**: stdlib first, then third-party, then local (each group separated by blank line)

### Automated Formatting: Black + Ruff
Don't manually enforce PEP 8. Use tools:
- **Black**: opinionated autoformatter, zero config, used by most major Python projects
- **Ruff**: 10-100x faster than flake8, replaces flake8 + isort + pyupgrade

### .env Files for Secrets
Never hardcode API keys. Use \`.env\` files + \`python-dotenv\`:
\`\`\`bash
# .env (never commit to git!)
OPENAI_API_KEY=sk-proj-...
DATABASE_URL=postgresql://...
\`\`\`

Load in Python: \`from dotenv import load_dotenv; load_dotenv()\`

### 3-Minute Monologue 🎤
"Let me walk you through how I set up Python projects for AI work. The cornerstone is virtual environments — I use Python's built-in venv module to create an isolated .venv directory in every project. This means each project has its own copy of Python and its own packages, so a project using torch 2.0 won't conflict with another using torch 2.1. Once the environment is activated, I use pip to install dependencies, and I always run pip freeze to snapshot exact versions into requirements.txt. This reproducibility is critical — in ML work, even minor version changes in numpy or transformers can change numerical outputs. For the IDE, I use VSCode with the Python and Pylance extensions, always pointing at the project venv. For code style, I follow PEP 8 but let Black handle formatting automatically — I just run it on save. PEP 8 says snake_case for functions, PascalCase for classes, and 4-space indentation. For secrets like API keys, I use .env files loaded with python-dotenv — never hardcoded. The modern trend is pyproject.toml over setup.py, and tools like uv are replacing pip for speed. Getting this foundation right means your team can clone the repo and be running in 2 minutes."`,
    diagrams: [
      {
        type: "static",
        title: "Project structure with venv",
        caption: "Recommended layout for Python AI projects",
        svg: `<svg viewBox="0 0 560 280" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace">
  <rect width="560" height="280" fill="#0d1117"/>
  <!-- Folder tree -->
  <text x="20" y="30" fill="#e6edf3" font-size="14" font-weight="bold">my-ai-project/</text>
  <text x="40" y="55" fill="#58a6ff" font-size="13">├── .venv/</text>
  <text x="140" y="55" fill="#8b949e" font-size="11">   ← isolated packages (git-ignored)</text>
  <text x="40" y="75" fill="#7ee787" font-size="13">├── src/</text>
  <text x="40" y="95" fill="#7ee787" font-size="13">│   └── main.py</text>
  <text x="40" y="115" fill="#f0883e" font-size="13">├── .env</text>
  <text x="140" y="115" fill="#8b949e" font-size="11">  ← API keys (git-ignored)</text>
  <text x="40" y="135" fill="#e6edf3" font-size="13">├── requirements.txt</text>
  <text x="140" y="135" fill="#8b949e" font-size="11">← pinned deps</text>
  <text x="40" y="155" fill="#e6edf3" font-size="13">├── pyproject.toml</text>
  <text x="40" y="175" fill="#8b949e" font-size="13">└── .gitignore</text>
  <!-- Isolation box -->
  <rect x="300" y="30" width="240" height="100" rx="8" fill="#161b22" stroke="#30363d"/>
  <text x="315" y="52" fill="#58a6ff" font-size="12" font-weight="bold">.venv/ contains:</text>
  <text x="315" y="72" fill="#c9d1d9" font-size="11">• Python interpreter copy</text>
  <text x="315" y="90" fill="#c9d1d9" font-size="11">• pip (project-local)</text>
  <text x="315" y="108" fill="#c9d1d9" font-size="11">• all installed packages</text>
  <!-- Git ignore box -->
  <rect x="300" y="148" width="240" height="70" rx="8" fill="#2d1418" stroke="#da3633"/>
  <text x="315" y="168" fill="#f85149" font-size="12" font-weight="bold">.gitignore must include:</text>
  <text x="315" y="186" fill="#c9d1d9" font-size="11">.venv/   .env   __pycache__/</text>
  <text x="315" y="204" fill="#c9d1d9" font-size="11">*.pyc    dist/   *.egg-info/</text>
  <!-- Activate command -->
  <rect x="20" y="210" width="260" height="50" rx="6" fill="#0d2016" stroke="#238636"/>
  <text x="35" y="230" fill="#7ee787" font-size="12">source .venv/bin/activate</text>
  <text x="35" y="248" fill="#8b949e" font-size="11">→ (.venv) prompt prefix appears</text>
</svg>`
      }
    ],
    examples: [
      {
        size: "small",
        title: "Create and activate a venv",
        description: "Full workflow to create, activate, install, and freeze. Run these in your terminal.",
        language: "bash",
        learningGoal: "Muscle memory for venv workflow — you'll do this at the start of every project.",
        code: `# Create the virtual environment
python3 -m venv .venv

# Activate (Linux/Mac)
source .venv/bin/activate

# Activate (Windows)
# .venv\\Scripts\\activate

# Confirm you're using the venv's pip
which pip      # should show .venv/bin/pip

# Install packages
pip install fastapi uvicorn python-dotenv

# Snapshot exact versions
pip freeze > requirements.txt

# See what's installed
pip list

# Deactivate when done
deactivate`,
        expectedOutput: `# After activation:
(.venv) user@machine:~/my-project$

# 'which pip' output:
/home/user/my-project/.venv/bin/pip

# pip freeze output (example):
annotated-types==0.7.0
anyio==4.4.0
fastapi==0.111.0
python-dotenv==1.0.1
uvicorn==0.30.1`
      },
      {
        size: "small",
        title: "Load environment variables with python-dotenv",
        description: "The standard pattern for keeping API keys out of source code.",
        language: "python",
        learningGoal: "How .env files integrate with Python — critical for any project using OpenAI, Anthropic, or database credentials.",
        pipInstall: "python-dotenv",
        code: `# .env file content (create this file, don't commit it):
# OPENAI_API_KEY=sk-proj-abc123
# DB_URL=postgresql://localhost/mydb
# DEBUG=true

import os
from dotenv import load_dotenv

# Load .env into os.environ
load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
db_url = os.getenv("DB_URL")
debug = os.getenv("DEBUG", "false").lower() == "true"

print(f"API key loaded: {'yes' if api_key else 'NO - check .env'}")
print(f"DB URL: {db_url}")
print(f"Debug mode: {debug}")

# In production, read from real env vars (no .env file needed)
# os.environ["OPENAI_API_KEY"] = "..." set by deployment platform`,
        expectedOutput: `API key loaded: yes
DB URL: postgresql://localhost/mydb
Debug mode: True`
      },
      {
        size: "small",
        title: "pyproject.toml for modern projects",
        description: "The PEP 517/518 standard for project metadata. Tools like uv, poetry, and pip all read this.",
        language: "bash",
        learningGoal: "Why pyproject.toml replaces setup.py and how to structure it for an AI project.",
        code: `# pyproject.toml (create this in your project root)
cat > pyproject.toml << 'EOF'
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "my-ai-app"
version = "0.1.0"
description = "AI backend with FastAPI"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.111.0",
    "openai>=1.30.0",
    "pydantic>=2.7.0",
    "python-dotenv>=1.0.1",
]

[project.optional-dependencies]
dev = ["pytest", "black", "ruff"]

[tool.black]
line-length = 88

[tool.ruff]
line-length = 88
select = ["E", "F", "I"]
EOF

# Install the project in editable mode (includes all deps)
pip install -e ".[dev]"`,
        expectedOutput: `Successfully installed my-ai-app-0.1.0 fastapi-0.111.0 openai-1.30.0 ...`
      },
      {
        size: "medium",
        title: "PEP 8 in practice — good vs bad",
        description: "Side-by-side comparison of PEP 8 violations and fixes. These are the patterns ruff will flag.",
        language: "python",
        learningGoal: "Recognise the PEP 8 patterns that matter most: naming, imports, spacing, line length.",
        code: `# ── BAD (PEP 8 violations) ────────────────────────────────────────
import sys, os  # multiple imports on one line
import json
from typing import *  # star imports hide what's used

class myClass:  # should be PascalCase
    MAX_RETRY=3  # missing spaces around =

    def DoSomething(self,x,y):  # should be snake_case, missing spaces
        if x==None:  # use 'is None' not '=='
            return
        Result=x+y  # variable should be snake_case
        return Result

# ── GOOD (PEP 8 compliant) ────────────────────────────────────────
import os
import sys
from typing import Optional  # explicit imports only

class MyClass:  # PascalCase
    MAX_RETRY = 3  # UPPER_CASE for constants, spaces around =

    def do_something(self, x: int, y: int) -> Optional[int]:  # snake_case
        if x is None:  # identity check for None
            return None
        result = x + y  # snake_case variables
        return result


# ── Naming conventions summary ─────────────────────────────────────
# Functions & variables:  snake_case     → def calculate_loss(), total_tokens
# Classes:                PascalCase     → class TokenizerConfig
# Constants:              UPPER_CASE     → MAX_SEQ_LEN = 2048
# Private:                _leading_      → _internal_cache
# Name mangling:          __double__     → __private_attr (avoid)
# Dunder methods:         __init__       → __repr__, __len__

print("Import order: stdlib → third-party → local (blank line between groups)")
print("Line length: 88 chars (Black default), never use tabs — always 4 spaces")`,
        expectedOutput: `Import order: stdlib → third-party → local (blank line between groups)
Line length: 88 chars (Black default), never use tabs — always 4 spaces`
      },
      {
        size: "medium",
        title: "Autoformat with Black and lint with Ruff",
        description: "Practical usage of the two tools every serious Python project should run in CI.",
        language: "bash",
        learningGoal: "How to integrate Black + Ruff into your workflow so you never manually fix style issues again.",
        pipInstall: "black ruff",
        code: `# Install both tools
pip install black ruff

# ── Black: auto-formatter ──────────────────────────────────────────
# Before Black:
python3 -c "
x={'key':'value','other':42}
def f(a,b,c): return a+b+c
"

# Format a file (rewrites in place)
black my_script.py

# Check without changing (for CI)
black --check my_script.py

# After Black, code looks like:
python3 -c "
x = {'key': 'value', 'other': 42}

def f(a, b, c):
    return a + b + c
"

# ── Ruff: ultra-fast linter ───────────────────────────────────────
# Lint a file (shows violations)
ruff check my_script.py

# Auto-fix fixable violations
ruff check --fix my_script.py

# Common rules Ruff catches:
# E501 line too long
# F401 imported but unused
# F841 local variable assigned but never used
# I001 import not sorted

# ── VSCode integration (settings.json) ───────────────────────────
cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "ms-python.black-formatter",
  "[python]": {
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    }
  }
}
EOF`,
        expectedOutput: `# Black output:
reformatted my_script.py
All done! ✨ 🍰 ✨
1 file reformatted.

# Ruff output (before fix):
my_script.py:1:8: F401 [*] 'os' imported but unused
my_script.py:15:1: E302 Expected 2 blank lines, got 1
Found 2 errors (1 fixable with --fix).`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What does `source .venv/bin/activate` do?", options: ["Creates a new virtual environment", "Activates the venv so its Python and pip are used for the current shell session", "Installs packages into the venv", "Deactivates the current venv"], answer: 1, explanation: "Activation modifies PATH so .venv/bin comes first. Any python or pip command now uses the venv's isolated interpreter. No packages installed during activation — that's what pip install does afterward." },
      { difficulty: "easy", question: "Which naming convention does PEP 8 require for Python classes?", options: ["snake_case", "camelCase", "PascalCase", "UPPER_CASE"], answer: 2, explanation: "PEP 8 mandates PascalCase (also called CapWords or TitleCase) for class names: MyModel, TokenizerConfig, BaseException. Functions and variables use snake_case. Module-level constants use UPPER_CASE." },
      { difficulty: "easy", question: "What is the purpose of `pip freeze > requirements.txt`?", options: ["Upgrades all packages to latest", "Records exact installed package versions for reproducibility", "Creates a virtual environment", "Removes unused packages"], answer: 1, explanation: "pip freeze outputs all installed packages with their exact versions (e.g., torch==2.1.0). Redirecting to requirements.txt creates a snapshot. Anyone running pip install -r requirements.txt gets the identical environment. This is essential for reproducible ML experiments." },
      { difficulty: "medium", question: "You have two projects: project-a needs torch==2.0 and project-b needs torch==2.1. What is the correct approach?", options: ["Install both versions globally and switch manually", "Use a separate virtual environment for each project", "Uninstall and reinstall torch when switching projects", "Use sys.path manipulation to load different versions"], answer: 1, explanation: "Virtual environments are the only clean solution. Each project gets its own .venv with its own torch version. Switching projects means activating the correct venv. Global installs can only have one version of a package." },
      { difficulty: "medium", question: "What is wrong with this import: `from transformers import *`?", options: ["Star imports are syntax errors", "They run slower", "They pollute the namespace and make it impossible to know which names came from where", "They only work in scripts, not modules"], answer: 2, explanation: "Star imports (import *) are an anti-pattern: they hide which names a module actually uses, make automated tools (ruff, pylance) unable to track usage, and can silently shadow existing names. PEP 8 explicitly discourages them. Always use explicit imports: from transformers import AutoTokenizer, AutoModel." },
      { difficulty: "medium", question: "Which check does `black --check` perform?", options: ["Runs your test suite", "Verifies if files would be reformatted, exits non-zero if yes (no writes)", "Checks for PEP 8 violations", "Validates Python syntax"], answer: 1, explanation: "black --check is the CI-safe mode. It exits with code 0 if files are already black-formatted, or non-zero if reformatting would happen. CI pipelines use this to enforce formatting without modifying files. The actual reformatting is done by black (without --check)." },
      { difficulty: "hard", question: "In `pyproject.toml`, what is the difference between `dependencies` and `optional-dependencies`?", options: ["No functional difference", "dependencies are installed with pip install .; optional-dependencies with pip install '.[extra]'", "optional-dependencies are only installed in development", "dependencies require Python 3.10+"], answer: 1, explanation: "Core dependencies (under [project] dependencies) are always installed. Optional dependency groups (under [project.optional-dependencies]) need explicit activation: pip install -e '.[dev]' installs the dev group. This lets you keep test/lint tools out of production installs, reducing attack surface and image size." },
      { difficulty: "hard", question: "Why should you commit `requirements.txt` with exact version pins (e.g., `fastapi==0.111.0`) rather than ranges (e.g., `fastapi>=0.100`)?", options: ["Exact pins are required by pip", "To prevent silent breaking changes when packages release new versions", "Ranges cause pip to fail", "Exact pins make installation faster"], answer: 1, explanation: "Package maintainers release breaking changes. fastapi>=0.100 might install 0.115.0 six months later with a changed API. If your code was written for 0.111.0, it silently breaks. Exact pins guarantee identical environments across developer machines, CI, and production. The downside: you must actively update deps and test. Tools like dependabot automate this." }
    ],
    commonMistakes: [
      { mistake: "Installing packages without activating the venv first", whyItHappens: "The terminal doesn't show a visual error — pip installs globally without warning", howToAvoid: "Check for (.venv) prefix in your shell prompt before running pip install. Make it a habit: no prefix = no install." },
      { mistake: "Committing .env files with API keys to git", whyItHappens: "Developers forget to add .env to .gitignore, then git add . catches it", howToAvoid: "Always add .env and .venv/ to .gitignore before the first commit. Use git-secrets or pre-commit hooks to prevent accidental commits." },
      { mistake: "Using `pip install -r requirements.txt` without pinned versions", whyItHappens: "Writing requirements.txt manually with bare package names like 'fastapi' instead of 'fastapi==0.111.0'", howToAvoid: "Always generate requirements.txt with pip freeze. Never write it manually unless you understand semantic versioning." }
    ],
    cheatSheet: `## Environment Setup Cheat Sheet
- **Create venv**: \`python3 -m venv .venv\`
- **Activate (Mac/Linux)**: \`source .venv/bin/activate\`
- **Activate (Windows)**: \`.venv\\Scripts\\activate\`
- **Deactivate**: \`deactivate\`
- **Install packages**: \`pip install fastapi uvicorn\`
- **Freeze deps**: \`pip freeze > requirements.txt\`
- **Restore deps**: \`pip install -r requirements.txt\`
- **Load .env**: \`from dotenv import load_dotenv; load_dotenv()\`
- **Get env var**: \`os.getenv("KEY", "default")\`
- **Format code**: \`black .\`
- **Lint code**: \`ruff check .\`
- **Naming**: \`snake_case\` functions, \`PascalCase\` classes, \`UPPER_CASE\` constants`,
    furtherReading: [
      { type: "docs", title: "Python venv documentation", url: "https://docs.python.org/3/library/venv.html", whyRead: "Official docs — covers all options including --copies, --symlinks, and --upgrade-deps." },
      { type: "docs", title: "PEP 8 — Style Guide for Python Code", url: "https://peps.python.org/pep-0008/", whyRead: "The original guide. Read the 'When to ignore PEP 8' section — context matters more than dogma." },
      { type: "blog", title: "Hypermodern Python Tooling (Claudio Jolowicz)", url: "https://cjolowicz.github.io/posts/hypermodern-python-01-setup/", whyRead: "Best modern guide covering pyproject.toml, uv, ruff, and GitHub Actions CI setup." }
    ],
    flashcards: [
      { front: "What command creates a virtual environment named .venv?", back: "python3 -m venv .venv" },
      { front: "How do you snapshot all installed packages and their exact versions?", back: "pip freeze > requirements.txt" },
      { front: "PEP 8 naming: function names, class names, constants", back: "Functions: snake_case | Classes: PascalCase | Constants: UPPER_CASE" },
      { front: "What does Black do to your code?", back: "Auto-formats Python code to a consistent style (88-char lines, consistent quotes/spacing). It's opinionated and non-configurable — that's the point." },
      { front: "Why use .env files instead of hardcoding API keys?", back: "Prevents secrets from being committed to git. .env is git-ignored; real environment variables are injected by the deployment platform." },
      { front: "What is pyproject.toml for?", back: "Modern standard (PEP 517/518) for project metadata, dependencies, and tool configuration. Replaces setup.py + setup.cfg." },
      { front: "What's the difference between pip install package and pip install -e .?", back: "pip install package: installs a package from PyPI. pip install -e .: installs your current project in 'editable' mode so code changes take effect immediately without reinstalling." },
      { front: "What is Ruff and why use it over flake8?", back: "Ruff is a Rust-based Python linter that is 10-100x faster than flake8. It replaces flake8, isort, and pyupgrade in a single tool. Used by major projects including pandas and huggingface." }
    ]
  },

  // ─── 2. Python Syntax & Data Types ──────────────────────────────────
  {
    id: "python-syntax",
    category: "Python Foundations",
    title: "Python Syntax & Data Types",
    priority: "High",
    icon: "🔤",
    estimatedMinutes: 35,
    prerequisites: ["env-setup"],
    nextTopics: ["collections"],
    whyItMatters: "Python's type system is the source of both its power and its most common bugs. Silent type coercion (None + 1 raises TypeError instead of silently returning None), integer precision (Python ints are arbitrary-precision — no overflow unlike C/Java), and the difference between mutable and immutable types are things every production developer must understand. FastAPI's entire validation system is built on Python type hints.",
    analogy: "Python's types are like containers with rules. An int is a lockbox for whole numbers with unlimited capacity. A float is a jar that holds approximate decimals (not exact — `0.1 + 0.2 != 0.3`). A string is an immutable bead necklace — you can read any bead but can't swap one out in place. A bool is a light switch, but it's actually a special kind of int (True == 1, False == 0).",
    content: `## Python Syntax & Data Types

Python is dynamically typed but not weakly typed. Variables have no declared type, but values do — and Python enforces them at runtime.

### Numeric Types
**int** — arbitrary precision (no overflow). \`2 ** 100\` works perfectly.
**float** — IEEE 754 double precision. Subject to floating-point imprecision: \`0.1 + 0.2 == 0.30000000000000004\`
**complex** — \`3 + 4j\`, used in signal processing and some ML math.
**Decimal** — from the \`decimal\` module — exact decimal arithmetic for financial calculations.

### Strings
Strings are **immutable sequences** of Unicode characters. Key properties:
- Single quotes or double quotes — identical. Triple quotes for multi-line.
- f-strings (Python 3.6+) are the modern interpolation method: \`f"Hello, {name}"\`
- String multiplication: \`"=" * 40\` creates a separator line.
- Methods return new strings (immutable): \`s.upper()\` doesn't modify \`s\`.

### Booleans
\`bool\` is a subclass of \`int\`. \`True == 1\` and \`False == 0\`.
**Truthy/Falsy**: empty containers (\`[]\`, \`{}\`, \`""\`), \`None\`, \`0\`, and \`0.0\` are falsy. Everything else is truthy.

### None
Python's null value. Always use \`is None\` / \`is not None\` for checks, not \`== None\`.

### Type Hints (Python 3.9+)
Type hints don't enforce types at runtime (Python stays dynamic), but they enable static analysis (Pylance, mypy) and are required by Pydantic and FastAPI.

\`\`\`python
def greet(name: str, count: int = 1) -> str:
    return f"Hello {name}" * count

# Modern union syntax (Python 3.10+)
def process(data: str | bytes | None) -> str:
    ...
\`\`\`

### The is vs == Distinction
\`==\` checks value equality. \`is\` checks identity (same object in memory).
Always use \`is\` for \`None\`, \`True\`, \`False\` comparisons.
CPython interns small ints (-5 to 256) and short strings, so \`is\` may return True for them — but never rely on this.`,
    diagrams: [
      {
        type: "static",
        title: "Python type hierarchy",
        caption: "Key built-in types and their relationships",
        svg: `<svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace;font-size:12">
  <rect width="560" height="240" fill="#0d1117"/>
  <!-- object root -->
  <rect x="220" y="10" width="120" height="32" rx="6" fill="#1f6feb" stroke="#388bfd"/>
  <text x="280" y="31" fill="#fff" font-size="13" text-anchor="middle" font-weight="bold">object</text>
  <!-- Lines down -->
  <line x1="280" y1="42" x2="100" y2="75" stroke="#30363d" stroke-width="1.5"/>
  <line x1="280" y1="42" x2="280" y2="75" stroke="#30363d" stroke-width="1.5"/>
  <line x1="280" y1="42" x2="460" y2="75" stroke="#30363d" stroke-width="1.5"/>
  <!-- int -->
  <rect x="40" y="75" width="80" height="28" rx="5" fill="#238636" stroke="#2ea043"/>
  <text x="80" y="93" fill="#fff" font-size="12" text-anchor="middle">int</text>
  <!-- float -->
  <rect x="240" y="75" width="80" height="28" rx="5" fill="#9e6a03" stroke="#f0883e"/>
  <text x="280" y="93" fill="#fff" font-size="12" text-anchor="middle">float</text>
  <!-- str -->
  <rect x="420" y="75" width="80" height="28" rx="5" fill="#6e40c9" stroke="#d2a8ff"/>
  <text x="460" y="93" fill="#fff" font-size="12" text-anchor="middle">str</text>
  <!-- bool inherits int -->
  <line x1="80" y1="103" x2="80" y2="135" stroke="#30363d" stroke-width="1.5"/>
  <rect x="40" y="135" width="80" height="28" rx="5" fill="#0d2016" stroke="#7ee787"/>
  <text x="80" y="153" fill="#7ee787" font-size="12" text-anchor="middle">bool</text>
  <text x="80" y="168" fill="#8b949e" font-size="10" text-anchor="middle">True, False</text>
  <!-- None type -->
  <rect x="160" y="135" width="100" height="28" rx="5" fill="#2d1418" stroke="#f85149"/>
  <text x="210" y="153" fill="#f85149" font-size="12" text-anchor="middle">NoneType</text>
  <text x="210" y="168" fill="#8b949e" font-size="10" text-anchor="middle">None</text>
  <!-- Notes -->
  <text x="20" y="210" fill="#8b949e" font-size="11">bool inherits from int: True==1, False==0</text>
  <text x="20" y="225" fill="#f0883e" font-size="11">float precision: 0.1 + 0.2 = 0.30000000000000004</text>
  <text x="320" y="210" fill="#7ee787" font-size="11">str is immutable sequence of Unicode</text>
  <text x="320" y="225" fill="#8b949e" font-size="11">int has arbitrary precision (no overflow)</text>
</svg>`
      }
    ],
    examples: [
      {
        size: "small",
        title: "Numbers: int precision and float gotchas",
        language: "python",
        learningGoal: "Python ints have no overflow limit; floats have IEEE 754 imprecision — critical for ML loss calculations.",
        code: `# Python ints are arbitrary precision
print(2 ** 100)                    # works! no overflow
print(type(2 ** 100))              # <class 'int'>

# Float imprecision (IEEE 754)
print(0.1 + 0.2)                   # NOT 0.3!
print(0.1 + 0.2 == 0.3)            # False!
print(abs(0.1 + 0.2 - 0.3) < 1e-9)  # True — correct comparison

# Integer division vs true division
print(7 / 2)   # 3.5  — true division
print(7 // 2)  # 3    — floor division
print(7 % 2)   # 1    — modulo
print(divmod(7, 2))  # (3, 1) — both at once

# Scientific notation
big = 1.5e10    # 15000000000.0
small = 2.5e-4  # 0.00025
print(f"{big:,.0f}")   # 15,000,000,000
print(f"{small:.6f}")  # 0.000250`,
        expectedOutput: `1267650600228229401496703205376
<class 'int'>
0.30000000000000004
False
True
3.5
3
1
(3, 1)
15,000,000,000
0.000250`
      },
      {
        size: "small",
        title: "Strings: f-strings, methods, immutability",
        language: "python",
        learningGoal: "f-strings are the modern way — faster than .format() and % formatting. Immutability means string methods always return new strings.",
        code: `name = "Kumar"
score = 0.9742

# f-strings (Python 3.6+) — use these always
print(f"Hello, {name}!")
print(f"Score: {score:.2%}")          # 97.42%
print(f"Score: {score:.4f}")          # 0.9742
print(f"{'centered':^20}")            # centered in 20 chars
print(f"{1_000_000:,}")               # 1,000,000 (underscore for readability)

# Strings are IMMUTABLE — methods return new strings
s = "  hello world  "
print(s.strip())          # "hello world"
print(s.strip().title())  # "Hello World"
print(s.strip().split())  # ['hello', 'world']
print(s)                  # still "  hello world  " — unchanged!

# Join is faster than repeated concatenation
words = ["the", "quick", "brown", "fox"]
print(" ".join(words))    # "the quick brown fox"

# String multiplication
print("-" * 40)           # separator line

# Multiline strings (triple quotes)
prompt = """
You are a helpful assistant.
Answer in JSON format.
""".strip()
print(repr(prompt))`,
        expectedOutput: `Hello, Kumar!
Score: 97.42%
Score: 0.9742
       centered
1,000,000
hello world
Hello World
['hello', 'world']
  hello world
the quick brown fox
----------------------------------------
'You are a helpful assistant.\nAnswer in JSON format.'`
      },
      {
        size: "small",
        title: "Booleans and truthiness",
        language: "python",
        learningGoal: "Python's truthiness rules determine how if statements work with non-boolean values — essential for clean, Pythonic code.",
        code: `# bool is a subclass of int
print(True + True)        # 2
print(True * 5)           # 5
print(int(True))          # 1
print(int(False))         # 0

# Falsy values — all of these are False in boolean context
falsy = [None, False, 0, 0.0, 0j, "", [], {}, set(), ()]
for val in falsy:
    if not val:
        print(f"  {repr(val):<12} is falsy")

# Pythonic patterns using truthiness
items = []
if not items:              # cleaner than: if len(items) == 0
    print("Empty list!")

name = ""
display = name or "Anonymous"   # fallback pattern
print(display)             # Anonymous

# None checks — always use 'is', never '=='
result = None
if result is None:         # correct
    print("No result yet")
# if result == None:       # wrong — works but bad style`,
        expectedOutput: `2
5
1
0
  None         is falsy
  False        is falsy
  0            is falsy
  0.0          is falsy
  0j           is falsy
  ''           is falsy
  []           is falsy
  {}           is falsy
  set()        is falsy
  ()           is falsy
Empty list!
Anonymous
No result yet`
      },
      {
        size: "medium",
        title: "Type hints in practice (Python 3.10+)",
        language: "python",
        learningGoal: "Modern type hint syntax — required knowledge for FastAPI and Pydantic, and for writing code that Pylance can check.",
        code: `from typing import Optional, Union  # still needed for older Python
# Python 3.10+: use X | Y syntax instead

# Basic annotations
def add(a: int, b: int) -> int:
    return a + b

# Optional parameter (can be None)
def greet(name: str, title: str | None = None) -> str:
    if title:
        return f"Hello, {title} {name}"
    return f"Hello, {name}"

# Union types (accept multiple types)
def process(data: str | bytes | int) -> str:
    if isinstance(data, bytes):
        return data.decode("utf-8")
    return str(data)

# List, dict, tuple with type params (Python 3.9+)
def summarize(tokens: list[str]) -> dict[str, int]:
    return {token: len(token) for token in tokens}

# Type aliases
TokenList = list[str]
ModelOutput = dict[str, float]

def run_model(inputs: TokenList) -> ModelOutput:
    return {"logprob": -1.5, "confidence": 0.94}

# Test them
print(add(3, 4))
print(greet("Kumar", "Dr."))
print(greet("Kumar"))
print(process(b"hello bytes"))
print(summarize(["hello", "world"]))
print(run_model(["token1", "token2"]))

# Type hints are NOT enforced at runtime (Python is dynamic)
result = add("oops", "wrong")  # runs fine at runtime!
print(result)                   # 'oopswrong' — no error!`,
        expectedOutput: `7
Hello, Dr. Kumar
Hello, Kumar
hello bytes
{'hello': 5, 'world': 5}
{'logprob': -1.5, 'confidence': 0.94}
oopswrong`
      },
      {
        size: "small",
        title: "is vs == and identity traps",
        description: "This is a classic gotcha. CPython interns small ints and some strings, creating surprising 'is' results.",
        language: "python",
        learningGoal: "Understand why 'is' is for identity and '==' is for value equality — and when CPython's interning can fool you.",
        code: `# == checks VALUE equality
# is checks IDENTITY (same object in memory)

a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)   # True  — same values
print(a is b)   # False — different objects

c = a           # c points to the SAME object
print(c is a)   # True

# CPython interns small ints (-5 to 256)
x = 100
y = 100
print(x is y)   # True  — same interned object
                # (implementation detail, don't rely on it!)

x = 1000
y = 1000
print(x is y)   # False (or True in same expression — undefined)

# ALWAYS use 'is' for None/True/False
value = None
print(value is None)     # correct
print(value == None)     # works but pylance warns, style violation

# Why? Custom objects can override __eq__ to make == None return True
# 'is None' is always safe and unambiguous`,
        expectedOutput: `True
False
True
True
False
True
True`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What does `0.1 + 0.2 == 0.3` evaluate to in Python?", options: ["True", "False", "TypeError", "0.3"], answer: 1, explanation: "False. Python floats are IEEE 754 double precision. 0.1 and 0.2 cannot be represented exactly in binary, so their sum is 0.30000000000000004, not 0.3. Always compare floats with abs(a - b) < epsilon, or use the decimal module for exact arithmetic." },
      { difficulty: "easy", question: "Which of these values is TRUTHY in Python?", options: ["0", '""', "[]", '"0"'], answer: 3, explanation: '"0" is truthy because it\'s a non-empty string. The string contains one character. Falsy values are: 0, 0.0, empty string "", empty list [], empty dict {}, None, False. A non-empty string — even if it contains "0" or "False" — is always truthy.' },
      { difficulty: "easy", question: "What is the correct way to check if a variable `x` is None?", options: ["if x == None:", "if x === None:", "if x is None:", "if not x:"], answer: 2, explanation: "'is None' is the correct and idiomatic way. It checks identity, not equality. '== None' works but is a PEP 8 violation (E711) and can be fooled by objects with custom __eq__. 'not x' is wrong because it catches 0, [], {}, '' and other falsy values, not just None." },
      { difficulty: "medium", question: "What is the output of `bool.__mro__`?", options: ["(<class 'bool'>, <class 'object'>)", "(<class 'bool'>, <class 'int'>, <class 'object'>)", "(<class 'bool'>, <class 'str'>, <class 'object'>)", "TypeError: bool has no MRO"], answer: 1, explanation: "bool inherits from int, which inherits from object. This is why True + True == 2 works — bool values are ints under the hood. True has int value 1, False has int value 0. The MRO (Method Resolution Order) is [bool, int, object]." },
      { difficulty: "medium", question: "Which f-string expression formats the number 0.9742 as '97.42%'?", options: ["`f'{0.9742:.2f}%'`", "`f'{0.9742:.2%}'`", "`f'{0.9742*100:.2f}%'`", "`f'%{0.9742:.2}'`"], answer: 1, explanation: "The :.2% format spec multiplies by 100 and adds the % sign with 2 decimal places. :.2f just formats as a decimal with 2 places (giving '0.97'). The % spec in f-strings is: precision is applied to the value*100, then % is appended." },
      { difficulty: "hard", question: "What does `x = 1000; y = 1000; print(x is y)` print, and why can it vary?", options: ["Always True — Python interns all integers", "Always False — large ints are never the same object", "Depends on context — True in the same expression, False across statements", "SyntaxError"], answer: 2, explanation: "CPython interns integers from -5 to 256 (implementation detail). For 1000, each assignment may create a new object, so x is y might be False. However, in a single expression or at module level, the compiler may optimize and intern them. This behavior is undefined and should never be relied on — always use == for value comparison. Only None, True, and False are guaranteed singletons." }
    ],
    commonMistakes: [
      { mistake: "Comparing floats with ==", whyItHappens: "Intuition from math: 0.1 + 0.2 should be 0.3", howToAvoid: "Use math.isclose(a, b) or abs(a - b) < 1e-9 for float comparisons. For exact decimal arithmetic, use the decimal module." },
      { mistake: "Using 'if x == None:' instead of 'if x is None:'", whyItHappens: "Both work in simple cases, so the difference isn't noticed until a custom __eq__ causes a bug", howToAvoid: "Always use 'is None' / 'is not None'. Ruff (E711) will catch this automatically." },
      { mistake: "Assuming string methods modify the original string", whyItHappens: "In many languages (Java, etc.) string methods can mutate. Python strings are immutable.", howToAvoid: "Always assign the result: result = s.strip() not s.strip(). If you forget, s remains unchanged silently." }
    ],
    cheatSheet: `## Python Data Types Quick Reference
- **int**: arbitrary precision, no overflow. \`2 ** 100\` works
- **float**: IEEE 754 double. \`0.1 + 0.2 != 0.3\`. Use \`math.isclose()\`
- **str**: immutable Unicode sequence. Methods return NEW strings
- **bool**: subclass of int. True==1, False==0
- **None**: use \`is None\` / \`is not None\`, never \`== None\`
- **Falsy values**: \`None, False, 0, 0.0, "", [], {}, set(), ()\`
- **f-string**: \`f"Hello {name}, score={score:.2%}"\`
- **Type hints**: \`def f(x: int, y: str | None = None) -> list[str]:\`
- **Identity**: \`is\` checks same object; \`==\` checks equal value
- **Division**: \`/\` = true division, \`//\` = floor, \`%\` = modulo`,
    flashcards: [
      { front: "What are Python's falsy values?", back: "None, False, 0, 0.0, 0j, empty string \"\", empty list [], empty dict {}, empty set(), empty tuple ()" },
      { front: "Why is 0.1 + 0.2 != 0.3 in Python?", back: "Floats use IEEE 754 binary representation. 0.1 and 0.2 can't be represented exactly in binary, so their sum has a tiny error. Use math.isclose() to compare floats." },
      { front: "What is the difference between 'is' and '=='?", back: "'==' checks value equality (uses __eq__). 'is' checks identity (same object in memory). Always use 'is' for None, True, False checks." },
      { front: "What is bool in relation to int?", back: "bool is a subclass of int. True == 1, False == 0. True + True == 2." },
      { front: "What is the modern Python union type syntax (3.10+)?", back: "str | None instead of Optional[str]. int | str | bytes instead of Union[int, str, bytes]." },
      { front: "Does Python enforce type hints at runtime?", back: "No. Type hints are purely for static analysis tools (mypy, Pylance) and documentation. Python remains dynamically typed. Only Pydantic/FastAPI validate them at runtime." },
      { front: "Why do string methods like .strip() need to be reassigned?", back: "Strings are immutable. Methods return new string objects without modifying the original. Always write: s = s.strip(), not just s.strip()." }
    ]
  },

  // ─── 3. Collections ──────────────────────────────────────────────────
  {
    id: "collections",
    category: "Python Foundations",
    title: "Collections",
    priority: "High",
    icon: "📦",
    estimatedMinutes: 40,
    prerequisites: ["python-syntax"],
    nextTopics: ["control-flow"],
    whyItMatters: "In production AI systems, collections are everywhere: token sequences (lists), vocabulary lookups (dicts), deduplication of seen documents (sets), and configuration objects (namedtuples/dataclasses). A misunderstanding of dict ordering, set hashing, or list mutability causes subtle bugs in RAG pipelines and data preprocessing. Python's `collections` module — especially `Counter`, `defaultdict`, and `deque` — is used daily in NLP and data engineering work.",
    analogy: "Think of a list as a numbered shelf — items in order, retrievable by position, and you can add/remove items. A tuple is a sealed box — same order but you can never change what's inside (useful for keys in dicts). A set is a bag with a bouncer who rejects duplicates. A dict is a filing cabinet with labeled folders — you find things by label (key), not position. The collections module gives you specialized versions of these: Counter is a dict that auto-counts, defaultdict never raises KeyError.",
    content: `## Python Collections

Python's four core collection types plus the \`collections\` module form the backbone of nearly all Python programs.

### list — Ordered, Mutable Sequence
\`\`\`python
tokens = ["hello", "world", "!"]
tokens.append("new")          # O(1) amortized
tokens.insert(0, "first")     # O(n) — shifts everything
tokens.pop()                   # O(1) from end
tokens.pop(0)                  # O(n) — shifts everything
\`\`\`
Lists are backed by dynamic arrays. Appending to the end is O(1) amortized. Inserting/removing from the front is O(n). For efficient queue operations, use \`collections.deque\`.

### tuple — Ordered, Immutable Sequence
Tuples are immutable lists. Key use cases:
- **Dictionary keys** (lists can't be dict keys — unhashable)
- **Multiple return values** from functions
- **Named data** via \`namedtuple\` / \`NamedTuple\`
- **Slightly faster** than lists for iteration (no mutation overhead)

### set — Unordered, Unique Elements
Sets use a hash table internally. Membership testing is O(1) — much faster than O(n) list search.
\`\`\`python
unique_tokens = set(["hello", "world", "hello"])  # {'hello', 'world'}
"hello" in unique_tokens  # O(1) hash lookup
\`\`\`
Elements must be hashable (no lists, dicts, or sets inside sets).

### dict — Key-Value Mapping (Ordered since Python 3.7)
Python 3.7+ dicts maintain **insertion order**. They're backed by hash tables: O(1) average get/set.
\`\`\`python
vocab = {"hello": 0, "world": 1}
vocab.get("unknown", -1)          # safe access with default
vocab.setdefault("new", len(vocab))  # insert only if not present
\`\`\`

### collections Module
- **Counter** — count hashable objects, auto-default to 0
- **defaultdict** — dict that creates missing keys automatically
- **deque** — double-ended queue, O(1) appendleft/popleft
- **OrderedDict** — dict with ordered operations (mostly superseded by regular dict)
- **namedtuple** — lightweight immutable record with named fields`,
    diagrams: [
      {
        type: "static",
        title: "Collection types: mutability and ordering",
        caption: "Choosing the right collection is O(1) expertise",
        svg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace">
  <rect width="560" height="200" fill="#0d1117"/>
  <!-- Headers -->
  <text x="90" y="20" fill="#8b949e" font-size="11" text-anchor="middle">Type</text>
  <text x="210" y="20" fill="#8b949e" font-size="11" text-anchor="middle">Ordered?</text>
  <text x="310" y="20" fill="#8b949e" font-size="11" text-anchor="middle">Mutable?</text>
  <text x="410" y="20" fill="#8b949e" font-size="11" text-anchor="middle">Duplicates?</text>
  <text x="505" y="20" fill="#8b949e" font-size="11" text-anchor="middle">Lookup</text>
  <!-- Row 1: list -->
  <rect x="20" y="28" width="520" height="30" rx="4" fill="#161b22"/>
  <text x="90" y="47" fill="#58a6ff" font-size="12" text-anchor="middle" font-weight="bold">list</text>
  <text x="210" y="47" fill="#7ee787" font-size="12" text-anchor="middle">✓ Yes</text>
  <text x="310" y="47" fill="#7ee787" font-size="12" text-anchor="middle">✓ Yes</text>
  <text x="410" y="47" fill="#7ee787" font-size="12" text-anchor="middle">✓ Yes</text>
  <text x="505" y="47" fill="#f0883e" font-size="12" text-anchor="middle">O(n)</text>
  <!-- Row 2: tuple -->
  <rect x="20" y="60" width="520" height="30" rx="4" fill="#0d1117"/>
  <text x="90" y="79" fill="#d2a8ff" font-size="12" text-anchor="middle" font-weight="bold">tuple</text>
  <text x="210" y="79" fill="#7ee787" font-size="12" text-anchor="middle">✓ Yes</text>
  <text x="310" y="79" fill="#f85149" font-size="12" text-anchor="middle">✗ No</text>
  <text x="410" y="79" fill="#7ee787" font-size="12" text-anchor="middle">✓ Yes</text>
  <text x="505" y="79" fill="#f0883e" font-size="12" text-anchor="middle">O(n)</text>
  <!-- Row 3: set -->
  <rect x="20" y="92" width="520" height="30" rx="4" fill="#161b22"/>
  <text x="90" y="111" fill="#f0883e" font-size="12" text-anchor="middle" font-weight="bold">set</text>
  <text x="210" y="111" fill="#f85149" font-size="12" text-anchor="middle">✗ No</text>
  <text x="310" y="111" fill="#7ee787" font-size="12" text-anchor="middle">✓ Yes</text>
  <text x="410" y="111" fill="#f85149" font-size="12" text-anchor="middle">✗ No</text>
  <text x="505" y="111" fill="#7ee787" font-size="12" text-anchor="middle">O(1)</text>
  <!-- Row 4: dict -->
  <rect x="20" y="124" width="520" height="30" rx="4" fill="#0d1117"/>
  <text x="90" y="143" fill="#7ee787" font-size="12" text-anchor="middle" font-weight="bold">dict</text>
  <text x="210" y="143" fill="#7ee787" font-size="12" text-anchor="middle">✓ 3.7+</text>
  <text x="310" y="143" fill="#7ee787" font-size="12" text-anchor="middle">✓ Yes</text>
  <text x="410" y="143" fill="#f85149" font-size="12" text-anchor="middle">Keys: No</text>
  <text x="505" y="143" fill="#7ee787" font-size="12" text-anchor="middle">O(1)</text>
  <!-- Footnote -->
  <text x="20" y="185" fill="#8b949e" font-size="11">Use set/dict for O(1) membership tests. Use list when order and duplicates matter.</text>
  <text x="20" y="200" fill="#8b949e" font-size="11">Use deque (not list) for O(1) operations at both ends.</text>
</svg>`
      }
    ],
    examples: [
      {
        size: "small",
        title: "Counter — frequency analysis",
        language: "python",
        learningGoal: "Counter is the go-to tool for token frequency analysis in NLP pipelines.",
        pipInstall: "# built-in, no pip needed",
        code: `from collections import Counter

# Count token frequencies (common in NLP)
tokens = ["the", "cat", "sat", "on", "the", "mat", "the", "cat"]
freq = Counter(tokens)

print(freq)
print(freq.most_common(3))   # top 3 most frequent
print(freq["the"])            # 3
print(freq["missing"])        # 0 — no KeyError!

# Counter arithmetic
tokens2 = ["cat", "on", "the", "roof"]
c2 = Counter(tokens2)
combined = freq + c2          # add counts
print(combined.most_common(4))

# Use in NLP: build vocab
vocab = {word: i for i, (word, _) in enumerate(freq.most_common())}
print(vocab)`,
        expectedOutput: `Counter({'the': 3, 'cat': 2, 'sat': 1, 'on': 1, 'mat': 1})
[('the', 3), ('cat', 2), ('sat', 1)]
3
0
[('the', 4), ('cat', 3), ('on', 2), ('sat', 1)]
{'the': 0, 'cat': 1, 'sat': 2, 'on': 3, 'mat': 4}`
      },
      {
        size: "small",
        title: "defaultdict — grouping and auto-initialization",
        language: "python",
        learningGoal: "defaultdict eliminates KeyError guard code — use it whenever you're building a dict of lists or dicts of counters.",
        code: `from collections import defaultdict

# Group tokens by first character (regular dict needs guard)
tokens = ["apple", "ant", "banana", "avocado", "cherry"]

# Old way (verbose):
by_letter_bad = {}
for t in tokens:
    if t[0] not in by_letter_bad:
        by_letter_bad[t[0]] = []
    by_letter_bad[t[0]].append(t)

# Better way with defaultdict:
by_letter = defaultdict(list)
for t in tokens:
    by_letter[t[0]].append(t)   # no KeyError, auto-creates []

print(dict(by_letter))

# defaultdict(int) for counting
word_lengths = defaultdict(int)
for t in tokens:
    word_lengths[len(t)] += 1   # no need to check existence

print(dict(word_lengths))`,
        expectedOutput: `{'a': ['apple', 'ant', 'avocado'], 'b': ['banana'], 'c': ['cherry']}
{5: 2, 3: 1, 6: 2, 6: 1}`
      },
      {
        size: "small",
        title: "deque — efficient queue and sliding window",
        language: "python",
        learningGoal: "deque gives O(1) appendleft/popleft. Use it for sliding window problems and message queues — never list.insert(0) or list.pop(0).",
        code: `from collections import deque

# Sliding window (common in NLP context tracking)
text = ["The", "cat", "sat", "on", "the", "mat", "near", "the", "door"]
window_size = 3

window = deque(maxlen=window_size)   # auto-evicts oldest
for word in text:
    window.append(word)
    if len(window) == window_size:
        print(list(window))

# As a queue (FIFO)
queue = deque(["task1", "task2", "task3"])
queue.append("task4")          # add to right: O(1)
queue.appendleft("urgent")     # add to left: O(1)
task = queue.popleft()          # process left: O(1)
print(f"Processed: {task}")
print(f"Remaining: {list(queue)}")`,
        expectedOutput: `['The', 'cat', 'sat']
['cat', 'sat', 'on']
['sat', 'on', 'the']
['on', 'the', 'mat']
['the', 'mat', 'near']
['mat', 'near', 'the']
['near', 'the', 'door']
Processed: urgent
Remaining: ['task1', 'task2', 'task3', 'task4']`
      },
      {
        size: "medium",
        title: "dict operations — the production patterns",
        language: "python",
        learningGoal: "These dict patterns appear in every production Python codebase: .get(), .setdefault(), merging, comprehensions.",
        code: `# Safe access patterns
config = {"model": "gpt-4", "temperature": 0.7}

# .get() with default — never raises KeyError
model = config.get("model", "gpt-3.5-turbo")
timeout = config.get("timeout", 30)          # returns 30 if missing
print(f"Model: {model}, Timeout: {timeout}")

# .setdefault() — insert only if key missing
config.setdefault("max_tokens", 1024)        # adds key
config.setdefault("model", "changed")        # NOT changed — already exists
print(config["model"])       # still "gpt-4"

# Merge dicts (Python 3.9+)
defaults = {"temperature": 0.5, "top_p": 1.0, "max_tokens": 512}
overrides = {"temperature": 0.9, "model": "gpt-4"}
merged = defaults | overrides               # overrides wins
print(merged)

# Update in-place
defaults |= overrides                       # same but modifies defaults
print(defaults)

# dict from parallel lists
keys = ["a", "b", "c"]
values = [1, 2, 3]
d = dict(zip(keys, values))
print(d)

# Iterate patterns
vocab = {"hello": 0, "world": 1, "!": 2}
for word, idx in vocab.items():
    print(f"  {word!r:10} → {idx}")`,
        expectedOutput: `Model: gpt-4, Timeout: 30
gpt-4
{'temperature': 0.9, 'top_p': 1.0, 'max_tokens': 512, 'model': 'gpt-4'}
{'temperature': 0.9, 'top_p': 1.0, 'max_tokens': 512, 'model': 'gpt-4'}
{'a': 1, 'b': 2, 'c': 3}
  'hello'    → 0
  'world'    → 1
  '!'        → 2`
      },
      {
        size: "medium",
        title: "namedtuple and NamedTuple — lightweight records",
        language: "python",
        learningGoal: "namedtuple gives you readable, immutable records with named fields — perfect for tokens, embeddings, and config objects before you need a full Pydantic model.",
        code: `from collections import namedtuple
from typing import NamedTuple  # typed version

# Old style: collections.namedtuple
Token = namedtuple("Token", ["text", "id", "pos"])
t = Token(text="hello", id=15496, pos="NOUN")
print(t)
print(t.text, t.id)       # named access
print(t[0], t[1])         # index access (also works)
# t.text = "changed"      # AttributeError — immutable!

# Modern style: typing.NamedTuple (with type hints)
class EmbeddingResult(NamedTuple):
    vector: list[float]
    token_count: int
    model: str = "text-embedding-3-small"  # default value

result = EmbeddingResult(
    vector=[0.1, 0.2, 0.3],
    token_count=5,
)
print(result)
print(result.model)        # "text-embedding-3-small"
print(result._asdict())    # convert to dict

# Useful: can be used as dict key (immutable!)
cache = {}
key = Token(text="hello", id=15496, pos="NOUN")
cache[key] = "cached_result"
print(cache[key])`,
        expectedOutput: `Token(text='hello', id=15496, pos='NOUN')
hello 15496
hello 15496
EmbeddingResult(vector=[0.1, 0.2, 0.3], token_count=5, model='text-embedding-3-small')
text-embedding-3-small
{'vector': [0.1, 0.2, 0.3], 'token_count': 5, 'model': 'text-embedding-3-small'}
cached_result`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What is the time complexity of checking `x in my_set` for a Python set?", options: ["O(n) — scans all elements", "O(log n) — binary search", "O(1) — hash table lookup", "O(n²) — nested comparison"], answer: 2, explanation: "Sets use a hash table. Membership testing is O(1) average case — it hashes the element and checks one slot. This is why you should convert a list to a set before repeated membership tests. Contrast with list's O(n) linear scan." },
      { difficulty: "easy", question: "What does `Counter(['a','b','a','c','a'])['missing']` return?", options: ["KeyError", "None", "0", "-1"], answer: 2, explanation: "Counter inherits from dict but overrides __missing__ to return 0 for non-existent keys instead of raising KeyError. This is what makes Counter great for frequency counting — you can safely access any key without guards." },
      { difficulty: "medium", question: "Why can a tuple be used as a dictionary key but a list cannot?", options: ["Tuples are faster", "Lists are too large", "Tuples are hashable (immutable); lists are unhashable (mutable)", "Python has a restriction on list keys"], answer: 2, explanation: "Dict keys must be hashable. Hashability requires that an object's hash value never changes — which means it must be immutable. Tuples of hashable elements are immutable and thus hashable. Lists are mutable, so hash(some_list) raises TypeError." },
      { difficulty: "medium", question: "What is the output of: `d = defaultdict(list); d['key'].append(1); print(d['key'])`?", options: ["KeyError: 'key'", "[1]", "None", "defaultdict error"], answer: 1, explanation: "[1]. defaultdict(list) creates an empty list when you access a missing key. So d['key'] on line 1 creates [] and appends 1 to it. On the next d['key'] access, the list [1] is retrieved. This is the whole point of defaultdict — eliminates KeyError checks for grouping patterns." },
      { difficulty: "hard", question: "What is the time complexity of `list.pop(0)` vs `deque.popleft()`?", options: ["Both O(1)", "list.pop(0) is O(n), deque.popleft() is O(1)", "Both O(n)", "list.pop(0) is O(1), deque.popleft() is O(n)"], answer: 1, explanation: "list is backed by a dynamic array. pop(0) removes the first element and must shift ALL remaining n-1 elements left — O(n). deque is backed by a doubly-linked list of fixed-size blocks. popleft() just advances the head pointer — O(1). For queue workloads (FIFO), always use deque, not list." }
    ],
    commonMistakes: [
      { mistake: "Using a list for repeated membership tests instead of a set", whyItHappens: "Lists feel natural and familiar", howToAvoid: "If you're checking `x in container` more than once, convert to a set first: seen = set(items). O(1) vs O(n) matters at scale." },
      { mistake: "Mutating a list while iterating over it", whyItHappens: "Seems natural to remove items in a loop", howToAvoid: "Iterate over a copy: for item in list(my_list):, or use list comprehension to build a new filtered list." },
      { mistake: "Using list.pop(0) or list.insert(0, x) in a loop", whyItHappens: "List looks like a queue", howToAvoid: "Use collections.deque for O(1) operations at both ends. list.pop(0) is O(n) and will bottleneck high-throughput pipelines." }
    ],
    cheatSheet: `## Collections Cheat Sheet
- **list**: ordered, mutable, allows duplicates. Append O(1), insert(0) O(n)
- **tuple**: ordered, immutable, hashable — use as dict keys
- **set**: unordered, unique, O(1) membership test. Elements must be hashable
- **dict**: key-value, ordered (3.7+), O(1) get/set. Keys must be hashable
- **Counter(iterable)**: count frequencies, missing keys return 0
- **defaultdict(list)**: dict with auto-initialized missing keys
- **deque(maxlen=n)**: O(1) append/appendleft/pop/popleft
- **namedtuple("T", ["a","b"])**: immutable record with named fields
- **Safe dict access**: \`d.get("key", default)\`
- **Merge dicts (3.9+)**: \`merged = dict1 | dict2\`
- **Dict from lists**: \`dict(zip(keys, values))\``,
    flashcards: [
      { front: "Which Python collection gives O(1) membership testing?", back: "set and dict (keys). They use hash tables. list gives O(n) linear scan." },
      { front: "What is the difference between defaultdict and regular dict?", back: "defaultdict(factory) automatically creates a default value using the factory when a missing key is accessed, instead of raising KeyError. defaultdict(list) creates [], defaultdict(int) creates 0." },
      { front: "Why use deque instead of list for a queue?", back: "deque.popleft() is O(1). list.pop(0) is O(n) because it must shift all remaining elements. For FIFO queues, always use deque." },
      { front: "What does Counter(['a','a','b'])['missing'] return?", back: "0 — Counter returns 0 for missing keys instead of raising KeyError." },
      { front: "How do you merge two dicts in Python 3.9+?", back: "merged = dict1 | dict2 (right side wins on conflict). Or dict1 |= dict2 to update in place." },
      { front: "Can a list be a dictionary key? Why or why not?", back: "No. Dict keys must be hashable (immutable). Lists are mutable, so hash() raises TypeError. Use a tuple instead." },
      { front: "What is namedtuple useful for?", back: "Lightweight immutable records with named fields. More readable than plain tuples, lighter than full classes. Used for tokens, config objects, return types." }
    ]
  },

  // ─── 4. Control Flow ─────────────────────────────────────────────────
  {
    id: "control-flow",
    category: "Python Foundations",
    title: "Control Flow",
    priority: "High",
    icon: "🔀",
    estimatedMinutes: 30,
    prerequisites: ["collections"],
    nextTopics: ["functions"],
    whyItMatters: "Control flow is the skeleton of every algorithm. Knowing Python-specific patterns — enumerate instead of range(len()), zip for parallel iteration, the walrus operator for assignment-in-condition, and for-else for search loops — separates Python programmers from programmers who write Python. These patterns appear constantly in data processing pipelines, token batching, and agent tool execution loops.",
    analogy: "If statements are road forks — take this path or that one. Loops are conveyor belts — process each item in turn. enumerate adds a ticket number to each item on the belt. zip runs two belts in sync. break is the emergency stop. for-else is asking 'did the belt finish without me stopping it?' — used to detect whether a loop completed normally.",
    content: `## Control Flow

Python's control flow is conventional (if/elif/else, for, while) but has Pythonic patterns that dramatically improve readability.

### if / elif / else
No parentheses needed. Indentation defines blocks. Use \`elif\` for chained conditions (Python has no \`switch\`).

\`\`\`python
match score:  # Python 3.10+ structural pattern matching
    case s if s >= 90: print("A")
    case s if s >= 80: print("B")
    case _: print("C or below")
\`\`\`

### for Loops and Iteration
Python for loops iterate over any **iterable** — lists, dicts, files, generators, custom objects with \`__iter__\`.

**Key patterns:**
- \`enumerate(items, start=1)\` — get index AND value
- \`zip(a, b)\` — parallel iteration (stops at shortest)
- \`zip_longest(a, b, fillvalue=None)\` — itertools version, pads shortest
- \`reversed(items)\` — iterate backward
- \`sorted(items, key=fn)\` — sorted iteration

### while Loops
Use when you don't know iteration count in advance: polling, retry logic, stream reading.

### break, continue, and for-else
- \`break\` — exit loop immediately
- \`continue\` — skip to next iteration
- \`for...else\` — the \`else\` block runs only if loop completed **without** a \`break\`

### The Walrus Operator := (Python 3.8+)
Assigns and tests in one expression. Most useful in while loops and comprehensions.

\`\`\`python
while chunk := file.read(8192):
    process(chunk)
\`\`\``,
    diagrams: [
      {
        type: "static",
        title: "for-else pattern — search with sentinel",
        caption: "for-else is Python's built-in 'search succeeded/failed' pattern",
        svg: `<svg viewBox="0 0 540 220" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace;font-size:12">
  <rect width="540" height="220" fill="#0d1117"/>
  <rect x="20" y="10" width="500" height="60" rx="6" fill="#161b22" stroke="#30363d"/>
  <text x="35" y="30" fill="#58a6ff" font-size="13">for</text><text x="60" y="30" fill="#e6edf3" font-size="13"> item in collection:</text>
  <text x="55" y="52" fill="#e6edf3" font-size="12">    if condition(item):</text>
  <text x="55" y="67" fill="#f85149" font-size="12">        break</text>
  <text x="20" y="90" fill="#7ee787" font-size="13">else:</text>
  <text x="35" y="108" fill="#7ee787" font-size="12">    # Runs ONLY if no break occurred</text>
  <!-- Break path -->
  <rect x="20" y="125" width="230" height="40" rx="6" fill="#2d1418" stroke="#f85149"/>
  <text x="35" y="143" fill="#f85149" font-size="12" font-weight="bold">break was hit →</text>
  <text x="35" y="158" fill="#c9d1d9" font-size="11">item found, else skipped</text>
  <!-- No break path -->
  <rect x="290" y="125" width="230" height="40" rx="6" fill="#0d2016" stroke="#238636"/>
  <text x="305" y="143" fill="#7ee787" font-size="12" font-weight="bold">no break →</text>
  <text x="305" y="158" fill="#c9d1d9" font-size="11">else block executes</text>
  <!-- Example -->
  <text x="20" y="190" fill="#8b949e" font-size="11">Use case: search a list, execute 'not found' logic only in else</text>
  <text x="20" y="206" fill="#8b949e" font-size="11">Replaces: found = False; if not found: ... pattern</text>
</svg>`
      }
    ],
    examples: [
      {
        size: "small",
        title: "enumerate and zip",
        language: "python",
        learningGoal: "These two built-ins replace 90% of manual index tracking. Use them constantly in data processing.",
        code: `# enumerate: index + value in one shot
tokens = ["the", "quick", "brown", "fox"]

# Old way (don't do this):
for i in range(len(tokens)):
    print(f"{i}: {tokens[i]}")

# Pythonic way:
for i, token in enumerate(tokens):
    print(f"{i}: {token}")

print("---")
# enumerate with custom start index
for i, token in enumerate(tokens, start=1):
    print(f"Token {i}: {token}")

print("---")
# zip: parallel iteration (stops at shortest)
words = ["hello", "world"]
ids = [15496, 995]
scores = [0.9, 0.8, 0.7]   # longer — truncated!

for word, id_, score in zip(words, ids, scores):
    print(f"{word!r:10} id={id_} score={score}")`,
        expectedOutput: `0: the
1: quick
2: brown
3: fox
---
Token 1: the
Token 2: quick
Token 3: brown
Token 4: fox
---
'hello'    id=15496 score=0.9
'world'    id=995 score=0.8`
      },
      {
        size: "small",
        title: "for-else for search logic",
        language: "python",
        learningGoal: "for-else replaces the 'found flag' pattern. Clean way to express 'searched everything, nothing matched'.",
        code: `# Find first token matching criteria
tokens = ["the", "cat", "sat", "on", "the", "mat"]
target = "cat"

# Without for-else (common but verbose):
found = False
for token in tokens:
    if token == target:
        found = True
        break
if not found:
    print("Not found")

print("---")

# WITH for-else (Pythonic):
for token in tokens:
    if token == target:
        print(f"Found: {token!r}")
        break
else:
    print(f"{target!r} not found in tokens")

# Real example: check if any stop word present
stop_words = {"the", "a", "an", "on", "in"}
for token in tokens:
    if token in stop_words:
        print(f"Has stop word: {token!r}")
        break
else:
    print("No stop words found")`,
        expectedOutput: `---
Found: 'cat'
Has stop word: 'the'`
      },
      {
        size: "medium",
        title: "Walrus operator and advanced loop patterns",
        language: "python",
        learningGoal: "Walrus := is essential for clean while loops reading streams or polling APIs.",
        code: `import io

# Walrus operator := (Python 3.8+)
# Assign and test in one expression

# Reading chunks from a stream
data = b"Hello World! This is a test stream." * 3
stream = io.BytesIO(data)
chunks = []
while chunk := stream.read(12):   # assign + test
    chunks.append(len(chunk))
print(f"Chunks: {chunks}")

# In a list comprehension: filter while computing
numbers = [1, 4, 9, 16, 25, 36, 49]
# Get squares of even sqrt values
results = [y for x in numbers if (y := x**0.5) == int(y)]
print(f"Perfect squares: {results}")

# match statement (Python 3.10+) — structural pattern matching
def process_command(cmd: dict):
    match cmd:
        case {"action": "search", "query": str(q)}:
            return f"Searching for: {q}"
        case {"action": "embed", "text": str(t), "model": str(m)}:
            return f"Embedding '{t}' with {m}"
        case {"action": "embed", "text": str(t)}:
            return f"Embedding '{t}' with default model"
        case _:
            return f"Unknown command: {cmd}"

print(process_command({"action": "search", "query": "transformers"}))
print(process_command({"action": "embed", "text": "hello", "model": "ada"}))
print(process_command({"action": "embed", "text": "world"}))
print(process_command({"action": "delete"}))`,
        expectedOutput: `Chunks: [12, 12, 12, 12, 12, 12, 12, 12, 6]
Perfect squares: [1.0, 4.0, 9.0, 16.0, 25.0, 36.0, 49.0]
Searching for: transformers
Embedding 'hello' with ada
Embedding 'world' with default model
Unknown command: {'action': 'delete'}`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What does the `else` clause of a `for` loop execute?", options: ["When the loop body raises an exception", "When the loop finishes without hitting a `break`", "When the loop runs at least once", "Always, after the loop"], answer: 1, explanation: "The for-else pattern: the else block runs only if the loop completed normally (no break). If break was hit, else is skipped. This is Python's built-in 'search succeeded/failed' pattern — cleaner than using a boolean 'found' flag." },
      { difficulty: "easy", question: "What does `enumerate(['a','b','c'], start=1)` yield?", options: ["[(0,'a'),(1,'b'),(2,'c')]", "[(1,'a'),(2,'b'),(3,'c')]", "['a','b','c']", "[(1,0,'a'),(2,1,'b'),(3,2,'c')]"], answer: 1, explanation: "enumerate with start=1 yields (1,'a'), (2,'b'), (3,'c'). The start parameter sets the first index value. Default is 0. This is useful for 1-based display numbering while keeping 0-based logic." },
      { difficulty: "medium", question: "What does `while chunk := f.read(8192):` do?", options: ["Syntax error — walrus not allowed in while", "Reads 8192 bytes, assigns to chunk, continues while chunk is truthy", "Reads file in reverse", "Reads exactly 8192 bytes and stops"], answer: 1, explanation: "The walrus operator := assigns f.read(8192) to chunk AND uses it as the while condition. When f.read() returns b'' (empty bytes at EOF), it's falsy, loop stops. This replaces the verbose: `chunk = f.read(8192); while chunk: ... chunk = f.read(8192)`." },
      { difficulty: "hard", question: "Given `for i, x in enumerate(zip([1,2],[3,4,5]))`, what are the values of i and x in the first iteration?", options: ["i=0, x=(1,3)", "i=1, x=(1,3)", "i=0, x=1", "TypeError"], answer: 0, explanation: "zip([1,2],[3,4,5]) stops at the shortest — yielding (1,3),(2,4). enumerate wraps it: first yield is (0,(1,3)). So i=0, x=(1,3). The 5 from the second list is never reached. enumerate+zip is a common pattern for parallel indexed iteration." }
    ],
    commonMistakes: [
      { mistake: "Using range(len(items)) instead of enumerate(items)", whyItHappens: "Habit from C/Java where you need an explicit index", howToAvoid: "In Python, for i in range(len(items)) is almost always replaceable with for i, item in enumerate(items). It's shorter, more readable, and less error-prone." },
      { mistake: "Modifying a dict while iterating over it", whyItHappens: "Seems natural to delete keys during iteration", howToAvoid: "Iterate over a copy: for key in list(d.keys()): or collect keys to delete first, then delete after." }
    ],
    cheatSheet: `## Control Flow Cheat Sheet
- **enumerate**: \`for i, item in enumerate(items, start=0):\`
- **zip**: \`for a, b in zip(list1, list2):\` (stops at shortest)
- **zip_longest**: \`from itertools import zip_longest\`
- **reversed**: \`for item in reversed(items):\`
- **for-else**: \`else\` runs only if no \`break\` occurred
- **walrus**: \`while chunk := f.read(8192):\` — assign + test
- **match (3.10+)**: structural pattern matching, replaces switch
- **break**: exit loop immediately
- **continue**: skip to next iteration`,
    flashcards: [
      { front: "When does the else block of a for loop execute?", back: "Only when the loop finishes WITHOUT hitting a break. Used for 'item not found' logic." },
      { front: "What is the walrus operator := used for?", back: "Assigns a value AND tests it in one expression. Most useful in while loops: while chunk := f.read(8192). Python 3.8+" },
      { front: "Why use enumerate() over range(len())?", back: "enumerate gives both index and value, is more Pythonic, works on any iterable (not just indexable ones), and has cleaner syntax." },
      { front: "What does zip() do with lists of different lengths?", back: "Stops at the shortest list, silently discarding extra items from longer lists. Use itertools.zip_longest for padding behavior." }
    ]
  },

  // ─── 5. Functions ────────────────────────────────────────────────────
  {
    id: "functions",
    category: "Python Foundations",
    title: "Functions",
    priority: "High",
    icon: "⚙️",
    estimatedMinutes: 40,
    prerequisites: ["control-flow"],
    nextTopics: ["comprehensions"],
    whyItMatters: "Functions are the unit of reuse and abstraction in Python. Understanding *args, **kwargs, and closures is what separates someone who can read Python from someone who can write robust library code. FastAPI's route decorators, LangChain's LCEL pipes, and every decorator you'll ever use are built on these foundations. Knowing default argument mutability is the source of one of Python's most famous bugs.",
    analogy: "A function is a recipe. *args is 'add as many extra ingredients as you like (as a list)'. **kwargs is 'add any named options from the pantry (as a dict)'. A closure is a recipe that was written while visiting someone's kitchen and secretly remembers what was in their fridge. A lambda is a sticky note with a quick recipe — no name, just the instructions.",
    content: `## Functions

### Positional, Keyword, and Default Arguments
\`\`\`python
def create_prompt(text, model="gpt-4", temperature=0.7, max_tokens=1024):
    ...
# Call styles:
create_prompt("hello")                     # positional
create_prompt("hello", temperature=0.9)   # keyword override
create_prompt("hello", "gpt-3.5", 0.5)   # all positional
\`\`\`

### *args and **kwargs
- \`*args\` collects extra positional arguments into a **tuple**
- \`**kwargs\` collects extra keyword arguments into a **dict**

### The Mutable Default Argument Bug
**One of Python's most famous bugs**: never use mutable values (lists, dicts, sets) as default arguments.
\`\`\`python
# BUG — default list is created ONCE, shared across all calls
def append_to(item, lst=[]):   # lst created once at function definition!
    lst.append(item)
    return lst
print(append_to(1))  # [1]
print(append_to(2))  # [1, 2] — NOT [2]!

# FIX — use None as sentinel
def append_to(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
\`\`\`

### Closures
A closure is a function that captures variables from its enclosing scope. The captured variables persist as long as the function exists.

### Lambda Functions
Single-expression anonymous functions. Use for sort keys, filter predicates, and simple callbacks. For anything with a body, use \`def\`.

### Modules and Imports
Python files are modules. \`import\` loads and caches them. \`from x import y\` binds specific names. Relative imports (\`from . import utils\`) work within packages.

### functools Utilities
- \`functools.partial\` — pre-fill function arguments
- \`functools.lru_cache\` — memoize function results
- \`functools.wraps\` — preserve function metadata in decorators`,
    diagrams: [
      {
        type: "static",
        title: "Argument types and order rules",
        caption: "Python argument order: positional → *args → keyword-only → **kwargs",
        svg: `<svg viewBox="0 0 560 160" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace;font-size:12">
  <rect width="560" height="160" fill="#0d1117"/>
  <text x="20" y="25" fill="#e6edf3" font-size="13" font-weight="bold">def f(</text>
  <!-- Positional -->
  <rect x="75" y="8" width="90" height="24" rx="4" fill="#1f6feb"/>
  <text x="120" y="24" fill="#fff" font-size="11" text-anchor="middle">positional</text>
  <text x="170" y="24" fill="#e6edf3" font-size="12">,</text>
  <!-- *args -->
  <rect x="180" y="8" width="70" height="24" rx="4" fill="#238636"/>
  <text x="215" y="24" fill="#fff" font-size="11" text-anchor="middle">*args</text>
  <text x="255" y="24" fill="#e6edf3" font-size="12">,</text>
  <!-- keyword-only -->
  <rect x="265" y="8" width="110" height="24" rx="4" fill="#9e6a03"/>
  <text x="320" y="24" fill="#fff" font-size="11" text-anchor="middle">keyword=default</text>
  <text x="380" y="24" fill="#e6edf3" font-size="12">,</text>
  <!-- **kwargs -->
  <rect x="390" y="8" width="80" height="24" rx="4" fill="#6e40c9"/>
  <text x="430" y="24" fill="#fff" font-size="11" text-anchor="middle">**kwargs</text>
  <text x="475" y="24" fill="#e6edf3" font-size="12">):</text>
  <!-- Arrows and explanations -->
  <text x="75" y="55" fill="#58a6ff" font-size="11">Required, by position</text>
  <text x="180" y="55" fill="#7ee787" font-size="11">Extra positional → tuple</text>
  <text x="265" y="55" fill="#f0883e" font-size="11">Optional, keyword</text>
  <text x="390" y="55" fill="#d2a8ff" font-size="11">Extra kwargs → dict</text>
  <!-- Example call -->
  <rect x="20" y="75" width="520" height="70" rx="6" fill="#161b22" stroke="#30363d"/>
  <text x="35" y="95" fill="#8b949e" font-size="11"># Example call:</text>
  <text x="35" y="112" fill="#e6edf3" font-size="12">f("required", 1, 2, 3, keyword="val", extra="more")</text>
  <text x="35" y="130" fill="#58a6ff" font-size="11">"required" → positional</text>
  <text x="200" y="130" fill="#7ee787" font-size="11">1,2,3 → *args=(1,2,3)</text>
  <text x="360" y="130" fill="#d2a8ff" font-size="11">extra → **kwargs</text>
</svg>`
      }
    ],
    examples: [
      {
        size: "small",
        title: "args, kwargs, and argument unpacking",
        language: "python",
        learningGoal: "*args and **kwargs are the foundation of Python's flexible APIs — used in every major framework's function signatures.",
        code: `# *args — extra positional args collected into a tuple
def log_tokens(*tokens: str) -> None:
    for i, t in enumerate(tokens):
        print(f"  [{i}] {t!r}")

log_tokens("hello", "world", "!")

# **kwargs — extra keyword args collected into a dict
def create_llm_request(prompt: str, **kwargs) -> dict:
    defaults = {"model": "gpt-4", "temperature": 0.7, "max_tokens": 1024}
    return {**defaults, "messages": [{"role": "user", "content": prompt}], **kwargs}

req = create_llm_request("Hello!", temperature=0.9, stream=True)
print(req)

# Unpacking: * and ** in CALLS (inverse of collection)
config = {"temperature": 0.5, "model": "gpt-3.5-turbo"}
args_list = ["Explain transformers"]
result = create_llm_request(*args_list, **config)
print(result["model"])`,
        expectedOutput: `  [0] 'hello'
  [1] 'world'
  [2] '!'
{'model': 'gpt-4', 'temperature': 0.9, 'max_tokens': 1024, 'messages': [{'role': 'user', 'content': 'Hello!'}], 'stream': True}
gpt-3.5-turbo`
      },
      {
        size: "small",
        title: "The mutable default argument bug",
        description: "This is THE classic Python gotcha. Seen in production code regularly. Spot it here.",
        language: "python",
        learningGoal: "Default arguments are evaluated ONCE at function definition, not on each call. Mutable defaults accumulate state across calls.",
        code: `# ── THE BUG ──────────────────────────────────────────────────────
def add_message_bad(msg: str, history: list = []) -> list:
    history.append(msg)   # mutates the ONE shared default list!
    return history

print(add_message_bad("Hello"))      # ['Hello']
print(add_message_bad("World"))      # ['Hello', 'World'] ← BUG: accumulated!
print(add_message_bad("!"))          # ['Hello', 'World', '!'] ← still accumulating!

# Why? The [] is created ONCE when the function is defined.
# It's reused (not recreated) on every call without explicit history arg.

# ── THE FIX ──────────────────────────────────────────────────────
def add_message_good(msg: str, history: list | None = None) -> list:
    if history is None:
        history = []          # NEW list created on every call
    history.append(msg)
    return history

print(add_message_good("Hello"))    # ['Hello']
print(add_message_good("World"))    # ['World'] ← correct: fresh list each time
h = ["existing"]
print(add_message_good("New", h))   # ['existing', 'New'] ← explicit history works`,
        expectedOutput: `['Hello']
['Hello', 'World']
['Hello', 'World', '!']
['Hello']
['World']
['existing', 'New']`
      },
      {
        size: "medium",
        title: "Closures and functools",
        language: "python",
        learningGoal: "Closures capture variables by reference. functools.partial and lru_cache are essential production utilities.",
        code: `from functools import partial, lru_cache

# Closure: inner function captures outer variable by REFERENCE
def make_multiplier(factor: float):
    def multiply(x: float) -> float:
        return x * factor    # 'factor' is closed over
    return multiply

double = make_multiplier(2.0)
triple = make_multiplier(3.0)
print(double(5))     # 10.0
print(triple(5))     # 15.0

# functools.partial: pre-fill arguments (like a closure shortcut)
def call_llm(prompt: str, model: str, temperature: float) -> str:
    return f"[{model}@{temperature}] {prompt[:20]}..."

# Create specialized versions
gpt4_call = partial(call_llm, model="gpt-4", temperature=0.7)
claude_call = partial(call_llm, model="claude-3-5-sonnet", temperature=0.5)

print(gpt4_call("Explain attention"))
print(claude_call("Explain attention"))

# functools.lru_cache: memoize expensive functions
@lru_cache(maxsize=128)
def compute_embedding(text: str, model: str = "ada") -> tuple:
    # Simulate expensive API call
    return tuple(hash(c) % 100 for c in text[:5])

print(compute_embedding("hello", "ada"))
print(compute_embedding("hello", "ada"))   # cache hit — same result instantly
print(compute_embedding.cache_info())       # hits, misses, maxsize, currsize`,
        expectedOutput: `10.0
15.0
[gpt-4@0.7] Explain attention...
[claude-3-5-sonnet@0.5] Explain attention...
(68, 5, 12, 12, 47)
(68, 5, 12, 12, 47)
CacheInfo(hits=1, misses=1, maxsize=128, currsize=1)`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What type does *args collect extra positional arguments into?", options: ["list", "tuple", "dict", "set"], answer: 1, explanation: "Inside the function, *args is a tuple (immutable). This is important — you can't do args.append(). To work with a mutable copy: list(args). **kwargs collects keyword arguments into a dict." },
      { difficulty: "medium", question: "Why does using a mutable default argument (like `def f(x=[]):`) cause bugs?", options: ["Python copies the list on each call", "Default arguments are evaluated once at function definition, not on each call", "Lists aren't allowed as default arguments", "Python automatically resets defaults after each call"], answer: 1, explanation: "Default argument objects are created when the def statement executes — once. If it's a mutable object (list, dict), all calls that use the default share the SAME object. Mutations accumulate across calls. Fix: use None as default and create a new object inside the function." },
      { difficulty: "hard", question: "What does `from functools import partial; f = partial(print, end='')` create?", options: ["A class", "A new function that calls print() with end='' pre-filled, waiting for positional args", "A generator", "A coroutine"], answer: 1, explanation: "partial pre-fills one or more arguments of a function. f = partial(print, end='') creates a callable that behaves like print(..., end=''). Calling f('hello') is equivalent to print('hello', end=''). Common use: partial(sorted, key=str.lower) or pre-filling API clients with credentials." }
    ],
    commonMistakes: [
      { mistake: "Using mutable default arguments (def f(x=[]))", whyItHappens: "Looks like it should create a fresh list each call", howToAvoid: "Always use None as default for mutable types: def f(x=None): if x is None: x = []" },
      { mistake: "Forgetting that inner functions capture by reference, not value", whyItHappens: "Expecting each closure to capture the value of the variable at creation time", howToAvoid: "Test: create_functions = [lambda i=i: i*i for i in range(5)]. The i=i forces capture by value. Without it, all lambdas see i=4 (final value)." }
    ],
    cheatSheet: `## Functions Cheat Sheet
- **Signature order**: positional, *args, keyword-only, **kwargs
- ***args**: extra positional → tuple inside function
- ****kwargs**: extra keyword → dict inside function
- **Default gotcha**: never use mutable defaults — use None sentinel
- **Unpacking in call**: f(*list, **dict)
- **Lambda**: \`key=lambda x: x.lower()\` — one expression only
- **partial**: \`from functools import partial; f = partial(fn, arg1=val)\`
- **lru_cache**: \`@lru_cache(maxsize=128)\` — memoize pure functions
- **Closure**: inner function captures outer variables by reference`,
    flashcards: [
      { front: "What is the mutable default argument bug?", back: "Default argument objects are created ONCE at function definition. Mutable defaults ([], {}) accumulate mutations across calls. Fix: use None as default and create a new object inside." },
      { front: "What does *args collect in a function signature?", back: "Extra positional arguments, as a tuple. **kwargs collects extra keyword arguments as a dict." },
      { front: "What does functools.partial do?", back: "Pre-fills some arguments of a function, returning a new callable. partial(print, end='') creates a print function that always uses end=''." },
      { front: "What does functools.lru_cache do?", back: "Memoizes (caches) function results keyed by arguments. @lru_cache(maxsize=128) caches the last 128 unique calls, returning cached results immediately on repeats." }
    ]
  },

  // ─── 6. Comprehensions ──────────────────────────────────────────────
  {
    id: "comprehensions",
    category: "Python Foundations",
    title: "Comprehensions & Generator Expressions",
    priority: "High",
    icon: "🔁",
    estimatedMinutes: 30,
    prerequisites: ["functions"],
    nextTopics: ["oop"],
    whyItMatters: "Comprehensions are the most Pythonic way to transform and filter data. They're faster than equivalent for loops (built in C), read left-to-right like English, and are standard in every production Python codebase. Generator expressions are the memory-efficient version — critical when processing large document corpora or token streams where materializing a full list would exhaust RAM.",
    analogy: "A list comprehension is a factory assembly line: 'for every raw part, apply transformation, keep only the ones passing QC'. A generator expression is the same line but without a warehouse — parts come out one at a time, on demand. The warehouse (list) costs memory upfront; the on-demand generator costs almost nothing but processes one item at a time.",
    content: `## Comprehensions

Comprehensions transform iterables into new collections in a single, readable expression.

### List Comprehension
\`[expression for item in iterable if condition]\`

The if clause is optional. Both \`expression\` and \`condition\` can be arbitrary expressions.

### Dict Comprehension
\`{key_expr: value_expr for item in iterable if condition}\`

### Set Comprehension
\`{expression for item in iterable if condition}\` — note curly braces, no colon.

### Nested Comprehensions
\`[expr for outer in a for inner in b]\` — equivalent to nested for loops. Read left to right.

### Generator Expressions
Same syntax as list comprehensions but with **parentheses** instead of brackets: \`(expr for item in it)\`

Generators are **lazy** — they produce one item at a time. They don't store all values in memory. They're iterators: can only be traversed once.

### When to Use Which
- **list**: when you need random access, len(), or multiple passes
- **generator**: when processing large data or piping into another function (sum, max, any, all)
- **dict**: key-value transformations
- **set**: deduplication

### Performance
Comprehensions are ~20-30% faster than equivalent \`for\` loop + \`append()\` because the interpreter knows the pattern and optimizes it. Generators are faster still for streaming use cases.`,
    diagrams: [
      {
        type: "static",
        title: "List comprehension vs generator expression",
        caption: "List stores all in memory; generator is lazy and one-at-a-time",
        svg: `<svg viewBox="0 0 560 180" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace;font-size:12">
  <rect width="560" height="180" fill="#0d1117"/>
  <!-- List comp -->
  <text x="20" y="20" fill="#58a6ff" font-size="13" font-weight="bold">List Comprehension [...]</text>
  <rect x="20" y="28" width="240" height="90" rx="6" fill="#161b22" stroke="#58a6ff"/>
  <text x="35" y="48" fill="#e6edf3" font-size="11">[x*2 for x in range(5)]</text>
  <text x="35" y="65" fill="#8b949e" font-size="11">Evaluates ALL items immediately</text>
  <text x="35" y="82" fill="#7ee787" font-size="11">→ [0, 2, 4, 6, 8]  stored in RAM</text>
  <text x="35" y="98" fill="#f0883e" font-size="11">Memory: O(n) — all values in RAM</text>
  <text x="35" y="113" fill="#8b949e" font-size="11">Allows indexing, len(), multiple passes</text>
  <!-- Gen expr -->
  <text x="300" y="20" fill="#7ee787" font-size="13" font-weight="bold">Generator Expression (...)</text>
  <rect x="300" y="28" width="240" height="90" rx="6" fill="#0d2016" stroke="#238636"/>
  <text x="315" y="48" fill="#e6edf3" font-size="11">(x*2 for x in range(5))</text>
  <text x="315" y="65" fill="#8b949e" font-size="11">Yields one item at a time (lazy)</text>
  <text x="315" y="82" fill="#7ee787" font-size="11">→ generator object (not a list!)</text>
  <text x="315" y="98" fill="#7ee787" font-size="11">Memory: O(1) — only current item</text>
  <text x="315" y="113" fill="#8b949e" font-size="11">Single pass only — exhausted after</text>
  <!-- Bottom tips -->
  <text x="20" y="148" fill="#8b949e" font-size="11">Use list when: need index access, len(), multiple iterations, or pass to functions needing a list</text>
  <text x="20" y="163" fill="#7ee787" font-size="11">Use generator when: sum(), max(), any(), all(), large data, or piping to next step</text>
</svg>`
      }
    ],
    examples: [
      {
        size: "small",
        title: "List, dict, set comprehensions",
        language: "python",
        learningGoal: "The three main comprehension types — master these before moving to generators.",
        code: `# List comprehension: transform + filter
tokens = ["Hello", "World", "!", "This", "is", "Python"]
lowered = [t.lower() for t in tokens]
print(lowered)

# With filter
words_only = [t.lower() for t in tokens if t.isalpha()]
print(words_only)

# Dict comprehension: build vocab
vocab = {word: idx for idx, word in enumerate(words_only)}
print(vocab)

# Invert a dict
inv_vocab = {idx: word for word, idx in vocab.items()}
print(inv_vocab)

# Set comprehension: unique characters
unique_chars = {c for word in tokens for c in word.lower() if c.isalpha()}
print(sorted(unique_chars))  # sorted for deterministic output

# Nested: flatten a 2D list
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [x for row in matrix for x in row]
print(flat)`,
        expectedOutput: `['hello', 'world', '!', 'this', 'is', 'python']
['hello', 'world', 'this', 'is', 'python']
{'hello': 0, 'world': 1, 'this': 2, 'is': 3, 'python': 4}
{0: 'hello', 1: 'world', 2: 'this', 3: 'is', 4: 'python'}
['e', 'h', 'i', 'l', 'n', 'o', 'p', 's', 't', 'w', 'y']
[1, 2, 3, 4, 5, 6, 7, 8, 9]`
      },
      {
        size: "medium",
        title: "Generator expressions — memory-efficient pipelines",
        language: "python",
        learningGoal: "Generators are critical for large dataset processing. See why (memory, sum/any/all usage).",
        code: `import sys

# Memory comparison: list vs generator
n = 100_000
list_squares = [x**2 for x in range(n)]
gen_squares = (x**2 for x in range(n))

print(f"List memory: {sys.getsizeof(list_squares):,} bytes")
print(f"Generator memory: {sys.getsizeof(gen_squares)} bytes")  # ~100 bytes!

# Generators work with sum, any, all, max, min
total = sum(x**2 for x in range(1000))      # no list created!
print(f"Sum: {total:,}")

# any/all with generator — short-circuits (doesn't evaluate all items)
has_long = any(len(word) > 10 for word in ["hi", "hello", "extraordinary"])
print(f"Has long word: {has_long}")          # stops at "extraordinary"

all_alpha = all(word.isalpha() for word in ["hello", "world"])
print(f"All alpha: {all_alpha}")

# Generator function (uses yield)
def token_batches(tokens: list[str], batch_size: int):
    for i in range(0, len(tokens), batch_size):
        yield tokens[i:i + batch_size]      # yield = lazy return

tokens = list("abcdefghij")
for batch in token_batches(tokens, 3):
    print(f"Batch: {batch}")

# Chain generators (pipeline — each step processes lazily)
def tokenize(text: str):
    for word in text.split():
        yield word.lower()

def filter_stop_words(tokens, stop_words={"the", "a", "is"}):
    for token in tokens:
        if token not in stop_words:
            yield token

text = "The cat is a friendly animal"
pipeline = filter_stop_words(tokenize(text))
print(list(pipeline))`,
        expectedOutput: `List memory: 824,456 bytes
Generator memory: 104 bytes
Sum: 332,833,500
Has long word: True
All alpha: True
Batch: ['a', 'b', 'c']
Batch: ['d', 'e', 'f']
Batch: ['g', 'h', 'i']
Batch: ['j']
['cat', 'friendly', 'animal']`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What does `[x for x in range(5) if x % 2 == 0]` produce?", options: ["[1, 3]", "[0, 2, 4]", "[0, 1, 2, 3, 4]", "[2, 4]"], answer: 1, explanation: "[0, 2, 4]. The condition x % 2 == 0 filters for even numbers. range(5) gives 0,1,2,3,4. Even values are 0, 2, 4." },
      { difficulty: "medium", question: "What is the key memory difference between `[x for x in range(1_000_000)]` and `(x for x in range(1_000_000))`?", options: ["No difference", "The list allocates memory for all 1M values; the generator uses ~100 bytes regardless of size", "The generator is faster but uses the same memory", "Both use O(n) memory"], answer: 1, explanation: "The list comprehension allocates a Python list with 1M integer objects — around 8MB+. The generator expression creates a generator object (~100 bytes) that produces one value at a time on demand. For large datasets, generators are essential." },
      { difficulty: "hard", question: "What does `sum(x*x for x in range(5))` do differently from `sum([x*x for x in range(5)])`?", options: ["Same result, same memory", "Same result, but generator version doesn't create an intermediate list — more memory-efficient", "Different results", "Generator version is always slower"], answer: 1, explanation: "Both sum to 30 (0+1+4+9+16). The list version creates [0,1,4,9,16] first, then sums it. The generator version feeds values to sum() one at a time — no list is materialized. For large ranges, this difference is significant. Note: sum((gen)) same as sum(gen) — no need for double parens when passing to a function." }
    ],
    commonMistakes: [
      { mistake: "Trying to use a generator twice", whyItHappens: "Generators look like lists in many contexts", howToAvoid: "Generators are one-pass. Once exhausted, they yield nothing. If you need multiple passes, convert to list: data = list(gen). Or recreate the generator." },
      { mistake: "Overly complex nested comprehensions", whyItHappens: "Trying to write everything as one line", howToAvoid: "If a comprehension needs more than one level of nesting and a condition, use a regular for loop. Readability > cleverness." }
    ],
    cheatSheet: `## Comprehensions Cheat Sheet
- **List**: \`[expr for x in it if cond]\`
- **Dict**: \`{k: v for x in it if cond}\`
- **Set**: \`{expr for x in it if cond}\`
- **Generator**: \`(expr for x in it if cond)\` — lazy, O(1) memory
- **Nested**: \`[expr for outer in a for inner in b]\`
- **Generator function**: use \`yield\` instead of \`return\`
- **Use generator for**: sum(), any(), all(), max(), min(), large data
- **Use list for**: index access, len(), multiple passes`,
    flashcards: [
      { front: "What is the memory difference between [x for x in range(1M)] and (x for x in range(1M))?", back: "List: allocates ~8MB for all values. Generator: ~100 bytes — produces one value at a time on demand. Use generators for large data." },
      { front: "Can a generator be iterated twice?", back: "No. Generators are single-pass iterators. Once exhausted, they yield nothing. Convert to list() if you need multiple passes." },
      { front: "What does 'yield' do in a generator function?", back: "Pauses the function and returns a value to the caller. When iterated again, resumes from after the yield. The function's local state is preserved between yields." }
    ]
  },

  // ─── 7-12 topics continue... (OOP, Advanced Python, Error Handling, Concurrency, Async, Pydantic) ───
  {
    id: "oop",
    category: "Python Foundations",
    title: "OOP: Classes & Inheritance",
    priority: "High",
    icon: "🏛️",
    estimatedMinutes: 45,
    prerequisites: ["comprehensions"],
    nextTopics: ["advanced-python"],
    whyItMatters: "Every major Python framework uses OOP extensively. LangChain's BaseTool, FastAPI's APIRouter, Pydantic's BaseModel — all inherit from classes. Understanding Python's MRO, dunder methods, and the difference between @classmethod and @staticmethod is essential for reading and extending these frameworks. Dataclasses (Python 3.7+) are the modern way to define data containers without boilerplate.",
    analogy: "A class is a blueprint for a house. Each house (instance) has the same rooms (methods) and structure (attributes) but its own furniture (instance data). Inheritance is using someone else's blueprint as a starting point and modifying it. The MRO (Method Resolution Order) is the rule for which blueprint takes priority when two parents have the same room name.",
    content: `## OOP: Classes, Inheritance, and Python's Object Model

### Class Basics
\`\`\`python
class Dog:
    species = "Canis familiaris"    # class attribute (shared)

    def __init__(self, name: str, age: int):
        self.name = name             # instance attribute
        self.age = age

    def bark(self) -> str:
        return f"Woof! I'm {self.name}"
\`\`\`

\`__init__\` is not a constructor — Python's real constructor is \`__new__\`. \`__init__\` initializes the already-created object.

### Dunder Methods (Magic Methods)
Special methods that define how objects behave with Python syntax:
- \`__repr__\`: machine-readable representation (for debugging)
- \`__str__\`: human-readable string (for print())
- \`__eq__\`, \`__lt__\`, \`__le__\`: comparison operators
- \`__len__\`: len(obj)
- \`__getitem__\`, \`__setitem__\`: indexing obj[key]
- \`__call__\`: make instance callable like a function
- \`__enter__\`, \`__exit__\`: context manager protocol

### Inheritance and super()
\`super()\` calls the parent class's method. Essential in \`__init__\` to initialize the parent's attributes.

### MRO (Method Resolution Order)
Python uses C3 linearization for multiple inheritance. \`ClassName.__mro__\` shows the resolution order.

### @classmethod vs @staticmethod vs instance method
- **instance method**: receives \`self\` — accesses instance data
- **@classmethod**: receives \`cls\` — accesses class data, used as alternative constructors
- **@staticmethod**: receives nothing — utility function that logically belongs to the class

### dataclasses (Python 3.7+)
\`@dataclass\` auto-generates \`__init__\`, \`__repr__\`, \`__eq__\` from annotated fields. More modern than writing them manually.

### Encapsulation
- \`_single_underscore\` — convention for "internal use", not enforced
- \`__double_underscore\` — name mangling: \`__attr\` becomes \`_ClassName__attr\` — not truly private but harder to access accidentally`,
    diagrams: [
      {
        type: "static",
        title: "Python class hierarchy and MRO",
        caption: "C3 linearization determines which parent's method is called first",
        svg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace;font-size:12">
  <rect width="560" height="200" fill="#0d1117"/>
  <!-- object at top -->
  <rect x="230" y="10" width="100" height="30" rx="5" fill="#1f6feb" stroke="#388bfd"/>
  <text x="280" y="30" fill="#fff" font-size="12" text-anchor="middle">object</text>
  <!-- Base classes -->
  <line x1="280" y1="40" x2="130" y2="75" stroke="#30363d"/>
  <line x1="280" y1="40" x2="430" y2="75" stroke="#30363d"/>
  <rect x="80" y="75" width="100" height="30" rx="5" fill="#238636" stroke="#2ea043"/>
  <text x="130" y="94" fill="#fff" font-size="12" text-anchor="middle">Animal</text>
  <rect x="380" y="75" width="100" height="30" rx="5" fill="#9e6a03" stroke="#f0883e"/>
  <text x="430" y="94" fill="#fff" font-size="12" text-anchor="middle">Pet</text>
  <!-- Child class -->
  <line x1="130" y1="105" x2="230" y2="140" stroke="#30363d"/>
  <line x1="430" y1="105" x2="330" y2="140" stroke="#30363d"/>
  <rect x="180" y="140" width="100" height="30" rx="5" fill="#6e40c9" stroke="#d2a8ff"/>
  <text x="230" y="159" fill="#fff" font-size="12" text-anchor="middle">Dog</text>
  <!-- MRO label -->
  <text x="320" y="155" fill="#8b949e" font-size="11">MRO: Dog → Animal → Pet → object</text>
  <!-- Method table -->
  <rect x="20" y="10" width="50" height="130" rx="4" fill="#161b22" stroke="#30363d"/>
  <text x="45" y="25" fill="#58a6ff" font-size="10" text-anchor="middle">self</text>
  <text x="45" y="45" fill="#7ee787" font-size="10" text-anchor="middle">cls</text>
  <text x="45" y="65" fill="#f0883e" font-size="10" text-anchor="middle">static</text>
  <text x="45" y="90" fill="#8b949e" font-size="9" text-anchor="middle">instance</text>
  <text x="45" y="105" fill="#8b949e" font-size="9" text-anchor="middle">method</text>
  <text x="45" y="120" fill="#8b949e" font-size="9" text-anchor="middle">@class</text>
  <text x="45" y="135" fill="#8b949e" font-size="9" text-anchor="middle">@static</text>
</svg>`
      }
    ],
    examples: [
      {
        size: "medium",
        title: "Class with dunders and dataclass",
        language: "python",
        code: `from dataclasses import dataclass, field

# ── Manual class with dunders ────────────────────────────────────
class Token:
    def __init__(self, text: str, token_id: int):
        self.text = text
        self.token_id = token_id

    def __repr__(self) -> str:
        return f"Token({self.text!r}, id={self.token_id})"

    def __eq__(self, other) -> bool:
        if not isinstance(other, Token):
            return NotImplemented
        return self.token_id == other.token_id

    def __len__(self) -> int:
        return len(self.text)

t1 = Token("hello", 15496)
t2 = Token("hello", 15496)
print(repr(t1))
print(t1 == t2)     # True — same token_id
print(len(t1))      # 5

# ── Same thing with @dataclass ────────────────────────────────────
@dataclass
class TokenDC:
    text: str
    token_id: int
    logprob: float = 0.0              # default value

@dataclass(frozen=True)               # immutable (hashable!)
class VocabEntry:
    word: str
    freq: int
    embeddings: list[float] = field(default_factory=list)

t = TokenDC("world", 995, logprob=-1.2)
print(t)             # auto __repr__
print(t.text)

v = VocabEntry("hello", 1000)
print(v)
# v.word = "changed"  # FrozenInstanceError — immutable!`,
        expectedOutput: `Token('hello', id=15496)
True
5
TokenDC(text='world', token_id=995, logprob=-1.2)
world
VocabEntry(word='hello', freq=1000, embeddings=[])`
      },
      {
        size: "medium",
        title: "Inheritance, super(), and classmethods",
        language: "python",
        code: `class LLMBase:
    DEFAULT_MODEL = "gpt-3.5-turbo"

    def __init__(self, model: str, temperature: float = 0.7):
        self.model = model
        self.temperature = temperature

    def generate(self, prompt: str) -> str:
        raise NotImplementedError

    @classmethod
    def from_config(cls, config: dict) -> "LLMBase":
        """Alternative constructor from dict config."""
        return cls(
            model=config.get("model", cls.DEFAULT_MODEL),
            temperature=config.get("temperature", 0.7)
        )

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(model={self.model!r}, temp={self.temperature})"


class GPT4(LLMBase):
    DEFAULT_MODEL = "gpt-4"

    def __init__(self, temperature: float = 0.7, max_tokens: int = 1024):
        super().__init__(self.DEFAULT_MODEL, temperature)  # call parent __init__
        self.max_tokens = max_tokens

    def generate(self, prompt: str) -> str:
        return f"[GPT-4] {prompt[:30]}... (max_tokens={self.max_tokens})"

# Use class method (alternative constructor)
config = {"model": "gpt-4", "temperature": 0.9}
llm = GPT4.from_config(config)
print(llm)
print(llm.generate("Explain transformers in detail"))
print(f"MRO: {[c.__name__ for c in GPT4.__mro__]}")`,
        expectedOutput: `GPT4(model='gpt-4', temp=0.9)
[GPT-4] Explain transformers in deta... (max_tokens=1024)
MRO: ['GPT4', 'LLMBase', 'object']`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What is the difference between a class attribute and an instance attribute?", options: ["No difference", "Class attributes are shared across all instances; instance attributes are unique per object", "Instance attributes are faster", "Class attributes can only store strings"], answer: 1, explanation: "Class attributes (defined in the class body, not in __init__) are shared by all instances. Instance attributes (set via self.x = ...) belong to individual objects. If you mutate a class attribute on an instance (self.class_attr = new), it creates a shadow instance attribute, not modifying the class attribute." },
      { difficulty: "medium", question: "What does @dataclass(frozen=True) do?", options: ["Prevents the class from being subclassed", "Makes instances immutable and hashable", "Freezes the class attributes but not instance attributes", "Prevents adding new attributes after __init__"], answer: 1, explanation: "frozen=True makes the dataclass immutable — attempts to assign to fields after creation raise FrozenInstanceError. Crucially, it also makes instances hashable (can be dict keys or set members), since immutability is required for consistent hashing." },
      { difficulty: "hard", question: "When should you use @classmethod vs @staticmethod?", options: ["They are identical", "@classmethod receives cls (class reference) for accessing class data; @staticmethod is a plain function that logically belongs to the class", "@staticmethod is for private methods; @classmethod for public", "@classmethod can access instance attributes; @staticmethod cannot"], answer: 1, explanation: "@classmethod receives cls as first argument — useful for alternative constructors (MyClass.from_json()) and factory methods that create instances. @staticmethod receives nothing — it's a utility function grouped under the class for organizational reasons. Neither can access instance attributes (no self)." }
    ],
    commonMistakes: [
      { mistake: "Forgetting to call super().__init__() in a subclass", whyItHappens: "Seems unnecessary if parent logic isn't needed", howToAvoid: "In Python multiple inheritance, failing to call super() breaks cooperative inheritance. Always call it unless you explicitly don't want parent initialization." },
      { mistake: "Mutating a class attribute via an instance", whyItHappens: "self.class_attr = new_value looks like mutation but actually creates a shadow instance attribute", howToAvoid: "To modify a class attribute: use ClassName.attr = new_value. Accessing via self reads the class attr; assigning via self creates an instance attr." }
    ],
    cheatSheet: `## OOP Cheat Sheet
- **__init__**: initializer (not constructor — __new__ is)
- **__repr__**: debug representation (use this for logging)
- **__str__**: human display (used by print())
- **__eq__**: == comparison
- **@dataclass**: auto-generates __init__, __repr__, __eq__
- **@dataclass(frozen=True)**: immutable + hashable
- **super()**: calls parent's method (use in __init__)
- **@classmethod**: gets cls, used as alternative constructors
- **@staticmethod**: no self/cls, pure utility function
- **MRO**: ClassName.__mro__ — method resolution order`,
    flashcards: [
      { front: "What does @dataclass(frozen=True) give you?", back: "Immutable instances (FrozenInstanceError on write) AND hashability (can be dict keys/set members)." },
      { front: "Difference between __repr__ and __str__?", back: "__repr__ is for developers/debugging (should be unambiguous, ideally eval-able). __str__ is for end users. print() uses __str__; repr() uses __repr__. If only one defined, __repr__ is used as fallback for both." },
      { front: "What does super() do?", back: "Calls the next class in the MRO. In __init__, it initializes the parent class. Essential for correct cooperative inheritance." },
      { front: "What is the Python MRO?", back: "Method Resolution Order — the order Python searches classes when looking up a method. Determined by C3 linearization. View with ClassName.__mro__." }
    ]
  },

  // ─── 8. Advanced Python ──────────────────────────────────────────────
  {
    id: "advanced-python",
    category: "Python Foundations",
    title: "Advanced Python: Decorators, Generators & Context Managers",
    priority: "High",
    icon: "🧙",
    estimatedMinutes: 50,
    prerequisites: ["oop"],
    nextTopics: ["error-handling"],
    whyItMatters: "Decorators are the mechanism behind @app.route in Flask/FastAPI, @pytest.fixture in testing, @lru_cache for caching, and @retry for resilience. Every production Python codebase uses them. Generators power LangChain's streaming responses and async iteration in AI pipelines. Context managers (with statement) ensure resource cleanup in file handling, database connections, and GPU memory management — all critical in production AI systems.",
    analogy: "A decorator is a gift wrapper: you hand the function to the decorator, it wraps it with extra behavior (logging, caching, timing), and hands back a wrapped version. A generator is a vending machine that produces one item at a time instead of dumping all items on the floor. A context manager is an automatic door: it opens when you enter (with) and closes — guaranteed — when you leave, even if you trip (exception).",
    content: `## Decorators, Generators, and Context Managers

### Decorators
A decorator is a callable that takes a function and returns a modified function.

\`\`\`python
@my_decorator
def my_func():
    pass
# Equivalent to: my_func = my_decorator(my_func)
\`\`\`

**Always use \`functools.wraps\`** inside a decorator to preserve the original function's name, docstring, and metadata.

### Generators (Advanced)
Beyond basic comprehensions: generators can receive values (\`send()\`), throw exceptions (\`throw()\`), and signal completion (\`StopIteration\`).

\`yield from\` delegates to another generator — composing generator pipelines.

### Context Managers
Any object with \`__enter__\` and \`__exit__\` methods can be used with \`with\`. The \`__exit__\` method receives exception info — return \`True\` to suppress the exception.

\`\`\`python
from contextlib import contextmanager

@contextmanager
def managed_resource():
    resource = acquire()
    try:
        yield resource
    finally:
        release(resource)     # ALWAYS runs, even on exception
\`\`\`

### Decorator Patterns
- **Simple wrapper**: add logging, timing, validation
- **Decorator with arguments**: requires three levels of nesting (or use class-based)
- **Class-based decorator**: more explicit, supports \`__call__\``,
    diagrams: [
      {
        type: "static",
        title: "Decorator execution flow",
        caption: "Decorator wraps the function; @syntax is syntactic sugar for reassignment",
        svg: `<svg viewBox="0 0 560 180" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace;font-size:12">
  <rect width="560" height="180" fill="#0d1117"/>
  <!-- Source -->
  <rect x="20" y="20" width="150" height="60" rx="6" fill="#161b22" stroke="#58a6ff"/>
  <text x="30" y="40" fill="#58a6ff" font-size="11">@timer</text>
  <text x="30" y="57" fill="#e6edf3" font-size="11">def expensive():</text>
  <text x="30" y="72" fill="#e6edf3" font-size="11">    ...</text>
  <!-- Arrow -->
  <text x="178" y="55" fill="#8b949e" font-size="16">→</text>
  <text x="175" y="38" fill="#8b949e" font-size="10">sugar</text>
  <!-- Desugared -->
  <rect x="200" y="20" width="200" height="60" rx="6" fill="#161b22" stroke="#30363d"/>
  <text x="210" y="40" fill="#8b949e" font-size="11">def expensive(): ...</text>
  <text x="210" y="57" fill="#f0883e" font-size="11">expensive =</text>
  <text x="210" y="72" fill="#f0883e" font-size="11">  timer(expensive)</text>
  <!-- Flow diagram -->
  <rect x="20" y="105" width="520" height="60" rx="6" fill="#0d2016" stroke="#238636"/>
  <text x="35" y="120" fill="#7ee787" font-size="11" font-weight="bold">Call expensive("arg") →</text>
  <text x="190" y="120" fill="#c9d1d9" font-size="11">wrapper starts</text>
  <text x="300" y="120" fill="#c9d1d9" font-size="11">→ original runs</text>
  <text x="415" y="120" fill="#c9d1d9" font-size="11">→ wrapper finishes</text>
  <text x="35" y="140" fill="#8b949e" font-size="10">    record start time</text>
  <text x="190" y="140" fill="#8b949e" font-size="10">original expensive()</text>
  <text x="300" y="140" fill="#8b949e" font-size="10">receives result</text>
  <text x="415" y="140" fill="#8b949e" font-size="10">logs elapsed time</text>
</svg>`
      }
    ],
    examples: [
      {
        size: "medium",
        title: "Decorator with wraps — timing and retry",
        language: "python",
        code: `import time
import functools
from typing import Callable, TypeVar

F = TypeVar("F", bound=Callable)

# Simple decorator with functools.wraps
def timer(func: F) -> F:
    @functools.wraps(func)    # CRITICAL: preserves __name__, __doc__
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"[timer] {func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

# Decorator with arguments (needs 3 levels)
def retry(max_attempts: int = 3, delay: float = 1.0):
    def decorator(func: F) -> F:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exc = None
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exc = e
                    if attempt < max_attempts - 1:
                        print(f"Attempt {attempt+1} failed: {e}. Retrying...")
                        time.sleep(delay * (attempt + 1))
            raise last_exc
        return wrapper
    return decorator

@timer
def slow_function(n: int) -> int:
    time.sleep(0.01)
    return sum(range(n))

@retry(max_attempts=3, delay=0.01)
def flaky_api_call(fail_count: list) -> str:
    if fail_count[0] > 0:
        fail_count[0] -= 1
        raise ConnectionError("API unavailable")
    return "Success!"

print(slow_function(1000))
result = flaky_api_call([2])  # fails 2 times, then succeeds
print(result)
print(f"Function name preserved: {slow_function.__name__}")`,
        expectedOutput: `[timer] slow_function took 0.0102s
499500
Attempt 1 failed: API unavailable. Retrying...
Attempt 2 failed: API unavailable. Retrying...
Success!
Function name preserved: slow_function`
      },
      {
        size: "medium",
        title: "Context managers with contextlib",
        language: "python",
        code: `import time
from contextlib import contextmanager, suppress

# Context manager via contextmanager decorator
@contextmanager
def timer_ctx(label: str):
    start = time.perf_counter()
    try:
        yield            # code inside 'with' block runs here
    finally:
        elapsed = time.perf_counter() - start
        print(f"[{label}] {elapsed:.4f}s")

with timer_ctx("embedding"):
    time.sleep(0.02)
    result = sum(range(100_000))

# suppress: silence specific exceptions
with suppress(FileNotFoundError):
    with open("nonexistent_file.txt") as f:
        data = f.read()
print("No error — FileNotFoundError was suppressed")

# Class-based context manager
class DatabaseConnection:
    def __init__(self, url: str):
        self.url = url
        self.connected = False

    def __enter__(self):
        print(f"Connecting to {self.url}")
        self.connected = True
        return self         # the 'as' variable in 'with ... as conn'

    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"Disconnecting (exception={exc_type.__name__ if exc_type else None})")
        self.connected = False
        return False        # False = don't suppress exceptions

with DatabaseConnection("postgresql://localhost/mydb") as conn:
    print(f"Connected: {conn.connected}")
    # raise ValueError("test")  # __exit__ still called!
print(f"After with: {conn.connected}")`,
        expectedOutput: `[embedding] 0.0201s
No error — FileNotFoundError was suppressed
Connecting to postgresql://localhost/mydb
Connected: True
Disconnecting (exception=None)
After with: False`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "Why should you use `functools.wraps` inside a decorator?", options: ["It makes the decorator faster", "It preserves the wrapped function's __name__, __doc__, and other metadata", "It is required for the decorator to work", "It enables the decorator to handle exceptions"], answer: 1, explanation: "Without wraps, the decorator replaces the function's identity. func.__name__ would return 'wrapper', not the original name. This breaks debugging, logging, and introspection tools. With @functools.wraps(func), metadata is copied from the original to the wrapper." },
      { difficulty: "medium", question: "In a context manager's __exit__(self, exc_type, exc_val, exc_tb), what does returning True do?", options: ["Signals success", "Re-raises the exception", "Suppresses the exception (swallows it)", "Causes the with block to re-run"], answer: 2, explanation: "Returning True from __exit__ suppresses the exception — the code after the with block runs normally as if no exception occurred. Returning False (or None) lets the exception propagate. Use suppress(ExceptionType) from contextlib as a cleaner way to suppress specific exceptions." },
      { difficulty: "hard", question: "What is the yield statement's role in a @contextmanager function?", options: ["It returns the value to the caller", "It marks the split point: code before yield runs in __enter__; code after runs in __exit__; the yielded value is the 'as' variable", "It generates a sequence of values", "It pauses execution permanently"], answer: 1, explanation: "In a @contextmanager function, code before yield is the __enter__ phase, code after yield (in finally/except) is the __exit__ phase. The yielded value is what the 'with ... as x' clause receives. The try/finally ensures cleanup even if the body raises an exception." }
    ],
    commonMistakes: [
      { mistake: "Forgetting functools.wraps in decorators", whyItHappens: "Works without it, so the need isn't obvious until debugging", howToAvoid: "Make it a reflex: the first line of any inner wrapper function should be @functools.wraps(func)." },
      { mistake: "Not using try/finally in @contextmanager", whyItHappens: "Forgetting cleanup code won't run if the body raises an exception", howToAvoid: "Always structure as: try: yield resource / finally: cleanup(). The finally block runs regardless of exceptions." }
    ],
    cheatSheet: `## Advanced Python Cheat Sheet
- **Decorator**: \`@functools.wraps(func)\` in wrapper — always!
- **Decorator with args**: three levels of nesting (outer/decorator/wrapper)
- **@contextmanager**: code before yield = enter; code after = exit
- **suppress**: \`with suppress(FileNotFoundError): ...\`
- **yield from**: delegate to sub-generator
- **generator.send(val)**: send value into paused generator
- **__enter__/__exit__**: define custom context manager
- **__exit__ returns True**: suppresses exception`,
    flashcards: [
      { front: "What is the decorator pattern in one sentence?", back: "A callable that takes a function, wraps it with extra behavior, and returns the wrapped function. @my_dec on func is syntactic sugar for func = my_dec(func)." },
      { front: "Why use @functools.wraps(func) inside every decorator?", back: "Preserves the wrapped function's __name__, __doc__, __module__, and __annotations__. Without it, introspection tools and debuggers see 'wrapper' instead of the original function name." },
      { front: "In @contextmanager, what is the role of yield?", back: "yield splits __enter__ (before) and __exit__ (after). The value yielded is the 'as' variable. Use try/finally to ensure cleanup always runs." }
    ]
  },

  // ─── 9. Error Handling ───────────────────────────────────────────────
  {
    id: "error-handling",
    category: "Python Foundations",
    title: "Error Handling & File I/O",
    priority: "High",
    icon: "🛡️",
    estimatedMinutes: 35,
    prerequisites: ["advanced-python"],
    nextTopics: ["concurrency"],
    whyItMatters: "In production AI systems, errors are inevitable: API rate limits, network timeouts, malformed JSON, missing files. Proper exception handling with custom exceptions, exception chaining, and structured logging is what separates hobby code from production code. Pathlib replaced os.path in 2016 and is now the standard for file operations in every major Python project.",
    analogy: "Exception handling is like a construction site's safety net: you work (try), safety nets catch falls (except), you always clean up tools (finally), and you move on (else when nothing went wrong). Custom exceptions are department-specific safety reports — a FileParseError tells you exactly what type of problem occurred, not just that 'something went wrong'.",
    content: `## Error Handling & File I/O

### Exception Hierarchy
All Python exceptions inherit from \`BaseException\`. Most user-relevant exceptions inherit from \`Exception\`.

Key built-in exceptions:
- \`ValueError\` — wrong value (e.g., int("abc"))
- \`TypeError\` — wrong type (e.g., 1 + "a")
- \`KeyError\` — missing dict key
- \`AttributeError\` — missing attribute
- \`FileNotFoundError\` — missing file (subclass of OSError)
- \`ImportError\` / \`ModuleNotFoundError\` — import failed
- \`TimeoutError\` — operation timed out

### try / except / else / finally
\`\`\`python
try:
    result = risky_operation()
except ValueError as e:
    handle_value_error(e)
except (KeyError, AttributeError) as e:
    handle_lookup_error(e)
except Exception as e:
    log.error(f"Unexpected: {e}")
    raise               # re-raise if you can't handle it
else:
    # runs only if NO exception occurred
    process(result)
finally:
    # ALWAYS runs — cleanup here
    cleanup()
\`\`\`

### Custom Exceptions
Always inherit from \`Exception\` (not \`BaseException\`). Use exception chaining (\`raise X from Y\`) to preserve context.

### Exception Chaining
\`raise NewError("msg") from original_error\` — links exceptions. \`raise NewError from None\` — hides the original.

### Pathlib — Modern File Operations
\`pathlib.Path\` replaces \`os.path\` for file operations. Object-oriented, composable with \`/\` operator.`,
    diagrams: [
      {
        type: "static",
        title: "try/except/else/finally flow",
        caption: "else only runs without exception; finally always runs",
        svg: `<svg viewBox="0 0 560 160" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace;font-size:11">
  <rect width="560" height="160" fill="#0d1117"/>
  <!-- try -->
  <rect x="20" y="20" width="80" height="30" rx="5" fill="#1f6feb" stroke="#388bfd"/>
  <text x="60" y="39" fill="#fff" font-size="12" text-anchor="middle" font-weight="bold">try</text>
  <!-- exception path -->
  <line x1="100" y1="35" x2="140" y2="35" stroke="#f85149" stroke-dasharray="4"/>
  <rect x="140" y="20" width="100" height="30" rx="5" fill="#2d1418" stroke="#f85149"/>
  <text x="190" y="35" fill="#f85149" font-size="11" text-anchor="middle">exception!</text>
  <line x1="240" y1="35" x2="280" y2="35" stroke="#f85149" stroke-dasharray="4"/>
  <rect x="280" y="20" width="90" height="30" rx="5" fill="#2d1418" stroke="#da3633"/>
  <text x="325" y="35" fill="#fff" font-size="12" text-anchor="middle">except</text>
  <!-- success path -->
  <line x1="100" y1="35" x2="100" y2="80" stroke="#7ee787" stroke-dasharray="4"/>
  <rect x="30" y="80" width="140" height="30" rx="5" fill="#0d2016" stroke="#238636"/>
  <text x="100" y="99" fill="#7ee787" font-size="12" text-anchor="middle">else (no exception)</text>
  <!-- finally -->
  <rect x="20" y="125" width="520" height="25" rx="5" fill="#161b22" stroke="#f0883e"/>
  <text x="280" y="141" fill="#f0883e" font-size="12" text-anchor="middle">finally — ALWAYS runs (exception or not)</text>
</svg>`
      }
    ],
    examples: [
      {
        size: "medium",
        title: "Custom exceptions and exception chaining",
        language: "python",
        code: `# ── Custom Exception Hierarchy ───────────────────────────────────
class AppError(Exception):
    """Base for all application exceptions."""
    pass

class LLMError(AppError):
    def __init__(self, message: str, model: str, status_code: int | None = None):
        super().__init__(message)
        self.model = model
        self.status_code = status_code

    def __str__(self):
        return f"LLMError({self.model}): {super().__str__()} [HTTP {self.status_code}]"

class RateLimitError(LLMError):
    """Raised when the API rate limit is exceeded."""
    pass

# ── Exception chaining: raise X from Y ──────────────────────────
def call_api(prompt: str) -> str:
    try:
        # Simulate API response
        import json
        raw = '{"choices": [{"message": {"content"'  # broken JSON
        return json.loads(raw)["choices"][0]["message"]["content"]
    except json.JSONDecodeError as e:
        raise LLMError("Malformed API response", model="gpt-4") from e

# ── try/except/else/finally ──────────────────────────────────────
def safe_api_call(prompt: str) -> str | None:
    try:
        result = call_api(prompt)
    except RateLimitError as e:
        print(f"Rate limited: {e}")
        return None
    except LLMError as e:
        print(f"LLM error: {e}")
        print(f"Caused by: {e.__cause__}")  # shows chained exception
        return None
    except Exception as e:
        print(f"Unexpected error: {type(e).__name__}: {e}")
        raise   # re-raise unexpected exceptions — don't swallow them
    else:
        print("Call succeeded!")
        return result
    finally:
        print("Cleanup done (always runs)")

safe_api_call("Hello")`,
        expectedOutput: `LLM error: LLMError(gpt-4): Malformed API response [HTTP None]
Caused by: Expecting ':' delimiter: line 1 column 44 (char 43)
Cleanup done (always runs)`
      },
      {
        size: "medium",
        title: "Pathlib for file operations",
        language: "python",
        code: `from pathlib import Path
import json

# Pathlib basics — object-oriented file operations
base = Path(".")                          # current directory
data_dir = base / "data"                  # / operator for joining paths!
config_file = data_dir / "config.json"

print(f"Absolute path: {data_dir.resolve()}")

# Check existence before operating
if not data_dir.exists():
    data_dir.mkdir(parents=True, exist_ok=True)
    print(f"Created: {data_dir}")

# Write a file
config = {"model": "gpt-4", "temperature": 0.7, "max_tokens": 1024}
config_file.write_text(json.dumps(config, indent=2))
print(f"Wrote {config_file.stat().st_size} bytes to {config_file.name}")

# Read a file
loaded = json.loads(config_file.read_text())
print(f"Loaded config: {loaded}")

# Glob for finding files
py_files = list(base.glob("**/*.py"))
print(f"Found {len(py_files)} Python files")

# File properties
print(f"Suffix: {config_file.suffix}")    # .json
print(f"Stem: {config_file.stem}")         # config
print(f"Parent: {config_file.parent}")     # data

# Safe delete
config_file.unlink(missing_ok=True)       # no error if doesn't exist
data_dir.rmdir()                           # remove empty dir
print("Cleaned up")`,
        expectedOutput: `Absolute path: /home/user/project/data
Created: data
Wrote 65 bytes to config.json
Loaded config: {'model': 'gpt-4', 'temperature': 0.7, 'max_tokens': 1024}
Found 3 Python files
Suffix: .json
Stem: config
Parent: data
Cleaned up`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What does the `else` clause in a try/except block execute?", options: ["When an exception is raised", "When no exception is raised in the try block", "Always, after the try block", "When a specific exception matches"], answer: 1, explanation: "The else clause runs only if the try block completed without raising any exception. It's useful for code that should only run on success, keeping it separate from the try block logic. It's the inverse of except." },
      { difficulty: "medium", question: "What does `raise NewError('msg') from original_error` do?", options: ["Silences the original error", "Creates a new exception that chains to the original, preserving context in tracebacks", "Raises both exceptions simultaneously", "Converts the original error type"], answer: 1, explanation: "Exception chaining (from PEP 3134) links the new exception to the original via __cause__. The traceback shows both. This is critical for debugging: you see BOTH the high-level error (LLMError) AND the root cause (json.JSONDecodeError). Use raise X from None to suppress the chain if the original is irrelevant." },
      { difficulty: "hard", question: "What is the advantage of `Path('data') / 'config.json'` over `os.path.join('data', 'config.json')`?", options: ["No difference — they're equivalent", "Path returns a Path object with methods like .read_text(), .exists(), .stat(); os.path returns a string requiring separate calls", "Path works cross-platform; os.path doesn't", "Path is faster"], answer: 1, explanation: "pathlib.Path is object-oriented: the result of path / 'file.json' is a Path object with methods like .read_text(), .write_text(), .exists(), .stat(), .glob(). os.path.join returns a string, requiring separate os.path.exists(), open(), os.stat() calls. pathlib is cleaner, more readable, and has been the standard since Python 3.6." }
    ],
    commonMistakes: [
      { mistake: "Catching bare `except:` or `except Exception:` and silently swallowing errors", whyItHappens: "Prevents visible crashes but hides bugs", howToAvoid: "Only catch exceptions you can handle. Log unexpected ones and re-raise. Never silent-fail in production." },
      { mistake: "Using os.path instead of pathlib.Path", whyItHappens: "Legacy code and tutorials still use os.path", howToAvoid: "pathlib has been preferred since Python 3.6. Use Path() for all new code. It's more readable, cross-platform, and has built-in read/write methods." }
    ],
    cheatSheet: `## Error Handling Cheat Sheet
- **try/except/else/finally**: else = no exception; finally = always
- **Custom exception**: \`class MyError(Exception): ...\`
- **Exception chaining**: \`raise New("msg") from original\`
- **Re-raise**: bare \`raise\` inside except block
- **Suppress**: \`from contextlib import suppress; with suppress(FileNotFoundError):\`
- **Path ops**: \`Path("dir") / "file.json"\`
- **Write file**: \`path.write_text(content)\`
- **Read file**: \`content = path.read_text()\`
- **Safe delete**: \`path.unlink(missing_ok=True)\`
- **Glob**: \`list(path.glob("**/*.py"))\``,
    flashcards: [
      { front: "When does the else clause of try/except execute?", back: "Only when no exception was raised in the try block. Used for code that should only run on success." },
      { front: "What does `raise NewError from original` do?", back: "Chains exceptions — the new exception's __cause__ points to the original. Tracebacks show both, making debugging easier." },
      { front: "Pathlib: how do you read and write files?", back: "path.read_text() / path.write_text(content). Also path.read_bytes() / path.write_bytes(). No need to open/close files manually." }
    ]
  },

  // ─── 10. Concurrency ─────────────────────────────────────────────────
  {
    id: "concurrency",
    category: "Python Foundations",
    title: "Concurrency: Threading & Multiprocessing",
    priority: "High",
    icon: "⚡",
    estimatedMinutes: 45,
    prerequisites: ["error-handling"],
    nextTopics: ["async-programming"],
    whyItMatters: "In AI workloads, you constantly need to run multiple API calls simultaneously, process documents in parallel, or run CPU-intensive embedding computations. The GIL means Python threads don't parallelize CPU work, but they DO parallelize I/O (API calls, file reads, network requests). Understanding when to use ThreadPoolExecutor vs ProcessPoolExecutor vs asyncio is one of the most impactful performance skills for AI engineers.",
    analogy: "Threads are like workers in one kitchen with one knife (the GIL). They take turns using the knife, but while one waits for the oven (I/O), another can use it. Processes are separate kitchens with their own knives — truly parallel but harder to share ingredients (data). Asyncio is one very efficient chef who starts one dish, and while it simmers, starts another — great for lots of small tasks, terrible for heavy CPU work.",
    content: `## Concurrency: Threading, Multiprocessing, and the GIL

### The GIL (Global Interpreter Lock)
CPython's most controversial feature: **only one thread executes Python bytecode at a time**. This means:
- Threading does NOT speed up CPU-bound Python code
- Threading DOES speed up I/O-bound code (API calls, file ops, network) because I/O releases the GIL

**GIL-free Python**: Python 3.13 introduces experimental no-GIL mode. JIT compilation landed in 3.13. The landscape is changing.

### Threading vs Multiprocessing
- **threading**: same process, shared memory, good for I/O-bound (API calls, downloads)
- **multiprocessing**: separate processes, no GIL, good for CPU-bound (data processing, embeddings)
- **concurrent.futures**: high-level API for both (ThreadPoolExecutor, ProcessPoolExecutor)

### ThreadPoolExecutor — The Right Way for API Calls
\`\`\`python
from concurrent.futures import ThreadPoolExecutor, as_completed

with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(call_api, doc) for doc in documents]
    for future in as_completed(futures):
        result = future.result()
\`\`\`

### Race Conditions and Locks
When multiple threads write to shared data, use \`threading.Lock\` to prevent race conditions.`,
    diagrams: [
      {
        type: "static",
        title: "Threading vs Multiprocessing vs Asyncio",
        caption: "Choose based on whether your bottleneck is I/O or CPU",
        svg: `<svg viewBox="0 0 560 180" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace;font-size:11">
  <rect width="560" height="180" fill="#0d1117"/>
  <!-- Headers -->
  <text x="20" y="20" fill="#58a6ff" font-size="12" font-weight="bold">threading</text>
  <text x="200" y="20" fill="#7ee787" font-size="12" font-weight="bold">multiprocessing</text>
  <text x="400" y="20" fill="#d2a8ff" font-size="12" font-weight="bold">asyncio</text>
  <!-- threading box -->
  <rect x="10" y="28" width="170" height="130" rx="6" fill="#161b22" stroke="#58a6ff"/>
  <text x="20" y="46" fill="#7ee787" font-size="10">✓ I/O-bound work</text>
  <text x="20" y="60" fill="#7ee787" font-size="10">✓ API calls in parallel</text>
  <text x="20" y="74" fill="#7ee787" font-size="10">✓ Shared memory</text>
  <text x="20" y="88" fill="#f85149" font-size="10">✗ CPU-bound (GIL blocks)</text>
  <text x="20" y="102" fill="#c9d1d9" font-size="10">Use: ThreadPoolExecutor</text>
  <text x="20" y="116" fill="#8b949e" font-size="10">Good for: 10-100 workers</text>
  <text x="20" y="148" fill="#f0883e" font-size="10">Workers: threads</text>
  <!-- multiprocessing box -->
  <rect x="190" y="28" width="170" height="130" rx="6" fill="#161b22" stroke="#7ee787"/>
  <text x="200" y="46" fill="#7ee787" font-size="10">✓ CPU-bound work</text>
  <text x="200" y="60" fill="#7ee787" font-size="10">✓ True parallelism</text>
  <text x="200" y="74" fill="#7ee787" font-size="10">✓ No GIL interference</text>
  <text x="200" y="88" fill="#f85149" font-size="10">✗ High overhead</text>
  <text x="200" y="102" fill="#f85149" font-size="10">✗ No shared memory</text>
  <text x="200" y="116" fill="#c9d1d9" font-size="10">Use: ProcessPoolExecutor</text>
  <text x="200" y="148" fill="#f0883e" font-size="10">Workers: processes</text>
  <!-- asyncio box -->
  <rect x="370" y="28" width="175" height="130" rx="6" fill="#161b22" stroke="#d2a8ff"/>
  <text x="380" y="46" fill="#7ee787" font-size="10">✓ Many concurrent I/O</text>
  <text x="380" y="60" fill="#7ee787" font-size="10">✓ Low overhead</text>
  <text x="380" y="74" fill="#7ee787" font-size="10">✓ Single thread</text>
  <text x="380" y="88" fill="#f85149" font-size="10">✗ CPU-bound (blocks loop)</text>
  <text x="380" y="102" fill="#f85149" font-size="10">✗ Requires async libs</text>
  <text x="380" y="116" fill="#c9d1d9" font-size="10">Use: asyncio.gather()</text>
  <text x="380" y="148" fill="#f0883e" font-size="10">Workers: coroutines</text>
</svg>`
      }
    ],
    examples: [
      {
        size: "medium",
        title: "ThreadPoolExecutor for parallel API calls",
        language: "python",
        code: `import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def simulate_api_call(doc_id: int, delay: float = 0.1) -> dict:
    """Simulate an API call (e.g., OpenAI embedding or GPT completion)."""
    time.sleep(delay)   # simulates network I/O
    return {"doc_id": doc_id, "embedding_dim": 1536, "success": True}

documents = list(range(20))   # 20 documents to embed

# Sequential: takes ~2 seconds (20 × 0.1s)
start = time.perf_counter()
sequential_results = [simulate_api_call(doc_id) for doc_id in documents[:5]]
print(f"Sequential (5 docs): {time.perf_counter() - start:.2f}s")

# Parallel with ThreadPoolExecutor
start = time.perf_counter()
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = {
        executor.submit(simulate_api_call, doc_id): doc_id
        for doc_id in documents
    }
    results = []
    for future in as_completed(futures):
        try:
            result = future.result()
            results.append(result)
        except Exception as e:
            print(f"Doc {futures[future]} failed: {e}")

print(f"Parallel (20 docs, 10 workers): {time.perf_counter() - start:.2f}s")
print(f"Processed: {len(results)} documents")
print(f"First result: {results[0]}")`,
        expectedOutput: `Sequential (5 docs): 0.50s
Parallel (20 docs, 10 workers): 0.20s
Processed: 20 documents
First result: {'doc_id': 3, 'embedding_dim': 1536, 'success': True}`
      },
      {
        size: "medium",
        title: "ProcessPoolExecutor for CPU-bound work",
        language: "python",
        code: `import time
from concurrent.futures import ProcessPoolExecutor

def compute_token_features(text: str) -> dict:
    """CPU-intensive: compute features from text (simulated)."""
    # In real life: sentence embeddings, BM25 scoring, etc.
    words = text.lower().split()
    word_freq = {}
    for word in words:
        word_freq[word] = word_freq.get(word, 0) + 1
    return {
        "length": len(text),
        "word_count": len(words),
        "unique_words": len(set(words)),
        "top_word": max(word_freq, key=word_freq.get),
    }

documents = [
    "The quick brown fox jumps over the lazy dog " * 100,
    "Transformers use self-attention mechanisms to process sequences " * 100,
    "Python is great for data science and machine learning " * 100,
    "Retrieval augmented generation combines search with generation " * 100,
]

# Sequential
start = time.perf_counter()
results_seq = [compute_token_features(doc) for doc in documents]
seq_time = time.perf_counter() - start

# Parallel (processes bypass GIL for CPU work)
start = time.perf_counter()
with ProcessPoolExecutor(max_workers=4) as executor:
    results_par = list(executor.map(compute_token_features, documents))
par_time = time.perf_counter() - start

print(f"Sequential: {seq_time:.3f}s")
print(f"Parallel:   {par_time:.3f}s")
print(f"Speedup:    {seq_time/par_time:.1f}x")
print(f"Sample result: {results_par[0]}")`,
        expectedOutput: `Sequential: 0.008s
Parallel:   0.042s
Speedup:    0.2x
Sample result: {'length': 4700, 'word_count': 900, 'unique_words': 10, 'top_word': 'the'}

# Note: for small tasks, process overhead (fork/spawn) EXCEEDS the benefit.
# Use ProcessPoolExecutor for tasks taking >100ms each.`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "The GIL means Python threads cannot speed up which type of work?", options: ["I/O-bound work (API calls, file reads)", "CPU-bound work (number crunching, data processing)", "Network-bound work", "Database queries"], answer: 1, explanation: "The GIL (Global Interpreter Lock) only allows one thread to execute Python bytecode at a time. CPU-bound code (loops, arithmetic, data processing) never releases the GIL, so threads don't provide speedup. For CPU work, use ProcessPoolExecutor (separate processes, no shared GIL) or numpy/PyTorch (which release the GIL for their C extensions)." },
      { difficulty: "medium", question: "When should you use ThreadPoolExecutor vs ProcessPoolExecutor?", options: ["Always use ThreadPoolExecutor — it's simpler", "ThreadPoolExecutor for I/O-bound (API calls); ProcessPoolExecutor for CPU-bound (data processing)", "ProcessPoolExecutor is always faster", "They are interchangeable"], answer: 1, explanation: "I/O-bound work (API calls, downloads, database queries) releases the GIL while waiting, so threads can run concurrently — ThreadPoolExecutor works great. CPU-bound work never releases the GIL, so threads can't parallelize it — use ProcessPoolExecutor (separate Python processes with no shared GIL)." },
      { difficulty: "hard", question: "What is the primary disadvantage of multiprocessing compared to threading for AI workloads?", options: ["Processes are slower than threads for all tasks", "Inter-process communication (IPC) overhead and inability to share Python objects in memory directly", "Processes can't use GPUs", "Processes don't work on Linux"], answer: 1, explanation: "Processes have separate memory spaces. Sharing data (model outputs, embeddings) requires IPC via queues, pipes, or shared memory — serialization/deserialization overhead. Large numpy arrays or model weights can't be trivially shared. In practice: use threads for I/O (API calls, no data sharing needed), processes for CPU (text preprocessing, BM25 scoring where output is small)." }
    ],
    commonMistakes: [
      { mistake: "Using multiprocessing for small tasks (overhead exceeds benefit)", whyItHappens: "Thinking 'more processes = faster'", howToAvoid: "Process startup takes 50-200ms. Only use ProcessPoolExecutor when each task takes > 100ms. For fast tasks, threading or asyncio is better." },
      { mistake: "Forgetting to handle exceptions from futures", whyItHappens: "future.result() raises the original exception, which is easy to miss", howToAvoid: "Wrap future.result() in try/except, or check future.exception() before calling result()." }
    ],
    cheatSheet: `## Concurrency Cheat Sheet
- **GIL**: only 1 thread executes Python at once. Released during I/O.
- **Threading**: use for I/O-bound (API calls). \`ThreadPoolExecutor(max_workers=N)\`
- **Multiprocessing**: use for CPU-bound. \`ProcessPoolExecutor(max_workers=N)\`
- **submit()**: returns Future, non-blocking
- **map()**: blocking, yields results in order
- **as_completed()**: yields futures as they finish (not in submit order)
- **Lock**: \`with threading.Lock(): ...\` for thread-safe writes
- **Rule of thumb**: threads for I/O, processes for CPU, asyncio for many concurrent I/O`,
    flashcards: [
      { front: "What does the GIL prevent?", back: "True parallel execution of Python bytecode across threads. Only one thread runs at a time. I/O releases the GIL, so threading is useful for I/O-bound work." },
      { front: "ThreadPoolExecutor vs ProcessPoolExecutor?", back: "ThreadPoolExecutor: shared memory, good for I/O-bound (API calls). ProcessPoolExecutor: separate processes, good for CPU-bound (bypasses GIL)." },
      { front: "What does as_completed() do?", back: "Returns futures in the order they COMPLETE (not the order they were submitted). Use it when you want to process results as soon as they're ready." }
    ]
  },

  // ─── 11. Async Programming ───────────────────────────────────────────
  {
    id: "async-programming",
    category: "Python Foundations",
    title: "Async Programming: asyncio & await",
    priority: "High",
    icon: "🌊",
    estimatedMinutes: 50,
    prerequisites: ["concurrency"],
    nextTopics: ["pydantic"],
    whyItMatters: "FastAPI, the most popular Python framework for AI backends, is built entirely on asyncio. The OpenAI and Anthropic Python SDKs have async clients. LangChain's LCEL (LangChain Expression Language) uses async generators for streaming. Understanding async/await is not optional for Python AI development in 2024 — it's the standard way to build high-throughput AI backends.",
    analogy: "Async is a single chef who's extremely efficient with their time. While the pasta boils (API call waiting for response), they chop vegetables (process another request). They're not doing two things at once — they're doing one thing at a time but never sitting idle waiting. Contrast with threads (multiple chefs sharing one knife) and processes (multiple separate kitchens).",
    content: `## Async Programming with asyncio

### Core Concepts
- **coroutine**: a function defined with \`async def\` that can pause at \`await\` points
- **event loop**: the engine that runs coroutines, switching between them at await points
- **task**: a wrapped coroutine scheduled to run on the event loop
- **await**: pause this coroutine until the awaited thing finishes (and yield control to the loop)

### async def and await
\`\`\`python
import asyncio

async def fetch_data(url: str) -> dict:
    await asyncio.sleep(1)   # simulates I/O wait
    return {"url": url, "data": "..."}

# Run a coroutine
asyncio.run(fetch_data("https://api.example.com"))
\`\`\`

### asyncio.gather — Run Multiple Coroutines Concurrently
\`\`\`python
results = await asyncio.gather(
    fetch_data("url1"),
    fetch_data("url2"),
    fetch_data("url3"),
)  # all three start immediately, total time ≈ 1 × max_time
\`\`\`

### Tasks and Cancellation
\`asyncio.create_task()\` schedules a coroutine immediately. Tasks can be cancelled.

### Async Generators and Context Managers
\`async for\` iterates over async generators (e.g., streaming API responses).
\`async with\` uses async context managers (e.g., aiohttp sessions, databases).

### asyncio.Queue — Producer/Consumer Pattern
For decoupled async pipelines: producer puts items, consumer gets them.

### Integration with FastAPI
FastAPI runs async handlers natively. Declare route handlers as \`async def\` and await async operations.`,
    diagrams: [
      {
        type: "static",
        title: "Event loop: how gather() achieves concurrency",
        caption: "Single thread, but tasks interleave at await points",
        svg: `<svg viewBox="0 0 560 180" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace;font-size:11">
  <rect width="560" height="180" fill="#0d1117"/>
  <!-- Time axis -->
  <line x1="20" y1="160" x2="540" y2="160" stroke="#30363d" stroke-width="1"/>
  <text x="20" y="175" fill="#8b949e" font-size="10">t=0</text>
  <text x="160" y="175" fill="#8b949e" font-size="10">t=0.5s</text>
  <text x="300" y="175" fill="#8b949e" font-size="10">t=1.0s</text>
  <text x="440" y="175" fill="#8b949e" font-size="10">t=1.5s</text>
  <!-- Task A -->
  <text x="10" y="30" fill="#58a6ff" font-size="11">Task A:</text>
  <rect x="70" y="18" width="80" height="18" rx="3" fill="#1f6feb"/>
  <text x="110" y="31" fill="#fff" font-size="9" text-anchor="middle">start</text>
  <rect x="150" y="18" width="190" height="18" rx="3" fill="#161b22" stroke="#30363d" stroke-dasharray="3"/>
  <text x="245" y="31" fill="#8b949e" font-size="9" text-anchor="middle">awaiting I/O...</text>
  <rect x="340" y="18" width="80" height="18" rx="3" fill="#238636"/>
  <text x="380" y="31" fill="#fff" font-size="9" text-anchor="middle">done ✓</text>
  <!-- Task B -->
  <text x="10" y="65" fill="#7ee787" font-size="11">Task B:</text>
  <rect x="70" y="53" width="80" height="18" rx="3" fill="#238636"/>
  <text x="110" y="66" fill="#fff" font-size="9" text-anchor="middle">start</text>
  <rect x="150" y="53" width="190" height="18" rx="3" fill="#161b22" stroke="#30363d" stroke-dasharray="3"/>
  <text x="245" y="66" fill="#8b949e" font-size="9" text-anchor="middle">awaiting I/O...</text>
  <rect x="340" y="53" width="80" height="18" rx="3" fill="#238636"/>
  <text x="380" y="66" fill="#fff" font-size="9" text-anchor="middle">done ✓</text>
  <!-- Task C -->
  <text x="10" y="100" fill="#d2a8ff" font-size="11">Task C:</text>
  <rect x="70" y="88" width="80" height="18" rx="3" fill="#6e40c9"/>
  <text x="110" y="101" fill="#fff" font-size="9" text-anchor="middle">start</text>
  <rect x="150" y="88" width="190" height="18" rx="3" fill="#161b22" stroke="#30363d" stroke-dasharray="3"/>
  <text x="245" y="101" fill="#8b949e" font-size="9" text-anchor="middle">awaiting I/O...</text>
  <rect x="340" y="88" width="80" height="18" rx="3" fill="#6e40c9"/>
  <text x="380" y="101" fill="#fff" font-size="9" text-anchor="middle">done ✓</text>
  <!-- Total time box -->
  <rect x="70" y="125" width="350" height="20" rx="3" fill="#0d2016" stroke="#238636"/>
  <text x="245" y="139" fill="#7ee787" font-size="10" text-anchor="middle">Total time ≈ 1 × max(A, B, C) not 3 × average</text>
</svg>`
      }
    ],
    examples: [
      {
        size: "medium",
        title: "asyncio basics: gather and tasks",
        language: "python",
        code: `import asyncio
import time

async def embed_document(doc_id: int, delay: float = 0.1) -> dict:
    """Simulate async API call to embedding endpoint."""
    await asyncio.sleep(delay)    # yields control to event loop
    return {"doc_id": doc_id, "vector_dim": 1536}

async def main():
    # Sequential: 5 × 0.1s = 0.5s
    start = time.perf_counter()
    results_seq = []
    for i in range(5):
        result = await embed_document(i)
        results_seq.append(result)
    print(f"Sequential: {time.perf_counter() - start:.2f}s ({len(results_seq)} docs)")

    # Concurrent with gather: ~0.1s regardless of count
    start = time.perf_counter()
    results_con = await asyncio.gather(
        *[embed_document(i) for i in range(10)]
    )
    print(f"Concurrent: {time.perf_counter() - start:.2f}s ({len(results_con)} docs)")

    # With error handling in gather
    start = time.perf_counter()
    results = await asyncio.gather(
        embed_document(1),
        embed_document(2),
        embed_document(3),
        return_exceptions=True,    # errors returned, not raised
    )
    for r in results:
        if isinstance(r, Exception):
            print(f"Error: {r}")
        else:
            print(f"Success: doc {r['doc_id']}")
    print(f"With error handling: {time.perf_counter() - start:.2f}s")

asyncio.run(main())`,
        expectedOutput: `Sequential: 0.50s (5 docs)
Concurrent: 0.10s (10 docs)
Success: doc 1
Success: doc 2
Success: doc 3
With error handling: 0.10s`
      },
      {
        size: "medium",
        title: "Async generators for streaming LLM responses",
        language: "python",
        code: `import asyncio

# Async generator (yield in an async function)
async def stream_llm_response(prompt: str):
    """Simulates streaming token generation from an LLM."""
    words = f"The answer to '{prompt}' is: transformers use attention mechanisms.".split()
    for word in words:
        await asyncio.sleep(0.05)   # simulate token generation latency
        yield word                   # yield one token at a time

async def process_stream():
    tokens_received = []
    async for token in stream_llm_response("what is AI?"):
        tokens_received.append(token)
        print(token, end=" ", flush=True)
    print()
    print(f"Total tokens: {len(tokens_received)}")

# Async context manager + queue pattern
async def producer(queue: asyncio.Queue, docs: list):
    for doc in docs:
        await queue.put(doc)
        await asyncio.sleep(0.01)
    await queue.put(None)   # sentinel to signal completion

async def consumer(queue: asyncio.Queue, results: list):
    while True:
        item = await queue.get()
        if item is None:
            break
        results.append(f"processed: {item}")
        queue.task_done()

async def main():
    await process_stream()

    # Producer-consumer
    queue = asyncio.Queue(maxsize=5)
    results = []
    docs = ["doc1", "doc2", "doc3", "doc4"]

    await asyncio.gather(
        producer(queue, docs),
        consumer(queue, results),
    )
    print(results)

asyncio.run(main())`,
        expectedOutput: `The answer to 'what is AI?' is: transformers use attention mechanisms.
Total tokens: 11
['processed: doc1', 'processed: doc2', 'processed: doc3', 'processed: doc4']`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What does `await` do in an async function?", options: ["Runs the coroutine synchronously", "Pauses the current coroutine and yields control to the event loop until the awaited operation completes", "Creates a new thread", "Blocks the entire program"], answer: 1, explanation: "await pauses the current coroutine at that point, yields control back to the event loop, and the event loop can run other coroutines. When the awaited operation completes, the coroutine resumes from where it paused. This is cooperative multitasking — the coroutine voluntarily yields control." },
      { difficulty: "medium", question: "What does `asyncio.gather(*coroutines)` do?", options: ["Runs coroutines one after another", "Runs all coroutines concurrently and returns their results in order", "Creates a thread for each coroutine", "Only runs the first coroutine"], answer: 1, explanation: "asyncio.gather() schedules all coroutines concurrently on the event loop. They all start immediately and run interleaved at their await points. Results are returned in the same order as the input coroutines (not completion order). Total time ≈ max(individual_times), not sum." },
      { difficulty: "hard", question: "When should you use `asyncio.run()` vs `await coroutine()` to run a coroutine?", options: ["They are interchangeable", "asyncio.run() starts/runs the event loop from synchronous code; await is used inside async functions to run a coroutine on an already-running loop", "await is for creating tasks; asyncio.run() is for awaiting them", "asyncio.run() is deprecated"], answer: 1, explanation: "asyncio.run() is the entry point to the async world from regular synchronous code — it creates a new event loop, runs the coroutine to completion, and cleans up. Inside an async function, you use await to run other coroutines on the already-running event loop. Calling asyncio.run() inside an async function raises RuntimeError." }
    ],
    commonMistakes: [
      { mistake: "Forgetting to await a coroutine (calling async def without await)", whyItHappens: "Looks like a regular function call", howToAvoid: "An async function call without await returns a coroutine object, not the result. Python 3.12+ warns about unawaited coroutines. Always await or create a task." },
      { mistake: "Calling blocking I/O inside an async function without asyncio.to_thread()", whyItHappens: "Using requests.get() instead of aiohttp, or open() instead of aiofiles", howToAvoid: "Blocking calls freeze the event loop. Use async libraries (aiohttp, aiofiles) or wrap blocking calls: await asyncio.to_thread(blocking_fn, args)." }
    ],
    cheatSheet: `## Asyncio Cheat Sheet
- **async def f(): ...**  defines a coroutine function
- **await expr**: pause until expr completes
- **asyncio.run(coro)**: entry point from sync code
- **asyncio.gather(*coros)**: run concurrently, return results in order
- **asyncio.create_task(coro)**: schedule immediately, run later
- **async for item in aiter:**: iterate async generator
- **async with resource:**: async context manager
- **asyncio.Queue**: async-safe producer/consumer queue
- **asyncio.to_thread(fn, *args)**: run blocking code in thread
- **asyncio.wait_for(coro, timeout=5)**: add timeout`,
    flashcards: [
      { front: "What happens when you 'await' something?", back: "The current coroutine pauses and yields control back to the event loop. Other coroutines can run. When the awaited operation finishes, the coroutine resumes." },
      { front: "asyncio.gather() vs sequential await?", back: "gather() runs all coroutines concurrently — total time ≈ max(times). Sequential await runs them one after another — total time = sum(times)." },
      { front: "What is the difference between asyncio.create_task() and await?", back: "create_task() schedules a coroutine to run but doesn't wait for it. await immediately waits for the coroutine to complete before continuing. Use create_task() for background tasks." },
      { front: "What is asyncio.to_thread() for?", back: "Runs a blocking (non-async) function in a thread pool, allowing the event loop to continue. Use for blocking I/O like requests.get() or time.sleep() inside async code." }
    ]
  },

  // ─── 12. Pydantic ────────────────────────────────────────────────────
  {
    id: "pydantic",
    category: "Python Foundations",
    title: "Pydantic: Type-Safe Data Validation",
    priority: "High",
    icon: "🔒",
    estimatedMinutes: 40,
    prerequisites: ["async-programming"],
    nextTopics: ["docker"],
    whyItMatters: "Pydantic v2 is the backbone of FastAPI, LangChain, and most serious Python AI backends. It validates and coerces data at runtime — catching malformed API responses, LLM outputs, and user inputs before they corrupt your system. OpenAI's Python SDK uses Pydantic models for all responses. Understanding validators, nested models, and settings management with pydantic-settings is essential for building production AI systems.",
    analogy: "Pydantic is a strict bouncer at a data nightclub. Any data that wants to enter your application must match the dress code (type annotations). The bouncer tries to accommodate — converting '42' to 42 if an int is needed — but if data fundamentally doesn't fit, it gets rejected with a clear explanation of why. Once inside, the data is guaranteed to be exactly the shape you expect.",
    content: `## Pydantic v2: Data Validation and Settings

### BaseModel
The core class. Define fields with type annotations. Pydantic validates and coerces on instantiation.

\`\`\`python
from pydantic import BaseModel, Field

class LLMConfig(BaseModel):
    model: str
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)  # with constraints
    max_tokens: int = 1024
\`\`\`

### Validation vs Coercion
Pydantic v2 coerces compatible types: passing \`"42"\` for an \`int\` field gives you \`42\`, not an error. Incompatible types raise \`ValidationError\`.

### Field() — Constraints and Metadata
- \`Field(gt=0)\` — greater than 0
- \`Field(ge=0, le=1)\` — between 0 and 1 inclusive
- \`Field(min_length=1, max_length=100)\` — string length
- \`Field(default_factory=list)\` — mutable default
- \`Field(alias="camelCase")\` — map from different key name

### Validators
- \`@field_validator("field_name")\` — validate/transform a field
- \`@model_validator(mode="before")\` — validate/transform entire input dict before field validation

### Nested Models and Lists
Models can contain other models and typed lists — Pydantic validates recursively.

### pydantic-settings — Environment Config
\`BaseSettings\` reads from environment variables and .env files automatically.

### model_dump() and model_json_schema()
- \`model.model_dump()\` — serialize to dict
- \`model.model_dump_json()\` — serialize to JSON string
- \`LLMConfig.model_json_schema()\` — generate JSON Schema (used by OpenAI function calling)`,
    diagrams: [
      {
        type: "static",
        title: "Pydantic validation pipeline",
        caption: "Input → coerce → validate → model instance OR ValidationError",
        svg: `<svg viewBox="0 0 560 160" xmlns="http://www.w3.org/2000/svg" style="max-width:100%;font-family:monospace;font-size:11">
  <rect width="560" height="160" fill="#0d1117"/>
  <!-- Pipeline -->
  <rect x="20" y="40" width="90" height="40" rx="6" fill="#161b22" stroke="#30363d"/>
  <text x="65" y="58" fill="#8b949e" font-size="10" text-anchor="middle">Raw Input</text>
  <text x="65" y="72" fill="#c9d1d9" font-size="10" text-anchor="middle">dict/str/etc</text>
  <line x1="110" y1="60" x2="140" y2="60" stroke="#30363d" stroke-width="1.5" marker-end="url(#arr)"/>
  <rect x="140" y="40" width="90" height="40" rx="6" fill="#1f6feb" stroke="#388bfd"/>
  <text x="185" y="58" fill="#fff" font-size="10" text-anchor="middle">Coerce</text>
  <text x="185" y="72" fill="#a5d6ff" font-size="10" text-anchor="middle">"42" → 42</text>
  <line x1="230" y1="60" x2="260" y2="60" stroke="#30363d" stroke-width="1.5"/>
  <rect x="260" y="40" width="90" height="40" rx="6" fill="#238636" stroke="#2ea043"/>
  <text x="305" y="58" fill="#fff" font-size="10" text-anchor="middle">Validate</text>
  <text x="305" y="72" fill="#7ee787" font-size="10" text-anchor="middle">constraints</text>
  <line x1="350" y1="60" x2="380" y2="60" stroke="#30363d" stroke-width="1.5"/>
  <!-- Success path -->
  <rect x="380" y="40" width="110" height="40" rx="6" fill="#0d2016" stroke="#238636"/>
  <text x="435" y="58" fill="#7ee787" font-size="10" text-anchor="middle">Model Instance</text>
  <text x="435" y="72" fill="#7ee787" font-size="10" text-anchor="middle">✓ type-safe</text>
  <!-- Failure path -->
  <line x1="305" y1="80" x2="305" y2="120" stroke="#f85149" stroke-width="1.5"/>
  <rect x="210" y="120" width="190" height="30" rx="6" fill="#2d1418" stroke="#f85149"/>
  <text x="305" y="136" fill="#f85149" font-size="10" text-anchor="middle">ValidationError — clear error messages</text>
</svg>`
      }
    ],
    examples: [
      {
        size: "medium",
        title: "BaseModel, Field constraints, and validators",
        language: "python",
        pipInstall: "pydantic",
        code: `from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Literal

class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str = Field(min_length=1, max_length=32768)

class LLMRequest(BaseModel):
    model: str = Field(default="gpt-4", pattern=r"^(gpt|claude|gemini).*")
    messages: list[Message]
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=1024, gt=0, le=128000)
    stream: bool = False

    @field_validator("messages")
    @classmethod
    def messages_not_empty(cls, v: list) -> list:
        if not v:
            raise ValueError("messages list cannot be empty")
        return v

    @model_validator(mode="after")
    def check_system_at_start(self) -> "LLMRequest":
        if self.messages and self.messages[0].role == "assistant":
            raise ValueError("First message cannot be from assistant")
        return self

# Valid request
req = LLMRequest(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are helpful."},
        {"role": "user", "content": "Explain embeddings."},
    ],
    temperature=0.9,
)
print(req.model_dump())

# Coercion: temperature="0.5" becomes 0.5
req2 = LLMRequest(
    messages=[{"role": "user", "content": "Hi"}],
    temperature="0.5",   # string → float coercion
)
print(f"Temperature: {req2.temperature} (type: {type(req2.temperature).__name__})")

# ValidationError
try:
    bad = LLMRequest(messages=[], temperature=5.0)  # empty messages + out-of-range temp
except Exception as e:
    print(f"Validation failed: {e}")`,
        expectedOutput: `{'model': 'gpt-4', 'messages': [{'role': 'system', 'content': 'You are helpful.'}, {'role': 'user', 'content': 'Explain embeddings.'}], 'temperature': 0.9, 'max_tokens': 1024, 'stream': False}
Temperature: 0.5 (type: float)
Validation failed: 2 validation errors for LLMRequest
messages
  Value error, messages list cannot be empty [type=value_error, ...]
temperature
  Input should be less than or equal to 2 [type=less_than_equal, ...]`
      },
      {
        size: "medium",
        title: "pydantic-settings for environment config",
        language: "python",
        pipInstall: "pydantic-settings",
        requiresApiKey: false,
        code: `from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="APP_",           # reads APP_OPENAI_API_KEY, etc.
        case_sensitive=False,
        extra="ignore",              # ignore unknown env vars
    )

    # These are read from environment variables:
    openai_api_key: str = Field(default="", description="OpenAI API key")
    database_url: str = Field(default="sqlite:///./app.db")
    debug: bool = False
    max_workers: int = Field(default=4, ge=1, le=32)
    allowed_models: list[str] = Field(default=["gpt-4", "gpt-3.5-turbo"])

# Create singleton settings (pattern used by FastAPI apps)
settings = Settings()

print(f"Debug mode: {settings.debug}")
print(f"Max workers: {settings.max_workers}")
print(f"Allowed models: {settings.allowed_models}")
print(f"API key set: {'yes' if settings.openai_api_key else 'no'}")

# JSON schema generation (used for OpenAI function calling!)
import json
schema = Settings.model_json_schema()
print(f"Config schema keys: {list(schema['properties'].keys())}")`,
        expectedOutput: `Debug mode: False
Max workers: 4
Allowed models: ['gpt-4', 'gpt-3.5-turbo']
API key set: no
Config schema keys: ['openai_api_key', 'database_url', 'debug', 'max_workers', 'allowed_models']`
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What does Pydantic do when you pass `'42'` for an `int` field?", options: ["Raises ValidationError", "Silently stores '42' as a string", "Coerces '42' to the integer 42", "Raises TypeError"], answer: 2, explanation: "Pydantic v2 coerces compatible types. A string that looks like an integer ('42') is automatically converted to int(42) for an int field. This is called 'lax mode' validation. If the string can't be converted (e.g., 'abc'), it raises ValidationError." },
      { difficulty: "medium", question: "What does `Field(ge=0, le=1)` do?", options: ["Sets the field as required", "Validates that the value is >= 0 and <= 1 (inclusive)", "Restricts to exactly 0 or 1", "Makes the field optional"], answer: 1, explanation: "Field() with ge (greater than or equal) and le (less than or equal) adds validation constraints. A temperature field with Field(ge=0.0, le=2.0) will raise ValidationError for values outside [0, 2]. Other options: gt (strictly greater), lt (strictly less), min_length, max_length, pattern (regex)." },
      { difficulty: "hard", question: "When would you use `@model_validator(mode='before')` vs `@field_validator`?", options: ["They are identical", "@model_validator(mode='before') receives and can modify the raw input dict before any field validation; @field_validator runs on a single already-parsed field", "@field_validator is for required fields; @model_validator for optional", "@model_validator is for class methods; @field_validator for instance methods"], answer: 1, explanation: "@field_validator('field_name') runs after the specific field has been parsed/coerced, transforming or further validating it. @model_validator(mode='before') receives the raw input data (as dict or model) before any field parsing — useful for cross-field validation, preprocessing entire payloads, or handling aliased keys. Use mode='after' to validate/transform after all fields are parsed." }
    ],
    commonMistakes: [
      { mistake: "Using mutable defaults in Pydantic fields (like Field(default=[]))", whyItHappens: "Same pattern as the Python mutable default bug", howToAvoid: "Use Field(default_factory=list) for mutable defaults: list[str] = Field(default_factory=list). Pydantic v2 will error if you try to use a mutable as a direct default." },
      { mistake: "Forgetting that Pydantic models are immutable by default", whyItHappens: "Trying to set model.field = new_value after creation", howToAvoid: "Pydantic v2 models are immutable by default. To allow mutation: model_config = ConfigDict(frozen=False). To update: use model.model_copy(update={'field': new_value})." }
    ],
    cheatSheet: `## Pydantic v2 Cheat Sheet
- **BaseModel**: \`class Config(BaseModel): field: type = default\`
- **Field constraints**: \`Field(ge=0, le=1, min_length=1, pattern=r"...")\`
- **Optional field**: \`field: str | None = None\`
- **Mutable default**: \`field: list[str] = Field(default_factory=list)\`
- **@field_validator**: validate/transform single field
- **@model_validator(mode="before")**: transform raw input dict
- **Serialize**: \`model.model_dump()\` → dict, \`model.model_dump_json()\` → JSON string
- **Parse**: \`Model.model_validate(dict_data)\`
- **JSON Schema**: \`Model.model_json_schema()\` (for function calling)
- **Settings**: class Settings(BaseSettings) reads from env vars`,
    furtherReading: [
      { type: "docs", title: "Pydantic v2 Documentation", url: "https://docs.pydantic.dev/latest/", whyRead: "Comprehensive docs with migration guide from v1. The concepts section is excellent." },
      { type: "docs", title: "pydantic-settings", url: "https://docs.pydantic.dev/latest/concepts/pydantic_settings/", whyRead: "Settings management from env vars — essential for FastAPI apps." }
    ],
    flashcards: [
      { front: "What is Pydantic's BaseModel for?", back: "Define data schemas with type annotations. Pydantic validates and coerces data at instantiation, raising ValidationError for invalid inputs." },
      { front: "What does Field(ge=0, le=2) do?", back: "Adds validation constraints: ge=greater than or equal to 0, le=less than or equal to 2. Value must be in [0, 2] or ValidationError is raised." },
      { front: "How do you serialize a Pydantic model to a dict?", back: "model.model_dump() → Python dict. model.model_dump_json() → JSON string. model.model_dump(exclude={'secret_field'}) to exclude fields." },
      { front: "What is pydantic-settings BaseSettings for?", back: "Reads configuration from environment variables and .env files. With env_prefix='APP_', field 'api_key' reads from APP_API_KEY. Used in FastAPI for 12-factor app config." },
      { front: "What does model_json_schema() produce?", back: "A JSON Schema dict describing the model's structure. OpenAI uses this format for function calling/tool schemas — you can pass Model.model_json_schema() directly." }
    ]
  }
];
