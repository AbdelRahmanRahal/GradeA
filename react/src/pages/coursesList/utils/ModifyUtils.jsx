import { useState } from "react";
import { supabase } from "../../../supabase.js";

const ModifyUtils = ({ setData }) => {
  // Function to delete a course
  const deleteCourse = async (courseId) => {
    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);
      if (error) {
        console.error("Failed to delete course:", error.message);
      } else {
        setData((prevData) =>
          prevData.filter((course) => course.id !== courseId)
        );
        console.log(`Course ${courseId} deleted successfully.`);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Function to add a new course
  const addCourse = async (courseData) => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([courseData]);
      if (error) {
        console.error("Failed to add course:", error.message);
      } else {
        setData((prevData) => [...prevData, data[0]]);
        console.log(`Course ${data[0].id} added successfully.`);
      }
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  // Function to edit an existing course
  const editCourse = async (courseId, updatedCourseData) => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .update({ ...updatedCourseData })
        .eq("id", courseId);

      if (error) {
        console.error("Failed to update course:", error.message);
      } else {
        setData((prevData) =>
          prevData.map((course) =>
            course.id === courseId ? { ...course, ...data[0] } : course
          )
        );
        console.log(`Course ${courseId} updated successfully.`);
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return {
    deleteCourse,
    addCourse,
    editCourse,
  };
};

export default ModifyUtils;
