"use client";
import { useExamContext } from "@/contexts/ExamNavigationProvider";
import clsx from "clsx";
import React, { useState } from "react";


export default function Questions() {
    const { showNav } = useExamContext()
    // console.log(examContext,'what is here')
    return <div className="grid grid-cols-6 min-h-[70vh] ">
        <div className={clsx("bg-[#f7f9fc] flex col-span-4 ", showNav ? 'col-span-4' : 'col-span-6')}>

            <EachQuestion />
            <Options />
        </div>
        <NumberGrid showNav={showNav} />
    </div>
}


function NumberGrid({showNav}:{showNav:boolean}) {
   
    return <div className={clsx(showNav ? 'block' : 'hidden', "col-span-2 bg-white p-6 h-fit")}>
        <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                <div key={num} className="w-10 h-10 flex items-center justify-center border rounded-lg cursor-pointer hover:bg-gray-100">
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

// function Options(){
//     return <div className="col-span-3 flex flex-wrap flex-col gap-3 p-6 ">
//         {["Berlin", "Madrid", "Paris", "Rome"].map((option, idx) => (
//             <label key={idx} className="flex items-center p-3 gap-2 border rounded-md cursor-pointer hover:bg-gray-100">

//                 <input type="radio" name="option" className="" />
//                 <span className="text-gray-800">{option}</span>
//             </label>
//         ))}
//     </div>
// }




export function Options() {
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
                        className="" // hide the default radio
                    />
                    <span className="text-gray-800">{option}</span>
                </label>
            ))}
        </div>
    );
}





// export function ExamQuestions({
//   question,
//   options,
//   correctAnswer,
//   questionNumber,
//   totalQuestions,
// }: QuestionProps) {
//   const [selected, setSelected] = useState<string | null>(null);

//   return (
//     <div className="flex flex-col lg:flex-row bg-white shadow-md rounded-lg p-6 w-full max-w-5xl mx-auto">
//       {/* Left side - Question */}
//       <div className="flex-1 pr-4">
//         <h4 className="text-sm font-medium text-blue-600">
//           QUESTION {questionNumber} OF {totalQuestions}
//         </h4>
//         <h2 className="text-2xl font-semibold mt-3">{question}</h2>

//         <div className="mt-6 space-y-3">
//           {options.map((option, idx) => (
//             <label
//               key={idx}
//               className={`flex items-center p-3 border rounded-md cursor-pointer transition ${
//                 selected === option.value
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-300"
//               }`}
//             >
//               <input
//                 type="radio"
//                 name="option"
//                 value={option.value}
//                 checked={selected === option.value}
//                 onChange={(e) => setSelected(e.target.value)}
//                 className="hidden"
//               />
//               <span className="text-gray-800">{option.label}</span>
//             </label>
//           ))}
//         </div>

//         <div className="flex justify-between mt-8">
//           <button className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
//             ← Previous Question
//           </button>
//           <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
//             Next Question →
//           </button>
//         </div>
//       </div>

//       {/* Right side - Navigation */}
//       <div className="mt-6 lg:mt-0 lg:pl-6 flex flex-wrap gap-2 w-48">
//         {Array.from({ length: totalQuestions }).map((_, i) => (
//           <button
//             key={i}
//             className={`w-10 h-10 rounded-md border flex items-center justify-center text-sm ${
//               i + 1 === questionNumber
//                 ? "bg-indigo-600 text-white"
//                 : "border-gray-300 hover:bg-gray-100"
//             }`}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
