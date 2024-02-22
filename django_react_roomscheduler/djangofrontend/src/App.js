
import React, { useState } from 'react';
import LoginForm from './pages/LoginForm';
import RegisterForm from "./pages/RegisterForm";
import Dashboard from "./pages/Dashboard";
import Insight from './pages/Insight'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import './service/axios';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
      <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Navigate to="/login" replace/>}/>
                    <Route path="/login" element={<LoginForm/>}/>
                    <Route path="/register" element={<RegisterForm/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                </Routes>
      </BrowserRouter>
  );
}

export default App;