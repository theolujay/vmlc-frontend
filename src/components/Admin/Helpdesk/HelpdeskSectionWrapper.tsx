"use client";
import { useSearchParams } from "next/navigation";
import HelpdeskSection from "./HelpdeskSection";
import HelpdeskThreadDetails from "./HelpdeskThreadDetails";

export default function HelpdeskSectionWrapper() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view");
  const id = searchParams.get("id");

  if (currentView === "conversation-details" && id) {
    return <HelpdeskThreadDetails id={id} />;
  }

  return <HelpdeskSection />;
}
