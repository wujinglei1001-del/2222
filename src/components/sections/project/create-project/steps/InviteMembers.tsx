'use client';

import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { users } from 'data/users';
import { User } from 'types/users';
import IconifyIcon from 'components/base/IconifyIcon';
import type { CreateProjectFormValues } from 'components/sections/project/create-project/useCreateProjectStepper';
import StyledTextField from 'components/styled/StyledTextField';

const teamOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
];

const InviteMembers = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateProjectFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'collaborators',
  });

  const collaborators = useWatch({ control, name: 'collaborators' }) ?? [];

  const selectedUserIds = new Set<number>();
  collaborators.forEach((collaborator) => {
    if (typeof collaborator?.userId === 'number') {
      selectedUserIds.add(collaborator.userId);
    }
  });

  const getSelectedOption = (userId: number | undefined) => {
    if (typeof userId !== 'number') return null;
    return users.find((user) => user.id === userId) ?? null;
  };

  const getSelectableOptions = (currentSelectedUserId: number | undefined) =>
    users.filter((user) => !selectedUserIds.has(user.id) || user.id === currentSelectedUserId);

  return (
    <Stack sx={{ gap: 3 }}>
      <Controller
        name="teamId"
        control={control}
        render={({ field }) => (
          <StyledTextField
            select
            fullWidth
            size="medium"
            value={field.value ?? ''}
            onChange={field.onChange}
            slotProps={{
              select: {
                displayEmpty: true,
                renderValue: (selected) => (selected ? String(selected) : 'Select a team'),
              },
            }}
          >
            <MenuItem value="" disabled>
              Select a team
            </MenuItem>
            {teamOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </StyledTextField>
        )}
      />
      <div>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'text.secondary',
            mb: 3,
          }}
        >
          And/or invite individual members
        </Typography>

        <Stack sx={{ gap: 1, mt: 2 }}>
          {fields.map((field, index) => {
            const currentSelectedUserId = collaborators[index]?.userId;
            const selectableOptions = getSelectableOptions(currentSelectedUserId);
            const selectedOption = getSelectedOption(currentSelectedUserId);

            return (
              <Stack
                key={field.id}
                direction="row"
                sx={{
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                <Controller
                  control={control}
                  name={`collaborators.${index}`}
                  render={({ field: collaboratorField }) => (
                    <Autocomplete
                      disableClearable
                      disablePortal={false}
                      noOptionsText="User not found"
                      options={selectableOptions}
                      popupIcon={null}
                      isOptionEqualToValue={(option, value) => option.id === value?.id}
                      value={selectedOption as User}
                      onChange={(_, value) => {
                        collaboratorField.onChange(
                          value
                            ? {
                                email: value.email,
                                userId: value.id,
                                name: value.name,
                                avatar: value.avatar,
                              }
                            : { email: '', userId: undefined, name: '', avatar: '' },
                        );
                      }}
                      getOptionLabel={(option) => option.email}
                      renderOption={(props, option) => {
                        const { key, ...rest } = props;
                        return (
                          <Box component="li" key={key} {...rest}>
                            <Avatar src={option.avatar} sx={{ mr: 1, width: 28, height: 28 }} />
                            <div>
                              <Typography variant="subtitle2">{option.name}</Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.secondary',
                                }}
                              >
                                {option.email}
                              </Typography>
                            </div>
                          </Box>
                        );
                      }}
                      renderInput={(params) => (
                        <StyledTextField
                          {...params}
                          placeholder="Select a member"
                          error={Boolean(errors.collaborators?.[index]?.email)}
                          helperText={errors.collaborators?.[index]?.email?.message}
                        />
                      )}
                      sx={{ flex: 1 }}
                    />
                  )}
                />
                <IconButton
                  aria-label="Remove member"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  sx={{ color: 'text.primary' }}
                >
                  <IconifyIcon icon="material-symbols:close-rounded" fontSize={20} />
                </IconButton>
              </Stack>
            );
          })}
        </Stack>

        <Button
          variant="text"
          color="primary"
          sx={{ alignSelf: 'flex-start', mt: 2 }}
          startIcon={<IconifyIcon icon="material-symbols:add-rounded" fontSize={20} />}
          onClick={() => append({ email: '', userId: undefined, name: '', avatar: '' })}
        >
          Add another
        </Button>
      </div>
    </Stack>
  );
};

export default InviteMembers;
