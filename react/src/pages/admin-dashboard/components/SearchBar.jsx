import React, { useState } from "react";

const SearchBar = ({ setSearch }) => {
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;

    if (typingTimeout) clearTimeout(typingTimeout); // Clear any existing timeout

    const timeout = setTimeout(() => {
      setSearch(value); // Update search only after debounce delay
    }, 500); // 500ms debounce delay

    setTypingTimeout(timeout);
  };

  return (
    <div className="flex mb-4">
      <input
        type="text"
        placeholder="Search..."
        onChange={handleSearchChange} // Debounced search handler
        className="border p-2 flex-grow"
      />
    </div>
  );
};

export default SearchBar;
