'use client';

import { MouseEvent, memo, useState } from 'react';
import { Button, Divider, Stack, SxProps, Theme } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import DashboardMenu from 'components/common/DashboardMenu';
import InviteDialog from 'components/common/InviteDialog';
import ProjectMembersAvatarGroup from 'components/sections/project/common/ProjectMembersAvatarGroup';
import {
  projectAdmins,
  projectMemberUsers,
} from 'components/sections/project/common/projectMemberStyles';

interface ProjectListMembersBarProps {
  inviteButtonIcon?: string;
  onOpenMembersMenu: (event: MouseEvent<HTMLElement>) => void;
  onInvite?: () => void;
  sx?: SxProps<Theme>;
}

const ProjectListMembersBar = ({
  inviteButtonIcon = 'material-symbols:person-add-outline',
  onOpenMembersMenu,
  onInvite,
  sx,
}: ProjectListMembersBarProps) => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const handleInviteClick = () => {
    if (onInvite) {
      onInvite();
      return;
    }
    setInviteDialogOpen(true);
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: 'center',
          flexWrap: 'nowrap',
          minWidth: 0,
          ...sx,
        }}
      >
        <ProjectMembersAvatarGroup
          members={projectAdmins}
          max={projectAdmins.length + 1}
          compactSlice={projectAdmins.length}
          sx={{ mr: 1, flexShrink: 0 }}
        />

        <Divider orientation="vertical" sx={{ height: 16, alignSelf: 'center', flexShrink: 0 }} />

        <ProjectMembersAvatarGroup
          members={projectMemberUsers}
          max={8}
          compactMax={5}
          onSurplusClick={onOpenMembersMenu}
          sx={{ mr: 1, flexShrink: 0 }}
        />

        <Button
          shape="circle"
          variant="soft"
          color="neutral"
          aria-label="Invite member"
          onClick={handleInviteClick}
        >
          <IconifyIcon icon={inviteButtonIcon} fontSize={20} />
        </Button>

        <DashboardMenu
          shape="circle"
          variant="text"
          sx={{ ml: 'auto', minWidth: 40, minHeight: 40, flexShrink: 0 }}
          icon={
            <IconifyIcon
              icon="material-symbols:more-horiz"
              fontSize={20}
              sx={{ color: 'text.primary' }}
            />
          }
        />
      </Stack>

      <InviteDialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} />
    </>
  );
};

export default memo(ProjectListMembersBar);
