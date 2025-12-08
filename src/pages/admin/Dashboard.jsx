import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';

// MUI Charts
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';

// Services
import { getDashboardStats } from '../../services/dashboardService';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';


// ========================
//     STAT CARD STYLE
// ========================
const StatCard = ({ title, value, icon }) => (
  <Card
    sx={{
      height: '100%',
      borderRadius: 4,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      background: '#fff',
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);


const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.status === 'success') {
          setStats(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex', justifyContent: 'center',
          alignItems: 'center', height: '80vh'
        }}
      >
        <CircularProgress />
      </Box>
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
    <Box sx={{ flexGrow: 1, p: 3, background: '#f7f9fc', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>

        {/* ======= TOP CARDS ======= */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Employees"
            value={overviewStats.totalEmployees}
            icon={<PeopleIcon color="primary" sx={{ fontSize: 32 }} />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Departments"
            value={overviewStats.totalDepartments}
            icon={<BusinessIcon color="primary" sx={{ fontSize: 32 }} />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="New Hires (Month)"
            value={overviewStats.newHiresThisMonth}
            icon={<PersonAddIcon color="success" sx={{ fontSize: 32 }} />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Turnover (Month)"
            value={overviewStats.staffTurnoverThisMonth}
            icon={<TrendingDownIcon color="error" sx={{ fontSize: 32 }} />}
          />
        </Grid>


        {/* ======= PIE CHARTS ======= */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Personnel by Department
              </Typography>
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
                    paddingAngle: 4,
                    cornerRadius: 3,
                  }
                ]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Contract Type Distribution
              </Typography>
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
                    paddingAngle: 4,
                    cornerRadius: 3,
                  }
                ]}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>


        {/* ======= SALARY BAR CHART ======= */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Total Salary by Department
              </Typography>
              <BarChart
                dataset={salaryByDepartment}
                xAxis={[{ scaleType: 'band', dataKey: 'deptName' }]}
                series={[
                  {
                    dataKey: 'totalSalary',
                    label: 'Total Salary',
                    color: '#4285f4',
                  }
                ]}
                height={400}
                yAxis={[
                  {
                    valueFormatter: (value) => value.toLocaleString(),
                  },
                ]}
              />
            </CardContent>
          </Card>
        </Grid>


        {/* ======= LINE CHART: Employee Over Time ======= */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Employee Count Over Time
              </Typography>

              <LineChart
                xAxis={[
                  {
                    scaleType: 'point',
                    data: employeeCountOverTime.map(item => item.month),
                  },
                ]}
                series={[
                  {
                    data: employeeCountOverTime.map(item => item.employeeCount),
                    label: 'Employees',
                    color: '#0F9D58',
                    curve: 'monotoneX',
                  },
                ]}
                height={400}
                slotProps={{
                  legend: {
                    position: { vertical: 'top', horizontal: 'right' }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;
