import React, {useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Input} from "reactstrap";
import axios from "axios";

export default function UpdatePasswordForm() {

    const email = localStorage.getItem('email').toString();
    const [updatePasswordError, setUpdatePasswordError] = useState('');
    const navigate = useNavigate();
    const updatePassword = async (email, password) => {
        try {
            console.log(password)
            const response = await axios.post('http://localhost:8000/updatePassword/', {
                'email' : email,
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
        const confirmPassword = formData.get('confirmPassword');
        try {

            if(password !== confirmPassword){
                setUpdatePasswordError("Passwords did not match")
                return
            }
            if(password.length < 8){
                setUpdatePasswordError("Password not long enough")
                return
            }

            let hasCapital = false
            let hasNumber = false

            for(let i = 0; i < password.length; i++){
                let ch = password[i]
                if(ch.charCodeAt(0) >= 65 && ch.charCodeAt(0) <= 90){
                    hasCapital = true
                }
                if(!isNaN(ch)){
                    hasNumber = true
                }
            }

            if(hasCapital === false){
                setUpdatePasswordError("Password requires a capital letter")
                return
            }

            if(hasNumber === false){
                setUpdatePasswordError("Password requires a number")
                return
            }

            console.log(email);
            const data = await updatePassword(email, password);
            window.location.href = '/dashboard';
        } catch (error) {
            console.log(error)
            setUpdatePasswordError("There was an error updating your password")
        }
    };

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <style>{
                `
                body {
                    background-image: url("/carroll-campus.jpg");
                    background-size: cover;
                }
                `
            }
            </style>
            <div className="border-t-8 rounded-sm border-purple-900 bg-white p-12 shadow-2xl w-96">
                <h1 className="font-bold text-center block text-2xl text-violet-900">Update Password</h1>
                <form onSubmit={handleSubmit}>
                    <Input type="hidden" value={email} id="email" name="email" />
                    <div className="mt-4">
                        <Input
                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-violet-700 ring-1 ring-inset ring-violet-300 placeholder:text-violet-400 focus:ring-2 focus:ring-inset focus:ring-violet-800 sm:text-sm sm:leading-6"
                            type="password" id="password" name="password" label="Password" placeholder="••••••••••"
                        />
                    </div>
                    <div className="mt-4">
                        <Input
                            className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-violet-700 ring-1 ring-inset ring-violet-300 placeholder:text-violet-400 focus:ring-2 focus:ring-inset focus:ring-violet-800 sm:text-sm sm:leading-6"
                            type="password" id="confirmPassword" name="confirmPassword" label="Confirm Password" placeholder="••••••••••"
                        />
                    </div>
                    <div className="mt-4">
                        <Button
                            className="rounded-full px-4 py-2 text-sm font-medium text-violet-700 bg-violet-200 border border-violet-400 hover:bg-violet-300 hover:text-violet-800 focus:z-10 focus:ring-2 focus:ring-violet-800 dark:bg-violet-700 dark:border-violet-600 dark:text-white dark:hover:text-white dark:hover:bg-violet-600 dark:focus:ring-violet-800 dark:focus:text-white"
                            value="Submit" label="Update Password"
                        >
                            Update Password
                        </Button>

                        <a href="/dashboard"
                           className="ml-3 rounded-full px-4 py-2 text-sm font-medium text-violet-700 bg-violet-200 border border-violet-400 hover:bg-violet-300 hover:text-violet-800 focus:z-10 focus:ring-2 focus:ring-violet-800 dark:bg-violet-700 dark:border-violet-600 dark:text-white dark:hover:text-white dark:hover:bg-violet-600 dark:focus:ring-violet-800 dark:focus:text-white"
                        >
                            Back
                        </a>
                    </div>
                </form>
                {updatePasswordError && (
                    <div className="text-violet-400 mt-4">
                        {updatePasswordError}
                    </div>
                )}
            </div>
        </div>
    );
}
