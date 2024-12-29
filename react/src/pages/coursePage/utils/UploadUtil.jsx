const UploadUtil = ({ setData }) => { // I have no clue what to do here.
    //I believe there should be a way to use this util once for the student and once for the professor.
    //up to you how u wanna do that.
    
    
   

    // Function to add a new assignment
    const uploadAssignment = async (assignmentData, courseId, sectionId, entryId) => {
        try {
            const response = await fetch(`/api/courses/${courseId}/${sectionId}/${entryId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(assignmentData),
            });

            if (response.ok) {
                const newAssignment = await response.json();
                // Update state with the new assignment
                setData((prevData) =>
                    prevData.map((course) =>
                        course.id === courseId
                            ? {
                                ...course,
                                assignments: [...course.assignments, newAssignment],
                            }
                            : course,
                    ),
                );
                console.log(`Assignment ${newAssignment.id} added successfully.`);
            } else {
                console.error("Failed to add assignment:", response.statusText);
            }
        } catch (error) {
            console.error("Error adding assignment:", error);
        }
    };

    return {
        uploadAssignment
    };
};

export default UploadUtil;
