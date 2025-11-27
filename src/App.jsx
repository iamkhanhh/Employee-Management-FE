// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./routes/ProtectedRoute";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";

// Pages - Admin
import Dashboard from "./pages/admin/Dashboard";
import EmployeeList from "./pages/employeeScreens/EmployeeList";
import EmployeeDetail from "./pages/employeeScreens/EmployeeDetail";
import TaskList from "./pages/admin/TaskList";
import PayrollList from "./pages/admin/PayrollList";
import KPIList from "./pages/admin/KPIList";
import AccountManagementPage from "./pages/admin/AccountManagement";
import LeaveRequestsAdmin from "./pages/admin/LeaveRequestsAdmin";
import AttendanceManager from "./pages/admin/AttendanceManager";
import ContractManagement from "./pages/contractScreens/ContractManagement";
import DepartmentManagement from "./pages/departmentScreens/DepartmentManagement";

// Pages - Client/User
import MyProfile from "./pages/profile/MyProfile";
import MyAttendance from "./components/Attendance/MyAttendance";
import LeaveRequestPage from "./components/profile/LeaveRequestPage/LeaveRequestPage";

// Auth
import Login from "./pages/auth/LoginPage";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#363636", color: "#fff" },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" }, duration: 4000 },
        }}
      />

      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* --- ADMIN ROUTES --- */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="account-management" element={<AccountManagementPage />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/:id" element={<EmployeeDetail />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="contracts" element={<ContractManagement />} />
            <Route path="attendance" element={<AttendanceManager />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="leave-requests" element={<LeaveRequestsAdmin />} />
            <Route path="payroll" element={<PayrollList />} />
            <Route path="kpi" element={<KPIList />} />
          </Route>
        </Route>

        {/* --- CLIENT/USER ROUTES --- */}
        <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
          <Route element={<ClientLayout />}>
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/my-attendance" element={<MyAttendance />} />
            <Route path="/leave-requests" element={<LeaveRequestPage />} />
          </Route>
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      </>
  );
}

export default App;
