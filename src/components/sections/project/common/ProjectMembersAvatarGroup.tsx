'use client';

import { MouseEvent, memo } from 'react';
import { Avatar, AvatarGroup, Button, Tooltip, useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { users } from 'data/users';
import IconifyIcon from 'components/base/IconifyIcon';
import type { MemberProfileUser } from 'components/common/MemberProfilePopper';
import { projectAvatarGroupSx } from './projectMemberStyles';

interface ProjectMembersAvatarGroupProps {
  members?: MemberProfileUser[];
  max?: number;
  /** AvatarGroup max when viewport is below lg (< 1200px). MUI shows (max - 1) avatars + surplus. */
  compactMax?: number;
  /** Below lg, render only this many users (avoids surplus on the left group). */
  compactSlice?: number;
  total?: number;
  avatarSize?: 32 | 36;
  surplusIcon?: string;
  onSurplusClick?: (event: MouseEvent<HTMLElement>) => void;
  sx?: SystemStyleObject<Theme>;
}

const ProjectMembersAvatarGroup = ({
  members = users,
  max,
  compactMax,
  compactSlice,
  total,
  avatarSize = 32,
  surplusIcon = 'material-symbols:patient-list-outline',
  onSurplusClick,
  sx,
}: ProjectMembersAvatarGroupProps) => {
  const upLg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const isCompact = !upLg;
  const effectiveMax = isCompact && compactMax !== undefined ? compactMax : max;
  const visibleMembers =
    isCompact && compactSlice !== undefined ? members.slice(0, compactSlice) : members;
  const memberTotal = total ?? members.length;

  return (
    <AvatarGroup
      max={effectiveMax}
      total={memberTotal}
      renderSurplus={() => (
        <Tooltip title={onSurplusClick ? 'Open members list' : 'More members'} disableInteractive>
          <Button
            shape="circle"
            variant="soft"
            color="neutral"
            onClick={onSurplusClick}
            aria-label={onSurplusClick ? 'Open members list' : 'More members'}
            sx={{
              width: avatarSize,
              height: avatarSize,
              minWidth: avatarSize,
              p: 0,
            }}
          >
            <IconifyIcon icon={surplusIcon} sx={{ fontSize: 20 }} />
          </Button>
        </Tooltip>
      )}
      sx={sx ? { ...projectAvatarGroupSx(avatarSize), ...sx } : projectAvatarGroupSx(avatarSize)}
    >
      {visibleMembers.map((member) => (
        <Tooltip key={member.id ?? member.name} title={member.name} disableInteractive>
          <Avatar alt={member.name} src={member.avatar} />
        </Tooltip>
      ))}
    </AvatarGroup>
  );
};

export default memo(ProjectMembersAvatarGroup);
