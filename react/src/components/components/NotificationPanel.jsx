import React, { useEffect, useState } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popper,
  Paper,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";

function NotificationPanel({ courseID }) {
  const [data, setData] = useState([]); //temp

  useEffect(() => {
    fetch("/api/notifications") // Just so i can test the frontend
      .then((response) => response.json())
      .then((data) => setData(data.reverse())) // Reverse to have the latest notifications first
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the Popper
  const open = Boolean(anchorEl); // Boolean to determine if Popper is open

  // Handle click away to close the Popper
  const handleClickAway = () => {
    setAnchorEl(null); // Close Popper when clicking outside
  };

  // Function to handle button click to toggle Popper visibility
  const handleToggle = (event) => {
    setAnchorEl((prevAnchorEl) => (prevAnchorEl ? null : event.currentTarget)); // Toggle anchorEl
  };

  return (
    <div>
      {/* Notifications Button */}
      <IconButton aria-label="notifications" onClick={handleToggle}>
        <NotificationsIcon />
      </IconButton>

      {/* Popper with ClickAwayListener wrapping only the Popper */}
      {open && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom" // Position of the Popper
            style={{ zIndex: 1300 }}
          >
            <Paper elevation={3} sx={{ width: 300, maxHeight: 300 }}>
              <List
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                }}
              >
                {" "}
                {/*Reminder to fix the lack of a rounded edge, and an animation*/}
                <div
                  style={{
                    maxHeight: 300,
                    overflowX: "hidden", // Hide horizontal overflow
                    overflowY: "auto", // Allow vertical scrolling
                  }}
                >
                  {data.slice(0, 3).map((notif, index) => (
                    <div key={notif.id}>
                      <ListItem
                        sx={{ marginLeft: (theme) => theme.spacing(2) }}
                        disableGutters
                        secondaryAction={
                          <IconButton aria-label="comment"></IconButton>
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {notif?.title}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              sx={{
                                borderLeft: "4px solid #808080",
                                paddingLeft: 2,
                                marginTop: 2,
                              }}
                            >
                              {notif?.description}
                            </Typography>
                          }
                        />
                      </ListItem>

                      {/* Separator Line (between notifications) */}
                      {index < data.slice(0, 3).length - 1 && (
                        <div
                          style={{
                            borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                            marginLeft: 16,
                            marginRight: 16,
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </List>
            </Paper>
          </Popper>
        </ClickAwayListener>
      )}
    </div>
  );
}

export default NotificationPanel;
