'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material';
import { TimelineTask } from 'data/project/timeline-data';
import gantt, { GanttConfigOptions } from 'dhtmlx-gantt';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import CreateTaskTextTemplate from 'components/sections/project/common/CreateTaskTextTemplate';
import {
  createGanttConfig,
  createPreviewColumnTemplate,
  createTimelineGridRowClassTemplate,
  createTimelineTaskClassTemplate,
  createTimelineTaskRowClassTemplate,
} from 'components/sections/project/common/dhtmlxGantt';

interface UseTimelineGanttPreviewOptions {
  tasks: TimelineTask[];
  getTaskColor: (task: TimelineTask) => string;
}

export const useTimelineGanttPreview = ({
  tasks,
  getTaskColor,
}: UseTimelineGanttPreviewOptions) => {
  const ganttContainer = useRef<HTMLDivElement | null>(null);
  const theme = useTheme();
  const { down } = useBreakpoints();
  const downXl = down('xl');

  useEffect(() => {
    if (!ganttContainer.current || tasks.length === 0) return;

    const g: GanttConfigOptions = gantt;

    const config = createGanttConfig('timeline', theme.direction);
    Object.assign(g.config, config);

    g.config.grid_width = downXl ? 200 : 360;

    g.config.columns = createPreviewColumnTemplate(getTaskColor);

    g.config.drag_move = false;
    g.config.drag_resize = false;
    g.config.drag_progress = false;
    g.config.drag_links = false;
    g.config.readonly = true;

    g.templates.task_class = createTimelineTaskClassTemplate(g);
    g.templates.grid_row_class = createTimelineGridRowClassTemplate(g);
    g.templates.task_row_class = createTimelineTaskRowClassTemplate(g);
    g.templates.grid_open = () => '';

    g.templates.task_text = (start: any, end: any, task: any) => {
      const taskColor = getTaskColor(task);
      const peopleCount = task.users ? task.users.length : 0;
      return CreateTaskTextTemplate(task, taskColor, theme, peopleCount);
    };

    g.init(ganttContainer.current);

    const expandedTasks = tasks.map((task) => ({
      ...task,
      $open: task.type === 'project' ? true : (task as any).$open,
    }));

    g.parse({
      data: expandedTasks,
      links: [],
    });

    const groupColorMap = new Map<string, string>();
    tasks.forEach((task) => {
      if (task.group && !groupColorMap.has(task.group)) {
        groupColorMap.set(task.group, getTaskColor(task));
      }
    });

    const applyTaskBorderColors = () => {
      if (!ganttContainer.current) return;
      requestAnimationFrame(() => {
        if (!ganttContainer.current) return;
        groupColorMap.forEach((color, groupId) => {
          const selector = `.gantt_task_line.group-${groupId}`;
          const rowSelector = `.gantt_row.group-${groupId} .gantt_cell`;
          ganttContainer.current?.querySelectorAll(selector).forEach((el) => {
            (el as HTMLElement).style.setProperty('border-color', color, 'important');
          });
          ganttContainer.current?.querySelectorAll(rowSelector).forEach((el) => {
            (el as HTMLElement).style.setProperty('border-color', color, 'important');
          });
        });
      });
    };

    const observer = new MutationObserver(applyTaskBorderColors);
    observer.observe(ganttContainer.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });

    applyTaskBorderColors();

    return () => {
      observer.disconnect();
      g.clearAll();
    };
  }, [tasks, theme, getTaskColor, downXl]);

  return { ganttContainer };
};
