'use client';

import { useCallback, useRef, useState } from 'react';
import { Box, Paper } from '@mui/material';
import { TimelineTask, timelineTasks } from 'data/project/timeline-data';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import dhtmlxGantt from 'theme/styles/dhtmlxGantt';
import GanttGridToggleButton from 'components/sections/project/common/GanttGridToggleButton';
import ProjectHeader from 'components/sections/project/common/ProjectHeader';
import {
  ProjectBottomRightActions,
  ProjectLeftActions,
  ProjectTopRightActions,
  TimelineViewType,
} from 'components/sections/project/common/ProjectHeaderActions';
import {
  chartTaskToFormData,
  formDataToTimelineTask,
} from 'components/sections/project/common/ganttTaskFormUtils';
import { useChartTaskDialog } from 'components/sections/project/hooks/useChartTaskDialog';
import { useTimelineGantt } from 'components/sections/project/hooks/useTimelineGantt';

const TimelineView = () => {
  const [view, setView] = useState<TimelineViewType>('dayGridMonth');
  const taskClickBridge = useRef<(task: TimelineTask) => void>(() => {});

  const fromFormData = useCallback(
    (formData: Parameters<typeof formDataToTimelineTask>[0], editingTask?: TimelineTask) =>
      formDataToTimelineTask(
        formData,
        editingTask
          ? { taskId: editingTask.id, progress: editingTask.progress, users: editingTask.users }
          : undefined,
      ),
    [],
  );

  const {
    ganttContainer,
    addTask,
    updateTask,
    searchTasks,
    gridDividerLeft,
    isGridExpanded,
    toggleGridWidth,
    isChartReady,
  } = useTimelineGantt(timelineTasks, {
    onTaskClick: (task) => taskClickBridge.current(task),
  });

  const {
    onTaskClick,
    taskDialogOpen,
    taskDialogMode,
    taskDialogInitialValues,
    handleOpenCreateDialog,
    handleTaskDialogOpenChange,
    handleTaskSubmit,
  } = useChartTaskDialog({
    addTask,
    updateTask,
    toFormData: chartTaskToFormData,
    fromFormData,
  });

  taskClickBridge.current = onTaskClick;

  const handleSearch = (searchTerm: string) => {
    searchTasks(searchTerm);
  };

  const handleDuplicate = () => {
    console.log('Duplicate timeline');
  };

  const handleExport = () => {
    console.log('Export timeline');
  };

  const handleArchive = () => {
    console.log('Archive timeline');
  };

  const handleDelete = () => {
    console.log('Delete timeline');
  };

  const handleShare = () => {
    console.log('Share timeline');
  };

  return (
    <Box>
      <ProjectHeader
        title="My Timeline View"
        subtitle=""
        onTaskSubmit={handleTaskSubmit}
        topActions={<ProjectTopRightActions onShare={handleShare} />}
        toolbar={{
          left: <ProjectLeftActions onAddClick={handleOpenCreateDialog} onSearch={handleSearch} />,
          right: (
            <ProjectBottomRightActions
              view={view}
              onViewChange={setView}
              onDuplicate={handleDuplicate}
              onExport={handleExport}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          ),
        }}
        taskDialogOpen={taskDialogOpen}
        onTaskDialogOpenChange={handleTaskDialogOpenChange}
        taskDialogMode={taskDialogMode}
        taskDialogInitialValues={taskDialogInitialValues}
      />
      <Box sx={{ position: 'relative' }}>
        {isChartReady && (
          <GanttGridToggleButton
            gridDividerLeft={gridDividerLeft}
            isGridExpanded={isGridExpanded}
            onToggle={toggleGridWidth}
          />
        )}
        <Paper
          dir="ltr"
          ref={ganttContainer}
          sx={[
            dhtmlxGantt,
            (theme) => ({
              '--dhx-gantt-task-border': '2px solid !important',
              '--dhx-gantt-link-background': theme.vars.palette.divider,
              '--dhx-gantt-task-border-radius': `${(theme.shape.borderRadius as number) * 0}px ${(theme.shape.borderRadius as number) * 2}px ${(theme.shape.borderRadius as number) * 0}px ${(theme.shape.borderRadius as number) * 2}px !important`,
              '& .gantt_task_progress': {
                borderRadius: `${(theme.shape.borderRadius as number) * 2}px ${(theme.shape.borderRadius as number) * 4}px ${(theme.shape.borderRadius as number) * 2}px ${(theme.shape.borderRadius as number) * 4}px !important`,
              },
              '& .gantt_row.data-type-project': {
                borderBottom: `none !important`,
              },
              '& .gantt_task_content': {
                paddingLeft: '16px !important',
                paddingRight: '16px !important',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'left !important',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                justifyContent: 'center',
              },
              '& .gantt_task_line.group-planning, & .gantt_row.group-planning .gantt_cell, & .gantt_task_line.group-group-1, & .gantt_row.group-group-1 .gantt_cell':
                {
                  backgroundColor: theme.vars.palette.background.elevation1,
                  borderColor: theme.vars.palette.primary.main,
                  borderTop: 'none !important',
                  borderRight: 'none !important',
                },
              '& .gantt_task_line.group-development, & .gantt_row.group-development .gantt_cell, & .gantt_task_line.group-group-2, & .gantt_row.group-group-2 .gantt_cell':
                {
                  backgroundColor: theme.vars.palette.background.elevation1,
                  borderTop: 'none !important',
                  borderRight: 'none !important',
                  borderColor: theme.vars.palette.warning.main,
                },
              '& .gantt_task_line.group-testing, & .gantt_row.group-testing .gantt_cell, & .gantt_task_line.group-group-3, & .gantt_row.group-group-3 .gantt_cell':
                {
                  backgroundColor: theme.vars.palette.background.elevation1,
                  borderColor: theme.vars.palette.success.main,
                  borderTop: 'none !important',
                  borderRight: 'none !important',
                },
              '& .gantt_task_row': {
                borderBottom: `none !important`,
              },
              '& .gantt_row_task': {
                borderBottom: `none !important`,
              },
              '& .gantt_row.data-type-task.last-in-group': {
                borderBottom: `1px solid ${theme.vars.palette.divider} !important`,
              },
              '& .gantt_task_row.last-in-group, & .gantt_task_row.odd.last-in-group': {
                borderBottom: `1px solid ${theme.vars.palette.divider} !important`,
              },
              '& .hide-group-parent': {
                display: 'none !important',
              },
              '& .today': {
                background: `${theme.vars.palette.error.dark} !important`,
                width: '1px !important',
                zIndex: '10 !important',
              },
            }),
          ]}
        />
      </Box>
    </Box>
  );
};

export default TimelineView;
