"use client"
import { AuthLoginResponse, AuthState } from '@/types/auth';
import React, { createContext, Dispatch, useContext, useEffect, useReducer } from 'react';

type Actions =
    | {
        type: "loginSuccess";
        payload: AuthLoginResponse;
    }
    | {
        type: "logout";
    }

const INIT_SESSION = 'loginSuccess';
const DESTROY_SESSION = 'logout';
const studentRoles = new Set(['screening', 'league', 'final', 'winner']);
const staffRoles = new Set(['volunteer', 'moderator', 'admin', 'manager', 'superadmin', 'sponsor']);

const reducer = (state: AuthState, action: Actions) => {
    switch (action.type) {
        case INIT_SESSION: {
            sessionStorage.removeItem("returnURL"); 
            const payload = action.payload
            localStorage.setItem('session', JSON.stringify(payload));
            if (!payload) {
                return {
                    homePath: '',
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    userType: null,
                    user: null
                }
            }
            
            // client.defaults.headers.common["Authorization"] = `Bearer ${payload.access}`

            const isStudent = studentRoles.has(payload?.profile?.role ?? '');
            const isStaff = staffRoles.has(payload?.profile?.role ?? '')
            const user = {
                ...payload.profile.user,
                role: payload.profile.role,
                school_name: payload.profile.school_name
            }
            const returnUrl = sessionStorage.getItem("returnURL");
            
            let homePath = '/login';
            if (returnUrl) {
                homePath = returnUrl;
            } else if (isStudent) {
                homePath = '/exam-portal';
            } else if (isStaff) {
                homePath = '/admin/overview';
            }

            return {
                token: payload.access,
                refreshToken: payload.refresh,
                userType: isStudent ? 'candidate' : 'staff',
                homePath,
                user,
                isAuthenticated: true
            }
        }

        case DESTROY_SESSION: {
            localStorage.removeItem('session')
            sessionStorage.removeItem("returnURL");
            
            return {
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                user: null,
                userType: null

            }
        }

        default:
            return state;
    }
}








const AuthContext = createContext<{ authState?: AuthState, dispatch: Dispatch<Actions> }>({ authState: undefined, dispatch: () => { } })
export default function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [state, dispatch] = useReducer(reducer, {
        homePath: '',
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        userType: null,
        user: null
    });



    useEffect(() => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      try {
        const parsedSession: AuthLoginResponse = JSON.parse(storedSession);
        if (parsedSession?.access) {
        //   client.defaults.headers.common["Authorization"] = `Bearer ${parsedSession.access}`;
          dispatch({ type: INIT_SESSION, payload: parsedSession });
        }
      } catch (error) {
        console.error("Failed to parse session:", error);
        localStorage.removeItem('session');
      }
    }
  }, []);



    return <AuthContext.Provider value={{ authState: state, dispatch }}>
        {children}
    </AuthContext.Provider>
}


export const useAuth = () => {
    return useContext(AuthContext);
}