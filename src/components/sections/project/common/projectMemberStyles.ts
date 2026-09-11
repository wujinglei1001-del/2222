import { avatarGroupClasses } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { users } from 'data/users';
import type { MemberProfileUser } from 'components/common/MemberProfilePopper';

export const PROJECT_LIST_FILTERS = ['Recently opened', 'Running', 'Done', 'Cancelled'] as const;

export type ProjectListFilter = (typeof PROJECT_LIST_FILTERS)[number];

export const projectMembers: MemberProfileUser[] = users.map((user) => ({
  id: user.id,
  name: user.name,
  avatar: user.avatar,
  email: user.email,
  status: user.status,
}));

export const projectAdmins: MemberProfileUser[] = projectMembers.slice(0, 2);

export const projectMemberUsers: MemberProfileUser[] = projectMembers.slice(2);

export const projectAvatarGroupSx = (avatarSize: 32 | 36 = 32): SystemStyleObject<Theme> => ({
  display: 'inline-flex',
  flexShrink: 0,
  alignItems: 'center',
  [`& .${avatarGroupClasses.avatar}`]: {
    width: avatarSize,
    height: avatarSize,
    bgcolor: 'neutral.lighter',
    color: 'neutral.dark',
  },
});
