'use client';

import { Paper } from '@mui/material';
import CreateProjectForm from 'components/sections/project/create-project/CreateProjectForm';

const CreateProject = () => {
  return (
    <Paper background={2} sx={{ height: 1 }}>
      <CreateProjectForm />
    </Paper>
  );
};

export default CreateProject;
