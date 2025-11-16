import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, Chip } from '@mui/material';

const localizer = momentLocalizer(moment);

export default function AttendanceCalendar({
  events,
  date,
  setDate,
  view,
  setView,
  onSelectEvent,
  eventStyleGetter,
  onNavigate,
}) {

  const DefaultEventItem = ({ event }) => {
    const displayTitle = event.originalTitle || event.title;
    return (
      <Box sx={{ p: 0.5, height: "100%" }}>
        <Typography sx={{ fontWeight: 700, fontSize: 12, color: "#fff" }}>
          {displayTitle}
        </Typography>
      </Box>
    );
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      date={date}
      onNavigate={(newDate) => {
        setDate(newDate);
        if (onNavigate) onNavigate(newDate);
      }}
      onView={(newView) => setView(newView)}
      view={view}
      views={["month", "week", "day", "agenda"]}
      onSelectEvent={onSelectEvent}
      components={{
        event: ({ event, ...rest }) =>
          event.renderItem ? event.renderItem({ event }) : <DefaultEventItem event={event} />,
      }}
      eventPropGetter={eventStyleGetter}
      style={{ height: "100vh" }}
    />
  );
}

