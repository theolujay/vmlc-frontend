'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { formatMathText } from '@/services/gemini.service';
import MathPreview from './MathPreview';

const MathFieldEditor = dynamic(() => import('@/components/MathFieldEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-48 bg-gray-50/50 border border-gray-200 rounded-xl">
      <div className="w-8 h-8 border-4 border-[#3E4095]/10 border-t-[#3E4095] rounded-full animate-spin"></div>
      <span className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Loading Math Editor...</span>
    </div>
  ),
});

interface MathInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  isRequired?: boolean;
  minHeight?: string;
}

const MathInput: React.FC<MathInputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  isRequired = false,
  minHeight = "h-24"
}) => {
  const [isFormatting, setIsFormatting] = useState(false);
  const [mode, setMode] = useState<'editor' | 'content'>('content');
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const [scratchpadValue, setScratchpadValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelectionFormatting = async () => {
    if (!selection || selection.start === selection.end) return;
    setIsFormatting(true);
    const selectedText = value.substring(selection.start, selection.end);
    const formatted = await formatMathText(selectedText);
    const newText = value.substring(0, selection.start) + formatted + value.substring(selection.end);
    onChange(newText);
    setIsFormatting(false);
    setSelection(null);
  };

  const handleSmartFormatAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!value) return;
    setIsFormatting(true);
    const formatted = await formatMathText(value);
    onChange(formatted);
    setIsFormatting(false);
  };

  return (
    <div className="flex flex-col space-y-3 mb-4 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            {label} {isRequired && <span className="text-red-400">*</span>}
          </label>
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setMode('content')}
              className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${
                mode === 'content' ? 'bg-white text-[#3E4095] shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <i className="fas fa-book mr-1"></i> Content
            </button>
            <button
              type="button"
              onClick={() => setMode('editor')}
              className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${
                mode === 'editor' ? 'bg-white text-[#3E4095] shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <i className="fas fa-gear mr-1"></i> Editor
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleSmartFormatAll}
          disabled={isFormatting || !value}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
            isFormatting 
            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-[#3E4095]/5 border-[#3E4095]/20 text-[#3E4095] hover:bg-[#3E4095] hover:text-white hover:shadow-lg active:scale-95'
          }`}
          type="button"
        >
          <i className={`fas fa-wand-magic-sparkles ${isFormatting ? 'animate-spin' : ''}`}></i>
          <span>{isFormatting ? 'FIXING...' : 'AI AUTO-FIX'}</span>
        </button>
      </div>

      {mode === 'content' ? (
        <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#3E4095]/20 focus-within:border-[#3E4095] transition-all shadow-sm bg-white relative">
          <textarea
            ref={textareaRef}
            value={value}
            onSelect={() => {
              if (textareaRef.current) {
                setSelection({
                  start: textareaRef.current.selectionStart,
                  end: textareaRef.current.selectionEnd
                });
              }
            }}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-5 text-sm focus:outline-none resize-y ${minHeight} font-mono leading-relaxed placeholder:text-gray-300 text-black`}
          />

          {/* Floating Selection Tooltip */}
          {selection && selection.start !== selection.end && (
            <div 
              className="absolute z-20 bg-[#101928] text-white px-4 py-2 rounded-xl text-[10px] font-bold shadow-2xl animate-in fade-in zoom-in duration-200 flex items-center space-x-3"
              style={{ 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span>Fix highlighted math?</span>
              </div>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={handleSelectionFormatting}
                  className="bg-[#3E4095] hover:bg-[#2d2f6e] px-3 py-1 rounded-lg transition-all active:scale-95"
                  type="button"
                >
                  YES, FIX IT
                </button>
                <button 
                  onClick={() => setSelection(null)}
                  className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  type="button"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-gray-50 rounded text-[8px] font-bold text-gray-400 border border-gray-100 pointer-events-none">
            LATEX MODE
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <MathFieldEditor 
            value={scratchpadValue} 
            onChange={setScratchpadValue} 
            placeholder="Build equation here, then use the button below to insert it..." 
          />
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                if (scratchpadValue) {
                  const toInsert = `$${scratchpadValue}$`;
                  onChange(value ? `${value} ${toInsert}` : toInsert);
                  setScratchpadValue('');
                  setMode('content');
                }
              }}
              disabled={!scratchpadValue}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                scratchpadValue 
                ? 'bg-[#3E4095] text-white shadow-lg hover:shadow-[#3E4095]/20 hover:-translate-y-0.5' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <i className="fas fa-plus-circle"></i>
              <span>Insert Equation into Content</span>
            </button>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Preview</span>
            <div className="h-px w-12 bg-gray-100"></div>
          </div>
          
          {/* Hint for missing delimiters in content mode */}
          {mode === 'content' && value && !value.includes('$') && (value.includes('\\') || value.includes('^') || value.includes('_')) && (
            <div className="flex items-center space-x-1.5 text-[8px] text-amber-500 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
              <i className="fas fa-lightbulb"></i>
              <span>Pro-tip: Wrap math in $ ... $ to render it</span>
            </div>
          )}
        </div>
        <MathPreview 
          content={mode === 'editor' && scratchpadValue ? `$${scratchpadValue}$` : (value || "_No content preview available_")} 
          className="bg-white border-gray-100 shadow-sm" 
        />
      </div>
    </div>
  );
};

export default MathInput;