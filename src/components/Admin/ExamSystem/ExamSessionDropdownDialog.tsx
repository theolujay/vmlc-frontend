"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

import { DeleteIcon } from '@/components/General/GeneralIcon';
import { AddIcon, EditIcon, GotoIcon } from '@/components/General/GettingStarted/GettingStartedAssets';
import DeleteExamSessionModal from '@/components/Modals/DeleteExamSessionModal';
import EditSessionModal from '@/components/Modals/EditSession';
import UploadExamSessionModal from '@/components/Modals/UploadExamSessionModal';
import AppDropdownDialog from '@/components/ui/Dropdown/AppDropdownDialog';
import usePublishStandings from '@/hooks/usePublishStandings';
import { UpdatedSessionQuestionType } from '@/types/Examtype';
import { SummaryIcon } from '../AdminIcons';

const AddQuestionModal = dynamic(() => import('@/components/Modals/AddQuestionModal'), {
  ssr: false,
});



type Props = Readonly<{ exam_id: string, data?: UpdatedSessionQuestionType }>

export default function ExamSessionDropdownDialog({ exam_id, data }: Props) {
    const router = useRouter();
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openAddQuestion,setAddQuestion]=useState(false)
    const [openUpload, setOpenUpload] = useState(false);
    
    const { publishStandings, isPending: isPublishingStandings } = usePublishStandings();

    const status = data?.status;
    const hasStandings = data?.has_standings;
    const isPublished = data?.is_standings_published;

    function deleteExamSessionModal() {
        setOpenDeleteModal(true)
    }


     function addExamSessionModal() {
        setAddQuestion(true)
    }

    function handleOpenEditModal() {
        setOpenEditModal(true)
    }

    function handleOpenUpload() {
        setOpenUpload(true);
    }

    const actionItems = [
        // Publish Exam action (only if draft)
        {
            label: <div className='flex items-center gap-2'>
                <AddIcon />
                <span>{status === 'draft' ? 'PUBLISH EXAM' : status?.toUpperCase()}</span>
            </div>,
            onClick: handleOpenUpload,
            disabled: status !== 'draft' && status !== undefined
        },
        {
            label: <div className='flex items-center gap-2'>
                <AddIcon />
                <span>Add Question</span>
            </div>,
            onClick: addExamSessionModal
        },
        {
            label: <div className='flex items-center gap-2'>
                <EditIcon />
                <span>Edit Session</span>
            </div>,
            onClick: handleOpenEditModal
        },
        // Standings actions
        {
            label: <div className='flex items-center gap-2'>
                <SummaryIcon />
                <span>{hasStandings ? 'VIEW STANDINGS' : 'GENERATE STANDINGS'}</span>
            </div>,
            onClick: () => {
                if (hasStandings) {
                    router.push(`/admin/competition?view=standings&id=${exam_id}`);
                } else {
                    publishStandings({ exam_id, publish_now: false });
                }
            },
            disabled: !hasStandings && (status !== 'concluded' || isPublishingStandings)
        },
        {
            label: <div className='flex items-center gap-2'>
                <SummaryIcon />
                <span className={isPublished ? 'text-gray-400' : 'text-green-600'}>
                    {isPublished ? 'PUBLISHED' : 'PUBLISH STANDINGS'}
                </span>
            </div>,
            onClick: () => publishStandings({ exam_id, publish_now: true }),
            disabled: isPublished || status !== 'concluded' || !hasStandings || isPublishingStandings
        },
        {
            label: <div className='flex items-center gap-2'>
                <DeleteIcon />
                <span className='text-[#D42620]'>Delete Session</span>
            </div>,
            onClick: deleteExamSessionModal
        },
    ];

    return (
        <AppDropdownDialog 
            actionItems={actionItems} 
            triggerButton={
                <button key='actions-trigger' className="inline-flex items-center gap-2 bg-[#3E4095] text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-[#2d2f6e] transition-colors">
                    <span>ACTIONS</span>
                    <GotoIcon className="rotate-90 w-3 h-3" />
                </button>
            } 
        >
            <EditSessionModal exam_id={exam_id} open={openEditModal} close={setOpenEditModal} />
            <AddQuestionModal open={openAddQuestion} close={setAddQuestion} />
            <DeleteExamSessionModal session_id={exam_id} open={openDeleteModal} close={setOpenDeleteModal} />
            <UploadExamSessionModal exam_id={exam_id} open={openUpload} close={setOpenUpload} />
        </AppDropdownDialog>
    )
}