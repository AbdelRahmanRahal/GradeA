import React, { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";
import { useParams } from "react-router-dom";
import { fetchRole } from "../../utils/CacheWorkings.jsx";
import SectionModifyUtils from "./utils/SectionModifyUtils.jsx";
import Section from "./components/section.jsx";
import { AddButton } from "./components/ButtonB.jsx";
import {
  CreateSectionDialog,
  EditSectionDialog,
  SectionResponsiveDialog,
} from "./components/SectionResponsiveDialog.jsx";
import DescriptionBox from "./components/DescriptionBox.jsx";
import { supabase } from "../../supabase.js";

const CoursePage = () => {
  const { id } = useParams();
  const { setLoading } = useLoading();
  const [role, setRole] = useState("student");
  const [course, setCourse] = useState(null);

  const [deleteSectionDialogOpen, setDeleteSectionDialogOpen] = useState(false);
  const [openCreateSectionDialog, setOpenCreateSectionDialog] = useState(false);
  const [openEditSectionDialog, setOpenEditSectionDialog] = useState(false);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedEditSection, setSelectedEditSection] = useState(null);

  const { deleteSection, addSection, editSection } = SectionModifyUtils({
    setData: setCourse,
  });
  //end for entry deletion

  //for creating section
  const handleCreateSection = async (sectionData, courseID) => {
    try {
      console.log("DEFINITELY USING ADDCSEIsdsdssasasadCUETIONCE");
      await addSection(sectionData, courseID);
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };
  //end of section creation

  //for edit
  const handleEditSection = async (sectionData, courseID) => {
    try {
      console.log("the id should be" + sectionData?.id);
      await editSection(sectionData.id, sectionData, courseID);
    } catch (error) {
      console.error("Error editing course:", error);
    }
  };

  const handleEditSectionDialog = (section) => {
    setSelectedEditSection(section);
    setOpenEditSectionDialog(true);
  };
  //end of edit

  // for deletion
  const handleOpenDeleteSectionDialog = (course) => {
    setSelectedSection(course);
    setDeleteSectionDialogOpen(true); // Open the dialog
  };

  const handleConfirmRemoveSection = async (sectionID, courseID) => {
    console.log(`Removing section: ${sectionID}`);
    await deleteSection(sectionID, courseID);
    // Perform the remove logic here (e.g., API call, state update)
    setDeleteSectionDialogOpen(false); // Close the dialog after confirming
  };
  //end for deletion

  useEffect(() => {
    const fetchUserRoleAndCourse = async () => {
      setLoading(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) navigate("/login");
        // Fetch the user's role from the profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        setRole(profile.role);

        if (profile.role === "admin") navigate("/admin");

        // Fetch full course details
        const { data: coursesDetails, error: coursesDetailsError } =
          await supabase
            .from("courses_with_covers")
            .select("*")
            .eq("course_id", id);

        if (coursesDetailsError) throw coursesDetailsError;

        const courseDetails = coursesDetails[0];

        // Fetch public URL for cover image
        const course = {
          id: courseDetails.course_id,
          name: courseDetails.course_name,
          description: courseDetails.description,
          startDate: courseDetails.start_date,
          endDate: courseDetails.end_date,
          departments: courseDetails.departments,
          content: courseDetails.content,
          coverImageUrl: courseDetails.cover_image_name
            ? supabase.storage
                .from(courseDetails.cover_image_bucket)
                .getPublicUrl(courseDetails.cover_image_name).data.publicUrl
            : "https://via.placeholder.com/300",
        };

        setCourse(course);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoleAndCourse();
  }, [id, setLoading]);

  return (
    <div className="min-h-screen bg-gray-100">
      {course?.name && (
        <h1
          className={`min-w-full bg-red-600 text-white text-center justify-center text-5xl min-h-16 flex`}
        >
          {course.name}{" "}
          {role === "professor" && (
            <AddButton
              onClick={() => setOpenCreateSectionDialog(true)}
              buttonFeature={"ml-1 mb-2.5 text-gray-300 hover:text-gray-400"}
            />
          )}
        </h1>
      )}
      <div className={`flex`}>
        <main className="p-6 w-4/5">
          {course ? (
            <div className="flex flex-col gap-y-6">
              {course?.sections?.length > 0 ? (
                course.sections.map((section) => (
                  <Section
                    key={section.id}
                    sectionData={section}
                    role={role}
                    onEdit={() => {
                      console.log("jermisadasde" + course?.id);
                      handleEditSectionDialog(section);
                    }}
                    onRemove={() => handleOpenDeleteSectionDialog(section)}
                  ></Section>
                ))
              ) : (
                <h2>No entries available, issue is in coursePage.</h2>
              )}
            </div>
          ) : (
            <h2>No data found.</h2>
          )}
        </main>
        <div className={`w-1/5 ml-auto mt-6 mr-3`}>
          <DescriptionBox></DescriptionBox>
        </div>
      </div>
      <CreateSectionDialog
        open={openCreateSectionDialog}
        onClose={() => setOpenCreateSectionDialog(false)}
        onCreateSection={handleCreateSection}
        courseID={course?.id}
      />
      <EditSectionDialog // const EditSectionDialog = ({ open, onClose, section, onEditSection }) =>
        open={openEditSectionDialog}
        onClose={() => setOpenEditSectionDialog(false)}
        section={selectedEditSection}
        onEditSection={handleEditSection}
        courseID={course?.id}
      />
      <SectionResponsiveDialog
        open={deleteSectionDialogOpen}
        onClose={() => setDeleteSectionDialogOpen(false)}
        title="Confirm Remove"
        content={`Are you sure you want to remove the section "${selectedSection?.name}"?`}
        actions={[
          {
            label: "Cancel",
            onClick: () => setDeleteSectionDialogOpen(false),
          },
          {
            label: "Remove",
            onClick: () =>
              handleConfirmRemoveSection(course?.id, selectedSection?.id),
            color: "error",
          },
        ]}
      />
    </div>
  );
};

export default CoursePage;
