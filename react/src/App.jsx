import { useState } from 'react'
import React from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';

const App = () => {

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
    </Route>
  )
);

return <RouterProvider router={router} />;
};
export default App;

