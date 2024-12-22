import React, {useState} from "react";

const ItemSelectionForm = ({role, items, setSelectedItems, selectedItems}) => {
    const handleSelectionChange = (abbreviation, checked) => {
        if (role === "student") {
            // Students can only select one
            setSelectedItems(checked ? [abbreviation] : []);
        } else {
            // Professors can select multiple
            setSelectedItems(
                checked
                    ? [...selectedItems, abbreviation]
                    : selectedItems.filter((abbr) => abbr !== abbreviation)

            );
        }
    };

    return (
        <div className="border-gray-300 border-2 rounded-[15px] overflow-hidden max-h-80">
            <div className="overflow-y-auto max-h-80">
                <table className="table-bordered table-hover table-responsive-xl border-black rounded-lg shadow-xl"
                       style={{
                           width: '100%'
                       }}>
                    <tbody>
                    {items.map((item) => (
                        <tr key={item.id}
                            className={item .id % 2 === 0 ? 'bg-[#D3D3D3]' : ''}>
                            <td className="px-12 py-4 pl-4"> {item.name} </td>
                            <td className="px-12 py-4 pr-4"><input
                                type="checkbox"
                                checked={selectedItems.includes(item.abbreviation)}
                                onChange={(e) =>
                                    handleSelectionChange(item.abbreviation, e.target.checked)
                                }
                                disabled={(role === "student") && selectedItems.length >= 1 && !selectedItems.includes(item.abbreviation)}
                                className="scale-150"
                                // Disable other checkboxes if the user is a student and already selected one
                                style={{marginRight: '10px'}}
                            /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {(role === "student") && selectedItems.length > 1 && (
                <p className="text-red-500">Students can only select one field.</p>
            )}
        </div>
    );
};

export default ItemSelectionForm;