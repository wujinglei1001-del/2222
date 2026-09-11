'use client';

import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, Stack, Typography } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';
import type { AutomationFormValues } from '../useCreateAutomationForm';

interface FromToSelectConditionFieldsProps {
  index: number;
  options: readonly string[];
  renderOption?: (option: string) => ReactNode;
  renderValue?: (selected: unknown) => ReactNode;
}

const FromToSelectConditionFields = ({
  index,
  options,
  renderOption,
  renderValue,
}: FromToSelectConditionFieldsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AutomationFormValues>();

  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flex: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          From
        </Typography>
        <Controller
          control={control}
          name={`conditions.${index}.fromValue`}
          render={({ field }) => (
            <StyledTextField
              select
              size="medium"
              sx={{ flex: 1 }}
              value={field.value ?? ''}
              onChange={field.onChange}
              error={!!errors.conditions?.[index]?.fromValue}
              helperText={errors.conditions?.[index]?.fromValue?.message}
              slotProps={renderValue ? { select: { renderValue } } : undefined}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {renderOption ? renderOption(option) : option}
                </MenuItem>
              ))}
            </StyledTextField>
          )}
        />
      </Stack>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flex: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          To
        </Typography>
        <Controller
          control={control}
          name={`conditions.${index}.toValue`}
          render={({ field }) => (
            <StyledTextField
              select
              size="medium"
              sx={{ flex: 1 }}
              value={field.value ?? ''}
              onChange={field.onChange}
              error={!!errors.conditions?.[index]?.toValue}
              helperText={errors.conditions?.[index]?.toValue?.message}
              slotProps={renderValue ? { select: { renderValue } } : undefined}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {renderOption ? renderOption(option) : option}
                </MenuItem>
              ))}
            </StyledTextField>
          )}
        />
      </Stack>
    </Stack>
  );
};

export default FromToSelectConditionFields;
