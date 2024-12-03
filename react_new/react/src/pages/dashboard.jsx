import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [user, setUser] = useState(null); // Holds user data
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true); // To handle loading state
    const navigate = useNavigate();

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            const { data: user, error } = await supabase.auth.getUser();

            if (error) {
                setErrorMessage(error.message);
                setLoading(false);
                return;
            }

            setUser(user?.user_metadata);
            setLoading(false);
        };

        fetchUserData();
    }, []);

    // Handle logout
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert("Error logging out: " + error.message);
        } else {
            navigate("/login"); // Redirect to login after logout
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Dashboard</h2>

                {errorMessage && (
                    <p className="text-red-500 text-center mb-4">{errorMessage}</p>
                )}

                {user ? (
                    <>
                        <div className="mb-4">
                            <p className="text-gray-700">
                                <strong>Name:</strong> {user.name || "N/A"}
                            </p>
                            <p className="text-gray-700">
                                <strong>Email:</strong> {user.email || "N/A"}
                            </p>
                            <p className="text-gray-700">
                                <strong>Role:</strong> {user.role || "N/A"}
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Log Out
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center">No user data available.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
