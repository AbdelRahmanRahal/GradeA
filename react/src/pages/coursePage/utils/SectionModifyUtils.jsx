import { useState } from 'react';

import { supabase } from '../../../supabase.js';

const SectionModifyUtils = ({ setData }) => {
    // Function to delete a section
    const deleteSection = async (sectionId, courseId) => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .update({ content: setData((prevData) => prevData.filter((section) => section.id !== sectionId)) })
                .eq('id', courseId);

            if (error) {
                console.error('Failed to delete section:', error.message);
            } else {
                console.log(`Section ${sectionId} deleted successfully.`);
            }
        } catch (error) {
            console.error('Error deleting section:', error);
        }
    };

    // Function to add a new section
    const addSection = async (sectionData, courseID) => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .update({ content: setData((prevData) => [...prevData, sectionData]) })
                .eq('id', courseID);

            if (error) {
                console.error('Failed to add section:', error.message);
            } else {
                console.log(`Section ${sectionData.id} added successfully.`);
            }
        } catch (error) {
            console.error('Error adding section:', error);
        }
    };

    // Function to edit an existing section
    const editSection = async (sectionId, updatedSectionData, courseId) => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .update({ content: setData((prevData) =>
                    prevData.map((section) =>
                        section.id === sectionId ? { ...section, ...updatedSectionData } : section
                    )
                ) })
                .eq('id', courseId);

            if (error) {
                console.error('Failed to update section:', error.message);
            } else {
                console.log(`Section ${sectionId} updated successfully.`);
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
