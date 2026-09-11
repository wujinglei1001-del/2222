'use client';

import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Fade,
  Link,
  Paper,
  Popper,
  Stack,
  Typography,
  badgeClasses,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import OutlinedBadge from 'components/styled/OutlinedBadge';
import StyledTextField from 'components/styled/StyledTextField';

export const MEMBER_PROFILE_WIDTH = 375;

export interface MemberProfileUser {
  id?: string | number;
  name: string;
  avatar?: string;
  email?: string;
  status?: string;
}

interface MemberProfilePopperProps {
  open: boolean;
  user: MemberProfileUser | null;
  anchorEl: HTMLElement | null;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const MemberProfilePopper = ({
  open,
  user,
  anchorEl,
  onMouseEnter,
  onMouseLeave,
}: MemberProfilePopperProps) => {
  const [quickMessage, setQuickMessage] = useState('');

  if (!user || !anchorEl) return null;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="left-start"
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
        {
          name: 'preventOverflow',
          options: {
            padding: 8,
          },
        },
      ]}
      sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
    >
      <Fade in={open} timeout={200}>
        <Paper
          variant="elevation"
          elevation={6}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          sx={(theme) => ({
            width: MEMBER_PROFILE_WIDTH,
            borderRadius: 6,
            p: 3,
            backgroundImage: 'none',
            bgcolor: theme.vars.palette.background.menu,
          })}
        >
          <Stack direction="row" sx={{ gap: 2, alignItems: 'center', mb: 3 }}>
            <OutlinedBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              color="success"
              sx={{
                [`& .${badgeClasses.badge}`]: {
                  display: user.status === 'offline' ? 'none' : 'block',
                  height: 16,
                  width: 16,
                  borderRadius: '50%',
                  border: 2,
                  borderColor: 'background.paper',
                },
              }}
            >
              <Avatar src={user.avatar} alt={user.name} sx={{ width: 88, height: 88 }} />
            </OutlinedBadge>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" sx={{ gap: 2, alignItems: 'center', mb: 0.5, minWidth: 0 }}>
                <Typography
                  variant="h5"
                  noWrap
                  sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {user.name}
                </Typography>
                <Chip
                  label={
                    user.status
                      ? user.status.charAt(0).toUpperCase() + user.status.slice(1)
                      : 'Active'
                  }
                  variant="filled"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 700, flexShrink: 0 }}
                />
              </Stack>

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Software Engineer
              </Typography>

              <Stack direction="row" sx={{ gap: 2, mt: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  <Typography
                    component="span"
                    variant="subtitle2"
                    sx={{ fontWeight: 500, mr: 0.5, color: 'text.primary' }}
                  >
                    ID:
                  </Typography>
                  {user.id ?? '—'}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Full Time
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" sx={{ gap: 1, mb: 3 }}>
            <Button fullWidth variant="soft" color="neutral">
              <IconifyIcon icon="material-symbols:call-outline-rounded" fontSize={20} />
            </Button>
            <Button fullWidth variant="soft" color="neutral">
              <IconifyIcon icon="material-symbols:chat-bubble-outline-rounded" fontSize={20} />
            </Button>
            <Button fullWidth variant="soft" color="neutral">
              <IconifyIcon icon="material-symbols:mail-outline-rounded" fontSize={20} />
            </Button>
          </Stack>

          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', mb: 3 }}>
            <StyledTextField
              hiddenLabel
              placeholder="Send a quick message"
              value={quickMessage}
              onChange={(event) => setQuickMessage(event.target.value)}
              variant="filled"
              fullWidth
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  setQuickMessage('');
                }
              }}
            />
            <Button
              variant="soft"
              color="neutral"
              sx={{ flexShrink: 0 }}
              shape="square"
              onClick={() => setQuickMessage('')}
              aria-label="Send quick message"
            >
              <IconifyIcon icon="material-symbols:send-outline-rounded" fontSize={20} />
            </Button>
          </Stack>

          <Stack sx={{ gap: 1.25, mb: 2 }}>
            <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
              <IconifyIcon icon="material-symbols:mail-outline-rounded" />
              {user.email ? (
                <Link
                  href={`mailto:${user.email}`}
                  underline="hover"
                  sx={{ typography: 'subtitle2', color: 'primary.main' }}
                >
                  {user.email}
                </Link>
              ) : (
                <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
                  —
                </Typography>
              )}
            </Stack>
            <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
              <IconifyIcon icon="material-symbols:call-outline-rounded" />
              <Link
                href="tel:+19234657890"
                underline="hover"
                sx={{ typography: 'subtitle2', color: 'text.secondary' }}
              >
                +1-923-465-7890
              </Link>
            </Stack>
            <Stack direction="row" sx={{ gap: 1.5, alignItems: 'flex-start' }}>
              <IconifyIcon icon="material-symbols:location-on-outline-rounded" />
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                New York
                <br />( Current time: 10:45 PM )
              </Typography>
            </Stack>
          </Stack>

          <Button
            variant="text"
            color="primary"
            endIcon={
              <IconifyIcon
                icon="material-symbols:chevron-right-rounded"
                sx={{ width: 20, height: 20 }}
              />
            }
          >
            View details
          </Button>
        </Paper>
      </Fade>
    </Popper>
  );
};

export default MemberProfilePopper;
