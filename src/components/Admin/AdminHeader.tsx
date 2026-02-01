"use client"
import useGetBreadCrumbs from "@/hooks/useGetBreadCrumbs";
import { ExportButton } from "../ui/Button";
import { GreaterThanIcon, HomeIcon, BackIcon } from "../General/GettingStarted/GettingStartedAssets";
import Link from "next/link";
import { capitalizeWord } from "@/utils/capitalizeWords";
import { DownloadIcon } from "./AdminIcons";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";





export default function AdminHeader({ label, actionButton, isExport = false}: Readonly<{ label: string, actionButton: ReactNode | ReactNode[], isExport?: boolean }>) {

    const pathSegments = useGetBreadCrumbs();
    const router = useRouter();

    return <div className='flex bg-white px-10 py-3 justify-between items-center border-b border-gray-100'>
        <div className="flex items-center gap-4">
            <button 
                onClick={() => router.back()}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-600"
                title="Go Back"
            >
                <BackIcon className="w-4 h-4" />
            </button>
            <div className="flex flex-col gap-0.5">
                <div className="flex gap-2">
                    <ol className='flex items-center'>
                        {pathSegments.map((segment, index) => {
                        const href = '/' + pathSegments.slice(0, index + 1).join('/');
                        const isLast = index == pathSegments.length - 1;
                        const decodeHref = decodeURIComponent(segment)

                        if (index == 0) {
                            return <li key={href} className='inline-flex items-center justify-between text-[#667185] gap-1 px-1'>
                                <span><HomeIcon /></span>
                                <Link href={href}>{capitalizeWord(decodeHref)}</Link>
                            </li>
                        }
                        return <li key={href} className='inline-flex justify-between px-1 items-center gap-1'>
                            <span><GreaterThanIcon /></span>
                            {isLast ? <span>{label || capitalizeWord(decodeHref)}</span> : <Link href={href} className='text-[#667185]'>{capitalizeWord(decodeHref)}</Link>}
                        </li>
                    })}
                </ol>
            </div>

        </div>
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