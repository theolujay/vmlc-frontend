import { socketUrl } from '@/constants/socketUrl'
import { io } from 'socket.io-client'

const session = localStorage.getItem("session")
const token = session ? JSON.parse(session) : null

export const socket = io(socketUrl, {
    transports: ['websocket'],
    auth: {
        token: token ? `Bearer ${token.access}` : '',
        apiKey: process.env.NEXT_PUBLIC_API_KEY
    }
})
