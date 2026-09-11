'use client';

import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import {
  TeamMemberRole,
  teamMemberListData,
  teamMemberListOverview,
} from 'data/project/team-member-list';
import IconifyIcon from 'components/base/IconifyIcon';
import DataGridSelectionBar from 'components/common/DataGridSelectionBar';
import TeamMemberListTable from 'components/sections/project/team-member-list/TeamMemberListTable';
import TeamMemberOverviewCard from 'components/sections/project/team-member-list/TeamMemberOverviewCard';
import StyledTextField from 'components/styled/StyledTextField';

const emptySelection: GridRowSelectionModel = {
  type: 'include',
  ids: new Set(),
};

const inviteMemberDisplay = {
  header: { xs: 'inline-flex', md: 'none', lg: 'inline-flex' },
  sidebar: { xs: 'none', md: 'inline-flex', lg: 'none' },
} as const;

const InviteMemberButton = ({ placement }: { placement: keyof typeof inviteMemberDisplay }) => (
  <Button
    variant="contained"
    startIcon={<IconifyIcon icon="material-symbols:add-rounded" fontSize={20} />}
    sx={{
      display: inviteMemberDisplay[placement],
      alignSelf: placement === 'sidebar' ? 'flex-start' : undefined,
    }}
  >
    Invite member
  </Button>
);

const TeamMemberList = () => {
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(emptySelection);
  const [bulkRole, setBulkRole] = useState<TeamMemberRole>('Moderator');

  const { memberCount, adminCount, moderatorCount } = useMemo(() => {
    let admins = 0;
    let moderators = 0;

    teamMemberListData.forEach((member) => {
      if (member.role === 'Admin') {
        admins += 1;
      }
      if (member.role === 'Moderator') {
        moderators += 1;
      }
    });

    return {
      memberCount: teamMemberListData.length,
      adminCount: admins,
      moderatorCount: moderators,
    };
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3,
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <Avatar
            src={teamMemberListOverview.teamAvatar}
            sx={{ width: 56, height: 56, p: 1, bgcolor: 'success.lighter' }}
          />
          <Typography variant="h4">{teamMemberListOverview.teamName}</Typography>
          <IconButton>
            <IconifyIcon
              icon="material-symbols:expand-more-rounded"
              color="text.primary"
              fontSize={36}
            />
          </IconButton>
        </Stack>

        <InviteMemberButton placement="header" />
      </Stack>

      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        sx={{ gap: 4, alignItems: { lg: 'flex-start' } }}
      >
        <Stack sx={{ width: { xs: 1, lg: 360 }, gap: 2 }}>
          <InviteMemberButton placement="sidebar" />
          <TeamMemberOverviewCard
            overview={teamMemberListOverview}
            memberCount={memberCount}
            adminCount={adminCount}
            moderatorCount={moderatorCount}
          />
        </Stack>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TeamMemberListTable
            data={teamMemberListData}
            selectionModel={selectionModel}
            onSelectionChange={setSelectionModel}
          />

          <DataGridSelectionBar selectedCount={selectionModel.ids.size}>
            <StyledTextField
              select
              size="small"
              value={bulkRole}
              onChange={(event) => setBulkRole(event.target.value as TeamMemberRole)}
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Moderator">Moderator</MenuItem>
              <MenuItem value="Member">Member</MenuItem>
            </StyledTextField>

            <IconButton
              color="error"
              onClick={() => setSelectionModel(emptySelection)}
              size="small"
            >
              <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={20} />
            </IconButton>
          </DataGridSelectionBar>
        </Box>
      </Stack>
    </Container>
  );
};

export default TeamMemberList;
