# Competition API Documentation

This document provides detailed information on the response bodies for the competition endpoints defined in `competition/urls.py`.

## Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/competition/standings/publish/` | Trigger asynchronous generation/publishing of standings. |
| **GET** | `/competition/standings/{exam_id}/` | Retrieve specific standings with detailed entries using Exam ID. |
| **GET** | `/competition/leaderboard/league/` | Retrieve the latest cumulative league leaderboard. |

---

## 1. Publish Standings
`POST /competition/standings/publish/`

Used by administrators to trigger the calculation of standings for a specific exam round.

### Request Body
```json
{
  "exam_id": "550e8400-e29b-41d4-a716-446655440000",
  "publish_now": true
}
```

### Response Body (`202 Accepted`)
```json
{
  "message": "Standings generation has been started."
}
```

---

## 2. Retrieve Standings
`GET /competition/standings/{exam_id}/`

Retrieves a snapshot of standings for a specific stage and round using the Exam ID.

### Response Body (`200 OK`)
```json
{
  "id": 1,
  "competition": 1,
  "stage": "league",
  "stage_display": "League",
  "round": 1,
  "exam": "550e8400-e29b-41d4-a716-446655440000",
  "facilitator_system": "vmlc",
  "is_published": true,
  "published_at": "2026-01-30T10:00:00Z",
  "meta": {},
  "created_at": "2026-01-30T09:55:00Z",
  "entries": [
    {
      "candidate": "uuid-of-candidate",
      "candidate_name": "John Doe",
      "candidate_email": "john.doe@example.com",
      "school_name": "St. Peters College",
      "exam_score": "95.50",
      "rank": 1,
      "percentile": 100.0,
      "tie_break_reason": null
    },
    {
      "candidate": "uuid-of-candidate-2",
      "candidate_name": "Jane Smith",
      "candidate_email": "jane.smith@example.com",
      "school_name": "Victory Academy",
      "exam_score": "92.00",
      "rank": 2,
      "percentile": 98.5,
      "tie_break_reason": null
    }
  ]
}
```

---

## 3. League Leaderboard
`GET /competition/leaderboard/league/`

Retrieves the latest cumulative leaderboard for the active competition's league stage. This combines scores from all published rounds.

### Response Body (`200 OK`)
```json
{
  "id": 5,
  "competition": 1,
  "stage": "league",
  "stage_display": "League",
  "as_of_round": 3,
  "created_at": "2026-01-30T15:00:00Z",
  "updated_at": "2026-01-30T15:05:00Z",
  "entries": [
    {
      "candidate": "uuid-of-candidate",
      "candidate_name": "John Doe",
      "candidate_email": "john.doe@example.com",
      "school_name": "St. Peters College",
      "total_score": "285.50",
      "overall_rank": 1,
      "rank_change": 0
    },
    {
      "candidate": "uuid-of-candidate-3",
      "candidate_name": "Alice Brown",
      "candidate_email": "alice.b@example.com",
      "school_name": "Greenwood High",
      "total_score": "278.00",
      "overall_rank": 2,
      "rank_change": 2
    }
  ]
}
```

### Field Definitions (Entries)
- **total_score**: The cumulative score across all rounds processed so far in the current stage.
- **overall_rank**: The current ranking of the candidate based on `total_score`.
- **rank_change**: The difference between the candidate's rank in the previous round and the current round. 
    - `0`: No change.
    - `+N`: Improved position (e.g., `2` means they moved up 2 spots).
    - `-N`: Dropped position (e.g., `-1` means they dropped 1 spot).
