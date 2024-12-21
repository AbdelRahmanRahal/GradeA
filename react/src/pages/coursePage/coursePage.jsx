import React, {useEffect, useState} from 'react';
import { useLoading } from '../../context/LoadingContext';
import { useParams } from 'react-router-dom';
import { fetchRole } from '../../utils/CacheWorkings.jsx';
import SectionModifyUtils from "./utils/SectionModifyUtils.jsx";
import Section from './components/section.jsx';
import { AddButton } from './components/buttonB.jsx';
import {CreateSectionDialog, EditSectionDialog, SectionResponsiveDialog} from "./components/SectionResponsiveDialog.jsx";


const CoursePage = () => {
    const { id } = useParams();
    const { setLoading } = useLoading();
    const [role, setRole] = useState("student");
    const [data, setData] = useState(null);

    const [deleteSectionDialogOpen, setDeleteSectionDialogOpen] = useState(false);
    const [openCreateSectionDialog, setOpenCreateSectionDialog] = useState(false);
    const [openEditSectionDialog, setOpenEditSectionDialog] = useState(false);

    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedEditSection, setSelectedEditSection] = useState(null);


    const { deleteSection, addSection, editSection } = SectionModifyUtils({ setData: setData });
    //end for entry deletion

    //for creating section
    const handleCreateSection = async (sectionData, courseID) => {
        try {
            console.log("DEFINITELY USING ADDCSEIsdsdssasasadCUETIONCE")
            await addSection(sectionData, courseID);
        } catch (error) {
            console.error('Error creating section:', error);
        }
    };
    //end of section creation

    //for edit
    const handleEditSection = async (sectionData, courseID) => {
        try {
            console.log("the id should be" + sectionData?.id);
            await editSection(sectionData.id, sectionData, courseID);
        } catch (error) {
            console.error('Error editing course:', error);
        }
    }

    const handleEditSectionDialog = (section) => {
        setSelectedEditSection(section);
        setOpenEditSectionDialog(true);
    }
    //end of edit

    // for deletion
    const handleOpenDeleteSectionDialog = (course) => {
        setSelectedSection(course)
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
        const getRole = async () => {
            const role = await fetchRole();
            setRole(role);};
        getRole();

        const fetchCourseData = async () => {
            setLoading(true);

            try {
                const response = await fetch(`/api/course/${id}`);
                if (response.ok) {
                    const courseData = await response.json();
                    setData(courseData); // Set course data
                } else {
                    console.error('Failed to fetch course data');
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false); // Ensure loading state is stopped after fetching
            }
        };

        fetchCourseData(); // Call the async function to fetch data
    }, [id, setLoading]);


    return (
        <div className="min-h-screen bg-gray-100">
            {data?.name && (<h1 className={`min-w-full bg-red-600 text-white text-center justify-center text-5xl min-h-16 flex`}>{data.name} {role === 'instructor' &&
            <AddButton onClick={() => setOpenCreateSectionDialog(true)}
            buttonFeature={"ml-1 mb-2.5 text-gray-300 hover:text-gray-400"}/>}</h1>)}
            <main className="p-6">
                {data ? (
                    <div className="flex flex-col gap-y-6">
                        {data?.sections?.length > 0 ? data.sections.map((section) => (
                            <Section
                                key={section.id}
                                sectionData={section}
                                role={role}
                                onEdit={() => {
                                    console.log("jermisadasde" + data?.id);
                                    handleEditSectionDialog(section);
                                }}
                                onRemove={() => handleOpenDeleteSectionDialog(section)}></Section>
                        )) : (<h2>No entries available, issue is in coursePage.</h2>)}
                    </div>) : (<h2>No data found.</h2>)}
            </main>
            <CreateSectionDialog
                open={openCreateSectionDialog}
                onClose={() => setOpenCreateSectionDialog(false)}
                onCreateSection={handleCreateSection}
                courseID={data?.id}
            />
            <EditSectionDialog // const EditSectionDialog = ({ open, onClose, section, onEditSection }) =>
                open={openEditSectionDialog}
                onClose={() => setOpenEditSectionDialog(false)}
                section={selectedEditSection}
                onEditSection={handleEditSection}
                courseID={data?.id}
            />
            <SectionResponsiveDialog
                open={deleteSectionDialogOpen}
                onClose={() => setDeleteSectionDialogOpen(false)}
                title="Confirm Remove"
                content={`Are you sure you want to remove the section "${selectedSection?.name}"?`}
                actions={[
                    { label: "Cancel", onClick: () => setDeleteSectionDialogOpen(false) },
                    { label: "Remove", onClick: ()=> handleConfirmRemoveSection(data?.id, selectedSection?.id), color: "error" },
                ]}
            />
        </div>
    );
};

export default CoursePage;