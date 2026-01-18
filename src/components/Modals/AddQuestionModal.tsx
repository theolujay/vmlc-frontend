import React, { useState } from "react"
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
  function handleClose() {
    close(!open)
  }

  const { onSubmit, isPending, form } = useCreateQuestion(handleClose)

  // Local state for the rich UI
  const [formData, setFormData] = useState<QuestionData>({
    questionText: '',
    options: [
      { id: '1', label: 'Option A', text: '', type: 'wrong' },
      { id: '2', label: 'Option B', text: '', type: 'wrong' },
      { id: '3', label: 'Option C', text: '', type: 'wrong' },
      { id: '4', label: 'Option D', text: '', type: 'wrong' },
    ],
    difficulty: Difficulty.EASY,
  });

  const [correctOptionId, setCorrectOptionId] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);
  const [showImportView, setShowImportView] = useState(false);
  const [bulkText, setBulkText] = useState('');

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
      
      // Validate we have at least 4 options
      if (!parsed.options || parsed.options.length < 4) {
        throw new Error(
          `Import requires exactly 4 options. Found ${parsed.options?.length || 0}.`
        );
      }
      
      // Ensure all options have the required structure
      const normalizedOptions = parsed.options.slice(0, 4).map((opt, idx) => ({
        id: String(idx + 1),
        label: `Option ${String.fromCharCode(65 + idx)}`, // A, B, C, D
        text: opt.text || '',
        type: opt.type || 'wrong'
      }));
      
      setFormData(prev => ({
        ...prev,
        questionText: parsed.questionText || prev.questionText,
        options: normalizedOptions,
        difficulty: parsed.difficulty || prev.difficulty
      }));
      
      // Reset correct option selection since we have new options
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
    // Map local state to the hook's expected format
    const payload = {
      text: formData.questionText,
      option_a: formData.options[0]?.text || '',
      option_b: formData.options[1]?.text || '',
      option_c: formData.options[2]?.text || '',
      option_d: formData.options[3]?.text || '',
      correct_answer: formData.options.find(o => o.id === correctOptionId) ? (['A','B','C','D'][parseInt(correctOptionId)-1]) : '',
      difficulty: formData.difficulty.toLowerCase(),
    };
    
    // Validate manually or let the hook handle it? 
    // The hook uses react-hook-form's handleSubmit which validates against schema.
    // So we should set values in the form and then submit.
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
      <div className="flex flex-col bg-[#F7F9FC] w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] h-[85vh] rounded-2xl overflow-hidden shadow-2xl relative font-sans">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Add New Question</h1>
            <p className="text-xs text-gray-400 font-medium">Create beautiful math questions with AI assistance</p>
          </div>
          <div className="flex space-x-3">
             <button 
              onClick={() => setShowImportView(!showImportView)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase ${
                showImportView 
                ? 'bg-gray-800 text-white' 
                : 'bg-[#3E4095]/10 text-[#3E4095] hover:bg-[#3E4095]/20'
              }`}
            >
              <i className={`fas ${showImportView ? 'fa-edit' : 'fa-file-import'}`}></i>
              <span>{showImportView ? 'SWITCH TO EDITOR' : 'BULK IMPORT'}</span>
            </button>
            <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#F7F9FC]">
          
          {/* Bulk Import View Overlay */}
          {showImportView && (
            <div className="p-8 bg-white h-full animate-in slide-in-from-top-4 duration-300">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#3E4095]/10 text-[#3E4095] mb-2">
                    <i className="fas fa-wand-magic-sparkles text-xl"></i>
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">AI Import</h2>
                  <p className="text-sm text-gray-500">
                    Paste your question and its options from any source (PDF, Word, text) and we&apos;ll automatically format the math and structure the fields.
                  </p>
                </div>
                
                <textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="Paste question and options here... e.g. What is the derivative of f(x) = x^2? A) 2x B) x C) 2 D) 0"
                  className="w-full h-64 p-6 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#3E4095]/20 focus:border-[#3E4095] outline-none transition-all font-mono leading-relaxed text-black"
                />

                <div className="flex space-x-4">
                  <button 
                    onClick={() => setShowImportView(false)}
                    className="flex-1 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-50 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleBulkImport}
                    disabled={isImporting || !bulkText.trim()}
                    className={`flex-[2] py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-all flex items-center justify-center cursor-pointer ${
                      isImporting 
                        ? 'bg-[#3E4095]/50 text-white cursor-wait' 
                        : 'bg-[#3E4095] hover:bg-[#2d2f6e] text-white hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                  >
                    {isImporting ? (
                      <>
                        <i className="fas fa-circle-notch animate-spin mr-3 text-lg"></i>
                        Analyzing & Formatting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-bolt mr-2"></i>
                        Import
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Standard Editor View */}
          {!showImportView && (
            <div className="p-8 space-y-10 max-w-5xl mx-auto">
              
              {/* Question Section */}
              <section>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3E4095] text-white font-bold text-xs">1</div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Question Body</h3>
                </div>
                <MathInput
                  label="What's the problem?"
                  isRequired
                  value={formData.questionText}
                  onChange={(val) => setFormData(prev => ({ ...prev, questionText: val }))}
                  placeholder="Enter question text. Use AI Auto-Fix to format messy math."
                />
              </section>

              {/* Options Section */}
              <section>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3E4095] text-white font-bold text-xs">2</div>
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Answer Options</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {formData.options.map((option) => (
                    <div key={option.id} className={`relative p-5 rounded-2xl border transition-all group ${correctOptionId === option.id ? 'bg-[#3E4095]/5 border-[#3E4095]/30 ring-2 ring-[#3E4095]/20' : 'bg-white border-gray-100 hover:shadow-xl hover:border-[#3E4095]/20'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-[#3E4095] bg-[#3E4095]/10 px-2 py-1 rounded">{option.label}</span>
                        <div className="flex items-center space-x-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase cursor-pointer flex items-center space-x-2">
                                <input 
                                    type="radio" 
                                    name="correctOption"
                                    checked={correctOptionId === option.id}
                                    onChange={() => handleSetCorrectOption(option.id)}
                                    className="w-4 h-4 text-[#3E4095] focus:ring-[#3E4095] border-gray-300"
                                />
                                <span className={correctOptionId === option.id ? 'text-[#3E4095]' : ''}>Correct Answer</span>
                            </label>
                        </div>
                      </div>
                      <MathInput
                        label=""
                        isRequired
                        value={option.text}
                        onChange={(val) => handleUpdateOption(option.id, 'text', val)}
                        placeholder="Enter option content"
                        minHeight="h-20"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* Metadata Section */}
              <section className="pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Target Difficulty</h3>
                    <p className="text-[10px] text-gray-400">Help students find the right challenge level</p>
                  </div>
                  <div className="flex space-x-2">
                    {DIFFICULTY_OPTIONS.map(diff => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, difficulty: diff as Difficulty }))}
                        className={`px-6 py-2 rounded-xl text-xs font-bold transition-all uppercase ${
                          formData.difficulty === diff 
                          ? 'bg-[#3E4095] text-white shadow-lg shadow-[#3E4095]/20' 
                          : 'bg-white border border-gray-200 text-gray-400 hover:border-[#3E4095]/50 hover:text-[#3E4095]'
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
          <div className="px-8 py-6 bg-[#F7F9FC]/90 border-t border-gray-200 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 sticky bottom-0 z-30 backdrop-blur-sm">
            <button onClick={handleClose} className="px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-all cursor-pointer">
              Cancel
            </button>
            <div className="flex-1"></div>
            <button 
              onClick={handleSubmit}
              disabled={isPending || !formData.questionText || !correctOptionId}
              className={`px-12 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-xl transition-all flex items-center justify-center cursor-pointer ${
                isPending || !formData.questionText || !correctOptionId
                  ? 'bg-[#3E4095]/50 cursor-not-allowed text-white' 
                  : 'bg-[#3E4095] hover:bg-[#2d2f6e] text-white hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isPending ? (
                <>
                  <i className="fas fa-circle-notch animate-spin mr-3"></i>
                  Saving...
                </>
              ) : (
                'Publish Question'
              )}
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
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

