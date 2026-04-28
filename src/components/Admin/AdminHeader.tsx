"use client"
import { ExportButton } from "../ui/Button";
import { BackIcon } from "../General/GettingStarted/GettingStartedAssets";
import { DownloadIcon } from "./AdminIcons";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

export default function AdminHeader({ 
    label, 
    actionButton, 
    isExport = false, 
    backUrl, 
    onExport,
    isImport = false,
    onImport,
    otherButtons,
}: { 
    label: string, 
    actionButton?: ReactNode | ReactNode[], 
    isExport?: boolean, 
    backUrl?: string, 
    onExport?: () => void,
    isImport?: boolean,
    onImport?: () => void,
    otherButtons?: ReactNode | ReactNode[],
}) {

    const router = useRouter();

    const handleBack = () => {
        if (backUrl) {
            router.push(backUrl);
        } else {
            router.back();
        }
    };

    return <div className='flex bg-white px-4 md:px-10 py-3 justify-between items-center border-b border-gray-100 sticky top-0 z-20'>
        <div className="flex items-center gap-4">
            <button 
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-600"
                title="Go Back"
            >
                <BackIcon className="w-4 h-4" />
            </button>

        </div>
        <div className="flex gap-2 items-center flex-wrap justify-end">
            {isImport && onImport && (
                <ExportButton onClick={onImport}>
                    <span className="w-4 h-4 flex items-center justify-center"><i className="fas fa-file-import"></i></span>
                    <span>IMPORT</span>
                </ExportButton>
            )}
            {isExport && onExport && (
                <ExportButton onClick={onExport}>
                    <span className="w-4 h-4 flex items-center justify-center"><DownloadIcon /></span>
                    <span>EXPORT</span>
                </ExportButton>
            )}
            {Array.isArray(actionButton) ? actionButton.map((button, index) => <span key={index}>{button}</span>) : actionButton}
            {Array.isArray(otherButtons) ? otherButtons.map((button, index) => <span key={`other-${index}`}>{button}</span>) : otherButtons}
        </div>

    </div>
}