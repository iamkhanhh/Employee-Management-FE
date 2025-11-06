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
    Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useNavigate } from "react-router-dom";

export default function ContractList() {
    const navigate = useNavigate()
    const [contracts, setContracts] = useState([]);
    const [filters, setFilters] = useState({
        employeeName: "",
        department: "Tất cả",
        probationType: "Tất cả",
        contractType: "Tất cả",
        contractStatus: "Tất cả",
        jobPosition: "Tất cả",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        // Mock data (sau này có thể gọi API backend)
        const mockContracts = [
            {
                id: 1,
                empCode: "00000001",
                fullName: "Nguyễn Văn A",
                email: "nguyenvana@tinviet.com",
                phone: "0123456789",
                department: "Maintenance",
                hireDate: "01/01/2025",
                contractNumber: "SHD_VD0001",
                probationType: "30 ngày",
            },
            {
                id: 2,
                empCode: "00000002",
                fullName: "Trần Thị Bích",
                email: "tranthibich@tinviet.com",
                phone: "0901000002",
                department: "Maintenance",
                hireDate: "01/01/2025",
                contractNumber: "SHD_VD0002",
                probationType: "30 ngày",
            },
            {
                id: 3,
                empCode: "00000003",
                fullName: "Lê Văn Cường",
                email: "levancuong@tinviet.com",
                phone: "0901000003",
                department: "Maintenance",
                hireDate: "01/01/2025",
                contractNumber: "SHD_VD0003",
                probationType: "30 ngày",
            },
        ];
        setContracts(mockContracts);
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSearch = () => {
        console.log("Tìm kiếm với:", filters);
    };

    const handleAdd = () => {
        navigate("/admin/contracts/create");
    };

    const handleSave = () => {
        console.log("Lưu thay đổi");
    };

    const handleDelete = () => {
        console.log("Xóa hợp đồng được chọn");
    };

    const handleExport = () => {
        console.log("Xuất file báo cáo");
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Quản lý hợp đồng
            </Typography>

            {/* Bộ lọc tìm kiếm */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            name="employeeName"
                            label="Nhân viên"
                            fullWidth
                            value={filters.employeeName}
                            onChange={handleFilterChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            select
                            name="probationType"
                            label="Loại thử việc"
                            fullWidth
                            value={filters.probationType}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="Tất cả">Tất cả</MenuItem>
                            <MenuItem value="30 ngày">30 ngày</MenuItem>
                            <MenuItem value="60 ngày">60 ngày</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            select
                            name="contractType"
                            label="Loại hợp đồng"
                            fullWidth
                            value={filters.contractType}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="Tất cả">Tất cả</MenuItem>
                            <MenuItem value="Thử việc">Thử việc</MenuItem>
                            <MenuItem value="Chính thức">Chính thức</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            select
                            name="jobPosition"
                            label="Chức vụ"
                            fullWidth
                            value={filters.jobPosition}
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
                            <MenuItem value="Maintenance">Maintenance</MenuItem>
                            <MenuItem value="HR">HR</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            select
                            name="contractStatus"
                            label="Trạng thái hợp đồng"
                            fullWidth
                            value={filters.contractStatus}
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="Tất cả">Tất cả</MenuItem>
                            <MenuItem value="Còn hiệu lực">Còn hiệu lực</MenuItem>
                            <MenuItem value="Hết hạn">Hết hạn</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                        <TextField
                            type="date"
                            name="startDate"
                            label="Từ ngày"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={filters.startDate}
                            onChange={handleFilterChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <TextField
                            type="date"
                            name="endDate"
                            label="Đến ngày"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={filters.endDate}
                            onChange={handleFilterChange}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button
                        variant="contained"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                    >
                        Tìm kiếm
                    </Button>
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAdd}>
                        Thêm mới
                    </Button>
                    <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSave}>
                        Sao lưu
                    </Button>
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
                        Xóa bỏ
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleExport}
                    >
                        Báo cáo
                    </Button>
                </Box>
            </Paper>

            {/* Bảng danh sách hợp đồng */}
            <Paper>
                <Table>
                    <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox />
                            </TableCell>
                            <TableCell>Mã nhân viên</TableCell>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell>Phòng ban</TableCell>
                            <TableCell>Ngày vào làm</TableCell>
                            <TableCell>Số hợp đồng</TableCell>
                            <TableCell>Loại thử việc</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contracts.map((c) => (
                            <TableRow key={c.id} hover>
                                <TableCell padding="checkbox">
                                    <Checkbox />
                                </TableCell>
                                <TableCell>{c.empCode}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Avatar sx={{ width: 35, height: 35 }} />
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>{c.fullName}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {c.email}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {c.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{c.department}</TableCell>
                                <TableCell>{c.hireDate}</TableCell>
                                <TableCell>{c.contractNumber}</TableCell>
                                <TableCell>{c.probationType}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
