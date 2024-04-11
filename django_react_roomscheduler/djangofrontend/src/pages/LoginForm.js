import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Input} from "reactstrap";
import axios from "axios";

export default function LoginForm() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');
    const login = async (email, password) => {
      try {
        const response = await axios.post('http://localhost:8000/login/', { 'email':email.toString(), 'password':password });
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


    try {
      const data = await login( email, password );
      localStorage.setItem('access_token', data.access);
      console.log(localStorage.getItem('access_token'))
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      window.location.href = '/dashboard';
    } catch (error) {
      setLoginError('Login failed. Please check your credentials and try again.');
    }
  };

    return (
        <div className="bg-dark-purple-900 flex justify-center items-center h-screen w-screen">
            <style>{
                `
                body {
                    background-image: url("/carroll-campus.jpg");
                    background-size: cover;
                }
                `
            }
            </style>
            <div className="border-t-8 rounded-sm border-purple-900 bg-dark-purple-800 p-12 shadow-2xl w-96 bg-white">
                <h1 className="font-bold text-center block text-2xl text-purple-950">Login</h1>
                <div className="bg-dark-purple-800 rounded-t-lg overflow-hidden mb-8">
                    <img src="/icons/shield.png" alt="Login Image" className="w-48 mx-auto"/>
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
                            <div className="mt-4">
                                <Button
                                    className="rounded-full px-4 py-2 text-sm font-medium text-purple-400 bg-purple-700 border border-purple-900 hover:bg-purple-800 hover:text-purple-200 focus:z-10 focus:ring-2 focus:ring-purple-900 dark:bg-purple-900 dark:border-purple-800 dark:text-purple-200 dark:hover:text-purple-200 dark:hover:bg-purple-800 dark:focus:ring-purple-900 dark:focus:text-purple-200"
                                    value="Submit" label="Login In"
                                >
                                    Login In
                                </Button>
                                <a href="/register/"
                                   className="inline-block ml-4 text-sm font-medium text-purple-900 hover:text-purple-400">
                                    Sign Up
                                </a>
                            </div>
                            <div className="text-center mt-4">
                                <a
                                    className="inline-block rounded-full px-4 py-2 text-white bg-purple-700 border border-purple-900 hover:bg-purple-400 hover:text-purple-200 focus:z-10 focus:ring-2 focus:ring-purple-900 dark:bg-purple-900 dark:border-purple-800 dark:text-purple-200 dark:hover:text-purple-200 dark:hover:bg-purple-800 dark:focus:ring-purple-900 dark:focus:text-purple-200"
                                    href="https://your-okta-domain.com/oauth2/default/v1/authorize?clientId=your-okta-client-id&redirectUri=your-redirect-uri&responseType=code&scope=openid%20profile%20email">
                                    <img src="https://cdnlogo.com/logos/o/10/okta.svg" alt="Okta Logo"
                                         className="mr-2 inline-block h-6 w-6"/>
                                    Login with Okta
                                </a>
                            </div>
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