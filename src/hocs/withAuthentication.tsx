import { useAuth } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function withAuthentication<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function ProtectedRoute(props: P) {
        const { authState } = useAuth();
        const router = useRouter();
        useEffect(() => {
            if (!authState?.isAuthenticated) {
                router.push('/auth/login')
            }
        }, [authState, router])

        return <WrappedComponent {...props} />;
    }
}
