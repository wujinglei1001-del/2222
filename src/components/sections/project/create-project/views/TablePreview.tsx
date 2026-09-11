'use client';

import { useMemo } from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  Stack,
  Tooltip,
  Typography,
  avatarClasses,
  useTheme,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import type { CreateProjectFormValues } from 'components/sections/project/create-project/useCreateProjectStepper';
import { AvatarItem } from '../common/helpers';

interface TablePreviewProps {
  taskValues: string[];
  groups: CreateProjectFormValues['groups'];
  statuses: CreateProjectFormValues['statuses'];
  avatarItems: AvatarItem[];
  hasGroupingEnabled: boolean;
  groupedTasks: string[][];
}

const tasksPerGroup = 4;

const TablePreview = ({
  taskValues,
  groups,
  statuses,
  avatarItems,
  hasGroupingEnabled,
  groupedTasks,
}: TablePreviewProps) => {
  const { vars } = useTheme();

  const groupedTableData = useMemo(() => {
    const statusLabel =
      statuses?.active?.[0]?.label?.trim() || statuses?.incomplete?.[0]?.label?.trim() || 'Running';

    if (!hasGroupingEnabled) {
      const allRows = taskValues.map((task, index) => {
        const start = dayjs().add(index, 'day');
        const end = dayjs().add(index, 'day');

        return {
          id: `${index}-${task}`,
          task,
          assignees: avatarItems,
          status: statusLabel,
          label: 'Issue',
          priority: 'High',
          startDate: start.toDate(),
          endDate: end.toDate(),
        };
      });

      return [{ group: null, rows: allRows }];
    }

    return groupedTasks.map((groupTasks, groupIndex) => {
      const group = groups[groupIndex];
      const groupLabel = group?.label?.trim();

      const rows = groupTasks.map((task, taskIndex) => {
        const globalTaskIndex = groupIndex * tasksPerGroup + taskIndex;
        const start = dayjs().add(globalTaskIndex, 'day');
        const end = dayjs().add(globalTaskIndex, 'day');

        return {
          id: `${globalTaskIndex}-${task}`,
          task,
          assignees: avatarItems,
          status: statusLabel,
          label: 'Issue',
          priority: 'High',
          startDate: start.toDate(),
          endDate: end.toDate(),
        };
      });

      return {
        group: groupLabel ? { label: groupLabel, color: group.color } : null,
        rows,
      };
    });
  }, [avatarItems, statuses, taskValues, hasGroupingEnabled, groupedTasks, groups]);

  const tableColumns = useMemo((): GridColDef<
    (typeof groupedTableData)[number]['rows'][number]
  >[] => {
    return [
      {
        field: 'task',
        headerName: 'Column',
        minWidth: 220,
        flex: 1,
        sortable: false,
        renderCell: (params) => (
          <Typography
            variant="subtitle2"
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              fontWeight: 400,
            }}
          >
            {params.row.task}
          </Typography>
        ),
      },
      {
        field: 'assignees',
        headerName: 'Assignee',
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <AvatarGroup
            max={5}
            sx={{
              display: 'inline-flex',
              [`& .${avatarClasses.root}`]: {
                width: 28,
                height: 28,
                fontSize: 12.8,
                fontWeight: 'medium',
              },
            }}
          >
            {params.row.assignees.map((assignee) => (
              <Tooltip key={assignee.key} title={assignee.name}>
                <Avatar alt={assignee.name} src={assignee.avatarUrl}>
                  {assignee.avatarUrl ? null : assignee.initials}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        minWidth: 90,
        sortable: false,
        renderCell: (params) => (
          <Chip label={params.value} variant="soft" color="info" size="small" />
        ),
      },
      {
        field: 'label',
        headerName: 'Label',
        minWidth: 90,
        sortable: false,
        renderCell: (params) => (
          <Chip label={params.value} variant="soft" color="warning" size="small" />
        ),
      },
      {
        field: 'priority',
        headerName: 'Priority',
        minWidth: 90,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
              {params.value}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'startDate',
        headerName: 'Start Date',
        minWidth: 140,
        sortable: false,
        valueGetter: (value) => new Date(value),
        renderCell: (params) => (
          <Typography
            variant="subtitle2"
            sx={{ display: 'flex', alignItems: 'center', fontWeight: 400 }}
          >
            <IconifyIcon
              icon="material-symbols:calendar-today-outline-rounded"
              sx={{ mr: 1, fontSize: 16 }}
            />
            {dayjs(params.row.startDate).format('DD MMM, YYYY')}
          </Typography>
        ),
      },
      {
        field: 'endDate',
        headerName: 'End Date',
        minWidth: 140,
        sortable: false,
        valueGetter: (value) => new Date(value),
        renderCell: (params) => (
          <Typography
            variant="subtitle2"
            sx={{ display: 'flex', alignItems: 'center', fontWeight: 400 }}
          >
            <IconifyIcon
              icon="material-symbols:calendar-today-outline-rounded"
              sx={{ mr: 1, fontSize: 16 }}
            />
            {dayjs(params.row.endDate).format('DD MMM, YYYY')}
          </Typography>
        ),
      },
    ];
  }, []);

  if (taskValues.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        Add tasks to see them in the table.
      </Typography>
    );
  }

  return (
    <Stack sx={{ gap: 3, width: 1 }}>
      {groupedTableData.map(({ group, rows }, groupIndex) => {
        if (rows.length === 0) return null;

        return (
          <Stack key={groupIndex} direction="row" sx={{ gap: 2, width: 1 }}>
            {group ? (
              <Box
                sx={{
                  minWidth: 4,
                  borderRadius: 0.5,
                  bgcolor: group.color || vars.palette.primary.main,
                  alignSelf: 'stretch',
                }}
              />
            ) : null}
            <Box sx={{ width: 1, minWidth: 0, flex: 1 }}>
              {group && (
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {group.label}
                </Typography>
              )}

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <DataGrid
                  rows={rows}
                  columns={tableColumns}
                  hideFooter
                  disableColumnMenu
                  disableRowSelectionOnClick
                  rowHeight={56}
                  sx={{
                    border: 'none',
                    '--DataGrid-containerBackground': 'transparent',
                    '& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader': {
                      borderBottom: 'none',
                      bgcolor: 'background.default',
                    },
                    '& .MuiDataGrid-row': (theme) => ({
                      borderBottom: `1px solid ${theme.vars.palette.dividerLight}`,
                    }),
                    '& .MuiDataGrid-row--firstVisible': (theme) => ({
                      borderTop: group ? `1px solid ${theme.vars.palette.dividerLight}` : 'none',
                    }),
                    '& .MuiDataGrid-cell': {
                      borderBottom: 'none',
                    },
                  }}
                />
              </div>
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default TablePreview;
