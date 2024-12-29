import React from "react";

function DescriptionBox({ description }) {
  return (
      <div
          className={`mr-2 max-h-screen overflow-hidden`}
      >
        <div
            className={`flex-col container-xl lg:container m-auto min-w-full gap-6 rounded-lg border border-black shadow-md hover:bg-gray-100 overflow-hidden`}>
          <h2 className={`text-2xl m-4 font-bold pl-2`}>Description:</h2>
          <p className={`m-2`}>{description}</p>
        </div>
      </div>
  );
}

export default DescriptionBox;
