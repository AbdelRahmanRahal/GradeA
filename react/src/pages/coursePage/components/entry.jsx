import React, { useState } from "react";
import {
  AccessButton,
  EditButton,
  RemoveButton,
} from "../../coursesList/components/ButtonA.jsx";
import {
  FaVideo,
  FaLink,
  FaExclamationCircle,
  FaCircleNotch,
  FaChevronDown,
  FaChevronRight,
  FaFileDownload,
  FaCloudUploadAlt
} from "react-icons/fa";
import UploadAssignmentDialog from "./UploadAssignmentDialog.jsx";

const Entry = ({ entryData, role, onEditEntry, onRemoveEntry }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // State to control collapse/expand
  const [openUploadDialog, setUploadDialog] =
      useState(false);

  const handleUploadAssignment = async (sectionData, courseID) => {
    try {
      console.log("DEFINITELY USING ADDCSEIsdsdssasasadCUETIONCE");
      // await addAssignment(sectionData, courseID);
      //LOOKATME, somewhere here should call the API (addAssignment) and hand it the uploaded file.
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <section className="py-4 min-w-full">
      <div>
        <div className="flex items-center">
          {/* Collapse Button */}
          <button onClick={toggleCollapse} className="mr-2 text-lg">
            {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
          </button>
          {/* Title based on entry type */}
          {entryData.type === "link" &&
            entryData.url.includes("youtube.com") && (
              <button
                onClick={toggleCollapse}
                className="text-2xl font-bold h-12 mt-2 ml-5 flex"
              >
                <FaVideo className="mt-1 mr-2" />
                {entryData.title}
              </button>
            )}
          {entryData.type === "link" &&
            !entryData.url.includes("youtube.com") && (
              <button
                onClick={toggleCollapse}
                className="text-2xl font-bold h-12 mt-2 ml-5 flex"
              >
                <FaLink className="mt-1 mr-2" />
                {entryData.title}
              </button>
            )}
          {entryData.type === "text" && (
            <button
              onClick={toggleCollapse}
              className="text-2xl font-bold h-12 mt-2 ml-5 flex"
            >
              <FaCircleNotch className="mt-1 mr-2" />
              {entryData.title}
            </button>
          )}
          {entryData.type === "assignment" && (
            <div className="flex">
              <button
                onClick={toggleCollapse}
                className="text-2xl font-bold h-12 mt-2 ml-5 flex"
              >
                <FaExclamationCircle className="mt-1 mr-2" />
                {entryData.title}
              </button>
              <button
                className={`text-gray-500 hover:text-black py-2 px-2 text-xl transition-all mb-2 ml-2`}
                onClick={() => console.log("ouch i've been attacked. please change me to what downloading should do")}
              >
                <FaFileDownload /> {/*ROBINLOOKATME. see how to download, i have no idea how. upload too.*/}
              </button>
              <button
                className={`text-gray-500 hover:text-black py-2 px-2 text-xl transition-all mb-2 ml-2`}
                onClick={() => console.log("ouch i've been attacked. please change me to what uploading should do")}
              >
                <FaCloudUploadAlt className="text-2xl mt-0.5" />
              </button>
            </div>
          )}
        </div>

        {/* Collapsed content */}
        <div
          className={`transition-all duration-500 ${isCollapsed ? "max-h-0 overflow-hidden" : "ml-2 max-h-screen overflow-hidden"}`}
        >
          <div className="border border-transparent border-l-gray-600 border-l-2">
            <div>
              <p className="mt-2 ml-6 min-h-12">
                {entryData.type === "text"
                  ? entryData.content
                  : entryData.description}
              </p>
            </div>
            {entryData.type === "link" &&
              !entryData.url.includes("youtube.com") && (
                <a
                  className="ml-8 text-blue-800 underline"
                  href={entryData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {entryData.url}
                </a>
              )}
            {entryData.type === "link" &&
              entryData.url.includes("youtube.com") && (
                <iframe
                  className="ml-8 mb-6"
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(entryData.url)}`}
                  title={entryData.title}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            {entryData.type === "assignment" && (
              <p className="ml-6">Due Date: {entryData.dueDate}</p>
            )}
            <div className="flex gap-2 mt-3">
              {role === "professor" && (
                <div>
                  <EditButton onClick={onEditEntry} />
                  <RemoveButton onClick={onRemoveEntry} />
                </div>
              )}
            </div>
          </div>
        </div>
        <UploadAssignmentDialog
          open={openUploadDialog}
        onClose={() => setUploadDialog(false)}
        onUploadAssignment={handleUploadAssignment}/>
      </div>
    </section>
  );
};

const getYouTubeVideoId = (url) => {
  const videoId = url.match(/[\\?\\&]v=([^\\?\\&]+)/);
  return videoId && videoId[1] ? videoId[1] : "";
};

export default Entry;
