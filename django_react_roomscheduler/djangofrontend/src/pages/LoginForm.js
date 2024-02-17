import React, {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Input} from "reactstrap";
import axios from "axios";

export default function LoginForm() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');
    const login = async (email, password) => {
      try {
        console.log(password)
        const response = await axios.post('http://localhost:8000/login/', { 'email':email.toString(), 'password':password });
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
      const data = await login( email, password );
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      window.location.href = '/dashboard';
    } catch (error) {
      setLoginError(error.message || 'Login failed. Please check your credentials and try again.');
    }
  };

    return (
        <div className="bg-white flex justify-center items-center h-screen w-screen">
            <div className="border-t-8 rounded-sm border-violet-400 bg-white p-12 shadow-2xl w-96">
                <h1 className="font-bold text-center block text-2xl text-violet-900">Login</h1>
                <div className="bg-white rounded-t-lg overflow-hidden mb-8">
                    <img src="/icons/shield.png" alt="Login Image"
                         className="w-48 mx-auto"/>
                </div>
                <form onSubmit={handleSubmit}>
                    <Input
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-violet-700 ring-1 ring-inset ring-violet-300 placeholder:text-violet-400 focus:ring-2 focus:ring-inset focus:ring-violet-800 sm:text-sm sm:leading-6"
                        type="email" id="email" name="email" label="Email" placeholder="Email"
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
                                    value="Submit" label="Login In"
                                >
                                    Login In
                                </Button>
                                <a href="/register/"
                                   className="inline-block ml-4 text-sm font-medium text-violet-700 hover:text-violet-600">
                                    Sign Up
                                </a>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="text-center mt-4">
                     <a
/*
                    <a href="https://your-okta-domain.com/oauth2/default/v1/authorize?clientId=your-okta-client-id&redirectUri=your-redirect-uri&responseType=code&scope=openid%20profile%20email"
*/
                       className="inline-block rounded-full px-4 py-2 text-violet-700 bg-violet-200 border border-violet-400 hover:bg-violet-300 hover:text-violet-800 focus:z-10 focus:ring-2 focus:ring-violet-800 dark:bg-violet-700 dark:border-violet-600 dark:text-white dark:hover:text-white dark:hover:bg-violet-600 dark:focus:ring-violet-800 dark:focus:text-white">
                        Login with Okta
                    </a>
                </div>
                {loginError && (
                    <div className="text-violet-400 mt-4">  {loginError}
                    </div>
                )}
            </div>
        </div>
    );
}
