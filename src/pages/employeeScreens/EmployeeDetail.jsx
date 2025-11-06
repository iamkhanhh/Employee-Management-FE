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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

export default function EmployeeDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [employee, setEmployee] = useState(null);

    // Giả lập dữ liệu (thay bằng API thật sau này)
    useEffect(() => {
        const mockData = [
            {
                id: 1,
                empCode: "00000001",
                full_name: "Nguyễn Văn A",
                dob: "1990-01-01",
                gender: "Nam",
                email: "nguyenvana@tinviet.com",
                phone_number: "0123456789",
                department: "HR-Admin",
                work_group: "Hành chính",
                hire_date: "2025-06-18",
                position: "Nhân viên",
                status: "Đang làm",
                nationality: "Việt Nam",
                religion: "Không",
                education: "Đại học",
                marital_status: "Độc thân",
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
        console.log("Lưu thông tin nhân viên:", employee);
        // TODO: Gọi API PUT /api/employees/:id
    };

    const handleBack = () => {
        navigate("/admin/employees");
    };

    if (!employee) {
        return (
            <Typography sx={{ p: 4, textAlign: "center" }}>
                Đang tải thông tin nhân viên...
            </Typography>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Thông tin nhân viên
                    </Typography>
                    <Typography color="text.secondary">Mã nhân viên: {employee.empCode}</Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                    >
                        Quay lại danh sách
                    </Button>
                    <Button variant="contained" startIcon={<AddIcon />}>
                        Thêm mới
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                    >
                        Lưu
                    </Button>
                </Box>
            </Box>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Thông tin cá nhân
                </Typography>

                <Grid container spacing={2}>
                    {/* Ảnh nhân viên */}
                    <Grid item xs={12} sm={2}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Avatar sx={{ width: 100, height: 100 }} />
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={10}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Họ và tên"
                                    name="full_name"
                                    fullWidth
                                    required
                                    value={employee.full_name}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Ngày sinh"
                                    name="dob"
                                    type="date"
                                    fullWidth
                                    required
                                    InputLabelProps={{ shrink: true }}
                                    value={employee.dob}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    label="Giới tính"
                                    name="gender"
                                    fullWidth
                                    value={employee.gender}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Nam">Nam</MenuItem>
                                    <MenuItem value="Nữ">Nữ</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    fullWidth
                                    value={employee.email}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Số điện thoại"
                                    name="phone_number"
                                    fullWidth
                                    value={employee.phone_number}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    label="Quốc tịch"
                                    name="nationality"
                                    fullWidth
                                    value={employee.nationality}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Việt Nam">Việt Nam</MenuItem>
                                    <MenuItem value="Khác">Khác</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    label="Tôn giáo"
                                    name="religion"
                                    fullWidth
                                    value={employee.religion}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Không">Không</MenuItem>
                                    <MenuItem value="Phật giáo">Phật giáo</MenuItem>
                                    <MenuItem value="Thiên chúa giáo">Thiên chúa giáo</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    label="Tình trạng hôn nhân"
                                    name="marital_status"
                                    fullWidth
                                    value={employee.marital_status}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Độc thân">Độc thân</MenuItem>
                                    <MenuItem value="Đã kết hôn">Đã kết hôn</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    label="Trình độ học vấn"
                                    name="education"
                                    fullWidth
                                    value={employee.education}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="Cao đẳng">Cao đẳng</MenuItem>
                                    <MenuItem value="Đại học">Đại học</MenuItem>
                                    <MenuItem value="Thạc sĩ">Thạc sĩ</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Thông tin công việc
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Mã nhân viên"
                            name="empCode"
                            fullWidth
                            disabled
                            value={employee.empCode}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Ngày vào làm"
                            name="hire_date"
                            type="date"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            value={employee.hire_date}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            select
                            label="Phòng ban"
                            name="department"
                            fullWidth
                            value={employee.department}
                            onChange={handleChange}
                        >
                            <MenuItem value="HR-Admin">HR-Admin</MenuItem>
                            <MenuItem value="Bảo trì">Bảo trì</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            select
                            label="Nhóm làm việc"
                            name="work_group"
                            fullWidth
                            value={employee.work_group}
                            onChange={handleChange}
                        >
                            <MenuItem value="Hành chính">Hành chính</MenuItem>
                            <MenuItem value="Kỹ thuật">Kỹ thuật</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            select
                            label="Chức vụ"
                            name="position"
                            fullWidth
                            value={employee.position}
                            onChange={handleChange}
                        >
                            <MenuItem value="Nhân viên">Nhân viên</MenuItem>
                            <MenuItem value="Trưởng phòng">Trưởng phòng</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Mã số thuế"
                            name="tax_code"
                            fullWidth
                            value={employee.tax_code}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            select
                            label="Ngân hàng"
                            name="bank_name"
                            fullWidth
                            value={employee.bank_name}
                            onChange={handleChange}
                        >
                            <MenuItem value="Vietcombank">Vietcombank</MenuItem>
                            <MenuItem value="Techcombank">Techcombank</MenuItem>
                            <MenuItem value="ACB">ACB</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Số tài khoản"
                            name="bank_account"
                            fullWidth
                            value={employee.bank_account}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
