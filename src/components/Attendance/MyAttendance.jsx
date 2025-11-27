// src/components/MyAttendance.jsx
import React, { useState, useEffect } from "react";
import AttendanceCalendar from "./AttendanceCalendar";
import { Box, Button, Stack, Typography, Paper, CircularProgress } from "@mui/material";
import moment from "moment";
import { attendanceService } from "../../services/attendanceService";

// ----- Helper: format attendance thành event -----
const formatAttendanceToEvent = (item) => {
  const dayMoment = moment(item.createdAt, "DD/MM/YYYY HH:mm:ss").startOf("day");
  const checkIn = item.checkIn 
    ? moment(item.checkIn, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss") 
    : "--:--";
  const checkOut = item.checkOut 
    ? moment(item.checkOut, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss") 
    : "--:--";

  return {
    id: item.id,
    title: `Đi làm \n In: ${checkIn} / Out: ${checkOut}`, // thêm giờ vào title
    start: dayMoment.toDate(),
    end: moment(dayMoment).add(1, "minute").toDate(),
    actualCheckIn: item.checkIn ? moment(`${item.createdAt.split(" ")[0]} ${item.checkIn}`, "DD/MM/YYYY HH:mm:ss").toDate() : null,
    actualCheckOut: item.checkOut ? moment(`${item.createdAt.split(" ")[0]} ${item.checkOut}`, "DD/MM/YYYY HH:mm:ss").toDate() : null,
    bgColor: item.checkIn ? "#4CAF50" : "#F44336",
  };
};

// ----- EventItem custom để hiển thị giờ -----
const EventItem = ({ event }) => {
  const e = event.event; 

  const actualIn = e.actualCheckIn ? moment(e.actualCheckIn).format("HH:mm:ss") : null;
  const actualOut = e.actualCheckOut ? moment(e.actualCheckOut).format("HH:mm:ss") : null;

  return (
    <Box sx={{ p: 0.5 }}>
      <strong>{e.title}</strong>
      {actualIn && <div>Check-in: {actualIn}</div>}
      {actualOut && <div>Check-out: {actualOut}</div>}
    </Box>
  );
};

// ================= MAIN COMPONENT =====================
export default function MyAttendance() {
  const [date, setDate] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState(null);

  const [loading, setLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkOutLoading, setCheckOutLoading] = useState(false);
  const [error, setError] = useState(null);

  // -------- Load attendance từ server -------------
  const loadMyAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await attendanceService.getMyRecords();
      const records = res?.data?.data ?? [];
      setAttendance(records);
    } catch (err) {
      console.error(err);
      setError("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyAttendance();
  }, []);

  // -------- Sync events + attendanceToday -------------
  useEffect(() => {
    const formattedEvents = attendance.map(formatAttendanceToEvent);
    setEvents(formattedEvents);

    const today = attendance.find((r) =>
      moment(r.createdAt, "DD/MM/YYYY HH:mm:ss").startOf("day").isSame(moment().startOf("day"))
    ) || null;
    setAttendanceToday(today);
  }, [attendance]);

  // ================== CHECK IN ========================
  const handleCheckIn = async () => {
    if (checkInLoading) return;

    setCheckInLoading(true);
    setError(null);

    try {
      const res = await attendanceService.checkIn();
      const record = res?.data?.data;

      if (record) {
        setAttendanceToday(record);
        setAttendance((prev) => {
          const exists = prev.some((r) => r.id === record.id);
          if (!exists) return [...prev, record];
          return prev.map((r) => (r.id === record.id ? record : r));
        });
      }
    } catch (err) {
      console.error(err);
      setError("Check-in thất bại");
    } finally {
      setCheckInLoading(false);
    }
  };

  // ================== CHECK OUT =======================
  const handleCheckOut = async () => {
    if (checkOutLoading) return;

    setCheckOutLoading(true);
    setError(null);

    try {
      const res = await attendanceService.checkOut();
      const record = res?.data?.data;

      if (record) {
        setAttendanceToday(record);
        setAttendance((prev) =>
          prev.map((r) => (r.id === record.id ? record : r))
        );
      }
    } catch (err) {
      console.error(err);
      setError("Check-out thất bại");
    } finally {
      setCheckOutLoading(false);
    }
  };

  // ---------------- Event style -----------------------
  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.bgColor,
      borderRadius: "8px",
      padding: "6px",
      color: "#000",
      border: "1px solid #ddd",
      fontSize: 12,
    },
  });

  // ================= UI ==============================
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Chấm công của tôi
      </Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckIn}
          disabled={!!attendanceToday?.checkIn || checkInLoading}
        >
          {checkInLoading ? <CircularProgress size={20} color="inherit" /> : "Check In"}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleCheckOut}
          disabled={!attendanceToday?.checkIn || !!attendanceToday?.checkOut || checkOutLoading}
        >
          {checkOutLoading ? <CircularProgress size={20} color="inherit" /> : "Check Out"}
        </Button>

        {loading && <CircularProgress size={20} />}
      </Stack>

      {error && <Typography color="error">{error}</Typography>}

      <AttendanceCalendar
        events={events}
        date={date}
        setDate={setDate}
        views={["month"]}
        eventStyleGetter={eventStyleGetter}
        components={{ event: EventItem }} // hiển thị title + giờ
      />
    </Paper>
  );
}
