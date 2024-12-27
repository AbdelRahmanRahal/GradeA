import { supabase } from '../../../supabase.js';

const EntryModifyUtils = ({ setData }) => { // If i'm honest, all of this is is just temporary. there is no way it'd be this messy with supabase.
    // Function to delete an entry
    const deleteEntry = async (entryId, sectionId, courseId) => {
        try {
            const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}/entries/${entryId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                // If successful, remove the deleted entry from the state
                setData((prevData) =>
                    prevData.map((section) =>
                        section.id === sectionId
                            ? { ...section, entries: section.entries.filter((entry) => entry.id !== entryId) }
                            : section
                    )
                );
                console.log(`Entry ${entryId} deleted successfully.`);
            } else {
                console.error('Failed to delete entry:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

    // Function to add a new entry
    const addEntry = async (entryData, courseId, sectionId) => {
    try {
      console.log(courseId);
      const { data, error: fetchError } = await supabase
      .from("courses")
      .select("content")
      .eq("id", courseId)
      .single();
      console.log(data);
      
      if (fetchError) throw fetchError;
      

        const updatedContent = data.content.map((section) =>
            section.id === sectionId
                ? { ...section, entries: [...section.entries, entryData] }
                : section
        );

        const { error: updateError } = await supabase
            .from("courses")
            .update({ content: updatedContent })
            .eq("id", courseId);

        if (updateError) throw updateError;

        setData((prevData) => ({
            ...prevData,
            content: updatedContent,
        }));
        console.log(`Entry added successfully.`);
    } catch (error) {
        console.error("Error adding entry:", error);
    }
};

    // Function to edit an existing entry
    const editEntry = async (entryId, updatedEntryData, courseId, sectionId) => {
      console.log(courseId);
      console.log(sectionId);
      console.log(entryId);
        try {
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
              entries: section.entries.map((entry, index) =>
                index === entryId ? { ...entry, ...updatedEntryData } : entry
            ),
          }
          : section
        );
        
            const { error: updateError } = await supabase
                .from("courses")
                .update({ content: updatedContent })
                .eq("id", courseId);

            if (updateError) throw updateError;

            setData((prevData) => ({
                ...prevData,
                content: updatedContent,
            }));
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
