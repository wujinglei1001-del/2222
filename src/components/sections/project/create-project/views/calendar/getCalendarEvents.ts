import { EventInput } from '@fullcalendar/core/index.js';
import type { Theme } from '@mui/material';
import dayjs from 'dayjs';
import { tasksPerGroup } from '../../common/helpers';
import type { CreateProjectFormValues } from '../../useCreateProjectStepper';
import type { ValidTask } from '../../usePreviewTasks';

export const getTaskDatesInMonth = (
  taskIndex: number,
  month: dayjs.Dayjs,
): { start: dayjs.Dayjs; end: dayjs.Dayjs } => {
  const monthStart = month.startOf('month');
  const monthEnd = month.endOf('month');
  const daysInMonth = month.daysInMonth();
  const dayOffset = taskIndex % daysInMonth;
  const start = monthStart.add(dayOffset, 'day');
  const desiredDuration = 2;
  const proposedEnd = start.add(desiredDuration - 1, 'day');
  const end = proposedEnd.isAfter(monthEnd) ? monthEnd : proposedEnd;
  return { start, end };
};

export const taskToCalendarEvents = (
  tasks: ValidTask[],
  groups: CreateProjectFormValues['groups'],
  hasGroupingEnabled: boolean,
  groupedTasks: string[][],
  getGroupColor: (index: number) => string,
  theme: Theme,
  viewedMonth: dayjs.Dayjs,
): EventInput[] => {
  if (!hasGroupingEnabled) {
    const color = getGroupColor(0);

    return tasks.map((task, index) => {
      const { start, end } = getTaskDatesInMonth(index, viewedMonth);

      return {
        id: task.id,
        title: task.value?.trim() || 'Task',
        start: start.format('YYYY-MM-DD'),
        end: end.add(1, 'day').format('YYYY-MM-DD'),
        backgroundColor: theme.vars.palette.background.elevation1,
        borderColor: color,
        display: 'block',
      };
    });
  }

  return tasks.map((task, globalIndex) => {
    const { start, end } = getTaskDatesInMonth(globalIndex, viewedMonth);

    let groupIndex = 0;
    let taskFound = false;
    for (let i = 0; i < groupedTasks.length; i++) {
      const groupTasks = groupedTasks[i];
      const taskInGroupIndex = groupTasks.findIndex(
        (taskValue) => taskValue === task.value?.trim(),
      );
      if (taskInGroupIndex !== -1) {
        groupIndex = i;
        taskFound = true;
        break;
      }
    }

    if (!taskFound) {
      groupIndex = Math.floor(globalIndex / tasksPerGroup);
    }

    const color = getGroupColor(groupIndex);

    return {
      id: task.id,
      title: task.value?.trim() || 'Task',
      start: start.format('YYYY-MM-DD'),
      end: end.add(1, 'day').format('YYYY-MM-DD'),
      backgroundColor: theme.vars.palette.background.elevation1,
      borderColor: color,
      display: 'block',
    };
  });
};
