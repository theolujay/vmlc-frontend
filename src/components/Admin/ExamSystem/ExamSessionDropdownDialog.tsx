import { DeleteIcon } from '@/components/General/GeneralIcon';
import { AddIcon, EditIcon } from '@/components/General/GettingStarted/GettingStartedAssets';
import AddQuestionModal from '@/components/Modals/AddQuestionModal';
import DeleteExamSessionModal from '@/components/Modals/DeleteExamSessionModal';
import EditSessionModal from '@/components/Modals/EditSession';
import AppDropdownDialog from '@/components/ui/Dropdown/AppDropdownDialog';
import { useState } from 'react';



type Props = Readonly<{ exam_id: number }>

export default function ExamSessionDropdownDialog({ exam_id }: Props) {
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openAddQuestion,setAddQuestion]=useState(false)

    function deleteExamSessionModal() {
        setOpenDeleteModal(true)
    }


     function addExamSessionModal() {
        setAddQuestion(true)
    }

    function handleOpenEditModal() {
        setOpenEditModal(true)
    }
    return (
        <AppDropdownDialog actionItems={[
            {
                label: <div className='flex justify-between'>
                    <span className=" pr-5  ">
                        <AddIcon />
                    </span>
                    <span>
                        Add Question
                    </span>
                </div>,
                onClick:addExamSessionModal
            },
            {
                label: <div className='flex justify-between'>
                    <span className=" pr-5  ">
                        <EditIcon />
                    </span>
                    <span>
                        Edit Session
                    </span>
                </div>,
                onClick: handleOpenEditModal
            },
            {
                label: <div className='flex justify-between'>
                    <span className=" pr-5  ">
                        <DeleteIcon />
                    </span>
                    <span className='text-[#D42620]'>
                        Delete Session
                    </span>
                </div>,
                onClick:deleteExamSessionModal
                // onClick:()=>alert('I was clicked')
            },

        ]} triggerButton={<button key='button-two' className="flex flex-col items-center justify-center w-10 h-full rounded-md border border-gray-300 hover:bg-gray-100">
            <span className=" w-1 h-1 bg-gray-700 rounded-full"></span>
            <span className="w-1 h-1 bg-gray-700 rounded-full my-0.5"></span>
            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
        </button>} >
            <EditSessionModal exam_id={exam_id} open={openEditModal} close={setOpenEditModal} />
            <AddQuestionModal open={openAddQuestion} close={setAddQuestion} />
            <DeleteExamSessionModal session_id={exam_id} open={openDeleteModal} close={setOpenDeleteModal} />
        </AppDropdownDialog>
    )
}