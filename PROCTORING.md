# Proctoring & Integrity API Documentation

This document specifies the endpoints and data structures for the proctoring heartbeat and integrity audit systems.

---

## 1. Candidate Heartbeat API

**Endpoint:** `POST /v2/exams/{exam_id}/heartbeat/`
**Authentication:** Required (Candidate)
**Content-Type:** `multipart/form-data`

Used by the exam client to periodically (e.g., every 5 minutes) sync violation telemetry and environment snapshots.

### Request Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| `payload` | `string (JSON)` | A JSON string containing the telemetry data. |
| `face_capture` | `file (JPEG)` | A representative frame captured during the interval. |

### Payload Structure

```json
{
  "sequence_number": 1,
  "client_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "timestamp": "2026-03-14T10:05:00Z",
  "period_start": "2026-03-14T10:00:00Z",
  "period_end": "2026-03-14T10:05:00Z",
  "meta": {
    "os": "MacOS",
    "browser": "Chrome 122",
    "screen_resolution": "1920x1080",
    "battery_level": 0.85,
    "is_charging": true,
    "network_latency_ms": 120
  },
  "summary": {
    "TAB_SWITCH": 2,
    "MULTI_FACE": 12,
    "NO_FACE": 45
  },
  "events": [
    {
      "type": "TAB_SWITCH",
      "timestamp": "2026-03-14T10:02:15Z",
      "metadata": { "duration_seconds": 15, "question_id": 102 }
    }
  ]
}
```

### Success Response (`200 OK`)

```json
{
  "status": "ok",
  "sequence": 1
}
```

---

## 2. Integrity Audit API (Admin)

**Endpoint:** `GET /v2/exams/{exam_id}/candidates/{candidate_id}/integrity-audit/`
**Authentication:** Required (Admin/Staff)

Provides a comprehensive, chronological timeline of a candidate's exam attempt for auditing.

### Success Response (`200 OK`)

```json
{
  "candidate": {
    "id": "candidate-uuid",
    "name": "John Doe"
  },
  "attempt_summary": {
    "started_at": "2026-03-14T10:00:00Z",
    "submitted_at": "2026-03-14T11:00:00Z",
    "total_duration": "1:00:00"
  },
  "proctoring_summary": {
    "total_heartbeats": 12,
    "total_violations": 5,
    "critical_violations": 1,
    "integrity_score": 1.0,
    "average_suspicion": 0.15,
    "status": "clear"
  },
  "timeline": [
    {
      "type": "heartbeat",
      "sequence_number": 1,
      "timestamp": "2026-03-14T10:05:00Z",
      "face_capture_url": "https://vmlc-private.s3.amazonaws.com/...",
      "suspicion_score": 0.05,
      "summary": { "TAB_SWITCH": 0 },
      "events": []
    },
    {
      "type": "telemetry_gap",
      "expected_sequence": 2,
      "message": "Missing heartbeat(s) between Seq 1 and Seq 3"
    },
    {
      "type": "heartbeat",
      "sequence_number": 3,
      "suspicion_score": 0.85,
      "events": [
        {
          "type": "TAB_SWITCH",
          "timestamp": "2026-03-14T10:12:00Z",
          "is_critical": false,
          "metadata": { "duration_seconds": 45 }
        }
      ]
    }
  ]
}
```

---

## 3. Ranking Integration

The `RankingSnapshotEntry` includes two new fields to assist with triage:

- **`violation_score`**: (Float) A weighted average of suspicion across all heartbeats.
- **`proctoring_status`**: (String) One of `clear`, `suspicious`, or `flagged`.

These are available in the `RetrieveRankingSnapshotView` and `RetrieveCandidateRankingSnapshotEntryView`.
