import React, { useState } from "react"; // 1. Import useState
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment)

export default function TaskList() {
  // State cho việc điều hướng NGÀY (tháng trước/sau)
  const [date, setDate] = useState(new Date());

  // 2. Thêm state để quản lý VIEW (Tháng/Tuần/Ngày)
  const [view, setView] = useState('month'); // Đặt 'month' làm mặc định

  const [events, setEvents] = useState([]);

  return (
    <div style={{padding: 20 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        toolbar={true} 
        style={{ height: '100vh' }}
        date={date} 
        onNavigate={(newDate) => setDate(newDate)}
        view={view} // Báo cho Calendar biết view hiện tại là gì
        onView={(newView) => setView(newView)} // Khi bấm nút (Week, Day...), cập nhật state      
        views={['month', 'week', 'day', 'agenda']} 
      />
    </div>
  );
}