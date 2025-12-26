// src/pages/KpiReviewPage.jsx
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
  LinearProgress,
  Rating,
  Slider,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
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
  ArrowBack as ArrowBackIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Radar as RadarIcon,
} from "@mui/icons-material";

// ═══════════════════════════════════════════════════════════════
// RECHARTS IMPORTS
// ═══════════════════════════════════════════════════════════════
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
  F: { color: "#9e9e9e", bg: "#f5f5f5", label: "Kém" },
};

const CHART_COLORS = ["#4caf50", "#8bc34a", "#ff9800", "#ff5722", "#f44336"];
const PIE_COLORS = {
  A: "#4caf50",
  B: "#8bc34a",
  C: "#ff9800",
  D: "#ff5722",
  E: "#f44336",
  F: "#9e9e9e",
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
// RADAR CHART COMPONENT
// ═══════════════════════════════════════════════════════════════
const EmployeeRadarChart = ({ scores }) => {
  if (!scores || scores.length === 0) return null;

  const data = scores.map((score) => ({
    criteria: score.criteriaName?.length > 15
      ? score.criteriaName.substring(0, 15) + "..."
      : score.criteriaName,
    fullName: score.criteriaName,
    score: score.scoreValue || 0,
    fullMark: 5,
  }));

  return (
    <Box sx={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis
            dataKey="criteria"
            tick={{ fill: "#666", fontSize: 11 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fill: "#999", fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Điểm đánh giá"
            dataKey="score"
            stroke="#1976d2"
            fill="#1976d2"
            fillOpacity={0.5}
            strokeWidth={2}
          />
          <RechartsTooltip
            formatter={(value, name, props) => [
              `${value.toFixed(1)}/5.0`,
              props.payload.fullName
            ]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════
// PERIOD OVERVIEW CHARTS
// ═══════════════════════════════════════════════════════════════
const RatingDistributionPieChart = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  const distribution = reviews.reduce((acc, r) => {
    const rating = r.finalRating || "C";
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(distribution)
    .map(([rating, count]) => ({
      name: `${rating} - ${RATING_CONFIG[rating]?.label || "N/A"}`,
      value: count,
      rating,
    }))
    .sort((a, b) => a.rating.localeCompare(b.rating));

  return (
    <Box sx={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.rating] || CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip
            formatter={(value, name) => [`${value} nhân viên`, name]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const EmployeeScoresBarChart = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  const data = reviews
    .map((r) => ({
      name: r.empName?.length > 12 ? r.empName.substring(0, 12) + "..." : r.empName,
      fullName: r.empName,
      score: r.averageScore || 0,
      rating: r.finalRating || "C",
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <Box sx={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" domain={[0, 5]} tickCount={6} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
          <RechartsTooltip
            formatter={(value, name, props) => [
              `${value.toFixed(2)}/5.00 (${props.payload.rating})`,
              props.payload.fullName
            ]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
            }}
          />
          <Bar
            dataKey="score"
            fill="#1976d2"
            radius={[0, 4, 4, 0]}
            label={{ position: "right", fontSize: 11, formatter: (val) => val.toFixed(2) }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.rating] || "#1976d2"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const CriteriaAverageRadarChart = ({ reviews, criteria }) => {
  if (!reviews || reviews.length === 0 || !criteria || criteria.length === 0) return null;

  const criteriaScores = criteria.map((c) => {
    let totalScore = 0;
    let count = 0;

    reviews.forEach((review) => {
      const score = review.scores?.find((s) => s.criteriaId === c.id);
      if (score) {
        totalScore += score.scoreValue || 0;
        count++;
      }
    });

    return {
      criteria: c.name?.length > 15 ? c.name.substring(0, 15) + "..." : c.name,
      fullName: c.name,
      avgScore: count > 0 ? totalScore / count : 0,
      fullMark: 5,
    };
  });

  return (
    <Box sx={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={criteriaScores}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis
            dataKey="criteria"
            tick={{ fill: "#666", fontSize: 11 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 5]}
            tick={{ fill: "#999", fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Điểm TB theo tiêu chí"
            dataKey="avgScore"
            stroke="#9c27b0"
            fill="#9c27b0"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <RechartsTooltip
            formatter={(value, name, props) => [
              `${value.toFixed(2)}/5.00`,
              props.payload.fullName
            ]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: 8,
            }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </Box>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN CONTENT COMPONENT
// ═══════════════════════════════════════════════════════════════
const KpiReviewContent = ({ user }) => {
  // ─────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [loadingEmployee, setLoadingEmployee] = useState(true);
  const [employeeError, setEmployeeError] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [selectedPeriodForDetail, setSelectedPeriodForDetail] = useState(null);
  const [periodDetailTab, setPeriodDetailTab] = useState(0);
  const [periods, setPeriods] = useState([]);
  const [periodsLoading, setPeriodsLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [periodsPagination, setPeriodsPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [myKpi, setMyKpi] = useState([]);
  const [myKpiLoading, setMyKpiLoading] = useState(false);
  const [selectedPeriodId, setSelectedPeriodId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [unreviewedEmployees, setUnreviewedEmployees] = useState([]);
  const [unreviewedLoading, setUnreviewedLoading] = useState(false);
  const [periodDetailReviews, setPeriodDetailReviews] = useState([]);
  const [periodDetailLoading, setPeriodDetailLoading] = useState(false);
  const [openPeriodDialog, setOpenPeriodDialog] = useState(false);
  const [periodForm, setPeriodForm] = useState({ id: null, periodName: "", startDate: "", endDate: "" });
  const [periodFormError, setPeriodFormError] = useState("");
  const [savingPeriod, setSavingPeriod] = useState(false);
  const [openDeletePeriodDialog, setOpenDeletePeriodDialog] = useState(false);
  const [deletingPeriod, setDeletingPeriod] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewForm, setReviewForm] = useState({ empId: null, empName: "", scores: [], comment: "" });
  const [openReviewDetailDialog, setOpenReviewDetailDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loadingReviewDetail, setLoadingReviewDetail] = useState(false);
  const [openMyKpiDetail, setOpenMyKpiDetail] = useState(false);
  const [selectedMyKpi, setSelectedMyKpi] = useState(null);
  const [reviewDetailTab, setReviewDetailTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // ─────────────────────────────────────────────────────────────
  // COMPUTED
  // ─────────────────────────────────────────────────────────────
  const isAdmin = useMemo(() => {
    return user?.role === "ADMIN" || user?.role === "HR" || user?.roles?.includes("ADMIN") || user?.roles?.includes("HR");
  }, [user]);

  const isHead = useMemo(() => employeeInfo?.roleInDept === "HEAD", [employeeInfo]);
  const isEmployee = useMemo(() => !isAdmin && !isHead, [isAdmin, isHead]);

  const canManagePeriods = isAdmin;
  const canViewPeriods = isAdmin || isHead;
  const canReviewEmployees = isHead || isAdmin;

  // ─────────────────────────────────────────────────────────────
  // FETCH FUNCTIONS
  // ─────────────────────────────────────────────────────────────
  const fetchEmployeeInfo = useCallback(async () => {
    setLoadingEmployee(true);
    setEmployeeError("");

    try {
      const empRes = await axiosInstance.get("/employees/me");
      const empData = empRes.data?.data;
      setEmployeeInfo(empData);

      if (empData?.roleInDept === "HEAD" && empData?.department) {
        const deptName = empData.department;
        try {
          const deptRes = await axiosInstance.get("/departments");
          const deptList = deptRes.data?.data || [];
          const foundDept = deptList.find(d => d.deptName?.trim() === deptName?.trim());
          if (foundDept) {
            setDepartmentId(foundDept.id);
          }
        } catch (deptErr) {
          console.error("❌ Fetch departments failed:", deptErr);
        }
      }

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

  const fetchPeriodDetailReviews = useCallback(async (periodId) => {
    setPeriodDetailLoading(true);
    try {
      const res = await axiosInstance.get(`/review/periods/${periodId}/reviews`);
      const allReviews = res.data?.data || [];

      const filteredReviews = (isHead && !isAdmin && departmentId)
        ? allReviews.filter(r => r.deptId === departmentId)
        : allReviews;

      setPeriodDetailReviews(filteredReviews);
    } catch (err) {
      console.error("Fetch period detail reviews error:", err);
      setSnackbar({ open: true, message: "Lỗi tải danh sách đánh giá", severity: "error" });
    } finally {
      setPeriodDetailLoading(false);
    }
  }, [isHead, isAdmin, departmentId]);

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

  const fetchReviews = useCallback(async () => {
    if (!selectedPeriodId) return;
    setReviewsLoading(true);
    try {
      const res = await axiosInstance.get(`/review/periods/${selectedPeriodId}/reviews`);
      const allReviews = res.data?.data || [];

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

  const fetchEmployees = useCallback(async () => {
    if (!departmentId) {
      console.warn("⚠️ No departmentId, skipping fetchEmployees");
      return;
    }

    console.log("🔍 Fetching employees for department:", departmentId); // ← DEBUG
    setEmployeesLoading(true);

    try {
      const res = await axiosInstance.get(`/employees/department/${departmentId}`);
      const empList = res.data?.data || [];

      console.log("✅ Employees loaded:", empList.length, empList); // ← DEBUG

      setEmployees(empList);
    } catch (err) {
      console.error("❌ Fetch employees error:", err);
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  }, [departmentId]);

  const fetchUnreviewedEmployees = useCallback(async (periodId) => {
    const pId = parseInt(periodId, 10);
    const dId = parseInt(departmentId, 10);

    if (!dId || !pId) {
      console.warn("⚠️ Invalid departmentId or periodId, skipping fetchUnreviewedEmployees", { dId, pId });
      setUnreviewedEmployees([]);
      return;
    }

    setUnreviewedLoading(true);
    try {
      const res = await axiosInstance.get('/employees/without-kpi', {
        params: {
          kpiPeriodId: pId,
          deptId: dId,
        },
      });
      setUnreviewedEmployees(res.data?.data || []);
    } catch (err) {
      setUnreviewedEmployees([]);
      console.error("❌ Fetch unreviewed employees error:", err);
      setSnackbar({ open: true, message: "Lỗi tải danh sách nhân viên chưa đánh giá", severity: "error" });
    } finally {
      setUnreviewedLoading(false);
    }
  }, [departmentId]);

  const fetchReviewDetail = useCallback(async (periodId, reviewId) => {
    setLoadingReviewDetail(true);
    try {
      const res = await axiosInstance.get(`/review/periods/${periodId}/reviews/${reviewId}`);
      setSelectedReview(res.data?.data);
      setReviewDetailTab(0);
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
  // HANDLERS
  // ─────────────────────────────────────────────────────────────
  const handleViewPeriodDetail = (period) => {
    setSelectedPeriodForDetail(period);
    setViewMode("periodDetail");
    setPeriodDetailTab(0);
    fetchUnreviewedEmployees(period.id);
    fetchPeriodDetailReviews(period.id);

    // ✅ THÊM: Fetch employees nếu chưa có
    // if (isHead && departmentId && employees.length === 0) {
    //   console.log("🔄 Fetching employees for period detail...");
    //   fetchEmployees();
    // }
  };

  const handleBackToPeriodsList = () => {
    setViewMode("list");
    setSelectedPeriodForDetail(null);
    setPeriodDetailReviews([]);
  };

  const handleOpenReviewDetail = (review, periodId = null) => {
    const targetPeriodId = periodId || selectedPeriodId || selectedPeriodForDetail?.id;
    if (targetPeriodId && review.id) {
      fetchReviewDetail(targetPeriodId, review.id);
    } else {
      setSelectedReview(review);
      setReviewDetailTab(0);
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
      if (isEmployee) {
        fetchMyKpi();
      } else if (canViewPeriods) {
        fetchPeriods();
        fetchMyKpi();
      }
    }
  }, [loadingEmployee, isEmployee, canViewPeriods, fetchMyKpi, fetchPeriods]);

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
      setPeriodForm({
        id: period.id,
        periodName: period.periodName,
        startDate: formatDateForInput(period.startDate),
        endDate: formatDateForInput(period.endDate),
      });
    } else {
      setPeriodForm({ id: null, periodName: "", startDate: "", endDate: "" });
    }
    setPeriodFormError("");
    setOpenPeriodDialog(true);
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return dateStr.split("T")[0];
  };

  const formatDateForApi = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSavePeriod = async () => {
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
        await axiosInstance.put(`/review/periods/${periodForm.id}`, payload);
        setSnackbar({ open: true, message: "Cập nhật kỳ đánh giá thành công!", severity: "success" });
      } else {
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
    return reviewForm.scores.reduce((sum, s) => sum + (Number(s.scoreValue || 0) * s.weight), 0);
  };

  const handleSubmitReview = async () => {
    const targetPeriodId = selectedPeriodForDetail?.id || selectedPeriodId;

    if (!targetPeriodId) {
      setSnackbar({ open: true, message: "Vui lòng chọn kỳ đánh giá", severity: "warning" });
      return;
    }

    try {
      // API chuẩn: không gửi kpiPeriodId trong body vì đã có trong URL
      await axiosInstance.post(`/review/periods/${targetPeriodId}/reviews`, {
        empId: reviewForm.empId,
        scores: reviewForm.scores.map(s => ({
          criteriaId: s.criteriaId,
          scoreValue: Number(s.scoreValue),
        })),
        comment: reviewForm.comment.trim(),
      });

      setSnackbar({ open: true, message: "Đánh giá thành công!", severity: "success" });
      setOpenReviewDialog(false);

      // Reload data
      if (selectedPeriodForDetail) {
        fetchPeriodDetailReviews(selectedPeriodForDetail.id);
      }
      if (selectedPeriodId) {
        fetchReviews();
      }
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

  // ─────────────────────────────────────────────────────────────em
  // COMPUTED: Stats
  // ─────────────────────────────────────────────────────────────
  const myKpiStats = useMemo(() => {
    if (myKpi.length === 0) return null;
    const avgScore = myKpi.reduce((sum, k) => sum + (k.finalScore || 0), 0) / myKpi.length;
    const latestReview = myKpi[0];
    const bestScore = Math.max(...myKpi.map(k => k.finalScore || 0));
    return { avgScore, latestReview, totalReviews: myKpi.length, bestScore };
  }, [myKpi]);

  const periodDetailStats = useMemo(() => {
    if (!selectedPeriodForDetail) return null;

    if (periodDetailReviews.length === 0) {
      if (isHead && !isAdmin) {
        return {
          totalEmployees: employees.length,
          reviewed: 0,
          pending: employees.length,
          avgScore: 0,
          maxScore: 0,
          minScore: 0,
          ratingDistribution: {},
        };
      }
      return {
        totalReviews: 0,
        avgScore: 0,
        maxScore: 0,
        minScore: 0,
        ratingDistribution: {},
      };
    }

    const totalReviews = periodDetailReviews.length;
    const avgScore = periodDetailReviews.reduce((sum, r) => sum + (r.averageScore || 0), 0) / totalReviews;

    const ratingDistribution = periodDetailReviews.reduce((acc, r) => {
      const rating = r.finalRating || "C";
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {});

    const scores = periodDetailReviews.map(r => r.averageScore || 0);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    if (isHead && !isAdmin) {
      const reviewedEmpIds = periodDetailReviews.map(r => r.empId);
      const totalEmployees = employees.length;
      const reviewedCount = employees.filter(e => reviewedEmpIds.includes(e.id)).length;
      const pendingCount = totalEmployees - reviewedCount;

      return {
        totalEmployees,
        reviewed: reviewedCount,
        pending: pendingCount,
        avgScore,
        maxScore,
        minScore,
        ratingDistribution,
      };
    }

    return {
      totalReviews,
      avgScore,
      maxScore,
      minScore,
      ratingDistribution,
    };
  }, [periodDetailReviews, employees, selectedPeriodForDetail, isHead, isAdmin]);

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
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            <AssessmentIcon sx={{ mr: 1, verticalAlign: "middle", fontSize: 35 }} />
            Đánh Giá KPI
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Xin chào <strong>{employeeInfo?.fullName}</strong>
          </Typography>
        </Box>
      </Box>

      {/* Criteria Info */}
      <Box mb={4} mt={4}>
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

      {/* ═══════════════════════════════════════════════════════ */}
      {/* EMPLOYEE VIEW */}
      {/* ═══════════════════════════════════════════════════════ */}
      {isEmployee && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              Kết Quả Đánh Giá KPI Của Tôi
            </Typography>
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
              {myKpiStats && (
                <Grid container spacing={3} mb={4}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3} sx={{ borderLeft: "5px solid #1976d2" }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">Điểm trung bình</Typography>
                        <Typography variant="h4" fontWeight="bold" color="primary">
                          {myKpiStats.avgScore.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3} sx={{ borderLeft: "5px solid #4caf50" }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">Điểm cao nhất</Typography>
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          {myKpiStats.bestScore.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3} sx={{ borderLeft: "5px solid #ff9800" }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">Xếp loại gần nhất</Typography>
                        <Box mt={1.5}>
                          <RatingChip rating={myKpiStats.latestReview?.rating || "C"} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card elevation={3} sx={{ borderLeft: "5px solid #9c27b0" }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">Số lần đánh giá</Typography>
                        <Typography variant="h4" fontWeight="bold" color="secondary">
                          {myKpiStats.totalReviews}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              <Typography variant="h6" fontWeight="bold" gutterBottom>
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
      {/* HEAD/ADMIN VIEW */}
      {/* ═══════════════════════════════════════════════════════ */}
      {canViewPeriods && (
        <>
          {/* VIEW MODE: PERIODS LIST */}
          {viewMode === "list" && (
            <Box mb={6}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">
                  <DateRangeIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Danh Sách Kỳ Đánh Giá
                </Typography>
                {canManagePeriods && (
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenPeriodDialog()}>
                    Tạo kỳ mới
                  </Button>
                )}
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
                                    <Tooltip title="Xem danh sách đánh giá">
                                      <IconButton size="small" color="info" onClick={() => handleViewPeriodDetail(period)}>
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
            </Box>
          )}

          {/* ═══════════════════════════════════════════════════════ */}
          {/* VIEW MODE: PERIOD DETAIL */}
          {/* ═══════════════════════════════════════════════════════ */}
          {viewMode === "periodDetail" && selectedPeriodForDetail && (
            <Box>
              {/* Header */}
              <Box mb={3}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBackToPeriodsList}
                  sx={{ mb: 2 }}
                >
                  Quay lại danh sách kỳ đánh giá
                </Button>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        📅 {selectedPeriodForDetail.periodName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {formatDate(selectedPeriodForDetail.startDate)} - {formatDate(selectedPeriodForDetail.endDate)}
                      </Typography>
                    </Box>
                    <Chip
                      label={getPeriodStatus(selectedPeriodForDetail).label}
                      color={getPeriodStatus(selectedPeriodForDetail).color}
                      icon={getPeriodStatus(selectedPeriodForDetail).icon}
                    />
                  </Stack>
                </Paper>
              </Box>

              {/* Stats Cards */}
              {periodDetailStats && (
                <Grid container spacing={2} mb={3}>
                  {isHead && !isAdmin ? (
                    <>
                      <Grid item xs={6} sm={3}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: "center", py: 2 }}>
                            <GroupsIcon sx={{ fontSize: 30, color: "primary.main", mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" color="primary">
                              {periodDetailStats.totalEmployees}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Tổng NV phòng
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: "center", py: 2 }}>
                            <CheckCircleIcon sx={{ fontSize: 30, color: "success.main", mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" color="success.main">
                              {periodDetailStats.reviewed}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Đã đánh giá
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: "center", py: 2 }}>
                            <WarningIcon sx={{ fontSize: 30, color: "warning.main", mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" color="warning.main">
                              {periodDetailStats.pending}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Chưa đánh giá
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: "center", py: 2 }}>
                            <TrendingUpIcon sx={{ fontSize: 30, color: "info.main", mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" color="info.main">
                              {periodDetailStats.avgScore.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Điểm TB phòng
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={6} sm={3}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: "center", py: 2 }}>
                            <RateReviewIcon sx={{ fontSize: 30, color: "primary.main", mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" color="primary">
                              {periodDetailStats.totalReviews}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Tổng đánh giá
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: "center", py: 2 }}>
                            <TrendingUpIcon sx={{ fontSize: 30, color: "info.main", mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" color="info.main">
                              {periodDetailStats.avgScore.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Điểm trung bình
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: "center", py: 2 }}>
                            <StarIcon sx={{ fontSize: 30, color: "success.main", mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" color="success.main">
                              {periodDetailStats.maxScore.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Điểm cao nhất
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Card variant="outlined">
                          <CardContent sx={{ textAlign: "center", py: 2 }}>
                            <WarningIcon sx={{ fontSize: 30, color: "warning.main", mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold" color="warning.main">
                              {periodDetailStats.minScore.toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Điểm thấp nhất
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </>
                  )}
                </Grid>
              )}

              {/* Tabs: Danh sách / Biểu đồ */}
              <Paper elevation={3} sx={{ mb: 3 }}>
                <Tabs
                  value={periodDetailTab}
                  onChange={(_, v) => setPeriodDetailTab(v)}
                  variant="fullWidth"
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                  <Tab
                    icon={<RateReviewIcon />}
                    iconPosition="start"
                    label="Danh Sách Nhân Viên"
                  />
                  <Tab
                    icon={<BarChartIcon />}
                    iconPosition="start"
                    label="Biểu Đồ Tổng Hợp"
                  />
                </Tabs>

                {/* TAB 0: DANH SÁCH NHÂN VIÊN (ĐÃ & CHƯA ĐÁNH GIÁ) */}
                {periodDetailTab === 0 && (
                  <Box p={3}>
                    {periodDetailLoading ? (
                      <Box textAlign="center" py={6}>
                        <CircularProgress />
                        <Typography mt={2}>Đang tải...</Typography>
                      </Box>
                    ) : (
                      <Grid container spacing={3}>
                        {/* CỘT TRÁI: CHƯA ĐÁNH GIÁ */}
                        <Grid item xs={12} md={6}>
                          <Paper elevation={3} sx={{ height: "100%" }}>
                            <Box sx={{ p: 2, bgcolor: "warning.light", color: "warning.contrastText" }}>
                              <Typography variant="h6" fontWeight="bold">
                                ⏳ Chưa đánh giá ({unreviewedEmployees.length})
                              </Typography>
                            </Box>
                            <Box sx={{ maxHeight: 600, overflowY: "auto", position: "relative" }}>
                              {unreviewedLoading ? (
                                <Box textAlign="center" py={6}>
                                  <CircularProgress />
                                  <Typography mt={2} color="text.secondary">Đang tải danh sách...</Typography>
                                </Box>
                              ) : (
                                unreviewedEmployees.length === 0 ? (
                                <Box textAlign="center" py={6}>
                                  <CheckCircleIcon sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
                                  <Typography color="text.secondary">
                                    Tất cả nhân viên đã được đánh giá!
                                  </Typography>
                                </Box>
                              ) : (
                                unreviewedEmployees.map((emp) => (
                                  <Box
                                    key={emp.id}
                                    sx={{
                                      p: 2,
                                      borderBottom: "1px solid #e0e0e0",
                                      cursor: "pointer",
                                      "&:hover": { bgcolor: "#fff3e0" },
                                    }}
                                    onClick={() => handleOpenReviewDialog(emp)}
                                  >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                      <Avatar sx={{ bgcolor: "warning.main" }}>
                                        {emp.fullName?.[0]?.toUpperCase()}
                                      </Avatar>
                                      <Box flexGrow={1}>
                                        <Typography fontWeight="bold">{emp.fullName}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Vai trò: {emp.roleInDept || "N/A"}
                                        </Typography>
                                      </Box>
                                      <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<RateReviewIcon />}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenReviewDialog(emp);
                                        }}
                                      >
                                        Đánh giá
                                      </Button>
                                    </Stack>
                                  </Box>
                                ))
                              ))}
                            </Box>
                          </Paper>
                        </Grid>

                        {/* CỘT PHẢI: ĐÃ ĐÁNH GIÁ */}
                        <Grid item xs={12} md={6}>
                          <Paper elevation={3} sx={{ height: "100%" }}>
                            <Box sx={{ p: 2, bgcolor: "success.light", color: "success.contrastText" }}>
                              <Typography variant="h6" fontWeight="bold">
                                ✅ Đã đánh giá ({periodDetailReviews.length})
                              </Typography>
                            </Box>
                            <Box sx={{ maxHeight: 600, overflowY: "auto" }}>
                              {periodDetailReviews.length === 0 ? (
                                <Box textAlign="center" py={6}>
                                  <WarningIcon sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
                                  <Typography color="text.secondary">
                                    Chưa có nhân viên nào được đánh giá
                                  </Typography>
                                </Box>
                              ) : (
                                periodDetailReviews.map((review) => (
                                  <Box
                                    key={review.id}
                                    sx={{
                                      p: 2,
                                      borderBottom: "1px solid #e0e0e0",
                                      cursor: "pointer",
                                      "&:hover": { bgcolor: "#e8f5e9" },
                                    }}
                                    onClick={() => handleOpenReviewDetail(review, selectedPeriodForDetail.id)}
                                  >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                      <Avatar sx={{ bgcolor: "success.main" }}>
                                        {review.empName?.[0]?.toUpperCase()}
                                      </Avatar>
                                      <Box flexGrow={1}>
                                        <Typography fontWeight="bold">{review.empName}</Typography>
                                        <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
                                          <Box flexGrow={1} sx={{ maxWidth: 150 }}>
                                            <ScoreProgress score={review.averageScore || 0} showLabel={false} />
                                          </Box>
                                          <Typography variant="caption" fontWeight="bold">
                                            {(review.averageScore || 0).toFixed(2)}
                                          </Typography>
                                        </Stack>
                                      </Box>
                                      <RatingChip rating={review.finalRating || "C"} />
                                      <Tooltip title="Xem chi tiết">
                                        <IconButton
                                          color="info"
                                          size="small"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenReviewDetail(review, selectedPeriodForDetail.id);
                                          }}
                                        >
                                          <VisibilityIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </Stack>
                                  </Box>
                                ))
                              )}
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                )}

                {/* TAB 1: BIỂU ĐỒ TỔNG HỢP */}
                {periodDetailTab === 1 && (
                  <Box p={3}>
                    {periodDetailLoading ? (
                      <Box textAlign="center" py={6}>
                        <CircularProgress />
                        <Typography mt={2}>Đang tải...</Typography>
                      </Box>
                    ) : periodDetailReviews.length === 0 ? (
                      <Box textAlign="center" py={8}>
                        <BarChartIcon sx={{ fontSize: 80, color: "#ccc", mb: 2 }} />
                        <Typography color="text.secondary">Chưa có dữ liệu để hiển thị biểu đồ</Typography>
                      </Box>
                    ) : (
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                              <PieChartIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                              Phân Bố Xếp Loại
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <RatingDistributionPieChart reviews={periodDetailReviews} />
                          </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                              <RadarIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                              Điểm TB Theo Tiêu Chí
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <CriteriaAverageRadarChart reviews={periodDetailReviews} criteria={criteria} />
                          </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                              <BarChartIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                              Top Nhân Viên
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <EmployeeScoresBarChart reviews={periodDetailReviews} />
                          </Paper>
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* DIALOGS */}
      {/* ═══════════════════════════════════════════════════════ */}

      {/* DIALOG: Create/Edit Period */}
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Ngày bắt đầu"
                InputLabelProps={{ shrink: true }}
                value={periodForm.startDate}
                onChange={(e) => setPeriodForm({ ...periodForm, startDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
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

      {/* DIALOG: Delete Period Confirmation */}
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

      {/* DIALOG: Submit Review */}
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
                    <TextField
                      label="Điểm"
                      type="number"
                      size="small"
                      value={score.scoreValue}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (parseFloat(val) > 5) val = 5;
                        if (parseFloat(val) < 0) val = 0;
                        handleScoreChange(score.criteriaId, val);
                      }}
                      inputProps={{ min: 0, max: 5, step: 0.1 }}
                      sx={{ width: 100 }}
                    />
                    <Rating
                      value={Number(score.scoreValue)}
                      precision={0.5}
                      onChange={(_, v) => handleScoreChange(score.criteriaId, v)}
                    />
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

      {/* DIALOG: REVIEW DETAIL */}
      <Dialog
        open={openReviewDetailDialog}
        onClose={() => setOpenReviewDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <VisibilityIcon />
            <Typography variant="h6" fontWeight="bold">
              Chi Tiết Đánh Giá Nhân Viên
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {loadingReviewDetail ? (
            <Box textAlign="center" py={6}>
              <CircularProgress />
              <Typography mt={2} color="text.secondary">Đang tải chi tiết...</Typography>
            </Box>
          ) : selectedReview ? (
            <Box>
              <Box sx={{ p: 3, bgcolor: "#f5f5f5" }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 64, height: 64, bgcolor: "primary.main", fontSize: "1.8rem" }}>
                    {selectedReview.empName?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant="h5" fontWeight="bold">{selectedReview.empName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedReview.deptName} | Mã NV: {selectedReview.empId}
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {selectedReview.averageScore?.toFixed(2) || "0.00"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">/5.00</Typography>
                  </Box>
                  <RatingChip rating={selectedReview.finalRating || "C"} />
                </Stack>
              </Box>

              <Tabs
                value={reviewDetailTab}
                onChange={(_, v) => setReviewDetailTab(v)}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                <Tab icon={<RadarIcon />} iconPosition="start" label="Biểu Đồ Radar" />
                <Tab icon={<RateReviewIcon />} iconPosition="start" label="Chi Tiết Điểm" />
              </Tabs>

              {reviewDetailTab === 0 && (
                <Box p={3}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                    📊 Biểu Đồ Đánh Giá Theo Tiêu Chí
                  </Typography>
                  <EmployeeRadarChart scores={selectedReview.scores} />

                  <Box mt={2}>
                    <Grid container spacing={1} justifyContent="center">
                      {selectedReview.scores?.map((score) => (
                        <Grid item key={score.criteriaId}>
                          <Chip
                            label={`${score.criteriaName}: ${score.scoreValue?.toFixed(1)}`}
                            size="small"
                            variant="outlined"
                            sx={{
                              bgcolor: score.scoreValue >= 4 ? "#e8f5e9" :
                                score.scoreValue >= 3 ? "#fff3e0" : "#ffebee"
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              )}

              {reviewDetailTab === 1 && (
                <Box p={3}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    📋 Chi Tiết Từng Tiêu Chí
                  </Typography>

                  {selectedReview.scores?.map((score) => (
                    <Paper
                      key={score.criteriaId}
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 2,
                        borderLeft: `4px solid ${score.scoreValue >= 4 ? "#4caf50" :
                          score.scoreValue >= 3 ? "#ff9800" : "#f44336"
                          }`
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box>
                          <Typography fontWeight={600}>{score.criteriaName}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Trọng số: {(score.weight * 100).toFixed(0)}%
                          </Typography>
                        </Box>
                      </Stack>
                      <ScoreProgress score={score.scoreValue} />
                    </Paper>
                  ))}

                  {selectedReview.comment && (
                    <Box mt={3}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        💬 Nhận Xét Của Người Đánh Giá
                      </Typography>
                      <Paper sx={{ p: 2, bgcolor: "#e3f2fd", borderLeft: "4px solid #1976d2" }}>
                        <Typography variant="body1" fontStyle="italic">
                          "{selectedReview.comment}"
                        </Typography>
                      </Paper>
                    </Box>
                  )}

                  <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">Mã nhân viên</Typography>
                        <Typography fontWeight="bold">{selectedReview.empId}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">Phòng ban</Typography>
                        <Typography fontWeight="bold">{selectedReview.deptName}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">Xếp loại cuối</Typography>
                        <Typography fontWeight="bold" color={RATING_CONFIG[selectedReview.finalRating]?.color || "#000"}>
                          {selectedReview.finalRating} - {RATING_CONFIG[selectedReview.finalRating]?.label || "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary">Không có dữ liệu</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenReviewDetailDialog(false)} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: My KPI Detail */}
      <Dialog open={openMyKpiDetail} onClose={() => setOpenMyKpiDetail(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          Chi Tiết Đánh Giá - {selectedMyKpi?.periodName}
        </DialogTitle>
        <DialogContent dividers>
          {selectedMyKpi && (
            <Box>
              <Box textAlign="center" mb={3} p={2} bgcolor="#f5f5f5" borderRadius={2}>
                <RatingChip rating={selectedMyKpi.rating || "C"} />
                <Typography variant="h2" fontWeight="bold" color="primary" mt={2}>
                  {selectedMyKpi.finalScore?.toFixed(2)}/5.00
                </Typography>
              </Box>

              <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                📊 Biểu Đồ Đánh Giá
              </Typography>
              <EmployeeRadarChart scores={selectedMyKpi.scores} />

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📋 Chi Tiết Từng Tiêu Chí
              </Typography>
              {selectedMyKpi.scores?.map((score) => (
                <Box key={score.criteriaId} mb={2}>
                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography fontWeight={500}>{score.criteriaName}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box flexGrow={1}>
                      <ScoreProgress score={score.scoreValue} />
                    </Box>
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

      {/* Snackbar */}
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