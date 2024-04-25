import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Input} from "reactstrap";
import axios from "axios";
import logger from "../loggers/logger";
import carrollCampusImage from '../icons/carroll-campus.jpg'; // Import the image


export default function RegisterForm() {

    const [registrationError, setRegistrationError] = useState('');
    const navigate = useNavigate();
    const login = async (email, password, username) => {
        try {
            const response = await axios.post('http://localhost:8000/register/', {
                'email': email.toString(),
                'username': username,
                'password': password
            });
            logger.info("User registered with email ", email.toString())
            return response.data;
        } catch (error) {
            logger.error("User failed to register with email", email.toString())
            throw error;
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget); // Use e.currentTarget
        const email = formData.get('email');
        const password = formData.get('password');
        const username = formData.get('username')
        try {
            const data = await login(email, password, username);
            navigate('/login')
        } catch (error) {
            setRegistrationError(error.message || 'Registration failed. Please check with your provider.');
            // logger.info("Registration failed for user with email ", email)
        }
    };

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <style>{
                `
                body {
                    background-image: url(${carrollCampusImage});
                    background-size: cover;
                }
                `
            }
            </style>
            <div className="border-t-8 rounded-sm border-purple-900 bg-white p-12 shadow-2xl w-96">
                <h1 className="font-bold text-center block text-2xl text-violet-900">Register</h1>
                <form onSubmit={handleSubmit}>
                    <Input
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-violet-700 ring-1 ring-inset ring-violet-300 placeholder:text-violet-400 focus:ring-2 focus:ring-inset focus:ring-violet-800 sm:text-sm sm:leading-6"
                        type="email" id="email" name="email" label="Email" placeholder="Email"
                    />
                    <div className="mt-4">
                        <Input
                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-violet-700 ring-1 ring-inset ring-violet-300 placeholder:text-violet-400 focus:ring-2 focus:ring-inset focus:ring-violet-800 sm:text-sm sm:leading-6"
                            type="username" id="username" name="username" label="Username" placeholder="Username"
                        />

                        <div className="mt-4">
                            <Input
                                className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-violet-700 ring-1 ring-inset ring-violet-300 placeholder:text-violet-400 focus:ring-2 focus:ring-inset focus:ring-violet-800 sm:text-sm sm:leading-6"
                                type="password" id="password" name="password" label="Password" placeholder="••••••••••"
                            />
                            <div className="mt-4">
                                <div className="mt-4">
                                    <Button
                                        className="rounded-full px-4 py-2 text-sm font-medium text-violet-700 bg-violet-200 border border-violet-400 hover:bg-violet-300 hover:text-violet-800 focus:z-10 focus:ring-2 focus:ring-violet-800 dark:bg-violet-700 dark:border-violet-600 dark:text-white dark:hover:text-white dark:hover:bg-violet-600 dark:focus:ring-violet-800 dark:focus:text-white"
                                        value="Submit" label="Register in"
                                    >
                                        Register
                                    </Button>
                                    <Button onClick={navigate('/login')}
                                        className="rounded-full px-4 py-2 text-sm font-medium text-violet-700 bg-violet-200 border border-violet-400 hover:bg-violet-300 hover:text-violet-800 focus:z-10 focus:ring-2 focus:ring-violet-800 dark:bg-violet-700 dark:border-violet-600 dark:text-white dark:hover:text-white dark:hover:bg-violet-600 dark:focus:ring-violet-800 dark:focus:text-white"
                                    >
                                        Back
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                {registrationError && (
                    <div className="text-violet-400 mt-4">
                        {registrationError}
                    </div>
                )}
            </div>
        </div>
    );
}
