import { useState } from 'react';

import { supabase } from '../../../supabase.js';

const SectionModifyUtils = ({ setData }) => {
    // Function to delete a section
  const deleteSection = async (sectionId, courseId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("courses")
        .select("content")
        .eq("id", courseId)
        .single();

      if (fetchError) throw fetchError;

      const updatedContent = data.content.filter(
        (section) => section.id !== sectionId
      );

      const { error: updateError } = await supabase
        .from("courses")
        .update({ content: updatedContent })
        .eq("id", courseId);

      if (updateError) throw updateError;

      setData((prev) => ({ ...prev, content: updatedContent }));
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

    // Function to add a new section
  const addSection = async (sectionData, courseId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("courses")
        .select("content")
        .eq("id", courseId)
        .single();

      if (fetchError) throw fetchError;

      const currentContent = data.content || [];
      if (!Array.isArray(currentContent)) {
        throw new Error("Content is not an array.");
      }

      // Assign an ID based on the highest existing ID or start with 1
      const newId =
        currentContent.length > 0
          ? Math.max(...currentContent.map((section) => section.id || 0)) + 1
          : 1;

      const newSection = {
        id: newId,
        title: sectionData.title,
        entries: [], // Initialize with an empty array
      };

      const updatedContent = [...currentContent, newSection];

      const { error: updateError } = await supabase
        .from("courses")
        .update({ content: updatedContent })
        .eq("id", courseId);

      if (updateError) throw updateError;

      setData((prev) => ({ ...prev, content: updatedContent }));
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };  

  // Function to edit an existing section
  const editSection = async (sectionId, updatedSectionData, courseId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("courses")
        .select("content")
        .eq("id", courseId)
        .single();

      if (fetchError) throw fetchError;

      const updatedContent = data.content.map((section) =>
        section.id === sectionId
          ? { ...section, ...updatedSectionData }
          : section
      );

      const { error: updateError } = await supabase
        .from("courses")
        .update({ content: updatedContent })
        .eq("id", courseId);

      if (updateError) throw updateError;

      setData((prev) => ({ ...prev, content: updatedContent }));
    } catch (error) {
      console.error("Error editing section:", error);
    }
  };

  return {
    deleteSection,
    addSection,
    editSection,
  };
};

export default SectionModifyUtils;
