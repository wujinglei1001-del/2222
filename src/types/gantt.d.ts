declare module 'dhtmlx-gantt' {
  export interface GanttConfigOptions {
    config: {
      xml_date?: string;
      fit_tasks?: boolean;
      open_tree_initially?: boolean;
      scale_width?: number;
      scales?: Array<{
        unit: 'day' | 'week' | 'month' | 'year';
        step: number;
        format: string | ((date: Date) => string);
      }>;
      autosize?: boolean;
      autofit?: boolean;
      row_height?: number;
      grid_header_height?: number;
      bar_height?: number;
      scale_height?: number;
      readonly?: boolean;
      details_on_dblclick?: boolean;
      details_on_create?: boolean;
      drag_resize?: boolean;
      drag_progress?: boolean;
      drag_links?: boolean;
      drag_lightbox?: boolean;
      rtl?: boolean;
      layout?: {
        css?: string;
        rows?: Array<{
          cols?: Array<{
            view?: string;
            id?: string;
            scroll?: string;
            scrollX?: string;
            scrollY?: string;
            resizer?: boolean;
            width?: number;
          }>;
          view?: string;
          id?: string;
          scroll?: string;
          height?: number;
        }>;
      };
      grid_width?: number;
      grid_resize?: boolean;
      order_branch?: boolean | 'marker';
      order_branch_free?: boolean;
      drag_move?: boolean;
      task_date?: string;
      columns?: Array<{
        name: string;
        label: string;
        tree?: boolean;
        width?: string | number;
        template?: (task: GanttTask) => string;
      }>;
    };
    templates: {
      task_class?: (start: Date, end: Date, task: GanttTask) => string;
      task_text?: (start: Date, end: Date, task: GanttTask) => string;
      task_height?: () => number;
      task_row_class?: (start: Date, end: Date, task: GanttTask) => string;
      grid_row_class?: (start: Date, end: Date, task: GanttTask) => string;
      grid_cell_class?: (start: Date, end: Date, task: GanttTask) => string;
      grid_open?: (item: GanttTask) => string;
    };
    $container?: HTMLElement;
    date: {
      date_to_str: (format: string) => (date: Date) => string;
    };
    posFromDate?: (date: Date) => number | null;
    getLayoutView?: (name: string) => {
      posFromDate?: (date: Date) => number | null;
      $task_data?: HTMLElement;
    };
    attachEvent(event: string, handler: (...args: any[]) => boolean | void): string | number;
    detachEvent(eventId: string | number): void;
    init(container: HTMLElement): void;
    parse(data: { data: GanttTask[]; links: GanttLink[] }): void;
    clearAll(): void;
    render(): void;
    getTask(id: string): GanttTask;
    updateTask(id: string): void;
    getChildren(id: string): string[];
    refreshData(): void;
  }

  const gantt: GanttConfigOptions;
  export default gantt;
}
