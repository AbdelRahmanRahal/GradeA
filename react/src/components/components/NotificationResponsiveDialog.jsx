import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// Create Notification Dialog Component
const CreateNotificationDialog = ({
  open,
  onClose,
  onCreateNotification,
  courseID,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    const notificationData = { title, description, courseID }; // Include courseID with title and description
    onCreateNotification(notificationData); // Pass the notification data to the parent component
    onClose(); // Close the dialog after creating the notification
    setTitle(""); // Reset the input fields
    setDescription("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Notification</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          variant="outlined"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Description"
          fullWidth
          variant="outlined"
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          Create Notification
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Edit Notification Dialog Component
const EditNotificationDialog = ({
  open,
  onClose,
  notification,
  onEditNotification,
  courseID,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (notification) {
      setTitle(notification.title || "");
      setDescription(notification.description || "");
    }
  }, [notification]);

  const handleEdit = () => {
    const updatedNotificationData = {
      id: notification.id,
      title,
      description,
      courseID,
    };
    onEditNotification(updatedNotificationData); // Pass the updated notification data to the parent component
    onClose(); // Close the dialog after editing
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Notification</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          fullWidth
          variant="outlined"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Description"
          fullWidth
          variant="outlined"
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

export { CreateNotificationDialog, EditNotificationDialog };
