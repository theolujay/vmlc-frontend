# Event-Driven System Design (refined)

## Overview

Replace client polling with a single WebSocket-based event channel per user session backed by an internal event bus. Events are domain-first, machine-friendly, and carry enough context to let the UI decide whether it needs to fetch additional details. Keep events explicit, versioned, and idempotent-friendly.

---

# Event envelope (recommended)

Make every event follow this envelope. It’s short, predictable, and future-proof.

```json
{
  "id": "uuid-v4",
  "type": "domain.entity.event",     // e.g., "exam.session.started"
  "version": 1,                      // schema version for this event type
  "timestamp": "2026-02-21T10:15:00Z",
  "actor_id": "user_123",            // optional: who caused the event
  "resource_id": "exam_session_456", // optional: primary resource affected
  "metadata": {                      // optional: lightweight routing hints
    "category": "exam",
    "priority": "high"
  },
  "payload": { }                     // domain-specific data (snapshot or delta)
}
```

Key fields and purpose:

* `id`: dedupe and tracing.
* `type`: drives routing (no secondary switch inside payload).
* `version`: safe schema evolution.
* `resource_id` and `actor_id`: let UI scope updates quickly.
* `metadata`: lightweight hints for UI prioritization.

---

# Naming conventions: predictable, hierarchical

Use `domain.entity.event` lower-case, dot-separated. No ALL-CAPS, no embedded switch-cases.

Examples:

```
exam.session.started
exam.session.time_updated
exam.session.question_changed
exam.session.ended

broadcast.created
broadcast.scheduled
broadcast.sent
broadcast.failed

user.profile.updated
user.role.changed

helpdesk.message.created
helpdesk.typing.started
helpdesk.typing.stopped

notification.created
notification.read

system.connected
system.reconnected
system.disconnected
system.unauthorized
```

Benefits:

* Easy wildcard subscriptions (`exam.session.*`, `helpdesk.*`)
* Human readable and machine-friendly
* Encourages single-purpose events (no `update_type` switch inside payload)

---

# Event design rules (practical)

1. **Single intent per event** — If you need to signal a time update, use `exam.session.time_updated`. Do not use `exam.session.updated` with an internal `update_type` field.
2. **Prefer snapshots for small objects, deltas for large** — If a single field changes (e.g., `is_read`), include the changed field. If the object is small (profile), include a compact snapshot to avoid an extra fetch.
3. **Make events idempotent-friendly** — Either include a unique `id` or state so repeated deliveries don’t corrupt state.
4. **Version events** — Use `version` on the envelope and treat changes as additive. Old consumers can ignore unknown fields.
5. **Attach routing metadata** — `metadata.category` and `metadata.priority` let the UI decide what to surface immediately vs buffer.

---

# Example event payloads

**Exam started**

```json
{
  "type": "exam.session.started",
  "resource_id": "exam_session_456",
  "payload": {
    "exam_session_id": "exam_session_456",
    "candidate_id": "candidate_789",
    "exam_name": "Final Assessment",
    "start_time": "2026-02-21T10:30:00Z",
    "initial_state": { "timer_seconds": 7200 }
  }
}
```

**Exam time update**

```json
{
  "type": "exam.session.time_updated",
  "resource_id": "exam_session_456",
  "payload": { "time_remaining_seconds": 1800 }
}
```

**Helpdesk message**

```json
{
  "type": "helpdesk.message.created",
  "resource_id": "thread_abc",
  "payload": {
    "id": "msg_001",
    "thread_id": "thread_abc",
    "sender_type": "candidate",
    "sender_name": "Jane Doe",
    "text": "I need help",
    "created_at": "2026-02-21T10:40:00Z"
  }
}
```

---

# Delivery semantics & guarantees (document and choose)

State the chosen semantics in the doc. Typical patterns:

* **At-most-once (fire-and-forget)**
  Simple, low-latency, no delivery guarantees. Use for non-critical ephemeral signals.

* **At-least-once**
  Retries may cause duplicates. Events must be idempotent or deduped by `id`.

* **Exactly-once (rare)**
  Complex and often unnecessary; use only with a persistent event log like Kafka + careful consumer offsets.

Also document retention and replay behavior (e.g., keep last N events for quick recoveries or provide a snapshot endpoint).

---

# WebSocket & connection events

Expose system-level events so the UI can react to connection state:

```
system.connected
system.reconnected
system.disconnected
system.unauthorized
```

UI must display connection status and handle `system.unauthorized` by forcing re-auth or logout.

---

# Frontend integration pattern (recommended)

1. **Single WebSocket per session**
   Managed by a centralized hook: `useAppWebSocket.tsx`.

2. **Central event router**
   Parse incoming envelope and dispatch to a central `eventRouter` (not directly to components).

3. **State stores, not raw socket subscriptions**
   `eventRouter` updates stores (Zustand/Redux/Context). Components subscribe to stores.

4. **Subscription patterns**

   * Global components subscribe to `exam.*`, `notification.*` as needed.
   * Page-level components can open lightweight local subscriptions to `resource_id`-scoped events.

5. **Example eventRouter pseudocode**

```ts
function eventRouter(event) {
  switch (event.type) {
    case "exam.session.time_updated":
      examStore.updateTime(event.resource_id, event.payload.time_remaining_seconds);
      break;
    case "helpdesk.message.created":
      helpdeskStore.addMessage(event.payload.thread_id, event.payload);
      break;
    case "user.profile.updated":
      userStore.mergeProfile(event.payload.user_id, event.payload);
      break;
    case "system.unauthorized":
      auth.logout();
      break;
    default:
      logger.warn("Unhandled event", event.type);
  }
}
```

6. **UI focus rule**
   UI components should decide focus by `type`, `resource_id`, and `metadata.priority`. Avoid deep payload inspection for routing.

---

# Backend architecture & concerns

* **Event bus / broker**
  Use Redis Pub/Sub for simplicity or Kafka/RabbitMQ for persistence and replay. Choose according to required guarantees.
* **WebSocket server**
  Scale horizontally behind a load balancer; use sticky sessions or centralized subscription management (e.g., a presence store) if needed.
* **Authorization**
  Tokens at handshake; revalidate periodically. Emit `system.unauthorized` to clients when token invalidates.
* **Fan-out**
  Event bus should fan out to WebSocket server instances; consider user/topic subscription maps in Redis to avoid pushing irrelevant events.
* **Event granularity**
  Balance frequency vs payload richness. Prefer a few useful, information-rich events over thousands of tiny ones.

---

# Observability & testing

* **Tracing**: correlate `id` across services and include it in logs (request id / event id).
* **Metrics**: events/sec, event queue lag, ws connections, reconnect rate, duplicate deliveries.
* **Replay & debug**: store event logs for a configurable window and allow replay for debugging.
* **Automated tests**: unit test eventRouter, integration tests for end-to-end delivery and UI-store updates, and load tests for fan-out scenarios.

---

# Security

* TLS-only WebSocket connections (wss).
* Validate tokens at handshake and on periodic intervals.
* Minimize sensitive data in payloads—use references and let client fetch full objects with an authenticated call if data is sensitive.
* Rate-limit event publishing per producer to avoid event storms.

---

# Migration checklist (to move from polling to events)

1. Audit existing polling endpoints and map to candidate events.
2. Design event types and envelope for each mapped endpoint.
3. Implement producer changes to emit events from domain services.
4. Deploy event bus + WebSocket server in a small test environment.
5. Implement `useAppWebSocket` and `eventRouter`. Start with non-critical domains (notifications).
6. Add `system.*` events and handle unauthorized/reconnect flows.
7. Replace polling for read-only data where payloads are sufficient.
8. Monitor metrics and increase event granularity gradually.
9. Deprecate polling endpoints when confident.
