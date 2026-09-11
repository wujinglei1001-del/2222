'use client';

import { ReactNode, useMemo, useState } from 'react';
import { Controller, type FieldError, get, useFormContext } from 'react-hook-form';
import { InputAdornment, ListSubheader, MenuItem } from '@mui/material';
import { AutomationCondition } from 'types/automations';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

interface SearchableMultiSelectProps<T> {
  options: T[];
  name: string;
  getValue: (option: T) => string;
  renderItem: (option: T, checked: boolean) => ReactNode;
  filterOptions: (options: T[], query: string) => T[];
  getDisplayValue: (selectedValues: string[]) => string;
  label?: string;
  searchPlaceholder?: string;
  maxHeight?: number;
  hideSearch?: boolean;
}

const SearchableMultiSelect = <T,>({
  options,
  name,
  getValue,
  renderItem,
  filterOptions,
  getDisplayValue,
  label,
  searchPlaceholder = 'Search',
  maxHeight = 250,
  hideSearch = false,
}: SearchableMultiSelectProps<T>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    return filterOptions(options, search.trim().toLowerCase());
  }, [options, search, filterOptions]);

  const fieldError = get(errors, name) as FieldError;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues = Array.isArray(field.value) ? (field.value as string[]) : [];

        return (
          <StyledTextField
            select
            {...(label ? { label } : {})}
            size="medium"
            fullWidth
            value={selectedValues}
            onChange={(changeEvent) =>
              field.onChange(changeEvent.target.value as unknown as AutomationCondition['value'])
            }
            error={!!fieldError}
            helperText={fieldError?.message}
            slotProps={{
              ...(label ? { inputLabel: { shrink: true } } : {}),
              select: {
                multiple: true,
                displayEmpty: true,
                renderValue: () => {
                  return getDisplayValue(selectedValues);
                },
                onClose: () => setSearch(''),
                MenuProps: {
                  disableAutoFocusItem: true,
                  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                  transformOrigin: { vertical: 'top', horizontal: 'left' },
                  slotProps: {
                    paper: {
                      sx: {
                        mt: 1,
                        maxHeight,
                      },
                    },
                    list: {
                      sx: { pt: 0 },
                      ...(hideSearch
                        ? {}
                        : {
                            subheader: (
                              <ListSubheader
                                component="div"
                                sx={{
                                  position: 'sticky',
                                  top: 0,
                                  zIndex: 3,
                                  bgcolor: 'background.paper',
                                  minHeight: 72,
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                                onKeyDown={(keyboardEvent) => keyboardEvent.stopPropagation()}
                                onClick={(clickEvent) => clickEvent.stopPropagation()}
                              >
                                <StyledTextField
                                  size="small"
                                  placeholder={searchPlaceholder}
                                  fullWidth
                                  value={search}
                                  onChange={(changeEvent) => setSearch(changeEvent.target.value)}
                                  slotProps={{
                                    input: {
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <IconifyIcon
                                            icon="material-symbols:search"
                                            sx={{ color: 'text.secondary', fontSize: 20 }}
                                          />
                                        </InputAdornment>
                                      ),
                                    },
                                  }}
                                  onKeyDown={(keyboardEvent) => keyboardEvent.stopPropagation()}
                                  onKeyUp={(keyboardEvent) => keyboardEvent.stopPropagation()}
                                />
                              </ListSubheader>
                            ),
                          }),
                    },
                  },
                },
              },
            }}
          >
            {filteredOptions.map((option) => {
              const value = getValue(option);
              const checked = selectedValues.includes(value);

              return (
                <MenuItem
                  key={value}
                  value={value}
                  sx={{
                    bgcolor: checked ? 'action.selected' : 'transparent',
                    py: 1,
                  }}
                >
                  {renderItem(option, checked)}
                </MenuItem>
              );
            })}
          </StyledTextField>
        );
      }}
    />
  );
};

export default SearchableMultiSelect;
