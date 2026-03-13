# Proposal: Automated Violation Logging API

To ensure accountability and provide proctors with actionable data, we propose implementing a background "Ping" service that logs suspicious activity to the server in real-time.

## 📡 API Specification

### Endpoint: `POST /api/exams/{exam_id}/violations/`

#### Payload Structure:
```json
{
  "violation_type": "TAB_SWITCH" | "SCREENSHOT" | "FULLSCREEN_EXIT" | "MULTI_FACE" | "NO_FACE" | "ATTENTION_LAPSE",
  "severity": "LOW" | "MEDIUM" | "HIGH",
  "timestamp": "ISO-8601 String",
  "metadata": {
    "duration_seconds": 15,
    "question_id": 102,
    "current_question_index": 5,
    "additional_info": "Detected 3 distinct faces in frame"
  }
}
```

#### Violation Type Definitions:
- **`TAB_SWITCH`**: Candidate blurred the window or switched tabs.
- **`SCREENSHOT`**: Rapid focus/blur sequence detected (likely screen capture).
- **`FULLSCREEN_EXIT`**: Candidate manually exited the mandatory fullscreen mode.
- **`MULTI_FACE`**: AI detected more than one person in the camera frame.
- **`NO_FACE`**: Candidate left the camera's field of view.
- **`ATTENTION_LAPSE`**: Candidate looked away from the screen for a prolonged period.

## 🛠️ Proposed Client Implementation

1. **Throttling**: To avoid flooding the server, high-frequency violations (like "No Face") should be bundled or throttled (e.g., log once every 30 seconds of continuous absence).
2. **Silent Failure**: The logging service should use `navigator.sendBeacon` or a background fetch to ensure the user experience is never interrupted by network errors.
3. **Suspicion Scoring**: The backend should aggregate these logs into a "Suspicion Score" (0-100) shown on the admin dashboard for each candidate.

## 📊 Admin Dashboard Benefits
- **Heatmaps**: Admins can see *when* most violations occur (e.g., at the end of the exam).
- **Auto-Flagging**: Candidates with a Suspicion Score above 80 can be automatically flagged for manual review or immediate disqualification.
- **Evidence Trail**: Provides a timestamped list of events to justify any disciplinary action taken against a candidate.
