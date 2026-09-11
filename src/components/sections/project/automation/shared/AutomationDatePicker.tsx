'use client';

import { Controller, FieldError, type FieldPath, get, useFormContext } from 'react-hook-form';
import type { PickersLocaleText } from '@mui/x-date-pickers';
import { pickersSectionListClasses } from '@mui/x-date-pickers';
import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import StyledPickersField from 'components/styled/StyledPickersField';
import type { AutomationFormValues } from '../useCreateAutomationForm';

const emptyDatePickerLocaleText: Partial<PickersLocaleText> = {
  fieldDayPlaceholder: () => '',
  fieldMonthPlaceholder: () => '',
  fieldYearPlaceholder: () => '',
};

const getEmptyPlaceholderSx = (placeholder: string) => ({
  [`& .${pickersSectionListClasses.section}`]: { display: 'none' },
  [`& .${pickersSectionListClasses.root}`]: {
    position: 'relative',
    overflow: 'hidden',
    opacity: '1 !important',
    color: 'text.secondary',
    '&::before': {
      content: `"${placeholder}"`,
      color: 'text.secondary',
      fontSize: 14,
      lineHeight: 1.45,
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
});

interface AutomationDatePickerProps extends Pick<
  DatePickerProps,
  'disabled' | 'format' | 'label' | 'slots' | 'slotProps'
> {
  name: FieldPath<AutomationFormValues>;
  placeholder?: string;
}

const AutomationDatePicker = ({
  name,
  placeholder = 'Select a date',
  format = 'DD MMM, YYYY',
  label,
  disabled = false,
  slots,
  slotProps,
}: AutomationDatePickerProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AutomationFormValues>();

  const fieldError = get(errors, name) as FieldError | undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const isEmpty = !field.value;

        return (
          <DatePicker
            label={label}
            format={format}
            value={field.value ? dayjs(field.value as string) : null}
            onChange={(next) => field.onChange(next ? (next as Dayjs).toISOString() : '')}
            disabled={disabled}
            localeText={isEmpty ? emptyDatePickerLocaleText : undefined}
            slots={{ ...slots, textField: StyledPickersField }}
            slotProps={{
              ...slotProps,
              inputAdornment: { position: 'start', ...slotProps?.inputAdornment },
              textField: {
                size: 'medium',
                fullWidth: true,
                ...(isEmpty && { sx: getEmptyPlaceholderSx(placeholder) }),
                error: !!fieldError,
                helperText: fieldError?.message,
                ...slotProps?.textField,
              },
            }}
          />
        );
      }}
    />
  );
};

export default AutomationDatePicker;
