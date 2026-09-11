import { type Theme } from '@mui/material';
import { months } from 'data/months';

type GanttDirection = Theme['direction'];
type GanttType = 'timeline' | 'gantt';

const createGanttLayout = (direction: GanttDirection) => {
  const gridView = { view: 'grid', id: 'grid', scrollX: 'scrollHor', scrollY: 'scrollVer' };
  const timelineView = {
    view: 'timeline',
    id: 'timeline',
    scrollX: 'scrollHor',
    scrollY: 'scrollVer',
  };
  const verticalScrollbarView = { view: 'scrollbar', id: 'scrollVer', scroll: 'y' };
  const horizontalScrollbarView = { view: 'scrollbar', id: 'scrollHor', scroll: 'x', height: 20 };
  const resizerView = { resizer: true, width: 1 };

  return {
    css: 'gantt_container',
    rows: [
      {
        cols:
          direction === 'rtl'
            ? [verticalScrollbarView, timelineView, resizerView, gridView]
            : [gridView, resizerView, timelineView, verticalScrollbarView],
      },
      horizontalScrollbarView,
    ],
  };
};

export const createGanttConfig = (
  type: GanttType = 'gantt',
  direction: GanttDirection = 'ltr',
) => ({
  xml_date: '%d-%m-%Y',
  rtl: direction === 'rtl',
  layout: createGanttLayout(direction),
  fit_tasks: true,
  open_tree_initially: true,
  ...(type === 'timeline' && {
    open_tree_initially: true,
    show_tree: true,
  }),

  scales: [
    {
      unit: 'month',
      step: 1,
      format: (date: Date) => `${months[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`,
    },
    {
      unit: 'week',
      step: 1,
      format: (date: Date) => {
        const weekStart = new Date(date);
        const weekEnd = new Date(date);
        weekEnd.setDate(weekStart.getDate() + 6);

        const startDay = weekStart.getDate();
        const endDay = weekEnd.getDate();
        return `w${Math.ceil(startDay / 7)} ${startDay}-${endDay}`;
      },
    },
  ],

  row_height: 64,
  grid_header_height: 68,
  bar_height: type === 'timeline' ? 52 : 32,
  scale_height: 68,
  autosize: true,
  autofit: false,
  min_column_width: 312,
  grid_width: 360,
  readonly: false,
  details_on_dblclick: false,
  details_on_create: false,
  drag_resize: false,
  drag_progress: false,
  drag_links: type === 'timeline' ? false : true,
  drag_lightbox: false,
  order_branch: 'marker',
  drag_move: true,
  show_progress: type === 'timeline' ? false : true,
});
