"use client"
import { useSearchParams } from 'next/navigation'
import React from 'react'
import ExamSection from './ExamSection';
import QuestionPool from './QuestionPool';

export default function ExamSectionWrapper() {
    const currentView = useSearchParams().get('view');
    if (!currentView) {
        return <ExamSection />
    }
    return <QuestionPool />
}



