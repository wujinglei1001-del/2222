'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Box, MenuItem, Stack, Typography } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';
import { PRIORITY_OPTIONS, getPriorityDotColor } from '../common/constants';
import type { AutomationFormValues } from '../useCreateAutomationForm';

interface ChangePriorityActionFieldsProps {
  index: number;
}

const ChangePriorityActionFields = ({ index }: ChangePriorityActionFieldsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AutomationFormValues>();

  const renderSelected = (selected: unknown) => {
    const value = String(selected ?? '');
    return (
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: getPriorityDotColor(value),
            flexShrink: 0,
          }}
        />
        <Typography variant="body2">{value}</Typography>
      </Stack>
    );
  };

  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flex: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          From
        </Typography>
        <Controller
          control={control}
          name={`actions.${index}.params.fromPriority`}
          render={({ field }) => (
            <StyledTextField
              select
              size="medium"
              sx={{ flex: 1 }}
              value={field.value ?? ''}
              onChange={field.onChange}
              error={!!errors.actions?.[index]?.params?.fromPriority}
              helperText={errors.actions?.[index]?.params?.fromPriority?.message}
              slotProps={{
                select: {
                  renderValue: renderSelected,
                },
              }}
            >
              {PRIORITY_OPTIONS.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      mr: 1.5,
                      bgcolor: getPriorityDotColor(priority),
                      flexShrink: 0,
                    }}
                  />
                  {priority}
                </MenuItem>
              ))}
            </StyledTextField>
          )}
        />
      </Stack>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flex: 1 }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          To
        </Typography>
        <Controller
          control={control}
          name={`actions.${index}.params.newPriority`}
          render={({ field }) => (
            <StyledTextField
              select
              size="medium"
              sx={{ flex: 1 }}
              value={field.value ?? ''}
              onChange={field.onChange}
              error={!!errors.actions?.[index]?.params?.newPriority}
              helperText={errors.actions?.[index]?.params?.newPriority?.message}
              slotProps={{
                select: {
                  renderValue: renderSelected,
                },
              }}
            >
              {PRIORITY_OPTIONS.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      mr: 1.5,
                      bgcolor: getPriorityDotColor(priority),
                      flexShrink: 0,
                    }}
                  />
                  {priority}
                </MenuItem>
              ))}
            </StyledTextField>
          )}
        />
      </Stack>
    </Stack>
  );
};

export default ChangePriorityActionFields;
