import { AvailableExamType } from "@/types/Examtype";

export const DUMMY_CANDIDATE_NAME = "Ezekiel Oluwadamilare";

export const DUMMY_LEADERBOARD_RANKING = {
  position: 25,
  total_candidates: 340
};

export const DUMMY_AVAILABLE_EXAM: AvailableExamType = {
  id: "dummy-exam-1",
  title: "League Week 3",
  description: "The exam window opens soon. Ensure you are in a quiet environment.",
  open_duration_hours: 24,
  countdown_minutes: 60,
  question_count: 20,
  level: 3,
  scheduled_date: new Date(Date.now() + 300), // Tomorrow
  stage: "League",
  stage_display: "League Week 3",
  participation: "not_done"
};

export const DUMMY_RECENT_SCORES = [
  {
    exam: "Screening Exam",
    score: 85,
    date: new Date("2025-09-21"),
    exam_stage: "Screening"
  },
  {
    exam: "League Week 1",
    score: 78,
    date: new Date("2025-09-28"),
    exam_stage: "League"
  },
  {
    exam: "League Week 2",
    score: 82,
    date: new Date("2025-10-05"),
    exam_stage: "League"
  }
];
