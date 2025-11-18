import axios from 'axios'
import config from '../../config'


const client = axios.create({
    baseURL: config.BASE_URL,
    // timeout:4000,
    headers: {
        Accept: "application/json",
        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY


    }
});




client.interceptors.request.use(
    (config) => {
        if (typeof window !==undefined) {
            const token = localStorage.getItem("session");
            if (token) {
                const storedtoken = JSON.parse(token);
                config.headers.Authorization = `Bearer ${storedtoken.access}`;
            }
            
        }
        return config;
    },
    (error) => Promise.reject(error)
);


client.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized - logging out");
            localStorage.removeItem("session");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);














export default client;