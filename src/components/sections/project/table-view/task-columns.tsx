'use client';

import Avatar from '@mui/material/Avatar';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip, { ChipProps } from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ColumnDef } from '@tanstack/react-table';
import { TableMeta, Task, TaskLabel, TaskPriority, TaskStatus } from 'data/project/table-data';
import dayjs, { Dayjs } from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const leadingIconBoxSx = {
  width: 30,
  height: 30,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;

const LeadingColumnSpacer = () => <Box sx={leadingIconBoxSx} />;

const LeadingIconCell = ({ children }: { children: React.ReactNode }) => (
  <Box sx={leadingIconBoxSx}>{children}</Box>
);

const leadingCheckboxSx = { p: 0, flexShrink: 0 };

export const taskColumns: ColumnDef<Task>[] = [
  {
    id: 'drag-handle',
    header: () => null,
    cell: ({ row }) =>
      row.depth > 0 ? (
        <LeadingColumnSpacer />
      ) : (
        <LeadingIconCell>
          <IconifyIcon
            icon="material-symbols:drag-indicator"
            className="drag-handle"
            sx={{ fontSize: 18, color: 'text.primary', cursor: 'grab' }}
          />
        </LeadingIconCell>
      ),
    size: 30,
    enableSorting: false,
  },
  {
    id: 'select',
    header: ({ table }) => (
      <LeadingIconCell>
        <Checkbox
          size="small"
          checked={table.getIsAllPageRowsSelected() ?? false}
          indeterminate={table.getIsSomePageRowsSelected?.() ?? false}
          onChange={table.getToggleAllPageRowsSelectedHandler?.()}
          aria-label="Select all"
          sx={leadingCheckboxSx}
        />
      </LeadingIconCell>
    ),
    cell: ({ row }) =>
      row.depth > 0 ? (
        <LeadingColumnSpacer />
      ) : (
        <LeadingIconCell>
          <Checkbox
            size="small"
            checked={row.getIsSelected?.() ?? false}
            indeterminate={row.getIsSomeSelected?.() ?? false}
            onChange={row.getToggleSelectedHandler?.()}
            aria-label="Select row"
            sx={leadingCheckboxSx}
          />
        </LeadingIconCell>
      ),
    size: 30,
    enableSorting: false,
  },
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      if (row.depth > 0) {
        return (
          <LeadingIconCell>
            <IconifyIcon
              icon="material-symbols:drag-indicator"
              className="drag-handle"
              sx={{ fontSize: 18, color: 'text.primary', cursor: 'grab' }}
            />
          </LeadingIconCell>
        );
      }

      return (
        <LeadingIconCell>
          {row.getCanExpand() ? (
            <IconButton
              size="small"
              onClick={row.getToggleExpandedHandler()}
              aria-expanded={row.getIsExpanded()}
              aria-label={row.getIsExpanded() ? 'Collapse row' : 'Expand row'}
              sx={{ width: 30, height: 30, p: 0 }}
            >
              <IconifyIcon
                icon={
                  row.getIsExpanded()
                    ? 'material-symbols:keyboard-arrow-up'
                    : 'material-symbols:keyboard-arrow-down'
                }
                sx={{ fontSize: 18 }}
              />
            </IconButton>
          ) : (
            <LeadingColumnSpacer />
          )}
        </LeadingIconCell>
      );
    },
    size: 30,
    enableSorting: false,
  },
  {
    id: 'subtask-select',
    header: () => null,
    cell: ({ row }) =>
      row.depth > 0 ? (
        <LeadingIconCell>
          <Checkbox
            size="small"
            checked={row.getIsSelected?.() ?? false}
            indeterminate={row.getIsSomeSelected?.() ?? false}
            onChange={row.getToggleSelectedHandler?.()}
            aria-label="Select row"
            sx={leadingCheckboxSx}
          />
        </LeadingIconCell>
      ) : (
        <LeadingColumnSpacer />
      ),
    size: 30,
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: 'Name of the Task',
    cell: ({ row, getValue, table }) => {
      const meta = table.options.meta as TableMeta;
      const isEditing = meta.editingRowId === row.id;
      const value = (isEditing ? meta.editingDraft.name : undefined) ?? getValue<string>() ?? '';

      const handleChange = (value: string) => meta.patchEditingDraft({ name: value });

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') meta.saveEdit(row.id);
        if (e.key === 'Escape') meta.cancelEdit();
      };

      const nameField = isEditing ? (
        <StyledTextField
          value={value}
          fullWidth
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          autoFocus
        />
      ) : (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            lineHeight: 1.45,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
        >
          {value}
        </Typography>
      );

      return nameField;
    },
    size: 320,
    enableResizing: false,
  },
  {
    accessorKey: 'collaborator',
    header: 'Collaborator',
    cell: ({ row }) => (
      <AvatarGroup
        max={5}
        sx={{
          justifyContent: 'flex-end',
          [`& .${avatarGroupClasses.avatar}`]: {
            width: 24,
            height: 24,
            fontSize: '9.6px',
          },
        }}
      >
        {row.original.collaborator.map((collaborator) => (
          <Tooltip title={collaborator.name} key={collaborator.id}>
            <Avatar alt={collaborator.name} src={collaborator.avatar} />
          </Tooltip>
        ))}
      </AvatarGroup>
    ),
    size: 130,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row, getValue, table }) => {
      const meta = table.options.meta as TableMeta;
      const isEditing = meta.editingRowId === row.id;
      const value = (isEditing ? meta.editingDraft.status : undefined) ?? getValue<string>() ?? '';

      const handleChange = (value: TaskStatus) => meta.patchEditingDraft({ status: value });

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') meta.saveEdit(row.id);
        if (e.key === 'Escape') meta.cancelEdit();
      };

      const options = ['Running', 'Completed', 'Pending', 'Delayed'];
      const colorMapping: Record<TaskStatus, ChipProps['color']> = {
        Running: 'info',
        Completed: 'success',
        Pending: 'warning',
        Delayed: 'error',
      };

      return isEditing ? (
        <StyledTextField
          select
          size="small"
          value={value}
          onChange={(event) => handleChange(event.target.value as TaskStatus)}
          onKeyDown={handleKeyDown}
        >
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </StyledTextField>
      ) : (
        <Chip label={value} color={colorMapping[value as TaskStatus]} variant="soft" />
      );
    },
    size: 135,
  },
  {
    accessorKey: 'label',
    header: 'Label',
    cell: ({ row, getValue, table }) => {
      const meta = table.options.meta as TableMeta;
      const isEditing = meta.editingRowId === row.id;
      const value = (isEditing ? meta.editingDraft.label : undefined) ?? getValue<string>() ?? '';
      const handleChange = (value: TaskLabel) => meta.patchEditingDraft({ label: value });

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') meta.saveEdit(row.id);
        if (e.key === 'Escape') meta.cancelEdit();
      };

      const options = ['Issue', 'Feature', 'Update', 'Bug'];
      const colorMapping: Record<TaskLabel, ChipProps['color']> = {
        Issue: 'warning',
        Feature: 'secondary',
        Update: 'info',
        Bug: 'error',
      };

      return isEditing ? (
        <StyledTextField
          select
          size="small"
          value={value}
          onChange={(event) => handleChange(event.target.value as TaskLabel)}
          onKeyDown={handleKeyDown}
        >
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </StyledTextField>
      ) : (
        <Chip label={value} color={colorMapping[value as TaskLabel]} variant="soft" />
      );
    },
    size: 115,
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row, getValue, table }) => {
      const meta = table.options.meta as TableMeta;
      const isEditing = meta.editingRowId === row.id;
      const value =
        (isEditing ? meta.editingDraft.priority : undefined) ?? getValue<TaskPriority>() ?? '';
      const handleChange = (value: TaskPriority) => meta.patchEditingDraft({ priority: value });

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') meta.saveEdit(row.id);
        if (e.key === 'Escape') meta.cancelEdit();
      };

      const options = ['Low', 'Medium', 'High', 'Critical'];
      const colorMapping: Record<TaskPriority, string> = {
        Low: 'success.main',
        Medium: 'warning.main',
        High: 'error.main',
        Critical: 'error.dark',
      };

      return isEditing ? (
        <StyledTextField
          select
          value={value}
          onChange={(event) => handleChange(event.target.value as TaskPriority)}
          onKeyDown={handleKeyDown}
          size="small"
        >
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </StyledTextField>
      ) : (
        <Stack
          direction="row"
          sx={{
            gap: 0.5,
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: colorMapping[value],
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
        </Stack>
      );
    },
    size: 115,
    enableSorting: false,
  },
  {
    accessorKey: 'dependingOn',
    header: 'Depending on',
    cell: ({ row, getValue, table }) => {
      const meta = table.options.meta as TableMeta;
      const isEditing = meta.editingRowId === row.id;
      const value =
        (isEditing ? meta.editingDraft.dependingOn : undefined) ?? getValue<string>() ?? '';
      const handleChange = (value: string) => meta.patchEditingDraft({ dependingOn: value });

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') meta.saveEdit(row.id);
        if (e.key === 'Escape') meta.cancelEdit();
      };

      return isEditing ? (
        <StyledTextField
          value={value}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
        />
      ) : (
        <Tooltip title={value}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.45,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {value}
          </Typography>
        </Tooltip>
      );
    },
    size: 180,
    enableSorting: false,
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row, getValue, table }) => {
      const meta = table.options.meta as TableMeta;
      const isEditing = meta.editingRowId === row.id;
      const value =
        (isEditing ? meta.editingDraft.startDate : undefined) ?? getValue<string>() ?? '';

      const dueDate =
        (isEditing ? meta.editingDraft.dueDate : undefined) ?? row.original.dueDate ?? '';

      const handleChange = (newValue: Dayjs | null) => {
        if (!newValue) return;

        const currentDue = dayjs(dueDate);
        const patch: Partial<Task> = {
          startDate: newValue.format('YYYY-MM-DD'),
        };

        if (currentDue.isValid() && newValue.isAfter(currentDue)) {
          patch.dueDate = newValue.format('YYYY-MM-DD');
        }

        meta.patchEditingDraft(patch);
      };

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') meta.saveEdit(row.id);
        if (e.key === 'Escape') meta.cancelEdit();
      };

      return isEditing ? (
        <DatePicker
          value={dayjs(value)}
          onChange={handleChange}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              size: 'small',
              hiddenLabel: true,
              onKeyDown: handleKeyDown,
            },
            inputAdornment: { position: 'start' },
          }}
        />
      ) : (
        <Stack
          direction="row"
          sx={{
            gap: 1,
            alignItems: 'center',
          }}
        >
          <IconifyIcon
            icon="material-symbols:calendar-today-outline"
            sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.45,
            }}
          >
            {dayjs(value).format('DD/MM/YYYY')}
          </Typography>
        </Stack>
      );
    },
    size: 150,
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
    cell: ({ row, getValue, table }) => {
      const meta = table.options.meta as TableMeta;
      const isEditing = meta.editingRowId === row.id;
      const value = (isEditing ? meta.editingDraft.dueDate : undefined) ?? getValue<string>() ?? '';

      const startDate =
        (isEditing ? meta.editingDraft.startDate : undefined) ?? row.original.startDate ?? '';

      const handleChange = (newValue: Dayjs | null) => {
        if (!newValue) return;
        meta.patchEditingDraft({ dueDate: newValue.format('YYYY-MM-DD') });
      };

      const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') meta.saveEdit(row.id);
        if (e.key === 'Escape') meta.cancelEdit();
      };

      return isEditing ? (
        <DatePicker
          value={dayjs(value)}
          onChange={handleChange}
          format="DD/MM/YYYY"
          minDate={dayjs(startDate).isValid() ? dayjs(startDate) : undefined}
          slotProps={{
            textField: {
              size: 'small',
              hiddenLabel: true,
              onKeyDown: handleKeyDown,
            },
            inputAdornment: { position: 'start' },
          }}
        />
      ) : (
        <Stack
          direction="row"
          sx={{
            gap: 1,
            alignItems: 'center',
          }}
        >
          <IconifyIcon
            icon="material-symbols:calendar-today-outline"
            sx={{ fontSize: 16, color: 'text.secondary', flexShrink: 0 }}
          />
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.45,
            }}
          >
            {dayjs(value).format('DD/MM/YYYY')}
          </Typography>
        </Stack>
      );
    },
    size: 150,
  },
  {
    id: 'actions',
    header: () => null,
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta;
      const isEditing = meta.editingRowId === row.id;
      return (
        <Stack direction="row" sx={{ gap: 0.5 }}>
          {isEditing ? (
            <Button
              size="small"
              shape="square"
              color="success"
              onClick={() => meta.saveEdit(row.id)}
            >
              <IconifyIcon icon="material-symbols:check" sx={{ fontSize: 18 }} />
            </Button>
          ) : (
            <Button
              size="small"
              shape="square"
              color="neutral"
              onClick={() => meta.startEdit(row.id)}
            >
              <IconifyIcon icon="material-symbols:mode-comment-outline" sx={{ fontSize: 18 }} />
            </Button>
          )}
          <Button
            size="small"
            shape="square"
            color="neutral"
            onClick={() => meta.deleteRow(row.id)}
          >
            <IconifyIcon icon="material-symbols:delete-outline" sx={{ fontSize: 18 }} />
          </Button>
        </Stack>
      );
    },
    size: 80,
    enableSorting: false,
  },
];
