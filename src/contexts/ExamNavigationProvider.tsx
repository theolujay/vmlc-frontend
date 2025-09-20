"use client"
import React, { createContext, useContext, useState } from 'react'


type ExamContextType = {
    showNav: boolean;
    setShowNav: React.Dispatch<React.SetStateAction<boolean>>;
};
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