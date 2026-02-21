# API Schema: Stats Overview

Endpoint: `GET /stats/overview/`

## Description
Retrieves overall statistics for candidates, staff, exams, active competitions, helpdesk threads, registration funnels, and geographic distribution. This endpoint is restricted to users with `moderator` roles or higher (Active Volunteers).

## Authentication
Requires a valid JWT token.
Permission: `ActiveVolunteerPermissions`

## Response Schema

The response is a JSON object with the following structure:

```json
{
  "candidates": {
    "registered": "number",
    "active": "number",
    "inactive": "number",
    "has_logged_in": "number",
    "pre_registered": "number",
    "deactivated": "number",
    "both_entities": "number"
  },
  "staff": {
    "registered": "number",
    "active": "number",
    "inactive": "number",
    "has_logged_in": "number",
    "pre_registered": "number",
    "deactivated": "number",
    "both_entities": "number"
  },
  "exams": {
    "total": "number",
    "active": "number",
    "ongoing": "number",
    "upcoming": "number",
    "concluded": "number",
    "drafts": "number"
  },
  "competition": {
    "active_competition": "string",
    "active_competition_id": "uuid",
    "stages": [
      {
        "id": "uuid",
        "name": "string",
        "type": "string",
        "rounds": ["number"]
      }
    ]
  },
  "helpdesk": {
    "total_threads": "number",
    "open_threads": "number",
    "in_progress_threads": "number",
    "resolved_threads": "number",
    "unassigned_threads": "number",
    "unread_messages": "number",
    "public_requests": "number"
  },
  "funnel": {
    "overall": {
      "pre_registrations": "number",
      "completed_registrations": "number",
      "conversion_percentage": "float"
    },
    "candidate": {
      "pre_registrations": "number",
      "completed_registrations": "number",
      "conversion_percentage": "float"
    },
    "volunteer": {
      "pre_registrations": "number",
      "completed_registrations": "number",
      "conversion_percentage": "float"
    }
  },
  "geographics": {
    "overall": [
      {
        "state": "string",
        "count": "number"
      }
    ],
    "candidate": [
      {
        "state": "string",
        "count": "number"
      }
    ],
    "volunteer": [
      {
        "state": "string",
        "count": "number"
      }
    ]
  }
}
```

### Detailed Field Descriptions

#### `candidates` & `staff`
- `registered`: Total number of fully registered users.
- `active`: Users who logged in within the last 7 days. For candidates, they must also have participated in the last concluded exam.
- `inactive`: Registered users who are neither active nor deactivated.
- `has_logged_in`: Number of users who have logged in at least once.
- `pre_registered`: Users in the `PreRegUser` model who haven't completed registration.
- `deactivated`: Users with `is_active=False`.
- `both_entities`: Users who exist in both the `PreRegUser` model and as fully registered users.

#### `exams`
- `total`: Total number of exams in the system.
- `active`: Exams where `is_active=True`.
- `ongoing`: Active exams currently within their scheduled time and duration.
- `upcoming`: Active exams scheduled for the future.
- `concluded`: Active exams whose duration has passed.
- `drafts`: Exams with no `scheduled_date`.

#### `competition`
- `active_competition`: Name of the currently active competition.
- `active_competition_id`: ID of the active competition.
- `stages`: List of stages within the competition.
    - `id`: Unique identifier for the stage.
    - `name`: Display name of the stage (prefix removed).
    - `type`: Type of stage (e.g., `LEAGUE`, `KNOCKOUT`).
    - `rounds`: (Only for `LEAGUE` type) List of active round numbers.

#### `helpdesk`
- `total_threads`: Total number of helpdesk threads.
- `open_threads`: Threads with `OPEN` status.
- `in_progress_threads`: Threads with `IN_PROGRESS` status.
- `resolved_threads`: Threads with `RESOLVED` status.
- `unassigned_threads`: Threads without an assigned staff member.
- `unread_messages`: Count of unread messages from candidates.
- `public_requests`: Total number of public support requests.

#### `funnel`
Registration conversion metrics derived from event logs.
- `pre_registrations`: Number of pre-registration events.
- `completed_registrations`: Number of successful conversion events.
- `conversion_percentage`: Percentage of pre-registrations that became full registrations.

#### `geographics`
Breakdown of user counts by state for `overall`, `candidate`, and `volunteer` categories.
