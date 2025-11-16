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

// Import service để gọi API
import { employeeService } from "../../services/employeeService";
import toast from 'react-hot-toast';

export default function EmployeeDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [employee, setEmployee] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy dữ liệu nhân viên từ API khi component được mount
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true);
                const response = await employeeService.getEmployeeById(id);
                response.data.dob = response.data.dob ? new Date(response.data.dob).toISOString().split('T')[0] : '';
                response.data.hireDate = response.data.hireDate ? new Date(response.data.hireDate).toISOString().split('T')[0] : '';
                setEmployee(response.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch employee:", err);
                setError("Không thể tải thông tin nhân viên. Vui lòng thử lại.");
                toast.error("Không thể tải thông tin nhân viên. Vui lòng thử lại!");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleSave = async () => {
        // TODO: Xử lý việc gửi dữ liệu dưới dạng FormData nếu có upload file
        const loadingToast = toast.loading("Đang cập nhật thông tin nhân viên...");
        try {
            await employeeService.updateEmployee(id, employee);
            toast.dismiss(loadingToast);
            toast.success(`Đã cập nhật thông tin nhân viên "${employee.fullName}" thành công!`);
            setIsEditing(false); // Tắt chế độ chỉnh sửa sau khi lưu
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Failed to update employee:", error);
            toast.error(error.response?.data?.message || `Không thể cập nhật thông tin nhân viên. Vui lòng thử lại!`);
        }
    };

    const handleBack = () => {
        navigate("/admin/employees");
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Typography sx={{ color: '#6b7280' }}>
                    Loading employee information...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!employee) return null; // Hoặc hiển thị thông báo "Không tìm thấy nhân viên"

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
                            {employee.fullName?.charAt(0)?.toUpperCase() || '?'}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', mb: 0.5 }}>
                                {employee.fullName}
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
                                    label={employee.roleInDept}
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
                                        name="fullName"
                                        fullWidth
                                        required
                                        value={employee.fullName}
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
                                        name="phoneNumber"
                                        fullWidth
                                        value={employee.phoneNumber}
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
                                        name="maritalStatus"
                                        fullWidth
                                        value={employee.maritalStatus}
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
                                        name="hireDate"
                                        type="date"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        value={employee.hireDate}
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
                                        name="workGroup"
                                        fullWidth
                                        value={employee.workGroup}
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
                                        name="roleInDept"
                                        fullWidth
                                        value={employee.roleInDept}
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
                                        name="taxCode"
                                        fullWidth
                                        value={employee.taxCode}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? 'outlined' : 'filled'}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="Bank"
                                        name="bankName"
                                        fullWidth
                                        value={employee.bankName}
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
                                        name="bankAccount"
                                        fullWidth
                                        value={employee.bankAccount}
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
