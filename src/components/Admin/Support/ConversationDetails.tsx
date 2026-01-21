'use client';
import Button from '@/components/ui/Button';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import { useAuth } from '@/contexts/AuthProvider';
import useGetSupportMessages from '@/hooks/useGetSupportMessages';
import useSendSupportMessage from '@/hooks/useSendSupportMessage';
import { SupportMessageType } from '@/types/SupportType';
import { formatDate } from '@/utils/formatFileSize';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ConversationDetails() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const conversationId = searchParams.get('id');
    const userName = searchParams.get('user_name');
    const { authState } = useAuth();
    const { messages, loading: messagesLoading, setMessages } = useGetSupportMessages(conversationId);
    const { sendMessage, loading: sendingLoading } = useSendSupportMessage();
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !conversationId || !authState?.user) return;

        const tempId = `temp-${Date.now()}`;
        const optimisticMessage: SupportMessageType = {
            id: tempId,
            conversation: conversationId,
            content: newMessage,
            timestamp: new Date().toISOString(),
            is_read: true,
            is_staff: true,
            sender: {
                id: authState.user.id,
                name: `${authState.user.first_name} ${authState.user.last_name}`,
                email: authState.user.email,
            }
        };

        setMessages((prev) => [...prev, optimisticMessage]);
        setNewMessage('');

        const payload = {
            content: newMessage,
            conversation_id: conversationId,
        };
        
        const sentMessage = await sendMessage(payload);
        if (sentMessage) {
            setMessages((prev) => prev.map(msg => msg.id === tempId ? sentMessage : msg));
        } else {
            // If failed, we could mark it as failed or remove it. 
            // For now, let's just remove it to keep it simple.
            setMessages((prev) => prev.filter(msg => msg.id !== tempId));
            // Restore the message in the input so the user can try again
            setNewMessage(newMessage);
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (!conversationId) return (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Invalid Conversation ID</p>
            <button onClick={handleBack} className="mt-2 text-[#3E4095] font-bold underline">Go Back</button>
        </div>
    );

    return (
        <div className="flex flex-col gap-1 h-[calc(100vh-140px)]">
             <div className="flex items-center justify-between mb-4">
                <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-medium">Back to Conversations</span>
                </button>
                {userName && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">Conversation with</span>
                        <span className="font-bold text-[#3E4095] bg-[#3E4095]/10 px-3 py-1 rounded-full">{userName}</span>
                    </div>
                )}
            </div>

            <ResponsiveContainer className="flex-1 flex flex-col p-0 overflow-hidden bg-white shadow-lg border border-gray-200 rounded-xl">
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#F9FAFB]">
                    {messagesLoading && messages.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                           <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3E4095]"></div>
                                <span className="text-sm text-gray-500 animate-pulse">Loading messages...</span>
                           </div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <p className="font-medium">No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${
                                        msg.is_staff 
                                        ? 'self-end items-end' 
                                        : 'self-start items-start'
                                    }`}
                                >
                                    <div className={`flex items-end gap-2 ${msg.is_staff ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                                            msg.is_staff ? 'bg-[#3E4095] text-white' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {(msg.sender?.name || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div
                                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                                                msg.is_staff
                                                    ? 'bg-[#3E4095] text-white rounded-br-none'
                                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 px-10">
                                        {formatDate(new Date(msg.timestamp))}
                                    </span>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-3 items-end max-w-4xl mx-auto">
                        <div className="flex-1 relative">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write your reply..."
                                className="w-full p-4 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3E4095]/20 focus:border-[#3E4095] transition-all resize-none min-h-[56px] max-h-[150px] text-sm scrollbar-hide"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                rows={1}
                                style={{ height: 'auto' }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = `${target.scrollHeight}px`;
                                }}
                            />
                        </div>
                        <Button
                            onClick={handleSend}
                            isPending={sendingLoading}
                            disabled={!newMessage.trim() || sendingLoading}
                            className="rounded-2xl h-[56px] px-8 bg-[#3E4095] hover:bg-[#3E4095]/90 transition-all flex items-center gap-2"
                        >
                            <span>Send</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Button>
                    </div>
                </div>
            </ResponsiveContainer>
        </div>
    );
}
