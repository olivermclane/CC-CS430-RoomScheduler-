import React, {useState} from 'react';
import LoginForm from './pages/LoginForm';
import RegisterForm from "./pages/RegisterForm";
import Dashboard from "./pages/Dashboard";
import Insight from './pages/Insight'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthProvider} from "./service/AuthProvider";

function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Navigate to="/login" replace/>}/>
                    <Route path="/login" element={<LoginForm/>}/>
                    <Route path="/register" element={<RegisterForm/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>

    );
}

export default App;