import type { RefObject } from 'react';
import { Box, Paper, Stack, Switch, Typography } from '@mui/material';
import { GRID_CHECKBOX_SELECTION_COL_DEF, type GridColDef } from '@mui/x-data-grid';
import type { TimeSheet } from 'data/time-tracker/time-sheets';
import type { Dayjs } from 'dayjs';
import { secondsToHms } from 'lib/utils';
import DashboardMenu from 'components/common/DashboardMenu';
import SelectTime from './SelectTime';
import TimeTrackCell from './TimeTrackCell';

interface GetColumnsProps {
  tab: 'daily' | 'weekly' | 'monthly';
  now: Dayjs;
  timersRef: RefObject<
    Record<
      string,
      {
        isRunning: boolean;
        startTime: number | null;
        duration: number;
      }
    >
  >;
  handleToggleTimer: (id: string) => void;
}

const weekDays = [
  { field: 'sunday', short: 'Su' },
  { field: 'monday', short: 'Mo' },
  { field: 'tuesday', short: 'Tu' },
  { field: 'wednesday', short: 'We' },
  { field: 'thursday', short: 'Th' },
  { field: 'friday', short: 'Fr' },
  { field: 'saturday', short: 'Sa' },
] as const;

const months = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

const weeklyColumns = (now: Dayjs): GridColDef<TimeSheet>[] => {
  const currentDay = now.day();

  return weekDays.map(({ field, short }, index) => {
    const date = now.add(index - currentDay, 'day');

    const isToday = date.isSame(now, 'day');

    return {
      field,

      headerClassName: `${field}-header`,
      cellClassName: `${field}-cell`,

      minWidth: 135,
      flex: 1.35,

      filterable: false,
      sortable: false,

      renderHeader: () => (
        <Typography
          variant="subtitle2"
          sx={{ color: isToday ? 'primary.main' : 'text.primary', mx: 0.5 }}
        >
          {short},{date.format('D MMM')}
        </Typography>
      ),

      renderCell: (params) => {
        const time = currentDay < index ? 0 : params.row.weeklyTimes[field];
        return (
          <Paper
            background={time === 0 ? 3 : 2}
            sx={{
              outline: 0,
              px: 3,
              py: 1.5,
              width: 1,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              {secondsToHms(time, true)}
            </Typography>
          </Paper>
        );
      },
    };
  });
};

const monthlyColumns = (now: Dayjs): GridColDef<TimeSheet>[] => {
  const currentMonth = now.month();

  return months.map((month, index) => {
    const isCurrentMonth = currentMonth === index;

    return {
      field: month,

      headerClassName: `${month}-header`,
      cellClassName: `${month}-cell`,

      minWidth: 135,
      flex: 1.35,

      filterable: false,
      sortable: false,

      renderHeader: () => (
        <Typography
          variant="subtitle2"
          sx={{ color: isCurrentMonth ? 'primary.main' : 'text.primary', mx: 0.5 }}
        >
          {month.slice(0, 3).replace(/^./, (c) => c.toUpperCase())}, {now.format('YYYY')}
        </Typography>
      ),

      renderCell: (params) => {
        const time = currentMonth < index ? 0 : params.row.monthlyTimes[month];
        return (
          <Paper
            background={time === 0 ? 3 : 2}
            sx={{
              outline: 0,
              px: 3,
              py: 1.5,
              width: 1,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
              {secondsToHms(time, true)}
            </Typography>
          </Paper>
        );
      },
    };
  });
};

export const getTimeSheetsColumns = ({
  tab,
  now,
  timersRef,
  handleToggleTimer,
}: GetColumnsProps): GridColDef<TimeSheet>[] => [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    width: 64,
  },
  {
    field: 'project',
    headerName: 'Project',
    headerClassName: 'project-header',
    cellClassName: 'project-cell',
    minWidth: tab === 'daily' ? 350 : 270,
    flex: tab === 'daily' ? 3.5 : 2.7,
    valueGetter: ({ name }) => name,
    renderCell: (params) => (
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
          {params.row.project.name}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          {params.row.project.task}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'client',
    headerName: 'Client',
    headerClassName: 'client-header',
    cellClassName: 'client-cell',
    minWidth: 160,
    flex: 1.6,
    renderCell: (params) => (
      <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
        {params.row.client}
      </Typography>
    ),
  },
  {
    field: 'billable',
    headerName: 'Billable',
    headerClassName: 'billable-header',
    cellClassName: 'billable-cell',
    minWidth: tab === 'daily' ? 150 : 85,
    flex: tab === 'daily' ? 1.5 : 0.85,
    filterable: false,
    sortable: false,
    renderCell: (params) => {
      return (
        <Box sx={{ width: 1 }}>
          <Switch defaultChecked={params.row.billable} />
        </Box>
      );
    },
  },
  {
    field: 'activity',
    headerName: 'Activity',
    headerClassName: 'activity-header',
    cellClassName: 'activity-cell',
    minWidth: 100,
    flex: 1,
    renderCell: (params) => <Typography variant="body2">{`${params.row.activity}%`}</Typography>,
  },
  {
    field: 'idle',
    headerName: 'Idle',
    headerClassName: 'idle-header',
    cellClassName: 'idle-cell',
    minWidth: 100,
    flex: 1,
    renderCell: (params) => <Typography variant="body2">{`${params.row.idle}%`}</Typography>,
  },
  {
    field: 'manual',
    headerName: 'Manual',
    headerClassName: 'manual-header',
    cellClassName: 'manual-cell',
    minWidth: 100,
    flex: 1,
    renderCell: (params) => <Typography variant="body2">{`${params.row.manual}%`}</Typography>,
  },
  {
    field: 'time',
    headerName: 'Time',
    headerClassName: 'time-header',
    cellClassName: 'time-cell',
    headerAlign: 'right',
    align: 'right',
    minWidth: 188,
    flex: 1.88,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <SelectTime fromTime={params.row.time?.start} toTime={params.row.time?.end}>
        <Typography variant="body2" sx={{ textAlign: 'end' }}>
          {`${params.row.time?.start || '--:--'} - ${params.row.time?.end || '--:--'}`}
        </Typography>
      </SelectTime>
    ),
  },
  {
    field: 'duration',
    headerName: 'Duration',
    headerClassName: 'duration-header',
    cellClassName: 'duration-cell',
    headerAlign: 'right',
    align: 'right',
    minWidth: 120,
    flex: 1.2,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {secondsToHms(params.row.duration, true)}
      </Typography>
    ),
  },
  {
    field: 'time-track',
    headerName: 'Time Track',
    headerClassName: 'time-track-header',
    cellClassName: 'time-track-cell',
    headerAlign: 'right',
    align: 'right',
    minWidth: 120,
    flex: 1.2,
    filterable: false,
    sortable: false,
    renderCell: (params) => {
      const timer = timersRef.current[params.id];

      return (
        <TimeTrackCell
          isRunning={timer?.isRunning}
          onClick={() => handleToggleTimer(params.id as string)}
        />
      );
    },
  },
  ...weeklyColumns(now),
  {
    field: 'total',
    headerName: 'Total',
    headerClassName: 'total-header',
    cellClassName: 'total-cell',
    headerAlign: 'right',
    align: 'right',
    minWidth: 120,
    flex: 1.2,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {secondsToHms(params.row.total, true)}
      </Typography>
    ),
  },
  ...monthlyColumns(now),
  {
    field: 'action',
    headerName: '',
    headerClassName: 'action-header',
    cellClassName: 'action-cell',
    filterable: false,
    sortable: false,
    width: 60,
    align: 'right',
    headerAlign: 'right',
    renderHeader: () => <DashboardMenu />,
    renderCell: () => <DashboardMenu />,
  },
];
