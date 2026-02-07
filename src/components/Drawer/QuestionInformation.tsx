import Drawer from '@/components/ui/Drawer/Drawer'
import { SessionQuestionItemType } from '@/types/Examtype'
import { getOptionAsArray, getUserName } from '@/utils/generalUtils'
import { formatDate, formatTimeToString, getAppropriateColor } from '@/utils/formatFileSize'
import clsx from 'clsx'
import { useMemo } from 'react'
import MathRenderer from '@/components/Exam/MathRenderer'


export default function QuestionInformation({ open, setOpen, information }: Readonly<{ open: boolean, setOpen: (open: boolean) => void, information: SessionQuestionItemType }>) {

    const options = useMemo(() => getOptionAsArray(information) || [], [information])
    const formattedDate = formatDate(information.created_at);
    const formattedTime = formatTimeToString(information.created_at)
    // const correct = options.find((val) => val.optionKey.endsWith(information.correct_answer.toLowerCase()));
    const getName = information.created_by?.full_name || getUserName(information.created_by?.user?.first_name || '', information.created_by?.user?.last_name || '')

    return (
        <Drawer open={open} onClose={setOpen}>
            <div className="flex flex-col gap-8 font-sans">
                {/* Header Section */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-6 -mx-2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#3E4095]/5 rounded-2xl flex items-center justify-center text-[#3E4095]">
                            <i className="fas fa-info-circle text-xl"></i>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="font-black text-xl text-gray-800 tracking-tight">Question Details</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: #{information.id}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setOpen(false)}
                        className='inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all cursor-pointer shadow-sm active:scale-95'
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Main Content Body */}
                <div className="flex flex-col gap-8">
                    {/* Difficulty Pill */}
                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-signal text-[#3E4095] text-[10px]"></i>
                            <span className='text-[9px] font-black text-gray-400 uppercase tracking-widest'>Difficulty Level</span>
                        </div>
                        <span className={clsx(
                            'capitalize w-fit rounded-full px-4 py-1.5 font-black text-[10px] tracking-widest border border-current/10 shadow-sm', 
                            getAppropriateColor(information.difficulty),
                            "bg-white"
                        )}>
                            {information.difficulty}
                        </span>
                    </div>

                    {/* Question Content */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-question-circle text-[#3E4095] text-[10px]"></i>
                            <span className='text-[9px] font-black text-gray-400 uppercase tracking-widest'>Question Text</span>
                        </div>
                        <div className="text-gray-900 font-bold text-lg leading-relaxed bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50 relative overflow-hidden group">
                             <div className="absolute top-0 left-0 w-1.5 h-full bg-[#3E4095]/10 group-hover:bg-[#3E4095] transition-colors"></div>
                            <MathRenderer content={information.text} />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-list-ol text-[#3E4095] text-[10px]"></i>
                            <span className='text-[9px] font-black text-gray-400 uppercase tracking-widest'>Options</span>
                        </div>
                        <div className="grid gap-3">
                            {options.map((val, index) => {
                                const [, key] = val.optionKey.split('_');
                                const isCorrect = val.optionKey.endsWith(information.correct_answer.toLowerCase());
                                
                                return (
                                    <div 
                                        key={`option-${index + 1}`} 
                                        className={clsx(
                                            "flex gap-4 items-center p-4 rounded-2xl border transition-all duration-300",
                                            isCorrect 
                                                ? "bg-emerald-50 border-emerald-100 shadow-sm" 
                                                : "bg-white border-gray-100 hover:border-gray-200"
                                        )}
                                    >
                                        <div className={clsx(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 font-black text-[10px]",
                                            isCorrect 
                                                ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                                                : "bg-white border-gray-200 text-gray-400"
                                        )}>
                                            {key.toUpperCase()}
                                        </div>
                                        <div className={clsx(
                                            "text-sm font-bold tracking-tight",
                                            isCorrect ? "text-emerald-700" : "text-gray-700"
                                        )}>
                                            <MathRenderer content={val.option} inline />
                                        </div>
                                        {isCorrect && (
                                            <div className="ml-auto">
                                                <i className="fas fa-check-circle text-emerald-500 text-sm"></i>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Verified Answer Section */}
                    {/* <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                            <i className="fas fa-check-double text-emerald-500 text-[10px]"></i>
                            <span className='text-[9px] font-black text-gray-400 uppercase tracking-widest'>Verified Answer</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#3E4095] p-5 rounded-2xl text-white shadow-lg shadow-[#3E4095]/20 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black text-xs">
                                {information.correct_answer.toUpperCase()}
                            </div>
                            <div className="font-black text-sm tracking-tight">
                                <MathRenderer content={correct?.option || ''} inline />
                            </div>
                        </div>
                    </div> */}
                </div>

                {/* Submission & Staff Metadata */}
                <div className="mt-4 pt-8 border-t border-gray-100 flex flex-col gap-6">
                    <div className="flex items-center gap-2 mb-2">
                        <i className="fas fa-user-shield text-[#3E4095] text-[10px]"></i>
                        <span className='text-[9px] font-black text-gray-400 uppercase tracking-widest'>Submission Info</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50">
                        <div className="flex flex-col gap-1.5">
                            <span className='text-[8px] font-black text-gray-400 uppercase tracking-widest'>Submitted By</span>
                            <span className="text-sm font-black text-gray-800 tracking-tight">{getName}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className='text-[8px] font-black text-gray-400 uppercase tracking-widest'>Timestamp</span>
                            <span className="text-sm font-black text-gray-800 tracking-tight">{formattedDate} <span className="text-gray-300 mx-1">|</span> {formattedTime}</span>
                        </div>
                        {information.created_by?.user && (
                            <>
                                <div className="flex flex-col gap-1.5">
                                    <span className='text-[8px] font-black text-gray-400 uppercase tracking-widest'>Contact Phone</span>
                                    <span className="text-sm font-black text-gray-800 tracking-tight">{information.created_by?.user?.phone || 'N/A'}</span>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <span className='text-[8px] font-black text-gray-400 uppercase tracking-widest'>Email Address</span>
                                    <span className="text-sm font-black text-gray-800 tracking-tight truncate" title={information.created_by?.user?.email}>{information.created_by?.user?.email}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Drawer>
    )
}
