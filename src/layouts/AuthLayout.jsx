import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-gray-50 to-white">
      <Outlet /> {/* <-- Route con (LoginPage, ChangePasswordPage, etc) sẽ render ở đây */}
    </div>
  );
}
