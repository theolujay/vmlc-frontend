"use client";
import { useSearchParams } from "next/navigation";
import OverviewSection from "./OverviewSection";
import ViewDetails from "./ViewDetails";
import { useAuth } from "@/contexts/AuthProvider";

export default function OverviewSectionWrapper() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view");
  const id = searchParams.get("id");
  const { authState } = useAuth();
  const isVolunteer = authState?.user?.role === 'volunteer';

  return renderComponent(currentView, id, isVolunteer);
}

function renderComponent(view: string | null, id: string | null, isVolunteer: boolean) {
  if (isVolunteer && view === "view-details") {
    return <OverviewSection />;
  }

  switch (view) {
    case "view-details":
      return <ViewDetails id={id!} />; 
    default:
      return <OverviewSection />;
  }
}
