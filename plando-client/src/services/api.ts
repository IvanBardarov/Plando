import axios from "axios";

const instance = axios.create({
    baseURL: "https://localhost:62630/api",
});

instance.interceptors.request.use(config => {
    const jwtToken = localStorage.getItem('jwtToken');

    if(jwtToken){
        config.headers.Authorization = `Bearer ${jwtToken}`;
    };

    return config;
});

export default instance;