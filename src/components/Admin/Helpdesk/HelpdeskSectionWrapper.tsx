"use client";
import { useSearchParams } from "next/navigation";
import HelpdeskSection from "./HelpdeskSection";
import HelpdeskThreadDetails from "./HelpdeskThreadDetails";

export default function HelpdeskSectionWrapper() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view");
  const id = searchParams.get("id");

  return renderComponent(currentView, id);
}

function renderComponent(view: string | null, id: string | null) {
  switch (view) {
    case "conversation-details":
      return <HelpdeskThreadDetails id={id!} />;
    default:
      return <HelpdeskSection />;
  }
}
