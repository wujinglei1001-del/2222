import { type Theme } from '@mui/material';
import { GanttTask } from 'data/project/gantt-data';
import { type GanttConfigOptions } from 'dhtmlx-gantt';
import CreateTaskTextTemplate from 'components/sections/project/common/CreateTaskTextTemplate';
import { createGanttConfig } from './ganttConfig';
import {
  createGanttColumnTemplates,
  createTimelineGridRowClassTemplate,
  createTimelineTaskClassTemplate,
  createTimelineTaskRowClassTemplate,
  getTaskColorByGroup,
  renderTreeToggleIcon,
} from './ganttTemplates';

export const configureGanttChart = (
  ganttChart: GanttConfigOptions,
  theme: Theme,
  gridWidth?: number,
) => {
  Object.assign(ganttChart.config, createGanttConfig('gantt', theme.direction));
  if (gridWidth !== undefined) {
    ganttChart.config.grid_width = gridWidth;
  }
  ganttChart.config.columns = createGanttColumnTemplates(theme);
  ganttChart.templates.task_class = (_start, _end, task) =>
    task.group ? `group-${task.group}` : '';
  ganttChart.templates.grid_row_class = (_start, _end, task) =>
    task.type ? `data-type-${task.type}` : '';
  ganttChart.templates.task_text = (_start, _end, task) => task.text || '';
  ganttChart.templates.grid_open = renderTreeToggleIcon();
};

export const configureTimelineGanttChart = (
  ganttChart: GanttConfigOptions,
  theme: Theme,
  gridWidth?: number,
) => {
  Object.assign(ganttChart.config, createGanttConfig('timeline', theme.direction));
  if (gridWidth !== undefined) {
    ganttChart.config.grid_width = gridWidth;
  }

  ganttChart.config.columns = createGanttColumnTemplates(theme);
  ganttChart.templates.task_class = createTimelineTaskClassTemplate(ganttChart);
  ganttChart.templates.grid_row_class = createTimelineGridRowClassTemplate(ganttChart);
  ganttChart.templates.task_row_class = createTimelineTaskRowClassTemplate(ganttChart);
  ganttChart.templates.grid_open = () => '';
  ganttChart.templates.task_text = (_start, _end, task) => {
    const taskColor = getTaskColorByGroup(task.group, theme);
    const peopleCount = task.users ? task.users.length : 0;
    return CreateTaskTextTemplate(task, taskColor, theme, peopleCount);
  };
};

type GanttWithTaskData = GanttConfigOptions & { $task_data?: HTMLElement };

const getTimelineTaskArea = (ganttChart: GanttConfigOptions): HTMLElement | null => {
  const timelineView = ganttChart.getLayoutView?.('timeline') as
    { $task_data?: HTMLElement } | undefined;

  return (
    timelineView?.$task_data ??
    (ganttChart as GanttWithTaskData).$task_data ??
    ganttChart.$container?.querySelector<HTMLElement>('.gantt_task_data') ??
    null
  );
};

const getDatePosition = (ganttChart: GanttConfigOptions, date: Date): number | null => {
  const timelineView = ganttChart.getLayoutView?.('timeline') as
    { posFromDate?: (targetDate: Date) => number | null } | undefined;

  const position = timelineView?.posFromDate?.(date) ?? ganttChart.posFromDate?.(date);

  return position ?? null;
};

const getCurrentTimeMarkerPosition = (ganttChart: GanttConfigOptions): number | null => {
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const startPosition = getDatePosition(ganttChart, dayStart);
  const endPosition = getDatePosition(ganttChart, dayEnd);

  if (startPosition == null || endPosition == null) {
    return null;
  }

  const dayFraction =
    (now.getTime() - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime());

  return Math.floor(startPosition + (endPosition - startPosition) * dayFraction);
};

export const initTodayMarker = (ganttChart: GanttConfigOptions): (() => void) => {
  let markerElement: HTMLElement | null = null;
  let taskArea: HTMLElement | null = null;
  let minuteTimeout: number | null = null;
  let minuteInterval: number | null = null;

  const dateToStr = ganttChart.date.date_to_str(ganttChart.config.task_date || '%d-%m-%Y');

  const ensureMarkerElement = (): HTMLElement | null => {
    if (!taskArea) return null;

    if (!markerElement || !taskArea.contains(markerElement)) {
      markerElement = taskArea.querySelector<HTMLElement>('.today');

      if (!markerElement) {
        markerElement = document.createElement('div');
        markerElement.className = 'today';
        markerElement.setAttribute('role', 'presentation');
        markerElement.setAttribute('aria-hidden', 'true');
        taskArea.appendChild(markerElement);
      }
    }

    return markerElement;
  };

  const updateMarkerPosition = () => {
    const marker = ensureMarkerElement();
    if (!marker) return;

    const leftPosition = getCurrentTimeMarkerPosition(ganttChart);

    if (leftPosition == null) {
      marker.style.display = 'none';
      return;
    }

    const now = new Date();
    marker.style.display = 'block';
    marker.style.left = `${leftPosition}px`;
    marker.title = dateToStr(now);
  };

  const refreshTaskArea = () => {
    taskArea = getTimelineTaskArea(ganttChart);
  };

  const handleGanttRender = () => {
    refreshTaskArea();
    updateMarkerPosition();
  };

  const renderEventId = ganttChart.attachEvent('onGanttRender', handleGanttRender);
  const scrollEventId = ganttChart.attachEvent('onGanttScroll', updateMarkerPosition);
  const handleResize = () => updateMarkerPosition();

  window.addEventListener('resize', handleResize);
  handleGanttRender();

  const now = new Date();
  const delayToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

  minuteTimeout = window.setTimeout(() => {
    updateMarkerPosition();
    minuteInterval = window.setInterval(updateMarkerPosition, 60_000);
  }, delayToNextMinute);

  return () => {
    if (minuteTimeout != null) {
      window.clearTimeout(minuteTimeout);
    }
    if (minuteInterval != null) {
      window.clearInterval(minuteInterval);
    }
    window.removeEventListener('resize', handleResize);
    ganttChart.detachEvent(renderEventId);
    ganttChart.detachEvent(scrollEventId);
    markerElement?.remove();
    markerElement = null;
    taskArea = null;
  };
};

export const syncGanttLayoutWidths = (container: HTMLElement, gridWidth: number) => {
  const gridLayoutCell = container.querySelector('.gantt_layout_cell.grid_cell');
  const timelineLayoutCell = container.querySelector('.gantt_layout_cell.timeline_cell');
  const layoutRow = container.querySelector('.gantt_layout_x');

  if (!(gridLayoutCell instanceof HTMLElement)) return;

  gridLayoutCell.style.setProperty('width', `${gridWidth}px`, 'important');
  gridLayoutCell.style.setProperty('min-width', `${gridWidth}px`, 'important');
  gridLayoutCell.style.setProperty('max-width', `${gridWidth}px`, 'important');
  gridLayoutCell.style.setProperty('overflow', 'hidden', 'important');

  if (!(timelineLayoutCell instanceof HTMLElement) || !(layoutRow instanceof HTMLElement)) return;

  const layoutRowWidth = layoutRow.getBoundingClientRect().width;
  const resizerWidth =
    layoutRow.querySelector('.gantt_resizer')?.getBoundingClientRect().width ?? 0;
  const reservedLayoutWidth =
    resizerWidth +
    Array.from(layoutRow.children).reduce((totalWidth, childElement) => {
      if (!(childElement instanceof HTMLElement)) return totalWidth;
      if (
        childElement === gridLayoutCell ||
        childElement === timelineLayoutCell ||
        childElement.classList.contains('gantt_resizer')
      ) {
        return totalWidth;
      }

      return totalWidth + childElement.getBoundingClientRect().width;
    }, 0);
  const timelineWidth = Math.max(layoutRowWidth - gridWidth - reservedLayoutWidth, 0);

  timelineLayoutCell.style.setProperty('width', `${timelineWidth}px`, 'important');
  timelineLayoutCell.style.setProperty('min-width', `${timelineWidth}px`, 'important');
};

export const syncGanttGridLayout = (container: HTMLElement, gridWidth: number): number | null => {
  syncGanttLayoutWidths(container, gridWidth);

  const parentElement = container.parentElement;
  const gridLayoutCell = container.querySelector('.gantt_layout_cell.grid_cell');
  const timelineLayoutCell = container.querySelector('.gantt_layout_cell.timeline_cell');

  if (
    !parentElement ||
    !(gridLayoutCell instanceof HTMLElement) ||
    !(timelineLayoutCell instanceof HTMLElement)
  ) {
    return null;
  }

  const parentRect = parentElement.getBoundingClientRect();
  const gridRect = gridLayoutCell.getBoundingClientRect();
  const timelineRect = timelineLayoutCell.getBoundingClientRect();
  const dividerX = gridRect.left > timelineRect.left ? gridRect.left : gridRect.right;

  return Math.round(dividerX - parentRect.left);
};

const clickedTaskCheckbox = (target: EventTarget | null): boolean =>
  Boolean((target as HTMLElement | null)?.closest('[data-gantt-checkbox]'));

const toggleTaskCompleted = (ganttChart: GanttConfigOptions, taskId: string): boolean | null => {
  const task = ganttChart.getTask(taskId);
  if (!task || task.type === 'project') return null;

  const completed = !task.completed;
  task.completed = completed;
  ganttChart.updateTask(taskId);
  return completed;
};

export const bindTaskCompleteCheckbox = (
  container: HTMLElement,
  ganttChart: GanttConfigOptions,
  onTaskCompletedChange: (taskId: string, completed: boolean) => void,
  onTaskClick?: (task: GanttTask) => void,
) => {
  const onCheckboxClick = (event: MouseEvent) => {
    const checkboxButton = (event.target as HTMLElement).closest('[data-gantt-checkbox]');
    if (!checkboxButton) return;

    event.stopPropagation();
    event.preventDefault();

    const taskId = checkboxButton.getAttribute('data-task-id');
    if (!taskId) return;

    const completed = toggleTaskCompleted(ganttChart, taskId);
    if (completed === null) return;

    onTaskCompletedChange(taskId, completed);
  };

  ganttChart.attachEvent('onTaskClick', (taskId: string, event: Event) => {
    if (clickedTaskCheckbox(event.target)) return false;

    if (onTaskClick) {
      const task = ganttChart.getTask(taskId) as GanttTask | undefined;
      if (task && task.type !== 'project') {
        onTaskClick(task);
      }
    }

    return true;
  });

  container.addEventListener('click', onCheckboxClick);

  return () => {
    container.removeEventListener('click', onCheckboxClick);
  };
};

const taskIncludesSearchTerm = (task: GanttTask, searchTerm: string) => {
  const searchableFields = [task.text, task.group, task.assignee, task.department];
  return searchableFields.some((field) => field?.toLowerCase().includes(searchTerm));
};

export const searchGanttTasks = (tasks: GanttTask[], searchTerm: string): GanttTask[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) return tasks;

  const matchedTasks = tasks.filter((task) => taskIncludesSearchTerm(task, normalizedSearch));

  return tasks.filter((task) => {
    if (taskIncludesSearchTerm(task, normalizedSearch)) return true;

    return matchedTasks.some((match) => match.parent === task.id || task.parent === match.id);
  });
};
