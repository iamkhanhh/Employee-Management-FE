import React from "react";

export default function Table({ columns, data }) {
  return (
    <table className="min-w-full border border-gray-200 text-sm text-left">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col.accessor} className="px-4 py-2 border-b font-semibold text-gray-700">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-2 border-b">
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center py-4 text-gray-500">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
