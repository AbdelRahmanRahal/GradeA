import React, { useState } from "react";

const SearchBar = ({ setSearch }) => {
  const [tempSearch, setTempSearch] = useState("");

  const handleSearch = () => {
    setSearch(tempSearch); // Trigger search only on button click
  };

  return (
    <div className="flex mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={tempSearch}
        onChange={(e) => setTempSearch(e.target.value)}
        className="border p-2 flex-grow"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 ml-2">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
