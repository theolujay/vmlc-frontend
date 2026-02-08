/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useExamContext } from "@/contexts/ExamNavigationProvider";
import clsx from "clsx";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import Spinner from "../ui/spinner/spinner";
import SubmissionConfirmationModal from "./SubmissionConfirmationModal";
import MathRenderer from "./MathRenderer";
import Image from "next/image";
import { TakeExamQuestionType, TakeExamType } from "@/types/Examtype";

export default function Questions({ data, isPending, answers, setAnswers, handleSubmit, submitPending }: { submitPending: boolean, handleSubmit: () => void, data: TakeExamType | undefined, isPending: boolean, answers: Record<number, string>, setAnswers: Dispatch<SetStateAction<Record<number, string>>> }) {
    const { showNav } = useExamContext();
    const [open, setOpen] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (data?.id) {
            const savedIndex = localStorage.getItem(`exam_current_question_${data.id}`);
            if (savedIndex) {
                setCurrentQuestionIndex(Number(savedIndex));
            }
            setIsLoaded(true);
        }
    }, [data?.id]);

    useEffect(() => {
        if (data?.id && isLoaded) {
            localStorage.setItem(`exam_current_question_${data.id}`, String(currentQuestionIndex));
        }
    }, [currentQuestionIndex, data?.id, isLoaded]);

    if (isPending || !data) return (
        <div className="w-full flex items-center justify-center py-40 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center">
                <Spinner />
                <span className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Assembling Examination...</span>
            </div>
        </div>
    );

    const questions = data.questions || [];

    if (questions.length === 0) {
        return (
            <div className="w-full py-40 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <i className="fas fa-folder-open text-3xl"></i>
                </div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">No Questions Found</h2>
                <p className="text-gray-400 mt-2 max-w-xs mx-auto text-sm font-medium">There are no questions assigned to this exam session yet. Please contact your administrator.</p>
            </div>
        );
    }

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

    const totalAnswered = Object.keys(answers).length;

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Question Area */}
            <div className={clsx(
                "flex-1 flex flex-col transition-all duration-500",
                showNav ? "lg:w-[70%]" : "w-full"
            )}>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                    {/* Header */}
                    <div className="px-10 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <div className="flex items-center space-x-3">
                            <span className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#3E4095] text-white font-black text-sm shadow-lg shadow-[#3E4095]/20">
                                {currentQuestionIndex + 1}
                            </span>
                            <div className="flex flex-col">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Question</h3>
                                {/* <span className="text-xs font-bold text-gray-800 mt-1">Difficulty: {currentQuestion.difficulty || 'Standard'}</span> */}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                             <span className="text-[10px] font-black text-[#3E4095] uppercase tracking-widest">Progress:</span>
                             <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-[#3E4095] transition-all duration-500" 
                                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                ></div>
                             </div>
                             <span className="text-[10px] font-black text-gray-400">{currentQuestionIndex + 1}/{questions.length}</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <EachQuestion question={currentQuestion.text} image={currentQuestion.image} />
                        <Options 
                            selected={answers[currentQuestion.id] || null} 
                            onSelect={handleSelectOption} 
                            question={currentQuestion} 
                        />
                    </div>

                    {/* Footer Controls */}
                    <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100">
                        <Toggle
                            disableNext={currentQuestionIndex === questions.length - 1}
                            disablePrev={currentQuestionIndex === 0}
                            onNext={handleNext}
                            onPrev={handlePrev}
                            onSubmit={() => {
                                setOpen(true);
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Navigation Sidebar */}
            {showNav && (
                <div className="w-full lg:w-[350px] animate-in slide-in-from-right-4 duration-500 shrink-0">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8 sticky top-32">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-8 h-8 rounded-lg bg-[#3E4095]/5 flex items-center justify-center text-[#3E4095]">
                                <i className="fas fa-list-ol text-sm"></i>
                            </div>
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Quiz Navigation</h3>
                        </div>

                        <NumberGrid
                            current={currentQuestionIndex}
                            onSelect={setCurrentQuestionIndex}
                            numberOfQuestions={questions.length}
                            answers={answers}
                            questions={questions}
                        />

                        <div className="mt-10 pt-8 border-t border-gray-50 flex flex-col space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Answered</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-800">{totalAnswered}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-[#3E4095]"></div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-800">1</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full border border-gray-200 bg-white"></div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Remaining</span>
                                </div>
                                <span className="text-[10px] font-black text-gray-800">{questions.length - totalAnswered}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setOpen(true)}
                            className="w-full mt-10 py-5 bg-[#3E4095] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#3E4095]/20 hover:bg-[#2d2f6e] hover:-translate-y-1 transition-all active:scale-95"
                        >
                            Final Submission
                        </button>
                    </div>
                </div>
            )}

            <SubmissionConfirmationModal
                handleSubmit={handleSubmit}
                isPending={submitPending}
                totalQuestions={questions.length}
                totalAnswered={totalAnswered}
                open={open}
                close={setOpen} 
            />
        </div>
    );
}


function Toggle({
    onNext,
    onPrev,
    disableNext,
    disablePrev,
    onSubmit
}: Readonly<{
    onNext: () => void;
    onPrev: () => void;
    disableNext: boolean;
    disablePrev: boolean;
    onSubmit: () => void;
}>) {
    return (
        <div className="flex justify-between items-center">
            <button
                disabled={disablePrev}
                onClick={onPrev}
                className={clsx(
                    "flex items-center space-x-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 border",
                    disablePrev 
                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed" 
                        : "bg-white text-[#3E4095] border-[#3E4095]/20 hover:bg-gray-50 shadow-sm"
                )}
            >
                <i className="fas fa-chevron-left text-xs"></i>
                <span>Previous Question</span>
            </button>

            {disableNext ? (
                <button
                    onClick={onSubmit}
                    className="flex items-center space-x-3 px-12 py-4 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-green-600/20 hover:bg-green-700 hover:-translate-y-1 transition-all active:scale-95"
                >
                    <i className="fas fa-paper-plane text-xs"></i>
                    <span>Submit Exam</span>
                </button>
            ) : (
                <button
                    onClick={onNext}
                    className="flex items-center space-x-3 px-10 py-4 bg-[#3E4095] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#3E4095]/20 hover:bg-[#2d2f6e] hover:-translate-y-1 transition-all active:scale-95"
                >
                    <span>Next Question</span>
                    <i className="fas fa-chevron-right text-xs"></i>
                </button>
            )}
        </div>
    );
}


function NumberGrid({ numberOfQuestions, current, onSelect, answers, questions }: Readonly<{ numberOfQuestions: number; current: number; onSelect: (index: number) => void; answers: Record<number, string>; questions: any[] }>) {
    return (
        <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {Array.from({ length: numberOfQuestions }, (_, i) => {
                const questionId = questions[i].id;
                const isAnswered = !!answers[questionId];
                const isCurrent = current === i;

                return (
                    <button
                        key={i}
                        onClick={() => onSelect(i)}
                        className={clsx(
                            "w-11 h-11 flex items-center justify-center rounded-xl font-black text-xs transition-all duration-300 active:scale-90 border-2",
                            isAnswered
                                ? "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20"
                                : isCurrent
                                    ? "bg-[#3E4095] text-white border-[#3E4095] shadow-lg shadow-[#3E4095]/20 scale-110"
                                    : "bg-white text-gray-400 border-gray-100 hover:border-[#3E4095]/30 hover:text-[#3E4095]"
                        )}
                    >
                        {i + 1}
                    </button>
                );
            })}
        </div>
    );
}

function EachQuestion({ question, image }: { question: string, image?: string }) {
    return (
        <div className="px-10 py-12 flex flex-col gap-6">
            <div className="flex items-center space-x-3">
                <div className="h-px flex-1 bg-gray-100"></div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Problem Statement</span>
                <div className="h-px flex-1 bg-gray-100"></div>
            </div>
            <div className="flex flex-col gap-8">
                <div className="text-2xl font-semibold text-gray-800 leading-relaxed bg-gray-50/30 p-8 rounded-[2rem] border border-dashed border-gray-200">
                    <MathRenderer content={question} />
                </div>
                
                {image && (
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50/30">
                        <Image
                            src={image}
                            alt="Question Diagram"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function Options({ question, selected, onSelect }: { question: TakeExamQuestionType, selected: string | null, onSelect: (questionId: number, value: string) => void }) {
    const optionMap = {
        A: question.option_a,
        B: question.option_b,
        C: question.option_c,
        D: question.option_d,
    };

    return (
        <div className="px-10 pb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(optionMap).map(([key, value]) => (
                <button
                    key={key}
                    onClick={() => onSelect(question.id, key)}
                    className={clsx(
                        "flex items-start p-6 gap-5 rounded-[2rem] border-2 transition-all group relative text-left outline-none",
                        selected === key 
                            ? "bg-[#3E4095]/5 border-[#3E4095] shadow-xl shadow-[#3E4095]/5" 
                            : "bg-white border-gray-50 hover:border-gray-200 hover:shadow-md"
                    )}
                >
                    <div className={clsx(
                        "w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300",
                        selected === key
                            ? "bg-[#3E4095] text-white shadow-lg shadow-[#3E4095]/20"
                            : "bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-[#3E4095] border border-transparent group-hover:border-[#3E4095]/10"
                    )}>
                        {key}
                    </div>
                   
                    <div className={clsx(
                        "pt-3 text-base font-bold transition-colors leading-relaxed",
                        selected === key ? "text-[#3E4095]" : "text-gray-600 group-hover:text-gray-900"
                    )}>
                        <MathRenderer content={value as string} inline />
                    </div>

                    {selected === key && (
                        <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
                            <i className="fas fa-check-circle text-[#3E4095] text-lg"></i>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
