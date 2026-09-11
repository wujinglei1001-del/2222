'use client';

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from '@mui/lab';
import { Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { taskDetailsData } from 'data/project/task-details';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const formatActivityTime = (iso: string) => {
  const d = dayjs(iso);
  const now = dayjs();
  if (now.diff(d, 'day') === 0) return d.fromNow();
  if (now.diff(d, 'day') === 1) return 'Yesterday';
  if (now.diff(d, 'year') === 0) return d.format('D MMM');
  return d.format('D MMM, YY');
};

const TaskActivity = () => (
  <Paper sx={{ overflow: 'hidden', flexShrink: 0, p: { xs: 2, md: 3 } }}>
    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: 700,
        mb: 2,
      }}
    >
      Activity Log
    </Typography>
    <Timeline
      sx={{
        p: 0,
        m: 0,
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {taskDetailsData.activities.map((item, index) => (
        <TimelineItem key={item.id} sx={{ mb: 0 }}>
          <TimelineSeparator>
            <TimelineDot
              color="primary"
              sx={{
                my: 0.75,
                border: 0,
                width: 12,
                height: 12,
              }}
            />
            {index < taskDetailsData.activities.length - 1 && (
              <TimelineConnector sx={{ bgcolor: 'divider', width: '1px' }} />
            )}
          </TimelineSeparator>
          <TimelineContent
            sx={{
              pt: 0,
              pb: index < taskDetailsData.activities.length - 1 ? 2.5 : 0,
              minWidth: 0,
            }}
          >
            <Stack
              direction="row"
              sx={{
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.primary',
                }}
              >
                {item.user}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.disabled',
                  flexShrink: 0,
                }}
              >
                {formatActivityTime(item.time)}
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              {item.action}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  </Paper>
);

export default TaskActivity;
