import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Grid,
    TextField,
    MenuItem,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

export default function EmployeeList() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        position: "Tất cả",
        department: "Tất cả",
        status: "Tất cả",
        nationality: "Tất cả",
    });

    // Dữ liệu tạm (mock)
    useEffect(() => {
        const mockData = [
            {
                id: 1,
                empCode: "00000001",
                full_name: "Nguyễn Văn A",
                email: "nguyenvana@tinviet.com",
                phone_number: "0123456789",
                attendance_code: "0001",
                department: "Hành chính",
                work_group: "Admin",
                hire_date: "2025-01-01",
                status: "ACTIVE",
                nationality: "Việt Nam",
                position: "Nhân viên",
            },
            {
                id: 2,
                empCode: "00000002",
                full_name: "Trần Thị Bích",
                email: "tranthibich@tinviet.com",
                phone_number: "0901000002",
                attendance_code: "0002",
                department: "Bảo trì",
                work_group: "Hành chính",
                hire_date: "2025-01-01",
                status: "INACTIVE",
                nationality: "Việt Nam",
                position: "Trưởng phòng",
            },
        ];
        setEmployees(mockData);
    }, []);

    // Bộ lọc dữ liệu (lọc cục bộ trên mockData)
    const filteredEmployees = employees.filter((emp) => {
        const nameMatch = emp.full_name.toLowerCase().includes(filters.name.toLowerCase());
        const positionMatch = filters.position === "Tất cả" || emp.position === filters.position;
        const departmentMatch = filters.department === "Tất cả" || emp.department === filters.department;
        const statusMatch = filters.status === "Tất cả" || emp.status === filters.status;
        const nationalityMatch = filters.nationality === "Tất cả" || emp.nationality === filters.nationality;
        return nameMatch && positionMatch && departmentMatch && statusMatch && nationalityMatch;
    });

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // Tìm kiếm (hiện tại lọc cục bộ)
    const handleSearch = () => {
        console.log("Tìm kiếm với bộ lọc:", filters);
    };

    // Xuất Excel (placeholder)
    const handleExportExcel = () => {
        console.log("Xuất báo cáo Excel");
    };

    // Thêm nhân viên
    const handleAddEmployee = () => {
        navigate("/admin/employees/create");
    };

    // Xóa nhân viên (tạm)
    const handleDelete = () => {
        console.log("Xóa nhân viên đã chọn");
    };

    // Xem chi tiết nhân viên
    const handleRowClick = (id) => {
        navigate(`/admin/employees/${id}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Danh sách nhân viên
            </Typography>

            {/* Bộ lọc */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            name="name"
                            label="Tìm kiếm nhân viên"
                            variant="outlined"
                            fullWidth
                            value={filters.name}
                            onChange={handleFilterChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            select
                            name="position"
                            label="Chức vụ"
                            fullWidth
                            value={filters.position}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="Tất cả">Tất cả</MenuItem>
                            <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                            <MenuItem value="Trưởng phòng">Trưởng phòng</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            select
                            name="department"
                            label="Phòng ban"
                            fullWidth
                            value={filters.department}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="Tất cả">Tất cả</MenuItem>
                            <MenuItem value="Hành chính">Hành chính</MenuItem>
                            <MenuItem value="Bảo trì">Bảo trì</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            select
                            name="status"
                            label="Trạng thái"
                            fullWidth
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="Tất cả">Tất cả</MenuItem>
                            <MenuItem value="ACTIVE">Đang làm</MenuItem>
                            <MenuItem value="INACTIVE">Nghỉ việc</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            select
                            name="nationality"
                            label="Quốc tịch"
                            fullWidth
                            value={filters.nationality}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="Tất cả">Tất cả</MenuItem>
                            <MenuItem value="Việt Nam">Việt Nam</MenuItem>
                            <MenuItem value="Khác">Khác</MenuItem>
                        </TextField>
                    </Grid>

                    {/* Nút tìm kiếm */}
                    <Grid item xs={12} sm={2} display="flex" alignItems="center">
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon />}
                            onClick={handleSearch}
                            sx={{ mr: 1 }}
                        >
                            Tìm kiếm
                        </Button>
                    </Grid>
                </Grid>

                {/* Nút chức năng */}
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddEmployee}>
                        Thêm nhân viên
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
                        Xóa nhân viên
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleExportExcel}
                    >
                        Báo cáo Excel
                    </Button>
                </Box>
            </Paper>

            {/* Bảng danh sách */}
            <Paper>
                <Table>
                    <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox />
                            </TableCell>
                            <TableCell>Mã nhân viên</TableCell>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell>Mã chấm công</TableCell>
                            <TableCell>Phòng ban</TableCell>
                            <TableCell>Nhóm làm việc</TableCell>
                            <TableCell>Ngày vào làm</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredEmployees.map((emp) => (
                            <TableRow
                                key={emp.id}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleRowClick(emp.id)}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox />
                                </TableCell>
                                <TableCell>{emp.empCode}</TableCell>
                                <TableCell>
                                    <Typography fontWeight={600}>{emp.full_name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {emp.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {emp.phone_number}
                                    </Typography>
                                </TableCell>
                                <TableCell>{emp.attendance_code}</TableCell>
                                <TableCell>{emp.department}</TableCell>
                                <TableCell>{emp.work_group}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{emp.hire_date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
