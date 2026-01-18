import 'dotenv/config'
const config = {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    LANDING_URL: process.env.NEXT_PUBLIC_LANDING_URL,
    GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY
}

export default config;