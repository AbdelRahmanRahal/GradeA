import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

// Responsive Dialog Component
const EntryResponsiveDialog = ({ open, onClose, title, content, actions }) => {
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

// Create Entry Dialog Component
const CreateEntryDialog = ({ open, onClose, onCreateEntry, courseID, sectionID }) => {
    const [type, setType] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = () => {
        const entryData = { type, title, content, description };
        onCreateEntry(entryData, courseID, sectionID); // Pass the entry data to the parent component
        onClose(); // Close the dialog after creating the entry
        setType('');
        setTitle('');
        setContent('');
        setDescription('');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Entry</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        label="Type"
                        required
                    >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="link">Link</MenuItem>
                        <MenuItem value="assignment">Assignment</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Title"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                {type === 'text' ? (
                    <TextField
                        label="Content"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        multiline
                        rows={4}
                    />
                ) : (
                    <>
                        <TextField
                            label="Description"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            rows={4}
                        />
                        {type === 'link' && (
                            <TextField
                                label="URL"
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" variant="outlined">
                    Cancel
                </Button>
                <Button onClick={handleCreate} color="primary" variant="contained">
                    Create Entry
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Edit Entry Dialog Component
const EditEntryDialog = ({ open, onClose, entry, onEditEntry, courseID, sectionID, entryID }) => {
    const [type, setType] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (entry) {
            setType(entry.type || '');
            setTitle(entry.title || '');
            setContent(entry.content || '');
            setDescription(entry.description || '');
        }
    }, [entry]);

    const handleEdit = () => {
        const updatedEntryData = { id:entryID, type, title, content, description };
        onEditEntry(entryID, updatedEntryData, courseID, sectionID);
        onClose(); // Close the dialog after editing
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Entry</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        label="Type"
                        required
                    >
                        <MenuItem value="text">Text</MenuItem>
                        <MenuItem value="link">Link</MenuItem>
                        <MenuItem value="assignment">Assignment</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Title"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                {type === 'text' ? (
                    <TextField
                        label="Content"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        multiline
                        rows={4}
                    />
                ) : (
                    <>
                        <TextField
                            label="Description"
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            rows={4}
                        />
                        {type === 'link' && (
                            <TextField
                                label="URL"
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        )}
                    </>
                )}
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

export { EntryResponsiveDialog, CreateEntryDialog, EditEntryDialog };
