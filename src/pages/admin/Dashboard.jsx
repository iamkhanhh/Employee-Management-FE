import React from "react";
import { Paper, Typography, Grid } from "@mui/material";

export default function Dashboard() {
  return (
    <div className="p-6">
      <Typography variant="h4" className="font-semibold mb-6 text-gray-800">
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper className="p-4 text-center" elevation={1}>
            <Typography variant="h6">Employees</Typography>
            <Typography variant="h4" color="primary">120</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className="p-4 text-center" elevation={1}>
            <Typography variant="h6">Departments</Typography>
            <Typography variant="h4" color="primary">8</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className="p-4 text-center" elevation={1}>
            <Typography variant="h6">Tasks</Typography>
            <Typography variant="h4" color="primary">52</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper className="p-4 text-center" elevation={1}>
            <Typography variant="h6">Attendance</Typography>
            <Typography variant="h4" color="primary">96%</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
