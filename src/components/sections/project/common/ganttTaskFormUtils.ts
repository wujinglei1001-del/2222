import { GanttTask } from 'data/project/gantt-data';
import { TimelineTask } from 'data/project/timeline-data';
import { users } from 'data/users';
import dayjs from 'dayjs';
import type { TaskFormData } from './TaskDialog';

const GANTT_DATE_FORMAT = 'DD-MM-YYYY';

const DEFAULT_COLLABORATORS = [users[0].id, users[1].id];

type GanttDateInput = string | Date | undefined | null;

type ChartTaskWithDates = {
  start_date: string;
  end_date: string;
  duration?: number;
};

const toDayjs = (value: GanttDateInput): dayjs.Dayjs => {
  if (value instanceof Date) return dayjs(value);
  if (typeof value === 'string') return dayjs(value, GANTT_DATE_FORMAT);
  return dayjs();
};

const toDateRange = (
  task: ChartTaskWithDates & { start_date?: GanttDateInput; end_date?: GanttDateInput },
) => {
  const start = toDayjs(task.start_date);
  const end =
    task.end_date != null
      ? toDayjs(task.end_date)
      : start.add(Math.max((task.duration ?? 1) - 1, 0), 'day');

  return { start, end };
};

const formatDate = (value: dayjs.Dayjs) => value.format(GANTT_DATE_FORMAT);

export const normalizeChartTaskDates = <T extends ChartTaskWithDates>(
  task: T & { duration?: number; start_date?: GanttDateInput; end_date?: GanttDateInput },
): T => {
  const { start, end } = toDateRange(task);
  console.log(start, end);

  return {
    ...task,
    start_date: formatDate(start),
    end_date: formatDate(end),
  };
};

export const normalizeGanttTaskFromChart = (task: GanttTask & { duration?: number }): GanttTask =>
  normalizeChartTaskDates(task);

const priorityToLabel = (priority?: number): TaskFormData['priority'] => {
  if (priority === 2) return 'High';
  if (priority === 3) return 'Urgent';
  return 'Normal';
};

const labelToPriority = (label: string): number => {
  if (label === 'High') return 2;
  if (label === 'Urgent') return 3;
  return 1;
};

type ChartTaskFormSource = Pick<
  GanttTask,
  'text' | 'start_date' | 'end_date' | 'group' | 'parent' | 'completed' | 'priority'
> & { duration?: number };

export const chartTaskToFormData = (task: ChartTaskFormSource): TaskFormData => {
  const normalizedTask = normalizeChartTaskDates(task);
  const startDate = toDayjs(normalizedTask.start_date).toDate();
  const endDate = toDayjs(normalizedTask.end_date).toDate();

  return {
    task: normalizedTask.text,
    group: normalizedTask.group ?? normalizedTask.parent ?? 'group-1',
    status: normalizedTask.completed ? 'Completed' : 'This week',
    startDate,
    endDate,
    priority: priorityToLabel(normalizedTask.priority),
    collaborators: DEFAULT_COLLABORATORS,
  };
};

const isCompletedStatus = (status: string) => status === 'Completed' || status === 'Done';

export const formDataToGanttTask = (
  formData: TaskFormData,
  options?: { taskId?: string; progress?: number },
): GanttTask => ({
  id: options?.taskId ?? `task-${Date.now()}`,
  text: formData.task,
  start_date: formatDate(dayjs(formData.startDate)),
  end_date: formatDate(dayjs(formData.endDate)),
  progress: options?.progress ?? 0,
  parent: formData.group,
  type: 'task',
  group: formData.group,
  completed: isCompletedStatus(formData.status),
  priority: labelToPriority(formData.priority),
});

export const formDataToTimelineTask = (
  formData: TaskFormData,
  options?: { taskId?: string; progress?: number; users?: string[] },
): TimelineTask => ({
  id: options?.taskId ?? `task-${Date.now()}`,
  text: formData.task,
  start_date: formatDate(dayjs(formData.startDate)),
  end_date: formatDate(dayjs(formData.endDate)),
  progress: options?.progress ?? 0,
  parent: formData.group,
  type: 'task',
  group: formData.group,
  completed: isCompletedStatus(formData.status),
  users: options?.users ?? [],
});

export const ganttTaskToFormData = chartTaskToFormData;
