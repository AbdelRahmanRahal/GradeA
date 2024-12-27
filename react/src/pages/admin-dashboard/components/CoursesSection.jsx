import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import { toast } from "react-toastify";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";

const CoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
  }, [search]);

  const fetchCourses = async () => {
    let query = supabase.from("courses").select("*");

    // Because the ID in the courses table specifically
    // is an integer, we need to check if the search is numeric.
    // Type casting within the query does not work in REST API.
    if (search) {
      // Check if search is numeric
      if (!isNaN(search)) {
        query = query.eq("id", Number(search)); // Exact match for id
      } else {
        query = query.ilike("name", `%${search}%`); // Partial match for name
      }
    }

    const { data, error } = await query;
    if (!error) setCourses(data);
  };

  const observer = supabase
    .channel("courses-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "courses",
      },
      fetchCourses
    )
    .subscribe();

  const deleteCourse = async (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);
    if (error) {
      console.log(error);
      toast.error("Failed to delete course.");
    } else {
      toast.success("Course deleted.");
      setSearch(search);
    }
  };

  return (
    <section id="courses" className="mt-8">
      <h3 className="text-xl font-bold mb-4">Manage Courses</h3>
      <SearchBar search={search} setSearch={setSearch} />
      <DataTable
        data={courses}
        columns={["ID", "Name", "Professors", "Actions"]}
        renderRow={(course) => (
          <tr key={course.id}>
            <td>{course.id}</td>
            <td>{course.name}</td>
            <td>{course.professors?.join(", ")}</td>
            <td>
              <button
                onClick={() => deleteCourse(course.id)}
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
