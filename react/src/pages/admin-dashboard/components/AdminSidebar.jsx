import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md p-4 sticky top-0">
      <ul>
        <li className="mb-4">
          <Link to="#students" className="text-black-600 hover:underline">
            Students
          </Link>
        </li>
        <li className="mb-4">
          <Link to="#professors" className="text-black-600 hover:underline">
            Professors
          </Link>
        </li>
        <li>
          <Link to="#courses" className="text-black-600 hover:underline">
            Courses
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;