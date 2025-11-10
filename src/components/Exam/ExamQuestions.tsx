"use client";

import { useExamContext } from "@/contexts/ExamNavigationProvider";
import clsx from "clsx";
import { Dispatch, SetStateAction, useState } from "react";
import { BackIcon, GotoIcon } from "../General/GettingStarted/GettingStartedAssets";
import Spinner from "../ui/spinner/spinner";
import SubmissionConfirmationModal from "./SubmissionConfirmationModal";

export default function Questions({data,isPending,answers,setAnswers,handleSubmit,submitPending}:{submitPending:boolean,handleSubmit:()=>void,data:any,isPending:boolean,answers:Record<number, string>,setAnswers:Dispatch<SetStateAction<Record<number, string>>>}) {
  const { showNav } = useExamContext();
  const [open, setOpen] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  console.log(data,'what is quesition data')
//   const [answers, setAnswers] = useState<Record<number, string>>({});
console.log(answers,'what do we have for answers')
  if (isPending || !data) return (
    <div className="w-full grid place-content-center">
      <Spinner />
    </div>
  );

//   const {isPending:submitPending,onSubmit}=useSubmitAnswers(exam_id)
  const questions = data.questions;
  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSelectOption = (questionId: number, optionLetter: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionLetter }));
  };

  // Format answers payload
  

  const totalAnswered = Object.keys(answers).length;
console.log(totalAnswered, "questions answered");



  return (
    <div className="grid grid-cols-6 h-[70vh]">
      <div className={clsx("flex-col flex-1 transition-all duration-500 flex", showNav ? 'col-span-4' : 'col-span-6')}>
        <div className={clsx("bg-[#f7f9fc] flex-1 transition-all duration-500 flex", showNav ? 'col-span-4' : 'col-span-6')}>
          <EachQuestion question={currentQuestion.text} index={currentQuestionIndex} total={questions.length} />
          <Options selected={answers[currentQuestion.id] || null} onSelect={handleSelectOption} question={currentQuestion} />
        </div>
        <Toggle
  disableNext={currentQuestionIndex === questions.length - 1}
  disablePrev={currentQuestionIndex === 0}
  onNext={handleNext}
  onPrev={handlePrev}
  onSubmit={() => {
    setOpen(true); 
  }}
/>

        {/* <Toggle disableNext={currentQuestionIndex === questions.length - 1} disablePrev={currentQuestionIndex === 0} onNext={handleNext} onPrev={handlePrev} /> */}
      </div>

      <NumberGrid
        current={currentQuestionIndex}
        onSelect={setCurrentQuestionIndex}
        numberOfQuestions={questions.length}
        showNav={showNav}
        answers={answers}
        questions={questions}
      />

      <SubmissionConfirmationModal handleSubmit={handleSubmit} isPending={submitPending} totalQuestions={questions.length} totalAnswered={totalAnswered} open={open} close={setOpen} />
    </div>
  );
}


function Toggle({
  onNext,
  onPrev,
  disableNext,
  disablePrev,
  onSubmit
}: {
  onNext: () => void;
  onPrev: () => void;
  disableNext: boolean;
  disablePrev: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="flex px-8 py-4 justify-between">
      <button
        disabled={disablePrev}
        onClick={onPrev}
        className={clsx(
          "inline-flex gap-3 border rounded-lg px-4 py-2 items-center cursor-pointer",
          disablePrev && "opacity-50 cursor-not-allowed"
        )}
      >
        <span><BackIcon /></span> <span>Previous Question</span>
      </button>

      {disableNext ? (
        <button
          onClick={onSubmit}
          className="inline-flex gap-3 border bg-[#3E4095] cursor-pointer font-semibold text-white rounded-lg px-4 py-2 items-center"
        >
          Submit Exam
        </button>
      ) : (
        <button
          onClick={onNext}
          className="inline-flex cursor-pointer gap-3 border bg-[#3E4095] text-white rounded-lg px-4 py-2 items-center"
        >
          <span>Next Question</span><span><GotoIcon /></span>
        </button>
      )}
    </div>
  );
}


function NumberGrid({ showNav, numberOfQuestions, current, onSelect, answers, questions }: { showNav: boolean; numberOfQuestions: number; current: number; onSelect: (index: number) => void; answers: Record<number, string>; questions: any[] }) {
  return (
    <div className={clsx(showNav ? "block" : "hidden", "col-span-2 bg-white p-6 h-fit")}>
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: numberOfQuestions }, (_, i) => {
          const questionId = questions[i].id;
          const isAnswered = !!answers[questionId];

          return (
            <div
              key={i}
              onClick={() => onSelect(i)}
              className={clsx(
                "w-10 h-10 flex items-center justify-center border rounded-lg cursor-pointer",
                isAnswered
                  ? "bg-green-500 text-white border-green-500"
                  : current === i
                    ? "bg-[#3E4095] text-white border-[#3E4095]"
                    : "border-gray-300 hover:bg-gray-100"
              )}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EachQuestion({ question, index, total }: { question: string, index: number, total: number }) {
  return (
    <div className="flex m-6 flex-col flex-1 gap-5 p-6">
      <h4 className="text-sm font-bold text-[#3E4095]">QUESTION {index + 1} OF {total}</h4>
      <h2 className="text-2xl font-semibold mt-3">{question}</h2>
    </div>
  );
}

function Options({ question, selected, onSelect }: { question: any, selected: string | null, onSelect: (questionId: number, value: string) => void }) {
  const optionMap = {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d,
  };

  return (
    <div className="flex-1 flex flex-col gap-3 p-6">
      {Object.entries(optionMap).map(([key, value]) => (
        <label
          key={key}
          className={`flex items-center p-3 gap-2 border bg-white rounded-md cursor-pointer transition
            ${selected === key ? "border-[#3E4095]" : "border-none hover:bg-gray-100"}`}
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={key}
            checked={selected === key}
            onChange={() => onSelect(question.id, key)}
            className=""
          />
          <span className="text-gray-800">{value}</span>
        </label>
      ))}
    </div>
  );
}
