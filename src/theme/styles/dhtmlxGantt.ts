import { type Theme } from '@mui/material';

const dhtmlxGantt = (theme: Theme) => {
  const { vars } = theme;

  return {
    height: 1,
    width: 1,
    overflow: 'hidden',
    position: 'relative',
    '--dhx-gantt-container-background': `${vars.palette.background.paper} !important`,
    '--dhx-gantt-base-colors-select': `${vars.palette.primary.lighter} !important`,
    '--dhx-gantt-base-colors-hover-color': `${vars.palette.primary.lighter} !important`,
    '--dhx-gantt-base-colors-icons-hover': `${vars.palette.primary.lighter} !important`,
    '--dhx-gantt-grid-scale-background': `${vars.palette.background.paper} !important`,
    '--dhx-gantt-timeline-scale-background': `${vars.palette.background.paper} !important`,
    '--dhx-gantt-task-row-background': `${vars.palette.background.paper} !important`,
    '--dhx-gantt-task-row-background--odd': `${vars.palette.background.paper} !important`,
    '--dhx-gantt-default-border': `1px solid ${vars.palette.dividerLight}`,
    '--dhx-gantt-scale-border-horizontal': `1px solid ${vars.palette.dividerLight}`,
    '--dhx-gantt-scale-border-vertical': `1px solid ${vars.palette.dividerLight}`,
    '--dhx-gantt-timeline-scale-border-vertical': `1px solid ${vars.palette.dividerLight}`,
    '--dhx-gantt-timeline-scale-color': vars.palette.text.secondary,
    '--dhx-gantt-task-row-border': `1px solid ${vars.palette.dividerLight}`,
    '--dhx-gantt-grid-scale-border-vertical': `1px solid ${vars.palette.dividerLight}`,
    '--dhx-gantt-task-color': vars.palette.text.primary,

    '& .gantt_task_scale .gantt_scale_cell:last-child': {
      borderRight: 'none !important',
    },
    '& .gantt_container': {
      border: 'none',
      height: '100%',
    },

    '& .gantt_layout_root, & .gantt_layout': {
      height: '100%',
    },
    '& .gantt_cell_tree': {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      paddingRight: '24px',
      paddingLeft: '0px',
    },

    '& .gantt_cell_tree .gantt_tree_icon': {
      order: 2,
      marginLeft: 'auto',
    },

    '& .gantt_cell_tree .gantt_tree_text': {
      order: 1,
      flex: 1,
      marginRight: '8px',
    },

    '& .gantt_row.data-type-project': {
      width: '100% !important',
      backgroundColor: `${vars.palette.background.paper} !important`,
    },
    '& .gantt_row.data-type-project .gantt_cell_tree .gantt_tree_content': {
      fontWeight: '700 !important',
      fontSize: '20px !important',
      color: `${vars.palette.text.primary} !important`,
      paddingLeft: '40px',
    },

    '& .gantt_row.data-type-project .gantt_cell[data-column-name="drag"], & .gantt_row.data-type-project .gantt_cell[data-column-name="checkbox"]':
      {
        display: 'none !important',
      },
    '& .gantt_row.data-type-project .gantt_cell.gantt_last_cell.gantt_cell_tree': {
      flex: '1 !important',
      width: '100% !important',
    },

    '& .gantt_row.data-type-task .gantt_cell_tree .gantt_tree_content': {
      paddingLeft: 0,
      fontWeight: '400 !important',
      fontSize: '14px !important',
      color: `${vars.palette.text.secondary} !important`,
    },
    '& .gantt_row.data-type-task .gantt_tree_indent': {
      display: 'none !important',
    },

    '& .gantt-ellipsis': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'block',
      maxWidth: '100%',
      cursor: 'default',
    },

    '& .gantt_tree_icon.gantt_blank': {
      display: 'none !important',
    },

    '& .drag-handle': {
      marginRight: '16px',
      color: `${vars.palette.text.primary} !important`,
      transition: 'color 0.2s ease',
      '&:hover': {
        color: `${vars.palette.neutral.light} !important`,
      },
    },

    '& .gantt-checkbox-wrap': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      marginRight: '10px',
    },
    '& .gantt-checkbox': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      minWidth: 16,
      minHeight: 16,
      padding: 0,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      appearance: 'none',
      flexShrink: 0,
    },
    '& .gantt-checkbox-box': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      pointerEvents: 'none',
    },
    '& .gantt-checkbox-icon': {
      display: 'block',
      flexShrink: 0,
    },

    '& .task-indicator': {
      transition: 'opacity 0.2s ease',
      '&:hover': {
        opacity: '0.8',
      },
    },

    '& .gantt_grid_head_cell': {
      borderRight: `1px solid ${vars.palette.dividerLight} !important`,
      '&:last-child': {
        borderRight: 'none !important',
      },
    },

    '& .gantt_grid_head_drag, & .gantt_grid_head_checkbox': {
      display: 'none !important',
    },

    '& .gantt_grid_head_cell.gantt_grid_head_text': {
      width: '100% !important',
      flex: '1 !important',
      display: 'none !important',
    },

    '& .gantt_cell[data-column-name="drag"], & .gantt_cell[data-column-name="checkbox"]': {
      padding: '0 !important',
      textAlign: 'center !important',
      width: 'unset !important',
    },

    '& .gantt_cell[data-column="text"]': {
      width: '100% !important',
      flex: '1 !important',
    },

    '& .gantt_tree_icon': {
      background: 'none !important',
      height: 24,
      width: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      '& svg': {
        width: '100%',
        height: '100%',
        color: `${vars.palette.text.secondary} !important`,
        transition: 'color 0.2s ease',
      },
      '&:hover svg': {
        color: `${vars.palette.primary.main} !important`,
      },
    },

    '& .gantt_tree_icon.gantt_folder_open, & .gantt_tree_icon.gantt_folder_closed, & .gantt_tree_icon.gantt_file':
      {
        display: 'none !important',
      },

    '& .gantt_tree_icon.gantt_close::before, & .gantt_tree_icon.gantt_open::before': {
      display: 'none !important',
    },

    '& .today': {
      position: 'absolute',
      top: 0,
      height: '100%',
      pointerEvents: 'none',
    },
  };
};

export default dhtmlxGantt;
