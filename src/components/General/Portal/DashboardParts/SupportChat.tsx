import React, { useState, useEffect, useRef } from 'react';
import useSendSupportMessage from '@/hooks/useSendSupportMessage';
import useGetSupportMessages from '@/hooks/useGetSupportMessages';
import useListConversations from '@/hooks/useListConversations';
import { SupportMessageType } from '@/types/SupportType';
import Image from "next/image";

interface SupportChatProps {
  currentStage: string;
  onClose: () => void;
  candidateName: string;
}

const SupportChat: React.FC<SupportChatProps> = ({ currentStage, onClose, candidateName }) => {
  const [message, setMessage] = useState('');
  const { data: conversations } = useListConversations(1, {});
  const conversationId = conversations?.results?.[0]?.id.toString() || null;
  const { messages, addMessage, loading: loadingMessages } = useGetSupportMessages(conversationId);
  const { sendMessage, loading: sending } = useSendSupportMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !conversationId || sending) return;

    const tempMessage: SupportMessageType = {
        id: Date.now(),
        text: message,
        created_at: new Date().toISOString(),
        sender_profile: 'user'
    };

    const sent = await sendMessage({
        text: message,
        conversation_id: conversationId
    });

    if (sent) {
        addMessage(sent);
        setMessage('');
    } else {
        // Fallback for demo if API fails
        addMessage(tempMessage);
        setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* HEADER */}
      <div className="bg-grey-100 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 relative">
            <Image 
              src="/vmlc_logo.png" 
              alt="Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#3E4095] tracking-tight">Verboheit Support</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-[7px] font-bold text-black uppercase tracking-widest">{currentStage} Stage</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-[#3E4095] hover:bg-[#3E4095]/10 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* MESSAGES */}
      <div className="flex-1 p-4 bg-[#F9FAFB] overflow-y-auto space-y-4">
        {/* Welcome Message */}
        <div className="flex flex-col items-start max-w-[85%]">
            <div className="bg-white p-3 rounded-[18px] rounded-tl-none shadow-sm border border-[#E4E7EC]">
                <p className="text-xs text-[#475367] leading-relaxed">
                    Hiii <span className="font-bold text-[#101828]">{candidateName}</span>! How can we help you today?
                </p>
            </div>
            <p className="text-[9px] font-bold text-[#98A2B3] mt-1 uppercase ml-1">VMLC Team • Just now</p>
        </div>

        {/* Dynamic Messages */}
        {messages.map((msg) => {
            const isUser = msg.sender_profile === 'user';
            return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-1 duration-300`}>
                    <div className={`p-3 max-w-[90%] rounded-[18px] shadow-sm text-xs leading-relaxed ${
                        isUser 
                        ? 'bg-[#3E4095] text-white rounded-tr-none' 
                        : 'bg-white text-[#475367] border border-[#E4E7EC] rounded-tl-none'
                    }`}>
                        <p>{msg.text}</p>
                    </div>
                    <p className="text-[9px] font-bold text-[#98A2B3] mt-1 uppercase mx-1">
                        {isUser ? 'You' : 'Staff'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-[#E4E7EC] bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your query..."
            className="flex-1 bg-[#F9FAFB] border border-[#E4E7EC] rounded-xl px-4 py-2.5 text-xs text-[#101828] focus:outline-none focus:border-[#01ACEA] focus:ring-1 focus:ring-[#01ACEA]/20 transition-all placeholder:text-[#98A2B3]"
          />
          <button 
            type="submit"
            disabled={!message.trim() || sending}
            className={`p-2.5 rounded-xl shadow-md transition-all ${
                !message.trim() || sending 
                ? 'bg-[#F0F2F5] text-[#98A2B3] cursor-not-allowed' 
                : 'bg-[#01ACEA] text-white hover:bg-[#008DBD] transform active:scale-95'
            }`}
          >
            {sending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportChat;
