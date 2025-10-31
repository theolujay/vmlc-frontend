import 'dotenv/config'
export const socketUrl = `ws://${process.env.NEXT_PUBLIC_BASE_URL}/v1/ws/notifications/`