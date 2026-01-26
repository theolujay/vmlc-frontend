# Overview Section API Specification

This document details the API endpoints and data structures expected by the `OverviewSection` and its sub-components in the Admin Dashboard.

## 1. Statistics Overview
Fetches summary statistics for candidates, staff, and exams.

- **Endpoint:** `/statistics/overview/` (Based on `UserMgtUrls.STATISTICS_OVERVIEW`)
- **Method:** `GET`
- **Hook:** `useGetStatOverview`

### Response Structure (`StatOverviewType`)
```json
{
  "candidates": {
    "registered": 1250,
    "active": 850,
    "inactive": 300,
    "pre_registered": 2100,
    "deactivated": 10,
    "registered_change": "+12%",
    "active_change": "+5%",
    "pre_registered_change": "+18%"
  },
  "staff": {
    "registered": 45,
    "active": 40,
    "inactive": 5,
    "pre_registered": 0,
    "deactivated": 0
  },
  "exams": {
    "upcoming": 5,
    "active": 2,
    "completed": 10,
    "active_change": "+1"
  }
}
```

---

## 2. Registered Candidates List
Fetches a paginated list of fully registered candidates.

- **Endpoint:** `/users/` (Filtered by `profile=candidate`)
- **Method:** `GET`
- **Hook:** `useListUserMgt`
- **Query Parameters:**
  - `page`: number (default: 1)
  - `search`: string (optional)
  - `profile`: string (hardcoded to `candidate` in this context)

### Response Structure (`UserMgtType`)
```json
{
  "pagination": {
    "total_pages": 15,
    "current_page": 1,
    "page_size": 10,
    "total_items": 145
  },
  "results": [
    {
      "user": {
        "id": "uuid",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "08012345678",
        "state": "Lagos",
        "date_joined": "2023-10-27T10:00:00Z"
      },
      "school_name": "Example High School",
      "current_class": "SS3",
      "role": "candidate",
      "status": "active",
      "is_user_verified": true
    }
  ]
}
```

---

## 3. Pre-Registered Candidates List
Fetches a paginated list of users who have expressed interest but haven't completed full registration.

- **Endpoint:** `/users/` (Filtered by `profile=pre_reg_candidate`)
- **Method:** `GET`
- **Hook:** `useListPreRegisteredCandidates`
- **Query Parameters:**
  - `page`: number (default: 1)
  - `search`: string (optional)
  - `profile`: `pre_reg_candidate` (Hardcoded in service)

### Response Structure (`PreRegisteredCandidateType`)
```json
{
  "pagination": {
    "total_pages": 5,
    "current_page": 1,
    "page_size": 10,
    "total_items": 48
  },
  "results": [
    {
      "full_name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "08123456789",
      "created_at": "2023-10-26T14:30:00Z"
    }
  ]
}
```

---

## 4. Registration Trends
Fetches registration data over a specific period for charting.

- **Endpoint:** `/statistics/registration-trends/?days={days}`
- **Method:** `GET`
- **Hook:** `useGetRegistrationTrends`
- **Query Parameters:**
  - `days`: number (usually 7 or 30)

### Response Structure (`RegistrationTrendType`)
```json
{
  "daily": {
    "candidates": [
      { "day": "2023-10-21T00:00:00Z", "count": 12 },
      { "day": "2023-10-22T00:00:00Z", "count": 15 }
    ],
    "total_users": [...],
    "staff": [...],
    "pre_registrations": [...]
  },
  "weekly": {
    "candidates": [...],
    "total_users": [...],
    "staff": [...],
    "pre_registrations": [...]
  },
  "funnel": {
    "pre_registrations": 1000,
    "completed_registrations": 800,
    "conversion_percentage": 80
  }
}
```

---

## 5. Support Conversations
Endpoints for managing support inquiries and communication between users and staff.

### 5.1 List Support Conversations
Fetches a paginated list of ongoing support inquiries for the staff dashboard.

- **Endpoint:** `/support/conversations/` (Based on `SupportUrls.getConversations`)
- **Method:** `GET`
- **Hook:** `useListConversations`
- **Query Parameters:**
  - `page`: number (optional)
  - `search`: string (optional)

#### Response Structure (`SupportConversationListResponse`)
```json
{
  "count": 100,
  "next": "url",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "avatar": "url (optional)"
      },
      "last_message": {
        "content": "I need help with...",
        "timestamp": "2024-03-20T10:00:00Z",
        "is_read": false
      },
      "unread_count": 2
    }
  ]
}
```

### 5.2 Get Conversation Messages
Fetches the full message history for a specific conversation.

- **Endpoint:** `/support/conversations/{id}/messages/` (Based on `SupportUrls.getMessages`)
- **Method:** `GET`
- **Hook:** `useGetSupportMessages`

#### Response Structure (`SupportMessageType[]`)
```json
[
  {
    "id": "uuid",
    "conversation": "uuid",
    "sender": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "url (optional)"
    },
    "content": "Hello, I have a question.",
    "timestamp": "2024-03-20T10:00:00Z",
    "is_read": true,
    "is_staff": false
  }
]
```

### 5.3 Send Support Message
Sends a reply to an existing support conversation.

- **Endpoint:** `/support/conversations/{id}/messages/` (Based on `SupportUrls.sendMessage`)
- **Method:** `POST`
- **Hook:** `useSendSupportMessage`
- **Payload:**
```json
{
  "content": "Sure, how can I help you today?"
}
```

### 5.4 Account Management
Endpoints for managing the authenticated user's profile and viewing other accounts.

#### 5.4.1 Get Own Account Details
Fetches the profile and user data for the currently authenticated session.

- **Endpoint:** `/account-management/` (Based on `UserMgtUrls.ACCOUNT_MGT`)
- **Method:** `GET`
- **Hook:** `useGetOwnAccountDetails` (Note: Can also be derived from `authState` in `AuthProvider`)

#### 5.4.2 Update Own Profile
Updates profile information for the authenticated user. Supports `multipart/form-data` for profile picture uploads.

- **Endpoint:** `/account-management/`
- **Method:** `PATCH`
- **Hook:** `useUpdateProfile`
- **Payload (`FormData`):**
  - `user[first_name]`: string
  - `user[last_name]`: string
  - `user[phone]`: string
  - `user[state]`: string
  - `user[profile_picture]`: File (optional)
  - `profile[school_name]`: string (Candidates only)
  - `profile[school_type]`: string (Candidates only)
  - `profile[current_class]`: string (Candidates only)
  - `profile[occupation]`: string (Staff only)

#### 5.4.3 Get Specific Account Details
Fetches details for a specific user (used by staff to view candidate profiles).

- **Endpoint:** `/account-management/{user_id}/`
- **Method:** `GET`
- **Hook:** `useGetAccountDetails`

---

## Data Models Summary

### RequestUserType
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string (UUID) | Unique identifier |
| `first_name` | string | User's first name |
| `last_name` | string | User's last name |
| `email` | string | Email address |
| `phone` | string | Phone number |
| `state` | string | State of residence |
| `date_joined` | string (ISO Date) | Timestamp of registration |

### ActivityHistoryUserType
Extends the user data with profile-specific fields for the "Registered Candidates" table.
- `user`: `RequestUserType`
- `school_name`: string | null
- `current_class`: string | null
- `status`: string
- `is_user_verified`: boolean

--- 

# Candidate Portal API Specification

This section details the API endpoints and data structures used by the candidate's exam portal.

## 1. Candidate Dashboard
Fetches a comprehensive overview of the candidate's status, available exams, and performance history.

- **Endpoint:** `/dashboard/candidate/` (Based on `candidateUrls.candidate_exams_dashboard`)
- **Method:** `GET`
- **Hook:** `useGetExamPortal`

### Response Structure (`DashboardType`)
```json
<!-- 
NOTES FOR BACKEND:
The structure below is optimized for the ExamPortal.tsx component.
1. `candidate_info` now has `first_name` and `last_name` to match component usage.
2. A new `stage_progress` object provides an authoritative source for the candidate's current state,
   which simplifies frontend logic significantly.
3. `exam_stats` has been removed as it was unused by the component.
4. `available_exams` (array) has been replaced by `next_exam` (object | null) to be more explicit
   about the primary action for the candidate.
-->{  "candidate_info": {    "first_name": "John",    "last_name": "Doe"  },  "exam_stats": {    "total_exams_taken": 5,    "available_exams_count": 1,    "average_score": 82.45,
    "highest_score": 95.0,
    "lowest_score": 68.0,
    "latest_score": 88.0,
    "latest_score_info": {
      "score": 88.0,
      "exam_title": "League Mathematics 1",
      "date": "2026-01-20T14:30:00Z"
    }
  },
  "stage_progress": {
    "current_stage": "league",
    "current_level": 2,
    "has_taken_exam": false,
    "qualification_threshold_score": 70
  },
  "screening_standings_ranking": {
      "current_rank": 5,
      "position": 5,
      "total_candidates": 200
  },
  "league_leaderboard_ranking": {
    "current_rank": 12,
    "position": 12,
    "total_candidates": 150
  },
  "recent_scores": [
    {
      "exam": "League Mathematics 1",
      "exam_title": "League Mathematics 1",
      "score": 88.0,
      "date": "2026-01-20T14:30:00Z",
      "exam_stage": "league"
    },
    {
      "exam": "League Science 1",
      "exam_title": "League Science 1",
      "score": 75.0,
      "date": "2026-01-15T10:00:00Z",
      "exam_stage": "league"
    }
  ],
  "available_exams": [
    {
      "id": "e4b3c2a1-1234-5678-90ab-cdef12345678",
      "title": "League Physics 2",
      "stage": "league",
      "level": 2,
      "stage_display": "league_2",
      "description": "Mid-term physics assessment.",
      "open_duration_hours": 24,
      "scheduled_date": "2026-01-27T09:00:00Z",
      "countdown_minutes": 60,
      "question_count": 40,
      "participation": "not_done"
    }
  ],
  "concluded_exams": [
    {
      "id": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
      "title": "League English 1",
      "stage": "league",
      "level": 1,
      "stage_display": "league_1",
      "description": "Foundational English exam.",
      "concluded_at": "2026-01-10T18:00:00Z",
      "question_count": 50,
      "participation": "done"
    }
  ],
  "next_exam": {
    "id": "e4b3c2a1-1234-5678-90ab-cdef12345678",
    "title": "League Physics 2",
    "stage": "league",
    "level": 2,
    "stage_display": "league_2",
    "description": "Mid-term physics assessment.",
    "open_duration_hours": 24,
    "scheduled_date": "2026-01-27T09:00:00Z",
    "countdown_minutes": 60,
    "question_count": 40,
    "participation": "not_done"
  }
}
```

---

## 2. Exam Management

### 2.1 Take Exam (Fetch Questions)
Fetches questions and metadata for a specific exam when a candidate starts it.

- **Endpoint:** `/exams/{exam_id}/take-exam/`
- **Method:** `GET`
- **Hook:** `useCandidateTakeExam`

#### Response Structure
```json
{
  "id": "uuid",
  "title": "League Week 2",
  "countdown_minutes": 60,
  "questions": [
    {
      "id": 101,
      "text": "What is 2 + 2?",
      "option_a": "3",
      "option_b": "4",
      "option_c": "5",
      "option_d": "6"
    }
  ]
}
```

### 2.2 Submit Exam Answers
Submits the candidate's answers for grading.

- **Endpoint:** `/exams/{exam_id}/submit-exam-answers/`
- **Method:** `POST`
- **Hook:** `useSubmitAnswers` (Usually used within the exam component)
- **Payload (`CandidateSubmitAnswerType`):**
```json
{
  "answers": [
    {
      "question_id": 101,
      "selected_option": "option_b"
    }
  ]
}
```

---

## 3. Leaderboard

### 3.1 List Leaderboards/Rankings
Fetches the available leaderboards or the ranking for a specific exam.

- **Endpoint:** `/leaderboard/`
- **Method:** `GET`
- **Hook:** `useGetLeaderBoard`
- **Query Parameters:**
  - `page`: number
  - `stage`: string (optional)
  - `level`: number (optional)

#### Response Structure (If listing available leaderboards)
```json
{
  "snapshot_id": 1,
  "published_at": "2023-11-10T10:00:00Z",
  "available_leaderboards": [
    {
      "stage": "screening",
      "level": 1,
      "stage_display": "Screening Phase",
      "exam_title": "General Screening",
      "total_candidates": 2000,
      "average_score": 65.4
    }
  ]
}
```

#### Response Structure (If fetching specific rankings - `RankedLeaderBoardType`)
```json
{
  "exam_details": {
    "id": "uuid",
    "title": "League Week 1",
    "stage": "league",
    "level": 1,
    "total_candidates": 150,
    "average_score": 70.2
  },
  "top_three": [
    { "rank": 1, "candidate": { "full_name": "Alice", ... }, "score": 98, "percentage": 98 }
  ],
  "remaining_candidates": [...],
  "pagination": { ... }
}
```

### 3.2 Candidate Leaderboard Detail
Fetches detailed performance of a specific candidate in a specific exam stage/level.

- **Endpoint:** `/leaderboard/{stage}/{level}/candidate/{candidate_id}/`
- **Method:** `GET`
- **Hook:** `useGetLeaderBoardCandidateDetail`

#### Response Structure (`ViewCandidateDetailType`)
```json
{
  "exam_details": { ... },
  "candidate_performance": {
    "rank": 5,
    "score": 85,
    "percentage": 85,
    "participated_at": "2023-11-05T14:30:00Z",
    "candidate": {
      "id": "uuid",
      "full_name": "John Doe",
      "submissions": [
        {
          "question_text": "What is 2+2?",
          "selected_option": "option_b",
          "correct_answer": "option_b",
          "is_correct": true
        }
      ]
    }
  }
}
```

---

## 4. Notifications with WebSockets
Real-time notifications for both Admin and Candidates.

- **Endpoint:** `ws://<host>/v1/ws/notifications/` (wss:// for production)
- **Method:** `WebSocket`
- **Service:** `NotificationService`
- **Context:** `NotificationProvider`

### Connection
To connect, append authentication details as query parameters:
`ws://<host>/v1/ws/notifications/?api_key=<your_api_key>&token=<access_token>`

- `api_key`: Your API key.
- `token`: Valid JWT access token.

### Server-to-Client Messages
When a notification is received, the server sends a JSON object.

#### Notification Activity
```json
{
  "type": "notification_activity",
  "message": {
    "id": 123,
    "subject": "New Exam Available",
    "message": "The final stage exam is now open. Good luck!",
    "read": false,
    "created_at": "2025-09-21T12:00:00.123456Z"
  }
}
```

#### Error Message
```json
{
  "type": "error",
  "message": "Error description string"
}
```

### Client-to-Server Messages
Clients can send actions to the server.

#### Mark as Read
Marks a specific notification as read.

```json
{
  "action": "mark_as_read",
  "data": {
    "notification_id": 123
  }
}
```