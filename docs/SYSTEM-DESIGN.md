# System Design Document — Expense Tracker

## Intent

The purpose of this application is **not** to build a complex product — it's to demonstrate how to design a **highly scalable, industrial-standard Node/TypeScript application** using enterprise patterns.

I deliberately chose a simple domain (expense tracking) so the architecture decisions are easy to understand without getting lost in complex business logic. The focus is on **how** the system is built, not **what** it does.

Every pattern here — layered architecture, schema validation, response envelopes, distributed tracing, DTOs — is the same approach used in production services handling millions of requests at companies like Stripe, Shopify, and AWS.

---

## Overview

This application is designed as a **scalable, enterprise-grade Node/TypeScript service** following industry-standard patterns used in production microservices at companies like Stripe, Shopify, and Ritchie Bros.

The architecture prioritizes: **maintainability**, **testability**, **observability**, and **horizontal scalability**.

---

## 1. Layered Architecture (Separation of Concerns)

**Pattern:** Controller → Service → Repository

**Why this matters at scale:**

- **Controller** — Handles HTTP concerns only (request parsing, response formatting). If we switch from REST to GraphQL or gRPC tomorrow, only this layer changes.
- **Service** — Contains all business logic. It doesn't know about HTTP, databases, or frameworks. This means the same business rules work whether called from an API endpoint, a cron job, or a message queue consumer.
- **Repository** — Abstracts data access. If we migrate from PostgreSQL to DynamoDB, or add a Redis cache layer, only repositories change. Business logic remains untouched.

**Scalability impact:** Each layer can be independently tested, replaced, or scaled. Teams can work on different layers without conflicts.

---

## 2. Custom Exception Hierarchy

**Pattern:** Typed error classes with HTTP semantics

```
HttpException (base)
├── BusinessException (4xx — client's fault)
│   ├── BadRequestException (400)
│   ├── UnauthorizedException (401)
│   ├── ForbiddenException (403)
│   ├── NotFoundException (404)
│   ├── ConflictException (409)
│   └── ValidationException (422)
└── ServerException (5xx — our fault)
    ├── InternalServerException (500)
    └── ServiceUnavailableException (503)
```

**Why this matters at scale:**

- **Consistent error contracts** — Every API consumer gets predictable error shapes. Frontend teams, mobile teams, and third-party integrators all know what to expect.
- **Operational clarity** — 4xx errors don't page on-call engineers. 5xx errors do. This distinction drives alerting, SLOs, and dashboards.
- **Error propagation** — In a microservice mesh, typed exceptions let upstream services decide whether to retry (503) or fail fast (400).

---

## 3. Schema Validation at Service Boundary

**Pattern:** Zod schemas validate all input before business logic executes

**Why this matters at scale:**

- **Defense in depth** — Never trust input from any source (API, queue, internal call). Validation at the service layer means the system is protected regardless of entry point.
- **Type narrowing** — After validation, TypeScript knows the exact shape of data. No more `as any` or runtime surprises.
- **API contract enforcement** — Schemas serve as living documentation of what the API accepts. They can auto-generate OpenAPI specs.
- **Fail fast** — Invalid data is rejected immediately with field-level error messages, before hitting the database or triggering side effects.

---

## 4. Distributed Tracing (OpenTelemetry)

**Pattern:** Every operation wrapped in spans with typed attributes

**Why this matters at scale:**

- **Request lifecycle visibility** — A single user request flows through Controller → Service → Repository → Database. Tracing shows exactly where time is spent.
- **Cross-service correlation** — When this service calls Payment or Notification services, trace context propagates automatically. One trace ID connects the entire distributed transaction.
- **Performance debugging** — "Why is GET /expenses slow?" Tracing shows it's the DB query taking 800ms, not the business logic. Without tracing, you're guessing.
- **SLO measurement** — Traces feed into SLO calculations (e.g., "99.9% of requests complete under 2 seconds").

**Scalability impact:** As you add more services, tracing is the only way to understand system behavior. Logs alone don't show causality across services.

---

## 5. Database Design (PostgreSQL + Prisma)

**Pattern:** Relational schema with migrations, connection pooling, and ORM abstraction

**Why this matters at scale:**

- **Migrations as code** — Every schema change is versioned, reviewable, and reproducible across environments (dev → staging → prod). No manual DDL.
- **Connection pooling** — Prisma manages a connection pool. Under load, 100 concurrent requests share 10 DB connections instead of each opening their own.
- **UUID primary keys** — No auto-increment conflicts in distributed systems. UUIDs can be generated client-side, enabling offline-first patterns and reducing DB round-trips.
- **Referential integrity** — Foreign keys (Expense → Category) enforce data consistency at the database level, not just application level.

**Horizontal scaling path:** Add read replicas for query-heavy workloads. Prisma supports read/write splitting with minimal code changes.

---

## 6. Authentication & Session Management

**Pattern:** Stateless cookie-based sessions with middleware protection

**Why this matters at scale:**

- **Middleware pattern** — Auth check runs before any route handler. Adding new protected routes requires zero auth code — just add to the matcher config.
- **Stateless sessions** — Session data lives in a signed cookie, not server memory. Any instance can handle any request — critical for horizontal scaling behind a load balancer.
- **Password hashing (bcrypt)** — Industry-standard adaptive hashing. Cost factor can increase as hardware improves without changing stored hashes.

**Scalability impact:** No sticky sessions needed. Load balancer can round-robin freely across N instances.

---

## 7. Containerization (Docker + Compose)

**Pattern:** Multi-service local development environment matching production topology

**Why this matters at scale:**

- **Environment parity** — Dev runs the same PostgreSQL, Grafana, and Tempo that production uses. "Works on my machine" is eliminated.
- **Reproducible builds** — `Dockerfile` produces identical artifacts regardless of developer's OS or installed tools.
- **Service isolation** — Each service (app, DB, tracing) runs in its own container with defined resource limits and network boundaries.
- **Kubernetes-ready** — The same Docker image deploys to K8s with Helm charts. Container is the deployment unit.

**Production path:** Add health checks, resource limits, and multi-stage builds for smaller images.

---

## 8. Modular Domain Organization

**Pattern:** Feature modules with co-located controller/service/repository

```
src/modules/
├── auth/        (authentication bounded context)
├── category/    (category management)
└── expense/     (expense tracking — core domain)
```

**Why this matters at scale:**

- **Team ownership** — Each module can be owned by a different team. Clear boundaries prevent coupling.
- **Microservice extraction** — When expense tracking needs its own deployment, you extract the `expense/` module into a separate service. The boundaries are already defined.
- **Cognitive load** — New developers understand one module without reading the entire codebase.
- **Independent deployability** — Changes to auth don't require testing expense logic (when properly decoupled).

---

## 9. Testing Strategy (Multi-Layer)

**Pattern:** Test pyramid — unit → component → integration

**Why this matters at scale:**

- **Unit tests** — Fast, isolated, test business logic without DB or HTTP. Run in milliseconds. Catch logic bugs.
- **Component tests** — Test UI components in isolation with mocked data. Catch rendering bugs.
- **Integration tests** — Test full request flow (HTTP → Controller → Service → Repository → DB). Catch wiring bugs.

**Scalability impact:** Fast unit tests run on every commit (seconds). Slow integration tests run on PR merge (minutes). This keeps CI fast while maintaining confidence.

**Enterprise additions (future):** Contract tests (Pact) verify service-to-service compatibility. Load tests (K6) verify performance under stress.

---

## 10. Observability Stack (Grafana + Tempo)

**Pattern:** Traces exported to Tempo, visualized in Grafana

**Why this matters at scale:**

- **Three pillars** — Enterprise observability requires Logs + Metrics + Traces. We have traces; logs and metrics are next.
- **Vendor-agnostic** — OpenTelemetry is the CNCF standard. Switch from Tempo to Honeycomb, Datadog, or Jaeger by changing one exporter config.
- **Cost control** — Sampling strategies let you trace 100% in dev but 10% in prod, controlling storage costs while maintaining visibility.

---

## 11. Environment & Configuration Management

**Pattern:** Validated environment variables with fail-fast startup

**Why this matters at scale:**

- **Fail fast** — If `DATABASE_URL` is missing, the app crashes immediately on startup with a clear error — not 5 minutes later when the first DB query runs.
- **Type-safe config** — `env.DATABASE_URL` is typed, not `process.env.DATABASE_URL` which is `string | undefined`.
- **Environment separation** — Same code runs in dev/staging/prod with different configs. No code changes for deployment.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                     │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼───────────────────────────────┐
│                   Next.js Middleware                      │
│              (Auth check, session validation)             │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                     API Routes                            │
│            /api/auth  /api/expenses  /api/categories     │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    Controllers                            │
│         (HTTP parsing, response formatting)               │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                     Services                              │
│     (Business logic, validation, orchestration)           │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                   Repositories                            │
│            (Data access abstraction)                      │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│              PostgreSQL (via Prisma ORM)                  │
└─────────────────────────────────────────────────────────┘

         ┌──────────────────────────────────┐
         │     OpenTelemetry Collector       │
         │    (Traces → Tempo → Grafana)     │
         └──────────────────────────────────┘
```

---

## Scalability Roadmap

| Current State | Next Step | Enterprise Target |
|---------------|-----------|-------------------|
| Single instance | Horizontal scaling (multiple containers) | Auto-scaling (K8s HPA) |
| Direct DB calls | Connection pooling (PgBouncer) | Read replicas + write splitting |
| Synchronous only | Background jobs (BullMQ) | Event-driven (Kafka/SQS) |
| Cookie sessions | JWT tokens | OAuth2 + API keys |
| Single service | Module extraction | Microservice mesh |
| Manual deploys | CI/CD pipeline | GitOps (ArgoCD) |
| Traces only | + Structured logging | + Metrics + SLOs + Alerting |

---

## 12. Response Envelope (Standardized API Contract)

**Pattern:** Every endpoint returns a consistent JSON structure — `{ data }` for success, `{ data, meta }` for lists, `{ error }` for failures.

**Response shapes:**

```json
// Single resource
{ "data": { "id": "...", "item": "Coffee", "price": 5.5 } }

// Collection with pagination
{ "data": [...], "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 } }

// Error
{ "error": { "message": "Expense not found", "statusCode": 404 } }
```

**Why this matters at scale:**

- **Frontend predictability** — Every API consumer writes one response handler. Check `response.data` for success, `response.error` for failure. No per-endpoint parsing logic.
- **Backward-compatible evolution** — Need to add `requestId`, `deprecationWarning`, or `apiVersion`? Add it to the envelope without touching the `data` shape. Zero breaking changes.
- **Pagination consistency** — Every list endpoint returns the same `meta` shape. Frontend pagination components are reusable across all resources.
- **Error uniformity** — One error shape everywhere means one error boundary on the frontend, one alerting rule on the backend, one log parser in your observability stack.
- **SDK generation** — Tools like OpenAPI codegen produce cleaner client SDKs when the response shape is predictable.

**Industry examples:** Stripe (`{ data, has_more }`), GitHub (`data` + `Link` headers), Twilio (`{ data, meta }`), AWS (`{ result, metadata }`).

---

## 13. Schema Validation with Zod (Input Boundary Protection)

**Pattern:** Every piece of external input is validated through a typed schema before reaching business logic.

**Implementation:**

```
Client Request → Controller (parse query params) → Service (validate body via Zod) → Repository
                                                         ↓ (if invalid)
                                                   ValidationException (422)
                                                         ↓
                                              { error: { message: "price: Price must be > 0", statusCode: 422 } }
```

**Why this matters at scale:**

- **Defense in depth** — Services validate regardless of caller (HTTP, cron, queue consumer, internal call). No unprotected entry point.
- **Type narrowing** — After `validate(schema, data)`, TypeScript knows the exact shape. No `as any`, no runtime type errors downstream.
- **Field-level error messages** — Clients get `"price: Price must be greater than 0"` instead of generic `"Bad request"`. Reduces support tickets.
- **Schema as documentation** — Zod schemas are the single source of truth for what the API accepts. They can auto-generate OpenAPI specs.
- **Strips unknown fields** — Zod's `.parse()` removes fields not in the schema. Prevents mass-assignment attacks (e.g., client sending `{ role: "admin" }`).
- **Composable** — `UpdateExpenseSchema = CreateExpenseSchema.partial()` — DRY, no duplication.

---

## 14. Response DTOs (Data Transfer Objects)

**Pattern:** Mapper functions sit between the database layer and the API response, controlling exactly which fields leave the server.

```
Database (Prisma) → Raw Entity (all fields) → DTO Mapper → Response (safe fields only)
```

**Why this matters at scale:**

- **Security** — Sensitive fields (password hashes, internal IDs, soft-delete flags) never reach the client. Even if a developer forgets, the mapper blocks it.
- **API stability** — Database schema changes (rename column, add internal field) don't break the API contract. The mapper absorbs internal changes.
- **Versioning** — When you need API v2 with a different response shape, create a new mapper. Same DB, different output.
- **Date formatting** — Database returns `Date` objects. DTOs convert to ISO strings consistently. No timezone bugs on the client.
- **Decoupling** — Frontend team codes against the DTO type. Backend team changes the DB freely. The mapper is the contract boundary.

**File structure:**
```
src/lib/dto/
├── index.ts          ← barrel export
├── expense.dto.ts    ← toExpenseDto() — excludes categoryId (redundant with nested category)
├── category.dto.ts   ← toCategoryDto() — only id + name
└── user.dto.ts       ← toUserDto() — NEVER includes password
```

---

## 15. Health Check Endpoints (Liveness & Readiness Probes)

**Pattern:** Two separate endpoints that distinguish "is the process alive?" from "can it serve traffic?"

**Endpoints:**

| Endpoint | Type | Checks | Healthy | Unhealthy |
|----------|------|--------|---------|-----------|
| `GET /api/health` | Liveness | Process is running | `200 { status: "ok" }` | Never fails if server is up |
| `GET /api/ready` | Readiness | Database connectivity | `200 { database: "connected" }` | `503 { database: "disconnected" }` |

**Why two endpoints, not one:**

- App is alive but DB is down → **stop sending traffic** (readiness fails), but **don't restart** (liveness still passes). The DB might recover in seconds.
- App process crashed → **restart it** (liveness fails).
- Combining both into one endpoint means a DB blip causes unnecessary container restarts, which makes the outage worse.

**Why this matters at scale:**

- **Load balancers** (ALB, Nginx, K8s Service) — remove unhealthy instances from rotation automatically. Users never see a 503.
- **Kubernetes** — `livenessProbe` → restart pod. `readinessProbe` → remove from Service endpoints. Different actions for different failures.
- **CI/CD pipelines** — wait for `/api/ready` before running integration tests against a freshly deployed instance.
- **Docker Compose** — `healthcheck` ensures dependent services wait for the app to be truly ready, not just "port is open."
- **Zero-downtime deploys** — new instance only receives traffic after readiness passes. Old instance drains existing requests.

---

## 16. Structured Logging (Pino)

**Pattern:** All application logs are JSON with consistent fields — level, timestamp, service name, error context.

**Output example:**
```json
{"level":"warn","time":"2026-05-06T16:07:09.806Z","name":"expense-tracker","statusCode":409,"msg":"Email already registered","err":{"type":"ConflictException","stack":"..."}}
```

**Why this matters at scale:**

- **Machine-parseable** — Log aggregators (Datadog, ELK, CloudWatch) can index, filter, and alert on JSON fields. `console.log("error happened")` is useless at scale.
- **Log levels** — `error` pages on-call. `warn` goes to dashboards. `info` is for auditing. `debug` is for local dev. One config change controls verbosity per environment.
- **Error context** — Stack traces, status codes, and exception types are structured fields — not buried in a string you have to regex-parse.
- **Correlation** — Every log line can include `requestId` and `traceId`, connecting logs to traces to the specific user request.

---

## 17. Request ID (Correlation)

**Pattern:** Every incoming request gets a unique `X-Request-Id` header. If the client provides one, we use it. Otherwise we generate a UUID.

**Flow:**
```
Client → Middleware (generate/passthrough ID) → Controller → Service → Repository
                ↓                                    ↓           ↓
         Response header                          Logs        Traces
         X-Request-Id: abc-123                  requestId   span attribute
```

**Why this matters at scale:**

- **Debug any request** — User reports "I got an error." Support asks for the request ID from the response header. Engineer searches logs/traces by that ID. Instant root cause.
- **Cross-service tracing** — When Service A calls Service B, it forwards the `X-Request-Id`. The entire distributed transaction is linked by one ID.
- **Client-provided IDs** — Mobile apps or frontend can generate their own ID before sending the request. If the request fails mid-flight, they can retry with the same ID for idempotency tracking.
- **Audit trail** — Every action in the system is traceable to a specific request, user, and timestamp.

---

## 18. Graceful Shutdown

**Pattern:** Intercept `SIGTERM`/`SIGINT` signals, flush all buffers, close connections, then exit cleanly.

**Shutdown sequence:**
```
SIGTERM received
    → Log "shutdown signal received"
    → Flush OpenTelemetry traces (so no data is lost)
    → Disconnect Prisma (close DB connection pool)
    → Log "shutdown complete"
    → process.exit(0)
```

**Why this matters at scale:**

- **No dropped requests** — Without graceful shutdown, in-flight requests get killed mid-response. Users see broken pages or partial data.
- **No lost telemetry** — OpenTelemetry buffers traces in memory. If the process dies without flushing, the last N seconds of traces vanish — exactly when you need them most (during a crash).
- **No connection leaks** — Orphaned DB connections exhaust the pool. Other instances can't connect. Cascading failure.
- **Kubernetes rolling deploys** — K8s sends SIGTERM, waits `terminationGracePeriodSeconds` (default 30s), then force-kills. Your app uses that window to drain cleanly.
- **Docker stop** — Same pattern. `docker stop` sends SIGTERM first, waits 10s, then SIGKILL.

**Without graceful shutdown:** Deploy = brief outage. With it: zero-downtime deploys.

---

## 19. Dependency Injection (Constructor Injection)

**Pattern:** Each class receives its dependencies through the constructor instead of importing them directly.

**Wiring:**
```
Container (index.ts)
    → creates ExpenseRepository(prisma)
    → creates ExpenseService(repository)
    → creates ExpenseController(service)
    → exports expenseController
```

**Why this matters at scale:**

- **Testability** — Test any layer in isolation by passing a fake. No `jest.mock` needed:
  ```ts
  const fakeRepo = { findById: jest.fn().mockResolvedValue(null) };
  const service = new ExpenseService(fakeRepo);
  // test service logic without a real DB
  ```
- **Swappability** — Need a Redis-cached repository? Create `CachedExpenseRepository` with the same interface, pass it to the service. Zero changes to business logic.
- **SOLID principles** — Dependency Inversion Principle: high-level modules (service) don't depend on low-level modules (Prisma). Both depend on abstractions.
- **Explicit dependencies** — Looking at a constructor tells you exactly what a class needs. No hidden imports buried in the file.
- **Multiple instances** — Need two services with different configs? Create two instances with different dependencies. Impossible with static methods.

**File structure:**
```
src/modules/expense/
├── index.ts                ← container (wires dependencies)
├── expense.repository.ts  ← constructor(prisma)
├── expense.service.ts     ← constructor(repository)
└── expense.controller.ts  ← constructor(service)
```
