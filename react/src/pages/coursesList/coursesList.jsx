import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext.jsx";
import { fetchRole } from "../../utils/CacheWorkings.jsx";
import ModifyUtils from "./utils/ModifyUtils.jsx";
import HCourseCard from "./components/HCourseCard.jsx";
import { AddButton } from "./components/ButtonA.jsx";
import { supabase } from "../../supabase.js";

import {
  CreateCourseDialog,
  EditCourseDialog,
  ResponsiveDialog,
} from "./components/ResponsiveDialog.jsx";

const coursesList = () => {
  const [role, setRole] = useState(null); // 'student' or 'professor'
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const { setLoading } = useLoading();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedEditCourse, setSelectedEditCourse] = useState(null);

  const { deleteCourse, addCourse, editCourse } = ModifyUtils({
    setData: setCourses,
  });

  const handleCreateCourse = async (courseData) => {
    try {
      console.log("DEFINITELY USING ADDCssssssaasfASDSE");
      await addCourse(courseData);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleEditCourse = async (courseData) => {
    try {
      console.log("the id should be" + courseData?.id);
      await editCourse(courseData.id, courseData);
    } catch (error) {
      console.error("Error editing course:", error);
    }
  };

  const handleEditDialog = (course) => {
    setSelectedEditCourse(course);
    setOpenEditDialog(true);
  };

  const handleOpenDialog = (course) => {
    setSelectedCourse(course);
    setDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Close the dialog
  };

  const handleConfirmRemove = async (courseID) => {
    console.log(`Removing course: ${courseID}`);
    await deleteCourse(courseID);
    // Perform the remove logic here (e.g., API call, state update)
    handleCloseDialog(); // Close the dialog after confirming
  };

  const truncateDescription = (description, maxLength) => {
    if (description.length <= maxLength) {
      return description;
    }

    const lastSpaceIndex = description.lastIndexOf(" ", maxLength - 3);
    if (lastSpaceIndex === -1) {
      return description.substring(0, maxLength - 3) + "...";
    }

    return description.substring(0, lastSpaceIndex) + "...";
  };

  useEffect(() => {
    const fetchUserRoleAndCourses = async () => {
      setLoading(true);

      try {
        const role = await fetchRole();
        setRole(role);
        if (!role) navigate("/login");
        // Fetch the user's role from the profiles table
        // const { data: profile, error: profileError } = await supabase
        //   .from("profiles")
        //   .select("role")
        //   .eq("id", user.id)
        //   .single();

        // if (profileError) throw profileError;

        if (role === "admin") navigate("/admin");

        // Fetch full course details
        const { data: coursesDetails, error: coursesDetailsError } =
          await supabase.from("courses_with_covers").select("*");

        if (coursesDetailsError) throw coursesDetailsError;

        // Fetch public URLs for cover images
        const coursesWithCovers = coursesDetails.map((course) => ({
          id: course.course_id,
          name: course.course_name,
          description: course.description,
          startDate: course.start_date,
          endDate: course.end_date,
          departments: course.departments,
          coverImageUrl: course.cover_image_name
            ? supabase.storage
                .from(course.cover_image_bucket)
                .getPublicUrl(course.cover_image_name).data.publicUrl
            : "https://via.placeholder.com/300",
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
          <h3 className="flex text-xl font-bold mb-4">
            Your Courses{" "}
            {role === "professor" && (
              <AddButton onClick={() => setOpenCreateDialog(true)} />
            )}
          </h3>
          <div className={`flex gap-6 max-h-full min-w-full`}>
            <div className="flex-col gap-6 max-h-full min-w-full">
              {courses.length > 0 ? (
                courses.map((item) => (
                  <HCourseCard
                    key={item.id}
                    title={item.name}
                    description={truncateDescription(item.description, 400)}
                    image={item.coverImageUrl}
                    role={role}
                    courseID={item.id}
                    onRemove={() => handleOpenDialog(item)}
                    onEdit={() => handleEditDialog(item)}
                  />
                ))
              ) : (
                <p>No courses found.</p>
              )}
            </div>
          </div>
        </div>
      </main>
      <CreateCourseDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreateCourse={handleCreateCourse}
      />
      <EditCourseDialog // const EditCourseDialog = ({ open, onClose, course, onEditCourse }) =>
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        course={selectedEditCourse}
        onEditCourse={handleEditCourse}
      />
      <ResponsiveDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title="Confirm Remove"
        content={`Are you sure you want to remove the course "${selectedCourse?.name}"?`}
        actions={[
          { label: "Cancel", onClick: () => handleCloseDialog() },
          {
            label: "Remove",
            onClick: () => handleConfirmRemove(selectedCourse?.id),
            color: "error",
          },
        ]}
      />
    </div>
  );
};

export default coursesList;
