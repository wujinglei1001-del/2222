'use client';

import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import {
  getNextTaskId,
  labelOptions,
} from 'components/sections/project/create-project/common/helpers';
import type { CreateProjectFormValues } from 'components/sections/project/create-project/useCreateProjectStepper';
import StyledTextField from 'components/styled/StyledTextField';

const Tasks = () => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<CreateProjectFormValues>();

  const tasks = useWatch({ control, name: 'tasks' }) ?? [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tasks',
  });

  const getInitialTaskData = () => {
    const taskIndex = tasks.filter((task) => task?.value?.trim()).length;
    const start = dayjs().add(taskIndex, 'day');
    const end = dayjs().add(taskIndex + 1, 'day');
    const label = labelOptions[taskIndex % labelOptions.length];

    return {
      value: '',
      id: getNextTaskId(tasks),
      label,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  };

  return (
    <Stack sx={{ gap: 2.5 }}>
      <Stack sx={{ gap: 1.5 }}>
        {fields.map((field, index) => (
          <Box
            key={field.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
                minWidth: 48,
              }}
            >
              Task {index + 1}
            </Typography>
            <StyledTextField
              fullWidth
              placeholder={`Task ${index + 1}`}
              error={Boolean(errors.tasks?.[index]?.value)}
              helperText={errors.tasks?.[index]?.value?.message}
              {...register(`tasks.${index}.value`)}
            />
            <IconButton
              aria-label="Remove task"
              onClick={() => remove(index)}
              disabled={fields.length <= 1}
              sx={{ color: 'text.secondary' }}
            >
              <IconifyIcon icon="material-symbols:close-rounded" fontSize={20} />
            </IconButton>
          </Box>
        ))}
      </Stack>
      <Button
        variant="text"
        color="primary"
        sx={{ alignSelf: 'flex-start' }}
        startIcon={<IconifyIcon icon="material-symbols:add-rounded" fontSize={20} />}
        onClick={() => append(getInitialTaskData())}
      >
        Add another
      </Button>
    </Stack>
  );
};

export default Tasks;
