import React, { useState } from 'react';
import { useCreateCowrywiseKidProfile } from '@/hooks/useCreateCowrywiseKidProfile';

interface CowrywiseKidModalProps {
  open: boolean;
  close: (open: boolean) => void;
}

const CowrywiseKidModal: React.FC<CowrywiseKidModalProps> = ({ open, close }) => {
  const [username, setUsername] = useState('');
  const { mutate, isPending } = useCreateCowrywiseKidProfile();

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    mutate(username, {
      onSuccess: () => {
        close(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#101828]">Link Cowrywise Kid Profile</h2>
            <button 
              onClick={() => close(false)}
              className="text-[#667185] hover:text-[#101828] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#344054] mb-1.5">
                Cowrywise Kid Username
              </label>
              <p className="text-xs text-[#667185] mb-3">
                Please type in your &apos;Cowrywise Kid&apos; username to be eligible for the League stage.
              </p>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-xl border border-[#D0D5DD] focus:ring-2 focus:ring-[#3E4095]/20 focus:border-[#3E4095] outline-none transition-all placeholder:text-[#98A2B3]"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => onClose(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-[#D0D5DD] text-[#344054] font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || !username.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-[#3E4095] text-white font-semibold hover:bg-[#3E4095]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Linking...
                  </>
                ) : (
                  'Link Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CowrywiseKidModal;
