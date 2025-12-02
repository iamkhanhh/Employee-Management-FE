// src/pages/KpiReviewPage.jsx
// → PHIÊN BẢN HOÀN CHỈNH VỚI CRUD PERIODS & PHÂN QUYỀN

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
  MenuItem,
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
  Tabs,
  Tab,
  LinearProgress,
  Rating,
  Slider,
  Divider,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Star as StarIcon,
  RateReview as RateReviewIcon,
  EmojiEvents as TrophyIcon,
  Groups as GroupsIcon,
  DateRange as DateRangeIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

import { axiosInstance } from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const RATING_CONFIG = {
  A: { color: "#4caf50", bg: "#e8f5e9", label: "Xuất sắc" },
  B: { color: "#8bc34a", bg: "#f1f8e9", label: "Tốt" },
  C: { color: "#ff9800", bg: "#fff3e0", label: "Khá" },
  D: { color: "#ff5722", bg: "#fbe9e7", label: "Trung bình" },
  E: { color: "#f44336", bg: "#ffebee", label: "Yếu" },
};

// ═══════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════
const LoadingScreen = ({ message = "Đang tải..." }) => (
  <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", flexDirection: "column" }}>
    <CircularProgress size={70} />
    <Typography mt={3} variant="h6" color="text.secondary">{message}</Typography>
  </Container>
);

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const RatingChip = ({ rating }) => {
  const config = RATING_CONFIG[rating] || RATING_CONFIG.C;
  return (
    <Chip
      label={`${rating} - ${config.label}`}
      sx={{ bgcolor: config.bg, color: config.color, fontWeight: "bold" }}
      icon={<TrophyIcon sx={{ color: `${config.color} !important` }} />}
    />
  );
};

const ScoreProgress = ({ score, maxScore = 5, showLabel = true }) => {
  const percentage = (score / maxScore) * 100;
  const getColor = () => {
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "info";
    if (percentage >= 40) return "warning";
    return "error";
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ flexGrow: 1 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          color={getColor()}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>
      {showLabel && (
        <Typography variant="body2" fontWeight="bold" sx={{ minWidth: 50 }}>
          {score.toFixed(1)}/{maxScore}
        </Typography>
      )}
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN CONTENT COMPONENT
// ═══════════════════════════════════════════════════════════════
const KpiReviewContent = ({ user }) => {
  // ─────────────────────────────────────────────────────────────
  // STATE: Employee Info
  // ─────────────────────────────────────────────────────────────
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [employeeError, setEmployeeError] = useState("");

  // ─────────────────────────────────────────────────────────────
  // STATE: Criteria
  // ─────────────────────────────────────────────────────────────
  const [criteria, setCriteria] = useState([]);

  // ─────────────────────────────────────────────────────────────
  // STATE: Tab
  // ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(0);

  // ─────────────────────────────────────────────────────────────
  // STATE: KPI Periods
  // ─────────────────────────────────────────────────────────────
  const [periods, setPeriods] = useState([]);
  const [periodsLoading, setPeriodsLoading] = useState(false);
  const [periodsPagination, setPeriodsPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });

  // ─────────────────────────────────────────────────────────────
  // STATE: My KPI
  // ─────────────────────────────────────────────────────────────
  const [myKpi, setMyKpi] = useState([]);
  const [myKpiLoading, setMyKpiLoading] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // STATE: Department Reviews (for HEAD)
  // ─────────────────────────────────────────────────────────────
  const [selectedPeriodId, setSelectedPeriodId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);

  // ─────────────────────────────────────────────────────────────
  // STATE: Dialogs - Period CRUD
  // ─────────────────────────────────────────────────────────────
  const [openPeriodDialog, setOpenPeriodDialog] = useState(false);
  const [periodForm, setPeriodForm] = useState({ id: null, periodName: "", startDate: "", endDate: "" });
  const [periodFormError, setPeriodFormError] = useState("");
  const [savingPeriod, setSavingPeriod] = useState(false);

  const [openDeletePeriodDialog, setOpenDeletePeriodDialog] = useState(false);
  const [deletingPeriod, setDeletingPeriod] = useState(null);

  const [openPeriodDetailDialog, setOpenPeriodDetailDialog] = useState(false);
  const [selectedPeriodDetail, setSelectedPeriodDetail] = useState(null);

  // ─────────────────────────────────────────────────────────────
  // STATE: Dialogs - Review
  // ─────────────────────────────────────────────────────────────
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewForm, setReviewForm] = useState({ empId: null, empName: "", scores: [], comment: "" });
  const [openReviewDetailDialog, setOpenReviewDetailDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loadingReviewDetail, setLoadingReviewDetail] = useState(false);
  const [openMyKpiDetail, setOpenMyKpiDetail] = useState(false);
  const [selectedMyKpi, setSelectedMyKpi] = useState(null);

  // ─────────────────────────────────────────────────────────────
  // STATE: Snackbar
  // ─────────────────────────────────────────────────────────────
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // ─────────────────────────────────────────────────────────────
  // COMPUTED: Permissions
  // ─────────────────────────────────────────────────────────────
  const isAdmin = useMemo(() => {
    return user?.role === "ADMIN" || user?.role === "HR" || user?.roles?.includes("ADMIN") || user?.roles?.includes("HR");
  }, [user]);

  const isHead = useMemo(() => employeeInfo?.roleInDept === "HEAD", [employeeInfo]);

  const canManagePeriods = isAdmin; // Chỉ ADMIN/HR mới CRUD periods
  const canViewPeriods = isAdmin || isHead; // ADMIN/HR + HEAD có thể xem periods
  const canReviewEmployees = isHead || isAdmin; // HEAD hoặc ADMIN có thể đánh giá
  const isViewingDepartment = isHead && departmentId;

  // ─────────────────────────────────────────────────────────────
  // FETCH: Employee Info + Department ID
  // ─────────────────────────────────────────────────────────────
  const fetchEmployeeInfo = useCallback(async () => {
    setLoadingEmployee(true);
    setEmployeeError("");

    try {
      // 1. Lấy thông tin employee
      const empRes = await axiosInstance.get("/employees/me");
      console.log("📌 Employee Response:", empRes.data);

      const empData = empRes.data?.data;
      setEmployeeInfo(empData);

      // 2. Nếu là HEAD, cần lấy departmentId
      if (empData?.roleInDept === "HEAD" && empData?.department) {
        const deptName = empData.department;
        console.log("📌 Employee Department Name:", deptName);

        try {
          const deptRes = await axiosInstance.get("/departments");
          const deptList = deptRes.data?.data || [];
          const foundDept = deptList.find(d => d.deptName === deptName);

          if (foundDept) {
            console.log("✅ Found Department ID:", foundDept.id);
            setDepartmentId(foundDept.id);
          }
        } catch (deptErr) {
          console.error("❌ Fetch departments failed:", deptErr);
        }
      }

      // 3. Fetch criteria
      try {
        const criteriaRes = await axiosInstance.get("/review/criteria");
        setCriteria(criteriaRes.data?.data || []);
      } catch (criteriaErr) {
        console.error("❌ Fetch criteria failed:", criteriaErr);
      }

    } catch (err) {
      console.error("❌ Fetch Employee Error:", err.response || err);
      setEmployeeError(err.response?.data?.message || "Không thể lấy thông tin nhân viên");
    } finally {
      setLoadingEmployee(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // FETCH: KPI Periods
  // ─────────────────────────────────────────────────────────────
  const fetchPeriods = useCallback(async (page = 0, size = 10) => {
    setPeriodsLoading(true);
    try {
      const res = await axiosInstance.get("/review/periods", {
        params: { page, pageSize: size },
      });
      const data = res.data?.data;
      setPeriods(data?.content || []);
      setPeriodsPagination({
        page: data?.currentPage || 0,
        size: data?.pageSize || 10,
        totalElements: data?.totalElements || 0,
        totalPages: data?.totalPages || 0,
      });

      // Set default selected period
      if (data?.content?.length > 0 && !selectedPeriodId) {
        setSelectedPeriodId(data.content[0].id);
      }
    } catch (err) {
      console.error("Fetch periods error:", err);
      setSnackbar({ open: true, message: "Lỗi tải danh sách kỳ đánh giá", severity: "error" });
    } finally {
      setPeriodsLoading(false);
    }
  }, [selectedPeriodId]);

  // ─────────────────────────────────────────────────────────────
  // FETCH: Period Detail
  // ─────────────────────────────────────────────────────────────
  const fetchPeriodDetail = useCallback(async (periodId) => {
    try {
      const res = await axiosInstance.get(`/review/periods/${periodId}`);
      setSelectedPeriodDetail(res.data?.data);
      setOpenPeriodDetailDialog(true);
    } catch (err) {
      setSnackbar({ open: true, message: "Lỗi tải chi tiết kỳ đánh giá", severity: "error" });
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // FETCH: My KPI
  // ─────────────────────────────────────────────────────────────
  const fetchMyKpi = useCallback(async () => {
    setMyKpiLoading(true);
    try {
      const res = await axiosInstance.get("/review/me");
      setMyKpi(res.data?.data || []);
    } catch (err) {
      console.error("Fetch my KPI error:", err);
    } finally {
      setMyKpiLoading(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // FETCH: Reviews by Period
  // ─────────────────────────────────────────────────────────────
  const fetchReviews = useCallback(async () => {
    if (!selectedPeriodId) return;
    setReviewsLoading(true);
    try {
      const res = await axiosInstance.get(`/review/periods/${selectedPeriodId}/reviews`);
      const allReviews = res.data?.data || [];

      // Lọc theo department nếu là HEAD (không phải ADMIN)
      const filteredReviews = (isHead && !isAdmin && departmentId)
        ? allReviews.filter(r => r.deptId === departmentId)
        : allReviews;

      setReviews(filteredReviews);
    } catch (err) {
      console.error("Fetch reviews error:", err);
    } finally {
      setReviewsLoading(false);
    }
  }, [selectedPeriodId, departmentId, isHead, isAdmin]);

  // ─────────────────────────────────────────────────────────────
  // FETCH: Employees in Department
  // ─────────────────────────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    if (!departmentId) return;
    try {
      const res = await axiosInstance.get(`/employees/department/${departmentId}`);
      setEmployees(res.data?.data || []);
    } catch (err) {
      console.error("Fetch employees error:", err);
      setEmployees([]);
    }
  }, [departmentId]);


  // ─────────────────────────────────────────────────────────────
  // FETCH: Single Review Detail (THÊM MỚI)
  // ─────────────────────────────────────────────────────────────
  const fetchReviewDetail = useCallback(async (periodId, reviewId) => {
    setLoadingReviewDetail(true);
    try {
      const res = await axiosInstance.get(`/review/periods/${periodId}/reviews/${reviewId}`);
      console.log("📌 Review Detail Response:", res.data);
      setSelectedReview(res.data?.data);
      setOpenReviewDetailDialog(true);
    } catch (err) {
      console.error("Fetch review detail error:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Lỗi tải chi tiết đánh giá",
        severity: "error"
      });
    } finally {
      setLoadingReviewDetail(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // HANDLER: Open Review Detail (CẬP NHẬT)
  // ─────────────────────────────────────────────────────────────
  const handleOpenReviewDetail = (review) => {
    // Gọi API lấy chi tiết thay vì dùng data từ list
    if (selectedPeriodId && review.id) {
      fetchReviewDetail(selectedPeriodId, review.id);
    } else {
      // Fallback: dùng data từ list nếu không có id
      setSelectedReview(review);
      setOpenReviewDetailDialog(true);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchEmployeeInfo();
  }, [fetchEmployeeInfo]);

  useEffect(() => {
    if (!loadingEmployee) {
      fetchMyKpi();
      if (canViewPeriods) {
        fetchPeriods();
      }
    }
  }, [loadingEmployee, canViewPeriods, fetchMyKpi, fetchPeriods]);

  useEffect(() => {
    if (isHead && departmentId) {
      fetchEmployees();
    }
  }, [isHead, departmentId, fetchEmployees]);

  useEffect(() => {
    if (selectedPeriodId && canReviewEmployees) {
      fetchReviews();
    }
  }, [selectedPeriodId, canReviewEmployees, fetchReviews]);

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: Period CRUD
  // ─────────────────────────────────────────────────────────────
  const handleOpenPeriodDialog = (period = null) => {
    if (period) {
      // Edit mode - format dates for input
      setPeriodForm({
        id: period.id,
        periodName: period.periodName,
        startDate: formatDateForInput(period.startDate),
        endDate: formatDateForInput(period.endDate),
      });
    } else {
      // Create mode
      setPeriodForm({ id: null, periodName: "", startDate: "", endDate: "" });
    }
    setPeriodFormError("");
    setOpenPeriodDialog(true);
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    // Handle both "dd/MM/yyyy" and "yyyy-MM-dd" formats
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateStr.split("T")[0];
  };

  const formatDateForApi = (dateStr) => {
    if (!dateStr) return "";
    // Convert "yyyy-MM-dd" to "dd/MM/yyyy"
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSavePeriod = async () => {
    // Validation
    if (!periodForm.periodName.trim()) {
      setPeriodFormError("Vui lòng nhập tên kỳ đánh giá");
      return;
    }
    if (!periodForm.startDate || !periodForm.endDate) {
      setPeriodFormError("Vui lòng chọn ngày bắt đầu và kết thúc");
      return;
    }
    if (new Date(periodForm.startDate) > new Date(periodForm.endDate)) {
      setPeriodFormError("Ngày bắt đầu phải trước ngày kết thúc");
      return;
    }

    setSavingPeriod(true);
    try {
      const payload = {
        periodName: periodForm.periodName.trim(),
        startDate: formatDateForApi(periodForm.startDate),
        endDate: formatDateForApi(periodForm.endDate),
      };

      if (periodForm.id) {
        // Update
        await axiosInstance.put(`/review/periods/${periodForm.id}`, payload);
        setSnackbar({ open: true, message: "Cập nhật kỳ đánh giá thành công!", severity: "success" });
      } else {
        // Create
        await axiosInstance.post("/review/periods", payload);
        setSnackbar({ open: true, message: "Tạo kỳ đánh giá thành công!", severity: "success" });
      }

      setOpenPeriodDialog(false);
      fetchPeriods(periodsPagination.page, periodsPagination.size);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Lỗi lưu kỳ đánh giá",
        severity: "error"
      });
    } finally {
      setSavingPeriod(false);
    }
  };

  const handleDeletePeriod = async () => {
    if (!deletingPeriod) return;
    try {
      await axiosInstance.delete(`/review/periods/${deletingPeriod.id}`);
      setSnackbar({ open: true, message: "Xóa kỳ đánh giá thành công!", severity: "success" });
      setOpenDeletePeriodDialog(false);
      setDeletingPeriod(null);
      fetchPeriods(periodsPagination.page, periodsPagination.size);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Lỗi xóa kỳ đánh giá",
        severity: "error"
      });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: Review
  // ─────────────────────────────────────────────────────────────
  const handleOpenReviewDialog = (employee) => {
    const initialScores = criteria.map(c => ({
      criteriaId: c.id,
      criteriaName: c.name,
      weight: c.weight,
      scoreValue: 3,
    }));
    setReviewForm({
      empId: employee.id,
      empName: employee.fullName,
      scores: initialScores,
      comment: "",
    });
    setOpenReviewDialog(true);
  };

  const handleScoreChange = (criteriaId, newValue) => {
    setReviewForm(prev => ({
      ...prev,
      scores: prev.scores.map(s =>
        s.criteriaId === criteriaId ? { ...s, scoreValue: newValue } : s
      ),
    }));
  };

  const calculateFinalScore = () => {
    return reviewForm.scores.reduce((sum, s) => sum + (s.scoreValue * s.weight), 0);
  };

  const handleSubmitReview = async () => {
    if (!selectedPeriodId) {
      setSnackbar({ open: true, message: "Vui lòng chọn kỳ đánh giá", severity: "warning" });
      return;
    }

    try {
      await axiosInstance.post(`/review/periods/${selectedPeriodId}/reviews`, {
        empId: reviewForm.empId,
        scores: reviewForm.scores.map(s => ({
          criteriaId: s.criteriaId,
          scoreValue: s.scoreValue,
        })),
        comment: reviewForm.comment.trim(),
      });
      setSnackbar({ open: true, message: "Đánh giá thành công!", severity: "success" });
      setOpenReviewDialog(false);
      fetchReviews();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Lỗi gửi đánh giá",
        severity: "error"
      });
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────
  const formatDate = (d) => {
    if (!d) return "-";
    // Handle both formats
    if (d.includes("/")) return d;
    return new Date(d).toLocaleDateString("vi-VN");
  };

  const getPeriodStatus = (period) => {
    const now = new Date();
    const parseDate = (d) => {
      if (d.includes("/")) {
        const [day, month, year] = d.split("/");
        return new Date(year, month - 1, day);
      }
      return new Date(d);
    };

    const start = parseDate(period.startDate);
    const end = parseDate(period.endDate);

    if (now < start) return { label: "Sắp tới", color: "info", icon: <ScheduleIcon /> };
    if (now > end) return { label: "Đã kết thúc", color: "default", icon: <CheckCircleIcon /> };
    return { label: "Đang diễn ra", color: "success", icon: <TrendingUpIcon /> };
  };

  // ─────────────────────────────────────────────────────────────
  // COMPUTED: Stats
  // ─────────────────────────────────────────────────────────────
  const myKpiStats = useMemo(() => {
    if (myKpi.length === 0) return null;
    const avgScore = myKpi.reduce((sum, k) => sum + (k.finalScore || 0), 0) / myKpi.length;
    const latestReview = myKpi[0];
    const bestScore = Math.max(...myKpi.map(k => k.finalScore || 0));
    return { avgScore, latestReview, totalReviews: myKpi.length, bestScore };
  }, [myKpi]);

  const unreviewedEmployees = useMemo(() => {
    const reviewedIds = reviews.map(r => r.empId);
    return employees.filter(e => !reviewedIds.includes(e.id));
  }, [employees, reviews]);

  const deptStats = useMemo(() => ({
    total: employees.length,
    reviewed: reviews.length,
    pending: unreviewedEmployees.length,
    avgScore: reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.averageScore || 0), 0) / reviews.length
      : 0,
  }), [employees, reviews, unreviewedEmployees]);

  // ─────────────────────────────────────────────────────────────
  // Tính toán Tab indices động theo role
  // ─────────────────────────────────────────────────────────────
  const getTabConfig = () => {
    const tabs = [];

    // Tab Kỳ Đánh Giá (ADMIN/HR hoặc HEAD)
    if (canViewPeriods) {
      tabs.push({ key: "periods", label: "Kỳ Đánh Giá", icon: <DateRangeIcon /> });
    }

    // Tab Đánh Giá Phòng Ban (HEAD hoặc ADMIN)
    if (canReviewEmployees) {
      tabs.push({ key: "reviews", label: "Đánh Giá Nhân Viên", icon: <GroupsIcon /> });
    }

    // Tab KPI Của Tôi (tất cả)
    tabs.push({ key: "myKpi", label: "KPI Của Tôi", icon: <PersonIcon /> });

    return tabs;
  };

  const tabConfig = getTabConfig();

  // ─────────────────────────────────────────────────────────────
  // RENDER: Loading
  // ─────────────────────────────────────────────────────────────
  if (loadingEmployee) {
    return <LoadingScreen message="Đang tải thông tin nhân viên..." />;
  }

  if (employeeError) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Alert severity="error" action={<Button onClick={fetchEmployeeInfo}>Thử lại</Button>}>
          <Typography variant="h6" gutterBottom>Không thể tải thông tin nhân viên</Typography>
          <Typography variant="body2">{employeeError}</Typography>
        </Alert>
      </Container>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: Main
  // ─────────────────────────────────────────────────────────────
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ═══════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            <AssessmentIcon sx={{ mr: 1, verticalAlign: "middle", fontSize: 35 }} />
            Đánh Giá KPI
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Xin chào <strong>{employeeInfo?.fullName}</strong>
            {isAdmin && " - Quản trị viên"}
            {isHead && !isAdmin && " - Trưởng phòng"}
            {!isAdmin && !isHead && " - Nhân viên"}
            {employeeInfo?.department && ` | ${employeeInfo.department}`}
          </Typography>
          {/* Debug Info */}
          <Stack direction="row" spacing={1} mt={1}>
            <Chip size="small" variant="outlined" label={`Role: ${user?.role || employeeInfo?.roleInDept || "MEMBER"}`} color={isAdmin ? "error" : isHead ? "success" : "default"} />
            <Chip size="small" variant="outlined" label={`Dept ID: ${departmentId || "N/A"}`} color={departmentId ? "info" : "warning"} />
          </Stack>
        </Box>
      </Box>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TABS */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          {tabConfig.map((tab, index) => (
            <Tab key={tab.key} icon={tab.icon} label={tab.label} iconPosition="start" />
          ))}
        </Tabs>
      </Paper>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TAB: KỲ ĐÁNH GIÁ */}
      {/* ═══════════════════════════════════════════════════════ */}
      {canViewPeriods && tabConfig[activeTab]?.key === "periods" && (
        <Box>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              <DateRangeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Danh Sách Kỳ Đánh Giá
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => fetchPeriods(periodsPagination.page, periodsPagination.size)} color="primary">
                <RefreshIcon />
              </IconButton>
              {canManagePeriods && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenPeriodDialog()}>
                  Tạo kỳ mới
                </Button>
              )}
            </Stack>
          </Box>

          {periodsLoading ? (
            <Box textAlign="center" py={6}>
              <CircularProgress />
              <Typography mt={2}>Đang tải...</Typography>
            </Box>
          ) : (
            <Paper elevation={3}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                      <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Tên kỳ đánh giá</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Ngày bắt đầu</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Ngày kết thúc</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {periods.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <DateRangeIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
                          <Typography color="text.secondary">Chưa có kỳ đánh giá nào</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      periods.map((period, i) => {
                        const status = getPeriodStatus(period);
                        return (
                          <TableRow key={period.id} hover>
                            <TableCell>{periodsPagination.page * periodsPagination.size + i + 1}</TableCell>
                            <TableCell>
                              <Typography fontWeight="bold">{period.periodName}</Typography>
                            </TableCell>
                            <TableCell>{formatDate(period.startDate)}</TableCell>
                            <TableCell>{formatDate(period.endDate)}</TableCell>
                            <TableCell>
                              <Chip icon={status.icon} label={status.label} color={status.color} size="small" />
                            </TableCell>
                            <TableCell align="center">
                              <Stack direction="row" spacing={0.5} justifyContent="center">
                                <Tooltip title="Xem chi tiết">
                                  <IconButton size="small" color="info" onClick={() => fetchPeriodDetail(period.id)}>
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                {canManagePeriods && (
                                  <>
                                    <Tooltip title="Sửa">
                                      <IconButton size="small" color="primary" onClick={() => handleOpenPeriodDialog(period)}>
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Xóa">
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => { setDeletingPeriod(period); setOpenDeletePeriodDialog(true); }}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {periods.length > 0 && (
                <TablePagination
                  component="div"
                  count={periodsPagination.totalElements}
                  page={periodsPagination.page}
                  rowsPerPage={periodsPagination.size}
                  onPageChange={(_, p) => fetchPeriods(p, periodsPagination.size)}
                  onRowsPerPageChange={(e) => fetchPeriods(0, +e.target.value)}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Số dòng:"
                />
              )}
            </Paper>
          )}

          {/* Criteria Info */}
          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📋 Tiêu Chí Đánh Giá
            </Typography>
            <Grid container spacing={2}>
              {criteria.map((c) => (
                <Grid item xs={12} sm={6} md={4} key={c.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography fontWeight="bold">{c.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{c.description}</Typography>
                        </Box>
                        <Chip label={`${(c.weight * 100).toFixed(0)}%`} color="primary" size="small" />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TAB: ĐÁNH GIÁ NHÂN VIÊN */}
      {/* ═══════════════════════════════════════════════════════ */}
      {canReviewEmployees && tabConfig[activeTab]?.key === "reviews" && (
        <Box>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              <GroupsIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              {isAdmin ? "Đánh Giá Nhân Viên (Toàn công ty)" : "Đánh Giá Nhân Viên Phòng Ban"}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Chọn kỳ đánh giá</InputLabel>
                <Select
                  value={selectedPeriodId}
                  label="Chọn kỳ đánh giá"
                  onChange={(e) => setSelectedPeriodId(e.target.value)}
                >
                  {periods.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.periodName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton onClick={fetchReviews} color="primary">
                <RefreshIcon />
              </IconButton>
            </Stack>
          </Box>

          {/* Stats */}
          {isHead && (
            <Grid container spacing={2} mb={3}>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">{deptStats.total}</Typography>
                    <Typography variant="caption" color="text.secondary">Tổng nhân viên</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="success.main">{deptStats.reviewed}</Typography>
                    <Typography variant="caption" color="text.secondary">Đã đánh giá</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">{deptStats.pending}</Typography>
                    <Typography variant="caption" color="text.secondary">Chưa đánh giá</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="info.main">{deptStats.avgScore.toFixed(2)}</Typography>
                    <Typography variant="caption" color="text.secondary">Điểm TB</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {!selectedPeriodId ? (
            <Alert severity="info">Vui lòng chọn kỳ đánh giá để xem danh sách</Alert>
          ) : reviewsLoading ? (
            <Box textAlign="center" py={6}>
              <CircularProgress />
              <Typography mt={2}>Đang tải...</Typography>
            </Box>
          ) : (
            <>
              {/* Unreviewed Employees (chỉ cho HEAD) */}
              {isHead && unreviewedEmployees.length > 0 && (
                <Box mb={4}>
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    ⚠️ Còn <strong>{unreviewedEmployees.length}</strong> nhân viên chưa được đánh giá
                  </Alert>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Click vào tên để đánh giá:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {unreviewedEmployees.map((emp) => (
                        <Chip
                          key={emp.id}
                          avatar={<Avatar>{emp.fullName?.[0]}</Avatar>}
                          label={emp.fullName}
                          onClick={() => handleOpenReviewDialog(emp)}
                          color="warning"
                          variant="outlined"
                          sx={{ mb: 1, cursor: "pointer" }}
                          deleteIcon={<RateReviewIcon />}
                          onDelete={() => handleOpenReviewDialog(emp)}
                        />
                      ))}
                    </Stack>
                  </Paper>
                </Box>
              )}

              {/* Reviewed List */}
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                📋 Danh Sách Đã Đánh Giá ({reviews.length})
              </Typography>
              <Paper elevation={2}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Nhân viên</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Phòng ban</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Điểm TB</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Xếp loại</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reviews.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                            <RateReviewIcon sx={{ fontSize: 50, color: "#ccc", mb: 1 }} />
                            <Typography color="text.secondary">Chưa có đánh giá nào</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        reviews.map((review, i) => (
                          <TableRow key={review.id} hover>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
                                  {review.empName?.[0]?.toUpperCase()}
                                </Avatar>
                                <Typography fontWeight={500}>{review.empName}</Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>{review.deptName || "-"}</TableCell>
                            <TableCell>
                              <Box sx={{ width: 120 }}>
                                <ScoreProgress score={review.averageScore || 0} />
                              </Box>
                            </TableCell>
                            <TableCell>
                              <RatingChip rating={review.finalRating || "C"} />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Xem chi tiết">
                                <IconButton
                                  color="info"
                                  onClick={() => handleOpenReviewDetail(review)}
                                  disabled={loadingReviewDetail}
                                >
                                  {loadingReviewDetail ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <VisibilityIcon />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </>
          )}
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TAB: KPI CỦA TÔI */}
      {/* ═══════════════════════════════════════════════════════ */}
      {tabConfig[activeTab]?.key === "myKpi" && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Kết Quả Đánh Giá KPI Của Tôi
            </Typography>
            <IconButton onClick={fetchMyKpi} color="primary">
              <RefreshIcon />
            </IconButton>
          </Box>

          {myKpiLoading ? (
            <Box textAlign="center" py={6}>
              <CircularProgress />
              <Typography mt={2}>Đang tải...</Typography>
            </Box>
          ) : myKpi.length === 0 ? (
            <Box textAlign="center" py={8}>
              <AssessmentIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Bạn chưa có đánh giá KPI nào
              </Typography>
              <Typography color="text.secondary">
                Hãy chờ quản lý đánh giá bạn trong kỳ tiếp theo!
              </Typography>
            </Box>
          ) : (
            <>
              {/* Stats Cards */}
              {myKpiStats && (
                <Grid container spacing={3} mb={4}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3} sx={{ borderLeft: "5px solid #1976d2" }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">Điểm trung bình</Typography>
                        <Typography variant="h3" fontWeight="bold" color="primary">
                          {myKpiStats.avgScore.toFixed(2)}
                        </Typography>
                        <ScoreProgress score={myKpiStats.avgScore} showLabel={false} />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3} sx={{ borderLeft: "5px solid #4caf50" }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">Điểm cao nhất</Typography>
                        <Typography variant="h3" fontWeight="bold" color="success.main">
                          {myKpiStats.bestScore.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3} sx={{ borderLeft: "5px solid #ff9800" }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">Xếp loại gần nhất</Typography>
                        <Box mt={1}>
                          <RatingChip rating={myKpiStats.latestReview?.rating || "C"} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3} sx={{ borderLeft: "5px solid #9c27b0" }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">Số lần đánh giá</Typography>
                        <Typography variant="h3" fontWeight="bold" color="secondary">
                          {myKpiStats.totalReviews}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {/* Review History */}
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                📋 Lịch Sử Đánh Giá
              </Typography>
              <Grid container spacing={3}>
                {myKpi.map((kpi) => (
                  <Grid item xs={12} md={6} key={kpi.id}>
                    <Card
                      elevation={2}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.2s",
                        "&:hover": { boxShadow: 6, transform: "translateY(-2px)" }
                      }}
                      onClick={() => { setSelectedMyKpi(kpi); setOpenMyKpiDetail(true); }}
                    >
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            📅 {kpi.periodName}
                          </Typography>
                          <RatingChip rating={kpi.rating || "C"} />
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {kpi.scores?.slice(0, 3).map((score) => (
                          <Box key={score.criteriaId} mb={1.5}>
                            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                              <Typography variant="body2" fontWeight={500}>{score.criteriaName}</Typography>
                              <Typography variant="caption" color="text.secondary">({(score.weight * 100).toFixed(0)}%)</Typography>
                            </Stack>
                            <ScoreProgress score={score.scoreValue} />
                          </Box>
                        ))}
                        {kpi.scores?.length > 3 && (
                          <Typography variant="caption" color="primary">+ {kpi.scores.length - 3} tiêu chí khác...</Typography>
                        )}

                        <Divider sx={{ my: 2 }} />

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography fontWeight="bold">Điểm tổng kết:</Typography>
                          <Typography variant="h5" fontWeight="bold" color="primary">
                            {kpi.finalScore?.toFixed(2) || "0.00"}/5.00
                          </Typography>
                        </Stack>

                        <Typography variant="caption" color="text.secondary" display="block" mt={2}>
                          👤 {kpi.recordedByName} | 📆 {formatDate(kpi.createdAt)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DIALOG: Period Detail */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Dialog open={openPeriodDetailDialog} onClose={() => setOpenPeriodDetailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Chi Tiết Kỳ Đánh Giá
        </DialogTitle>
        <DialogContent dividers>
          {selectedPeriodDetail && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Tên kỳ đánh giá</Typography>
                <Typography variant="h6" fontWeight="bold">{selectedPeriodDetail.periodName}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Ngày bắt đầu</Typography>
                <Typography fontWeight="bold">{formatDate(selectedPeriodDetail.startDate)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Ngày kết thúc</Typography>
                <Typography fontWeight="bold">{formatDate(selectedPeriodDetail.endDate)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Ngày tạo</Typography>
                <Typography>{formatDate(selectedPeriodDetail.createdAt)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">Cập nhật lần cuối</Typography>
                <Typography>{formatDate(selectedPeriodDetail.updatedAt)}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPeriodDetailDialog(false)} variant="contained">Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DIALOG: Create/Edit Period */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Dialog open={openPeriodDialog} onClose={() => setOpenPeriodDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            {periodForm.id ? <EditIcon /> : <AddIcon />}
            <Typography variant="h6" fontWeight="bold">
              {periodForm.id ? "Sửa Kỳ Đánh Giá" : "Tạo Kỳ Đánh Giá Mới"}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên kỳ đánh giá"
                placeholder="VD: Q1 2025, Quý 1 năm 2025"
                value={periodForm.periodName}
                onChange={(e) => setPeriodForm({ ...periodForm, periodName: e.target.value })}
                error={!!periodFormError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Ngày bắt đầu"
                InputLabelProps={{ shrink: true }}
                value={periodForm.startDate}
                onChange={(e) => setPeriodForm({ ...periodForm, startDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Ngày kết thúc"
                InputLabelProps={{ shrink: true }}
                value={periodForm.endDate}
                onChange={(e) => setPeriodForm({ ...periodForm, endDate: e.target.value })}
              />
            </Grid>
            {periodFormError && (
              <Grid item xs={12}>
                <Alert severity="error">{periodFormError}</Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenPeriodDialog(false)} disabled={savingPeriod}>Hủy</Button>
          <Button variant="contained" onClick={handleSavePeriod} disabled={savingPeriod}>
            {savingPeriod ? <CircularProgress size={20} /> : periodForm.id ? "Cập nhật" : "Tạo mới"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DIALOG: Delete Period Confirmation */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Dialog open={openDeletePeriodDialog} onClose={() => setOpenDeletePeriodDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: "error.main", color: "white" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <WarningIcon />
            <Typography variant="h6">Xác nhận xóa</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Bạn có chắc muốn xóa kỳ đánh giá "<strong>{deletingPeriod?.periodName}</strong>"?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Hành động này không thể hoàn tác và sẽ xóa tất cả đánh giá liên quan!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeletePeriodDialog(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDeletePeriod}>Xóa</Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DIALOG: Submit Review */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Dialog open={openReviewDialog} onClose={() => setOpenReviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <RateReviewIcon />
            <Typography variant="h6" fontWeight="bold">
              Đánh Giá: {reviewForm.empName}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {reviewForm.scores.map((score) => (
              <Grid item xs={12} key={score.criteriaId}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography fontWeight="bold">{score.criteriaName}</Typography>
                    <Chip label={`${(score.weight * 100).toFixed(0)}%`} size="small" color="primary" />
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography sx={{ minWidth: 20 }}>1</Typography>
                    <Slider
                      value={score.scoreValue}
                      onChange={(_, v) => handleScoreChange(score.criteriaId, v)}
                      min={1}
                      max={5}
                      step={0.5}
                      marks
                      valueLabelDisplay="on"
                    />
                    <Typography sx={{ minWidth: 20 }}>5</Typography>
                    <Rating value={score.scoreValue} precision={0.5} readOnly />
                  </Stack>
                </Paper>
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Nhận xét"
                placeholder="Nhập nhận xét về nhân viên..."
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info" icon={<StarIcon />}>
                <strong>Điểm tổng kết (dự tính):</strong> {calculateFinalScore().toFixed(2)}/5.00
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenReviewDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmitReview} startIcon={<RateReviewIcon />}>
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DIALOG: Review Detail */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Dialog open={openReviewDetailDialog} onClose={() => setOpenReviewDetailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <VisibilityIcon />
            <Typography variant="h6" fontWeight="bold">Chi Tiết Đánh Giá</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {loadingReviewDetail ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
              <Typography mt={2} color="text.secondary">Đang tải chi tiết...</Typography>
            </Box>
          ) : selectedReview ? (
            <Box>
              {/* Employee Info */}
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main", fontSize: "1.5rem" }}>
                  {selectedReview.empName?.[0]?.toUpperCase()}
                </Avatar>
                <Box flexGrow={1}>
                  <Typography variant="h6" fontWeight="bold">{selectedReview.empName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedReview.deptName} | ID: {selectedReview.empId}
                  </Typography>
                </Box>
                <RatingChip rating={selectedReview.finalRating || "C"} />
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Score Summary */}
              <Box textAlign="center" mb={3} p={2} bgcolor="#f5f5f5" borderRadius={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>Điểm Trung Bình</Typography>
                <Typography variant="h2" fontWeight="bold" color="primary">
                  {selectedReview.averageScore?.toFixed(2) || "0.00"}
                </Typography>
                <Typography variant="body2" color="text.secondary">/5.00</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Scores by Criteria */}
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                📊 Chi tiết từng tiêu chí:
              </Typography>
              {selectedReview.scores?.map((score) => (
                <Box key={score.criteriaId} mb={2} p={2} bgcolor="#fafafa" borderRadius={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box>
                      <Typography fontWeight={600}>{score.criteriaName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Trọng số: {(score.weight * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {score.scoreValue?.toFixed(1)}
                      </Typography>
                      <Rating value={score.scoreValue} precision={0.5} readOnly size="small" />
                    </Stack>
                  </Stack>
                  <ScoreProgress score={score.scoreValue} />
                </Box>
              ))}

              {/* Comment */}
              {selectedReview.comment && (
                <Box mt={3}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    💬 Nhận xét của người đánh giá:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: "#e3f2fd", borderLeft: "4px solid #1976d2" }}>
                    <Typography variant="body2" fontStyle="italic">
                      "{selectedReview.comment}"
                    </Typography>
                  </Paper>
                </Box>
              )}

              {/* Meta Info */}
              <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Mã nhân viên</Typography>
                    <Typography fontWeight="bold">{selectedReview.empId}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Phòng ban</Typography>
                    <Typography fontWeight="bold">{selectedReview.deptName}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Mã phòng ban</Typography>
                    <Typography fontWeight="bold">{selectedReview.deptId}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Xếp loại</Typography>
                    <Typography fontWeight="bold" color={RATING_CONFIG[selectedReview.finalRating]?.color || "#000"}>
                      {selectedReview.finalRating} - {RATING_CONFIG[selectedReview.finalRating]?.label || "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">Không có dữ liệu</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenReviewDetailDialog(false)} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DIALOG: My KPI Detail */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Dialog open={openMyKpiDetail} onClose={() => setOpenMyKpiDetail(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Chi Tiết Đánh Giá - {selectedMyKpi?.periodName}
        </DialogTitle>
        <DialogContent dividers>
          {selectedMyKpi && (
            <Box>
              <Box textAlign="center" mb={3}>
                <RatingChip rating={selectedMyKpi.rating || "C"} />
                <Typography variant="h3" fontWeight="bold" color="primary" mt={2}>
                  {selectedMyKpi.finalScore?.toFixed(2)}/5.00
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {selectedMyKpi.scores?.map((score) => (
                <Box key={score.criteriaId} mb={2}>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography fontWeight={500}>{score.criteriaName}</Typography>
                    <Chip label={`${(score.weight * 100).toFixed(0)}%`} size="small" variant="outlined" />
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box flexGrow={1}>
                      <ScoreProgress score={score.scoreValue} />
                    </Box>
                    <Rating value={score.scoreValue} precision={0.5} readOnly size="small" />
                  </Stack>
                </Box>
              ))}

              {selectedMyKpi.comment && (
                <Box mt={3}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>💬 Nhận xét:</Typography>
                  <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                    <Typography variant="body2" fontStyle="italic">"{selectedMyKpi.comment}"</Typography>
                  </Paper>
                </Box>
              )}

              <Box mt={3} p={2} bgcolor="#e3f2fd" borderRadius={1}>
                <Typography variant="caption" color="text.secondary">
                  👤 Người đánh giá: <strong>{selectedMyKpi.recordedByName}</strong>
                </Typography>
                <br />
                <Typography variant="caption" color="text.secondary">
                  📆 Ngày đánh giá: <strong>{formatDate(selectedMyKpi.createdAt)}</strong>
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMyKpiDetail(false)} variant="contained">Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* SNACKBAR */}
      {/* ═══════════════════════════════════════════════════════ */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
const KpiReviewPage = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();

  if (authLoading || !isAuthenticated || !user) {
    return <LoadingScreen message="Đang tải thông tin người dùng..." />;
  }

  return <KpiReviewContent user={user} />;
};

export default KpiReviewPage;