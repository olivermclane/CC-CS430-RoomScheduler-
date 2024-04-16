import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authToken, setAuthToken] = useState(localStorage.getItem('access_token'));
    console.log(authToken)
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

    const refreshAuthToken = useCallback(async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const refreshedResponse = await axiosInstance.post('/login/refresh/', {refresh: refreshToken});
            const {access: newAccessToken} = refreshedResponse.data;

            localStorage.setItem('access_token', newAccessToken);
            setAuthToken(newAccessToken);
            return newAccessToken;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            forceLogout();
            return null;
        }
    }, [forceLogout]);

    // Setup Axios Interceptors for handling 401 Unauthorized globally
    useEffect(() => {
        const responseInterceptor = axiosInstance.interceptors.response.use(
            response => response, // Simply return for any non-error response
            async error => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    // Mark it to avoid infinite loop
                    prevRequest.sent = true;
                    const newAccessToken = await refreshAuthToken();
                    if (newAccessToken) {
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosInstance(prevRequest); // Retry the request with new token
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [refreshAuthToken]);

    // Automatically update axiosInstance headers when authToken changes
    useEffect(() => {
        if (authToken) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    }, [authToken, axiosInstance]);

    return (
        <AuthContext.Provider value={{ authToken, refreshAuthToken, axiosInstance }}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    return useContext(AuthContext);
}
