'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Dialog, DialogContent } from '@mui/material';
import paths from 'routes/paths';
import type { ProjectListFilter } from 'components/sections/project/common/projectMemberStyles';
import TaskDetails from 'components/sections/project/pages/TaskDetails';
import ProjectGrid from 'components/sections/project/project-list/ProjectGrid';
import ProjectListHeader from 'components/sections/project/project-list/ProjectListHeader';
import ProjectListTable from 'components/sections/project/project-list/ProjectListTable';

const ProjectList = () => {
  const router = useRouter();
  const [viewType, setViewType] = useState<'list' | 'grid'>('list');
  const [selectedFilter, setSelectedFilter] = useState<ProjectListFilter>('Running');
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  return (
    <Container maxWidth="lg">
      <ProjectListHeader
        workspaceName="TW Workspace"
        workspaceDescription="TW Workspace is the main hub for managing our team's projects, tracking progress, and keeping everyone aligned. It provides a clear overview of goals, timelines, and responsibilities so that collaboration stays smooth and efficient across every department involved."
        onAddProject={() => router.push(paths.createProject)}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onViewTypeChange={setViewType}
        viewType={viewType}
        inviteButtonIcon="material-symbols:outgoing-mail-outline"
      />
      {viewType === 'grid' ? (
        <ProjectGrid
          onItemClick={() => {
            setTaskDialogOpen(true);
          }}
        />
      ) : (
        <ProjectListTable
          onItemClick={() => {
            setTaskDialogOpen(true);
          }}
        />
      )}
      <Dialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        fullWidth
        maxWidth={false}
        scroll="paper"
        slotProps={{
          paper: {
            sx: {
              width: '100%',
              maxWidth: { xs: '100%', sm: 552, md: 820, lg: 1120 },
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: 2,
              mx: 2,
            },
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TaskDetails onClose={() => setTaskDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ProjectList;
