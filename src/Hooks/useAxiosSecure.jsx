import axios from 'axios';
import React from 'react';

const axiosSecure = axios.create({
    baseURL: 'https://city-fix-server-one.vercel.app'
})

const useAxiosSecure = () => {
    
    return axiosSecure;
};

export default useAxiosSecure;