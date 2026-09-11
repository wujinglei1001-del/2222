'use client';

import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { projectListData } from 'data/project/project-list';
import ProjectCard from './ProjectCard';

type ProjectGridProps = {
  onItemClick?: (projectId: number) => void;
};

const ProjectGrid = ({ onItemClick }: ProjectGridProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number>(projectListData[0]?.id || 0);

  const handleProjectClick = (id: number) => {
    setSelectedProjectId(id);
    if (onItemClick) onItemClick(id);
  };

  return (
    <Box sx={{ width: 1, px: { xs: 1, md: 4 }, py: 3 }}>
      <Grid container spacing={3}>
        {projectListData.map((project) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
            <ProjectCard
              project={project}
              onClick={() => handleProjectClick(project.id)}
              selected={selectedProjectId === project.id}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectGrid;
