import React from "react";
import Button from "./Button";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-[350px]">
        <p className="text-gray-800 text-center mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <Button label="Cancel" variant="secondary" onClick={onCancel} />
          <Button label="Confirm" variant="primary" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}
