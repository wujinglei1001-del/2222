import { type Theme } from '@mui/material';
import { GanttTask } from 'data/project/gantt-data';
import { type GanttConfigOptions } from 'dhtmlx-gantt';

type GanttDirection = Theme['direction'];

export const getTaskColorByGroup = (group: string, theme: Theme) => {
  switch (group) {
    case 'group-1':
      return theme.vars.palette.primary.main;
    case 'group-2':
      return theme.vars.palette.warning.main;
    case 'group-3':
      return theme.vars.palette.success.main;
    default:
      return theme.vars.palette.text.secondary;
  }
};

const isLastInGroupTask = (ganttInstance: GanttConfigOptions, task: GanttTask): boolean => {
  if (task.type !== 'task' || !task.parent) return false;

  const children = ganttInstance
    .getChildren(task.parent)
    .map((taskId: string) => ganttInstance.getTask(taskId));

  return children.length > 0 && children[children.length - 1].id === task.id;
};

export const createTimelineTaskClassTemplate =
  (ganttInstance: GanttConfigOptions) => (_start: Date, _end: Date, task: GanttTask) => {
    let classes = task.group ? `group-${task.group}` : '';
    if (task.type === 'project') classes += ' hide-group-parent';
    if (isLastInGroupTask(ganttInstance, task)) classes += ' last-in-group';
    return classes;
  };

export const createTimelineGridRowClassTemplate =
  (ganttInstance: GanttConfigOptions) => (_start: Date, _end: Date, task: GanttTask) => {
    let classes = task.type ? `data-type-${task.type}` : '';
    if (isLastInGroupTask(ganttInstance, task)) classes += ' last-in-group';
    return classes;
  };

export const createTimelineTaskRowClassTemplate =
  (ganttInstance: GanttConfigOptions) => (_start: Date, _end: Date, task: GanttTask) => {
    if (isLastInGroupTask(ganttInstance, task)) return ' last-in-group';
    return '';
  };

const createDragHandleTemplate = (direction: GanttDirection = 'ltr') => `
  <div style="display: flex; align-items: center; height: 100%;">
    ${direction === 'ltr' ? '<div style="width: 38px; height: 100%;"></div>' : ''}
    <div class="drag-handle" style="cursor: move; display: flex; align-items: center; justify-content: center; height: 100%;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    </div>
    ${direction === 'rtl' ? '<div style="width: 38px; height: 100%;"></div>' : ''}
  </div>
`;

const renderCheckboxIcon = (
  completed: boolean,
  colors: { stroke: string; fill: string; checkMark: string },
) =>
  completed
    ? `<svg class="gantt-checkbox-icon" width="16" height="16" viewBox="0 0 16 16">
        <rect width="16" height="16" rx="4" fill="${colors.fill}" />
        <path fill="${colors.checkMark}" d="M6.29999 11.7C6.23332 11.7 6.17221 11.6889 6.11666 11.6667C6.0611 11.6444 6.00555 11.6056 5.94999 11.55L2.93333 8.53334C2.83333 8.43334 2.78333 8.31111 2.78333 8.16667C2.78333 8.02223 2.83333 7.9 2.93333 7.8C3.03333 7.7 3.14999 7.65 3.28333 7.65C3.41666 7.65 3.53332 7.7 3.63332 7.8L6.29999 10.4667L12.35 4.41667C12.45 4.31667 12.5694 4.26667 12.7083 4.26667C12.8472 4.26667 12.9667 4.31667 13.0667 4.41667C13.1667 4.51667 13.2167 4.63611 13.2167 4.775C13.2167 4.91389 13.1667 5.03334 13.0667 5.13334L6.64999 11.55C6.59444 11.6056 6.53888 11.6444 6.48333 11.6667C6.42777 11.6889 6.36666 11.7 6.29999 11.7Z" />
      </svg>`
    : `<svg class="gantt-checkbox-icon" width="16" height="16" viewBox="0 0 16 16">
        <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="transparent" stroke="${colors.stroke}" />
      </svg>`;

const renderCheckboxCell = (task: { id: string; completed?: boolean }, theme: Theme) => {
  const icon = renderCheckboxIcon(!!task.completed, {
    stroke: theme.vars.palette.background.elevation4,
    fill: theme.vars.palette.primary.main,
    checkMark: theme.vars.palette.background.default,
  });

  return `
    <div class="gantt-checkbox-wrap">
      <button type="button" class="task-checkbox gantt-checkbox" data-gantt-checkbox data-task-id="${task.id}" aria-pressed="${!!task.completed}">
        <span class="gantt-checkbox-box" aria-hidden="true">${icon}</span>
      </button>
    </div>
  `;
};

export const renderTreeToggleIcon = () => (item: { $open?: boolean }) => {
  if (item.$open) {
    return `<div class='gantt_tree_icon gantt_close'>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275t.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062"/>
      </svg>
    </div>`;
  }

  return `<div class='gantt_tree_icon gantt_open'>
    <svg height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
      <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>
    </svg>
  </div>`;
};

export const createGanttColumnTemplates = (theme: Theme) => [
  {
    name: 'drag',
    label: '',
    width: 45,
    template: (task: GanttTask) => {
      if (task.type === 'project') return '';
      return createDragHandleTemplate(theme.direction);
    },
  },
  {
    name: 'checkbox',
    label: '',
    width: 40,
    template: (task: GanttTask) => {
      if (task.type === 'project') return '';
      return renderCheckboxCell(task, theme);
    },
  },
  {
    name: 'text',
    label: '',
    tree: true,
    width: '*',
    template: (task: GanttTask) => {
      if (task.type === 'project')
        return `<span class="gantt-ellipsis" title="${task.text}">${task.text}</span>`;

      const groupColor = getTaskColorByGroup(task.group ?? '', theme);
      const indicatorPosition = theme.direction === 'rtl' ? 'right: 0px;' : 'left: 0px;';
      const taskTextSpacing =
        theme.direction === 'rtl' ? 'margin-right: 16px;' : 'margin-left: 16px;';

      return `<div style="display: flex; align-items: center; height: 100%; position: relative;">
        <div class="task-indicator" style="position: absolute; ${indicatorPosition} width: 2px; height: 24px; background-color: ${groupColor}; border-radius: 1px;"></div>
        <span class="gantt-ellipsis" style="${taskTextSpacing}" title="${task.text}">${task.text}</span>
      </div>`;
    },
  },
];

export const createPreviewColumnTemplate = (getTaskColor: (task: GanttTask) => string) => [
  {
    name: 'text',
    label: '',
    tree: true,
    width: '*',
    template: (task: GanttTask) => {
      if (task.type === 'project') {
        return `<span class="task-text">${task.text}</span>`;
      }
      const taskColor = getTaskColor(task);
      return `<div style="display: flex; align-items: center; height: 100%; position: relative;">
        <div class="task-indicator" style="position: absolute; left: 0px; width: 2px; height: 24px; background-color: ${taskColor}; border-radius: 1px;"></div>
        <span class="gantt-ellipsis" style="margin-left: 16px;" title="${task.text}">${task.text}</span>
      </div>`;
    },
  },
];
