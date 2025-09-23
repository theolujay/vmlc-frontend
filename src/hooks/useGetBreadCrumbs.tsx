"use client"
import { usePathname } from 'next/navigation';

export default function useGetBreadCrumbs(): string[] {
    const pathName = usePathname()
    console.log("Pathname:", pathName); // Debugging line to check the pathname
    const pathSegments = pathName.split('/').filter(Boolean);
    return pathSegments;
}
