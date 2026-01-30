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
