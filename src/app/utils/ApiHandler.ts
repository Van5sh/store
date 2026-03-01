import axios, { AxiosError } from 'axios';

export const apiHandler = axios.create({
    baseURL: process.env.BACKEND_URL,
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true,
    timeout:5000
})

apiHandler.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      console.error('Unauthorized');
    }

    return Promise.reject(error);
  }
);