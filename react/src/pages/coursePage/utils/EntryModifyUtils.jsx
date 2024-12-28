import { supabase } from '../../../supabase.js';

const EntryModifyUtils = ({ setData }) => {
    // Function to delete an entry
    const deleteEntry = async (entryId, sectionId, courseId) => {
        try {
            const { data, error: fetchError } = await supabase
                .from("courses")
                .select("content")
                .eq("id", courseId)
                .single();

            if (fetchError) throw fetchError;

            const updatedContent = data.content.map((section) =>
                section.id === sectionId
                    ? { ...section, entries: section.entries.filter((entry) => entry.id !== entryId) }
                    : section
            );

            const { error: updateError } = await supabase
                .from("courses")
                .update({ content: updatedContent })
                .eq("id", courseId);

            if (updateError) throw updateError;

            setData((prev) => ({ ...prev, content: updatedContent }));
            console.log(`Entry ${entryId} deleted successfully.`);
        } catch (error) {
            console.error("Error deleting entry:", error);
        }
    };

    // Function to add a new entry
    const addEntry = async (entryData, courseId, sectionId) => {
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

            const updatedContent = currentContent.map((section) => {
                if (section.id === sectionId) {
                    const currentEntries = section.entries || [];
                    const newId =
                        currentEntries.length > 0
                            ? Math.max(...currentEntries.map((entry) => entry.id || 0)) + 1
                            : 1;

                    const newEntry = {
                        id: newId,
                        ...entryData,
                    };

                    return { ...section, entries: [...currentEntries, newEntry] };
                }
                return section;
            });

            const { error: updateError } = await supabase
                .from("courses")
                .update({ content: updatedContent })
                .eq("id", courseId);

            if (updateError) throw updateError;

            setData((prev) => ({ ...prev, content: updatedContent }));
            console.log(`Entry added successfully.`);
        } catch (error) {
            console.error("Error adding entry:", error);
        }
    };

    // Function to edit an existing entry
    const editEntry = async (entryId, updatedEntryData, courseId, sectionId) => {
        try {
            console.log("entryID" + entryId);
            console.log("courseID" + courseId);
            console.log("SectionID" + sectionId);
            const { data, error: fetchError } = await supabase
                .from("courses")
                .select("content")
                .eq("id", courseId)
                .single();

            if (fetchError) throw fetchError;

            const updatedContent = data.content.map((section) =>
                section.id === sectionId
                    ? {
                        ...section,
                        entries: section.entries.map((entry) =>
                            entry.id === entryId ? { ...entry, ...updatedEntryData } : entry
                        ),
                    }
                    : section
            );

            const { error: updateError } = await supabase
                .from("courses")
                .update({ content: updatedContent })
                .eq("id", courseId);

            if (updateError) throw updateError;

            setData((prev) => ({ ...prev, content: updatedContent }));
            console.log(`Entry ${entryId} updated successfully.`);
        } catch (error) {
            console.error("Error updating entry:", error);
        }
    };

    return {
        deleteEntry,
        addEntry,
        editEntry,
    };
};

export default EntryModifyUtils;
