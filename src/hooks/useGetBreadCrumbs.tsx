"use client"
import { usePathname } from 'next/navigation';

export default function useGetBreadCrumbs(): string[] {
    const pathName = usePathname()
    if (!pathName) return [];
    const pathSegments = pathName.split('/').filter(Boolean);
    return pathSegments;
}
