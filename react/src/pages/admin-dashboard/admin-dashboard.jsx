import React from "react";
import AdminSidebar from "./components/AdminSidebar";
import StudentsSection from "./components/StudentsSection";
import ProfessorsSection from "./components/ProfessorsSection";
import CoursesSection from "./components/CoursesSection";
const AdminDashboardPage = () => {
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
