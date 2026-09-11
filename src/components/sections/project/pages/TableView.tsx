'use client';

import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ProjectHeader from 'components/sections/project/common/ProjectHeader';
import {
  ProjectBottomRightActions,
  ProjectLeftActions,
  ProjectTopRightActions,
  TimelineViewType,
} from 'components/sections/project/common/ProjectHeaderActions';
import TableViewMain from 'components/sections/project/table-view';

const TableView = () => {
  const [view, setView] = useState<TimelineViewType>('dayGridMonth');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const handleTaskSubmit = () => {
    console.log('Add task (table view)');
  };

  const handleSearch = (searchTerm: string) => {
    console.log('Search table view:', searchTerm);
  };

  const handleDuplicate = () => {
    console.log('Duplicate table view');
  };

  const handleExport = () => {
    console.log('Export table view');
  };

  const handleArchive = () => {
    console.log('Archive table view');
  };

  const handleDelete = () => {
    console.log('Delete table view');
  };

  const handleShare = () => {
    console.log('Share table view');
  };

  return (
    <Grid container>
      <Grid size={12}>
        <ProjectHeader
          title="Name of the Project"
          subtitle=""
          onTaskSubmit={handleTaskSubmit}
          topActions={<ProjectTopRightActions onShare={handleShare} />}
          toolbar={{
            left: (
              <ProjectLeftActions
                onAddClick={() => {
                  setTaskDialogOpen(true);
                }}
                onSearch={handleSearch}
              />
            ),
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
          onTaskDialogOpenChange={setTaskDialogOpen}
        />
      </Grid>
      <Grid size={12}>
        <Paper sx={{ p: { xs: 3, md: 5 } }}>
          <TableViewMain />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TableView;
