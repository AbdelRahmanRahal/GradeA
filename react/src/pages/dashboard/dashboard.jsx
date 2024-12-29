import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase.js";
import { useNavigate } from "react-router-dom";
import CourseCard from "./components/CourseCard";
import { useLoading } from '../../context/LoadingContext';
import ViewAllButton from "./components/ViewAllButton.jsx";
import {fetchRole} from "../../utils/CacheWorkings.jsx";

const Dashboard = () => {
  const [role, setRole] = useState(null); // 'student' or 'professor' or 'admin'
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { setLoading } = useLoading();


  useEffect(() => {
    const fetchUserRoleAndCourses = async () => {
      setLoading(true);
      
      try {
        const role = await fetchRole();
        setRole(role);
        if (!role) navigate("/login");

        if (role === "admin") navigate("/admin");
        
        // Fetch full course details
        const { data: coursesDetails, error: coursesDetailsError } = await supabase
          .from("courses_with_covers")
          .select("*")
        
        if (coursesDetailsError) throw coursesDetailsError;
          
        // Fetch public URLs for cover images
        const coursesWithCovers = coursesDetails.map((course) => ({
          id: course.course_id,
          name: course.course_name,
          description: course.description,
          startDate: course.start_date,
          endDate: course.end_date,
          departments: course.departments,
          coverImageUrl: course.cover_image_name ? supabase.storage
            .from(course.cover_image_bucket)
            .getPublicUrl(course.cover_image_name).data.publicUrl : "https://via.placeholder.com/500x300"
        }));

        setCourses(coursesWithCovers);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };
        
    fetchUserRoleAndCourses();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6">
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-bold mb-4">Your Courses</h3>
          {courses.length > 0 ? (
            <div className={`inline-flex gap-6 max-w-full`}>
              <div className="flex overflow-x-auto gap-6">
                {courses.slice(0, 4).map((item) => (
                  <CourseCard
                    key={item.id}
                    title={item.name}
                    description={item.description}
                    courseID={item.id}
                    image={item.coverImageUrl}
                  />
                ))}
              </div>
              <ViewAllButton redirectLink={"/"}></ViewAllButton>
            </div>
          ) : (
            <p>No courses found. Wait to be enrolled in some courses or for an admin to admit you.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;