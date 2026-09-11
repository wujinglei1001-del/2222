'use client';

import {
  type ChangeEvent,
  type MouseEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  filledInputClasses,
  listItemSecondaryActionClasses,
  menuClasses,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import MemberProfilePopper, { MemberProfileUser } from 'components/common/MemberProfilePopper';
import StyledTextField from 'components/styled/StyledTextField';

export type MembersListMenuMember = MemberProfileUser;

interface MembersListMenuProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  members: MembersListMenuMember[];
}

const defaultRole = 'Admin';

const buildRoleByKey = (members: MembersListMenuMember[]) => {
  const roleMap: Record<string, string> = {};
  members.forEach((member) => {
    const key = String(member.id ?? member.name);
    roleMap[key] = defaultRole;
  });
  return roleMap;
};

const getMemberKey = (member: MembersListMenuMember) => String(member.id ?? member.name);

interface MemberListItemProps {
  member: MembersListMenuMember;
  role: string;
  onRoleChange: (key: string, role: string) => void;
  onRemove: (key: string) => void;
  onRowMouseEnter: (event: MouseEvent<HTMLElement>, member: MembersListMenuMember) => void;
  onRowMouseLeave: () => void;
}

const MemberListItem = memo(
  ({
    member,
    role,
    onRoleChange,
    onRemove,
    onRowMouseEnter,
    onRowMouseLeave,
  }: MemberListItemProps) => {
    const { avatar, name, id } = member;
    const key = String(id ?? name);

    const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
      onRowMouseEnter(event, member);
    };

    const handleRoleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onRoleChange(key, event.target.value);
    };

    const handleRemove = () => {
      onRemove(key);
    };

    return (
      <ListItem
        disablePadding
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onRowMouseLeave}
        secondaryAction={
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <StyledTextField
              select
              size="small"
              value={role}
              onChange={handleRoleChange}
              sx={(theme) => ({
                minWidth: 90,
                color: 'text.secondary',
                [`& .${filledInputClasses.root}`]: {
                  bgcolor: 'transparent',
                  '&:focus-within': {
                    bgcolor: theme.vars.palette.primary.lighter,
                  },
                },
              })}
            >
              <MenuItem value="Member">Member</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Guest">Guest</MenuItem>
            </StyledTextField>

            <Button
              size="small"
              shape="circle"
              color="neutral"
              aria-label={`Remove ${name}`}
              onClick={handleRemove}
              sx={{ flexShrink: 0 }}
            >
              <IconifyIcon icon="material-symbols:close-rounded" fontSize={18} />
            </Button>
          </Stack>
        }
        sx={{
          pr: 22,
          [`& .${listItemSecondaryActionClasses.root}`]: {
            right: 24,
          },
          '&:hover': {
            bgcolor: 'primary.lighter',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: 1,
            py: '11px',
            pl: 3,
          }}
        >
          <ListItemAvatar sx={{ minWidth: 32 }}>
            <Avatar src={avatar} alt={name} sx={{ height: 24, width: 24 }} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.primary',
                  fontWeight: 400,
                  lineClamp: 1,
                  wordBreak: 'break-all',
                  overflow: 'hidden',
                }}
              >
                {name}
              </Typography>
            }
            sx={{ my: 0 }}
          />
        </Box>
      </ListItem>
    );
  },
);

MemberListItem.displayName = 'MemberListItem';

const MembersListMenu = ({ open, onClose, anchorEl, members }: MembersListMenuProps) => {
  const theme = useTheme();
  const showProfileOnHover = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
  const hideProfileTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isHoveringProfileRef = useRef(false);
  const wasOpenRef = useRef(false);

  const [localMembers, setLocalMembers] = useState<MembersListMenuMember[]>(members);
  const [roleByKey, setRoleByKey] = useState<Record<string, string>>(() => buildRoleByKey(members));
  const [hoveredMember, setHoveredMember] = useState<MembersListMenuMember | null>(null);
  const [hoveredRowEl, setHoveredRowEl] = useState<HTMLElement | null>(null);

  const clearHideProfileTimeout = useCallback(() => {
    if (hideProfileTimeoutRef.current) {
      clearTimeout(hideProfileTimeoutRef.current);
      hideProfileTimeoutRef.current = undefined;
    }
  }, []);

  const clearHoveredProfile = useCallback(() => {
    setHoveredMember(null);
    setHoveredRowEl(null);
  }, []);

  const scheduleHideProfile = useCallback(() => {
    clearHideProfileTimeout();
    hideProfileTimeoutRef.current = setTimeout(() => {
      if (!isHoveringProfileRef.current) {
        clearHoveredProfile();
      }
    }, 100);
  }, [clearHideProfileTimeout, clearHoveredProfile]);

  useEffect(() => {
    if (!showProfileOnHover) {
      clearHoveredProfile();
    }
  }, [showProfileOnHover, clearHoveredProfile]);

  useEffect(() => {
    const didOpen = open && !wasOpenRef.current;
    wasOpenRef.current = open;

    if (!didOpen) return;

    clearHideProfileTimeout();
    isHoveringProfileRef.current = false;
    setLocalMembers(members);
    setRoleByKey(buildRoleByKey(members));
    clearHoveredProfile();
  }, [open, members, clearHideProfileTimeout, clearHoveredProfile]);

  useEffect(() => {
    return () => {
      clearHideProfileTimeout();
    };
  }, [clearHideProfileTimeout]);

  const handleRowMouseEnter = useCallback(
    (event: MouseEvent<HTMLElement>, member: MembersListMenuMember) => {
      if (!showProfileOnHover) return;
      clearHideProfileTimeout();
      setHoveredMember(member);
      setHoveredRowEl(event.currentTarget);
    },
    [showProfileOnHover, clearHideProfileTimeout],
  );

  const handleRowMouseLeave = useCallback(() => {
    if (!isHoveringProfileRef.current) {
      scheduleHideProfile();
    }
  }, [scheduleHideProfile]);

  const handleProfileMouseEnter = useCallback(() => {
    clearHideProfileTimeout();
    isHoveringProfileRef.current = true;
  }, [clearHideProfileTimeout]);

  const handleProfileMouseLeave = useCallback(() => {
    isHoveringProfileRef.current = false;
    scheduleHideProfile();
  }, [scheduleHideProfile]);

  const handleRoleChange = useCallback((key: string, role: string) => {
    setRoleByKey((prev) => ({
      ...prev,
      [key]: role,
    }));
  }, []);

  const handleRemove = useCallback((key: string) => {
    setLocalMembers((prev) => prev.filter((member) => getMemberKey(member) !== key));
  }, []);

  return (
    <>
      <Menu
        open={open}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        disableAutoFocus
        disableAutoFocusItem
        disableEnforceFocus
        slotProps={{
          list: {
            'aria-label': 'Members list',
            sx: {
              p: 0,
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '60vh',
              overflow: 'hidden',
            },
          },
        }}
        sx={{
          [`& .${menuClasses.paper}`]: {
            borderRadius: 6,
            width: 1,
            maxWidth: 375,
            overflow: 'hidden',
            marginLeft: '-30px',
          },
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            py: 2.5,
            px: 3,
          }}
        >
          <Typography component="span" variant="h6">
            Member&apos;s List
          </Typography>
          <IconButton onClick={onClose} aria-label="Close members list" size="small">
            <IconifyIcon icon="material-symbols:close-rounded" color="text.primary" fontSize={20} />
          </IconButton>
        </Stack>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            py: 1,
          }}
        >
          {localMembers.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', px: 3, py: 2, textAlign: 'center' }}
            >
              No members yet
            </Typography>
          ) : (
            <List dense disablePadding>
              {localMembers.map((member) => {
                const key = getMemberKey(member);
                return (
                  <MemberListItem
                    key={key}
                    member={member}
                    role={roleByKey[key] ?? defaultRole}
                    onRoleChange={handleRoleChange}
                    onRemove={handleRemove}
                    onRowMouseEnter={handleRowMouseEnter}
                    onRowMouseLeave={handleRowMouseLeave}
                  />
                );
              })}
            </List>
          )}
        </Box>

        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            flexShrink: 0,
            px: 3,
            py: 2.5,
            gap: 2,
          }}
        >
          <Button
            variant="text"
            color="neutral"
            startIcon={<IconifyIcon icon="material-symbols:add" fontSize={20} />}
            sx={{ mr: 'auto' }}
          >
            Invite more
          </Button>

          <Stack direction="row" sx={{ gap: 2 }}>
            <Button color="neutral" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>Confirm</Button>
          </Stack>
        </Stack>
      </Menu>

      <MemberProfilePopper
        open={showProfileOnHover && Boolean(hoveredMember)}
        anchorEl={hoveredRowEl}
        user={hoveredMember}
        onMouseEnter={handleProfileMouseEnter}
        onMouseLeave={handleProfileMouseLeave}
      />
    </>
  );
};

export default MembersListMenu;
