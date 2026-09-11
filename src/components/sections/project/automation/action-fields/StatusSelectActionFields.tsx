'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, Stack, Typography } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';
import { STATUS_OPTIONS } from '../common/constants';
import type { AutomationFormValues } from '../useCreateAutomationForm';

interface StatusSelectActionFieldsProps {
  index: number;
}

const StatusSelectActionFields = ({ index }: StatusSelectActionFieldsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AutomationFormValues>();

  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Status
      </Typography>
      <Controller
        control={control}
        name={`actions.${index}.params.status`}
        render={({ field }) => (
          <StyledTextField
            select
            size="medium"
            value={field.value ?? ''}
            onChange={field.onChange}
            error={!!errors.actions?.[index]?.params?.status}
            helperText={errors.actions?.[index]?.params?.status?.message}
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
  );
};

export default StatusSelectActionFields;
