import axios from 'axios';

const api = axios.create({
    //production
    baseURL: "flierchatserver-production.up.railway.app:5000"
    //development
    /* baseURL: "http://localhost:5000/api", */
});

export default api;