// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./routes/ProtectedRoute";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import ClientLayout from "./layouts/ClientLayout";

// Pages - Admin (chỉ ADMIN & HR)
import Dashboard from "./pages/admin/Dashboard";
import EmployeeList from "./pages/employeeScreens/EmployeeList";
import EmployeeDetail from "./pages/employeeScreens/EmployeeDetail";
import TaskList from "./pages/admin/TaskList";
import PayrollList from "./pages/admin/PayrollList";
import PayrolllManager from "./pages/admin/payrollManager";
import AccountManagementPage from "./pages/admin/AccountManagement";
import LeaveRequestsAdmin from "./pages/admin/LeaveRequestsAdmin";
import AttendanceManager from "./pages/admin/AttendanceManager";
import ContractManagement from "./pages/contractScreens/ContractManagement";
import DepartmentManagement from "./pages/departmentScreens/DepartmentManagement";
import KpiReviewPage from "./pages/admin/KpiReviewPage";
import NotificationPage from "./pages/admin/NotificationPage";
import EmployeeDocument from "./pages/employeeScreens/EmployeeDocument";

// Pages - Client (tất cả USER, ADMIN, HR đều vào được)
import MyProfile from "./pages/profile/MyProfile";
import MyAttendance from "./components/Attendance/MyAttendance";
import LeaveRequestPage from "./components/profile/LeaveRequestPage/LeaveRequestPage";
import NotificationClientPage from "./components/profile/NotificationPage/NotificationClientPage";
import MyTasks from "./pages/employeeScreens/MyTasks";

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
        {/* Root & Login */}
        <Route path="/" element={<Navigate to="/profile" replace />} />
        <Route path="/login" element={<Login />} />

        {/* ==================== CLIENT ROUTES - TẤT CẢ ROLE ĐỀU VÀO ĐƯỢC ==================== */}
        <Route element={<ProtectedRoute allowedRoles={["USER", "HR"]} />}>
          <Route element={<ClientLayout />}>
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/my-attendance" element={<MyAttendance />} />
            <Route path="/leave-requests" element={<LeaveRequestPage />} />
            <Route path="/my-kpi" element={<KpiReviewPage />} /> {/* USER xem KPI cá nhân */}
            <Route path="/notifications" element={<NotificationClientPage />} />
            <Route path="/my-tasks" element={<MyTasks />} />
          </Route>
        </Route>

        {/* ==================== ADMIN ROUTES - CHỈ ADMIN & HR ==================== */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN", "HR","ACCOUNTANT"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            
            {/* === NHÓM CHUNG (ADMIN, HR, ACCOUNTANT) === */}
            {/* Dashboard & Communication */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notification" element={<NotificationPage/>} />
            
            {/* Timekeeping (Chấm công, Nghỉ phép, Task) - Cả 3 role đều cần */}
            <Route path="attendance" element={<AttendanceManager />} />
            <Route path="leave-requests" element={<LeaveRequestsAdmin />} />
            <Route path="tasks" element={<TaskList />} />

            {/* === NHÓM HR MANAGEMENT (CHỈ ADMIN & HR) === */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN", "HR"]} />}>
              <Route path="employees" element={<EmployeeList />} />
              <Route path="employees/:id" element={<EmployeeDetail />} />
              <Route path="departments" element={<DepartmentManagement />} />
              <Route path="contracts" element={<ContractManagement />} />
              <Route path="account-management" element={<AccountManagementPage />} />
              <Route path="documents" element={<EmployeeDocument />} />
            </Route>

            {/* === ADMIN ONLY === */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="kpi-review" element={<KpiReviewPage />} />
            </Route>

            {/* === NHÓM PAYROLL (CHỈ ADMIN & ACCOUNTANT) === */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN", "ACCOUNTANT"]} />}>
              <Route path="payroll" element={<PayrollList />} />
              <Route path="payroll-manager" element={<PayrolllManager />} />
            </Route>
          </Route>
        </Route>

        {/* Redirect cũ để không bị lạc */}
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/profile" replace />} />
      </Routes>
    </>
  );
}

export default App;