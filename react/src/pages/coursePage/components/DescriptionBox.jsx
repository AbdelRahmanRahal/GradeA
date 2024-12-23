import React from "react";

function DescriptionBox({ description }) {
  return (
      <div
          className={`mr-2 max-h-screen overflow-hidden`}
      >
        <div
            className={`flex-col container-xl lg:container m-auto min-w-full gap-6 rounded-lg border border-black shadow-md hover:bg-gray-100 overflow-hidden`}>
          <h2 className={`text-2xl m-4 font-bold pl-2`}>Description:</h2>
          <p className={`m-2`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at lorem ullamcorper, egestas nulla id,
            efficitur lacus. Mauris maximus fringilla erat eget laoreet. Vestibulum molestie aliquam ullamcorper. Mauris
            mauris velit, varius in lectus et, dictum dapibus mauris. Pellentesque habitant morbi tristique senectus et
            netus et malesuada fames ac turpis egestas. Phasellus tempor, nibh at cursus condimentum, libero purus
            placerat dui, eu porttitor lorem est ut neque. Duis non mollis ante, quis condimentum ipsum. Etiam luctus
            eros vitae tortor viverra fermentum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur
            ridiculus mus.</p>
        </div>
      </div>
  );
}

export default DescriptionBox;
