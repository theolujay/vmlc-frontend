"use client"
import { ExamContextType } from '@/types/Index'
import React, { createContext, useContext, useState } from 'react'

const ExamContext = createContext<ExamContextType | null>(null)

export default function ExamNavigationProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [showNav, setShowNav] = useState(false)
    return (
        <ExamContext.Provider value={{ showNav, setShowNav }}>
            {children}
        </ExamContext.Provider>
    )
}


export function useExamContext() {
    const context = useContext(ExamContext)
    if (!context) {
        throw new Error('useExamContext must be used within ExamNavigationProvider')
    }
    return context;
}