'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { syncGanttGridLayout } from 'components/sections/project/common/dhtmlxGantt';

export const COLLAPSED_GRID_WIDTH = 150;

export const useGanttGridCollapse = (
  ganttContainer: RefObject<HTMLDivElement | null>,
  isChartReady: boolean,
) => {
  const { down } = useBreakpoints();
  const isSmallScreen = down('sm');
  const expandedGridWidth = isSmallScreen ? 270 : 360;
  const gridWidthRef = useRef(COLLAPSED_GRID_WIDTH);

  const [gridWidth, setGridWidth] = useState(() =>
    isSmallScreen ? COLLAPSED_GRID_WIDTH : expandedGridWidth,
  );
  const [gridDividerLeft, setGridDividerLeft] = useState(expandedGridWidth);

  gridWidthRef.current = gridWidth;

  const isGridExpanded = gridWidth === expandedGridWidth;

  const syncLayout = useCallback(() => {
    const container = ganttContainer.current;
    if (!container) return;

    const dividerLeft = syncGanttGridLayout(container, gridWidthRef.current);
    if (dividerLeft !== null) {
      setGridDividerLeft(dividerLeft);
    }
  }, [ganttContainer]);

  const toggleGridWidth = useCallback(() => {
    setGridWidth((currentWidth) =>
      currentWidth === COLLAPSED_GRID_WIDTH ? expandedGridWidth : COLLAPSED_GRID_WIDTH,
    );
  }, [expandedGridWidth]);

  useEffect(() => {
    setGridWidth(isSmallScreen ? COLLAPSED_GRID_WIDTH : expandedGridWidth);
  }, [isSmallScreen, expandedGridWidth]);

  useEffect(() => {
    if (!isChartReady) return;
    syncLayout();
  }, [gridWidth, isChartReady, syncLayout]);

  useEffect(() => {
    const container = ganttContainer.current;
    if (!isChartReady || !container) return;

    const observer = new ResizeObserver(syncLayout);
    observer.observe(container);

    return () => observer.disconnect();
  }, [isChartReady, syncLayout, ganttContainer]);

  return {
    expandedGridWidth,
    gridDividerLeft,
    isGridExpanded,
    toggleGridWidth,
    syncLayout,
  };
};
