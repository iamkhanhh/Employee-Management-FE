import React from "react";

export default function Button({ label, onClick, variant = "primary", disabled = false }) {
  const base = "px-4 py-2 rounded font-medium text-sm transition";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {label}
    </button>
  );
}
