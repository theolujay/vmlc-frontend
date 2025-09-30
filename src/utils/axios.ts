import axios from 'axios'
import config from '../../config'

console.log(config.BASE_URL,'what us here')
const client = axios.create({
    baseURL: config.BASE_URL,
    // timeout:4000,
    headers:{
        Accept:"application/json",
        'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY

    
    }
});

export default client;