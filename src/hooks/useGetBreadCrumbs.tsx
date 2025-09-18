import { usePathname } from 'next/navigation';

export default function useGetBreadCrumbs() {
   const pathName = usePathname()
    const pathSegments = pathName.split('/').filter(Boolean);
    return pathSegments;    
}
