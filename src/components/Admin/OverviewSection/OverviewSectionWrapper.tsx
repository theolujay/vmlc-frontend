"use client";
import { useSearchParams } from "next/navigation";
import OverviewSection from "./OverviewSection";
import ViewDetails from "./ViewDetails";

export default function OverviewSectionWrapper() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view");
  const id = searchParams.get("id");

  return renderComponent(currentView, id);
}

function renderComponent(view: string | null, id: string | null) {
  switch (view) {
    case "view-details":
      return <ViewDetails id={id!} />; 
    default:
      return <OverviewSection />;
  }
}
