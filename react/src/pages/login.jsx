import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
	e.preventDefault();
	setErrorMessage("");
  
	const { data, error } = await supabase.auth.signInWithPassword({
	  email,
	  password,
	});
  
	if (error) {
	  setErrorMessage(error.message);
	  return;
	}
  
	if (data?.session) {
	  const token = data.session.access_token;
  
	  // Send token to Django to check approval and update records
	  const response = await fetch("http://localhost:8000/api/process-user/", {
		method: "POST",
		headers: {
		  Authorization: `Bearer ${token}`,
		  "Content-Type": "application/json",
		},
	  });
  
	  if (response.ok) {
		const { is_approved } = await response.json();
  
		if (is_approved) {
		  alert("Login successful!");
		  navigate("/dashboard"); // Redirect to dashboard
		} else {
		  alert("Your account is pending admin approval. Please wait.");
		  await supabase.auth.signOut();
		}
	  } else {
		console.error("Error processing user:", await response.json());
		alert("There was an issue processing your login. Please try again.");
	  }
	}
  };
  

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email to reset the password.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      alert("Error sending password reset email: " + error.message);
    } else {
      alert("Password reset email sent! Check your inbox.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

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
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-blue-500 hover:text-blue-700 text-sm focus:outline-none"
          >
            Forgot Password?
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <span
              className="text-blue-500 hover:text-blue-700 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
