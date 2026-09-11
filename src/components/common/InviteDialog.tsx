'use client';

import { useState } from 'react';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
  dialogClasses,
  filledInputClasses,
  inputBaseClasses,
  selectClasses,
} from '@mui/material';
import { users } from 'data/users';
import type { User } from 'types/users';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledSelect from 'components/styled/StyledSelect';
import StyledTextField from 'components/styled/StyledTextField';

interface InviteDialogProps {
  open: boolean;
  onClose: () => void;
}

const InviteDialog = ({ open, onClose }: InviteDialogProps) => {
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [message, setMessage] = useState('');
  const [memberRole, setMemberRole] = useState('Member');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="body"
      sx={{
        [`& .${dialogClasses.paper}`]: {
          width: 1,
          maxWidth: { xs: 327, sm: 492 },
          borderRadius: 6,
          m: 0,
        },
        [`& .${dialogClasses.container}`]: {
          alignItems: 'center',
        },
      }}
    >
      <DialogContent sx={{ p: 3, pb: { xs: 2, sm: 3 } }}>
        <Stack
          direction="row"
          sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography variant="h6">Invite members</Typography>
          <Button variant="text" color="neutral" size="small" shape="square" onClick={onClose}>
            <IconifyIcon
              icon="material-symbols:close-rounded"
              sx={{ fontSize: 18, pointerEvents: 'none' }}
            />
          </Button>
        </Stack>
        <Stack
          direction={{ sm: 'row' }}
          sx={{
            gap: 1,
            mb: 2,
            alignItems: 'flex-start',
          }}
        >
          <Autocomplete
            multiple
            id="invite-members-autocomplete"
            options={users}
            value={selectedMembers}
            onChange={(event, newValue) => {
              setSelectedMembers(newValue);
            }}
            getOptionLabel={(option) => option.name}
            popupIcon={null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            clearIcon={null}
            sx={{
              width: 1,
              [`& .${filledInputClasses.root}`]: {
                [`&.${filledInputClasses.focused}`]: {
                  boxShadow: 'none !important',
                },
              },
            }}
            renderValue={(selectedOptions, getItemProps) =>
              selectedOptions.map((option, index) => {
                const { key, ...itemRest } = getItemProps({ index });

                return (
                  <Chip
                    key={key}
                    label={option.name}
                    avatar={<Avatar src={option.avatar} alt={option.name} />}
                    {...itemRest}
                  />
                );
              })
            }
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;

              return (
                <Stack
                  key={key}
                  direction="row"
                  component="li"
                  {...optionProps}
                  sx={{
                    gap: 1,
                    '& > img': { mr: 2, flexShrink: 0 },
                  }}
                >
                  <Avatar src={option.avatar} alt={option.name} sx={{ width: 24, height: 24 }} />
                  <Typography sx={{ lineClamp: 1 }}>{option.name}</Typography>
                </Stack>
              );
            }}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                autoFocus
                fullWidth
                placeholder="Add user"
                sx={{
                  [`& .${inputBaseClasses.root}`]: {
                    px: '8px !important',
                  },
                }}
              />
            )}
          />

          <StyledSelect
            variant="filled"
            value={memberRole}
            onChange={(event) => setMemberRole(event.target.value as string)}
            MenuProps={{
              slotProps: {
                list: {
                  dense: true,
                },
              },
            }}
            sx={{
              minWidth: 100,
              flexShrink: 0,
              [`& .${selectClasses.icon}`]: { right: 8 },
              [`&.${filledInputClasses.root}`]: {
                [`&.${filledInputClasses.focused}`]: {
                  boxShadow: 'none !important',
                },
              },
            }}
          >
            <MenuItem value="Member">Member</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Guest">Guest</MenuItem>
          </StyledSelect>
        </Stack>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Write a short message (optional)"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Button
          startIcon={<IconifyIcon icon="material-symbols:link-rounded" />}
          sx={{ flexShrink: 0 }}
        >
          Create & copy link
        </Button>
        <Box sx={{ ml: 'auto !important' }}>
          <Button color="neutral" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose} autoFocus>
            Invite
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default InviteDialog;
