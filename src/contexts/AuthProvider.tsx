"use client"
import { AuthLoginResponse } from '@/types/auth';
import client from '@/utils/axios';
import { useRouter } from 'next/navigation';
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
const studentRoles = ['screening', 'league', 'final', 'winner']
const staffRoles = ['volunteer', 'moderator', 'admin', 'manager', 'superadmin', 'sponsor'];

const reducer = (state: AuthState, action: Actions) => {
    switch (action.type) {
        case INIT_SESSION: {
            const payload = action.payload
            localStorage.setItem('session', JSON.stringify(payload));
            if (!payload) {
                return {
        homePath: '',
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        userType:null,
        user:null
    }
            }
            console.log(payload, 'what do we have')
            // client.defaults.headers.common["Authorization"] = `Bearer ${payload.access}`

            const isStudent = studentRoles.includes(payload?.profile?.role??'');
            const isStaff = staffRoles.includes(payload?.profile?.role??'')
            const user={
                ...payload.profile.user,
                role:payload.profile.role,
                school:payload.profile.school
            }
            const homePath = isStudent ? '/exam-portal' : 'admin';
            return {
                token: payload.access,
                refreshToken: payload.refresh,
                userType:isStudent?'Candidate':'Staff',
                homePath,
                user,
                isAuthenticated: true
            }
        }

        case DESTROY_SESSION: {
            localStorage.removeItem('session')
            return {
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                user:null,
                userType:null

            }
        }

        default:
            return state;
    }
}





type AuthState = {
    token: string | null;
    homePath?: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    user:{[x:string]:any}|null;
    userType:string|null;
}


const AuthContext = createContext<{ authState?: AuthState, dispatch: Dispatch<Actions> }>({ authState: undefined, dispatch: () => { } })
export default function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [state, dispatch] = useReducer(reducer, {
        homePath: '',
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        userType:null,
        user:null
    });

   


    return <AuthContext.Provider value={{ authState: state, dispatch }}>
        {children}
    </AuthContext.Provider>
}


export const useAuth = () => {
    return useContext(AuthContext);
}