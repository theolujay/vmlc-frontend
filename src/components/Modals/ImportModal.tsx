"use client";
import AppDialog from "@/components/ui/Modals/AppDialog";
import useBulkStaffImport from "@/hooks/useBulkStaffImport";
import useBulkCandidateImport from "@/hooks/useBulkCandidateImport";
import { useState, useRef, useCallback } from "react";
import clsx from "clsx";

type ImportType = "staff" | "candidate";

interface ImportModalProps {
  open: boolean;
  close: (close: boolean) => void;
  defaultType?: ImportType;
}

const TEMPLATE_COLUMNS_STAFF = ["email", "first_name", "last_name", "phone", "state", "role", "occupation"];
const TEMPLATE_COLUMNS_CANDIDATE = ["email", "first_name", "last_name", "phone", "state", "school_name", "school_type", "current_class"];

const ROLE_OPTIONS_STAFF = ["volunteer", "moderator", "admin", "manager"];
const ROLE_OPTIONS_CANDIDATE = ["screening", "league", "final", "winner"];
const STATE_OPTIONS = ["lagos", "ogun", "rivers", "abuja"];
const CLASS_OPTIONS = ["SS1", "SS2", "SS3"];
const SCHOOL_TYPE_OPTIONS = ["public", "private"];

export default function ImportModal({ open, close, defaultType = "candidate" }: ImportModalProps) {
  const [importType, setImportType] = useState<ImportType>(defaultType);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { importStaff, data: staffData, isPending: staffPending, error: staffError, reset: staffReset } = useBulkStaffImport();
  const { importCandidate, data: candidateData, isPending: candidatePending, error: candidateError, reset: candidateReset } = useBulkCandidateImport();

  const isPending = importType === "staff" ? staffPending : candidatePending;
  const error = importType === "staff" ? staffError : candidateError;
  const data = importType === "staff" ? staffData : candidateData;
  const reset = importType === "staff" ? staffReset : candidateReset;

  const templateColumns = importType === "staff" ? TEMPLATE_COLUMNS_STAFF : TEMPLATE_COLUMNS_CANDIDATE;
  const roleOptions = importType === "staff" ? ROLE_OPTIONS_STAFF : ROLE_OPTIONS_CANDIDATE;

  const hasData = file || data;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const acceptedTypes = [
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (
        !acceptedTypes.includes(selectedFile.type) &&
        !selectedFile.name.match(/\.(csv|xlsx|xls)$/i)
      ) {
        alert("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (
        !droppedFile.name.match(/\.(csv|xlsx|xls)$/i)
      ) {
        alert("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
        return;
      }
      setFile(droppedFile);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleImport = async () => {
    if (!file) return;
    if (importType === "staff") {
      await importStaff(file);
    } else {
      await importCandidate(file);
    }
  };

  const handleClose = (force?: boolean) => {
    if (force === true) {
      close(false);
      setShowCloseConfirm(false);
      setFile(null);
      reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }
    if (hasData) {
      setShowCloseConfirm(true);
    } else {
      close(false);
    }
  };

  const downloadTemplate = async () => {
    const XLSX = await import("xlsx") as typeof import("xlsx");
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([templateColumns]);
    XLSX.utils.book_append_sheet(wb, ws, `${importType === "staff" ? "Staff" : "Candidate"} Template`);
    
    const xlsxData = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([xlsxData], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${importType}_import_template.xlsx`;
    link.click();
  };

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
              <h3 className="text-xl font-bold text-gray-800 mb-2">Discard Import?</h3>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                You have unsaved changes. Are you sure you want to discard?
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setShowCloseConfirm(false)}
                  className="w-full py-4 bg-[#3E4095] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#2d2f6e] transition-all"
                >
                  Continue
                </button>
                <button
                  onClick={() => handleClose(true)}
                  className="w-full py-4 bg-gray-50 text-gray-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-[#3E4095]/5 rounded-xl flex items-center justify-center text-[#3E4095]">
              <i className="fas fa-file-import text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-800 tracking-tight">
                Import {importType === "staff" ? "Staff" : "Candidates"}
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                Bulk import from CSV or Excel
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
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Import Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setImportType("candidate");
                  setFile(null);
                  reset();
                }}
                disabled={!!file}
                className={clsx(
                  "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  importType === "candidate"
                    ? "bg-[#3E4095] text-white shadow-lg shadow-[#3E4095]/20"
                    : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100",
                  file && "opacity-50 cursor-not-allowed"
                )}
              >
                Candidates
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportType("staff");
                  setFile(null);
                  reset();
                }}
                disabled={!!file}
                className={clsx(
                  "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  importType === "staff"
                    ? "bg-[#3E4095] text-white shadow-lg shadow-[#3E4095]/20"
                    : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100",
                  file && "opacity-50 cursor-not-allowed"
                )}
              >
                Staff
              </button>
            </div>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-[#3E4095] hover:bg-[#3E4095]/5 transition-all cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#3E4095]/10 rounded-xl flex items-center justify-center text-[#3E4095]">
                  <i className="fas fa-file-excel text-xl"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#3E4095]/10 transition-all">
                  <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 group-hover:text-[#3E4095] transition-all"></i>
                </div>
                <p className="text-sm font-bold text-gray-600 mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  CSV or Excel files only (.csv, .xlsx, .xls)
                </p>
              </>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <i className="fas fa-info-circle text-amber-500 mt-0.5"></i>
              <div className="text-sm">
                <p className="font-bold text-amber-700 mb-1">Required Columns</p>
                <p className="text-amber-600 text-xs mb-2">
                  <code className="bg-amber-100 px-1 rounded">email</code>,{" "}
                  <code className="bg-amber-100 px-1 rounded">first_name</code>,{" "}
                  <code className="bg-amber-100 px-1 rounded">last_name</code>
                </p>
                <p className="font-bold text-amber-700 mb-1">Optional Columns</p>
                <p className="text-amber-600 text-xs">
                  {importType === "staff" ? (
                    <>
                      <code className="bg-amber-100 px-1 rounded">phone</code>,{" "}
                      <code className="bg-amber-100 px-1 rounded">state</code>,{" "}
                      <code className="bg-amber-100 px-1 rounded">role</code>,{" "}
                      <code className="bg-amber-100 px-1 rounded">occupation</code>
                      <br />
                      Valid roles: {roleOptions.join(", ")}
                    </>
                  ) : (
                    <>
                      <code className="bg-amber-100 px-1 rounded">phone</code>,{" "}
                      <code className="bg-amber-100 px-1 rounded">state</code>,{" "}
                      <code className="bg-amber-100 px-1 rounded">school_name</code>,{" "}
                      <code className="bg-amber-100 px-1 rounded">school_type</code>,{" "}
                      <code className="bg-amber-100 px-1 rounded">current_class</code>
                      <br />
                      Valid classes: {CLASS_OPTIONS.join(", ")} | Valid school types: {SCHOOL_TYPE_OPTIONS.join(", ")}
                    </>
                  )}
                </p>
                <p className="text-amber-600 text-xs mt-2">
                  Valid states: {STATE_OPTIONS.join(", ")}
                </p>
              </div>
            </div>
          </div>

          {data && (
            <div className="space-y-4">
              <div className={clsx(
                "rounded-xl p-4 flex items-center gap-4",
                data.failed === 0 ? "bg-green-50 border border-green-100" : "bg-amber-50 border border-amber-100"
              )}>
                <div className={clsx(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  data.failed === 0 ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                )}>
                  <i className={clsx("fas", data.failed === 0 ? "fa-check" : "fa-exclamation", "text-xl")}></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {data.failed === 0 ? "Import Successful" : "Import Completed with Errors"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {data.created} created, {data.failed} failed
                  </p>
                </div>
              </div>

              {data.errors.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl overflow-hidden max-h-40 overflow-y-auto">
                  {data.errors.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between px-4 py-2 border-b border-red-100 last:border-0 text-xs">
                      <span className="text-gray-600">Row {item.row}:</span>
                      <span className="text-red-500">{item.error}</span>
                    </div>
                  ))}
                  {data.errors.length > 5 && (
                    <div className="px-4 py-2 text-center text-xs text-gray-400">
                      ...and {data.errors.length - 5} more errors
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => handleClose(true)}
                className="w-full py-4 bg-[#3E4095] text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#2d2f6e] transition-all"
              >
                Done
              </button>
            </div>
          )}

          {!data && (
            <div className="flex flex-col gap-3">
              <button
                onClick={downloadTemplate}
                className="w-full py-3 bg-white border-2 border-gray-100 text-gray-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-download text-xs"></i>
                Download Template
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleClose()}
                  className="flex-1 px-6 py-3 bg-gray-50 text-gray-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={!file || isPending}
                  className={clsx(
                    "flex-1 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all flex items-center justify-center gap-2",
                    {
                      "bg-[#3E4095]/30 cursor-not-allowed text-white": isPending,
                      "bg-[#3E4095] hover:bg-[#2d2f6e] text-white hover:-translate-y-0.5 hover:shadow-[#3E4095]/30 active:translate-y-0": !isPending && file,
                      "bg-gray-200 text-gray-400 cursor-not-allowed": !file && !isPending,
                    }
                  )}
                >
                  {isPending ? (
                    <>
                      <i className="fas fa-circle-notch animate-spin text-sm"></i>
                      Importing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle text-xs"></i>
                      Start Import
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppDialog>
  );
}