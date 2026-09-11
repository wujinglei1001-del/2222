'use client';

import { Avatar, Box, Checkbox, Typography } from '@mui/material';
import { users } from 'data/users';
import SearchableMultiSelect from '../shared/SearchableMultiSelect';

const getUserLabelById = (id: string) => {
  const user = users.find((assignee) => String(assignee.id) === id);
  return user?.name ?? id;
};

interface AssigneeConditionFieldsProps {
  index?: number;
  name?: string;
  textFieldLabel?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  hideSearch?: boolean;
}

const AssigneeConditionFields = ({
  index,
  name,
  textFieldLabel,
  placeholder,
  searchPlaceholder,
  hideSearch,
}: AssigneeConditionFieldsProps) => {
  const fieldName = name ?? (typeof index === 'number' ? `conditions.${index}.value` : '');

  if (!fieldName) return null;

  return (
    <SearchableMultiSelect
      options={users}
      name={fieldName}
      getValue={(user) => String(user.id)}
      renderItem={(user, checked) => (
        <>
          <Checkbox checked={checked} sx={{ p: 0, mr: 2 }} />
          <Avatar src={user.avatar} alt={user.name} sx={{ width: 24, height: 24, mr: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', width: 1 }}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {user.name}
            </Typography>
          </Box>
        </>
      )}
      filterOptions={(options, query) => {
        if (!query) return options;
        return options.filter((user) => user.name.toLowerCase().includes(query));
      }}
      getDisplayValue={(selectedIds) => {
        return selectedIds.length
          ? selectedIds.map(getUserLabelById).join(', ')
          : (placeholder ?? 'Select a user');
      }}
      label={textFieldLabel === undefined ? 'User' : textFieldLabel}
      searchPlaceholder={searchPlaceholder ?? 'Search user'}
      hideSearch={hideSearch}
      maxHeight={220}
    />
  );
};

export default AssigneeConditionFields;
