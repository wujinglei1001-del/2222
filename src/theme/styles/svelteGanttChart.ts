import { type Theme } from '@mui/material';

const svelteGanttChart = (theme: Theme) => {
  const { vars, typography, direction, transitions, breakpoints } = theme;

  return {
    '& .column-header-row': {
      height: '28px !important',
    },
    '& .column-header-cell': {
      borderRight: direction === 'ltr' ? `1px !important` : `0px !important`,
      borderLeft: direction === 'rtl' ? `1px !important` : `0px !important`,
      borderTop: `0px !important`,
      borderColor: `${vars.palette.divider} !important`,
      borderStyle: 'solid !important',
      borderBottom: `1px solid ${vars.palette.divider} !important`,
      fontWeight: 'bold !important',
      wordSpacing: '5px !important',
      pointerEvents: 'none',
      '&.sticky': {
        justifyContent: 'flex-start !important',
        padding: '0px 8px',
      },
    },
    '& .header-container .column-header-row:nth-of-type(2)': {
      color: `${vars.palette.text.disabled} !important`,
    },
    '& .header-container .column-header-row:nth-of-type(1)': {
      borderTop: `1px solid ${vars.palette.divider} !important`,

      '& .column-header-cell': {
        paddingLeft: direction === 'ltr' ? '15px !important' : 'unset',
        paddingRight: direction === 'rtl' ? '15px !important' : 'unset',
      },
    },
    '& .sg-table': {
      transition: transitions.create(['width'], {
        duration: 300,
        easing: 'ease-in-out',
      }),
      overflow: 'hidden',
    },
    '& .sg-table-body-cell': {
      backgroundColor: `${vars.palette.background.paper} !important`,
      width: '130px !important',
      [breakpoints.down('sm')]: {
        width: '90px !important',
      },
    },
    '& .sg-timeline': {
      marginLeft: 'unset !important',
      marginRight: 'unset !important',
    },
    '& .sg-table-body': {
      paddingBottom: '0px !important',
      borderLeft:
        direction === 'rtl'
          ? `1px solid ${vars.palette.divider} !important`
          : `0px solid ${vars.palette.divider} !important`,
      borderRight:
        direction === 'ltr'
          ? `1px solid ${vars.palette.divider} !important`
          : `0px solid ${vars.palette.divider} !important`,
    },
    '& .sg-task': {
      transition: transitions.create(['all'], {
        duration: 200,
        easing: 'ease-in',
      }),
      borderRadius: '4px !important',
      color: vars.palette.primary.darker,
      backgroundColor: vars.palette.primary.lighter,
      fontSize: typography.subtitle2.fontSize,
      fontWeight: 500,
      opacity: '1 !important',
      display: 'inline-flex !important',
      alignItems: 'center !important',
      border: `1px solid ${vars.palette.neutral.contrastText} !important`,
      marginLeft: '3px !important',
    },
    '& .sg-task-content': {
      width: '100%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      display: 'inline-block !important',
      position: 'relative !important',
      height: '20px !important',
      userSelect: 'all !important',
      lineHeight: '18.2px',
      paddingLeft: direction === 'ltr' ? '8px !important' : 'unset',
      paddingRight: direction === 'rtl' ? '8px !important' : 'unset',
    },
    '& .sg-resize': {
      zIndex: 0,

      display: 'none',
    },
    '& .sg-table-header': {
      paddingTop: '16px !important',
      paddingLeft: direction === 'ltr' ? '15px !important' : 'unset',
      paddingRight: direction === 'rtl' ? '15px !important' : 'unset',
      backgroundColor: 'transparent !important',
      borderTop: `1px solid ${vars.palette.divider} !important`,
      borderRight:
        direction === 'ltr'
          ? `1px solid ${vars.palette.divider} !important`
          : `0px solid ${vars.palette.divider} !important`,
      borderLeft:
        direction === 'rtl'
          ? `1px solid ${vars.palette.divider} !important`
          : `0px solid ${vars.palette.divider} !important`,

      borderBottom: `1px solid ${vars.palette.divider} !important`,
    },
    '& .sg-table-header-cell': {
      fontWeight: 'bold !important',
      display: 'inline !important',
    },
    '& .sg-header': {
      marginLeft: 'unset',
      backgroundColor: vars.palette.background.elevation1,
      color: vars.palette.text.secondary,
      pointerEvents: 'none',
      paddingRight: '0px !important',
    },
    // Custom gradient styles similar to Svelte Gantt example
    '& .row-gradient': {
      background: 'linear-gradient(135deg, rgb(236, 72, 153), rgb(139, 92, 246)) !important',
      opacity: '0.5 !important',
    },
    // Drag and drop styles - only for level-1 rows
    '& .sg-table-row-level-1.draggable-row': {
      cursor: 'grab !important',
      '&:active': {
        cursor: 'grabbing !important',
      },
    },
    '& .dragging': {
      opacity: '0.5 !important',
      transform: 'rotate(2deg) !important',
      transition: 'all 0.2s ease !important',
      zIndex: '1000 !important',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2) !important',
    },
    // '& .drag-over': {
    //   borderTop: `3px solid ${vars.palette.primary.main} !important`,
    //   backgroundColor: `${vars.palette.primary.lighter}20 !important`,
    // },
    '& .sg-table-row.drag-over-before': {
      borderTop: `3px solid ${vars.palette.primary.main} !important`,
    },
    '& .sg-table-row.drag-over-after': {
      borderBottom: `3px solid ${vars.palette.primary.main} !important`,
    },
    '& .sg-table-row': {
      transition: 'all 0.2s ease !important',
      '&:hover': {
        backgroundColor: `${vars.palette.action.hover} !important`,
      },
    },
  };
};

export default svelteGanttChart;
