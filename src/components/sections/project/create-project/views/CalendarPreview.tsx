'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DatesSetArg } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import ReactFullCalendar from '@fullcalendar/react';
import { Box, IconButton, MenuItem, Stack, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import FullCalendar from 'components/base/FullCalendar';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledSelect from 'components/styled/StyledSelect';
import type { CreateProjectFormValues } from '../useCreateProjectStepper';
import type { ValidTask } from '../usePreviewTasks';
import { taskToCalendarEvents } from './calendar/getCalendarEvents';

export interface CalendarPreviewProps {
  tasks: ValidTask[];
  groups: CreateProjectFormValues['groups'];
  hasGroupingEnabled: boolean;
  groupedTasks: string[][];
}

const CalendarPreview = ({
  tasks,
  groups,
  hasGroupingEnabled,
  groupedTasks,
}: CalendarPreviewProps) => {
  const theme = useTheme();
  const calendarRef = useRef<ReactFullCalendar | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState(dayjs());

  const getGroupColor = useCallback(
    (index: number) => groups[index]?.color ?? theme.palette.primary.main,
    [groups, theme],
  );

  const events = useMemo(
    () =>
      taskToCalendarEvents(
        tasks,
        groups,
        hasGroupingEnabled,
        groupedTasks,
        getGroupColor,
        theme,
        currentDate,
      ),
    [tasks, groups, hasGroupingEnabled, groupedTasks, getGroupColor, theme, currentDate],
  );

  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    if (arg.view?.currentStart) {
      setCurrentDate(dayjs(arg.view.currentStart));
    }
  }, []);

  const handlePrev = useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (api) api.prev();
  }, []);

  const handleNext = useCallback(() => {
    const api = calendarRef.current?.getApi();
    if (api) api.next();
  }, []);

  useEffect(() => {
    if (calendarRef.current && containerRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const resizeObserver = new ResizeObserver(() => calendarApi.updateSize());
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  if (tasks.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        Add tasks to see them on the calendar.
      </Typography>
    );
  }

  return (
    <Stack sx={{ gap: 2, width: 1 }}>
      <Box
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing(2),
          flexWrap: 'wrap',
        })}
      >
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing(0.5),
          })}
        >
          <IconButton
            size="small"
            onClick={handlePrev}
            aria-label="Previous"
            sx={{ color: 'text.secondary' }}
          >
            <IconifyIcon icon="material-symbols:chevron-left-rounded" />
          </IconButton>
          <Typography
            variant="subtitle1"
            sx={[
              {
                fontWeight: 600,
              },
              (theme) => ({
                minWidth: theme.spacing(17.5),
                textAlign: 'center',
              }),
            ]}
          >
            {currentDate.format('MMMM YYYY')}
          </Typography>
          <IconButton
            size="small"
            onClick={handleNext}
            aria-label="Next"
            sx={{ color: 'text.secondary' }}
          >
            <IconifyIcon icon="material-symbols:chevron-right-rounded" />
          </IconButton>
        </Box>
        <StyledSelect
          size="small"
          variant="filled"
          defaultValue="dayGridMonth"
          displayEmpty
          inputProps={{ 'aria-label': 'Calendar view' }}
          sx={{
            minWidth: 118,
            borderRadius: 2,
          }}
          renderValue={() => 'Month view'}
        >
          <MenuItem value="dayGridMonth">Month view</MenuItem>
        </StyledSelect>
      </Box>
      <Box
        ref={containerRef}
        className="custom-calendar"
        sx={(theme) => ({
          width: 1,
          position: 'relative',
          overflowY: 'auto',
          // maxHeight: `min(600px, calc(100vh - ${theme.spacing(35)}))`,

          '& .fc-scroller': {
            overflow: 'visible !important',
          },
          '& .fc-scroller-harness': {
            padding: theme.spacing(0.5),
          },
          '& .fc': {
            '& .fc-scrollgrid-section-header.fc-scrollgrid-section-sticky > *': {
              top: '0 !important',
            },
            '& .fc-col-header': {
              backgroundColor: `${theme.vars.palette.background.elevation2} !important`,
            },
            '& .fc-col-header-cell': {
              backgroundColor: `${theme.vars.palette.background.elevation2} !important`,
              '&:first-of-type': {
                borderTopLeftRadius: '22px',
                borderBottomLeftRadius: '22px',
              },
              '&:last-of-type': {
                borderTopRightRadius: '22px',
                borderBottomRightRadius: '22px',
              },
              '& .fc-col-header-cell-cushion': {
                padding: theme.spacing(1),
                fontWeight: 400,
                fontSize: 14,
                color: 'text.disabled',
              },
            },
            '& .fc-daygrid-body': {
              border: '1px solid',
              borderColor: 'dividerLight',
              borderRadius: '12px',
            },
            '& .fc-daygrid-day': {
              border: '1px solid',
              borderColor: 'dividerLight',
              borderRadius: 1.5,
            },
            '& .fc-daygrid-day-frame': {
              borderRadius: 1.5,
              flexDirection: 'column',
              alignItems: 'stretch',
              justifyContent: 'flex-start',
              p: theme.spacing(1),
              maxHeight: 'none',
              minHeight: { xs: theme.spacing(9), xl: theme.spacing(10) },
            },
            '& .fc-daygrid-day-events': {
              flex: 1,
              minHeight: theme.spacing(12),
              position: 'relative',
              marginTop: theme.spacing(4),
            },
            '& .fc-daygrid-day-top': {
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              minHeight: 'auto',
              marginBottom: 0,
              padding: 0,
            },
            '& .fc-daygrid-day-number': {
              fontWeight: 500,
              marginLeft: 'auto',
            },
            '& .fc-daygrid-event': {
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: 'dividerLight',
              minHeight: theme.spacing(3.5),
              '& .fc-event-title': {
                color: 'text.primary',
              },
            },
          },
        })}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          initialDate={currentDate.toISOString()}
          events={events}
          headerToolbar={false}
          selectable={false}
          editable={false}
          eventDisplay="block"
          expandRows={true}
          fixedWeekCount={false}
          height="auto"
          stickyHeaderDates
          datesSet={handleDatesSet}
          dayMaxEventRows={3}
        />
      </Box>
    </Stack>
  );
};

export default CalendarPreview;
