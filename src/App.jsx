import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import EmployeeList from "./pages/employeeScreens/EmployeeList";
import AttendanceList from "./pages/admin/AttendanceList";
import TaskList from "./pages/admin/TaskList";
import PayrollList from "./pages/admin/PayrollList";
import KPIList from "./pages/admin/KPIList";
import EmployeeDetail from "./pages/employeeScreens/EmployeeDetail";
import ContractManagement from "./pages/contractScreens/ContractManagement";
import DepartmentManagement from "./pages/departmentScreens/DepartmentManagement";
import ClientLayout from "./layouts/ClientLayout";
import MyProfile from "./pages/profile/MyProfile";
import AccountManagementPage from "./pages/admin/AccountManagement";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="account-management" element={<AccountManagementPage />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />
        <Route path="departments" element={<DepartmentManagement />} />
        <Route path="contracts" element={<ContractManagement />} />
        <Route path="attendance" element={<AttendanceList />} />
        <Route path="tasks" element={<TaskList />} />
        <Route path="payroll" element={<PayrollList />} />
        <Route path="kpi" element={<KPIList />} />
      </Route>

      {/* --- Khu vực CLIENT (người dùng) --- */}
      <Route element={<ClientLayout />}>
        <Route path="/profile" element={<MyProfile />} />
        {/* Có thể thêm các route khác như:
              <Route path="/settings" element={<Settings />} /> */}
      </Route>
    </Routes >
  );
}

export default App;
