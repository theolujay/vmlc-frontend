import React, { useState, useRef } from 'react';
import { MATH_CATEGORIES } from '@/constants/math';
import { formatMathText } from '@/services/gemini.service';
import MathPreview from './MathPreview';

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
  const [activeTab, setActiveTab] = useState<keyof typeof MATH_CATEGORIES>('Basic');
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertSymbol = (latex: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newText = value.substring(0, start) + `$${latex}$` + value.substring(end);
    onChange(newText);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start + 1, start + 1 + latex.length);
    }, 0);
  };

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
    <div className="flex flex-col space-y-2 mb-4 relative">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {label} {isRequired && <span className="text-red-400">*</span>}
        </label>
        
        <button 
          onClick={handleSmartFormatAll}
          disabled={isFormatting || !value}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border ${
            isFormatting 
            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-[#3E4095]/5 border-[#3E4095]/20 text-[#3E4095] hover:bg-[#3E4095] hover:text-white hover:shadow-md active:scale-95'
          }`}
          type="button"
        >
          <i className={`fas fa-sparkles ${isFormatting ? 'animate-spin' : ''}`}></i>
          <span>{isFormatting ? 'FIXING...' : 'AI AUTO-FIX'}</span>
        </button>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#3E4095]/20 focus-within:border-[#3E4095] transition-all shadow-sm bg-white">
        {/* Categorized Toolbar */}
        <div className="bg-[#F7F9FC]/80 border-b border-gray-100">
          <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
            {(Object.keys(MATH_CATEGORIES) as Array<keyof typeof MATH_CATEGORIES>).map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-tighter transition-all whitespace-nowrap ${
                  activeTab === cat ? 'text-[#3E4095] border-b-2 border-[#3E4095] bg-white' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 p-2">
            {MATH_CATEGORIES[activeTab].map((symbol) => (
              <button
                type="button"
                key={symbol.label}
                onClick={() => insertSymbol(symbol.latex)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-base text-gray-600 hover:text-[#3E4095] transition-all border border-transparent hover:border-gray-100"
                title={symbol.label}
              >
                <span className="font-serif">{symbol.icon}</span>
              </button>
            ))}
          </div>
        </div>

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
          className={`w-full p-4 text-sm focus:outline-none resize-y ${minHeight} font-mono leading-relaxed placeholder:text-gray-300 text-black`}
        />

        {/* Floating Selection Tooltip */}
        {selection && selection.start !== selection.end && (
          <div 
            className="absolute z-20 bg-[#101928] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-xl animate-in fade-in slide-in-from-bottom-2 flex items-center space-x-2"
            style={{ 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)' 
            }}
          >
            <i className="fas fa-wand-magic-sparkles text-[#3E4095]"></i>
            <span>Fix highlighted math?</span>
            <button 
              onClick={handleSelectionFormatting}
              className="bg-[#3E4095] hover:bg-[#2d2f6e] px-2 py-0.5 rounded transition-colors"
              type="button"
            >
              YES
            </button>
            <button 
              onClick={() => setSelection(null)}
              className="text-gray-400 hover:text-white"
              type="button"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Formatted Preview</span>
          <MathPreview content={value} className="bg-[#3E4095]/5 border-[#3E4095]/10" />
        </div>
      </div>
    </div>
  );
};

export default MathInput;
