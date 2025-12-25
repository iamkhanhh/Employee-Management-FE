import React, { useEffect, useState } from "react";
import { CircularProgress, Alert } from "@mui/material";

import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";

import { getDashboardStats } from "../../services/dashboardService";

import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";


const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
    <div className="flex items-center mb-2">
      {icon}
      <p className="ml-2 font-semibold text-gray-700">{title}</p>
    </div>
    <p className="text-3xl font-bold text-center">{value}</p>
  </div>
);


const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.status === "success") {
          setStats(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const {
    overviewStats,
    personnelByDepartment,
    contractTypeStats,
    salaryByDepartment,
    employeeCountOverTime,
  } = stats;


  return (
    <div className="p-0 min-h-screen bg-[#f7f9fc]">
      
      {/* TITLE */}
      <h1 className="text-3xl font-bold p-4">Dashboard Overview</h1>


      {/* ============================ SECTION 1: TOP CARDS ============================ */}
      <div className="w-full px-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <StatCard
            title="Total Employees"
            value={overviewStats.totalEmployees}
            icon={<PeopleIcon className="text-blue-600" sx={{ fontSize: 32 }} />}
          />

          <StatCard
            title="Total Departments"
            value={overviewStats.totalDepartments}
            icon={<BusinessIcon className="text-blue-600" sx={{ fontSize: 32 }} />}
          />

          <StatCard
            title="New Hires (Month)"
            value={overviewStats.newHiresThisMonth}
            icon={<PersonAddIcon className="text-green-600" sx={{ fontSize: 32 }} />}
          />

          <StatCard
            title="Turnover (Month)"
            value={overviewStats.staffTurnoverThisMonth}
            icon={<TrendingDownIcon className="text-red-600" sx={{ fontSize: 32 }} />}
          />

        </div>
      </div>


      {/* ============================ SECTION 2: PIE CHARTS ============================ */}
      <div className="w-full px-4 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* PIE 1 */}
          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-lg font-semibold mb-3">Personnel by Department</p>

            <PieChart
              series={[
                {
                  data: personnelByDepartment.map(dept => ({
                    id: dept.deptId,
                    label: dept.deptName,
                    value: dept.employeeCount,
                  })),
                  innerRadius: 40,
                  outerRadius: 120,
                },
              ]}
              height={300}
            />
          </div>

          {/* PIE 2 */}
          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-lg font-semibold mb-3">Contract Type Distribution</p>

            <PieChart
              series={[
                {
                  data: contractTypeStats.map(ct => ({
                    id: ct.contractType,
                    label: ct.contractType,
                    value: ct.employeeCount,
                  })),
                  innerRadius: 40,
                  outerRadius: 120,
                },
              ]}
              height={300}
            />
          </div>

        </div>
      </div>
      <div className="w-full px-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">

          {/* BAR CHART */}
          <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow p-4">
            <p className="text-lg font-semibold mb-3">Total Salary by Department</p>

            <BarChart
              dataset={salaryByDepartment}
              xAxis={[{ scaleType: "band", dataKey: "deptName" }]}
              series={[{ dataKey: "totalSalary", label: "Total Salary" }]}
              height={400}
            />
          </div>

          {/* LINE CHART */}
          <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow p-4">
            <p className="text-lg font-semibold mb-3">Employee Count Over Time</p>

            <LineChart
              xAxis={[
                {
                  scaleType: "point",
                  data: employeeCountOverTime.map((item) => item.month),
                },
              ]}
              series={[
                {
                  data: employeeCountOverTime.map((item) => item.employeeCount),
                  label: "Employees",
                  curve: "monotoneX",
                },
              ]}
              height={400}
            />
          </div>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;
