import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import LoginPage from './pages/login/login.jsx';
import RegisterPage from './pages/register/register.jsx';
import DashboardPage from './pages/dashboard/dashboard.jsx';
import CoursesPage from './pages/coursesList/coursesList.jsx';
import Loading from './components/Loading';

function AppContent() {
    const { loading } = useLoading(); // Access loading state

    return (
        <>
            {loading && <Loading/>}
            <div className={loading ? 'hidden' : ''}>

                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick rtl={false}
                                draggable pauseOnHover/>

                {<Routes>
                    {/* Routes for Login and Register pages without Header/Footer */}
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>

                    {/* Wrapper with Header for Dashboard page */}
                    <Route
                        path="/dashboard"
                        element={
                            <>
                                <Header/>
                                <DashboardPage/>
                                <Footer/>
                            </>
                        }
                    />
                    <Route
                        path="/courses"
                        element={
                            <>
                                <Header/>
                                <CoursesPage/>
                                <Footer/>
                            </>
                        }
                    />
                    {/* Default route */}
                    <Route path="/" element={<LoginPage/>}/>
                </Routes>}
            </div>
        </>
    );
}

function App() {
            return (
            <LoadingProvider>
            <Router>
            <AppContent />
            </Router>
            </LoadingProvider>
            );
        }

            export default App;
