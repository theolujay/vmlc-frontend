"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

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
    const hasStandings = data?.standings?.exists;
    const isPublished = data?.standings?.is_published;

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
            label: <div className='flex items-center gap-3 py-1'>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#3E4095]">
                    <AddIcon />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{status === 'draft' ? 'PUBLISH EXAM' : status?.toUpperCase()}</span>
            </div>,
            onClick: handleOpenUpload,
            disabled: status !== 'draft' && status !== undefined
        },
        {
            label: <div className='flex items-center gap-3 py-1'>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#3E4095]">
                    <AddIcon />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Add Question</span>
            </div>,
            onClick: addExamSessionModal,
            disabled: status !== 'draft' && status !== 'scheduled'
        },
        {
            label: <div className='flex items-center gap-3 py-1'>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#3E4095]">
                    <EditIcon />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">Edit Session</span>
            </div>,
            onClick: handleOpenEditModal,
            disabled: status !== 'draft' && status !== 'scheduled'
        },
        // Standings actions
        {
            label: <div className='flex items-center gap-3 py-1'>
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#3E4095]">
                    <SummaryIcon />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{hasStandings ? 'VIEW STANDINGS' : 'GENERATE STANDINGS'}</span>
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
            label: <div className='flex items-center gap-3 py-1'>
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                    <SummaryIcon />
                </div>
                <span className={clsx('text-[10px] font-black uppercase tracking-widest', isPublished ? 'text-gray-400' : 'text-green-600')}>
                    {isPublished ? 'PUBLISHED' : 'PUBLISH STANDINGS'}
                </span>
            </div>,
            onClick: () => publishStandings({ exam_id, publish_now: true }),
            disabled: isPublished || status !== 'concluded' || !hasStandings || isPublishingStandings
        },
        {
            label: <div className='flex items-center gap-3 py-1'>
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-[#D42620]">
                    <DeleteIcon />
                </div>
                <span className='text-[10px] font-black uppercase tracking-widest text-[#D42620]'>Delete Session</span>
            </div>,
            onClick: deleteExamSessionModal,
            disabled: status !== 'draft' && status !== 'scheduled'
        },
    ];

    return (
        <AppDropdownDialog 
            actionItems={actionItems} 
            triggerButton={
                <button key='actions-trigger' className="inline-flex items-center gap-2.5 bg-[#3E4095] text-white px-6 py-3 rounded-xl font-black text-[10px] tracking-widest hover:bg-[#2d2f6e] transition-all uppercase shadow-lg shadow-[#3E4095]/20 active:scale-95">
                    <span>ACTIONS</span>
                    <GotoIcon className="rotate-90 w-3 h-3 opacity-80" />
                </button>
            } 
        >
            <EditSessionModal data={data} exam_id={exam_id} open={openEditModal} close={setOpenEditModal} />
            <AddQuestionModal examId={exam_id} open={openAddQuestion} close={setAddQuestion} />
            <DeleteExamSessionModal session_id={exam_id} open={openDeleteModal} close={setOpenDeleteModal} />
            <UploadExamSessionModal data={data} title={data?.title} exam_id={exam_id} open={openUpload} close={setOpenUpload} />
        </AppDropdownDialog>
    )
}