import React, { useState } from 'react';
import Entry from './entry';
import { AccessButton, EditButton, RemoveButton } from "../../coursesList/components/ButtonA.jsx";
import { AddButton } from "./ButtonB.jsx";
import { CreateEntryDialog, EditEntryDialog } from "./EntryResponsiveDialog.jsx";
import SectionModifyUtils from "../utils/SectionModifyUtils.jsx";
import EntryModifyUtils from "../utils/EntryModifyUtils.jsx";
import { ResponsiveDialog } from "../../coursesList/components/ResponsiveDialog.jsx";

const Section = ({ sectionData, role, onEdit, onRemove, onAddEntry, onEditEntry, onRemoveEntry }) => {
    const [data, setData] = useState(null);

    const [deleteEntryDialogOpen, setDeleteEntryDialogOpen] = useState(false);
    const [openCreateEntryDialog, setOpenCreateEntryDialog] = useState(false);
    const [openEditEntryDialog, setOpenEditEntryDialog] = useState(false);

    const [selectedEntry, setSelectedEntry] = useState(null);
    const [selectedEditEntry, setSelectedEditEntry] = useState(null);

    const { deleteSection, addSection, editSection } = SectionModifyUtils({ setData: setData });
    const { deleteEntry, addEntry, editEntry } = EntryModifyUtils({ setData: setData });

    const handleCreateEntry = async (entryData, courseID) => {
        try {
            await addEntry(entryData, courseID);
        } catch (error) {
            console.error('Error creating entry:', error);
        }
    };

    const handleEditEntry = async (entryData, courseID) => {
        try {
            await editEntry(entryData.id, entryData, courseID);
        } catch (error) {
            console.error('Error editing course:', error);
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
        <div className="flex-col container-xl lg:container m-auto min-w-full gap-6 rounded-lg border border-black shadow-md transition-all hover:bg-gray-100 overflow-hidden">
            <div className="flex items-center relative">
                {/* Vertical line from the title */}
                <div className="absolute left-0 top-0 h-full border-l-2 border-gray-600"></div>
                <h2 className="text-2xl m-4 font-bold pl-6">{sectionData.title}</h2>
                {role === 'professor' && (
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
            {sectionData.entries.length > 0 ? (
                sectionData.entries.map((entry, index) => (
                    <div key={index} className="flex items-center relative ml-12">
                        <div className="absolute left-0 top-0 h-full border-l-2 border-gray-600"></div>

                        <Entry
                            entryData={entry}
                            role={role}
                            onRemoveEntry={() => handleOpenDeleteEntryDialog(entry)}
                            onEditEntry={() => handleEditEntryDialog(entry)}
                        />
                    </div>
                ))
            ) : (
                <h2>No entries available. Issue is in section.</h2>
            )}
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
                    { label: "Remove", onClick: () => handleConfirmRemoveEntry(data?.id, selectedEntry?.id), color: "error" },
                ]}
            />
        </div>
    );
};

export default Section;
