import React, { useState, useEffect } from "react";
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
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

export default function ContractCreate() {
    const [form, setForm] = useState({
        contractType: "",
        createdDate: "",
        note: "",
    });

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // Dữ liệu demo nhân viên
        const mockEmployees = [
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
        setEmployees(mockEmployees);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSelectList = () => {
        navigate("/admin/contracts/create");
    };

    const handleDelete = () => {
        console.log("Xóa bỏ danh sách đã chọn");
    };

    const handleLoadData = () => {
        console.log("Đổ dữ liệu tự động");
    };

    const handleSave = () => {
        console.log("Lưu hợp đồng:", form);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Thông tin phiếu
            </Typography>

            {/* Form nhập thông tin hợp đồng */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            name="contractType"
                            label="Loại hợp đồng"
                            fullWidth
                            value={form.contractType}
                            onChange={handleChange}
                        >
                            <MenuItem value="">-- Chọn loại hợp đồng --</MenuItem>
                            <MenuItem value="Thử việc">Thử việc</MenuItem>
                            <MenuItem value="Xác định thời hạn">Xác định thời hạn</MenuItem>
                            <MenuItem value="Không xác định thời hạn">Không xác định thời hạn</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            type="date"
                            name="createdDate"
                            label="Ngày tạo phiếu"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={form.createdDate}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="note"
                            label="Ghi chú"
                            fullWidth
                            value={form.note}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Các nút chức năng */}
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<PlaylistAddIcon />}
                    onClick={handleSelectList}
                >
                    Chọn danh sách
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                >
                    Xóa bỏ
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CloudDownloadIcon />}
                    onClick={handleLoadData}
                >
                    Đổ dữ liệu
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                >
                    Lưu hợp đồng
                </Button>
            </Box>

            {/* Bảng danh sách nhân viên */}
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
                        {employees.map((emp) => (
                            <TableRow key={emp.id} hover>
                                <TableCell padding="checkbox">
                                    <Checkbox />
                                </TableCell>
                                <TableCell>{emp.empCode}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Avatar sx={{ width: 35, height: 35 }} />
                                        <Box>
                                            <Typography sx={{ fontWeight: 500 }}>
                                                {emp.fullName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {emp.email}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {emp.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{emp.department}</TableCell>
                                <TableCell>{emp.hireDate}</TableCell>
                                <TableCell>{emp.contractNumber}</TableCell>
                                <TableCell>{emp.probationType}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
