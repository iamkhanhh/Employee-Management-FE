// src/pages/dialogs/NotificationPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  Grid,
  Card,
  CardContent,
  IconButton,
  TablePagination,
  Alert,
  Avatar,
  CircularProgress,
  Snackbar,
  Tooltip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Fade,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Campaign as CampaignIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Article as ArticleIcon,
  AccessTime as AccessTimeIcon,
  Public as PublicIcon,
} from "@mui/icons-material";

import { axiosInstance } from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";

// ═══════════════════════════════════════════════════════════════
// CONSTANTS & UTILITIES
// ═══════════════════════════════════════════════════════════════
const DEFAULT_PAGE_SIZE = 10;
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const parseDateString = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
  if (!parts) return null;
  return new Date(parts[3], parts[2] - 1, parts[1], parts[4], parts[5], parts[6]);
};

const getTimeAgo = (dateStr) => {
  const date = parseDateString(dateStr);
  if (!date) return dateStr || "";
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return dateStr.split(" ")[0];
};

const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || "";
  return `${text.substring(0, maxLength)}...`;
};

const isGlobalNotification = (notification) => {
  return !notification.departmentName || notification.departmentName === "Tất cả";
};

const formatDate = (dateStr) => dateStr || "-";

// ═══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════
const LoadingScreen = ({ message = "Đang tải..." }) => (
  <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", flexDirection: "column" }}>
    <CircularProgress size={70} />
    <Typography mt={3} variant="h6" color="text.secondary">{message}</Typography>
  </Container>
);

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <Box textAlign="center" py={8}>
    <Icon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
    <Typography variant="h6" color="text.secondary" gutterBottom>{title}</Typography>
    <Typography color="text.secondary" mb={3}>{description}</Typography>
    {action}
  </Box>
);

const StatCard = ({ title, value, color, icon: Icon, bgcolor }) => (
  <Card elevation={3} sx={{ borderLeft: `5px solid ${color}` }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ color }}>{value}</Typography>
        </Box>
        <Avatar sx={{ bgcolor, width: 56, height: 56 }}>
          <Icon sx={{ color, fontSize: 30 }} />
        </Avatar>
      </Stack>
    </CardContent>
  </Card>
);

// ═══════════════════════════════════════════════════════════════
// FORM DIALOG CHO TRƯỞNG PHÒNG (Fix cứng phòng ban)
// ═══════════════════════════════════════════════════════════════
const HeadNotificationFormDialog = ({
  open,
  onClose,
  formMode,
  formData,
  setFormData,
  formErrors,
  saving,
  onSave,
  departmentName,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth TransitionComponent={Fade}>
    <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {formMode === "create" ? <AddIcon /> : <EditIcon />}
        <Typography variant="h6" fontWeight="bold">
          {formMode === "create" ? "Tạo Thông Báo Mới" : "Chỉnh Sửa Thông Báo"}
        </Typography>
      </Stack>
    </DialogTitle>

    <DialogContent sx={{ mt: 2 }}>
      <Stack spacing={3}>
        {/* PHÒNG BAN - FIX CỨNG, KHÔNG CHO CHỌN */}
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            bgcolor: "#e3f2fd", 
            borderColor: "primary.main",
            borderRadius: 2 
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <BusinessIcon />
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Thông báo sẽ được gửi đến
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {departmentName}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Tiêu đề */}
        <TextField
          fullWidth
          label="Tiêu đề thông báo *"
          placeholder="Nhập tiêu đề thông báo..."
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={!!formErrors.title}
          helperText={formErrors.title}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ArticleIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* Nội dung */}
        <TextField
          fullWidth
          multiline
          rows={5}
          label="Nội dung thông báo *"
          placeholder="Nhập nội dung chi tiết..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          error={!!formErrors.content}
          helperText={formErrors.content || `${formData.content.length} ký tự`}
        />

        {/* Preview */}
        {formData.title && formData.content && (
          <Alert severity="info" icon={<VisibilityIcon />}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Xem trước:
            </Typography>
            <Chip
              icon={<BusinessIcon />}
              label={departmentName}
              size="small"
              color="primary"
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" fontWeight={600}>{formData.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {truncateText(formData.content, 150)}
            </Typography>
          </Alert>
        )}
      </Stack>
    </DialogContent>

    <DialogActions sx={{ px: 3, pb: 3 }}>
      <Button onClick={onClose} disabled={saving}>Hủy</Button>
      <Button
        variant="contained"
        onClick={onSave}
        disabled={saving}
        startIcon={saving ? <CircularProgress size={20} /> : <SendIcon />}
      >
        {saving ? "Đang gửi..." : formMode === "create" ? "Gửi thông báo" : "Cập nhật"}
      </Button>
    </DialogActions>
  </Dialog>
);

// ═══════════════════════════════════════════════════════════════
// FORM DIALOG CHO ADMIN (Có thể chọn phòng ban)
// ═══════════════════════════════════════════════════════════════
const AdminNotificationFormDialog = ({
  open,
  onClose,
  formMode,
  formData,
  setFormData,
  formErrors,
  saving,
  onSave,
  departments,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth TransitionComponent={Fade}>
    <DialogTitle sx={{ bgcolor: formData.isGlobal ? "secondary.main" : "primary.main", color: "white" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        {formMode === "create" ? <AddIcon /> : <EditIcon />}
        <Typography variant="h6" fontWeight="bold">
          {formMode === "create" ? "Tạo Thông Báo Mới" : "Chỉnh Sửa Thông Báo"}
        </Typography>
      </Stack>
    </DialogTitle>

    <DialogContent sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tiêu đề thông báo *"
            placeholder="Nhập tiêu đề thông báo..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={!!formErrors.title}
            helperText={formErrors.title}
            InputProps={{
              startAdornment: <InputAdornment position="start"><ArticleIcon color="action" /></InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth error={!!formErrors.deptId}>
            <InputLabel>Gửi đến *</InputLabel>
            <Select
              value={formData.isGlobal ? "all" : formData.deptId || ""}
              onChange={(e) => {
                if (e.target.value === "all") {
                  setFormData({ ...formData, isGlobal: true, deptId: "" });
                } else {
                  setFormData({ ...formData, isGlobal: false, deptId: e.target.value });
                }
              }}
              label="Gửi đến *"
              startAdornment={
                <InputAdornment position="start">
                  {formData.isGlobal ? <PublicIcon color="secondary" /> : <BusinessIcon color="action" />}
                </InputAdornment>
              }
            >
              <MenuItem value="all">
                <Stack direction="row" spacing={1} alignItems="center">
                  <PublicIcon color="secondary" />
                  <Box>
                    <Typography fontWeight={600} color="secondary">Tất cả nhân viên</Typography>
                    <Typography variant="caption" color="text.secondary">Gửi cho toàn bộ công ty</Typography>
                  </Box>
                </Stack>
              </MenuItem>
              <Divider />
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <BusinessIcon color="primary" />
                    <Typography>{dept.deptName}</Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
            {formErrors.deptId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                {formErrors.deptId}
              </Typography>
            )}
          </FormControl>

          {formData.isGlobal && (
            <Alert severity="warning" sx={{ mt: 2 }} icon={<PublicIcon />}>
              Thông báo sẽ được gửi đến <strong>tất cả nhân viên</strong> trong công ty.
            </Alert>
          )}
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Nội dung thông báo *"
            placeholder="Nhập nội dung chi tiết..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            error={!!formErrors.content}
            helperText={formErrors.content || `${formData.content.length} ký tự`}
          />
        </Grid>

        {formData.title && formData.content && (
          <Grid item xs={12}>
            <Alert severity={formData.isGlobal ? "warning" : "info"} icon={<VisibilityIcon />}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Xem trước:</Typography>
              <Chip
                label={formData.isGlobal ? "📢 Toàn công ty" : departments.find((d) => d.id === formData.deptId)?.deptName || "Chưa chọn"}
                size="small"
                color={formData.isGlobal ? "secondary" : "primary"}
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" fontWeight={600}>{formData.title}</Typography>
              <Typography variant="body2" color="text.secondary">{truncateText(formData.content, 200)}</Typography>
            </Alert>
          </Grid>
        )}
      </Grid>
    </DialogContent>

    <DialogActions sx={{ px: 3, pb: 3 }}>
      <Button onClick={onClose} disabled={saving}>Hủy</Button>
      <Button
        variant="contained"
        color={formData.isGlobal ? "secondary" : "primary"}
        onClick={onSave}
        disabled={saving}
        startIcon={saving ? <CircularProgress size={20} /> : <SendIcon />}
      >
        {saving ? "Đang lưu..." : formMode === "create" ? (formData.isGlobal ? "Gửi tất cả" : "Tạo thông báo") : "Cập nhật"}
      </Button>
    </DialogActions>
  </Dialog>
);

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const NotificationPage = () => {
  const {
    departmentId,
    departments,
    isLoading: authLoading,
    isAuthenticated,
    isAdmin,
    isHead,
    canManage,
    departmentName,
  } = useAuth();

  // Trưởng phòng (không phải Admin)
  const isHeadOnly = isHead && !isAdmin;

  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: DEFAULT_PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterDeptId, setFilterDeptId] = useState("");
  const [filterType, setFilterType] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formData, setFormData] = useState({ id: null, title: "", content: "", deptId: "", isGlobal: false });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingNotification, setDeletingNotification] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // ─────────────────────────────────────────────────────────────
  // API CALLS
  // ─────────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async (page = 0, size = DEFAULT_PAGE_SIZE) => {
    setNotificationsLoading(true);
    try {
      const params = { page, pageSize: size };

      // HEAD: Luôn filter theo phòng của mình
      if (isHeadOnly && departmentId) {
        params.deptId = departmentId;
      } else if (filterDeptId) {
        params.deptId = filterDeptId;
      }

      if (isAdmin) {
        if (filterType === "all") params.isGlobal = true;
        else if (filterType === "specific") params.isGlobal = false;
      }

      if (searchKeyword.trim()) params.search = searchKeyword.trim();

      const res = await axiosInstance.get("/notifications", { params });
      const data = res.data?.data;

      setNotifications(data?.content || []);
      setPagination({
        page: data?.currentPage || 0,
        size: data?.pageSize || DEFAULT_PAGE_SIZE,
        totalElements: data?.totalElements || 0,
        totalPages: data?.totalPages || 0,
      });
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Lỗi tải danh sách thông báo", "error");
    } finally {
      setNotificationsLoading(false);
    }
  }, [isHeadOnly, isAdmin, departmentId, filterDeptId, filterType, searchKeyword]);

  const fetchNotificationDetail = useCallback(async (id) => {
    setLoadingDetail(true);
    try {
      const res = await axiosInstance.get(`/notifications/${id}`);
      setSelectedNotification(res.data?.data);
      setOpenDetailDialog(true);
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Lỗi tải chi tiết thông báo", "error");
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && canManage) fetchNotifications(0, pagination.size);
  }, [authLoading, canManage]);

  useEffect(() => {
    if (authLoading || !canManage) return;
    if (searchTimeout) clearTimeout(searchTimeout);
    const timeout = setTimeout(() => fetchNotifications(0, pagination.size), 500);
    setSearchTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [searchKeyword, filterDeptId, filterType]);

  // ─────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────
  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });
  const closeSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  const handleOpenCreateDialog = () => {
    setFormMode("create");
    setFormData({
      id: null,
      title: "",
      content: "",
      deptId: "", // Không cần set cho HEAD vì sẽ dùng departmentId khi save
      isGlobal: isAdmin, // Admin mặc định gửi tất cả
    });
    setFormErrors({});
    setOpenFormDialog(true);
  };

  const handleOpenEditDialog = (notification) => {
    setFormMode("edit");
    const dept = departments.find((d) => d.deptName === notification.departmentName);
    setFormData({
      id: notification.id,
      title: notification.title,
      content: notification.content,
      deptId: dept?.id || "",
      isGlobal: isGlobalNotification(notification),
    });
    setFormErrors({});
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setFormData({ id: null, title: "", content: "", deptId: "", isGlobal: false });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Vui lòng nhập tiêu đề thông báo";
    else if (formData.title.trim().length < 5) errors.title = "Tiêu đề phải có ít nhất 5 ký tự";
    if (!formData.content.trim()) errors.content = "Vui lòng nhập nội dung thông báo";
    else if (formData.content.trim().length < 10) errors.content = "Nội dung phải có ít nhất 10 ký tự";
    if (isAdmin && !formData.isGlobal && !formData.deptId) errors.deptId = "Vui lòng chọn phòng ban";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNotification = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // ⭐ QUAN TRỌNG: HEAD luôn dùng departmentId của mình
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        deptId: isHeadOnly 
          ? departmentId  // HEAD: Fix cứng phòng của mình
          : formData.isGlobal 
            ? null  // Admin gửi tất cả
            : formData.deptId || null,  // Admin chọn phòng cụ thể
      };

      console.log("📤 Payload:", payload);

      if (formMode === "create") {
        await axiosInstance.post("/notifications", payload);
        showSnackbar(
          isHeadOnly
            ? `Đã gửi thông báo đến phòng ${departmentName}!`
            : formData.isGlobal
            ? "Đã gửi thông báo đến tất cả nhân viên!"
            : "Tạo thông báo thành công!"
        );
      } else {
        await axiosInstance.put(`/notifications/${formData.id}`, payload);
        showSnackbar("Cập nhật thông báo thành công!");
      }

      handleCloseFormDialog();
      fetchNotifications(pagination.page, pagination.size);
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Lỗi lưu thông báo", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDeleteDialog = (notification) => {
    setDeletingNotification(notification);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeletingNotification(null);
  };

  const handleDeleteNotification = async () => {
    if (!deletingNotification) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/notifications/${deletingNotification.id}`);
      showSnackbar("Xóa thông báo thành công!");
      handleCloseDeleteDialog();
      fetchNotifications(pagination.page, pagination.size);
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Lỗi xóa thông báo", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDetail = (notification) => fetchNotificationDetail(notification.id);
  const handlePageChange = (_, newPage) => fetchNotifications(newPage, pagination.size);
  const handleRowsPerPageChange = (e) => fetchNotifications(0, parseInt(e.target.value, 10));
  const handleRefresh = () => fetchNotifications(pagination.page, pagination.size);
  const handleClearFilters = () => {
    setSearchKeyword("");
    setFilterType("");
    if (isAdmin) setFilterDeptId("");
  };

  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const globalCount = notifications.filter((n) => isGlobalNotification(n)).length;
    const thisMonthCount = notifications.filter((n) => {
      const date = parseDateString(n.createdAt);
      if (!date) return false;
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    return { total: pagination.totalElements, thisMonth: thisMonthCount, global: globalCount };
  }, [notifications, pagination.totalElements]);

  const hasActiveFilters = searchKeyword || filterType || (isAdmin && filterDeptId);

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  if (authLoading) return <LoadingScreen message="Đang tải thông tin..." />;
  if (!isAuthenticated) return <LoadingScreen message="Đang chuyển hướng..." />;
  if (!canManage) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Alert severity="warning">
          <Typography variant="h6" gutterBottom>Không có quyền truy cập</Typography>
          <Typography variant="body2">Chức năng này chỉ dành cho Trưởng phòng và Admin.</Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            <NotificationsIcon sx={{ mr: 1, verticalAlign: "middle", fontSize: 35 }} />
            Quản Lý Thông Báo
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            {isAdmin ? "Quản lý tất cả thông báo" : `Quản lý thông báo phòng ${departmentName}`}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog} size="large" sx={{ borderRadius: 2 }}>
          Tạo Thông Báo
        </Button>
      </Box>

      {/* STATS */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={isAdmin ? 4 : 6}>
          <StatCard title="Tổng thông báo" value={stats.total} color="#1976d2" bgcolor="#e3f2fd" icon={NotificationsIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={isAdmin ? 4 : 6}>
          <StatCard title="Tháng này" value={stats.thisMonth} color="#4caf50" bgcolor="#e8f5e9" icon={NotificationsActiveIcon} />
        </Grid>
        {isAdmin && (
          <Grid item xs={12} sm={6} md={4}>
            <StatCard title="Toàn công ty" value={stats.global} color="#9c27b0" bgcolor="#f3e5f5" icon={PublicIcon} />
          </Grid>
        )}
      </Grid>

      {/* FILTERS */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={isAdmin ? 3 : 6}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
                endAdornment: searchKeyword && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchKeyword("")}><CloseIcon fontSize="small" /></IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {isAdmin && (
            <>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Loại</InputLabel>
                  <Select value={filterType} onChange={(e) => setFilterType(e.target.value)} label="Loại">
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="all">Toàn công ty</MenuItem>
                    <MenuItem value="specific">Phòng ban</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Phòng ban</InputLabel>
                  <Select value={filterDeptId} onChange={(e) => setFilterDeptId(e.target.value)} label="Phòng ban">
                    <MenuItem value="">Tất cả</MenuItem>
                    {departments.map((dept) => <MenuItem key={dept.id} value={dept.id}>{dept.deptName}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          <Grid item xs={12} md={isAdmin ? 5 : 6}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              {hasActiveFilters && <Button variant="outlined" startIcon={<CloseIcon />} onClick={handleClearFilters}>Xóa lọc</Button>}
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleRefresh}>Làm mới</Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* TABLE */}
      <Paper elevation={3}>
        {notificationsLoading ? (
          <Box textAlign="center" py={8}>
            <CircularProgress size={50} />
            <Typography mt={2} color="text.secondary">Đang tải...</Typography>
          </Box>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={NotificationsIcon}
            title="Chưa có thông báo nào"
            description={hasActiveFilters ? "Không tìm thấy thông báo phù hợp" : "Hãy tạo thông báo đầu tiên"}
            action={!hasActiveFilters && <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>Tạo Thông Báo</Button>}
          />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 700, width: 60 }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tiêu đề</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 200 }}>Nội dung</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 180 }}>Đối tượng</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 150 }}>Người tạo</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: 150 }}>Thời gian</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, width: 130 }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notifications.map((notification, index) => {
                    const isGlobal = isGlobalNotification(notification);
                    return (
                      <TableRow key={notification.id} hover sx={{ bgcolor: isGlobal ? "#faf5ff" : "inherit" }}>
                        <TableCell>{pagination.page * pagination.size + index + 1}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ bgcolor: isGlobal ? "secondary.light" : "primary.light", width: 36, height: 36 }}>
                              {isGlobal ? <PublicIcon sx={{ fontSize: 20 }} /> : <CampaignIcon sx={{ fontSize: 20 }} />}
                            </Avatar>
                            <Box>
                              <Typography fontWeight={600} color={isGlobal ? "secondary.dark" : "primary.dark"}>
                                {notification.title}
                              </Typography>
                              {isGlobal && <Typography variant="caption" color="secondary">📢 Toàn công ty</Typography>}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary">{truncateText(notification.content, 60)}</Typography></TableCell>
                        <TableCell>
                          {isGlobal 
                            ? <Chip icon={<PublicIcon />} label="Tất cả" size="small" color="secondary" />
                            : <Chip icon={<BusinessIcon />} label={notification.departmentName} size="small" variant="outlined" color="primary" />
                          }
                        </TableCell>
                        <TableCell>{notification.createdByName || "Hệ thống"}</TableCell>
                        <TableCell>
                          <Tooltip title={formatDate(notification.createdAt)}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                              <Typography variant="body2" color="text.secondary">{getTimeAgo(notification.createdAt)}</Typography>
                            </Stack>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} justifyContent="center">
                            <Tooltip title="Xem"><IconButton size="small" color="info" onClick={() => handleViewDetail(notification)}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                            <Tooltip title="Sửa"><IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(notification)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                            <Tooltip title="Xóa"><IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(notification)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={pagination.totalElements}
              page={pagination.page}
              rowsPerPage={pagination.size}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              labelRowsPerPage="Số dòng:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
            />
          </>
        )}
      </Paper>

      {/* ⭐ FORM DIALOG - TÁCH RIÊNG CHO HEAD VÀ ADMIN */}
      {isHeadOnly ? (
        <HeadNotificationFormDialog
          open={openFormDialog}
          onClose={handleCloseFormDialog}
          formMode={formMode}
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          saving={saving}
          onSave={handleSaveNotification}
          departmentName={departmentName}  
        />
      ) : (
        <AdminNotificationFormDialog
          open={openFormDialog}
          onClose={handleCloseFormDialog}
          formMode={formMode}
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          saving={saving}
          onSave={handleSaveNotification}
          departments={departments}
        />
      )}

      {/* DETAIL DIALOG */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="md" fullWidth TransitionComponent={Fade}>
        <DialogTitle sx={{ bgcolor: selectedNotification && isGlobalNotification(selectedNotification) ? "secondary.main" : "primary.main", color: "white" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            {selectedNotification && isGlobalNotification(selectedNotification) ? <PublicIcon /> : <CampaignIcon />}
            <Typography variant="h6" fontWeight="bold">Chi Tiết Thông Báo</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetail ? (
            <Box textAlign="center" py={4}><CircularProgress /><Typography mt={2} color="text.secondary">Đang tải...</Typography></Box>
          ) : selectedNotification ? (
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>{selectedNotification.title}</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" mb={3}>
                {isGlobalNotification(selectedNotification) 
                  ? <Chip icon={<PublicIcon />} label="Tất cả nhân viên" color="secondary" size="small" />
                  : <Chip icon={<BusinessIcon />} label={selectedNotification.departmentName} color="primary" variant="outlined" size="small" />
                }
                <Chip icon={<PersonIcon />} label={selectedNotification.createdByName || "Hệ thống"} variant="outlined" size="small" />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Paper sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>{selectedNotification.content}</Typography>
              </Paper>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">📅 Ngày tạo</Typography>
                    <Typography fontWeight="bold">{formatDate(selectedNotification.createdAt)}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">🔄 Cập nhật</Typography>
                    <Typography fontWeight="bold">{formatDate(selectedNotification.updatedAt)}</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box textAlign="center" py={4}><Typography color="text.secondary">Không có dữ liệu</Typography></Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => { setOpenDetailDialog(false); if (selectedNotification) handleOpenEditDialog(selectedNotification); }}>Sửa</Button>
          <Button variant="contained" onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="sm" fullWidth TransitionComponent={Fade}>
        <DialogTitle sx={{ bgcolor: "error.main", color: "white" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <WarningIcon />
            <Typography variant="h6" fontWeight="bold">Xác Nhận Xóa</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>Hành động này không thể hoàn tác!</Alert>
          {deletingNotification && (
            <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fafafa" }}>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>{deletingNotification.title}</Typography>
              <Typography variant="body2" color="text.secondary">{truncateText(deletingNotification.content, 150)}</Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteDialog} disabled={deleting}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDeleteNotification} disabled={deleting} startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}>
            {deleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity={snackbar.severity} variant="filled" onClose={closeSnackbar} sx={{ minWidth: 300 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default NotificationPage;