'use client';

import { useFormContext } from 'react-hook-form';
import { Stack, TextField } from '@mui/material';
import type { CreateProjectFormValues } from 'components/sections/project/create-project/useCreateProjectStepper';

const ProjectTitle = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateProjectFormValues>();

  return (
    <Stack sx={{ gap: 2 }}>
      <TextField
        fullWidth
        label="Project title"
        variant="filled"
        error={Boolean(errors.projectTitle)}
        helperText={errors.projectTitle?.message}
        {...register('projectTitle')}
      />
    </Stack>
  );
};

export default ProjectTitle;
