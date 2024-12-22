import { useState } from 'react';

const ModifyUtils = ({ setData }) => {
    // Function to delete a course
    const deleteCourse = async (courseId) => {
        try {
            const response = await fetch(`/api/course/${courseId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // If successful, remove the deleted course from the state
                setData((prevData) => prevData.filter((course) => course.id !== courseId));
                console.log(`Course ${courseId} deleted successfully.`);
            } else {
                console.error('Failed to delete course:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    // Function to add a new course
    const addCourse = async (courseData) => {
        try {
            const response = await fetch('/api/course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData),
            });

            if (response.ok) {
                const newCourse = await response.json();
                // Update state with the new course
                setData((prevData) => [...prevData, newCourse]);
                console.log(`Course ${newCourse.id} added successfully.`);
            } else {
                console.error('Failed to add course:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    // Function to edit an existing course
    const editCourse = async (courseId, updatedCourseData) => {
        try {
            const response = await fetch(`/api/course/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCourseData),
            });

            if (response.ok) {
                const updatedCourse = await response.json();
                // Update the course data in the state
                setData((prevData) =>
                    prevData.map((course) =>
                        course.id === courseId ? updatedCourse : course
                    )
                );
                console.log(`Course ${courseId} updated successfully.`);
            } else {
                console.error('Failed to update course:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    return {
        deleteCourse,
        addCourse,
        editCourse,
    };
};

export default ModifyUtils;