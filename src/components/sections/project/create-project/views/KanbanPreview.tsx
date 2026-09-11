'use client';

import { useCallback, useMemo } from 'react';
import { Box, Card, Stack, Typography, useTheme } from '@mui/material';
import type { AvatarItem } from '../common/helpers';
import { tasksPerGroup } from '../common/helpers';
import type { CreateProjectFormValues } from '../useCreateProjectStepper';
import { TaskCardContent } from './kanban/SortableTaskCard';
import { type KanbanTask, getKanbanColumns } from './kanban/getKanbanColumns';

export interface KanbanPreviewProps {
  tasks: KanbanTask[];
  groups: CreateProjectFormValues['groups'];
  avatarItems: AvatarItem[];
  hasGroupingEnabled: boolean;
  groupedTasks: string[][];
}

const getGlobalTaskIndex = (
  columnIndex: number,
  taskIndex: number,
  hasGroupingEnabled: boolean,
  groups: CreateProjectFormValues['groups'],
): number => {
  if (!hasGroupingEnabled) return taskIndex;
  const definedGroupsCount = groups.filter((group) => Boolean(group?.label?.trim())).length;
  if (columnIndex < definedGroupsCount) {
    return columnIndex * tasksPerGroup + taskIndex;
  }
  const groupedTasksCount = definedGroupsCount * tasksPerGroup;
  const ungroupedColumnIndex = columnIndex - definedGroupsCount;
  return groupedTasksCount + ungroupedColumnIndex * tasksPerGroup + taskIndex;
};

const KanbanPreview = ({
  tasks,
  groups,
  avatarItems,
  hasGroupingEnabled,
  groupedTasks,
}: KanbanPreviewProps) => {
  const theme = useTheme();

  const getGroupColor = useCallback(
    (index: number) => groups[index]?.color || theme.palette.primary.main,
    [groups, theme],
  );

  const kanbanColumns = useMemo(
    () => getKanbanColumns(tasks, groups, groupedTasks, hasGroupingEnabled, getGroupColor),
    [tasks, groups, groupedTasks, hasGroupingEnabled, getGroupColor],
  );

  if (tasks.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        Add tasks to see them in the kanban board.
      </Typography>
    );
  }

  return (
    <Stack
      direction="row"
      sx={{
        gap: 3,
        width: 1,
        overflowX: 'auto',
        pb: 2,
        '&::-webkit-scrollbar': { height: 8 },
        '&::-webkit-scrollbar-track': { bgcolor: 'background.default' },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 1 },
      }}
    >
      {kanbanColumns.map((column, columnIndex) => (
        <Box
          key={`column-${columnIndex}`}
          sx={{
            minWidth: 316,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            height: 'fit-content',
          }}
        >
          <Box sx={{ mb: 2, minHeight: 40 }}>
            {column.title ? (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 3,
                    borderRadius: 1.5,
                    bgcolor: column.color,
                  },
                }}
              >
                {column.title}
              </Typography>
            ) : (
              <Box sx={{ height: 24 }} />
            )}
          </Box>
          <Stack sx={{ gap: 2, width: 1 }}>
            {column.tasks.map((task, taskIndex) => {
              const globalTaskIndex = getGlobalTaskIndex(
                columnIndex,
                taskIndex,
                hasGroupingEnabled,
                groups,
              );
              return (
                <Card
                  key={`task-${columnIndex}-${taskIndex}`}
                  sx={{
                    borderRadius: 3,
                    bgcolor: 'background.elevation2',
                    outline: 'none',
                  }}
                >
                  <TaskCardContent
                    task={task}
                    globalTaskIndex={globalTaskIndex}
                    avatarItems={avatarItems}
                  />
                </Card>
              );
            })}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default KanbanPreview;
