import axios from 'axios'
import config from '../../config'

const client = axios.create({
    baseURL: config.BASE_URL,
    headers:{
        Accept:"application/json"
    }
});

export default client;