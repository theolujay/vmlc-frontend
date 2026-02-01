"use client"
import { ExportButton } from "../ui/Button";
import { BackIcon } from "../General/GettingStarted/GettingStartedAssets";
import { DownloadIcon } from "./AdminIcons";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";





export default function AdminHeader({ actionButton, isExport = false}: Readonly<{ label: string, actionButton: ReactNode | ReactNode[], isExport?: boolean }>) {

    const router = useRouter();

    return <div className='flex bg-white px-10 py-3 justify-between items-center border-b border-gray-100 relative z-20'>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => router.back()}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-600"
                title="Go Back"
            >
                <BackIcon className="w-4 h-4" />
            </button>

        </div>
        <div className="flex gap-2 justify-between">
            {
                isExport &&
                <ExportButton className="inline-flex gap-2 border px-2 items-center"><span><DownloadIcon /></span><span>EXPORT</span></ExportButton>
            }
            {Array.isArray(actionButton) ? actionButton.map((button, index) => <span key={index}>{button}</span>) : actionButton}
            {/* {actionButton} */}
            {/* <Button className='px-2 text-sm'>CREATE EXAM SESSION</Button> */}
        </div>

    </div>
}