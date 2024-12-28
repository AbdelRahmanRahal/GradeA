import React, {useEffect, useState} from "react";
import AdminSidebar from "./components/AdminSidebar";
import StudentsSection from "./components/StudentsSection";
import ProfessorsSection from "./components/ProfessorsSection";
import CoursesSection from "./components/CoursesSection";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import { useLoading } from '../../context/LoadingContext';
import {fetchRole} from "../../utils/CacheWorkings.jsx";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const [role, setRole] = useState("student");

  useEffect(() => {

    const fetchUserRole = async () => {
      setLoading(true);
      
      try {
        const role = await fetchRole();
        setRole(role);
        if (!role) navigate("/login");

        if (role !== "admin") navigate("/dashboard");
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };
        
    fetchUserRole();
  }, []);
          
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-grow p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <StudentsSection />
        <ProfessorsSection />
        <CoursesSection />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
