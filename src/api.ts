import axios from 'axios';

const api = axios.create({
    //production
    baseURL: "https://flierchatserver-production.up.railway.app/api"
    //development
    /* baseURL: "http://localhost:5000/api", */
});

export default api;