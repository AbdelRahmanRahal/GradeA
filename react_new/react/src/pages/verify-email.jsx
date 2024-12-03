import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

// Register component for user sign-up
const Register = () => {
    // State variables to manage form inputs
    const [email, setEmail] = useState(""); // User email
    const [password, setPassword] = useState(""); // User password
    const [role, setRole] = useState("student"); // Default role set to "student"
    const [errorMessage, setErrorMessage] = useState(""); // To display error messages

    // React Router's navigation function
    const navigate = useNavigate();

    // Handle form submission for user registration
    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setErrorMessage(""); // Clear previous error messages

        // Use Supabase API to create a new user account
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            role, // Pass the selected role
            options: {
                data: { role }, // Store the role in user metadata for later use
            },
        });

        // Handle errors in sign-up process
        if (error) {
            setErrorMessage(error.message); // Display error message
            return;
        }

        // If sign-up is successful, prompt the user and redirect to email verification
        if (data) {
            alert("Sign-up successful! Please verify your email.");
            navigate("/verify-email"); // Navigate to the verification page
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {/* Sign-up form */}
            <form
                onSubmit={handleSignUp}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

                {/* Display error message if present */}
                {errorMessage && (
                    <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                )}

                {/* Email input field */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update email state
                        required
                    />
                </div>

                {/* Password input field */}
                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-gray-700 font-bold mb-2"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                        required
                    />
                </div>

                {/* Role selection dropdown */}
                <div className="mb-4">
                    <label htmlFor="role" className="block text-gray-700 font-bold mb-2">
                        Select Role
                    </label>
                    <select
                        id="role"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={role}
                        onChange={(e) => setRole(e.target.value)} // Update role state
                    >
                        <option value="student">Student</option>
                        <option value="professor">Professor</option>
                    </select>
                </div>

                {/* Submit button */}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;
