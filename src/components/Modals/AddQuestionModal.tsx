'use client';

import React, { useState, useEffect, useCallback, useMemo } from "react"
import AppDialog from "@/components/ui/Modals/AppDialog"
import useCreateQuestion from "@/hooks/useCreateQuestion"
import MathInput from "./ui/MathInput"
import { parseBulkQuestion } from "@/services/gemini.service"
import { Difficulty, QuestionData } from "@/types/question"
import { DIFFICULTY_OPTIONS } from "@/constants/math"

export default function AddQuestionModal({
  open,
  close,
}: Readonly<{ open: boolean; close: (close: boolean) => void }>) {
  const { onSubmit, isPending, form } = useCreateQuestion(() => {
    setHasChanges(false);
    handleClose(true);
  });

  const initialFormData: QuestionData = useMemo(() => ({
    questionText: '',
    options: [
      { id: '1', label: 'Option A', text: '', type: 'wrong' },
      { id: '2', label: 'Option B', text: '', type: 'wrong' },
      { id: '3', label: 'Option C', text: '', type: 'wrong' },
      { id: '4', label: 'Option D', text: '', type: 'wrong' },
    ],
    difficulty: Difficulty.EASY,
  }), []);

  // Local state for the rich UI
  const [formData, setFormData] = useState<QuestionData>(initialFormData);
  const [correctOptionId, setCorrectOptionId] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [showImportView, setShowImportView] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Track changes to prompt confirmation on close
  useEffect(() => {
    const isChanged = 
      formData.questionText !== initialFormData.questionText ||
      formData.options.some((opt, idx) => opt.text !== initialFormData.options[idx].text) ||
      formData.difficulty !== initialFormData.difficulty ||
      correctOptionId !== '';
    setHasChanges(isChanged);
  }, [formData, correctOptionId, initialFormData]);

  const handleClose = useCallback((arg?: boolean | React.MouseEvent | unknown) => {
    const force = arg === true;
    if (!force && hasChanges && !showCloseConfirm) {
      setShowCloseConfirm(true);
      return;
    }
    close(false);
    // Reset local state after a delay to allow for closing animation
    setTimeout(() => {
      setFormData(initialFormData);
      setCorrectOptionId('');
      setBulkText('');
      setHasChanges(false);
      setShowCloseConfirm(false);
      form.reset();
    }, 300);
  }, [hasChanges, showCloseConfirm, close, form, initialFormData]);


  // Sync correct answer selection
  const handleSetCorrectOption = (id: string) => {
    setCorrectOptionId(id);
    const labelMap: Record<string, string> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
    form.setValue("correct_answer", labelMap[id] || '');
  };

  const handleUpdateOption = (id: string, field: 'text' | 'type', val: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(opt => 
        opt.id === id ? { ...opt, [field]: val } : opt
      )
    }));
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) return;
    setIsImporting(true);
    try {
      const parsed = await parseBulkQuestion(bulkText);
      
      if (!parsed.options || parsed.options.length < 4) {
        throw new Error(
          `Import requires exactly 4 options. Found ${parsed.options?.length || 0}.`
        );
      }
      
      const normalizedOptions = parsed.options.slice(0, 4).map((opt, idx) => ({
        id: String(idx + 1),
        label: `Option ${String.fromCharCode(65 + idx)}`,
        text: opt.text || '',
        type: opt.type || 'wrong'
      }));
      
      setFormData({
        questionText: parsed.questionText || '',
        options: normalizedOptions,
        difficulty: (parsed.difficulty as Difficulty) || Difficulty.EASY
      });
      
      setCorrectOptionId('');
      setShowImportView(false);
      setBulkText('');
    } catch (error) {
      console.error('Bulk import failed:', error);
      alert(
        `Failed to import: ${error instanceof Error ? error.message : 'Please ensure text contains a question and 4 options.'}`
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleSubmit = () => {
    const payload = {
      text: formData.questionText,
      option_a: formData.options[0]?.text || '',
      option_b: formData.options[1]?.text || '',
      option_c: formData.options[2]?.text || '',
      option_d: formData.options[3]?.text || '',
      correct_answer: formData.options.find(o => o.id === correctOptionId) ? (['A','B','C','D'][parseInt(correctOptionId)-1]) : '',
      difficulty: formData.difficulty.toLowerCase(),
    };
    
    form.setValue("text", payload.text);
    form.setValue("option_a", payload.option_a);
    form.setValue("option_b", payload.option_b);
    form.setValue("option_c", payload.option_c);
    form.setValue("option_d", payload.option_d);
    form.setValue("difficulty", payload.difficulty);
    form.setValue("correct_answer", payload.correct_answer);

    form.handleSubmit(onSubmit)();
  };

  return (
    <AppDialog open={open} className="!max-w-6xl !w-auto !p-0 bg-transparent shadow-none">
      <div className="flex flex-col bg-[#F7F9FC] w-[95vw] md:w-[85vw] lg:w-[80vw] xl:w-[70vw] h-[90vh] rounded-3xl overflow-hidden shadow-2xl relative font-sans border border-white/20">
        
        {/* Close Confirmation Overlay */}
        {showCloseConfirm && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-exclamation-triangle text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Unsaved Changes</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">You have unsaved work. Are you sure you want to discard these changes?</p>
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => setShowCloseConfirm(false)}
                  className="w-full py-4 bg-[#3E4095] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#2d2f6e] transition-all"
                >
                  Continue Editing
                </button>
                <button 
                  onClick={() => {
                    setHasChanges(false);
                    setShowCloseConfirm(false);
                    close(false);
                  }}
                  className="w-full py-4 bg-gray-50 text-gray-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#3E4095]/5 rounded-2xl flex items-center justify-center text-[#3E4095]">
                <i className="fas fa-plus-circle text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">Add New Question</h1>
              {/* <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                Visual Editor Ready
              </p> */}
            </div>
          </div>
          <div className="flex space-x-3">
             <button 
              onClick={() => setShowImportView(!showImportView)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase shadow-sm ${
                showImportView 
                ? 'bg-gray-800 text-white hover:bg-gray-900' 
                : 'bg-white border border-gray-100 text-[#3E4095] hover:bg-gray-50'
              }`}
            >
              <i className={`fas ${showImportView ? 'fa-keyboard' : 'fa-wand-magic-sparkles'}`}></i>
              <span>{showImportView ? 'BACK TO DEFAULT' : 'AI IMPORT'}</span>
            </button>
            <button 
              onClick={handleClose} 
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#F7F9FC]">
          
          {/* AI Smart Import View */}
          {showImportView && (
            <div className="p-12 bg-white h-full animate-in slide-in-from-right-4 duration-300">
              <div className="max-w-3xl mx-auto space-y-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#3E4095]/10 text-[#3E4095] text-[10px] font-black tracking-widest">
                    <i className="fas fa-robot mr-2"></i> Powered by VMLC engine
                  </div>
                  <h2 className="text-3xl font-black text-gray-800 leading-tight">Import from text</h2>
                  {/* <p className="text-gray-500 leading-relaxed">
                    Paste a question with its options and automatically identify the question text, extract options, and format mathematical expressions LaTeX.
                  </p> */}
                </div>
                
                <div className="relative group">
                    <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder="Paste your question and options here... 
Example:
If f(x) = sin(x), find f'(pi/2)
A) 0
B) 1
C) -1
D) 1/2"
                    className="w-full h-80 p-8 text-base bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-[#3E4095]/10 focus:border-[#3E4095] outline-none transition-all font-mono leading-relaxed text-black shadow-inner"
                    />
                    <div className="absolute top-6 right-6 opacity-0 group-focus-within:opacity-100 transition-opacity">
                         <span className="px-3 py-1 bg-[#3E4095] text-white text-[10px] font-bold rounded-full shadow-lg">AI PROCESSING...</span>
                    </div>
                </div>

                <div className="flex space-x-6">
                  <button 
                    onClick={() => setShowImportView(false)}
                    className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleBulkImport}
                    disabled={isImporting || !bulkText.trim()}
                    className={`flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#3E4095]/20 transition-all flex items-center justify-center cursor-pointer ${
                      isImporting 
                        ? 'bg-[#3E4095]/50 text-white cursor-wait' 
                        : 'bg-[#3E4095] hover:bg-[#2d2f6e] text-white hover:-translate-y-1 active:translate-y-0'
                    }`}
                  >
                    {isImporting ? (
                      <>
                        <i className="fas fa-circle-notch animate-spin mr-3 text-lg"></i>
                        Processing with AI...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-bolt mr-2 text-amber-300"></i>
                        Process and Import
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Standard Editor View */}
          {!showImportView && (
            <div className="p-10 pb-32 space-y-16 max-w-6xl mx-auto">
              
              {/* Question Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#3E4095] text-white font-black shadow-lg shadow-[#3E4095]/20">1</div>
                        <div>
                            <h3 className="text-base font-black text-gray-800 tracking-tight">Question</h3>
                            <p className="text-[10px] text-gray-400 font-bold tracking-widest">Format math problem</p>
                        </div>
                    </div>
                    {form.formState.errors.text && (
                        <span className="text-[10px] bg-red-50 text-red-500 px-3 py-1 rounded-full font-bold border border-red-100 animate-bounce">
                            {form.formState.errors.text.message}
                        </span>
                    )}
                </div>
                <div className="bg-white p-2 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <MathInput
                    label=""
                    isRequired
                    value={formData.questionText}
                    onChange={(val) => setFormData(prev => ({ ...prev, questionText: val }))}
                    placeholder="Describe here. Use Editor for complex equations, copy-paste the LaTeX here and continue."
                    minHeight="h-40"
                    />
                </div>
              </section>

              {/* Options Section */}
              <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#3E4095] text-white font-black shadow-lg shadow-[#3E4095]/20">2</div>
                        <div>
                            <h3 className="text-base font-black text-gray-800 tracking-tight">Answers</h3>
                            {/* <p className="text-[10px] text-gray-400 font-bold tracking-widest">Select the correct solution</p> */}
                        </div>
                    </div>
                    {form.formState.errors.correct_answer && (
                        <span className="text-[10px] bg-red-50 text-red-500 px-3 py-1 rounded-full font-bold border border-red-100">
                            Please select a correct answer
                        </span>
                    )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {formData.options.map((option) => (
                    <div key={option.id} className={`relative p-8 rounded-[2.5rem] border-2 transition-all group ${correctOptionId === option.id ? 'bg-[#3E4095]/5 border-[#3E4095]/30 ring-4 ring-[#3E4095]/5 shadow-xl' : 'bg-white border-gray-50 hover:border-gray-200 hover:shadow-lg'}`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 flex items-center justify-center text-xs font-black text-[#3E4095] bg-[#3E4095]/10 rounded-xl">{option.label.split(' ')[1]}</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Option</span>
                        </div>
                        <button 
                            onClick={() => handleSetCorrectOption(option.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                correctOptionId === option.id 
                                ? 'bg-[#3E4095] text-white shadow-lg' 
                                : 'bg-gray-50 text-gray-400 hover:text-[#3E4095] hover:bg-white'
                            }`}
                        >
                            <i className={`fas ${correctOptionId === option.id ? 'fa-check-circle' : 'fa-circle'}`}></i>
                            <span>{correctOptionId === option.id ? 'CORRECT ANSWER' : 'MARK AS CORRECT'}</span>
                        </button>
                      </div>
                      <MathInput
                        label=""
                        isRequired
                        value={option.text}
                        onChange={(val) => handleUpdateOption(option.id, 'text', val)}
                        placeholder="Option text or equation"
                        minHeight="h-24"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Metadata Section */}
              <section className="pt-10 border-t border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm space-y-6 md:space-y-0">
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Question Difficulty</h3>
                    {/* <p className="text-[10px] text-gray-400 font-medium leading-relaxed">Categorize this question for personalized student assessments</p> */}
                  </div>
                  <div className="flex justify-between p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                    {DIFFICULTY_OPTIONS.map(diff => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, difficulty: diff as Difficulty }))}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase ${
                          formData.difficulty === diff 
                          ? 'text-white bg-[#3E4095] shadow-md ring-1 ring-gray-100' 
                          : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!showImportView && (
          <div className="px-10 py-8 bg-white/80 border-t border-gray-100 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 sticky bottom-0 z-30 backdrop-blur-xl">
            <button 
                onClick={handleClose} 
                className="px-10 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 hover:text-gray-600 transition-all cursor-pointer"
            >
              Discard Changes
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => {
                        setFormData(initialFormData);
                        setCorrectOptionId('');
                        form.reset();
                    }}
                    className="px-6 py-4 text-gray-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                    Clear All
                </button>
                <div className="flex flex-col items-end">
                  {!correctOptionId && formData.questionText && (
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest animate-pulse mb-1">
                      Mark an option as correct
                    </span>
                  )}
                  <button 
                  onClick={handleSubmit}
                  disabled={isPending || !formData.questionText || !correctOptionId}
                  className={`px-16 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all flex items-center justify-center cursor-pointer ${
                      isPending || !formData.questionText || !correctOptionId
                      ? 'bg-[#3E4095]/30 cursor-not-allowed text-white' 
                      : 'bg-[#3E4095] hover:bg-[#2d2f6e] text-white hover:-translate-y-1 hover:shadow-[#3E4095]/30 active:translate-y-0'
                  }`}
                  >
                  {isPending ? (
                      <>
                      <i className="fas fa-circle-notch animate-spin mr-3 text-lg"></i>
                      Publishing...
                      </>
                  ) : (
                      <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Add Question
                      </>
                  )}
                  </button>
                </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </AppDialog>
  )
}


