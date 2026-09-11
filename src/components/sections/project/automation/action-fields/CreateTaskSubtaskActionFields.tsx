'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, Stack, Typography } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';
import { LABEL_OPTIONS, PROJECT_OPTIONS, STATUS_OPTIONS } from '../common/constants';
import AutomationDatePicker from '../shared/AutomationDatePicker';
import type { AutomationFormValues } from '../useCreateAutomationForm';

interface CreateTaskSubtaskActionFieldsProps {
  index: number;
}

const CreateTaskSubtaskActionFields = ({ index }: CreateTaskSubtaskActionFieldsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AutomationFormValues>();

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack sx={{ gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Task name
        </Typography>
        <Controller
          control={control}
          name={`actions.${index}.params.taskName`}
          render={({ field }) => (
            <StyledTextField
              size="medium"
              fullWidth
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="Task name"
              error={!!errors.actions?.[index]?.params?.taskName}
              helperText={errors.actions?.[index]?.params?.taskName?.message}
            />
          )}
        />
      </Stack>
      <Stack sx={{ gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Project
        </Typography>
        <Controller
          control={control}
          name={`actions.${index}.params.project`}
          render={({ field }) => (
            <StyledTextField
              select
              size="medium"
              fullWidth
              value={field.value ?? ''}
              onChange={field.onChange}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected) => (selected ? String(selected) : 'Select project'),
                },
              }}
            >
              <MenuItem value="" disabled>
                Select project
              </MenuItem>
              {PROJECT_OPTIONS.map((project) => (
                <MenuItem key={project} value={project}>
                  {project}
                </MenuItem>
              ))}
            </StyledTextField>
          )}
        />
      </Stack>
      <Stack sx={{ gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Status
        </Typography>
        <Controller
          control={control}
          name={`actions.${index}.params.status`}
          render={({ field }) => (
            <StyledTextField
              select
              size="medium"
              fullWidth
              value={field.value ?? ''}
              onChange={field.onChange}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected) => (selected ? String(selected) : 'Select status'),
                },
              }}
            >
              <MenuItem value="" disabled>
                Select status
              </MenuItem>
              {STATUS_OPTIONS.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </StyledTextField>
          )}
        />
      </Stack>
      <Stack sx={{ gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Description
        </Typography>
        <Controller
          control={control}
          name={`actions.${index}.params.description`}
          render={({ field }) => (
            <StyledTextField
              size="medium"
              fullWidth
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="Write a description"
              multiline
              minRows={3}
            />
          )}
        />
      </Stack>
      <Stack direction="row" sx={{ gap: 2, minWidth: 0 }}>
        <Stack sx={{ gap: 1, flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            Start Date
          </Typography>
          <AutomationDatePicker name={`actions.${index}.params.startDate`} />
        </Stack>

        <Stack sx={{ gap: 1, flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            End Date
          </Typography>
          <AutomationDatePicker name={`actions.${index}.params.endDate`} />
        </Stack>
      </Stack>
      <Stack sx={{ gap: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Label
        </Typography>
        <Controller
          control={control}
          name={`actions.${index}.params.label`}
          render={({ field }) => (
            <StyledTextField
              select
              size="medium"
              fullWidth
              value={field.value ?? ''}
              onChange={field.onChange}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected) => (selected ? String(selected) : 'Select label'),
                },
              }}
            >
              <MenuItem value="" disabled>
                Select label
              </MenuItem>
              {LABEL_OPTIONS.map((label) => (
                <MenuItem key={label} value={label}>
                  {label}
                </MenuItem>
              ))}
            </StyledTextField>
          )}
        />
      </Stack>
    </Stack>
  );
};

export default CreateTaskSubtaskActionFields;
