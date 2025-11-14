import React from 'react'
import ViewCandidateDetails from './ViewCandidateDetails';
import LeaderBoardSection from './LeaderBoardSection';
import { useSearchParams } from 'next/navigation';

export default function LeaderBoardWrapper() {
    const searchParams = useSearchParams();
    const currentView = searchParams.get('view');
    const id = searchParams.get("id");
    const level = searchParams.get('level')
    const stage = searchParams.get("stage")
    return renderComponent(currentView, stage, level, id)
}



function renderComponent(view: string | null, stage: string | null, level: string | null, id: string | null) {

    switch (view) {
        case 'view-candidate':
            return <ViewCandidateDetails candidate_id={id!} stage={stage!} level={level!} />;
        default:
            return <LeaderBoardSection />;

    }
}