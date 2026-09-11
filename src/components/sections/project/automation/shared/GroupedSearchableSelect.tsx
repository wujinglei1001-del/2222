'use client';

import { ReactNode, useMemo, useState } from 'react';
import { Box, Divider, ListSubheader, MenuItem, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import { getGroupSubheaderSx, groupedMenuProps, searchSubheaderSx } from './dropdownStyles';

export type GroupedOption<T extends string> = { value: T; label: string };
export type OptionGroup<T extends string> = { group: string; options: GroupedOption<T>[] };

interface GroupedSearchableSelectProps<T extends string> {
  value: T;
  onChange?: (value: T) => void;
  groups?: OptionGroup<T>[];
  flatOptions?: GroupedOption<T>[];
  getLabel: (value: T) => string;
  excludedValues?: T[];
  destructiveValues?: T[];
  showSearchIcon?: boolean;
  hideSearch?: boolean;
}

const GroupedSearchableSelect = <T extends string>({
  value,
  onChange,
  groups = [],
  flatOptions,
  getLabel,
  excludedValues = [],
  destructiveValues = [],
  showSearchIcon = false,
  hideSearch = false,
}: GroupedSearchableSelectProps<T>) => {
  const [search, setSearch] = useState('');
  const isFlatMode = flatOptions !== undefined;

  const visibleGroups = useMemo(() => {
    if (isFlatMode) return [];

    const query = search.trim().toLowerCase();

    return groups
      .map((group) => ({
        ...group,
        options: group.options.filter((option) => {
          const matchesSearch = !query || option.label.toLowerCase().includes(query);
          const isExcluded = excludedValues.includes(option.value) && option.value !== value;

          return matchesSearch && !isExcluded;
        }),
      }))
      .filter((group) => group.options.length > 0);
  }, [excludedValues, groups, isFlatMode, search, value]);

  const visibleFlatOptions = useMemo(() => {
    if (!flatOptions) return [];

    const query = search.trim().toLowerCase();
    return flatOptions.filter((option) => {
      const matchesSearch = !query || option.label.toLowerCase().includes(query);
      const isExcluded = excludedValues.includes(option.value) && option.value !== value;

      return matchesSearch && !isExcluded;
    });
  }, [excludedValues, flatOptions, search, value]);

  const searchField = (
    <StyledTextField
      size="small"
      placeholder="Search..."
      fullWidth
      value={search}
      onChange={(changeEvent) => setSearch(changeEvent.target.value)}
      onMouseDown={(mouseEvent) => mouseEvent.stopPropagation()}
      onKeyDown={(keyboardEvent) => keyboardEvent.stopPropagation()}
      onKeyUp={(keyboardEvent) => keyboardEvent.stopPropagation()}
      slotProps={
        showSearchIcon
          ? {
              input: {
                startAdornment: (
                  <IconifyIcon
                    icon="material-symbols:search-rounded"
                    sx={{ color: 'text.disabled', mr: 1 }}
                    fontSize={18}
                  />
                ),
              },
            }
          : undefined
      }
    />
  );

  const renderOption = (option: GroupedOption<T>, key: string) => {
    const isDestructive = destructiveValues.includes(option.value);

    return (
      <MenuItem key={key} value={option.value}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: 1 }}>
          <Typography
            variant="body2"
            sx={{ flex: 1, color: isDestructive ? 'error.main' : 'text.primary' }}
          >
            {option.label}
          </Typography>
          {value === option.value ? (
            <IconifyIcon icon="material-symbols:check" />
          ) : (
            <Box sx={{ width: 18 }} />
          )}
        </Box>
      </MenuItem>
    );
  };

  const menuItems: ReactNode = isFlatMode
    ? visibleFlatOptions.map((option) => renderOption(option, option.value))
    : visibleGroups.flatMap((group, groupIndex) => [
        <ListSubheader
          key={`${group.group}-header`}
          sx={getGroupSubheaderSx(groupIndex === 0, hideSearch)}
        >
          {group.group}
        </ListSubheader>,
        ...group.options.map((option) => renderOption(option, `${group.group}-${option.value}`)),
        ...(groupIndex < visibleGroups.length - 1
          ? [<Divider key={`${group.group}-divider`} flexItem sx={{ my: '16px !important' }} />]
          : []),
      ]);

  return (
    <StyledTextField
      select
      fullWidth
      value={value}
      onChange={onChange ? (changeEvent) => onChange(changeEvent.target.value as T) : undefined}
      slotProps={{
        inputLabel: { shrink: true },
        select: {
          renderValue: () => getLabel(value),
          onClose: () => setSearch(''),
          MenuProps: {
            ...groupedMenuProps,
            slotProps: {
              ...groupedMenuProps.slotProps,
              list: {
                ...groupedMenuProps.slotProps.list,
                ...(hideSearch
                  ? {}
                  : {
                      subheader: (
                        <ListSubheader
                          component="div"
                          sx={searchSubheaderSx}
                          onKeyDown={(keyboardEvent) => keyboardEvent.stopPropagation()}
                          onClick={(clickEvent) => clickEvent.stopPropagation()}
                        >
                          {searchField}
                        </ListSubheader>
                      ),
                    }),
              },
            },
          },
        },
      }}
    >
      {menuItems}
    </StyledTextField>
  );
};

export default GroupedSearchableSelect;
