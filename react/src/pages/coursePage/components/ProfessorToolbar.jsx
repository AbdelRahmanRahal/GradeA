import React from "react";
import {
  AddButton,
  BellButton,
} from "../../coursesList/components/ButtonA.jsx";

function ProfessorToolbar({ onAdd, onBell }) {
  return (
    <div className={`mr-2 max-h-screen overflow-hidden mb-6`}>
      <div
        className={`flex container-xl lg:container m-auto min-w-full gap-6 rounded-lg border border-black shadow-md hover:bg-gray-100 overflow-hidden justify-center items-center`}
      >
        <AddButton
          onClick={onAdd}
          buttonFeature={"ml-1 mb-2.5 text-gray-300 hover:text-gray-400"}
        />
        <BellButton onClick={() => onBell} />
      </div>
    </div>
  );
}

export default ProfessorToolbar;
