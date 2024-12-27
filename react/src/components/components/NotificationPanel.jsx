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
import { fetchRole } from "../../utils/CacheWorkings.jsx";
import NotificationEntry from "./NotificationEntry.jsx";
import Fade from "@mui/material/Fade";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import {CreateNotificationDialog} from "./NotificationResponsiveDialog.jsx";
import NotificationModifyUtils from "../../pages/coursePage/utils/NotifModifyUtils.jsx";
import {SectionResponsiveDialog} from "../../pages/coursePage/components/SectionResponsiveDialog.jsx";

function NotificationPanel({ courseID, isInCourse, onAdd, isInNotifDialog }) {
  const [data, setData] = useState([]); //temp
  const [role, setRole] = useState("student");

  const [deleteNotificationDialogOpen, setDeleteNotificationDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const { deleteNotification, addNotification, editNotification } =
      NotificationModifyUtils({ setData: setData });
  
  //for creating notifs

  const [openCreateNotificationDialog, setOpenCreateNotificationDialog] =
      useState(false);
  
  //end of creating notifs
  
  //for deleting notifs
  // for deletion
  const handleOpenDeleteNotificationDialog = (notif) => {
    setSelectedNotification(notif);
    setDeleteNotificationDialogOpen(true); // Open the dialog
  };

  const handleConfirmRemoveNotification = async (notificationID, courseID) => {
    console.log(`Removing notification: ${notificationID}`);
    await deleteNotification(notificationID, courseID);
    // Perform the remove logic here (e.g., API call, state update, which of course, is subject to change)
    setDeleteNotificationDialogOpen(false); // Close the dialog after confirming
  };
  //end for deleting notifs

  useEffect(() => {
    const getRole = async () => {
      const role = await fetchRole();
      setRole(role);
    };

    fetch("/api/notifications") // Just so i can test the frontend
      .then((response) => response.json())
      .then((data) => setData(data.reverse())) // Reverse to have the latest notifications first
      .catch((error) => console.error("Error fetching courses:", error));

    if (isInCourse) {
      getRole();
    }
  }, []);

  const handleCreateNotification = async (notificationData, courseID) => { //This will have to be modified as well to work with the API, ROBINLOOKATME
    try {
      await addNotification(notificationData);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the Popper
  const [open, setOpen] = useState(false); // Boolean to determine if Popper is open

  // Handle click away to close the Popper
  const handleClickAway = () => {
      setOpen(false);
      setAnchorEl(null);
      console.log("edit hawehuawhe");
    // setOpen(false);
    // setAnchorEl(null);
    // console.log("edit hawehuawhe");
    // Close Popper when clicking outside, however I could just switch handleCLickAway for handleToggle. I won't though.
    // previous comment is pointless second half through. I am too lazy to delete the old comment. <3
  };

  const handleClick = (event) => {
    console.log("VERY COOL COMMENT " + event)
    console.log(anchorEl);
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  return (
    <div>
      {/* Notifications Button */}
      <IconButton aria-label="notifications" onClick={handleClick}>
        <NotificationsIcon />
      </IconButton>

      {/* Popper wrapping the insignificant ClickAwayListener. */}
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom" // Position of the Popper
        style={{ zIndex: 1300 }}
        transition
      >
        {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Fade {...TransitionProps}>
          <div
            className={`duration-200 transition-all max-w-[256px] shadow-md rounded-lg border border-black overflow-hidden bg-gray-100`}
          >
            <div className={`overflow-y-auto overflow-x-hidden scrollbar-transparent`}>
              {role === "professor" && isInCourse && (
                  <div className="mt-2 text-gray-500 text-center hover:text-red-600 min-w-full transition-all duration-200">
                    <button onClick={() => setOpenCreateNotificationDialog(true)}><NotificationAddIcon/> Send out notification</button>
                  </div>
              )}
              <div className="flex-col max-h-72 container-xl lg:container m-auto gap-6 transition-all bg-gray-100 scroll-smooth">
                {data.map((notif, index) => (
                  <div className={``} key={notif.id}>
                    <NotificationEntry
                      data={notif}
                      role={role}
                      isInCourse={isInCourse}
                      onRemove={() => handleOpenDeleteNotificationDialog(notif)}
                    ></NotificationEntry>
                    {index < data.length - 1 && (
                      <div
                        style={{
                          borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                          marginLeft: 16,
                          marginRight: 2,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <CreateNotificationDialog
                open={openCreateNotificationDialog}
                onClose={() => setOpenCreateNotificationDialog(false)}
                onCreateNotification={handleCreateNotification}
            />
            <SectionResponsiveDialog
                open={deleteNotificationDialogOpen}
                onClose={() => setDeleteNotificationDialogOpen(false)}
                title="Confirm Remove"
                content={`Are you sure you want to remove the notification "${selectedNotification?.title}"?`}
                actions={[
                  {
                    label: "Cancel",
                    onClick: () => setDeleteNotificationDialogOpen(false),
                  },
                  {
                    label: "Remove",
                    onClick: () =>
                        handleConfirmRemoveNotification(data?.id, selectedNotification?.id),
                    color: "error",
                  },
                ]}
            />
          </div>
          </Fade>
        </ClickAwayListener>)}
      </Popper>
    </div>
  );
}

export default NotificationPanel;
