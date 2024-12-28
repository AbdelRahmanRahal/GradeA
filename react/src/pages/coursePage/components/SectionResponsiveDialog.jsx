import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// Responsive Dialog Component
const SectionResponsiveDialog = ({ open, onClose, title, content, actions }) => {
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

// Create Section Dialog Component
const CreateSectionDialog = ({ open, onClose, onCreateSection, courseID }) => {
    const [sectionName, setSectionName] = useState('');
    // const [sectionDescription, setSectionDescription] = useState('');

    const handleCreate = () => {
        const sectionData = { name: sectionName };
        onCreateSection(sectionData, courseID); // Pass the section data to the parent component
        onClose(); // Close the dialog after creating the section
        setSectionName(''); // Reset the input fields
        // setSectionDescription('');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Section</DialogTitle>
            <DialogContent>
                <TextField
                    label="Section Name"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    required
                />
                {/*<TextField*/}
                {/*    label="Section Description"*/}
                {/*    fullWidth*/}
                {/*    variant="outlined"*/}
                {/*    margin="normal"*/}
                {/*    value={sectionDescription}*/}
                {/*    onChange={(e) => setSectionDescription(e.target.value)}*/}
                {/*    required*/}
                {/*    multiline*/}
                {/*    rows={4}*/}
                {/*/>*/}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleCreate} color="primary" variant="contained">
                    Create Section
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const EditSectionDialog = ({ open, onClose, section, onEditSection, courseID }) => {
    const [sectionName, setSectionName] = useState('');
    // const [sectionDescription, setSectionDescription] = useState('');

    useEffect(() => {
        if (section) {
            console.log('Received section for editing:', section); // Add logging to check section data
            setSectionName(section.name || ''); // Ensure the field is never undefined
            // setSectionDescription(section.description || ''); // Ensure the field is never undefined
        }
    }, [section]); // Dependency array ensures this runs when `section` changes

    const handleEdit = () => {
        const updatedSectionData = { id: section.id, name: sectionName };
        onEditSection(updatedSectionData, courseID);
        console.log('Updated section data:', updatedSectionData); // Pass the updated section data to the parent component
        onClose(); // Close the dialog after editing
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogContent>
                <TextField
                    label="Section Name"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    required
                />
                {/*<TextField*/}
                {/*    label="Section Description"*/}
                {/*    fullWidth*/}
                {/*    variant="outlined"*/}
                {/*    margin="normal"*/}
                {/*    value={sectionDescription}*/}
                {/*    onChange={(e) => setSectionDescription(e.target.value)}*/}
                {/*    required*/}
                {/*    multiline*/}
                {/*    rows={4}*/}
                {/*/>*/}
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


export { SectionResponsiveDialog, CreateSectionDialog, EditSectionDialog };
