import React, { useEffect, useState } from "react";
import {
  AddButton,
  BellButton,
} from "../../coursesList/components/ButtonA.jsx";
import NotificationModifyUtils from "../utils/NotifModifyUtils";
import { CreateNotificationDialog } from "../../../components/components/NotificationResponsiveDialog.jsx";

function ProfessorToolbar({ onAdd, onBell }) {
  const [data, setData] = useState([]);
  const [openCreateNotificationDialog, setOpenCreateNotificationDialog] =
    useState(false);
  const { deleteNotification, addNotification, editNotification } =
    NotificationModifyUtils({ setData: setData });

  useEffect(() => {
    fetch("/api/notifications")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) =>
        console.error("Error fetching notifications im tireed:", error),
      );
  }, []);

  const handleCreateNotification = async (notificationData) => {
    try {
      console.log("DEFINITELY USING ADDCOURDAsaasfASDSE");
      await addNotification(notificationData);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className={`mr-2 max-h-screen overflow-hidden mb-6`}>
      <div
        className={`flex container-xl lg:container m-auto min-w-full gap-6 rounded-lg border border-black shadow-md hover:bg-gray-100 overflow-hidden justify-center items-center`}
      >
        <AddButton
          onClick={onAdd}
          buttonFeature={"ml-1 mb-2.5 text-gray-300 hover:text-gray-400"}
        />
        <BellButton onClick={() => setOpenCreateNotificationDialog(true)} />
      </div>
      <CreateNotificationDialog
        open={openCreateNotificationDialog}
        onClose={() => setOpenCreateNotificationDialog(false)}
        onCreateCourse={handleCreateNotification}
      />
    </div>
  );
}

export default ProfessorToolbar;
