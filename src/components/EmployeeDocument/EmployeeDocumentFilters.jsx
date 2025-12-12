// src/components/EmployeeDocument/EmployeeDocumentFilters.jsx
import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DOCUMENT_TYPES } from "../../constants";

const EmployeeDocumentFilters = ({ filters, onFilterChange, onAdd }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange((prev) => ({ ...prev, [name]: value, page: 0 }));
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SEARCH BY EMPLOYEE ID */}
          <TextField
            fullWidth
            label="Search by Employee ID"
            name="employeeId"
            value={filters.employeeId}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
        {/* DOCUMENT TYPE */}
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Document Type</InputLabel>
            <Select
              name="docType"
              value={filters.docType}
              onChange={handleInputChange}
              label="Document Type"
            >
              <MenuItem value="all">
                <em>All Types</em>
              </MenuItem>
              {Object.entries(DOCUMENT_TYPES).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
      </Box>

      {/* ADD BUTTON */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          Add Document
        </Button>
      </Box>
    </Paper>
  );
};

export default EmployeeDocumentFilters;
