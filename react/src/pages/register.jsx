import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [role, setRole] = useState(""); // To store the user's role selection
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState(""); // For students
  const [departments, setDepartments] = useState([]); // For professors
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const departmentOptions = ["CS", "AI", "BMD", "ENG"];

  const handleDepartmentChange = (dept) => {
    if (departments.includes(dept)) {
      setDepartments(departments.filter((d) => d !== dept));
    } else {
      setDepartments([...departments, dept]);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");

	const currentYear = new Date().getFullYear().toString().slice(-2); // Get the last two digits of the current year

    const metadata = {
      role,
      first_name: firstName,
      last_name: lastName,
	  year: currentYear,
    };

    if (role === "student") {
      metadata.department = department;
    } else if (role === "professor") {
      metadata.departments = departments;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }, // Store metadata for role and additional fields
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data) {
      alert("Sign-up successful! Please verify your email.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!role ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Register as:
          </h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setRole("student")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Student
            </button>
            <button
              onClick={() => setRole("professor")}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Professor
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSignUp}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Register as {role.charAt(0).toUpperCase() + role.slice(1)}
          </h2>

          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}

          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

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
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
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

          {role === "student" ? (
            <div className="mb-4">
              <label htmlFor="department" className="block text-gray-700 font-bold mb-2">
                Department
              </label>
              <select
                id="department"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select your department
                </option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Departments
              </label>
              <div className="flex flex-wrap gap-2">
                {departmentOptions.map((dept) => (
                  <label key={dept} className="flex items-center">
                    <input
                      type="checkbox"
                      value={dept}
                      checked={departments.includes(dept)}
                      onChange={() => handleDepartmentChange(dept)}
                      className="mr-2"
                    />
                    {dept}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => setRole("")}
              className="text-red-500 hover:text-red-700 font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Register;
