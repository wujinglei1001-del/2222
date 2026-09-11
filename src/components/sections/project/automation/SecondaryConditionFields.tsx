'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Box, MenuItem, Stack, Typography } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';
import {
  type ConditionFilterType,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  getOperatorOptionsForFilterType,
  getPriorityDotColor,
} from './common/constants';
import AssigneeConditionFields from './condition-fields/AssigneeConditionFields';
import LabelConditionFields from './condition-fields/LabelConditionFields';
import DatePickerWithShortcuts from './shared/DatePickerWithShortcuts';
import type { AutomationFormValues } from './useCreateAutomationForm';

interface SecondaryConditionFieldsProps {
  index: number;
  type: ConditionFilterType;
}

const SET_OPERATORS = ['is_set', 'is_not_set'] as const;

const SecondaryConditionFields = ({ index, type }: SecondaryConditionFieldsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AutomationFormValues>();

  const operator = useWatch({
    control,
    name: `conditions.${index}.operator`,
  });

  const showValueField = !SET_OPERATORS.includes(operator as (typeof SET_OPERATORS)[number]);

  const operatorOptions = getOperatorOptionsForFilterType(type);

  const valueFieldWrapperSx = { flex: 1, minWidth: 0, width: 1 };

  const renderValueField = () => {
    switch (type) {
      case 'status_is':
        return (
          <Controller
            control={control}
            name={`conditions.${index}.value`}
            render={({ field }) => (
              <StyledTextField
                select
                fullWidth
                size="medium"
                value={typeof field.value === 'string' ? field.value : ''}
                onChange={field.onChange}
                error={!!errors.conditions?.[index]?.value}
                helperText={errors.conditions?.[index]?.value?.message}
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </StyledTextField>
            )}
          />
        );
      case 'priority_is':
        return (
          <Controller
            control={control}
            name={`conditions.${index}.value`}
            render={({ field }) => (
              <StyledTextField
                select
                fullWidth
                size="medium"
                value={typeof field.value === 'string' ? field.value : ''}
                onChange={field.onChange}
                error={!!errors.conditions?.[index]?.value}
                helperText={errors.conditions?.[index]?.value?.message}
                slotProps={{
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
        );
      case 'assignee_is':
        return (
          <AssigneeConditionFields
            index={index}
            hideSearch
            placeholder="Select a user"
            textFieldLabel=""
          />
        );
      case 'label_is':
        return (
          <LabelConditionFields
            index={index}
            hideSearch
            placeholder="Any Label"
            textFieldLabel=""
          />
        );
      case 'start_date_is':
      case 'due_date_is':
        return (
          <Box sx={{ width: 1 }}>
            <DatePickerWithShortcuts
              name={`conditions.${index}.targetDate`}
              placeholder="Select a date"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Stack direction="row" sx={{ gap: 2, alignItems: 'stretch', width: 1 }}>
      <Controller
        control={control}
        name={`conditions.${index}.operator`}
        render={({ field }) => (
          <StyledTextField
            select
            fullWidth
            size="medium"
            sx={showValueField ? valueFieldWrapperSx : { width: 1 }}
            {...field}
          >
            {operatorOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </StyledTextField>
        )}
      />
      {showValueField && <Box sx={valueFieldWrapperSx}>{renderValueField()}</Box>}
    </Stack>
  );
};

export default SecondaryConditionFields;
