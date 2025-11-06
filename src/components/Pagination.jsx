import React from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded border ${page === currentPage ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
