'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';
import DatePickerWithShortcuts from '../shared/DatePickerWithShortcuts';
import type { AutomationFormValues } from '../useCreateAutomationForm';

interface ChangeDateActionFieldsProps {
  index: number;
}

type DateMode = 'days' | 'weeks' | 'custom';

const ChangeDateActionFields = ({ index }: ChangeDateActionFieldsProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AutomationFormValues>();
  const dateMode =
    (useWatch({ control, name: `actions.${index}.params.dateMode` }) as DateMode | undefined) ??
    'weeks';

  return (
    <Stack sx={{ gap: 2 }}>
      <Controller
        control={control}
        name={`actions.${index}.params.dateMode`}
        render={({ field }) => (
          <RadioGroup
            value={field.value ?? 'weeks'}
            onChange={(_, value) => field.onChange(value as DateMode)}
          >
            <Stack sx={{ gap: 1 }}>
              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <FormControlLabel value="days" control={<Radio />} label="" sx={{ m: 0 }} />
                <Controller
                  control={control}
                  name={`actions.${index}.params.dateOffset`}
                  render={({ field: offsetField }) => (
                    <StyledTextField
                      size="small"
                      type="number"
                      disabledSpinButton
                      value={offsetField.value ? String(offsetField.value) : ''}
                      onChange={offsetField.onChange}
                      disabled={dateMode !== 'days'}
                      sx={{ width: 56 }}
                      error={!!errors.actions?.[index]?.params?.dateOffset}
                      helperText={errors.actions?.[index]?.params?.dateOffset?.message}
                    />
                  )}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Day(s) after trigger
                </Typography>
              </Stack>

              <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                <FormControlLabel value="weeks" control={<Radio />} label="" sx={{ m: 0 }} />
                <Controller
                  control={control}
                  name={`actions.${index}.params.dateOffset`}
                  render={({ field: offsetField }) => (
                    <StyledTextField
                      size="small"
                      type="number"
                      disabledSpinButton
                      value={offsetField.value ? String(offsetField.value) : ''}
                      onChange={offsetField.onChange}
                      disabled={dateMode !== 'weeks'}
                      sx={{ width: 56 }}
                      error={!!errors.actions?.[index]?.params?.dateOffset}
                      helperText={errors.actions?.[index]?.params?.dateOffset?.message}
                    />
                  )}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Week(s) after trigger
                </Typography>
              </Stack>

              <Stack
                direction="row"
                sx={{
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <FormControlLabel value="custom" control={<Radio />} label="" sx={{ m: 0 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Set custom date
                </Typography>
              </Stack>
            </Stack>
          </RadioGroup>
        )}
      />
      <DatePickerWithShortcuts
        name={`actions.${index}.params.customDate`}
        placeholder="Change start/end date"
        disabled={dateMode !== 'custom'}
      />
    </Stack>
  );
};

export default ChangeDateActionFields;
