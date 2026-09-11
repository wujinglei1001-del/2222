'use client';

import { useMemo } from 'react';
import type { Theme } from '@mui/material';
import { Paper, Typography, useTheme } from '@mui/material';
import { TimelineTask } from 'data/project/timeline-data';
import dayjs from 'dayjs';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import dhtmlxGantt from 'theme/styles/dhtmlxGantt';
import { useTimelineGanttPreview } from 'components/sections/project/hooks/useTimelineGanttPreview';
import { AvatarItem } from '../common/helpers';
import type { CreateProjectFormValues } from '../useCreateProjectStepper';

interface TimelinePreviewProps {
  taskValues: string[];
  groups: CreateProjectFormValues['groups'];
  avatarItems: AvatarItem[];
  hasGroupingEnabled: boolean;
  groupedTasks: string[][];
}

const datesInCurrentMonth = (seed: number) => {
  const monthStart = dayjs().startOf('month');
  const daysInMonth = dayjs().daysInMonth();
  const startDay = Math.abs((seed * 17 + 1) % Math.max(1, daysInMonth - 6));
  const duration = 7 + (Math.abs(seed * 13) % 22);
  const start = monthStart.add(startDay, 'day');
  const end = start.add(duration, 'day').isAfter(monthStart.endOf('month'))
    ? monthStart.endOf('month')
    : start.add(duration, 'day');
  return { start, end };
};

const previewStyles = (theme: Theme) => ({
  outline: 'none !important',
  borderTop: `1px solid ${theme.vars.palette.divider} !important`,
  '--dhx-gantt-task-border': '2px solid !important',
  '--dhx-gantt-link-background': theme.vars.palette.divider,
  '--dhx-gantt-task-border-radius': `${(theme.shape.borderRadius as number) * 0}px ${(theme.shape.borderRadius as number) * 2}px ${(theme.shape.borderRadius as number) * 0}px ${(theme.shape.borderRadius as number) * 2}px !important`,
  '--dhx-gantt-base-colors-hover-color': 'transparent !important',
  '& .gantt_task_progress': {
    borderRadius: `${(theme.shape.borderRadius as number) * 2}px ${(theme.shape.borderRadius as number) * 4}px ${(theme.shape.borderRadius as number) * 2}px ${(theme.shape.borderRadius as number) * 4}px !important`,
  },
  '& .gantt_row.data-type-project': {
    borderBottom: 'none !important',
    '& .gantt_tree_content': {
      display: 'flex',
      paddingLeft: '0 !important',
      '& .task-text': {
        paddingTop: '16px !important',
      },
    },
  },
  '& .gantt_task_content': {
    paddingLeft: '16px !important',
    paddingRight: '16px !important',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left !important',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    justifyContent: 'center',
  },
  '& .gantt_task_line[class*="group-"], & .gantt_row[class*="group-"] .gantt_cell': {
    backgroundColor: theme.vars.palette.background.elevation1,
    borderTop: 'none !important',
    borderRight: 'none !important',
  },
  '& .gantt_task_row, & .gantt_row_task': { borderBottom: 'none !important' },
  '& .gantt_row.data-type-task.last-in-group': {
    borderBottom: `1px solid ${theme.vars.palette.divider} !important`,
  },
  '& .gantt_task_row.last-in-group, & .gantt_task_row.odd.last-in-group': {
    borderBottom: `1px solid ${theme.vars.palette.divider} !important`,
  },
  '& .hide-group-parent': { display: 'none !important' },
  '& .drag-handle, & .task-checkbox': { display: 'none !important' },
  '& .gantt_row.gantt_selected, & .gantt_row.gantt_selected .gantt_cell': {
    backgroundColor: `${theme.vars.palette.background.paper} !important`,
  },
  '& .gantt_task_line.gantt_selected': { boxShadow: 'none !important' },
});

const TimelinePreview = ({
  taskValues,
  groups,
  hasGroupingEnabled,
  groupedTasks,
  avatarItems,
}: TimelinePreviewProps) => {
  const theme = useTheme();
  const { vars } = theme;
  const peopleCount = avatarItems.length || 0;
  const getGroupColor = (index: number) => groups[index]?.color || vars.palette.primary.main;

  const timelineTasks = useMemo((): TimelineTask[] => {
    if (taskValues.length === 0) return [];

    if (!hasGroupingEnabled) {
      const color = getGroupColor(0);
      return taskValues.map((text, i) => {
        const { start, end } = datesInCurrentMonth(i);
        return {
          id: `task-${i}`,
          text,
          start_date: start.format('DD-MM-YYYY'),
          end_date: end.format('DD-MM-YYYY'),
          progress: 0,
          type: 'task' as const,
          group: 'ungrouped',
          color,
          users: Array(peopleCount).fill('user'),
        };
      });
    }

    const result: TimelineTask[] = [];
    groupedTasks.forEach((tasksInGroup, groupIndex) => {
      const groupConfig = groups[groupIndex];
      const groupLabel = groupConfig?.label?.trim();
      const color = getGroupColor(groupIndex);
      const groupId = `group-${groupIndex}`;

      if (groupLabel) {
        const first = datesInCurrentMonth(groupIndex * 100);
        const last =
          tasksInGroup.length > 1
            ? datesInCurrentMonth(groupIndex * 100 + tasksInGroup.length - 1)
            : first;
        result.push({
          id: groupId,
          text: groupLabel,
          start_date: first.start.format('DD-MM-YYYY'),
          end_date: last.end.format('DD-MM-YYYY'),
          progress: 0,
          type: 'project',
          group: groupId,
          color,
          open: true,
        });
      }

      tasksInGroup.forEach((taskText, taskIndex) => {
        const { start, end } = datesInCurrentMonth(groupIndex * 100 + taskIndex);
        result.push({
          id: `task-${groupId}-${taskIndex}`,
          text: taskText,
          start_date: start.format('DD-MM-YYYY'),
          end_date: end.format('DD-MM-YYYY'),
          progress: 0,
          parent: groupLabel ? groupId : undefined,
          type: 'task',
          group: groupId,
          color,
          users: Array(peopleCount).fill('user'),
        });
      });
    });
    return result;
  }, [taskValues, groups, hasGroupingEnabled, groupedTasks, avatarItems, vars]);

  const { ganttContainer } = useTimelineGanttPreview({
    tasks: timelineTasks,
    getTaskColor: (task) => task.color || vars.palette.secondary.main,
  });

  if (taskValues.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        Add tasks to see them in the timeline.
      </Typography>
    );
  }

  return (
    <Paper
      dir="ltr"
      ref={ganttContainer}
      sx={[dhtmlxGantt, (theme: Theme) => previewStyles(theme)]}
    />
  );
};

export default TimelinePreview;
