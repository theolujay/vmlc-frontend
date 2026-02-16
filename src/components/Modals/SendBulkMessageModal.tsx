"use client";
import React, { useState, useCallback } from "react";
import AppDialog from "@/components/ui/Modals/AppDialog";
import useCreateBroadcastMessage, {
  candidateRoles,
  staffRoles,
} from "@/hooks/useCreateBroadcastMessage";
import clsx from "clsx";
import { FormProvider, useController } from "react-hook-form";
import { Checkbox } from "../ui/Checkbox";

const mediums = [
  { label: "Platform", value: "platform" as const, icon: "fa-desktop" },
  { label: "Email", value: "email" as const, icon: "fa-envelope" },
  { label: "SMS", value: "sms" as const, icon: "fa-comment-alt" },
  { label: "WhatsApp", value: "whatsapp" as const, icon: "fa-whatsapp" },
];

const staffRoleOptions = staffRoles.map((role) => ({
  label: role.charAt(0).toUpperCase() + role.slice(1),
  value: role,
}));

const candidateRoleOptions = candidateRoles.map((role) => ({
  label: role.charAt(0).toUpperCase() + role.slice(1),
  value: role,
}));

export default function SendBulkMessageModal({
  open,
  close,
}: Readonly<{ open: boolean; close: (close: boolean) => void }>) {
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const { onSubmit, form, isPending } = useCreateBroadcastMessage(() => close(false));

  const handleClose = useCallback((force?: boolean) => {
    if (force === true) {
      close(false);
      setShowCloseConfirm(false);
      return;
    }
    // Simple check if form has data - could be more sophisticated
    const values = form.getValues();
    const hasData = values.subject || values.message || values.mediums.length > 0;

    if (hasData) {
      setShowCloseConfirm(true);
    } else {
      close(false);
    }
  }, [close, form]);

  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { field: mediumsField } = useController({
    name: "mediums",
    control,
  });

  const { field: staffRolesField } = useController({
    name: "target_roles.staff",
    control,
  });

  const { field: candidateRolesField } = useController({
    name: "target_roles.candidate",
    control,
  });

  const toggleMedium = (value: "email" | "platform" | "sms" | "whatsapp") => {
    const currentValues = mediumsField.value || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    mediumsField.onChange(newValues);
  };

  const toggleStaffRole = (value: (typeof staffRoles)[number]) => {
    const currentValues = staffRolesField.value || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    staffRolesField.onChange(newValues);
  };

  const toggleCandidateRole = (value: (typeof candidateRoles)[number]) => {
    const currentValues = candidateRolesField.value || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: string) => v !== value)
      : [...currentValues, value];
    candidateRolesField.onChange(newValues);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={() => handleClose()}
      className="!max-w-none !max-h-none !w-auto !p-0 bg-transparent shadow-none flex items-center justify-center"
    >
      <div className="flex flex-col bg-[#F7F9FC] w-[95vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] h-[90vh] rounded-3xl overflow-hidden shadow-2xl relative font-sans border border-white/20">

        {/* Close Confirmation Overlay */}
        {showCloseConfirm && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-exclamation-triangle text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Discard Broadcast?</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">You have unsaved changes in your broadcast message. Are you sure you want to discard it?</p>
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

        {/* Header */}
        <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#3E4095]/5 rounded-2xl flex items-center justify-center text-[#3E4095]">
              <i className="fas fa-bullhorn text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">
                Send Broadcast
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Reach out to multiple users across channels
              </p>
            </div>
          </div>
          <button
            onClick={() => handleClose()}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-[#F7F9FC] p-10 pb-32">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="max-w-4xl mx-auto space-y-12"
            >
              {/* Message Content Section */}
              <section className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#3E4095] text-white font-black shadow-lg shadow-[#3E4095]/20">
                    1
                  </div>
                  <h3 className="text-base font-black text-gray-800 tracking-tight">
                    Content
                  </h3>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="subject"
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      {...register("subject")}
                      className="w-full bg-gray-50/50 border border-gray-100 h-14 px-6 rounded-2xl outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] focus:bg-white transition-all text-sm font-bold shadow-inner"
                      placeholder="e.g. System Maintenance Update"
                    />
                    {errors.subject && (
                      <span className="text-red-500 text-[10px] font-bold mt-2 px-1">
                        {errors.subject.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="message"
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      {...register("message")}
                      className="w-full bg-gray-50/50 border border-gray-100 p-6 rounded-[2rem] outline-none focus:ring-4 focus:ring-[#3E4095]/5 focus:border-[#3E4095] focus:bg-white transition-all text-sm font-medium min-h-[180px] shadow-inner resize-none"
                      placeholder="Type your message here..."
                    />
                    {errors.message && (
                      <span className="text-red-500 text-[10px] font-bold mt-2 px-1">
                        {errors.message.message}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* Delivery Mediums Section */}
              <section className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#3E4095] text-white font-black shadow-lg shadow-[#3E4095]/20">
                    2
                  </div>
                  <h3 className="text-base font-black text-gray-800 tracking-tight">
                    Delivery Channels
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mediums.map((medium) => {
                    const isChecked = mediumsField.value?.includes(
                      medium.value
                    );
                    return (
                      <div
                        key={medium.value}
                        onClick={() => toggleMedium(medium.value)}
                        className={clsx(
                          "group p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center gap-4 text-center",
                          {
                            "bg-[#3E4095]/5 border-[#3E4095] shadow-lg ring-4 ring-[#3E4095]/5": isChecked,
                            "bg-white border-gray-50 hover:border-gray-200 hover:shadow-md": !isChecked,
                          }
                        )}
                      >
                        <div className={clsx(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                          isChecked ? "bg-[#3E4095] text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
                        )}>
                          <i className={`fas ${medium.icon} text-lg`}></i>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox checked={isChecked} />
                          <span className={clsx(
                            "text-xs font-black uppercase tracking-widest",
                            isChecked ? "text-[#3E4095]" : "text-gray-500"
                          )}>
                            {medium.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.mediums && (
                  <span className="text-red-500 text-[10px] font-bold block px-1">
                    {errors.mediums.message}
                  </span>
                )}
              </section>

              {/* Target Audience Section */}
              <section className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-[#3E4095] text-white font-black shadow-lg shadow-[#3E4095]/20">
                    3
                  </div>
                  <h3 className="text-base font-black text-gray-800 tracking-tight">
                    Target Audience
                  </h3>
                </div>

                <div className="space-y-8">
                  {/* Staff Roles */}
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-1 flex items-center">
                      <i className="fas fa-user-shield mr-2"></i> Staff Roles
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {staffRoleOptions.map((role) => {
                        const isChecked = staffRolesField.value?.includes(
                          role.value
                        );
                        return (
                          <div
                            key={role.value}
                            onClick={() => toggleStaffRole(role.value)}
                            className={clsx(
                              "px-5 py-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5",
                              {
                                "bg-[#3E4095] border-[#3E4095] text-white shadow-md": isChecked,
                                "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100": !isChecked,
                              }
                            )}
                          >
                            <div className={clsx(
                              "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                              isChecked ? "bg-white/20 border-white" : "bg-white border-gray-200"
                            )}>
                              {isChecked && <i className="fas fa-check text-[8px]"></i>}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {role.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Candidate Roles */}
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-1 flex items-center">
                      <i className="fas fa-user-graduate mr-2"></i> Candidate Roles
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {candidateRoleOptions.map((role) => {
                        const isChecked = candidateRolesField.value?.includes(
                          role.value
                        );
                        return (
                          <div
                            key={role.value}
                            onClick={() => toggleCandidateRole(role.value)}
                            className={clsx(
                              "px-5 py-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5",
                              {
                                "bg-[#3E4095] border-[#3E4095] text-white shadow-md": isChecked,
                                "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100": !isChecked,
                              }
                            )}
                          >
                            <div className={clsx(
                              "w-4 h-4 rounded-md border flex items-center justify-center transition-all",
                              isChecked ? "bg-white/20 border-white" : "bg-white border-gray-200"
                            )}>
                              {isChecked && <i className="fas fa-check text-[8px]"></i>}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {role.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {errors.target_roles && (
                  <span className="text-red-500 text-[10px] font-bold block px-1">
                    {errors.target_roles.message ||
                      errors.target_roles.root?.message}
                  </span>
                )}
              </section>
            </form>
          </FormProvider>
        </div>

        {/* Footer Actions */}
        <div className="px-10 py-8 bg-white/80 border-t border-gray-100 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 sticky bottom-0 z-30 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => handleClose()}
            className="px-10 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 hover:text-gray-600 transition-all cursor-pointer"
            disabled={isPending}
          >
            Cancel
          </button>
          <div className="flex-1"></div>
          <button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isPending}
            className={clsx(
              "px-16 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all flex items-center justify-center cursor-pointer",
              {
                "bg-[#3E4095]/30 cursor-not-allowed text-white": isPending,
                "bg-[#3E4095] hover:bg-[#2d2f6e] text-white hover:-translate-y-1 hover:shadow-[#3E4095]/30 active:translate-y-0": !isPending,
              }
            )}
          >
            {isPending ? (
              <>
                <i className="fas fa-circle-notch animate-spin mr-3 text-lg"></i>
                Sending Broadcast...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                Send Message
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
          border: 2px solid transparent;
          background-clip: content-box;
        }
      `}</style>
    </AppDialog>
  );
}
