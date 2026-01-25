"use client"
import { AuthLoginResponse, AuthState } from '@/types/auth';
import { UserProfileType } from '@/types/UserMgtType';
import React, { createContext, Dispatch, useContext, useEffect, useReducer } from 'react';

type Actions =
    | {
        type: "loginSuccess";
        payload: AuthLoginResponse;
    }
    | {
        type: "logout";
    }
    | {
        type: "updateProfile";
        payload: UserProfileType;
    }

const INIT_SESSION = 'loginSuccess';
const DESTROY_SESSION = 'logout';
const UPDATE_PROFILE = 'updateProfile';
const studentRoles = new Set(['screening', 'league', 'final', 'winner']);
const staffRoles = new Set(['volunteer', 'moderator', 'admin', 'manager', 'superadmin', 'sponsor']);

const reducer = (state: AuthState, action: Actions): AuthState => {
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
                    user: null,
                    profile: null
                }
            }
            
            const isStudent = studentRoles.has(payload?.profile?.role ?? '');
            const isStaff = staffRoles.has(payload?.profile?.role ?? '')
            const user = {
                ...payload.profile.user,
                role: payload.profile.role,
                school_name: payload.profile.school_name || ''
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
                profile: payload.profile,
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
                userType: null,
                profile: null
            }
        }

        case UPDATE_PROFILE: {
            const storedSession = localStorage.getItem('session');
            if (storedSession) {
                const session = JSON.parse(storedSession);
                session.profile = action.payload;
                localStorage.setItem('session', JSON.stringify(session));
            }
            
            const isStudent = studentRoles.has(action.payload.role ?? '');
            
            return {
                ...state,
                profile: action.payload,
                userType: isStudent ? 'candidate' : 'staff',
                user: {
                    ...action.payload.user,
                    role: action.payload.role,
                    school_name: action.payload.school_name || ''
                }
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
        user: null,
        profile: null
    });



    useEffect(() => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      try {
        const parsedSession: AuthLoginResponse = JSON.parse(storedSession);
        if (parsedSession?.access) {
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