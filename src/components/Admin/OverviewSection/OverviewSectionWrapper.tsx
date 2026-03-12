"use client";
import { useSearchParams } from "next/navigation";
import OverviewSection from "./OverviewSection";
import ViewDetails from "./ViewDetails";
import useGetAccountMgt from "@/hooks/useGetAccountMgt";
import Spinner from "@/components/ui/spinner/spinner";

export default function OverviewSectionWrapper() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view");
  const id = searchParams.get("id");
  const { data: accountMgt, isPending } = useGetAccountMgt();
  const isVolunteer = accountMgt?.role === 'volunteer';

  if (isPending) return <div className="grid w-full h-[60vh] place-content-center"><Spinner /></div>;

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
