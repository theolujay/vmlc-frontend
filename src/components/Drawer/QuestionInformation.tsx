import Drawer from '@/components/ui/Drawer/Drawer'
import { CloseIcon } from '../Admin/AdminIcons'
import { SessionQuestionItemType } from '@/types/Examtype'
import { getOptionAsArray, getUserName } from '@/utils/generalUtils'
import { formatDate, formatTimeToString, getAppropriateColor } from '@/utils/formatFileSize'
import clsx from 'clsx'
import { useMemo } from 'react'


export default function QuestionInformation({ open, setOpen, information }: Readonly<{ open: boolean, setOpen: (open: boolean) => void, information: SessionQuestionItemType }>) {

    // const options = getOptionAsArray(information)
    const options = useMemo(() => getOptionAsArray(information) || [], [information])
    console.log(options, 'what is options')
    const formattedDate = formatDate(information.created_at);
    const formattedTime = formatTimeToString(information.created_at)
    const correct = options.find((val) => val.optionKey.endsWith(information.correct_answer.toLowerCase()));
    const getName = getUserName(information.created_by?.user?.first_name, information.created_by?.user?.last_name)
    return (
        <Drawer open={open} onClose={setOpen}>
            <div className="flex flex-col">
                <div className="header border-b py-1 justify-between border-[#E4E7EC] flex ">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="font-bold text-lg">Question Information</h2>
                        <p className="text-sm text-gray-500">This contains the clicked question information</p>
                    </div>
                    <button className='inline-flex gap-2 border h-10 rounded-md border-[#D0D5DD] items-center px-2  cursor-pointer'><span><CloseIcon /></span><span>Close</span></button>
                </div>

                <div className="body  flex flex-col gap-3 mt-3 border-[#D0D5DD] border-b">
                    <div className=" flex flex-col gap-0.5 mt-3">
                        <span className='text-sm text-[#344054]'>QUESTION DIFFICULTY</span>
                        <span className={clsx('capitalize w-fit rounded-full px-2 py-1 font-semibold', getAppropriateColor(information.difficulty))}>{information.difficulty}</span>
                    </div>
                    <div className=" flex flex-col gap-0.5 mt-3">
                        <span className='text-sm text-[#344054]'>QUESTION</span>
                        <span>{information.text}</span>
                    </div>
                    <div className=" flex flex-col gap-0.5 mt-3">
                        <span className='text-sm text-[#344054]'>OPTIONS</span>
                        <div className="flex gap-3 flex-col w-full"  >
                            {
                                options.map((val, index) => {
                                    const [, key] = val.optionKey.split('_');
                                    
                                    return <div key={`option-${index + 1}`} className="option flex gap-1">
                                        <input id={val.optionKey} type="radio" readOnly />
                                        <label htmlFor={val.optionKey}>({key}) {val.option}</label>
                                    </div>
                                }
                                )
                            }
                        </div>
                    </div>

                    <div className=" flex flex-col gap-0.5 mt-3 mb-3">
                        <span className='text-sm text-[#344054]'>ANSWER</span>
                        <div className="flex text-[#3E4095]">
                            <span className=''>({information.correct_answer.toLowerCase()})</span><span className='ml-2'>{correct?.option}</span>

                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 user-details">
                    <div className=" flex flex-col gap-0.5 mt-3">
                        <span className='text-sm text-[#344054]'>SUBMITTED BY</span>
                        <span>{getName}</span>
                    </div>
                    <div className="flex justify-between">
                        <div className=" flex flex-col gap-0.5 mt-3">
                            <span className='text-sm text-[#344054]'>SUBMITTED DATE</span>
                            <span>{formattedDate}</span>
                        </div>
                        <div className=" flex flex-col gap-0.5 mt-3">
                            <span className='text-sm text-[#344054]'>SUBMITTED TIME</span>
                            <span>{formattedTime}</span>
                        </div>
                    </div>
                    <div className=" flex flex-col gap-0.5 mt-3">
                        <span className='text-sm text-[#344054]'>STAFF'S PHONE NUMBER</span>
                        <span>{information.created_by?.user?.phone}</span>
                    </div>
                    <div className=" flex flex-col gap-0.5 mt-3">
                        <span className='text-sm text-[#344054]'>STAFF'S EMAIL</span>
                        <span>{information.created_by?.user?.email}</span>
                    </div>
                </div>

            </div>
        </Drawer>
    )
}
