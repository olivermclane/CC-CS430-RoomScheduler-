import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import logger from "../../loggers/logger";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('access_token'));
    const axiosInstanceRef = useRef(createAxiosInstance());

    function createAxiosInstance() {
        const instance = axios.create({
            baseURL: '/api',
            timeout: 20000,
        });

        updateAuthorizationHeader(instance, localStorage.getItem('access_token'));
        return instance;
    }

    function updateAuthorizationHeader(axiosInstance, token) {
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    }

    const forceLogout = useCallback(() => {
        localStorage.clear();
        setAuthToken(null);
        window.location.href = '/login';
    }, []);

    useEffect(() => {
        const axiosInstance = axiosInstanceRef.current;
        const requestQueueInterceptor = axiosInstance.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const response = await axiosInstance.post('/login/refresh/', {
                            refresh: localStorage.getItem('refresh_token')
                        });

                        const { access, refresh } = response.data;
                        localStorage.setItem('access_token', access);
                        localStorage.setItem('refresh_token', refresh);
                        setAuthToken(access);
                        updateAuthorizationHeader(axiosInstance, access);
                        originalRequest.headers['Authorization'] = `Bearer ${access}`;
                        return axiosInstance(originalRequest);
                    } catch (error) {
                        forceLogout();
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(requestQueueInterceptor);
        };
    }, [forceLogout]);

    useEffect(() => {
        updateAuthorizationHeader(axiosInstanceRef.current, authToken);
    }, [authToken]);

    return (
        <AuthContext.Provider value={{ authToken, axiosInstance: axiosInstanceRef.current }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}