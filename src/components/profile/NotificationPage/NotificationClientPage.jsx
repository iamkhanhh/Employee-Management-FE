import React, { useState, useEffect, useCallback } from "react";
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
  Paper,
  Chip,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
  Avatar,
  CircularProgress,
  Snackbar,
  Divider,
  InputAdornment,
  Fade,
  Skeleton,
  Badge,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
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
  NewReleases as NewReleasesIcon,
  Inbox as InboxIcon,
  Public as PublicIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

import { axiosInstance } from "../../../lib/axios";
import { useAuth } from "../../../hooks/useAuth";

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const PAGE_SIZE = 10;

// ═══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════
const LoadingScreen = ({ message = "Đang tải..." }) => (
  <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", flexDirection: "column" }}>
    <CircularProgress size={60} />
    <Typography mt={3} variant="h6" color="text.secondary">{message}</Typography>
  </Container>
);

const NotificationSkeleton = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Skeleton variant="text" width="60%" height={32} />
      <Skeleton variant="text" width="100%" />
      <Skeleton variant="text" width="80%" />
      <Stack direction="row" spacing={1} mt={2}>
        <Skeleton variant="circular" width={24} height={24} />
        <Skeleton variant="text" width={100} />
      </Stack>
    </CardContent>
  </Card>
);

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <Box textAlign="center" py={8}>
    <Icon sx={{ fontSize: 100, color: "#e0e0e0", mb: 2 }} />
    <Typography variant="h5" color="text.secondary" gutterBottom fontWeight={500}>
      {title}
    </Typography>
    <Typography color="text.secondary" mb={3} maxWidth={400} mx="auto">
      {description}
    </Typography>
    {action}
  </Box>
);

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
const NotificationCard = ({ 
  notification, 
  onView, 
  onEdit, 
  onDelete, 
  isHead,
  isNew,
  isGlobal,
}) => {
  const getTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
    if (!parts) return dateStr;
    
    const date = new Date(parts[3], parts[2] - 1, parts[1], parts[4], parts[5], parts[6]);
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

  const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card 
      elevation={isNew ? 4 : 1}
      sx={{ 
        mb: 2,
        transition: "all 0.3s ease",
        borderLeft: isGlobal ? "4px solid #9c27b0" : (isNew ? "4px solid #2196f3" : "4px solid transparent"),
        bgcolor: isGlobal ? "#faf5ff" : "inherit",
        "&:hover": { 
          elevation: 4,
          transform: "translateY(-2px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        },
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Badges */}
      <Stack 
        direction="row" 
        spacing={1} 
        sx={{ position: "absolute", top: -10, right: 16 }}
      >
        {isGlobal && (
          <Chip
            label="Toàn công ty"
            color="secondary"
            size="small"
            icon={<PublicIcon />}
            sx={{ fontWeight: "bold" }}
          />
        )}
        {isNew && !isGlobal && (
          <Chip
            label="Mới"
            color="primary"
            size="small"
            icon={<NewReleasesIcon />}
            sx={{ fontWeight: "bold" }}
          />
        )}
      </Stack>

      <CardContent sx={{ pb: 1, pt: isGlobal || isNew ? 3 : 2 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar 
            sx={{ 
              bgcolor: isGlobal ? "secondary.main" : (isNew ? "primary.main" : "grey.300"),
              width: 48,
              height: 48,
            }}
          >
            {isGlobal ? <PublicIcon /> : <CampaignIcon />}
          </Avatar>
          <Box flex={1}>
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              color={isGlobal ? "secondary.dark" : "text.primary"}
              sx={{ 
                mb: 0.5,
                cursor: "pointer",
                "&:hover": { color: isGlobal ? "secondary.main" : "primary.main" }
              }}
              onClick={() => onView(notification)}
            >
              {notification.title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 2, lineHeight: 1.6 }}
            >
              {truncateText(notification.content)}
            </Typography>
            
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              {isGlobal ? (
                <Chip
                  icon={<PublicIcon sx={{ fontSize: 16 }} />}
                  label="Tất cả nhân viên"
                  size="small"
                  color="secondary"
                  variant="filled"
                />
              ) : (
                <Chip
                  icon={<BusinessIcon sx={{ fontSize: 16 }} />}
                  label={notification.departmentName || "Phòng ban"}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )}
              <Stack direction="row" spacing={0.5} alignItems="center">
                <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {notification.createdByName || "Hệ thống"}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {getTimeAgo(notification.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
      
      <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
        <Button 
          size="small" 
          startIcon={<VisibilityIcon />}
          onClick={() => onView(notification)}
        >
          Xem chi tiết
        </Button>
        {isHead && !isGlobal && (
          <>
            <Button 
              size="small" 
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => onEdit(notification)}
            >
              Sửa
            </Button>
            <Button 
              size="small" 
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => onDelete(notification)}
            >
              Xóa
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const NotificationClientPage = () => {
  const { 
    employeeInfo, 
    departmentId, 
    departments,
    isLoading: authLoading,
    isAuthenticated,

    isHead,
    departmentName,
  } = useAuth();

  // const canManage = isHead;

  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [searchKeyword, setSearchKeyword] = useState("");

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    content: "",
    deptId: "",
  });
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
  // FETCH: Notifications
  // ─────────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async (currentOffset = 0, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setNotificationsLoading(true);
    }

    try {
      const res = await axiosInstance.get("/notifications/view", { 
        params: { offset: currentOffset } 
      });
      
      const data = res.data?.data || [];

      if (isLoadMore) {
        // Append new notifications to existing list
        setNotifications(prev => [...prev, ...data]);
      } else {
        // Replace notifications (initial load or refresh)
        setNotifications(data);
      }

      // Check if there are more notifications to load
      setHasMore(data.length >= PAGE_SIZE);
      
      // Update offset for next load
      setOffset(currentOffset + data.length);

    } catch (err) {
      console.error("Fetch notifications error:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Lỗi tải danh sách thông báo", 
        severity: "error" 
      });
    } finally {
      setNotificationsLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const fetchNotificationDetail = useCallback(async (id) => {
    setLoadingDetail(true);
    try {
      const res = await axiosInstance.get(`/notifications/${id}`);
      setSelectedNotification(res.data?.data);
      setOpenDetailDialog(true);
    } catch (err) {
      console.error("Fetch notification detail error:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Lỗi tải chi tiết thông báo",
        severity: "error"
      });
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Initial load
    fetchNotifications(0, false);
  }, [fetchNotifications]);

  // ─────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchNotifications(offset, true);
    }
  };

  const handleRefresh = () => {
    setOffset(0);
    setHasMore(true);
    setSearchKeyword("");
    fetchNotifications(0, false);
  };

  const handleOpenCreateDialog = () => {
    setFormMode("create");
    setFormData({
      id: null,
      title: "",
      content: "",
      deptId: departmentId,
    });
    setFormErrors({});
    setOpenFormDialog(true);
  };

  const handleOpenEditDialog = (notification) => {
    setFormMode("edit");
    const dept = departments?.find(d => d.deptName === notification.departmentName);
    setFormData({
      id: notification.id,
      title: notification.title,
      content: notification.content,
      deptId: dept?.id || departmentId,
    });
    setFormErrors({});
    setOpenFormDialog(true);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
    setFormData({ id: null, title: "", content: "", deptId: "" });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Vui lòng nhập tiêu đề thông báo";
    } else if (formData.title.trim().length < 5) {
      errors.title = "Tiêu đề phải có ít nhất 5 ký tự";
    }
    if (!formData.content.trim()) {
      errors.content = "Vui lòng nhập nội dung thông báo";
    } else if (formData.content.trim().length < 10) {
      errors.content = "Nội dung phải có ít nhất 10 ký tự";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNotification = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        deptId: formData.deptId || departmentId,
      };

      if (formMode === "create") {
        await axiosInstance.post("/notifications", payload);
        setSnackbar({ open: true, message: "Tạo thông báo thành công!", severity: "success" });
      } else {
        await axiosInstance.put(`/notifications/${formData.id}`, payload);
        setSnackbar({ open: true, message: "Cập nhật thông báo thành công!", severity: "success" });
      }

      handleCloseFormDialog();
      // Refresh the list from beginning
      handleRefresh();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Lỗi lưu thông báo",
        severity: "error"
      });
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
      setSnackbar({ open: true, message: "Xóa thông báo thành công!", severity: "success" });
      handleCloseDeleteDialog();
      // Refresh the list from beginning
      handleRefresh();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Lỗi xóa thông báo",
        severity: "error"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleViewDetail = (notification) => {
    fetchNotificationDetail(notification.id);
  };

  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return dateStr;
  };

  const isNewNotification = (dateStr) => {
    if (!dateStr) return false;
    const parts = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/);
    if (!parts) return false;
    
    const date = new Date(parts[3], parts[2] - 1, parts[1], parts[4], parts[5], parts[6]);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  const isGlobalNotification = (notification) => {
    return notification.departmentName === "All Departments" || !notification.departmentName;
  };

  // Filter notifications by search keyword (client-side filtering)
  const filteredNotifications = notifications.filter(notification => {
    if (!searchKeyword.trim()) return true;
    const keyword = searchKeyword.toLowerCase();
    return (
      notification.title?.toLowerCase().includes(keyword) ||
      notification.content?.toLowerCase().includes(keyword) ||
      notification.departmentName?.toLowerCase().includes(keyword) ||
      notification.createdByName?.toLowerCase().includes(keyword)
    );
  });

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  if (authLoading) {
    return <LoadingScreen message="Đang tải thông tin..." />;
  }

  if (!isAuthenticated) {
    return <LoadingScreen message="Đang chuyển hướng..." />;
  }


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* HEADER */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 3,
          color: "white",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <NotificationsActiveIcon sx={{ fontSize: 32 }} />
              <Typography variant="h4" fontWeight="bold">
                Thông Báo
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {isHead
                ? `Quản lý thông báo phòng ${departmentName}`
                : `Thông báo từ công ty và phòng ${departmentName || "của bạn"}`
              }
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={notificationsLoading}
              sx={{ 
                bgcolor: "rgba(255,255,255,0.2)", 
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } 
              }}
            >
              Làm mới
            </Button>
            {isHead && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateDialog}
                sx={{ 
                  bgcolor: "white", 
                  color: "primary.main",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" } 
                }}
              >
                Tạo thông báo
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      

      {/* SEARCH BAR */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm thông báo..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchKeyword && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchKeyword("")}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            }
          }}
        />
      </Paper>

      {/* NOTIFICATIONS LIST */}
      {notificationsLoading ? (
        <Box>
          {[1, 2, 3].map((i) => (
            <NotificationSkeleton key={i} />
          ))}
        </Box>
      ) : filteredNotifications.length === 0 ? (
        <Paper elevation={1} sx={{ borderRadius: 3 }}>
          <EmptyState
            icon={InboxIcon}
            title="Chưa có thông báo nào"
            description={
              searchKeyword 
                ? "Không tìm thấy thông báo phù hợp với từ khóa tìm kiếm" 
                : "Hiện tại chưa có thông báo nào từ công ty hoặc phòng ban của bạn"
            }
            action={
              isHead && !searchKeyword && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenCreateDialog}
                >
                  Tạo thông báo đầu tiên
                </Button>
              )
            }
          />
        </Paper>
      ) : (
        <>
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onView={handleViewDetail}
              onEdit={handleOpenEditDialog}
              onDelete={handleOpenDeleteDialog}
              isHead={isHead}
              isNew={isNewNotification(notification.createdAt)}
              isGlobal={isGlobalNotification(notification)}
            />
          ))}

          {/* LOAD MORE BUTTON */}
          {hasMore && !searchKeyword && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="outlined"
                size="large"
                onClick={handleLoadMore}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={20} /> : <ExpandMoreIcon />}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  borderRadius: 3,
                  borderWidth: 2,
                  "&:hover": { borderWidth: 2 }
                }}
              >
                {loadingMore ? "Đang tải..." : "Xem thêm thông báo"}
              </Button>
            </Box>
          )}

          {/* NO MORE NOTIFICATIONS MESSAGE */}
          {!hasMore && notifications.length > 0 && !searchKeyword && (
            <Box textAlign="center" mt={4} py={2}>
              <Typography variant="body2" color="text.secondary">
                ── Đã hiển thị tất cả {notifications.length} thông báo ──
              </Typography>
            </Box>
          )}

          {/* FILTERED COUNT */}
          {searchKeyword && (
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
              Tìm thấy {filteredNotifications.length} thông báo phù hợp
            </Typography>
          )}
        </>
      )}

      {/* DIALOG: CREATE / EDIT */}
      <Dialog
        open={openFormDialog}
        onClose={handleCloseFormDialog}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
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
              <Alert severity="info" icon={<BusinessIcon />}>
                Thông báo sẽ được gửi đến phòng: <strong>{departmentName}</strong>
              </Alert>
            </Grid>

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
                  startAdornment: (
                    <InputAdornment position="start">
                      <ArticleIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Nội dung thông báo *"
                placeholder="Nhập nội dung chi tiết của thông báo..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                error={!!formErrors.content}
                helperText={formErrors.content || `${formData.content.length} ký tự`}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseFormDialog} disabled={saving}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveNotification}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {saving ? "Đang lưu..." : formMode === "create" ? "Đăng thông báo" : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: VIEW DETAIL */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ 
          bgcolor: selectedNotification && isGlobalNotification(selectedNotification) ? "secondary.main" : "#667eea", 
          color: "white" 
        }}>
          <Stack direction="row" spacing={1} alignItems="center">
            {selectedNotification && isGlobalNotification(selectedNotification) ? <PublicIcon /> : <CampaignIcon />}
            <Typography variant="h6" fontWeight="bold">
              Chi Tiết Thông Báo
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetail ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
              <Typography mt={2} color="text.secondary">Đang tải...</Typography>
            </Box>
          ) : selectedNotification ? (
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                {selectedNotification.title}
              </Typography>

              <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
                {isGlobalNotification(selectedNotification) ? (
                  <Chip
                    icon={<PublicIcon />}
                    label="Tất cả nhân viên"
                    color="secondary"
                  />
                ) : (
                  <Chip
                    icon={<BusinessIcon />}
                    label={selectedNotification.departmentName}
                    color="primary"
                    variant="outlined"
                  />
                )}
                <Chip
                  icon={<PersonIcon />}
                  label={selectedNotification.createdByName || "Hệ thống"}
                  variant="outlined"
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={formatDate(selectedNotification.createdAt)}
                  variant="outlined"
                />
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Paper sx={{ p: 3, bgcolor: "#f8fafc", borderRadius: 2 }}>
                <Typography 
                  variant="body1" 
                  sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
                >
                  {selectedNotification.content}
                </Typography>
              </Paper>
            </Box>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">Không có dữ liệu</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          {isHead && selectedNotification && !isGlobalNotification(selectedNotification) && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => {
                setOpenDetailDialog(false);
                handleOpenEditDialog(selectedNotification);
              }}
            >
              Chỉnh sửa
            </Button>
          )}
          <Button variant="contained" onClick={() => setOpenDetailDialog(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: DELETE */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
      >
        <DialogTitle sx={{ bgcolor: "error.main", color: "white" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <WarningIcon />
            <Typography variant="h6" fontWeight="bold">
              Xác Nhận Xóa Thông Báo
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Bạn có chắc chắn muốn xóa thông báo này? Hành động này không thể hoàn tác!
            </Typography>
          </Alert>
          
          {deletingNotification && (
            <Paper variant="outlined" sx={{ p: 2, bgcolor: "#fafafa" }}>
              <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                {deletingNotification.title}
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDeleteDialog} disabled={deleting}>
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteNotification}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleting ? "Đang xóa..." : "Xóa thông báo"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          sx={{ minWidth: 300 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NotificationClientPage;