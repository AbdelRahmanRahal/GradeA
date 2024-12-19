import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase.js";
import { useNavigate } from "react-router-dom";
import { useLoading } from '../../context/LoadingContext.jsx';
import {fetchFirstName, fetchRole} from '../../utils/CacheWorkings.jsx';
import HCourseCard from "./components/HCourseCard.jsx";
import { AddButton } from "./components/ButtonA.jsx";

const coursesList = () => {
    const [role, setRole] = useState(null); // 'student' or 'professor'
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    const [data, setData] = useState([]); //temp

    const { setLoading } = useLoading();


    useEffect(() => { // REMEMBER: CHANGE DATA TO COURSES IN THE RETURN IF YOU SWITCH OFF TEMP !!!!!
        const getRole = async () => {
            const role = await fetchRole();
            setRole(role);};
        getRole();
        // setLoading(true);
        //temp
        // Fetch courses data from API
        fetch('/api/courses')
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching courses:', error));

        setLoading(false)
        // end of temp
        //
        // const fetchUserRoleAndCourses = async () => {
        //     setLoading(true);
        //
        //     try {
        //         const {data: {user}} = await supabase.auth.getUser();
        //         if (!user) navigate("/login");
        //         // Fetch the user's role from the profiles table
        //         const {data: profile, error: profileError} = await supabase
        //             .from("profiles")
        //             .select("role")
        //             .eq("id", user.id)
        //             .single();
        //
        //         if (profileError) throw profileError;
        //
        //         setRole(profile.role);
        //     } catch (error) {
        //         console.log(error)
        //     }
        //     finally {setLoading(false)}
        // }
        // fetchUserRoleAndCourses();
        //
        //         let courses = [];
        //
        //         if (profile.role === "student") {
        //             // Fetch the student's auto-generated student_id
        //             const { data: studentProfile, error: studentError } = await supabase
        //                 .from("students")
        //                 .select("student_id")
        //                 .eq("id", user.id)
        //                 .single();
        //
        //             if (studentError) throw studentError;
        //
        //             // Fetch the course IDs for the student
        //             const { data: studentCourses, error: studentCoursesError } = await supabase
        //                 .from("students_courses")
        //                 .select("course_id")
        //                 .eq("student_id", studentProfile.student_id);
        //
        //             if (studentCoursesError) throw studentCoursesError;
        //
        //             const courseIds = studentCourses.map((course) => course.course_id);
        //
        //             if (courseIds.length > 0) {
        //                 // Fetch full course details
        //                 const { data: studentCourseDetails, error: studentCourseDetailsError } = await supabase
        //                     .from("courses")
        //                     .select("*")
        //                     .in("id", courseIds);
        //
        //                 if (studentCourseDetailsError) throw studentCourseDetailsError;
        //
        //                 courses = studentCourseDetails;
        //             }
        //         } else if (profile.role === "professor") {
        //             // Fetch the professor's auto-generated professor_id
        //             const { data: professorProfile, error: professorError } = await supabase
        //                 .from("professors")
        //                 .select("professor_id")
        //                 .eq("id", user.id)
        //                 .single();
        //
        //             if (professorError) throw professorError;
        //
        //             // Fetch the course IDs for the professor
        //             const { data: professorCourses, error: professorCoursesError } = await supabase
        //                 .from("professors_courses")
        //                 .select("course_id")
        //                 .eq("professor_id", professorProfile.professor_id);
        //
        //             if (professorCoursesError) throw professorCoursesError;
        //
        //             const courseIds = professorCourses.map((course) => course.course_id);
        //
        //             if (courseIds.length > 0) {
        //                 // Fetch full course details
        //                 const { data: professorCourseDetails, error: professorCourseDetailsError } = await supabase
        //                     .from("courses")
        //                     .select("*")
        //                     .in("id", courseIds);
        //
        //                 if (professorCourseDetailsError) throw professorCourseDetailsError;
        //
        //                 courses = professorCourseDetails;
        //             }
        //         }
        //
        //         setCourses(courses);
        //     } catch (error) {
        //         console.error("Error fetching data:", error.message);
        //     } finally {
        //         setLoading(false);
        //     }
        // };
        //
        // fetchUserRoleAndCourses();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="p-6">
                <div className="bg-white shadow-md rounded p-4">
                    <h3 className="flex text-xl font-bold mb-4">Your Courses {role === "instructor" && <AddButton />}</h3>
                    <div className={`flex gap-6 max-h-full min-w-full`}>
                    <div className="flex-col gap-6 max-h-full min-w-full">
                        {data.length > 0 ? data.map((item) => (
                            <HCourseCard
                                key={item.id}
                                title={item.name}
                                description={item.description}
                                image="https://via.placeholder.com/300" // Placeholder image lmao
                                role={role}
                            />
                        )) : <p>No courses found.</p>}
                    </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default coursesList;