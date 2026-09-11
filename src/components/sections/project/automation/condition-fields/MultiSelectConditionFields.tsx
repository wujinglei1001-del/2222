'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Box, MenuItem, Stack, Typography } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';
import { PRIORITY_OPTIONS, STATUS_OPTIONS, getPriorityDotColor } from '../common/constants';
import type { AutomationFormValues } from '../useCreateAutomationForm';

const statusOptions = [...STATUS_OPTIONS];
const priorityOptions = [...PRIORITY_OPTIONS];

interface MultiSelectConditionFieldsProps {
  index: number;
  type: 'status_is' | 'priority_is';
}

const MultiSelectConditionFields = ({ index, type }: MultiSelectConditionFieldsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AutomationFormValues>();

  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
      <Controller
        control={control}
        name={`conditions.${index}.operator`}
        render={({ field }) => (
          <StyledTextField select size="medium" sx={{ flex: 1 }} {...field}>
            <MenuItem value="equals">Is equal to</MenuItem>
            <MenuItem value="not_equals">Is not equal to</MenuItem>
            <MenuItem value="is_any_of">Is any of</MenuItem>
            <MenuItem value="is_all_of">Is all of</MenuItem>
            <MenuItem value="is_not_any_of">Is not any of</MenuItem>
            <MenuItem value="is_not_all_of">Is not all of</MenuItem>
            <MenuItem value="is_set">Is set</MenuItem>
            <MenuItem value="is_not_set">Is not set</MenuItem>
          </StyledTextField>
        )}
      />
      <Controller
        control={control}
        name={`conditions.${index}.value`}
        render={({ field }) => (
          <StyledTextField
            select
            size="medium"
            sx={{ flex: 1 }}
            {...field}
            error={!!errors.conditions?.[index]?.value}
            helperText={errors.conditions?.[index]?.value?.message}
            slotProps={
              type === 'priority_is'
                ? {
                    select: {
                      renderValue: (selected) => {
                        const value = String(selected ?? '');
                        return (
                          <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
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
                      },
                    },
                  }
                : undefined
            }
          >
            {(type === 'status_is' ? statusOptions : priorityOptions).map((option) => (
              <MenuItem key={option} value={option}>
                {type === 'priority_is' ? (
                  <>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        mr: 1.5,
                        bgcolor: getPriorityDotColor(option),
                        flexShrink: 0,
                      }}
                    />
                    {option}
                  </>
                ) : (
                  option
                )}
              </MenuItem>
            ))}
          </StyledTextField>
        )}
      />
    </Stack>
  );
};

export default MultiSelectConditionFields;
