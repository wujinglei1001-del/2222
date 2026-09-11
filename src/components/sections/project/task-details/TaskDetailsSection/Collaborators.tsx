'use client';

import { useState } from 'react';
import { Avatar, Checkbox, InputAdornment, Paper, Stack, Typography } from '@mui/material';
import { type CollaboratorAssignment, taskDetailsData } from 'data/project/task-details';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const Collaborators = () => {
  const [collaborators, setCollaborators] = useState<CollaboratorAssignment[]>(
    () => taskDetailsData.collaborators,
  );

  const handleToggle = (id: string) => {
    setCollaborators((prev) =>
      prev.map((collaborator) =>
        collaborator.id === id ? { ...collaborator, checked: !collaborator.checked } : collaborator,
      ),
    );
  };

  return (
    <Paper
      sx={{
        overflow: 'hidden',
        height: 1,
        p: { xs: 2, md: 3 },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          mb: 1.5,
        }}
      >
        Collaborators
      </Typography>
      <StyledTextField
        placeholder="Search with a keyword"
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <IconifyIcon
                  icon="material-symbols:search-rounded"
                  sx={{ fontSize: 20, color: 'text.secondary' }}
                />
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 1.5 }}
      />
      <Stack sx={{ gap: 1, maxHeight: { xs: 330, md: 140 }, overflowY: 'auto' }}>
        {collaborators.map(({ id, name, avatar, checked }) => (
          <Stack
            key={id}
            direction="row"
            sx={{
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
            }}
            onClick={() => handleToggle(id)}
          >
            <Checkbox
              size="small"
              checked={checked}
              onChange={() => handleToggle(id)}
              onClick={(e) => e.stopPropagation()}
            />
            <Avatar src={avatar} sx={{ width: 24, height: 24 }}>
              {name[0]}
            </Avatar>
            <Typography variant="body2">{name}</Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
};

export default Collaborators;
