import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";

const Dashboard = () => {
  const [role, setRole] = useState(null); // 'student' or 'professor'
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRoleAndCourses = async () => {
      setLoading(true);
    
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not logged in.");
    
        // Fetch the user's role from the profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
    
        if (profileError) throw profileError;
    
        setRole(profile.role);
    
        let courses = [];
    
        if (profile.role === "student") {
          // Fetch the student's auto-generated student_id
          const { data: studentProfile, error: studentError } = await supabase
            .from("students")
            .select("student_id")
            .eq("id", user.id)
            .single();
    
          if (studentError) throw studentError;
    
          // Fetch the course IDs for the student
          const { data: studentCourses, error: studentCoursesError } = await supabase
            .from("students_courses")
            .select("course_id")
            .eq("student_id", studentProfile.student_id);
    
          if (studentCoursesError) throw studentCoursesError;
    
          const courseIds = studentCourses.map((course) => course.course_id);
    
          if (courseIds.length > 0) {
            // Fetch full course details
            const { data: studentCourseDetails, error: studentCourseDetailsError } = await supabase
              .from("courses")
              .select("*")
              .in("id", courseIds);
    
            if (studentCourseDetailsError) throw studentCourseDetailsError;
    
            courses = studentCourseDetails;
          }
        } else if (profile.role === "professor") {
          // Fetch the professor's auto-generated professor_id
          const { data: professorProfile, error: professorError } = await supabase
            .from("professors")
            .select("professor_id")
            .eq("id", user.id)
            .single();
    
          if (professorError) throw professorError;
    
          // Fetch the course IDs for the professor
          const { data: professorCourses, error: professorCoursesError } = await supabase
            .from("professors_courses")
            .select("course_id")
            .eq("professor_id", professorProfile.professor_id);
    
          if (professorCoursesError) throw professorCoursesError;
    
          const courseIds = professorCourses.map((course) => course.course_id);
    
          if (courseIds.length > 0) {
            // Fetch full course details
            const { data: professorCourseDetails, error: professorCourseDetailsError } = await supabase
              .from("courses")
              .select("*")
              .in("id", courseIds);
    
            if (professorCourseDetailsError) throw professorCourseDetailsError;
    
            courses = professorCourseDetails;
          }
        }
    
        setCourses(courses);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };    

    fetchUserRoleAndCourses();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </header>
      <main className="p-6">
        <h2 className="text-2xl mb-4">
          Welcome, {role === "student" ? "Student" : "Professor"}!
        </h2>
        <div className="bg-white shadow-md rounded p-4">
          <h3 className="text-xl font-bold mb-4">Your Courses</h3>
          {courses.length > 0 ? (
            <ul className="list-disc pl-5">
              {courses.map((course) => (
                <li key={course.id}>
                  <strong>{course.name}</strong> - {course.description}
                  {role === "professor" && (
                    <button
                      className="ml-4 text-blue-500 hover:underline"
                      onClick={() => alert(`Manage course: ${course.name}`)}
                    >
                      Manage Students
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No courses found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
	