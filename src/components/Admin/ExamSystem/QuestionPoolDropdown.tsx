import QuestionInformation from '@/components/Drawer/QuestionInformation';
import { DeleteIcon } from '@/components/General/GeneralIcon';
import { AddIcon, EyeIcon } from '@/components/General/GettingStarted/GettingStartedAssets';
import RemoveQuestionModal from '@/components/Modals/RemoveQuestionModal';
import AppDropdownDialog from '@/components/ui/Dropdown/AppDropdownDialog';
import { SessionQuestionItemType } from '@/types/Examtype';
import { useState } from 'react';
// import ViewDetails from '../OverviewSection/ViewDetails';



type Props = Readonly<{ question_id: number,information:SessionQuestionItemType }>

export default function QuestionPoolDropdown({ question_id ,information}: Props) {
    const [openViewModal, setOpenViewModal] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    function handleDeleteModal() {
        setOpenDeleteModal(true)
    }

    function handleOpenViewModal() {
        setOpenViewModal(true)
    }
    return (
        <AppDropdownDialog actionItems={[
            {
                label: <div className='flex justify-between'>
                    <span className=" pr-5  ">
                        <AddIcon />
                    </span>
                    <span>
                        Add to exam session
                    </span>
                </div>
            },
            {
                label: <div className='flex justify-between'>
                    <span className=" pr-5  ">
                        <EyeIcon/>
                    </span>
                    <span>
                        View Details
                    </span>
                </div>,
                onClick: handleOpenViewModal
            },
            {
                label: <div className='flex justify-between'>
                    <span className=" pr-5  ">
                        <DeleteIcon />
                    </span>
                    <span className='text-[#D42620]'>
                        Delete Question
                    </span>
                </div>,
                onClick:handleDeleteModal
                // onClick:()=>alert('I was clicked')
            },

        ]} triggerButton={<button key='button-two' className="flex flex-col p-2 items-center justify-center w-10 h-full rounded-md border border-gray-300 hover:bg-gray-100">
            <span className=" w-1 h-1 bg-gray-700 rounded-full"></span>
            <span className="w-1 h-1 bg-gray-700 rounded-full my-0.5"></span>
            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
        </button>} >
        {/* <ViewDetails */}
        <QuestionInformation information={information} open={openViewModal} setOpen={setOpenViewModal} />
            {/* <EditSesionModal exam_id={exam_id} open={openEditModal} close={setOpenEditModal} /> */}
            <RemoveQuestionModal question_id={question_id} open={openDeleteModal} close={setOpenDeleteModal} />
        </AppDropdownDialog>
    )
}