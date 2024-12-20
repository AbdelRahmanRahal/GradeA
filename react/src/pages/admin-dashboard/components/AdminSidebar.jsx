import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md p-4">
      <ul>
        <li className="mb-4">
          <Link to="#students" className="text-blue-600 hover:underline">
            Students
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#professors" className="text-blue-600 hover:underline">
            Professors
          </Link>
        </li>
        <li>
          <Link to="#courses" className="text-blue-600 hover:underline">
            Courses
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
