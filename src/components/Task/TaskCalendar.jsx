import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, Chip } from '@mui/material';

const localizer = momentLocalizer(moment);

export default function TaskCalendar({
  events,
  date,
  setDate,
  view,
  setView,
  onSelectEvent,
  eventStyleGetter,
  onNavigate,
}) {
  // Custom event renderer
  const EventItem = ({ event }) => {
    const displayTitle = event.originalTitle || event.title;
    const assignees = Array.isArray(event.assignees) ? event.assignees : (event.assignees ? event.assignees.toString().split(/,\s*/).filter(Boolean) : []);

    return (
      <Box
        className="rbc-event-content"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          boxSizing: 'border-box',
          px: 0.5,
          py: 0.25,
          color: '#ffffff',
          borderRadius: 1,
          boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 3px',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', pr: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#ffffff' }}>
            {displayTitle}
          </Typography>
          {assignees.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'nowrap', overflow: 'hidden' }}>
              {assignees.slice(0, 2).map((a) => (
                <Chip key={a} label={a} size="small" sx={{ fontSize: 10, height: 22, backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff' }} />
              ))}
              {assignees.length > 2 && <Chip label={`+${assignees.length - 2}`} size="small" sx={{ fontSize: 10, height: 22, backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff' }} />}
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: '100vh', borderRadius: 8 }}
      toolbar={true}
      date={date}
      onNavigate={(newDate) => { setDate(newDate); if (onNavigate) onNavigate(newDate); }}
      view={view}
      onView={(newView) => setView(newView)}
      views={["month", "week", "day", "agenda"]}
      onSelectEvent={onSelectEvent}
      components={{ event: EventItem }}
      eventPropGetter={eventStyleGetter}
    />
  );
}
