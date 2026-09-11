import { type Theme } from '@mui/material';
import { TimelineTask } from 'data/project/timeline-data';
import dayjs from 'dayjs';

const formatGanttDate = (dateStr: string | Date): string => {
  if (!dateStr) return '';

  try {
    const date = dateStr instanceof Date ? dayjs(dateStr) : dayjs(dateStr, 'DD-MM-YYYY');
    return date.isValid() ? date.format('DD MMM') : String(dateStr);
  } catch {
    return String(dateStr);
  }
};

const calculateGanttDuration = (startDate: string | Date, endDate: string | Date): number => {
  try {
    const start = startDate instanceof Date ? dayjs(startDate) : dayjs(startDate, 'DD-MM-YYYY');
    const end = endDate instanceof Date ? dayjs(endDate) : dayjs(endDate, 'DD-MM-YYYY');

    if (!start.isValid() || !end.isValid()) return 0;
    return end.diff(start, 'day') + 1;
  } catch {
    return 0;
  }
};

const CreateTaskTextTemplate = (
  task: TimelineTask,
  taskColor: string,
  theme: Theme,
  peopleCount: number,
) => {
  if (task.type === 'project') {
    return `<span class="task-text">${task.text}</span>`;
  }

  const duration = calculateGanttDuration(task.start_date, task.end_date);
  const startDate = formatGanttDate(task.start_date);
  const endDate = formatGanttDate(task.end_date);

  return `<div style="display: flex; flex-direction: column; gap: 2px; max-width: 300px;">
    <div style="font-size: 12px; color: ${theme.vars.palette.text.secondary}; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
      ${peopleCount} People <span style="color: ${theme.vars.palette.divider}; font-weight: bold; margin: 0 6px;">|</span> ${startDate} - ${endDate} <span style="color: ${theme.vars.palette.divider}; font-weight: bold; margin: 0 6px;">|</span> ${duration} Days
    </div>
    <div style="display: flex; align-items: center; font-size: 12px; font-weight: 500; line-height: 1.2;">
      <div 
        style="
          width: 8px; 
          height: 8px; 
          border-radius: 50%; 
          background-color: ${taskColor}; 
          margin-right: 4px; 
          margin-bottom: 2px; 
          flex-shrink: 0;
        "
      ></div>
      <span style="font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;">${task.text}</span>
    </div>
  </div>`;
};

export default CreateTaskTextTemplate;
