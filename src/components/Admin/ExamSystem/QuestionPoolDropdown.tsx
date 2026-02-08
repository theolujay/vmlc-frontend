"use client";
import QuestionInformation from '@/components/Drawer/QuestionInformation';
import { DeleteIcon } from '@/components/General/GeneralIcon';
import { AddIcon, EyeIcon, GotoIcon } from '@/components/General/GettingStarted/GettingStartedAssets';
import RemoveQuestionModal from '@/components/Modals/RemoveQuestionModal';
import AppDropdownDialog from '@/components/ui/Dropdown/AppDropdownDialog';
import { SessionQuestionItemType } from '@/types/Examtype';
import { useMemo, useState } from 'react';
import useGetCurrentUser from '@/hooks/useGetCurrentUser';

type Props = Readonly<{ 
    question_id: number, 
    information: SessionQuestionItemType,
    onAddToExam?: () => void,
    onEdit?: () => void
}>

export default function QuestionPoolDropdown({ question_id, information, onAddToExam, onEdit }: Props) {
    const [openViewModal, setOpenViewModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const currentUser = useGetCurrentUser();
    const userRole = currentUser?.profile?.role || "";
    const isAdminOrAbove = ["admin", "manager", "superadmin"].includes(userRole);

    function handleDeleteModal() {
        setOpenDeleteModal(true)
    }

    function handleOpenViewModal() {
        setOpenViewModal(true)
    }

    const actionItems = useMemo(() => {
        const items = [];

        if (isAdminOrAbove) {
            items.push({
                label: (
                    <div className='flex items-center gap-3 py-1'>
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#3E4095]">
                            <AddIcon />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">Add to exam</span>
                    </div>
                ),
                onClick: onAddToExam
            });
        }

        if (isAdminOrAbove) {
            items.push({
                label: (
                    <div className='flex items-center gap-3 py-1'>
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#3E4095]">
                            <i className="fas fa-edit text-xs"></i>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">Edit Question</span>
                    </div>
                ),
                onClick: onEdit
            });
        }

        items.push({
            label: (
                <div className='flex items-center gap-3 py-1'>
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#3E4095]">
                        <EyeIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">View Details</span>
                </div>
            ),
            onClick: handleOpenViewModal
        });

        if (isAdminOrAbove) {
            items.push({
                label: (
                    <div className='flex items-center gap-3 py-1'>
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-[#D42620]">
                            <DeleteIcon />
                        </div>
                        <span className='text-[10px] font-black uppercase tracking-widest text-[#D42620]'>Delete Question</span>
                    </div>
                ),
                onClick: handleDeleteModal
            });
        }

        return items;
    }, [isAdminOrAbove, handleOpenViewModal, handleDeleteModal]);

    return (
        <AppDropdownDialog 
            actionItems={actionItems} 
            triggerButton={
                <button key='actions-trigger' className="inline-flex items-center gap-2 bg-[#3E4095] text-white px-2 py-2 rounded-xl font-black text-[9px] tracking-widest hover:bg-[#2d2f6e] transition-all uppercase shadow-md shadow-[#3E4095]/10 active:scale-95">
                    <span>ACTIONS</span>
                    <GotoIcon className="rotate-90 w-2.5 h-2.5 opacity-80" />
                </button>
            } 
        >
            <QuestionInformation information={information} open={openViewModal} setOpen={setOpenViewModal} />
            <RemoveQuestionModal question_id={question_id} open={openDeleteModal} close={setOpenDeleteModal} />
        </AppDropdownDialog>
    )
}