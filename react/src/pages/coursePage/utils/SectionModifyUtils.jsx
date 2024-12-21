import { useState } from 'react';

const SectionModifyUtils = ({ setData }) => {
    // Function to delete a section
    const deleteSection = async (sectionId, courseId) => {
        try {
            const response = await fetch(`/api/course/${courseId}/sections/${sectionId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // If successful, remove the deleted section from the state
                setData((prevData) => prevData.filter((section) => section.id !== sectionId));
                console.log(`Section ${sectionId} deleted successfully.`);
            } else {
                console.error('Failed to delete section:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    // Function to add a new section
    const addSection = async (sectionData, courseID) => {
        try {
            console.log("SDAFFFFFFFFFFFFFFFFFFFFFFFFF" + courseID);
            const response = await fetch(`/api/course/${courseID}/sections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sectionData),
            });

            if (response.ok) {
                const newSection = await response.json();
                // Update state with the new section
                setData((prevData) => [...prevData, newSection]);
                console.log(`Section ${newSection.id} added successfully.`);
            } else {
                console.error('Failed to add section:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding section:', error);
        }
    };

    // Function to edit an existing section
    const editSection = async (sectionId, updatedSectionData, courseId) => {
        try {
            const response = await fetch(`/api/course/${courseId}/sections/${sectionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSectionData),
            });

            if (response.ok) {
                const updatedSection = await response.json();
                // Update the section data in the state
                setData((prevData) =>
                    prevData.map((section) =>
                        section.id === sectionId ? updatedSection : section
                    )
                );
                console.log(`Section ${sectionId} updated successfully.`);
            } else {
                console.error('Failed to update section:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating section:', error);
        }
    };

    return {
        deleteSection,
        addSection,
        editSection,
    };
};

export default SectionModifyUtils;
