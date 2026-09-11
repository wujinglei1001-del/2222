'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material';
import { GanttTask, ganttLinks } from 'data/project/gantt-data';
import gantt from 'dhtmlx-gantt';
import {
  bindTaskCompleteCheckbox,
  configureGanttChart,
  searchGanttTasks,
} from 'components/sections/project/common/dhtmlxGantt';
import { normalizeChartTaskDates } from 'components/sections/project/common/ganttTaskFormUtils';
import { clearGanttContainer, initGanttOnContainer } from './ganttInstance';
import { useGanttGridCollapse } from './useGanttGridCollapse';

interface UseGanttChartOptions {
  onTaskClick?: (task: GanttTask) => void;
}

export const useGanttChart = (initialTasks: GanttTask[], options?: UseGanttChartOptions) => {
  const ganttContainer = useRef<HTMLDivElement | null>(null);
  const isGanttReady = useRef(false);
  const onTaskClickRef = useRef(options?.onTaskClick);
  onTaskClickRef.current = options?.onTaskClick;
  const theme = useTheme();
  const [tasks, setTasks] = useState<GanttTask[]>(initialTasks);
  const [originalTasks, setOriginalTasks] = useState<GanttTask[]>(initialTasks);
  const [isChartReady, setIsChartReady] = useState(false);

  const { expandedGridWidth, gridDividerLeft, isGridExpanded, toggleGridWidth, syncLayout } =
    useGanttGridCollapse(ganttContainer, isChartReady);

  const renderAndSyncLayout = useCallback(() => {
    gantt.render();
    requestAnimationFrame(syncLayout);
  }, [syncLayout]);

  useEffect(() => {
    if (!ganttContainer.current) return;

    const container = ganttContainer.current;

    configureGanttChart(gantt, theme, expandedGridWidth);
    initGanttOnContainer(container);
    gantt.parse({ data: tasks, links: ganttLinks });

    const unbindTaskCompleteCheckbox = bindTaskCompleteCheckbox(
      container,
      gantt,
      (taskId, completed) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, completed } : task)),
        );
      },
      (task) => onTaskClickRef.current?.(normalizeChartTaskDates(task)),
    );

    isGanttReady.current = true;
    setIsChartReady(true);
    requestAnimationFrame(syncLayout);

    return () => {
      unbindTaskCompleteCheckbox();
      clearGanttContainer(container);
      isGanttReady.current = false;
      setIsChartReady(false);
    };
  }, [theme.direction]);

  useEffect(() => {
    if (!isGanttReady.current) return;

    configureGanttChart(gantt, theme, expandedGridWidth);
    renderAndSyncLayout();
  }, [theme, expandedGridWidth, renderAndSyncLayout]);

  useEffect(() => {
    if (!isGanttReady.current) return;

    gantt.parse({ data: tasks, links: ganttLinks });
    renderAndSyncLayout();
  }, [tasks, renderAndSyncLayout]);

  const addTask = (newTask: GanttTask) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      setOriginalTasks(updatedTasks);
      return updatedTasks;
    });
  };

  const updateTask = (taskId: string, updatedTask: GanttTask) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) => (task.id === taskId ? updatedTask : task));
      setOriginalTasks(updatedTasks);
      return updatedTasks;
    });
  };

  const searchTasks = (searchTerm: string) => {
    setTasks(searchGanttTasks(originalTasks, searchTerm));
  };

  return {
    ganttContainer,
    tasks,
    setTasks,
    addTask,
    updateTask,
    searchTasks,
    gridDividerLeft,
    isGridExpanded,
    toggleGridWidth,
    isChartReady,
  };
};
