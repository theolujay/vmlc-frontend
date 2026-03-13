"use client"
import { useSearchParams } from 'next/navigation'
import React from 'react'
import ExamSession from './ExamSession';
import ExamSection from './ExamSection';


export default function ExamSectionWrapper() {
    const searchParams = useSearchParams();
    const currentView = searchParams.get('view') || searchParams.get('tab');
    return renderComponent(currentView);
}




function renderComponent(view: string | null) {
    switch (view) {
        case 'exam-session':
            return <ExamSession />
        case 'exams-questions':
        default:
            return <ExamSection />
    }
}
