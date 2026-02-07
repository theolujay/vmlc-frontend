'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MATH_CATEGORIES } from '@/constants/math';
import type { MathfieldElement } from 'mathlive';

interface MathFieldEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

const MathFieldEditor: React.FC<MathFieldEditorProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
  error,
}) => {
  const mfRef = useRef<MathfieldElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof typeof MATH_CATEGORIES>('Basic');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize MathLive
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('mathlive').then((mathlive) => {
        // Configure font directory to use a reliable CDN
        // This fixes issues with Next.js/Turbopack font path resolution
        if (mathlive.MathfieldElement) {
          mathlive.MathfieldElement.fontsDirectory = 'https://unpkg.com/mathlive/dist/fonts';
        }
        setIsLoaded(true);
      });
    }
  }, []);

  // Configure MathField once it's loaded
  useEffect(() => {
    if (isLoaded && mfRef.current) {
      const mf = mfRef.current;
      
      // Basic configuration
      mf.mathVirtualKeyboardPolicy = "manual";
      mf.smartFence = true;
      
      // Set initial value
      if (mf.value !== value) {
        mf.value = value;
      }

      // Handle input events
      const handleInput = (ev: Event) => {
        const target = ev.target as MathfieldElement;
        onChange(target.value);
      };

      mf.addEventListener('input', handleInput);
      
      return () => {
        mf.removeEventListener('input', handleInput);
      };
    }
    // Only run when isLoaded changes to avoid resetting during typing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Sync value from outside ONLY if it's different (e.g. from Clear All or AI fix)
  useEffect(() => {
    if (mfRef.current && isLoaded && mfRef.current.value !== value) {
      mfRef.current.value = value;
    }
  }, [value, isLoaded]);

  const insertLatex = (latex: string) => {
    if (mfRef.current) {
      mfRef.current.insert(latex);
      mfRef.current.focus();
    }
  };

  const handleCopy = () => {
    if (!value) return;
    const textToCopy = `$ ${value} $`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeCommand = (command: any) => {
    if (mfRef.current) {
      mfRef.current.executeCommand(command);
      mfRef.current.focus();
    }
  };

  const shortcuts = [
    { key: 'Ctrl+Z', action: 'Undo' },
    { key: 'Ctrl+Y', action: 'Redo' },
    { key: '/', action: 'Fraction' },
    { key: '^', action: 'Exponent' },
    { key: '_', action: 'Subscript' },
    { key: 'Alt+S', action: 'Square Root' },
  ];

  return (
    <div className={`flex flex-col border rounded-xl overflow-hidden transition-all bg-white ${
      error ? 'border-red-300 ring-2 ring-red-50 ring-offset-0' : 'border-gray-200 focus-within:ring-2 focus-within:ring-[#3E4095]/20 focus-within:border-[#3E4095]'
    } ${className}`}>
      {!isLoaded ? (
        <div className="flex flex-col items-center justify-center h-48 bg-gray-50/50">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-[#3E4095]/10 border-t-[#3E4095] rounded-full animate-spin"></div>
            <i className="fas fa-pi absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#3E4095] text-xs"></i>
          </div>
          <span className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Initializing Math Engine...</span>
        </div>
      ) : (
        <>
          {/* Enhanced Toolbar */}
          <div className="bg-white border-b border-gray-100">
            <div className="flex border-b border-gray-50 overflow-x-auto no-scrollbar scroll-smooth">
              {(Object.keys(MATH_CATEGORIES) as Array<keyof typeof MATH_CATEGORIES>).map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap relative ${
                    activeTab === cat ? 'text-[#3E4095]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {cat}
                  {activeTab === cat && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3E4095] animate-in fade-in slide-in-from-bottom-1"></div>
                  )}
                </button>
              ))}
              <div className="flex-1"></div>
              <div className="flex items-center px-3 space-x-1 border-l border-gray-50">
                <button
                  type="button"
                  onClick={() => setShowShortcuts(!showShortcuts)}
                  className={`p-2 rounded-lg transition-colors ${showShortcuts ? 'bg-[#3E4095]/10 text-[#3E4095]' : 'text-gray-400 hover:text-[#3E4095]'}`}
                  title="Keyboard Shortcuts"
                >
                  <i className="fas fa-keyboard text-xs"></i>
                </button>
                <div className="w-px h-4 bg-gray-100 mx-1"></div>
                <button
                  type="button"
                  onClick={() => executeCommand('undo')}
                  className="p-2 text-gray-400 hover:text-[#3E4095] hover:bg-gray-50 rounded-lg transition-all"
                  title="Undo (Ctrl+Z)"
                >
                  <i className="fas fa-undo text-xs"></i>
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand('redo')}
                  className="p-2 text-gray-400 hover:text-[#3E4095] hover:bg-gray-50 rounded-lg transition-all"
                  title="Redo (Ctrl+Y)"
                >
                  <i className="fas fa-redo text-xs"></i>
                </button>
              </div>
            </div>

            {showShortcuts && (
              <div className="p-3 bg-gray-50 border-b border-gray-100 grid grid-cols-3 gap-2 animate-in slide-in-from-top-2 duration-200">
                {shortcuts.map(s => (
                  <div key={s.key} className="flex items-center justify-between px-2 py-1 bg-white rounded border border-gray-200 shadow-sm">
                    <span className="text-[9px] text-gray-400 font-medium uppercase">{s.action}</span>
                    <kbd className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded font-mono font-bold text-gray-600">{s.key}</kbd>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 p-3 bg-white/50">
              {MATH_CATEGORIES[activeTab].map((symbol) => (
                <button
                  type="button"
                  key={symbol.label}
                  onClick={() => insertLatex(symbol.latex)}
                  className="group relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#3E4095] text-lg text-gray-600 hover:text-white transition-all border border-gray-50 hover:border-[#3E4095] hover:shadow-lg hover:shadow-[#3E4095]/20 active:scale-95"
                >
                  <span className="font-serif">{symbol.icon}</span>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {symbol.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* MathLive Field */}
          <div className="relative p-6 min-h-[140px] flex items-center bg-white">
            {typeof window !== 'undefined' && isLoaded && (
              /* @ts-expect-error: math-field is a custom Web Component not recognized by JSX intrinsic elements */
              <math-field
                ref={mfRef}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1.5rem',
                  background: 'transparent',
                  '--caret-color': '#3E4095',
                  '--selection-background-color': 'rgba(62, 64, 149, 0.2)',
                  '--text-color': '#1f2937',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any}
              >
                {value}
              {/* @ts-expect-error: math-field is a custom Web Component not recognized by JSX intrinsic elements */}
              </math-field>
            )}
            
            {!value && (
              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-gray-300 text-sm font-medium italic">{placeholder || 'Start typing math here...'}</span>
              </div>
            )}
          </div>
          
          {/* Footer Info & Copy Actions */}
          <div className="bg-gray-50 border-t border-gray-100">
            {value && (
              <div className="p-3 border-b border-gray-100 bg-white">
                <div className="flex items-center justify-between gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg group hover:border-[#3E4095]/30 transition-colors">
                  <div className="flex-1 min-w-0 flex items-center space-x-2 overflow-hidden">
                    <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0">LaTeX:</span>
                    <code className="text-xs font-mono text-gray-700 truncate select-all">{`$ ${value} $`}</code>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                      isCopied 
                        ? 'bg-green-50 text-green-600 border border-green-200' 
                        : 'bg-white text-gray-500 border border-gray-200 hover:text-[#3E4095] hover:border-[#3E4095] hover:shadow-sm active:scale-95'
                    }`}
                  >
                    <i className={`fas ${isCopied ? 'fa-check' : 'fa-copy'}`}></i>
                    <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>
            )}
            
            <div className="px-4 py-2 flex justify-between items-center">
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3E4095] animate-pulse"></div>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Visual Mode Active</span>
              </div>
              {error && (
                <span className="text-[9px] text-red-500 font-bold uppercase animate-pulse flex items-center space-x-1">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>{error}</span>
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MathFieldEditor;