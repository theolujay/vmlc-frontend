"use client";
import AppDialog from "@/components/ui/Modals/AppDialog";
import useExportUsers from "@/hooks/useExportUsers";
import { useState, useEffect } from "react";
import clsx from "clsx";

interface ExportModalProps {
  open: boolean;
  close: (close: boolean) => void;
  filters: Record<string, string>;
  currentProfile?: string;
}

const CANDIDATE_COLUMNS = [
  { key: "sn", label: "S/N", default: true },
  { key: "full_name", label: "Full Name", default: true },
  { key: "email", label: "Email", default: true },
  { key: "phone", label: "Phone", default: true },
  { key: "school_name", label: "School Name", default: true },
  { key: "school_type", label: "School Type", default: true },
  { key: "current_class", label: "Current Class", default: true },
  { key: "state", label: "State", default: true },
  { key: "role", label: "Role", default: false },
  { key: "date_joined", label: "Date Joined", default: true },
  { key: "status", label: "Status", default: true },
];

const STAFF_COLUMNS = [
  { key: "sn", label: "S/N", default: true },
  { key: "full_name", label: "Full Name", default: true },
  { key: "email", label: "Email", default: true },
  { key: "phone", label: "Phone", default: true },
  { key: "occupation", label: "Occupation", default: true },
  { key: "role", label: "Role", default: true },
  { key: "date_joined", label: "Date Joined", default: true },
  { key: "status", label: "Status", default: true },
];

export default function ExportModal({ open, close, filters, currentProfile = "candidate" }: ExportModalProps) {
  const { exportUsers, isPending } = useExportUsers();
  const [profileFilter, setProfileFilter] = useState(currentProfile);
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(filters);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [includeExamData, setIncludeExamData] = useState(false);

  const columns = profileFilter === "candidate" ? CANDIDATE_COLUMNS : STAFF_COLUMNS;

  useEffect(() => {
    if (open) {
      setProfileFilter(currentProfile);
      setLocalFilters(filters);
      const defaults = columns.filter(c => c.default).map(c => c.key);
      setSelectedColumns(defaults);
    }
  }, [open, currentProfile, filters, columns]);

  useEffect(() => {
    if (profileFilter === "candidate") {
      setLocalFilters(prev => ({ ...prev, profile: "candidate", role: "", current_class: "", state: "", school_name: "" }));
    } else {
      setLocalFilters(prev => ({ ...prev, profile: "staff", role: "" }));
    }
    const defaults = columns.filter(c => c.default).map(c => c.key);
    setSelectedColumns(defaults);
  }, [profileFilter, columns]);

  const handleExport = async () => {
    const exportFilters: Record<string, string> = { ...localFilters };
    if (selectedColumns.length > 0 && selectedColumns.length !== columns.length) {
      exportFilters.columns = selectedColumns.join(",");
    }
    if (includeExamData && profileFilter === "candidate") {
      exportFilters.include_exam_data = "true";
    }
    await exportUsers(exportFilters);
    close(false);
  };

  const toggleColumn = (key: string) => {
    setSelectedColumns(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const selectAllColumns = () => {
    setSelectedColumns(columns.map(c => c.key));
  };

  const clearAllColumns = () => {
    setSelectedColumns([]);
  };

  const activeFilters = Object.entries(localFilters).filter(
    ([, value]) => value !== undefined && value !== "" && value !== "candidate" && value !== "staff"
  );

  return (
    <AppDialog open={open} onOpenChange={close}>
      <div className="flex bg-[#F7F9FC] rounded-4xl flex-col overflow-hidden border border-gray-100 shadow-2xl max-w-lg w-[95vw] md:w-full mx-auto font-sans">
        <div className="header bg-white p-6 md:p-8 border-b border-gray-50">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-[#3E4095]/10 rounded-xl flex items-center justify-center text-[#3E4095]">
              <i className="fas fa-file-export text-xl"></i>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                Data Export
              </p>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight uppercase">
                Export Users
              </h2>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 font-medium">
            Export user data to Excel format. Select columns to include in export.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Profile Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setProfileFilter("candidate")}
                  className={clsx(
                    "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    profileFilter === "candidate"
                      ? "bg-[#3E4095] text-white shadow-lg shadow-[#3E4095]/20"
                      : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
                  )}
                >
                  Candidates
                </button>
                <button
                  type="button"
                  onClick={() => setProfileFilter("staff")}
                  className={clsx(
                    "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    profileFilter === "staff"
                      ? "bg-[#3E4095] text-white shadow-lg shadow-[#3E4095]/20"
                      : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
                  )}
                >
                  Staff
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Column Selection
                </label>
                <button
                  type="button"
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="text-[10px] font-bold text-[#3E4095] hover:underline"
                >
                  {showColumnSelector ? "Hide" : "Select"}
                </button>
              </div>

              {showColumnSelector && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={selectAllColumns}
                      className="text-[9px] font-bold text-gray-500 hover:text-[#3E4095]"
                    >
                      Select All
                    </button>
                    <span className="text-gray-200">|</span>
                    <button
                      type="button"
                      onClick={clearAllColumns}
                      className="text-[9px] font-bold text-gray-500 hover:text-red-500"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {columns.map(col => (
                      <label
                        key={col.key}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedColumns.includes(col.key)}
                          onChange={() => toggleColumn(col.key)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-[#3E4095] focus:ring-[#3E4095]"
                        />
                        <span className="text-xs font-medium text-gray-600">{col.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-[9px] text-gray-400 mt-3">
                    {selectedColumns.length} of {columns.length} columns selected
                  </p>
                </div>
              )}
            </div>

            {profileFilter === "candidate" && (
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeExamData}
                    onChange={(e) => setIncludeExamData(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#3E4095] focus:ring-[#3E4095]"
                  />
                  <span className="text-xs font-bold text-gray-700">
                    Include exam results & competition stage
                  </span>
                </label>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Filters Applied
              </label>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 min-h-15">
                {activeFilters.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No filters - will export all {profileFilter}s</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-gray-200 text-[9px] font-bold text-gray-600"
                      >
                        <span className="text-gray-400">{key}:</span>
                        <span className="text-[#3E4095]">{value}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full">
            <button
              type="button"
              onClick={() => close(false)}
              className="px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all cursor-pointer order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isPending || selectedColumns.length === 0}
              className="flex-1 px-6 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase text-white bg-[#3E4095] shadow-lg shadow-[#3E4095]/20 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin text-[8px]"></i>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-download text-[8px]"></i>
                  <span>Export to Excel</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AppDialog>
  );
}
