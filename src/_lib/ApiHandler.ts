import axios, { AxiosError } from 'axios';

export const apiHandler = axios.create({
    baseURL:'http://localhost:3000/api',
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