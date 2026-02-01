"use client"
import { useSearchParams } from 'next/navigation'
import React from 'react'
import ExamSession from './ExamSession';
import QuestionPool from './QuestionPool';
import ExamSection from './ExamSection';


export default function ExamSectionWrapper() {
    const currentView = useSearchParams().get('view');
    return renderComponent(currentView);
}




function renderComponent(view: string | null) {
    switch (view) {
        case 'exam-session':
            return <ExamSession />
        default:
            return <ExamSection />
    }
}
