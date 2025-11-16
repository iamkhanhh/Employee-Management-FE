import React, { useState, useEffect } from "react";
import AttendanceCalendar from "./AttendanceCalendar";
import { Box, Button, Stack, Typography, Paper } from "@mui/material";
import moment from "moment";

// --- Shift Schedule ---
const MORNING_SHIFT_START = { hour: 8, minute: 30 };
const MORNING_SHIFT_END = { hour: 12, minute: 0 };
const AFTERNOON_SHIFT_START = { hour: 13, minute: 30 };
const AFTERNOON_SHIFT_END = { hour: 18, minute: 0 };

const getTodayWithTime = (hour, minute) => {
  return moment().set({ hour, minute, second: 0, millisecond: 0 });
};

export default function MyAttendance() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [attendanceToday, setAttendanceToday] = useState(null);

  // Load today's attendance status on component mount
  useEffect(() => {
    const todayStart = moment().startOf("day");
    const todaysEvent = events.find(e => moment(e.start).isSame(todayStart, "day"));
    if (todaysEvent) {
      setAttendanceToday({
        actualCheckIn: todaysEvent.actualCheckIn,
        actualCheckOut: todaysEvent.actualCheckOut,
      });
    } else {
      setAttendanceToday(null);
    }
  }, [events, date]);

const handleCheckIn = () => {
  const actualCheckIn = moment();

  const morningStartTime = getTodayWithTime(MORNING_SHIFT_START.hour, MORNING_SHIFT_START.minute);
  const afternoonStartTime = getTodayWithTime(AFTERNOON_SHIFT_START.hour, AFTERNOON_SHIFT_START.minute);

  let lateMinutes = 0;
  let status = "present";
  let shiftType = "full"; // mặc định full ca
  let title = "Đúng giờ";

  // Xác định nửa ca (checkin sau 13:30 thì là nửa ca chiều)
  if (actualCheckIn.isAfter(afternoonStartTime)) {
    shiftType = "half";
    lateMinutes = 0;
    title = "Đi nửa ca chiều";
  } else if (actualCheckIn.isAfter(morningStartTime) && actualCheckIn.isBefore(getTodayWithTime(MORNING_SHIFT_END.hour, MORNING_SHIFT_END.minute))) {
    lateMinutes = actualCheckIn.diff(morningStartTime, "minutes");
    if (lateMinutes > 0) {
      status = "late";
      title = `Đi muộn ${lateMinutes} phút`;
    }
  }

  const todayStart = moment().startOf("day");
  const todayEnd = moment(todayStart).add(1, "minute");

  const newEvent = {
    title,
    start: todayStart.toDate(),
    end: todayEnd.toDate(),
    allDay: false,
    actualCheckIn: actualCheckIn.toDate(),
    actualCheckOut: null,
    checkIn: actualCheckIn.toDate(),
    checkOut: null,
    lateMinutes,
    earlyMinutes: 0,
    status,
    shiftType,
    bgColor: getEventColor(status, shiftType), // màu dựa vào trạng thái
    renderItem: (props) => <EventItem {...props} />,
  };

  setEvents((prev) => [...prev, newEvent]);
};

  const handleCheckOut = () => {
    const actualCheckOut = moment();
    const todayStart = moment().startOf("day");
    const afternoonEndTime = getTodayWithTime(AFTERNOON_SHIFT_END.hour, AFTERNOON_SHIFT_END.minute);

    const updatedEvents = events.map((e) => {
      if (moment(e.start).isSame(todayStart, "day")) {
        let earlyMinutes = 0;
        if (actualCheckOut.isBefore(afternoonEndTime)) {
          earlyMinutes = afternoonEndTime.diff(actualCheckOut, "minutes");
        }

        // cập nhật màu: nếu half ca đã check-out thì vẫn giữ tím, full ca -> đúng giờ hay muộn
        const newBgColor = e.shiftType === "half" ? "#c299ff" : getEventColor(e.status, e.shiftType);

        return {
          ...e,
          actualCheckOut: actualCheckOut.toDate(),
          checkOut: actualCheckOut.toDate(),
          earlyMinutes,
          bgColor: newBgColor,
        };
      }
      return e;
    });

    setEvents(updatedEvents);
  };

// Hàm tính màu
const getEventColor = (status, shiftType) => {
  if (!status) return "#F44336"; // nghỉ làm (chưa checkin)
  if (shiftType === "half") return "#9C27B0"; // nửa ca tím đậm
  if (status === "late") return "#FFC107"; // vàng đậm
  if (status === "present") return "#4CAF50"; // xanh lá đậm
  return "#4CAF50";
};




  // eventStyleGetter giữ nguyên
  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.bgColor || "#d8f5d1",
      borderRadius: "8px",
      padding: "6px",
      color: "#000",
      border: "1px solid #ddd",
      fontSize: 12,
    },
  });

  const EventItem = ({ event }) => {
  const actualIn = event.actualCheckIn ? moment(event.actualCheckIn).format("HH:mm:ss") : null;
  const actualOut = event.actualCheckOut ? moment(event.actualCheckOut).format("HH:mm:ss") : null;

  return (
    <Box sx={{ p: 0.5, height: "100%" }}>
      <strong style={{ display: "block", marginBottom: 4 }}>{event.title}</strong>
      {actualIn && <div style={{ fontSize: 12 }}>Check-in: {actualIn}</div>}
      {actualOut && <div style={{ fontSize: 12 }}>Check-out: {actualOut}</div>}
      {event.lateMinutes > 0 && <div style={{ color: "orange", fontSize: 11 }}>Muộn: {event.lateMinutes} phút</div>}
      {event.earlyMinutes > 0 && <div style={{ color: "red", fontSize: 11 }}>Sớm: {event.earlyMinutes} phút</div>}
    </Box>
  );
};


  const hasCheckedInToday = attendanceToday && attendanceToday.actualCheckIn;
  const hasCheckedOutToday = attendanceToday && attendanceToday.actualCheckOut;

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
          disabled={hasCheckedInToday}
        >
          Check In
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCheckOut}
          disabled={!hasCheckedInToday || hasCheckedOutToday}
        >
          Check Out
        </Button>
      </Stack>

      <AttendanceCalendar
        events={events}
        date={date}
        setDate={setDate}
        views={["month"]}
        eventStyleGetter={eventStyleGetter}
        components={{ event: EventItem }}
      />
    </Paper>
  );
}
