# Competition Tab Design Document

## 1. UI Breakdown

The Competition Tab is designed to provide a high-level operational view for staff during the competition. It follows a "Read -> Check -> Act" flow, divided into four vertical zones:

*   **Zone A: Global Header & Orientation (Top)**
    *   **Purpose:** Immediate context setting.
    *   **Elements:** Screen Title, Global Status Badge (e.g., "League · Round 3 of 6"), and a Metrics Bar (Enrolled, Active, Eliminated, Awaiting).
    *   **Style:** Clean, high-contrast header with a distinct metrics strip.

*   **Zone B: Stage Visualization (Read-Only)**
    *   **Purpose:** Visual confirmation of the competition timeline.
    *   **Elements:** 
        *   **Macro Stages:** (Screening -> League -> Final) pills.
        *   **Micro Progress:** A linear connection of dots (R1...R6) for the active stage.
    *   **Style:** Reuses the `StageProgress` visual language but adapted for a denser, read-only admin view.

*   **Zone C: Available Results (Primary Actions)**
    *   **Purpose:** The main workspace for managing specific exam instances.
    *   **Elements:** List of exam cards/rows.
    *   **Row Content:** Title, Status Badge, Stats (Candidates, Avg Score), and Action Buttons.
    *   **Actions:** 
        *   `Generate`: For completed exams needing result processing.
        *   `Publish`: For concluded exams with draft ranking.
        *   `View`: For any processed exam.
        *   `Edit Exam`: For draft exams.

*   **Zone D: Leaderboard Summary (Bottom)**
    *   **Purpose:** Quick sanity check for the "League" ranking.
    *   **Elements:** Top 3 Candidates list (Rank, Name, Score) and a "View Full Leaderboard" link.

## 2. Component Structure

The implementation is housed in `src/components/Admin/Competition/`:

*   **`CompetitionDashboard.tsx`**: Main container. Manages state (mocked for now) and assembles the zones.
*   **`CompetitionHeader.tsx`**: Renders Zone A (Title + Metrics).
*   **`StageBoard.tsx`**: Renders Zone B (Macro & Micro stage logic).
*   **`ExamStatus.tsx`**: Renders Zone C (List container).
    *   **`ExamResultRow.tsx`**: Individual exam row with conditional action logic.
*   **`LeaderboardSummary.tsx`**: Renders Zone D (Top 3 summary).

## 3. Interaction Notes

*   **Navigation:**
    *   Clicking `[View]` on an exam navigates to `/admin/exams/[id]`.
    *   Clicking `[Edit Exam]` navigates to `/admin/exams/[id]/edit`.
    *   Clicking `[View Full Board]` navigates to `/admin/leaderboard`.

*   **Actions:**
    *   **Generate Results:** Clicking `[Generate]` triggers a backend calculation (simulated). The UI updates from "Completed" to "Concluded".
    *   **Publish Ranking:** Clicking `[Publish]` triggers a confirmation prompt ("Are you sure... visible to candidates"). On confirmation, the status updates to "Published".

## 4. Assumptions

*   **Data Model:** The backend provides a "Dashboard" endpoint returning the global status string, stats object, and a list of exams with a specific `ranking_status` field.
*   **Roles:** All staff roles (Admin, Manager, Moderator) have access to this view, though specific actions (like Publish) might be restricted in the future (currently enabled for all in UI).
*   **State:** Publishing is treated as an atomic action for the UI prototype.