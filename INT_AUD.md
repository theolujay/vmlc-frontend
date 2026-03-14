# Implementation Plan: Integrity Audit Dashboard

This document outlines the technical implementation of the deep-dive proctoring audit system in the admin leaderboard.

## 1. Data Requirements & API Integration

### Service Updates (`ExamPortal.service.ts`)
- `getIntegrityAudit(examId, candidateId)`: Fetches the chronological timeline from `GET /v2/exams/{exam_id}/candidates/{candidate_id}/integrity-audit/`.
- `updateProctoringStatus(examId, candidateId, status)`: Allows admins to override the status (e.g., `clear`, `flagged`).

### Hooks
- `useGetIntegrityAudit`: React Query hook for the timeline.
- `useUpdateProctoringStatus`: Mutation hook for status overrides.

## 2. UI Components in `ViewCandidateDetails.tsx`

### A. Integrity Summary Header
- Displays the `proctoring_status` badge.
- Shows "Integrity Score" (0-1.0) and "Heartbeat Integrity" (received vs. expected).
- "Audit Deep-Dive" toggle button.

### B. The Chronological Timeline (Toggled)
- **Heartbeat Nodes**: Shows a thumbnail of the `face_capture`, the `suspicion_score` (via a color-coded bar), and the timestamp.
- **Violation Events**: Nested under heartbeats. If a `question_id` is present, overlay the question text from the candidate's submission data.
- **Telemetry Gaps**: Highlighted warning blocks for missing heartbeat sequences.

### C. Time-Lapse Reviewer
- Expanding a heartbeat image opens a "Review Mode" where admins can navigate through the 5-minute snapshots using arrow keys.

### D. Audit Resolution Actions
- Floating or footer actions to:
    - **Mark as Clear**: Resets status if suspicion was a false positive.
    - **Confirm Violation (Flag)**: Escalates status to `flagged` for disqualification.

## 3. Contextual Question Overlay
By matching the `question_id` in violation metadata with the `submissions` array already available in `ViewCandidateDetails`, the admin will see exactly what the candidate was looking at when they switched tabs or were flagged by the AI.

---
**Status:** Implementation Pending
**References:** @PROCTORING.md, @INTEGRITY_AUDIT.md
