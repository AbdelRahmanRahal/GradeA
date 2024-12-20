import React from "react";

const DataTable = ({ data, columns, renderRow }) => {
  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} className="border px-4 py-2">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map(renderRow)}</tbody>
    </table>
  );
};

export default DataTable;
