const NotificationModifyUtils = ({ setData }) => {
  // Function to delete a notification
  const deleteNotification = async (notificationId, courseId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // If successful, remove the deleted notification from the state
        setData((prevData) =>
          prevData.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  notifications: course.notifications.filter(
                    (notification) => notification.id !== notificationId,
                  ),
                }
              : course,
          ),
        );
        console.log(`Notification ${notificationId} deleted successfully.`);
      } else {
        console.error("Failed to delete notification:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Function to add a new notification
  const addNotification = async (notificationData, courseId) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        const newNotification = await response.json();
        // Update state with the new notification
        setData((prevData) =>
          prevData.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  notifications: [...course.notifications, newNotification],
                }
              : course,
          ),
        );
        console.log(`Notification ${newNotification.id} added successfully.`);
      } else {
        console.error("Failed to add notification:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  // Function to edit an existing notification
  const editNotification = async (
    notificationId,
    updatedNotificationData,
    courseId,
  ) => {
    try {
      const response = await fetch(
        `/api/courses/${courseId}/notifications/${notificationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedNotificationData),
        },
      );

      if (response.ok) {
        const updatedNotification = await response.json();
        // Update the notification data in the state
        setData((prevData) =>
          prevData.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  notifications: course.notifications.map((notification) =>
                    notification.id === notificationId
                      ? updatedNotification
                      : notification,
                  ),
                }
              : course,
          ),
        );
        console.log(`Notification ${notificationId} updated successfully.`);
      } else {
        console.error("Failed to update notification:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  return {
    deleteNotification,
    addNotification,
    editNotification,
  };
};

export default NotificationModifyUtils;
