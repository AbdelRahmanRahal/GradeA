import { useState } from 'react'
import React from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/login/login.jsx';
import RegisterPage from './pages/register/register.jsx';

const App = () => {

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
    </Route>
  )
);

    return(
        <>
            <ToastContainer />
            <RouterProvider router={router} />
        </>
    );
};
export default App;

