import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    TextField,
    MenuItem,
    Typography,
    Paper,
    Divider,
    Avatar,
    Card,
    CardContent,
    Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";

export default function EmployeeDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [employee, setEmployee] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Mock data (replace with real API later)
    useEffect(() => {
        const mockData = [
            {
                id: 1,
                empCode: "00000001",
                full_name: "Nguyễn Văn A",
                dob: "1990-01-01",
                gender: "Male",
                email: "nguyenvana@tinviet.com",
                phone_number: "0123456789",
                department: "HR-Admin",
                work_group: "Administrative",
                hire_date: "2025-06-18",
                position: "Staff",
                status: "Active",
                nationality: "Vietnam",
                religion: "None",
                education: "University",
                marital_status: "Single",
                tax_code: "123456789",
                bank_name: "Vietcombank",
                bank_account: "1234567890",
            },
        ];

        const found = mockData.find((e) => e.id === parseInt(id));
        setEmployee(found);
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleSave = () => {
        console.log("Save employee information:", employee);
        setIsEditing(false);
        // TODO: Call API PUT /api/employees/:id
    };

    const handleBack = () => {
        navigate("/admin/employees");
    };

    if (!employee) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Typography sx={{ color: '#6b7280' }}>
                    Loading employee information...
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: '#3b82f6',
                                fontSize: '2rem',
                                fontWeight: 600,
                            }}
                        >
                            {employee.full_name?.charAt(0)?.toUpperCase() || '?'}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
                                {employee.full_name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                                Employee Code: <strong>{employee.empCode}</strong>
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip
                                    label={employee.status}
                                    size="small"
                                    sx={{
                                        backgroundColor: employee.status === 'Active' ? '#d1fae5' : '#fee2e2',
                                        color: employee.status === 'Active' ? '#065f46' : '#991b1b',
                                        fontWeight: 600,
                                    }}
                                />
                                <Chip
                                    label={employee.position}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#3b82f6',
                                        color: '#3b82f6',
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1.5 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleBack}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '10px',
                            }}
                        >
                            Back
                        </Button>
                        {!isEditing ? (
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={() => setIsEditing(true)}
                                sx={{
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    textTransform: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                }}
                            >
                                Edit
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    onClick={() => setIsEditing(false)}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '10px',
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSave}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '10px',
                                        fontWeight: 600,
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            </Paper>

            <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} md={6}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: '16px',
                            border: '1px solid #e5e7eb',
                            height: '100%',
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: '#3b82f6',
                                        mr: 2,
                                    }}
                                >
                                    <PersonIcon />
                                </Avatar>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                    Personal Information
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Full Name"
                                        name="full_name"
                                        fullWidth
                                        required
                                        value={employee.full_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Date of Birth"
                                        name="dob"
                                        type="date"
                                        fullWidth
                                        required
                                        InputLabelProps={{ shrink: true }}
                                        value={employee.dob}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Gender"
                                        name="gender"
                                        fullWidth
                                        value={employee.gender}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email"
                                        name="email"
                                        type="email"
                                        fullWidth
                                        value={employee.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Phone Number"
                                        name="phone_number"
                                        fullWidth
                                        value={employee.phone_number}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Nationality"
                                        name="nationality"
                                        fullWidth
                                        value={employee.nationality}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    >
                                        <MenuItem value="Vietnam">Vietnam</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Marital Status"
                                        name="marital_status"
                                        fullWidth
                                        value={employee.marital_status}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    >
                                        <MenuItem value="Single">Single</MenuItem>
                                        <MenuItem value="Married">Married</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Religion"
                                        name="religion"
                                        fullWidth
                                        value={employee.religion}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    >
                                        <MenuItem value="None">None</MenuItem>
                                        <MenuItem value="Buddhism">Buddhism</MenuItem>
                                        <MenuItem value="Christianity">Christianity</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Education Level"
                                        name="education"
                                        fullWidth
                                        value={employee.education}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    >
                                        <MenuItem value="College">College</MenuItem>
                                        <MenuItem value="University">University</MenuItem>
                                        <MenuItem value="Master">Master</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Work Information */}
                <Grid item xs={12} md={6}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: '16px',
                            border: '1px solid #e5e7eb',
                            height: '100%',
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: '#10b981',
                                        mr: 2,
                                    }}
                                >
                                    <WorkIcon />
                                </Avatar>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937' }}>
                                    Work Information
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Employee Code"
                                        name="empCode"
                                        fullWidth
                                        disabled
                                        value={employee.empCode}
                                        variant="filled"
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Hire Date"
                                        name="hire_date"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={employee.hire_date}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Department"
                                        name="department"
                                        fullWidth
                                        value={employee.department}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    >
                                        <MenuItem value="HR-Admin">HR-Admin</MenuItem>
                                        <MenuItem value="Maintenance">Maintenance</MenuItem>
                                        <MenuItem value="IT">IT</MenuItem>
                                        <MenuItem value="Finance">Finance</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Work Group"
                                        name="work_group"
                                        fullWidth
                                        value={employee.work_group}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    >
                                        <MenuItem value="Administrative">Administrative</MenuItem>
                                        <MenuItem value="Technical">Technical</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Position"
                                        name="position"
                                        fullWidth
                                        value={employee.position}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    >
                                        <MenuItem value="Staff">Staff</MenuItem>
                                        <MenuItem value="Manager">Manager</MenuItem>
                                        <MenuItem value="Director">Director</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Tax Code"
                                        name="tax_code"
                                        fullWidth
                                        value={employee.tax_code}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Bank"
                                        name="bank_name"
                                        fullWidth
                                        value={employee.bank_name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    >
                                        <MenuItem value="Vietcombank">Vietcombank</MenuItem>
                                        <MenuItem value="Techcombank">Techcombank</MenuItem>
                                        <MenuItem value="ACB">ACB</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Bank Account"
                                        name="bank_account"
                                        fullWidth
                                        value={employee.bank_account}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
