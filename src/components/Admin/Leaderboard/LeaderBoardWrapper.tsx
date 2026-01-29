import React from 'react'
import ViewCandidateDetails from './ViewCandidateDetails';
import LeaderBoardSection from './LeaderBoardSection';
import { useSearchParams } from 'next/navigation';

export default function LeaderBoardWrapper() {
    const searchParams = useSearchParams();
    const currentView = searchParams.get('view');
    const id = searchParams.get("id");
    const round = searchParams.get('round')
    const stage = searchParams.get("stage")
    return renderComponent(currentView, stage, round, id)
}



function renderComponent(view: string | null, stage: string | null, round: string | null, id: string | null) {

    switch (view) {
        case 'view-candidate':
            return <ViewCandidateDetails candidate_id={id!} stage={stage!} round={round!} />;
        default:
            return <LeaderBoardSection />;

    }
}