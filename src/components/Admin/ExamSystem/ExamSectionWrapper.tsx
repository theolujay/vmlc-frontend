"use client"
import { useSearchParams } from 'next/navigation'
import React from 'react'
import ExamSession from './ExamSession';
import QuestionPool from './QuestionPool';
import ExamSection from './ExamSection';
// import ExamSection from './ExamSystem/ExamSection';
// import QuestionPool from './QuestionPool';
// import ExamSession from './ExamSystem/ExamSession';

export default function ExamSectionWrapper() {
    const currentView = useSearchParams().get('view');
    return renderComponent(currentView);

}




function renderComponent(view: string | null) {
    switch (view) {
        case 'exam-session':
            return <ExamSession />
        case 'easy-question':
        case 'moderate-question':
        case 'hard-question':
        case 'total-question':
            return <QuestionPool />
        default:
            return <ExamSection />
    }
}
