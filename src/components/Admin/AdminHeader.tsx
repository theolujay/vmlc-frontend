"use client"
import useGetBreadCrumbs from "@/hooks/useGetBreadCrumbs";
import { ExportButton } from "../ui/Button";
import { GreaterThanIcon, HomeIcon } from "../General/GettingStarted/GettingStartedAssets";
import Link from "next/link";
import { capitalizeWord } from "@/utils/capitalizeWords";
import { DownloadIcon } from "./AdminIcons";
import { ReactNode } from "react";





export default function AdminHeader({ label, actionButton, isExport = false}: Readonly<{ label: string, actionButton: ReactNode | ReactNode[], isExport?: boolean }>) {

    const pathSegments = useGetBreadCrumbs();

    return <div className='flex bg-white px-10 py-3 justify-between items-center'>
        <div className="flex flex-col gap-0.5">
            {/* <p className='font-normal inline-flex flex-wrap gap-2 text-lg md:text-2xl'><span>Staff Portal</span><span>{label}</span></p> */}
            <div className="flex gap-2">
                <ol className='flex'>
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
                            {isLast ? <span>{capitalizeWord(decodeHref)}</span> : <Link href={href} className='text-[#667185]'>{capitalizeWord(decodeHref)}</Link>}
                        </li>
                    })}
                </ol>
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