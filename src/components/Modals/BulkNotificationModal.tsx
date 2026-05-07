"use client";
import AppDialog from "@/components/ui/Modals/AppDialog";
import useBulkNotification from "@/hooks/useBulkNotification";
import { useState, useCallback } from "react";
import clsx from "clsx";

interface BulkNotificationModalProps {
  open: boolean;
  close: (close: boolean) => void;
  selectedUserIds: string[];
}

const mediums = [
  { label: "SMS", value: "sms" as const, icon: "fa-comment-alt" },
  { label: "Email", value: "email" as const, icon: "fa-envelope" },
];

const mediumValues = ["email", "sms"] as const;

export default function BulkNotificationModal({
  open,
  close,
  selectedUserIds,
}: BulkNotificationModalProps) {
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const { sendBulkNotification, isPending } = useBulkNotification();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [medium, setMedium] = useState<"sms" | "email">("email");

  const hasData = subject.trim() || message.trim();

  const handleClose = useCallback((force?: boolean) => {
    if (force === true) {
      close(false);
      setShowCloseConfirm(false);
      setSubject("");
      setMessage("");
      return;
    }
    if (hasData) {
      setShowCloseConfirm(true);
    } else {
      close(false);
    }
  }, [close, hasData]);

  const handleSend = async () => {
    if (!message.trim() || (medium === "email" && !subject.trim())) return;

    try {
      const basePayload = {
        user_ids: selectedUserIds,
        message,
        medium,
      };

      const payload = medium === "email" && subject.trim()
        ? { ...basePayload, subject }
        : basePayload;

      await sendBulkNotification(payload);
      handleClose(true);
    } catch {
      // Error toast is handled by the mutation's onError
    }
  };

  const isValid = message.trim() && selectedUserIds.length > 0 && (medium === "sms" || (medium === "email" && subject.trim()));

  return (
    <AppDialog
      open={open}
      onOpenChange={() => handleClose()}
      className="!max-w-none !max-h-none !w-auto !p-0 bg-transparent shadow-none flex items-center justify-center"
    >
      <div className="flex flex-col bg-[#F7F9FC] w-[95vw] md:w-[600px] rounded-3xl overflow-hidden shadow-2xl relative font-sans border border-white/20">

        {showCloseConfirm && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-exclamation-triangle text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Discard Message?</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                You have unsaved changes. Are you sure you want to discard?
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setShowCloseConfirm(false)}
                  className="w-full py-4 bg-[#3E4095] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#2d2f6e] transition-all"
                >
                  Continue Composing
                </button>
                <button
                  onClick={() => handleClose(true)}
                  className="w-full py-4 bg-gray-50 text-gray-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Discard Message
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-[#3E4095]/5 rounded-xl flex items-center justify-center text-[#3E4095]">
              <i className="fas fa-bullhorn text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-800 tracking-tight">
                Send to {selectedUserIds.length} User{selectedUserIds.length !== 1 ? "s" : ""}
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                Selected users from User Management
              </p>
            </div>
          </div>
          <button
            onClick={() => handleClose()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-8 space-y-6">
          {medium === "email" && (
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 h-12 px-5 rounded-xl outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] focus:bg-white transition-all text-sm font-bold shadow-inner"
                placeholder="Enter email subject..."
              />
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] focus:bg-white transition-all text-sm font-medium shadow-inner resize-none"
              placeholder={medium === "sms" ? "Type your SMS message (160 chars max)..." : "Type your email message..."}
            />
            {medium === "sms" && (
              <div className="flex justify-end mt-1">
                <span className="text-[9px] font-bold text-gray-400">
                  {message.length} chars
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
              Delivery Channel
            </label>
            <div className="grid grid-cols-2 gap-3">
              {mediums.map((m) => {
                const isChecked = medium === m.value;
                return (
                  <div
                    key={m.value}
                    onClick={() => {
                      setMedium(m.value);
                      // Clear subject when switching to SMS
                      if (m.value === "sms") setSubject("");
                    }}
                    className={clsx(
                      "group p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3",
                      {
                        "bg-[#3E4095]/5 border-[#3E4095] shadow-md ring-2 ring-[#3E4095]/5": isChecked,
                        "bg-white border-gray-100 hover:border-gray-200": !isChecked,
                      }
                    )}
                  >
                    <div className={clsx(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      isChecked ? "bg-[#3E4095] text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
                    )}>
                      <i className={`fas ${m.icon} text-sm`}></i>
                    </div>
                    <span className={clsx(
                      "text-xs font-black uppercase tracking-widest",
                      isChecked ? "text-[#3E4095]" : "text-gray-500"
                    )}>
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-white/80 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => handleClose()}
            className="px-6 py-3 bg-gray-50 text-gray-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 hover:text-gray-600 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex-1"></div>
          <button
            type="button"
            onClick={handleSend}
            disabled={!isValid || isPending}
            className={clsx(
              "px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all flex items-center justify-center gap-2",
              {
                "bg-[#3E4095]/30 cursor-not-allowed text-white": isPending,
                "bg-[#3E4095] hover:bg-[#2d2f6e] text-white hover:-translate-y-0.5 hover:shadow-[#3E4095]/30 active:translate-y-0": !isPending && isValid,
                "bg-gray-200 text-gray-400 cursor-not-allowed": !isPending && !isValid,
              }
            )}
          >
            {isPending ? (
              <>
                <i className="fas fa-circle-notch animate-spin text-sm"></i>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane text-xs"></i>
                Send to {selectedUserIds.length} User{selectedUserIds.length !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </AppDialog>
  );
}