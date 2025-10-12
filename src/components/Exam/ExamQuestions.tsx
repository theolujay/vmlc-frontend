"use client";
import { useExamContext } from "@/contexts/ExamNavigationProvider";
import clsx from "clsx";
import React, { useState } from "react";
import { BackIcon, GotoIcon } from "../General/GettingStarted/GettingStartedAssets";
import SubmissionConfirmationModal from "./SubmissionConfirmationModal";
import useGetExamQuestions from "@/hooks/useGetExamQuestions";
// import { useGetExamQuestions } from "@/hooks/useGetExams";


export default function Questions() {
    const { showNav } = useExamContext()
    const [open,setOpen] = useState(true)
    const {data}=useGetExamQuestions(12);

    return <div className="grid grid-cols-6 h-[70vh] ">
        <div className={clsx("flex-col flex-1 transition-all duration-500 flex ", showNav ? 'col-span-4' : 'col-span-6')}>

        <div className={clsx("bg-[#f7f9fc] flex-1 transition-all duration-500 flex ", showNav ? 'col-span-4' : 'col-span-6')}>

            <EachQuestion />
            <Options />
        </div>
        {/* <div className="flex justify-between">
            <button>Previous Question</button>
            <button>Next Question</button>
        </div> */}
        <Toggle/>
        </div>
        <NumberGrid showNav={showNav} />
        <SubmissionConfirmationModal open={open} close={setOpen} />
    </div>
}


function Toggle(){
return  <div className="flex px-8 py-4 justify-between">
            <button className={clsx("inline-flex gap-3 border rounded-lg px-4 py-2 items-center cursor-pointer")}><span><BackIcon/></span> <span>Previous Question</span></button>
            <button className={clsx("inline-flex gap-3 border rounded-lg px-4 py-2 items-center cursor-pointer")}><span>Next Question</span><span><GotoIcon/></span></button>
        </div>
}







function NumberGrid({showNav}:{showNav:boolean}) {
   
    return <div className={clsx(showNav ? 'block' : 'hidden', "col-span-2 bg-white p-6 h-fit")}>
        <div className="grid grid-cols-5 gap-4">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                <div key={num} className="w-10 h-10 flex items-center justify-center border-gray-300 border rounded-lg cursor-pointer hover:bg-gray-100">
                    {num}
                </div>
            ))}
        </div>
    </div>
}




function EachQuestion() {
    return <div className=" flex m-6 flex-col flex-1 gap-5 p-6 ">
        <h4 className="text-sm font-bold text-[#3E4095]">QUESTION 1 OF 30</h4>
        <h2 className="text-2xl font-semibold mt-3">What is the capital of France?</h2>
    </div>
}




function Options() {
    const [selected, setSelected] = useState<string | null>(null);
    const options = ["Berlin", "Madrid", "Paris", "Rome"];

    return (
        <div className="flex-1 flex flex-col gap-3 p-6">
            {options.map((option, idx) => (
                <label
                    key={idx}
                    className={`flex items-center p-3 gap-2 border rounded-md cursor-pointer transition
            ${selected === option ? "border-[#3E4095] " : "border-gray-300 hover:bg-gray-100"}`}
                >
                    <input
                        type="radio"
                        name="option"
                        value={option}
                        checked={selected === option}
                        onChange={() => setSelected(option)}
                        className="" 
                    />
                    <span className="text-gray-800">{option}</span>
                </label>
            ))}
        </div>
    );
}





