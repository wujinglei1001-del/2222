import gantt from 'dhtmlx-gantt';

type GanttInstance = typeof gantt & { $container?: HTMLElement | null };

let ganttMountedContainer: HTMLElement | null = null;

export const initGanttOnContainer = (container: HTMLElement) => {
  if (ganttMountedContainer === container) return;

  if (ganttMountedContainer) {
    gantt.clearAll();
  }

  gantt.init(container);
  ganttMountedContainer = container;
};

export const clearGanttContainer = (container: HTMLElement) => {
  gantt.clearAll();
  container.innerHTML = '';
  if (ganttMountedContainer === container || (gantt as GanttInstance).$container === container) {
    ganttMountedContainer = null;
  }
};
