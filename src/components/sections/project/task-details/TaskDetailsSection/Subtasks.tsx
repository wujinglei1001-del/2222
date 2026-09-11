'use client';

import { useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Avatar,
  AvatarGroup,
  Box,
  Checkbox,
  IconButton,
  Paper,
  Stack,
  Typography,
  avatarClasses,
} from '@mui/material';
import { type TaskSubtask, taskDetailsData } from 'data/project/task-details';
import IconifyIcon from 'components/base/IconifyIcon';
import SortableDnd from 'components/base/SortableDnd';

interface SortableSubtaskRowProps {
  subtask: TaskSubtask;
  onToggle: (id: string) => void;
  isLast: boolean;
}

const SortableSubtaskRow = ({ subtask, onToggle, isLast }: SortableSubtaskRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: subtask.id,
  });

  const taskLabel = `${subtask.title}: ${subtask.description}`;

  const renderSubtaskMetaActions = () => (
    <Stack direction="row" sx={{ alignItems: 'center', flexShrink: 0, gap: 0.5 }}>
      <IconButton size="small" aria-label="Due date" sx={{ color: 'text.secondary' }}>
        <IconifyIcon icon="material-symbols:calendar-today-outline-rounded" sx={{ fontSize: 20 }} />
      </IconButton>

      <Box
        sx={{
          width: { xs: 'auto', md: 70 },
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AvatarGroup
          max={3}
          sx={{
            [`& .${avatarClasses.root}`]: {
              width: 24,
              height: 24,
              fontSize: 12,
            },
          }}
        >
          {subtask.assignees.length > 0 ? (
            subtask.assignees.map((assignee) => (
              <Avatar key={assignee.id} src={assignee.avatar} alt={assignee.name}>
                {assignee.name[0]}
              </Avatar>
            ))
          ) : (
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'grey.200' }}>
              <IconifyIcon icon="material-symbols:person-rounded" sx={{ fontSize: 18 }} />
            </Avatar>
          )}
        </AvatarGroup>
      </Box>
    </Stack>
  );

  const renderSubtaskMenuActions = () => (
    <Stack direction="row" sx={{ alignItems: 'center', flexShrink: 0 }}>
      <IconButton size="small" sx={{ color: 'text.secondary' }} aria-label="More options">
        <IconifyIcon icon="material-symbols:more-horiz" sx={{ fontSize: 18 }} />
      </IconButton>
      <IconButton size="small" sx={{ color: 'text.secondary' }} aria-label="View details">
        <IconifyIcon flipOnRTL icon="material-symbols:double-arrow" sx={{ fontSize: 18 }} />
      </IconButton>
    </Stack>
  );

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: 1,
        minWidth: 0,
        py: 1.25,
        px: 1.5,
        ...(!isLast && {
          borderBottom: '1px solid',
          borderColor: 'dividerLight',
        }),
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          gap: 1,
          minWidth: 0,
          width: 1,
        }}
      >
        <Stack
          {...attributes}
          {...listeners}
          direction="row"
          sx={{
            alignItems: 'center',
            flexShrink: 0,
            cursor: 'grab',
            color: 'text.secondary',
            '&:active': { cursor: 'grabbing' },
          }}
        >
          <IconifyIcon icon="material-symbols:drag-indicator" sx={{ fontSize: 18 }} />
        </Stack>

        <Checkbox
          size="small"
          checked={subtask.checked}
          onChange={() => onToggle(subtask.id)}
          onClick={(event) => event.stopPropagation()}
          sx={{ flexShrink: 0, p: 0.5 }}
        />

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="body2"
            title={taskLabel}
            sx={{
              color: subtask.checked ? 'text.secondary' : 'text.primary',
              textDecoration: subtask.checked ? 'line-through' : 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: { xs: 2, md: 1 },
              whiteSpace: { md: 'nowrap' },
            }}
          >
            {taskLabel}
          </Typography>
        </Box>

        <Stack direction="row" sx={{ display: { xs: 'flex', md: 'none' }, flexShrink: 0 }}>
          {renderSubtaskMenuActions()}
        </Stack>

        <Stack
          direction="row"
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexShrink: 0,
            alignItems: 'center',
          }}
        >
          {renderSubtaskMetaActions()}
          {renderSubtaskMenuActions()}
        </Stack>
      </Stack>

      <Stack
        direction="row"
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          gap: 0.5,
          mt: 1,
          pl: 7,
        }}
      >
        {renderSubtaskMetaActions()}
      </Stack>
    </Box>
  );
};

const Subtasks = () => {
  const [subtasks, setSubtasks] = useState<TaskSubtask[]>(() => taskDetailsData.subtasks);

  const handleToggle = (id: string) => {
    setSubtasks((prev) =>
      prev.map((subtask) =>
        subtask.id === id ? { ...subtask, checked: !subtask.checked } : subtask,
      ),
    );
  };

  const handleDragEnd = (oldIndex: number, newIndex: number, _event: DragEndEvent) => {
    setSubtasks((prev) => {
      const next = [...prev];
      const [removed] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, removed);
      return next;
    });
  };

  return (
    <Paper
      sx={{
        overflow: 'hidden',
        p: { xs: 2, md: 3 },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        Subtasks
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 0, width: 1 }}>
        <SortableDnd
          items={subtasks.map((subtask) => ({ id: subtask.id }))}
          handleDragEnd={handleDragEnd}
        >
          {subtasks.map((subtask, index) => (
            <SortableSubtaskRow
              key={subtask.id}
              subtask={subtask}
              onToggle={handleToggle}
              isLast={index === subtasks.length - 1}
            />
          ))}
        </SortableDnd>
      </Box>
    </Paper>
  );
};

export default Subtasks;
