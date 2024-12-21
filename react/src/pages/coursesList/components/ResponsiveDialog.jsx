import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// Responsive Dialog Component
const ResponsiveDialog = ({ open, onClose, title, content, actions }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <p>{content}</p>
            </DialogContent>
            <DialogActions>
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        onClick={action.onClick}
                        color={action.color || "primary"}
                        variant="contained"
                        sx={{ marginRight: 1 }}
                    >
                        {action.label}
                    </Button>
                ))}
            </DialogActions>
        </Dialog>
    );
};

// Create Course Dialog Component
const CreateCourseDialog = ({ open, onClose, onCreateCourse }) => {
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');

    const handleCreate = () => {
        const courseData = { name: courseName, description: courseDescription };
        onCreateCourse(courseData); // Pass the course data to the parent component
        onClose(); // Close the dialog after creating the course
        setCourseName(''); // Reset the input fields
        setCourseDescription('');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogContent>
                <TextField
                    label="Course Name"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                />
                <TextField
                    label="Course Description"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    required
                    multiline
                    rows={4}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleCreate} color="primary" variant="contained">
                    Create Course
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const EditCourseDialog = ({ open, onClose, course, onEditCourse }) => {
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');

    useEffect(() => {
        if (course) {
            console.log('Received course for editing:', course); // Add logging to check course data
            setCourseName(course.name || ''); // Ensure the field is never undefined
            setCourseDescription(course.description || ''); // Ensure the field is never undefined
        }
    }, [course]); // Dependency array ensures this runs when `course` changes

    const handleEdit = () => {
        const updatedCourseData = { id: course.id, name: courseName, description: courseDescription };
        onEditCourse(updatedCourseData);
        console.log('Updated course data:', updatedCourseData); // Pass the updated course data to the parent component
        onClose(); // Close the dialog after editing
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogContent>
                <TextField
                    label="Course Name"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    required
                />
                <TextField
                    label="Course Description"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    required
                    multiline
                    rows={4}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleEdit} color="primary" variant="contained">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export { ResponsiveDialog, CreateCourseDialog, EditCourseDialog };
