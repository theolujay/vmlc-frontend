'use client';
import Button from '@/components/ui/Button';
import ResponsiveContainer from '@/components/ui/ResponsiveContainer';
import useGetSupportMessages from '@/hooks/useGetSupportMessages';
import useSendSupportMessage from '@/hooks/useSendSupportMessage';
import { formatDate } from '@/utils/formatFileSize';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ConversationDetails() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const conversationId = searchParams.get('id');
    const { messages, loading: messagesLoading, addMessage } = useGetSupportMessages(conversationId);
    const { sendMessage, loading: sendingLoading } = useSendSupportMessage();
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !conversationId) return;

        const payload = {
            content: newMessage,
            conversation_id: conversationId,
        };
        
        // Optimistic update (optional, but good for UX)
        // For now, we wait for server response to ensure ID and timestamp are correct
        const sentMessage = await sendMessage(payload);
        if (sentMessage) {
            addMessage(sentMessage);
            setNewMessage('');
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (!conversationId) return <div>Invalid Conversation ID</div>;

    return (
        <div className="flex flex-col gap-1 h-[calc(100vh-100px)]">
             <div className="flex items-center gap-4 mb-4">
                <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back to Conversations
                </button>
            </div>

            <ResponsiveContainer className="flex-1 flex flex-col p-0 overflow-hidden bg-white shadow-sm border border-gray-200 rounded-lg">
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
                    {messagesLoading ? (
                        <div className="flex justify-center items-center h-full">
                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col max-w-[80%] ${
                                        msg.is_staff 
                                        ? 'self-end items-end' 
                                        : 'self-start items-start'
                                    }`}
                                >
                                    <div
                                        className={`px-4 py-2 rounded-lg ${
                                            msg.is_staff
                                                ? 'bg-[#3E4095] text-white rounded-br-none'
                                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1">
                                        {formatDate(new Date(msg.timestamp))}
                                    </span>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex gap-4">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your reply..."
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E4095] resize-none h-[80px]"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <div className="flex flex-col justify-end">
                            <Button
                                onClick={handleSend}
                                isPending={sendingLoading}
                                disabled={!newMessage.trim() || sendingLoading}
                                className="h-[40px] px-6"
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </ResponsiveContainer>
        </div>
    );
}
