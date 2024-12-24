import React, { useState } from "react";
import Entry from "./Entry";
import {
  AccessButton,
  EditButton,
  RemoveButton,
} from "../../coursesList/components/ButtonA.jsx";
import { AddButton } from "./ButtonB.jsx";
import {
  CreateEntryDialog,
  EditEntryDialog,
} from "./EntryResponsiveDialog.jsx";
import SectionModifyUtils from "../utils/SectionModifyUtils.jsx";
import EntryModifyUtils from "../utils/EntryModifyUtils.jsx";
import { ResponsiveDialog } from "../../coursesList/components/ResponsiveDialog.jsx";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const Section = ({
                   sectionData,
                   role,
                   onEdit,
                   onRemove,
                   onAddEntry,
                   onEditEntry,
                   onRemoveEntry,
                 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State to control collapse/expand

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const [data, setData] = useState(null);

  const [deleteEntryDialogOpen, setDeleteEntryDialogOpen] = useState(false);
  const [openCreateEntryDialog, setOpenCreateEntryDialog] = useState(false);
  const [openEditEntryDialog, setOpenEditEntryDialog] = useState(false);

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedEditEntry, setSelectedEditEntry] = useState(null);

  const { deleteSection, addSection, editSection } = SectionModifyUtils({
    setData: setData,
  });
  const { deleteEntry, addEntry, editEntry } = EntryModifyUtils({
    setData: setData,
  });

  const handleCreateEntry = async (entryData, courseID) => {
    try {
      await addEntry(entryData, courseID);
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };

  const handleEditEntry = async (entryData, courseID) => {
    try {
      await editEntry(entryData.id, entryData, courseID);
    } catch (error) {
      console.error("Error editing course:", error);
    }
  };

  const handleEditEntryDialog = (entry) => {
    setSelectedEditEntry(entry);
    setOpenEditEntryDialog(true);
  };

  const handleOpenDeleteEntryDialog = (course) => {
    setSelectedEntry(course);
    setDeleteEntryDialogOpen(true);
  };

  const handleConfirmRemoveEntry = async (entryID, courseID) => {
    await deleteEntry(entryID, courseID);
    setDeleteEntryDialogOpen(false);
  };

  return (
      <div className={`flex-col container-xl lg:container m-auto min-w-full gap-6 rounded-lg border border-black shadow-md hover:bg-gray-100 overflow-hidden`}>
        <div className="flex items-center relative">
          {/* Collapse/Expand Button */}
          <button onClick={toggleCollapse} className="text-lg ml-6">
            {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
          </button>
          <button onClick={toggleCollapse} className="text-2xl m-4 font-bold pl-2">
            {sectionData.title}
          </button>
          {role === "professor" && (
              <div className="flex flex-1 gap-2 items-center">
                <EditButton onClick={onEdit} />
                <RemoveButton onClick={onRemove} />
                <div className="ml-auto">
                  <button
                      className="text-gray-500 hover:text-black mr-4"
                      onClick={() => setOpenCreateEntryDialog(true)}
                  >
                    Add Entry
                  </button>
                </div>
              </div>
          )}
        </div>

        <div
            className={`transition-all duration-500 ${isCollapsed ? "max-h-0 overflow-hidden" : "ml-2 max-h-screen overflow-hidden"}`}
        >
          {sectionData.entries.length > 0 ? (
              sectionData.entries.map((entry, index) => (
                  <div key={index} className="flex items-center relative ml-6 border border-transparent border-l-gray-600 border-l-2">
                    <div className={`ml-3`}>
                      <Entry
                          entryData={entry}
                          role={role}
                          onRemoveEntry={() => handleOpenDeleteEntryDialog(entry)}
                          onEditEntry={() => handleEditEntryDialog(entry)}
                      />
                    </div>
                  </div>
              ))
          ) : (
              <h2>No entries available. Issue is in section.</h2>
          )}
        </div>

        {/* Add a fixed gap that doesn't depend on collapse */}
        <div className={`h-6`} /> {/* This gap will always be there below the entries */}

        <CreateEntryDialog
            open={openCreateEntryDialog}
            onClose={() => setOpenCreateEntryDialog(false)}
            onCreateEntry={handleCreateEntry}
            courseID={data?.id}
        />
        <EditEntryDialog
            open={openEditEntryDialog}
            onClose={() => setOpenEditEntryDialog(false)}
            entry={selectedEditEntry}
            onEditEntry={handleEditEntry}
            courseID={data?.id}
        />
        <ResponsiveDialog
            open={deleteEntryDialogOpen}
            onClose={() => setDeleteEntryDialogOpen(false)}
            title="Confirm Remove"
            content={`Are you sure you want to remove the entry "${selectedEntry?.name}"?`}
            actions={[
              { label: "Cancel", onClick: () => setDeleteEntryDialogOpen(false) },
              {
                label: "Remove",
                onClick: () =>
                    handleConfirmRemoveEntry(data?.id, selectedEntry?.id),
                color: "error",
              },
            ]}
        />
      </div>
  );
};

export default Section;
