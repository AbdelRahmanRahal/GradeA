// import { AccessButton, RemoveButton, EditButton } from "./ButtonA.jsx";
import { useNavigate } from "react-router-dom";
import { RemoveButton } from "../../pages/coursePage/components/ButtonB.jsx";
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

const NotificationEntry = ({ data, role, onRemove, isInCourse }) => {
  const navigate = useNavigate();

  return (
    <section className="my-3 max-w-full">
      <div className="container-xl ml-3 lg:container m-autogap-6 transition-all overflow-y-auto">
        <div className="flex">
          <h2 className="font-bold mb-2 mt-2 mr-2">{data.title}  </h2>
          {role === "professor" && isInCourse && (
            <div className="ml-auto mt-2 text-red-600 hover:text-red-700 transition-all duration-200">
                <button onClick={onRemove}><NotificationsOffIcon/></button>
            </div>
          )}
        </div>
        <p className="mb-2 mr-2">{data.description}</p>
      </div>
    </section>
  );
};
export default NotificationEntry;
