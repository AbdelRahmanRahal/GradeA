import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";

const CoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .ilike("course_name", `%${search}%`); // Case-insensitive search
      if (!error) setCourses(data);
    };

    fetchCourses();
  }, [search]);

  const deleteCourse = async (courseId) => {
    await supabase.from("courses").delete().eq("course_id", courseId);
    setSearch(search);
  };

  return (
    <section id="courses" className="mt-8">
      <h3 className="text-xl font-bold mb-4">Manage Courses</h3>
      <SearchBar search={search} setSearch={setSearch} />
      <DataTable
        data={courses}
        columns={["Course Name", "Course Code", "Professor ID", "Actions"]}
        renderRow={(course) => (
          <tr key={course.course_id}>
            <td>{course.course_name}</td>
            <td>{course.course_code}</td>
            <td>{course.professor_id}</td>
            <td>
              <button
                onClick={() => deleteCourse(course.course_id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Delete
              </button>
            </td>
          </tr>
        )}
      />
    </section>
  );
};

export default CoursesSection;
