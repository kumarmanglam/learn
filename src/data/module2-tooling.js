export const MODULE2_TOPICS = [
  // ─── 1. Docker ─────────────────────────────────────────────────────────
  {
    id: "docker",
    category: "Tooling",
    title: "Docker & Containers",
    priority: "High",
    icon: "🐳",
    estimatedMinutes: 45,
    prerequisites: ["env-setup"],
    nextTopics: ["ai-fundamentals"],
    whyItMatters: "Docker is the universal packaging format for AI applications. When you containerize your FastAPI + model server, it runs identically on your laptop, a coworker's machine, and a GPU cloud instance. Without Docker, 'it works on my machine' becomes a deployment blocker. Anthropic, OpenAI, and every AI company ships models in containers. Container fluency is non-negotiable for production AI work.",
    analogy: "A Docker image is a recipe + all ingredients in a sealed box. Your Dockerfile is the recipe (step-by-step instructions). The image is the baked result. The container is a running instance of that image — like serving a slice of that cake. You can run 10 containers from one image simultaneously, each isolated from the others.",
    content: `## Docker & Containers for AI Development

Docker packages your application + its dependencies into a portable, reproducible unit called a **container**.

### Why Containers Beat "Just Use venv"
- **Reproducibility**: Same OS, same Python version, same system libs (libssl, CUDA, etc.)
- **Isolation**: No conflicts between projects
- **Portability**: Run on any machine with Docker installed
- **Scalability**: Orchestrate with Kubernetes for production

### Core Concepts

| Concept | Description |
|---------|-------------|
| **Image** | Read-only blueprint (like a class definition) |
| **Container** | Running instance of an image (like an object) |
| **Dockerfile** | Script to build an image |
| **Registry** | Storage for images (Docker Hub, ECR, GCR) |
| **Layer** | Cached step in an image build |
| **Volume** | Persistent storage mounted into a container |

### Dockerfile for a FastAPI + AI App

\`\`\`dockerfile
# Use official Python slim image (smaller than full ubuntu)
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies first (cached layer)
RUN apt-get update && apt-get install -y --no-install-recommends \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies (separate layer — cached unless requirements change)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code (invalidates cache on code changes)
COPY . .

# Non-root user for security
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Expose port and start app
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

### Layer Caching Strategy
Docker caches each layer. If a layer's input hasn't changed, it reuses the cache.

**Order matters**: Put slow, rarely-changing steps first:
1. Base image (FROM)
2. System packages (apt-get)
3. Python dependencies (pip install)  ← only re-runs if requirements.txt changes
4. Application code (COPY . .)  ← most frequently changing

### Essential Docker Commands

\`\`\`bash
# Build
docker build -t myapp:v1 .           # build image from current dir
docker build -t myapp:v1 -f Dockerfile.prod .  # specify Dockerfile

# Run
docker run -p 8000:8000 myapp:v1     # run, map host:container port
docker run -d myapp:v1               # detached (background)
docker run -it python:3.11 bash      # interactive shell
docker run --env-file .env myapp:v1  # load env vars from file
docker run -v $(pwd)/data:/app/data myapp:v1  # mount volume

# Manage
docker ps                            # running containers
docker ps -a                         # all containers (inc. stopped)
docker logs <container_id>          # view logs
docker exec -it <id> bash           # shell into running container
docker stop <id> && docker rm <id>  # stop and remove

# Images
docker images                        # list images
docker rmi myapp:v1                  # remove image
docker system prune                  # clean up everything unused
\`\`\`

### docker-compose for Multi-Service Apps

\`\`\`yaml
# docker-compose.yml
version: "3.9"

services:
  api:
    build: .
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      - redis
    volumes:
      - ./models:/app/models  # persist model files

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  worker:
    build: .
    command: python worker.py
    env_file: .env
    depends_on:
      - redis
\`\`\`

\`\`\`bash
docker-compose up -d          # start all services in background
docker-compose logs -f api    # follow logs for api service
docker-compose down           # stop and remove containers
docker-compose build --no-cache  # rebuild ignoring cache
\`\`\`

### Multi-Stage Builds (Smaller Images)

\`\`\`dockerfile
# Stage 1: Builder (install everything)
FROM python:3.11 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Stage 2: Runtime (copy only what's needed)
FROM python:3.11-slim AS runtime
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

This can reduce image size from 1.5GB → 200MB.

### .dockerignore
Always create \`.dockerignore\` to exclude files from the build context:
\`\`\`
.venv/
__pycache__/
*.pyc
.env
.git/
*.log
data/
models/
\`\`\`

### GPU Support (for ML workloads)
\`\`\`dockerfile
FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04
# ... rest of Dockerfile
\`\`\`
\`\`\`bash
docker run --gpus all myapp:gpu     # expose all GPUs
docker run --gpus '"device=0,1"' myapp:gpu  # specific GPUs
\`\`\``,
    diagram: `<svg viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg" style="max-width:100%">
      <defs>
        <linearGradient id="dg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0ea5e9"/><stop offset="100%" stop-color="#38bdf8"/></linearGradient>
      </defs>
      <!-- Host machine -->
      <rect x="10" y="10" width="580" height="300" rx="12" fill="#0d1117" stroke="#30363d"/>
      <text x="24" y="36" fill="#8b949e" font-size="12" font-family="monospace">Host Machine (Linux / Mac / Windows)</text>
      <!-- Docker Engine -->
      <rect x="20" y="50" width="560" height="250" rx="10" fill="#161b22" stroke="#1f6feb"/>
      <text x="36" y="72" fill="#58a6ff" font-size="12" font-weight="bold" font-family="monospace">Docker Engine</text>
      <!-- Container 1 -->
      <rect x="35" y="85" width="160" height="190" rx="8" fill="#0d1117" stroke="#238636"/>
      <text x="55" y="108" fill="#7ee787" font-size="11" font-weight="bold" font-family="monospace">Container 1</text>
      <text x="55" y="125" fill="#8b949e" font-size="10" font-family="monospace">FastAPI :8000</text>
      <rect x="50" y="135" width="130" height="28" rx="4" fill="#12261e"/>
      <text x="65" y="154" fill="#7ee787" font-size="10" font-family="monospace">App Code</text>
      <rect x="50" y="170" width="130" height="28" rx="4" fill="#12261e"/>
      <text x="65" y="189" fill="#7ee787" font-size="10" font-family="monospace">Python 3.11</text>
      <rect x="50" y="205" width="130" height="28" rx="4" fill="#12261e"/>
      <text x="65" y="224" fill="#7ee787" font-size="10" font-family="monospace">Dependencies</text>
      <rect x="50" y="240" width="130" height="28" rx="4" fill="#1c2333"/>
      <text x="65" y="259" fill="#58a6ff" font-size="10" font-family="monospace">Shared OS Kernel</text>
      <!-- Container 2 -->
      <rect x="215" y="85" width="160" height="190" rx="8" fill="#0d1117" stroke="#9e6a03"/>
      <text x="235" y="108" fill="#e3b341" font-size="11" font-weight="bold" font-family="monospace">Container 2</text>
      <text x="235" y="125" fill="#8b949e" font-size="10" font-family="monospace">Redis :6379</text>
      <rect x="230" y="135" width="130" height="28" rx="4" fill="#271d03"/>
      <text x="245" y="154" fill="#e3b341" font-size="10" font-family="monospace">Redis 7</text>
      <rect x="230" y="170" width="130" height="28" rx="4" fill="#271d03"/>
      <text x="245" y="189" fill="#e3b341" font-size="10" font-family="monospace">Alpine Linux</text>
      <rect x="230" y="240" width="130" height="28" rx="4" fill="#1c2333"/>
      <text x="245" y="259" fill="#58a6ff" font-size="10" font-family="monospace">Shared OS Kernel</text>
      <!-- Container 3 -->
      <rect x="395" y="85" width="160" height="190" rx="8" fill="#0d1117" stroke="#8b5cf6"/>
      <text x="415" y="108" fill="#d2a8ff" font-size="11" font-weight="bold" font-family="monospace">Container 3</text>
      <text x="415" y="125" fill="#8b949e" font-size="10" font-family="monospace">Worker</text>
      <rect x="410" y="135" width="130" height="28" rx="4" fill="#1e1533"/>
      <text x="425" y="154" fill="#d2a8ff" font-size="10" font-family="monospace">ML Worker</text>
      <rect x="410" y="170" width="130" height="28" rx="4" fill="#1e1533"/>
      <text x="425" y="189" fill="#d2a8ff" font-size="10" font-family="monospace">Python 3.11</text>
      <rect x="410" y="205" width="130" height="28" rx="4" fill="#1e1533"/>
      <text x="425" y="224" fill="#d2a8ff" font-size="10" font-family="monospace">PyTorch + CUDA</text>
      <rect x="410" y="240" width="130" height="28" rx="4" fill="#1c2333"/>
      <text x="425" y="259" fill="#58a6ff" font-size="10" font-family="monospace">Shared OS Kernel</text>
    </svg>`,
    examples: [
      {
        title: "Dockerfile for FastAPI AI App",
        code: `# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# System deps (curl for healthchecks)
RUN apt-get update && apt-get install -y --no-install-recommends curl \\
    && rm -rf /var/lib/apt/lists/*

# Install Python deps first (layer cached until requirements.txt changes)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Security: run as non-root user
RUN useradd -m appuser && chown -R appuser /app
USER appuser

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s \\
  CMD curl -f http://localhost:8000/health || exit 1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
        language: "dockerfile",
        explanation: "A production-ready Dockerfile: slim base image, layer caching optimization, non-root user for security, and healthcheck."
      },
      {
        title: "docker-compose for API + Redis",
        code: `# docker-compose.yml
version: "3.9"

services:
  api:
    build: .
    ports:
      - "8000:8000"
    env_file: .env
    environment:
      - REDIS_URL=redis://redis:6379
    depends_on:
      redis:
        condition: service_healthy
    volumes:
      - ./models:/app/models  # persist model files outside container

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3
    volumes:
      - redis_data:/data  # persist data across restarts

volumes:
  redis_data:`,
        language: "yaml",
        explanation: "docker-compose orchestrates multiple services. 'depends_on' with health conditions ensures Redis is ready before API starts. Named volumes persist data across container restarts."
      },
      {
        title: "Build, run, and debug workflow",
        code: `#!/bin/bash
# Common Docker workflow for AI development

# 1. Build the image
docker build -t myai-app:dev .

# 2. Run with environment variables from .env file
docker run -p 8000:8000 --env-file .env myai-app:dev

# 3. Run interactively to debug
docker run -it --entrypoint bash myai-app:dev

# 4. Check logs of running container
docker ps  # get container ID
docker logs -f <container_id>  # follow logs

# 5. Execute command in running container
docker exec -it <container_id> python -c "import torch; print(torch.__version__)"

# 6. Mount local code for development (no rebuild needed)
docker run -p 8000:8000 \\
  -v $(pwd):/app \\
  --env-file .env \\
  myai-app:dev \\
  uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# 7. Cleanup
docker stop <container_id>
docker rm <container_id>
docker rmi myai-app:dev`,
        language: "bash",
        explanation: "The day-to-day Docker workflow: build, run, debug with interactive shell, follow logs, exec into running containers, and mount volumes for rapid development iteration."
      }
    ],
    quiz: [
      { difficulty: "easy", question: "What is the difference between a Docker image and a container?", options: ["They are the same thing", "An image is a running process; a container is a file", "An image is a read-only blueprint; a container is a running instance of that image", "A container is larger than an image"], answer: 2, explanation: "An image is like a class definition — static, read-only, and shareable. A container is a running instance of that image — like an object instantiated from the class. You can run many containers from one image simultaneously." },
      { difficulty: "medium", question: "Why should you COPY requirements.txt and run pip install BEFORE copying application code?", options: ["It doesn't matter — Docker builds all layers at once", "Python requires it for correct module resolution", "Docker caches layers; requirements rarely change but code does — so this avoids reinstalling deps on every code change", "To reduce image size"], answer: 2, explanation: "Docker caches each layer. If a layer's inputs haven't changed, it reuses the cache. By installing dependencies before copying code, the pip install layer is only re-run when requirements.txt changes — not on every code edit. This dramatically speeds up rebuilds." },
      { difficulty: "hard", question: "What does a multi-stage Docker build achieve?", options: ["Runs multiple containers simultaneously", "Allows building the image on multiple machines", "Uses one stage to compile/install everything, then copies only necessary artifacts to a lean final image — drastically reducing image size", "Builds different images for different environments"], answer: 2, explanation: "Multi-stage builds solve the 'build tools bloat' problem. Stage 1 (builder) installs compilers, headers, dev tools. Stage 2 (runtime) copies only the compiled artifacts from stage 1. The final image contains no build tools — only what's needed to run. This reduces images from 1.5GB+ to under 200MB for typical Python apps." }
    ],
    commonMistakes: [
      { mistake: "Copying all files before installing dependencies", whyItHappens: "Intuitive to copy code first", howToAvoid: "Always COPY requirements.txt → RUN pip install → COPY . . This way the pip install layer is cached and only re-runs when requirements.txt changes." },
      { mistake: "Not adding .dockerignore", whyItHappens: "COPY . . copies everything including .venv, .git, data/ folders", howToAvoid: "Create .dockerignore before building. At minimum: .venv/, __pycache__/, .env, .git/, *.pyc, data/, models/" },
      { mistake: "Running containers as root", whyItHappens: "Default Docker behavior", howToAvoid: "Add: RUN useradd -m appuser && chown -R appuser /app; USER appuser. Root in a container can escape to host under certain misconfigurations." }
    ],
    cheatSheet: `## Docker Cheat Sheet
- **Build**: \`docker build -t name:tag .\`
- **Run**: \`docker run -p 8000:8000 --env-file .env name:tag\`
- **Interactive**: \`docker run -it --entrypoint bash name:tag\`
- **Logs**: \`docker logs -f <id>\`
- **Exec into running**: \`docker exec -it <id> bash\`
- **Compose up**: \`docker-compose up -d\`
- **Compose logs**: \`docker-compose logs -f service_name\`
- **Clean up**: \`docker system prune\`
- **Layer caching**: deps before code, rarely-changing before frequently-changing
- **Multi-stage**: builder → runtime, reduces image size 80%+`,
    furtherReading: [
      { type: "docs", title: "Docker Official Docs — Get Started", url: "https://docs.docker.com/get-started/", whyRead: "Best hands-on introduction. The multi-container app tutorial is directly applicable to AI projects." },
      { type: "docs", title: "Docker Best Practices", url: "https://docs.docker.com/develop/develop-images/dockerfile_best-practices/", whyRead: "Official best practices for writing Dockerfiles — layer caching, multi-stage builds, security." }
    ],
    flashcards: [
      { front: "What is the difference between Docker image and container?", back: "Image = read-only blueprint (class). Container = running instance (object). Multiple containers can run from one image simultaneously." },
      { front: "Why put COPY requirements.txt before COPY . . in Dockerfile?", back: "Docker layer caching: if requirements.txt hasn't changed, the pip install layer is cached. Code changes constantly but deps don't — this avoids reinstalling all packages on every rebuild." },
      { front: "What does docker-compose solve?", back: "Orchestrates multiple containers (API + Redis + Worker) as a single application. Handles networking, startup order, environment variables, and volume mounts with a single YAML file." },
      { front: "What is a multi-stage Docker build?", back: "Uses Stage 1 (builder) to install/compile everything, then Stage 2 (runtime) copies only necessary artifacts. Reduces image size 80%+ by excluding build tools from the final image." },
      { front: "What should always be in .dockerignore?", back: ".venv/, __pycache__/, .env (secrets!), .git/, *.pyc, data/, models/ — prevents secrets leaking into images and keeps build context small." }
    ]
  }
];
