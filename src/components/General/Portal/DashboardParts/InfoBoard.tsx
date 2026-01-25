import React from 'react';

interface InfoBoardProps {
  message?: string;
  onDismiss: () => void;
}

const InfoBoard: React.FC<InfoBoardProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <section className="bg-[#E7F6EC] border border-[#099137]/20 rounded-[24px] p-4 flex items-start gap-4 animate-in fade-in duration-500 mb-6">
      <div className="bg-[#099137] rounded-full p-1.5 mt-0.5 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-[#099137] font-bold text-sm">Important Update</h3>
        <p className="text-[#475367] text-sm mt-0.5">{message}</p>
      </div>
      <button 
        onClick={onDismiss}
        className="text-[#099137] hover:text-[#3E4095] p-1 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </section>
  );
};

export default InfoBoard;
