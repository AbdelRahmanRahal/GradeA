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
    const addEntry = async (entryData, sectionId, courseId) => {
        try {
            const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}/entries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entryData),
            });

            if (response.ok) {
                const newEntry = await response.json();
                // Update state with the new entry
                setData((prevData) =>
                    prevData.map((section) =>
                        section.id === sectionId
                            ? { ...section, entries: [...section.entries, newEntry] }
                            : section
                    )
                );
                console.log(`Entry ${newEntry.id} added successfully.`);
            } else {
                console.error('Failed to add entry:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding entry:', error);
        }
    };

    // Function to edit an existing entry
    const editEntry = async (entryId, updatedEntryData, sectionId, courseId) => {
        try {
            const response = await fetch(`/api/courses/${courseId}/sections/${sectionId}/entries/${entryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEntryData),
            });

            if (response.ok) {
                const updatedEntry = await response.json();
                // Update the entry data in the state
                setData((prevData) =>
                    prevData.map((section) =>
                        section.id === sectionId
                            ? {
                                ...section,
                                entries: section.entries.map((entry) =>
                                    entry.id === entryId ? updatedEntry : entry
                                ),
                            }
                            : section
                    )
                );
                console.log(`Entry ${entryId} updated successfully.`);
            } else {
                console.error('Failed to update entry:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating entry:', error);
        }
    };

    return {
        deleteEntry,
        addEntry,
        editEntry,
    };
};

export default EntryModifyUtils;
