import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import EmployeeList from "./pages/employeeScreens/EmployeeList";
import DepartmentList from "./pages/admin/DepartmentList";
import ContractList from "./pages/contractScreens/ContractList";
import AttendanceList from "./pages/admin/AttendanceList";
import TaskList from "./pages/admin/TaskList";
import PayrollList from "./pages/admin/PayrollList";
import KPIList from "./pages/admin/KPIList";
import EmployeeDetail from "./pages/employeeScreens/EmployeeDetail";
import ContractCreate from "./pages/contractScreens/ContractCreate";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="Dashboard" element={<Dashboard />} />

        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/:id" element={<EmployeeDetail />} />

        <Route path="departments" element={<DepartmentList />} />

        <Route path="contracts" element={<ContractList />} />
        <Route path="contracts/create" element={<ContractCreate />} />

        <Route path="attendance" element={<AttendanceList />} />
        <Route path="tasks" element={<TaskList />} />
        <Route path="payroll" element={<PayrollList />} />
        <Route path="kpi" element={<KPIList />} />
      </Route>
    </Routes>
  );
}

export default App;
