import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {toast} from "react-toastify";

const UploadAssignmentDialog = ({ open, onClose, onUploadAssignment }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Grab the first file from the file input
    };

    const handleUpload = () => {
        if (!file) {
            toast.error('Please select a file to upload.');
            return;
        }

        onUploadAssignment(file); // Pass the file back to the parent component
        onClose(); // Close the dialog
        setFile(null); // Reset the file input
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Upload Assignment</DialogTitle>
            <DialogContent>
                <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    {file ? file.name : "Choose File"}
                    <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleUpload} color="primary" variant="contained">
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadAssignmentDialog;
