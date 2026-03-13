import React from 'react';
import { formatTextWithLinks } from '@/utils/formatTextWithLinks';

interface InfoBoardProps {
  message?: string;
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'error' | 'info' | 'success';
}

const InfoBoard: React.FC<InfoBoardProps> = ({ message, onDismiss, actionLabel, onAction, type = 'info' }) => {
  if (!message) return null;

  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      accent: 'text-red-600',
      iconBg: 'bg-red-100',
      button: 'bg-red-600 hover:bg-red-700',
      title: 'Warning'
    },
    info: {
      bg: 'bg-green-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      accent: 'text-emerald-700',
      iconBg: 'bg-emerald-500/8',
      button: 'bg-emerald-500 hover:bg-emerald-500/15',
      title: 'Important Update'
    },
    success: {
      bg: 'bg-[#3E4095]/5',
      border: 'border-[#3E4095]/20',
      text: 'text-[#3E4095]',
      accent: 'text-[#3E4095]',
      iconBg: 'bg-[#3E4095]/15',
      button: 'bg-green-600 hover:bg-green-700',
      title: 'Success'
    }
  }[type];

  const formattedMessage = formatTextWithLinks(message);

  return (
    <section className={`${styles.bg} border ${styles.border} rounded-[24px] p-4 flex items-start gap-4 animate-in fade-in duration-500 mb-6`}>
      {/* Icon Container */}
      <div className={`${styles.iconBg} rounded-full p-1.5 mt-2 shrink-0`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 ${styles.accent}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {type === 'success' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          )}
        </svg>
      </div>

      <div className="flex-1">
        <h3 className={`${styles.accent} font-bold text-sm`}>{styles.title}</h3>
        <p className={`${styles.text} text-sm mt-0.5`}>
          {formattedMessage.map((node, i) => (
            typeof node === 'string' ? (
              <span key={i}>{node}</span>
            ) : (
              <a 
                key={i} 
                href={node.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline font-bold hover:opacity-80"
              >
                {node.text}
              </a>
            )
          ))}
        </p>
        
        {actionLabel && onAction && (
          <button 
            onClick={onAction}
            className={`mt-3 text-xs font-bold text-white ${styles.button} px-4 py-2 rounded-lg transition-colors`}
          >
            {actionLabel}
          </button>
        )}
      </div>

      {/* Dismiss Button */}
      <button 
        onClick={onDismiss}
        className={`${styles.accent} hover:opacity-70 p-1 transition-colors`}
        aria-label="Dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </section>
  );
};

export default InfoBoard;