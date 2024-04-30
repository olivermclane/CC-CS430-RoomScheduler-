import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Input} from "reactstrap";
import logger from "../loggers/logger";
import carrollCampusImage from '../icons/carroll-campus.jpg';
import shieldImage from '../icons/shield.png';
import {useAuth} from "../service/auth/AuthProvider";

export default function LoginForm() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');
    const {axiosInstance} = useAuth();

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post('/login/', {email, password});
            logger.info("User attempted login", email);
            const {access, refresh, username, email: userEmail} = response.data;
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('username', username);
            localStorage.setItem('email', email);

            // Set authorization header in Axios instance
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            // Redirect to dashboard after successful login
            navigate('/dashboard');
        } catch (error) {
            console.log("Error ", error);
            throw error;
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            await login(email, password);
        } catch (error) {
            setLoginError('Login failed. Please check your credentials and try again.');
            logger.error('Login failed for user', email);
        }
    };

    return (
        <div className="bg-dark-purple-900 flex justify-center items-center h-screen w-screen">
            <style>{
                `
                body {
                    background-image: url(${carrollCampusImage});
                    background-size: cover;
                }
                `
            }
            </style>
            <div className="border-t-8 rounded-sm border-purple-900 bg-dark-purple-800 p-12 shadow-2xl w-96 bg-white">
                <h1 className="font-bold text-center block text-2xl text-purple-950">Login</h1>
                <div className="bg-dark-purple-800 rounded-t-lg overflow-hidden mb-8">
                    <img src={shieldImage} alt="Login Image" className="w-48 mx-auto"/>
                </div>
                <form onSubmit={handleSubmit}>
                    <Input
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-purple-400 ring-1 ring-inset ring-purple-700 placeholder:text-purple-500 focus:ring-2 focus:ring-inset focus:ring-purple-900 sm:text-sm sm:leading-6"
                        type="email" id="email" name="email" label="Email" placeholder="Email"
                    />
                    <div className="mt-4">
                        <Input
                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-purple-400 ring-1 ring-inset ring-purple-700 placeholder:text-purple-500 focus:ring-2 focus:ring-inset focus:ring-purple-900 sm:text-sm sm:leading-6"
                            type="password" id="password" name="password" label="Password" placeholder="••••••••••"
                        />
                        <div className="mt-4">
                            <Button
                                className="rounded-full px-4 py-2 text-sm font-medium text-purple-400 bg-purple-700 border border-purple-900 hover:bg-purple-800 hover:text-purple-200 focus:z-10 focus:ring-2 focus:ring-purple-900 dark:bg-purple-900 dark:border-purple-800 dark:text-purple-200 dark:hover:text-purple-200 dark:hover:bg-purple-800 dark:focus:ring-purple-900 dark:focus:text-purple-200"
                                type="submit"
                            >
                                Login
                            </Button>
                            <Button
                                className="rounded-full px-4 py-2 text-sm font-medium text-purple-400 bg-purple-700 border border-purple-900 hover:bg-purple-800 hover:text-purple-200 focus:z-10 focus:ring-2 focus:ring-purple-900 dark:bg-purple-900 dark:border-purple-800 dark:text-purple-200 dark:hover:text-purple-200 dark:hover:bg-purple-800 dark:focus:ring-purple-900 dark:focus:text-purple-200"
                                onClick={() => navigate('/register')}
                            >
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </form>
                {loginError && (
                    <div className="text-purple-400 mt-4">{loginError}</div>
                )}
            </div>
        </div>
    );
}
