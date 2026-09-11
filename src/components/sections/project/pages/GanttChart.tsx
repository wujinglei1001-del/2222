'use client';

import { useCallback, useRef, useState } from 'react';
import { Box, Paper } from '@mui/material';
import { GanttTask, ganttTasks } from 'data/project/gantt-data';
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
  formDataToGanttTask,
  ganttTaskToFormData,
} from 'components/sections/project/common/ganttTaskFormUtils';
import { useChartTaskDialog } from 'components/sections/project/hooks/useChartTaskDialog';
import { useGanttChart } from 'components/sections/project/hooks/useGanttChart';

const GanttChart = () => {
  const [view, setView] = useState<TimelineViewType>('dayGridMonth');
  const taskClickBridge = useRef<(task: GanttTask) => void>(() => {});

  const fromFormData = useCallback(
    (formData: Parameters<typeof formDataToGanttTask>[0], editingTask?: GanttTask) =>
      formDataToGanttTask(
        formData,
        editingTask ? { taskId: editingTask.id, progress: editingTask.progress } : undefined,
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
  } = useGanttChart(ganttTasks, {
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
    toFormData: ganttTaskToFormData,
    fromFormData,
  });

  taskClickBridge.current = onTaskClick;

  const handleSearch = (searchTerm: string) => {
    searchTasks(searchTerm);
  };

  const handleDuplicate = () => {
    console.log('Duplicate gantt chart');
  };

  const handleExport = () => {
    console.log('Export gantt chart');
  };

  const handleArchive = () => {
    console.log('Archive gantt chart');
  };

  const handleDelete = () => {
    console.log('Delete gantt chart');
  };

  const handleShare = () => {
    console.log('Share gantt chart');
  };

  return (
    <Box>
      <ProjectHeader
        title="Name of the Project"
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
              '--dhx-gantt-link-background': theme.vars.palette.background.elevation3,
              '--dhx-gantt-link-background-hover': theme.vars.palette.divider,
              '--dhx-gantt-link-handle-size': '12px',
              '--dhx-gantt-icon-size': '12px',
              '--dhx-gantt-link-handle-offset': '6px',
              '--dhx-gantt-link-handle-background': theme.vars.palette.background.elevation2,
              '--dhx-gantt-task-border-radius': `${(theme.shape.borderRadius as number) * 2}px !important`,
              '& .gantt_task_progress': {
                borderRadius: `${(theme.shape.borderRadius as number) * 2}px !important`,
              },
              '& .gantt_task_content': {
                paddingLeft: '16px !important',
                paddingRight: '16px !important',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              '& .gantt_link_control div': {
                border: `2px solid ${theme.vars.palette.background.elevation3} !important`,
                marginBottom: '2px !important',
              },
              '& .gantt_selected .gantt_link_point': {
                '--dhx-gantt-link-handle-background': theme.vars.palette.background.elevation2,
              },
              '& .gantt_link_control': {
                zIndex: '1 !important',
                '& div': {
                  display: 'block !important',
                  opacity: '1 !important',
                  visibility: 'visible !important',
                },
              },
              '& .gantt_task_line.group-group-1, & .gantt_row.group-group-1 .gantt_cell': {
                backgroundColor: theme.vars.palette.chBlue[100],
                borderColor: theme.vars.palette.primary.main,
                '& .gantt_task_progress': {
                  backgroundColor: theme.vars.palette.chBlue[200],
                },
              },
              '& .gantt_task_line.group-group-2, & .gantt_row.group-group-2 .gantt_cell': {
                backgroundColor: theme.vars.palette.chOrange[100],
                borderColor: theme.vars.palette.warning.main,
                '& .gantt_task_progress': {
                  backgroundColor: theme.vars.palette.chOrange[200],
                },
              },
              '& .gantt_task_line.group-group-3, & .gantt_row.group-group-3 .gantt_cell': {
                backgroundColor: theme.vars.palette.chGreen[100],
                borderColor: theme.vars.palette.success.main,
                '& .gantt_task_progress': {
                  backgroundColor: theme.vars.palette.chGreen[200],
                },
              },
            }),
          ]}
        />
      </Box>
    </Box>
  );
};

export default GanttChart;
