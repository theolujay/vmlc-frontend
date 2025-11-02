// // import { useAuth } from '@/contexts/AuthProvider';
// // import { useRouter } from 'next/navigation';
// // import React, { useEffect } from 'react'

// // export default function withAuthentication<P extends object>(WrappedComponent: React.ComponentType<P>) {
// //     return function ProtectedRoute(props: P) {
// //         const { authState } = useAuth();
// //         const router = useRouter();
// //         useEffect(() => {
// //             if (!authState?.isAuthenticated) {
// //                 router.push('/auth/login')
// //             }
// //         }, [authState, router])

// //         return <WrappedComponent {...props} />;
// //     }
// // }





// import { useAuth } from '@/contexts/AuthProvider';
// import { useRouter, usePathname } from 'next/navigation';
// import React, { useEffect } from 'react';

// export default function withAuthentication<P extends object>(
//   WrappedComponent: React.ComponentType<P>
// ) {
//   return function ProtectedRoute(props: P) {
//     const { authState } = useAuth();
//     const router = useRouter();
//     const pathname = usePathname(); // 🔹 current route path

//     useEffect(() => {
//       if (!authState?.isAuthenticated) {
//         // redirect to login with return url as query param
//         sessionStorage.setItem("returnURL", pathname);
//         router.push(`/auth/login`);
//       }
//     }, [authState, router, pathname]);

//     return <WrappedComponent {...props} />;
//   };
// }



import { useAuth } from '@/contexts/AuthProvider';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

export default function withAuthentication<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function ProtectedRoute(props: P) {
    const { authState } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
      if (!authState?.isAuthenticated) {
        // Combine pathname + search params
        const fullURL = `${pathname}?${searchParams.toString()}`;
        sessionStorage.setItem("returnURL", fullURL);
        router.push('/login');
      }
    }, [authState, router, pathname, searchParams]);

    return <WrappedComponent {...props} />;
  };
}
