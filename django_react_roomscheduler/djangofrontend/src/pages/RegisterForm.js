import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Input} from "reactstrap";
import axios from "axios";

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registrationError, setRegistrationError] = useState('');
    const navigate = useNavigate();
    const login = async (email, password) => {
        try {
            console.log(password)
            const response = await axios.post('http://localhost:8000/register/', {
                'email': email.toString(),
                'password': password
            });
            console.log(response)
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget); // Use e.currentTarget
        const email = formData.get('email');
        const password = formData.get('password');
        console.log(email)
        console.log(password)

        try {
            const data = await login(email, password);
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
            window.location.href = '/login';
        } catch (error) {
            setRegistrationError(error.message || 'Registration failed. Please check with your provider.');
        }
    };

    return (
        <div className="bg-white flex justify-center items-center h-screen w-screen">
            <div className="border-t-8 rounded-sm border-violet-400 bg-white p-12 shadow-2xl w-96">
                <h1 className="font-bold text-center block text-2xl text-violet-900">Register</h1>
                <form onSubmit={handleSubmit}>
                    <Input
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-violet-700 ring-1 ring-inset ring-violet-300 placeholder:text-violet-400 focus:ring-2 focus:ring-inset focus:ring-violet-800 sm:text-sm sm:leading-6"
                        type="email" id="email" name="email" label="Email" placeholder="Email"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="mt-4">
                        <Input
                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-violet-700 ring-1 ring-inset ring-violet-300 placeholder:text-violet-400 focus:ring-2 focus:ring-inset focus:ring-violet-800 sm:text-sm sm:leading-6"
                            type="password" id="password" name="password" label="Password" placeholder="••••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="mt-4">
                            <div className="mt-4">
                                <Button
                                    className="rounded-full px-4 py-2 text-sm font-medium text-violet-700 bg-violet-200 border border-violet-400 hover:bg-violet-300 hover:text-violet-800 focus:z-10 focus:ring-2 focus:ring-violet-800 dark:bg-violet-700 dark:border-violet-600 dark:text-white dark:hover:text-white dark:hover:bg-violet-600 dark:focus:ring-violet-800 dark:focus:text-white"
                                    value="Submit" label="Register in"
                                >
                                    Register
                                </Button>
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
