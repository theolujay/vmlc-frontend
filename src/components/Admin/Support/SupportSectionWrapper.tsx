"use client";
import { useSearchParams } from "next/navigation";
import SupportSection from "./SupportSection";

export default function SupportSectionWrapper() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view");
  const id = searchParams.get("id");

  return renderComponent(currentView, id);
}

function renderComponent(view: string | null, id: string | null) {
  switch (view) {
    // case "conversation-details":
      // return <ConversationDetails id={id!} />; // To be implemented
    default:
      return <SupportSection />;
  }
}
