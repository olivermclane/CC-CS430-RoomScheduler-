import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000',
        timeout: 20000,
    });

    const forceLogout = useCallback(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Redirect to login page
        window.location.href = '/login';
    }, []);

    useEffect(() => {
        let isRefreshing = false;
        let refreshSubscribers = [];

        const requestQueueInterceptor = axiosInstance.interceptors.response.use(
            response => response,
            error => {
                const originalRequest = error.config;
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    if (!isRefreshing) {
                        isRefreshing = true;
                        axios.post('http://localhost:8000/login/refresh/', {
                            refresh: localStorage.getItem('refresh_token')
                        }).then(response => {
                            const { access, refresh } = response.data;
                            localStorage.setItem('access_token', access);
                            localStorage.setItem('refresh_token', refresh);

                            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                            originalRequest._retry = true;
                            refreshSubscribers.forEach(callback => callback(access));
                            refreshSubscribers = [];
                        }).catch(() => {
                            forceLogout();
                        }).finally(() => {
                            isRefreshing = false;
                        });
                    }
                    return new Promise(resolve => {
                        refreshSubscribers.push(access => {
                            originalRequest.headers.Authorization = `Bearer ${access}`;
                            resolve(axiosInstance(originalRequest));
                        });
                    });
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(requestQueueInterceptor);
        };
    }, [forceLogout, axiosInstance]);

    useEffect(() => {
        if (authToken) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    }, [authToken, axiosInstance]);

    return (
        <AuthContext.Provider value={{ authToken, axiosInstance }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
