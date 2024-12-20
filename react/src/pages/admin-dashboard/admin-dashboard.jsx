import React from "react";
import AdminSidebar from "./components/AdminSidebar";
import StudentsSection from "./components/StudentsSection";
import ProfessorsSection from "./components/ProfessorsSection";
import CoursesSection from "./components/CoursesSection";
import { useLoading } from '../../context/LoadingContext';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

  // const [role, setRole] = useState(null); // 'student' or 'professor'
  // const [courses, setCourses] = useState([]);
  // const navigate = useNavigate();
  // const { setLoading } = useLoading();
const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchUserRoleAndCourses = async () => {
      setLoading(true);
        
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) navigate("/login");
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };
        
    fetchUserRoleAndCourses();
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
