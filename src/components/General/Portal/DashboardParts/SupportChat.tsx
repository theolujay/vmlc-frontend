import React, { useState, useEffect, useRef } from 'react';
import useSendSupportMessage from '@/hooks/useSendSupportMessage';
import useGetSupportThread from '@/hooks/useGetSupportThread';
import useSupportSocket from '@/hooks/useSupportSocket';
import { SupportMessageType } from '@/types/SupportType';
import Image from "next/image";

interface SupportChatProps {
  currentStage: string;
  onClose: () => void;
  candidateName: string;
}

const SupportChat: React.FC<SupportChatProps> = ({ currentStage, onClose, candidateName }) => {
  const [message, setMessage] = useState('');
  const { thread, messages, loading: loadingMessages, setMessages } = useGetSupportThread();
  const { sendMessage, loading: sending } = useSendSupportMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const onMessageReceived = React.useCallback((newMsg: SupportMessageType) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });
  }, [setMessages]);

  const { connected, isTyping, sendTypingStatus } = useSupportSocket(
    thread?.id || null,
    onMessageReceived
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !thread?.id || sending) return;

    const textToSend = message;
    setMessage('');
    sendTypingStatus(false);

    const sent = await sendMessage({
        text: textToSend,
        thread_id: thread.id
    });

    if (sent) {
        // Message will be added via WebSocket callback or here if WebSocket is not yet connected
        setMessages((prev) => {
            if (prev.some((m) => m.id === sent.id)) return prev;
            return [...prev, sent];
        });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (e.target.value.trim().length > 0) {
        sendTypingStatus(true);
    } else {
        sendTypingStatus(false);
    }
  };

  // Check if any staff is typing
  const isStaffTyping = Object.values(isTyping).some(typing => typing);

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* HEADER */}
      <div className="bg-grey-100 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 relative">
            <Image
              src="/vmlc_logo.png"
              alt="System"
              width={40}
              height={40}
              className="w-full h-full object-cover bg-white"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#3E4095] tracking-tight">Verboheit Helpdesk</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`}></span>
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
        {messages.length === 0 && !loadingMessages && (
             <div className="flex flex-col items-start max-w-[85%]">
                <div className="bg-white p-3 rounded-[18px] rounded-tl-none shadow-sm border border-[#E4E7EC]">
                    <p className="text-xs text-[#475367] leading-relaxed">
                        Hiii <span className="font-bold text-[#101828]">{candidateName}</span>! How can we help you today?
                    </p>
                </div>
                <p className="text-[9px] font-bold text-[#98A2B3] mt-1 uppercase ml-1">System • Just now</p>
            </div>
        )}

        {/* Dynamic Messages */}
        {messages.map((msg) => {
            const isCandidate = msg.sender_type === 'candidate';
            const isSystem = msg.sender_type === 'system';

            return (
                <div key={msg.id} className={`flex flex-col ${isCandidate ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-1 duration-300`}>
                    <div className={`p-3 max-w-[90%] rounded-[18px] shadow-sm text-xs leading-relaxed ${
                        isCandidate
                        ? 'bg-[#3E4095] text-white rounded-tr-none'
                        : isSystem
                          ? 'bg-gray-100 text-[#475367] border border-[#E4E7EC] rounded-tl-none italic'
                          : 'bg-white text-[#475367] border border-[#E4E7EC] rounded-tl-none'
                    }`}>
                        <p>{msg.text}</p>
                    </div>
                    <p className="text-[9px] font-bold text-[#98A2B3] mt-1 uppercase mx-1">
                        {isCandidate ? 'You' : msg.sender_name} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            );
        })}

        {isStaffTyping && (
            <div className="flex flex-col items-start animate-pulse">
                <div className="bg-white p-2 px-4 rounded-full shadow-sm border border-[#E4E7EC]">
                    <div className="flex gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-[#E4E7EC] bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type your query..."
            className="flex-1 bg-[#F9FAFB] border border-[#E4E7EC] rounded-xl px-4 py-2.5 text-xs text-[#101828] focus:outline-none focus:border-[#3E4095] focus:ring-1 focus:ring-[#3E4095]/20 transition-all placeholder:text-[#98A2B3]"
          />
          <button
            type="submit"
            disabled={!message.trim() || sending || !thread}
            className={`p-2.5 rounded-xl shadow-md transition-all ${
                !message.trim() || sending || !thread
                ? 'bg-[#F0F2F5] text-[#98A2B3] cursor-not-allowed'
                : 'bg-grey-800 border border-[#3E4095] text-white hover:bg-[#3E4095] transform active:scale-95'
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
