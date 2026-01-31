# V2 Exam Endpoints Documentation

This document outlines the response structures and request specifications for the newly implemented V2 exam endpoints.

## 1. List / Create Exams
**Endpoint:** `GET | POST /v2/exams/`  
**View:** `ExamListV2View`

### GET Response Body
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "title": "2026 | League Round 1",
      "status": "scheduled",
      "competition_edition": 2026,
      "question_count": 50,
      "scheduled_date": "2026-01-30T00:00:00Z",
      "concluded_at": null,
      "created_at": "2026-01-29T12:00:00Z"
    }
  ],
  "question_pool_data": {
    "total_questions": 50,
    "hard_questions_count": 15,
    "moderate_questions_count": 25,
    "easy_questions_count": 10
  }
}
```

### POST Request Body (Create)
All fields are optional as they have defaults or allow nulls in the database.
- `description` (String): Detailed description of the exam.
- `scheduled_date` (DateTime): ISO 8601 formatted string (e.g., `"2026-01-30T10:00:00Z"`).
- `open_duration_hours` (Integer): How long the exam remains open from the scheduled date. Default: `12`.
- `countdown_minutes` (Integer): The timer duration once a candidate starts. Default: `60`.
- `is_active` (Boolean): Whether the exam is active. Default: `true`.
- `questions` (Array of Integers): List of Question IDs to associate with this exam.
- `stage_id` (Integer): Optional. ID of the competition stage to link this exam to.
- `round` (Integer): Optional. Round number within the stage (required for League stages).

---

## 2. Exam Detail / Update
**Endpoint:** `GET | PUT | PATCH | DELETE /v2/exams/<uuid:exam_id>/`  
**View:** `ExamDetailV2View`

### GET Response Body
```json
{
  "id": "uuid",
  "title": "2026 | Screening",
  "description": "Detailed description of the exam.",
  "status": "scheduled",
  "is_active": true,
  "is_currently_open": false,
  "competition_edition": 2026,
  "open_duration_hours": 2,
  "countdown_minutes": 60,
  "scheduled_date": "2026-01-30T00:00:00Z",
  "concluded_at": null,
  "created_at": "2026-01-29T12:00:00Z",
  "created_by": {
    "id": "uuid",
    "user": {
      "first_name": "John",
      "last_name": "Doe"
    }
  },
  "updated_by": null,
  "questions": {
    "question_pool_data": {
      "total_questions": 20,
      "hard_questions_count": 5,
      "moderate_questions_count": 10,
      "easy_questions_count": 5
    },
    "results": [
      {
        "id": 1,
        "text": "Solve for $x$: $x^2 - 5x + 6 = 0$",
        "option_a": "$x = 2, 3$",
        "option_b": "$x = -2, -3$",
        "option_c": "$x = 1, 6$",
        "option_d": "$x = 0, 5$",
        "correct_answer": "B",
        "difficulty": "easy",
        "created_at": "2026-01-29T12:00:00Z",
        "created_by": { ... },
        "updated_at": "...",
        "updated_by": "..."
      }
    ],
    "count": 20,
    "next": null,
    "previous": null
  }
}
```

### PUT / PATCH Request Body (Update)
- `description` (String): Optional.
- `scheduled_date` (DateTime): Optional.
- `open_duration_hours` (Integer): Optional.
- `countdown_minutes` (Integer): Optional.
- `is_active` (Boolean): Optional.
- `questions` (Array of Integers): Optional. Replaces the existing list of questions.
- `stage_id` (Integer): Optional. ID of the competition stage to link this exam to.
- `round` (Integer): Optional. Round number within the stage (required for League stages).

---

## 3. Exam Questions
**Endpoint:** `GET /v2/exams/<uuid:exam_id>/questions/`  
**View:** `ExamQuestionsV2View`

### Response Body
```json
[
  {
    "id": 1,
    "text": "Solve for $x$: $x^2 - 5x + 6 = 0$",
    "option_a": "$x = 2, 3$",
    "option_b": "$x = -2, -3$",
    "option_c": "$x = 1, 6$",
    "option_d": "$x = 0, 5$",
    "correct_answer": "B",
    "difficulty": "easy",
    "created_at": "2026-01-29T12:00:00Z",
    "created_by": {
      "id": "uuid",
      "user": {
        "first_name": "John",
        "last_name": "Doe"
      }
    },
    "updated_at": "2026-01-29T12:00:00Z",
    "updated_by": null
  }
]
```

---

## 4. Exam Results
**Endpoint:** `GET /v2/exams/<uuid:exam_id>/results/`  
**View:** `ExamResultsV2View`

### Response Body
```json
[
  {
    "candidate_name": "Jane Smith",
    "candidate_school_name": "Example Academy",
    "score": "85.00",
    "auto_score": true,
    "score_submitted_by": null,
    "recorded_at": "2026-01-30T15:00:00Z"
  }
]
```

---

## 5. Take Exam (Candidate View)
**Endpoint:** `GET /v2/exams/<uuid:exam_id>/take-exam/`  
**View:** `candidate_take_exam_V2`

### Response Body
```json
{
  "id": "uuid",
  "title": "2026 | Screening",
  "description": "Exam Description",
  "open_duration_hours": 2,
  "scheduled_date": "2026-01-30T00:00:00Z",
  "countdown_minutes": 60,
  "questions": [
    {
      "id": 1,
      "text": "Solve for $x$: $x^2 - 5x + 6 = 0$",
      "option_a": "$x = 2, 3$",
      "option_b": "$x = -2, -3$",
      "option_c": "$x = 1, 6$",
      "option_d": "$x = 0, 5$"
    }
  ]
}
```

---

## 6. Candidate Exam History
**Endpoint:** `GET /v2/candidates/<uuid:candidate_id>/exam-history/`  
**View:** `ExamHistoryV2View`

### Response Body
```json
[
  {
    "exam": "2026 | Screening",
    "score": "85.00"
  }
]
```

---

## Notes & Implementation Details

### 1. Math Support (LaTeX)
Questions and options are stored and returned in **LaTeX format** where necessary (e.g., `$x^2 - 5x + 6 = 0$`). Frontend consumers should ensure to render these strings correctly.

### 2. Exam Title Conventions
Exam titles follow a strict naming convention based on the competition stage:
- **Screening/Final:** `{Competition Edition} | {Stage Name}` (e.g., `2026 | Screening`)
- **League:** `{Competition Edition} | League Round {X}` (e.g., `2026 | League Round 1`)
For exam title display, however, `{Competition Edition}` should be stripped out by the client where necessary, leaving just the `{Stage Name}`.

### 3. Exam Status Logic
The `status` field is dynamically computed based on time and activity:
- `draft`: No scheduled date or duration set.
- `scheduled`: Has a future scheduled date.
- `ongoing`: Currently within the open window (scheduled date + duration).
- `concluded`: Past the end time.
- `cancelled`: Manually deactivated (`is_active=False`).

### 4. Read-Only Fields
The following fields are strictly read-only and will be ignored if included in a request body:
- `id`
- `title`
- `status`
- `competition_edition`
- `is_currently_open`
- `concluded_at`
- `created_at`
- `created_by`
- `updated_by`
- `question_count`


```
+----------------------------------------------------------------------------------+
| VMLC 3.0                                          Status: League · Round 3 of 6  |
|----------------------------------------------------------------------------------|
|• Enrolled: 1575 • Active: 612 • Eliminated: 636 • Awaiting Next Challenge: 412   |
+----------------------------------------------------------------------------------+
| Stage Board: (read-only orientation)                                             |
|  [SCREENING] ● Completed   [LEAGUE] ● Active (Round 3/6)   [FINAL] ○ Pending     |
|                                                                                  |
+----------------------------------------------------------------------------------+
|                                                                                  |
|  [ Stage Progress (league) ]                                                     |
|  R1 ●─R2 ●─R3 ●─R4 ○─R5 ○─R6 ○                                                   |
|  (● = published standings)                                                       |
|                                                                                  |
+----------------------------------------------------------------------------------+
| Available Results (select exam to view details)                                  |
| 1) Screening Exam                     [Status: Completed]   [View] [Generate]    |
|    - Candidates sat: 10,230           Standings: Published (screening_1)         | 
|                                                                                  |
| 2) League - Round 1                   [Status: Concluded]  [View] [Generate]     |
|    - Standings: Published (league_1)       Avg: 62.4  | Absent: 200              |
|                                                                                  |
| 3) League - Round 2                   [Status: Concluded]  [View] [Generate]     |
|    - Standings: Published (league_2)       Avg: 64.1  | Absent: 190              |
|                                                                                  |
| 4) League - Round 3                   [Status: Completed]  [View] [Generate]     |
|    - Standings: Draft (not published)  [Publish]                                 |
|                                                                                  |
| 5) Final Exam                         [Status: Draft]      [Edit Exam]           |
+----------------------------------------------------------------------------------+
| League Leaderboard                                                               |
| - Based on published rounds only                                                 |
| - Actions: [View]                                                                |
| (Shows only Top 3 like it's currently implemented)                               |
|  Top 3:                                                                          |
|   1. Candidate A — 372.5   2. Candidate B — 369.0   3. Candidate C — 365.0       |
+----------------------------------------------------------------------------------+

```


---


**Task: Design the Competition Tab (Staff View)**

You are designing the **Competition tab** for the staff portal**.

This is a **staff-facing screen**, not candidate-facing.
Your job is to **design the UI and interaction flow**.

Work **in the style of the project**:

* Calm, structured, no visual noise
* Explicit actions (nothing happens “magically”)
* Read-only orientation at the top, actions lower down
* Designed for clarity under pressure
* Assumes staff already understand the competition rules

Do **not** introduce new concepts or features beyond what is shown.
You can take inspration from the candidate's portal, though

---

## What this screen is for

The Competition tab answers three questions for staff:

1. **Where are we in the competition right now?**
2. **What results exist, and what state are they in?**
3. **What can I safely act on right now?**

This screen does **not**:

* Create exams
* Edit exams (except linking out)
* Automatically publish anything
* Show full standings tables inline

---

## Target Frontend

* **Next.js**
* Admin/staff layout
* Desktop-first
* Clean, terminal-like density is acceptable

---

## The exact wire sketch to work from

This is the **authoritative layout**.
You may refine spacing and hierarchy, but do not reinvent the structure.

```
+----------------------------------------------------------------------------------+
| VMLC 3.0                                          Status: League · Round 3 of 6  |
|----------------------------------------------------------------------------------|
|• Enrolled: 1575 • Active: 612 • Eliminated: 636 • Awaiting Next Challenge: 412   |
+----------------------------------------------------------------------------------+
| Stage Board: (read-only orientation)                                             |
|  [SCREENING] ● Completed   [LEAGUE] ● Active (Round 3/6)   [FINAL] ○ Pending     |
|                                                                                  |
+----------------------------------------------------------------------------------+
|                                                                                  |
|  [ Stage Progress (league) ]                                                     |
|  R1 ●─R2 ●─R3 ●─R4 ○─R5 ○─R6 ○                                                   |
|  (● = published standings)                                                       |
|                                                                                  |
+----------------------------------------------------------------------------------+
| Available Results (select exam to view details)                                  |
| 1) Screening Exam                     [Status: Completed]   [View] [Generate]    |
|    - Candidates sat: 10,230           Standings: Published (screening_1)         | 
|                                                                                  |
| 2) League - Round 1                   [Status: Concluded]  [View] [Generate]     |
|    - Standings: Published (league_1)       Avg: 62.4  | Absent: 200              |
|                                                                                  |
| 3) League - Round 2                   [Status: Concluded]  [View] [Generate]     |
|    - Standings: Published (league_2)       Avg: 64.1  | Absent: 190              |
|                                                                                  |
| 4) League - Round 3                   [Status: Completed]  [View] [Generate]     |
|    - Standings: Draft (not published)  [Publish]                                 |
|                                                                                  |
| 5) Final Exam                         [Status: Draft]      [Edit Exam]           |
+----------------------------------------------------------------------------------+
| League Leaderboard                                                               |
| - Based on published rounds only                                                 |
| - Actions: [View]                                                                |
| (Shows only Top 3 like it's currently implemented)                               |
|  Top 3:                                                                          |
|   1. Candidate A — 372.5   2. Candidate B — 369.0   3. Candidate C — 365.0       |
+----------------------------------------------------------------------------------+
```

---

## Design expectations

* Top section is **pure orientation**, no actions
* Stage Board is **read-only**, you can take inspiration from @src/components/General/Portal/DashboardParts/StageProgress.tsx
* Progress dots visually communicate:

  * completed
  * published vs unpublished
* “Available Results” is the **primary action area**
* Buttons must reflect state:

  * No publish button if nothing is generated (assume the backend informs you via an endpoint)
  * No generate button if exam is not completed
* Leaderboard is **summary only**, not the full table. Only show the top three like in the Leaderboards tab.

---

## What to deliver

1. A **clear UI breakdown** of this screen
2. Component-level structure (sections, cards, rows)
3. Interaction notes (what happens on click)
4. Assumptions you are making, stated explicitly

Do **not**:

* Talk about database models
* Redesign the flow
* Add automation
* Add candidate-facing features
* Add analytics dashboards

If something is unclear, state the assumption and move on.

Design it like it will be used during a live competition, by tired humans, who cannot afford surprises.

---
