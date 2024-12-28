import React, { useState, useEffect } from "react";
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
} from "react-icons/fa";

const Entry = ({ entryData, entryId, role, onEditEntry, onRemoveEntry }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // State to control collapse/expand

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
            entryData.content.includes("youtube.com") && (
              <button
                onClick={toggleCollapse}
                className="text-2xl font-bold h-12 mt-2 ml-5 flex"
              >
                <FaVideo className="mt-1 mr-2" />
                {entryData.title}
              </button>
            )}
          {entryData.type === "link" &&
            !entryData.content.includes("youtube.com") && (
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
            <button
              onClick={toggleCollapse}
              className="text-2xl font-bold h-12 mt-2 ml-5 flex"
            >
              <FaExclamationCircle className="mt-1 mr-2" />
              {entryData.title}
            </button>
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
            !entryData.content.includes("youtube.com") && (
              <a
                className="ml-8 text-blue-800 underline"
                href={entryData.content}
                target="_blank"
                rel="noopener noreferrer"
              >
                {entryData.content}
              </a>
            )}
          {entryData.type === "link" &&
            entryData.content.includes("youtube.com") && (
              <iframe
                className="ml-8 mb-6"
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(entryData.content)}`}
                title={entryData.title}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          {entryData.type === "assignment" && (
            <p className="ml-6">Due Date: {entryData.dueDate}</p>
          )}
          {role === "professor" && (
            <div className="flex gap-2 mt-3">
              <EditButton onClick={onEditEntry} />
              <RemoveButton onClick={onRemoveEntry} />
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  );
};

const getYouTubeVideoId = (url) => {
  const videoId = url.match(/[\\?\\&]v=([^\\?\\&]+)/);
  return videoId && videoId[1] ? videoId[1] : "";
};

export default Entry;
