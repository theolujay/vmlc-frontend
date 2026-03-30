"use client";
import React from "react";
import Button from "@/components/ui/Button";
import ResponsiveContainer from "@/components/ui/ResponsiveContainer";
import { useAuth } from "@/contexts/AuthProvider";
import useGetHelpdeskThreadDetail from "@/hooks/useGetHelpdeskThreadDetail";
import useSendHelpdeskMessage from "@/hooks/useSendHelpdeskMessage";
import useHelpdeskSocket from "@/hooks/useHelpdeskSocket";
import {
  HelpdeskMessageType,
  HelpdeskThreadType,
  LiveExamStatus,
} from "@/types/HelpdeskType";
import { formatDateTime } from "@/utils/formatFileSize";
import { formatWhatsAppLink } from "@/utils/generalUtils";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Drawer from "@/components/ui/Drawer/Drawer";
import clsx from "clsx";
import { formatTextWithLinks } from "@/utils/formatTextWithLinks";

export default function HelpdeskThreadDetails({ id }: { id: string }) {
  const router = useRouter();
  const { authState } = useAuth();
  const {
    thread,
    messages,
    loading: messagesLoading,
    setMessages,
    setThread,
  } = useGetHelpdeskThreadDetail(id);
  const { sendMessage, loading: sendingLoading } = useSendHelpdeskMessage();
  const [newMessage, setNewMessage] = useState("");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const onMessageReceived = useCallback(
    (newMsg: HelpdeskMessageType) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    },
    [setMessages],
  );

  const onThreadUpdated = useCallback(
    (updatedThread: Partial<HelpdeskThreadType>) => {
      setThread((prev) => {
        if (!prev) return null;
        return { ...prev, ...updatedThread };
      });
    },
    [setThread],
  );

  const onExamTelemetryReceived = useCallback(
    (telemetry: LiveExamStatus) => {
      setThread((prev) => {
        if (!prev) return null;
        return { ...prev, candidate_live_exam_status: telemetry };
      });
    },
    [setThread],
  );

  const { isTyping, sendTypingStatus } = useHelpdeskSocket(
    id,
    onMessageReceived,
    onThreadUpdated,
    onExamTelemetryReceived,
  );

  const isCandidateTyping = Object.values(isTyping).some((typing) => typing);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isCandidateTyping]);

  const handleSend = async () => {
    if (!newMessage.trim() || !id || !authState?.user) return;

    const textToSend = newMessage;
    setNewMessage("");
    sendTypingStatus(false);

    const payload = {
      text: textToSend,
      thread_id: id,
    };

    const sentMessage = await sendMessage(payload);
    if (sentMessage) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === sentMessage.id)) return prev;
        return [...prev, sentMessage];
      });
    } else {
      setNewMessage(textToSend);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    if (e.target.value.trim().length > 0) {
      sendTypingStatus(true);
    } else {
      sendTypingStatus(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10 p-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-medium text-xs uppercase tracking-widest">
            Back
          </span>
        </button>
        {thread && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 bg-[#3E4095] text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {thread.candidate_name.charAt(0).toUpperCase()}
                </div>
                {thread.is_candidate_online && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-[#3E4095]">
                  {thread.candidate_name}
                </span>
                <span
                  className={`text-[10px] font-bold lowercase tracking-widest ${thread.is_candidate_online ? "text-green-500 animate-pulse" : "text-gray-400"}`}
                >
                  {thread.is_candidate_online ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsDetailsOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-4 flex-1 overflow-hidden">
        <ResponsiveContainer className="flex-3 flex flex-col p-0 overflow-hidden bg-white shadow-lg border border-gray-200 rounded-xl">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#F9FAFB]">
            {messagesLoading && (!messages || messages.length === 0) ? (
              <div className="flex justify-center items-center h-full">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3E4095]"></div>
                  <span className="text-sm text-gray-500 animate-pulse">
                    Loading messages...
                  </span>
                </div>
              </div>
            ) : !messages || messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-medium text-xs">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => {
                  const isStaff = msg.sender_type === "staff";
                  const isSystem = msg.sender_type === "system";
                  const isSender = isStaff || isSystem;
                  const senderName =
                    msg.sender_name ||
                    (isSystem
                      ? "System"
                      : isStaff
                        ? "Staff"
                        : thread?.candidate_name || "Candidate");

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${
                        isSender
                          ? "self-end items-end"
                          : "self-start items-start"
                      }`}
                    >
                      <div
                        className={`flex items-end gap-2 ${isSender ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden ${
                            isSender
                              ? "bg-[#3E4095] text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {isSystem ? (
                            <Image
                              src="/vmlc_logo.png"
                              alt="System"
                              width={40}
                              height={40}
                              className="w-full h-full object-cover bg-white"
                            />
                          ) : (
                            senderName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                            isStaff
                              ? "bg-[#3E4095] text-white rounded-br-none"
                              : isSystem
                                ? "bg-gray-100 text-grey-600 border border-gray-200 rounded-br-none italic"
                                : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">
                            {formatTextWithLinks(msg.text).map((node, i) => {
                              if (typeof node === "string") {
                                return (
                                  <React.Fragment key={i}>
                                    {node}
                                  </React.Fragment>
                                );
                              } else {
                                return (
                                  <a
                                    key={i}
                                    href={node.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-600 hover:underline break-all"
                                  >
                                    {node.text}
                                  </a>
                                );
                              }
                            })}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 mt-1 px-10 uppercase tracking-wider">
                        {senderName} • {formatDateTime(msg.created_at)}
                      </span>
                    </div>
                  );
                })}
                {isCandidateTyping && (
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
                <div ref={bottomRef} />
              </>
            )}
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-3 items-end w-full">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="Write your reply..."
                  className="w-full p-4 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3E4095]/20 focus:border-[#3E4095] transition-all resize-none min-h-14 max-h-37.5 text-sm scrollbar-hide"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  rows={1}
                  style={{ height: "auto" }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
              </div>
              <Button
                onClick={handleSend}
                isPending={sendingLoading}
                disabled={!newMessage.trim() || sendingLoading}
                className="rounded-full h-14 px-8 bg-grey-800 hover:bg-[#3E4095] transition-all flex items-center gap-2"
              >
                <span className="text-xs font-bold uppercase tracking-widest">
                  Send
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </ResponsiveContainer>

        <div className="flex-1 hidden lg:flex flex-col gap-4 overflow-y-auto">
          <CandidateDetails thread={thread} />
          {thread?.candidate_live_exam_status && (
            <LiveExamStatusView status={thread.candidate_live_exam_status} />
          )}
        </div>
      </div>

      <Drawer open={isDetailsOpen} onClose={setIsDetailsOpen}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest">
            Helpdesk Thread Details
          </h2>
          <button
            onClick={() => setIsDetailsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="-mx-6 flex flex-col gap-4">
          <CandidateDetails thread={thread} isDrawer />
          {thread?.candidate_live_exam_status && (
            <div className="px-6">
              <LiveExamStatusView
                status={thread.candidate_live_exam_status}
                isDrawer
              />
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}

function CandidateDetails({
  thread,
  isDrawer = false,
}: {
  thread: HelpdeskThreadType | null;
  isDrawer?: boolean;
}) {
  return (
    <ResponsiveContainer
      className={clsx(
        "bg-white flex flex-col gap-4 p-6 overflow-y-auto",
        !isDrawer && "shadow-lg border border-gray-200 rounded-xl",
      )}
    >
      <h3 className="font-bold text-sm text-gray-900 mb-4 pb-2 border-b border-gray-100 uppercase tracking-widest">
        Helpdesk Thread Details
      </h3>
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Candidate Name
          </p>
          <p className="text-xs font-bold text-gray-900">
            {thread?.candidate_name || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Phone (click for WhatsApp)
          </p>
          <a
            href={formatWhatsAppLink(thread?.candidate_phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#3E4095] hover:underline"
          >
            {thread?.candidate_phone || "N/A"}
          </a>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Email Address
          </p>
          <p className="text-xs font-bold text-gray-900">
            {thread?.candidate_email || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Status
          </p>
          <span
            className={`capitalize text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
              thread?.status === "open"
                ? "bg-white text-[#9E0A05] border border-[#9E0A05]/20"
                : thread?.status === "in_progress"
                  ? "bg-white text-orange-700 border border-orange-700/20"
                  : thread?.status === "resolved"
                    ? "bg-white text-emerald-600 border border-emerald-600/20"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            {thread?.status.replace("_", " ") || "N/A"}
          </span>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Priority
          </p>
          <span
            className={`capitalize text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
              thread?.priority === "urgent"
                ? "bg-white text-[#9E0A05] border border-[#9E0A05]/20"
                : thread?.priority === "high"
                  ? "bg-white border border-[#FC6A03]/40 text-[#FC6A03]"
                  : thread?.priority === "medium"
                    ? "bg-white border border-[#3E4095]/40 text-[#3E4095]"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            {thread?.priority || "N/A"}
          </span>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Assigned Staff
          </p>
          <p className="text-xs font-bold text-gray-900">
            {thread?.assigned_staff_name || "Unassigned"}
          </p>
        </div>
        {thread?.participating_staff_names &&
          thread.participating_staff_names.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                Participating Staff
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {thread.participating_staff_names.map((name, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold bg-blue-50 text-[#3E4095] px-2 py-0.5 rounded-md border border-blue-100/50"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Started On
          </p>
          <p className="text-xs font-bold text-gray-900">
            {thread ? formatDateTime(new Date(thread.created_at)) : "N/A"}
          </p>
        </div>
      </div>
    </ResponsiveContainer>
  );
}

function LiveExamStatusView({
  status,
  isDrawer = false,
}: {
  status: LiveExamStatus;
  isDrawer?: boolean;
}) {
  const suspicionScore = (status.proctoring.suspicion_score || 0) * 100;

  return (
    <ResponsiveContainer
      className={clsx(
        "bg-white flex flex-col gap-4 p-6 overflow-y-auto",
        !isDrawer && "shadow-lg border border-gray-200 rounded-xl",
      )}
    >
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <h3 className="font-bold text-sm text-gray-900 uppercase tracking-widest">
          Live Exam Status
        </h3>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
            Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Active Exam
          </p>
          <p className="text-xs font-bold text-[#3E4095]">
            {status.exam.title}
          </p>
        </div>

        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Attempt Status
          </p>
          <span
            className={clsx(
              "text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-tighter",
              status.attempt.status === "started"
                ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                : status.attempt.status === "submitted"
                  ? "text-blue-600 bg-blue-50 border-blue-100"
                  : "text-amber-600 bg-amber-50 border-amber-100",
            )}
          >
            {status.attempt.status}
          </span>
        </div>

        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Completion
          </p>
          <p className="text-xs font-black text-gray-900">
            {status.progress.percent_complete}%
          </p>
        </div>

        <div className="col-span-2 space-y-2">
          <div className="flex justify-between items-end">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
              Integrity Status
            </p>
            <span
              className={clsx(
                "text-[10px] font-black uppercase",
                status.proctoring.status === "clear"
                  ? "text-emerald-600"
                  : status.proctoring.status === "suspicious"
                    ? "text-amber-600"
                    : "text-rose-600",
              )}
            >
              {status.proctoring.status || "clear"}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={clsx(
                "h-full transition-all duration-500",
                suspicionScore >= 70
                  ? "bg-rose-500"
                  : suspicionScore >= 30
                    ? "bg-amber-500"
                    : "bg-emerald-500",
              )}
              style={{ width: `${suspicionScore}%` }}
            />
          </div>
        </div>

        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Violations
          </p>
          <p className="text-xs font-black text-gray-900">
            {status.proctoring.violations.total} total (
            {status.proctoring.violations.critical} critical)
          </p>
        </div>

        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
            Questions
          </p>
          <p className="text-xs font-black text-gray-900">
            {status.progress.questions_attempted} /{" "}
            {status.progress.questions_total}
          </p>
        </div>
      </div>

      {status.proctoring.recent_events &&
        status.proctoring.recent_events.length > 0 && (
          <div className="mt-2">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2">
              Recent Events
            </p>
            <div className="flex flex-col gap-2">
              {status.proctoring.recent_events.slice(0, 3).map((event, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full mt-1.5",
                      event.is_critical ? "bg-rose-500" : "bg-amber-500",
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-700 uppercase">
                      {event.type.replace("_", " ")}
                    </span>
                    <span className="text-[8px] font-bold text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </ResponsiveContainer>
  );
}
