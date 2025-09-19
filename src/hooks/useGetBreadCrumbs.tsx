import { usePathname } from 'next/navigation';

export default function useGetBreadCrumbs(): string[] {
    const pathName = usePathname()
    const pathSegments = pathName.split('/').filter(Boolean);
    return pathSegments;
}
