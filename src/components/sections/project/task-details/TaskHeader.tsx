'use client';

import { MouseEvent, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  Stack,
  Typography,
  menuClasses,
} from '@mui/material';
import { type TaskStatus, statusOptions, taskDetailsData } from 'data/project/task-details';
import IconifyIcon from 'components/base/IconifyIcon';

type TaskHeaderProps = {
  onClose?: () => void;
};

const TaskHeader = ({ onClose }: TaskHeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedStatus, setSelectedStatus] = useState(taskDetailsData.status);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status: TaskStatus) => {
    setSelectedStatus(status);
    handleMenuClose();
  };

  const currentStatus =
    statusOptions.find((opt) => opt.value === selectedStatus) || statusOptions[0];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        borderBottomWidth: { xs: 0, lg: 1 },
        borderBottomStyle: 'solid',
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Button
          variant="soft"
          size="small"
          color={currentStatus.color as 'success' | 'info' | 'neutral'}
          endIcon={<IconifyIcon icon="material-symbols:expand-more" fontSize="20px !important" />}
          onClick={handleMenuOpen}
          aria-controls={open ? 'status-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          sx={{
            borderRadius: 16,
          }}
        >
          {selectedStatus}
        </Button>

        <Menu
          id="status-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          sx={{
            [`& .${menuClasses.paper}`]: {
              minWidth: 180,
              p: 0,
            },
          }}
        >
          {statusOptions.map((option) => {
            const isSelected = selectedStatus === option.value;
            return (
              <MenuItem
                key={option.value}
                onClick={() => handleStatusChange(option.value)}
                selected={isSelected}
                sx={{
                  bgcolor: isSelected ? 'action.selected' : 'transparent',
                  py: 1,
                  px: 1.5,
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Chip
                    label={option.label}
                    size="small"
                    color={option.color as 'success' | 'info' | 'default'}
                    variant={isSelected ? 'soft' : 'soft'}
                  />
                  {isSelected && (
                    <IconifyIcon
                      icon="material-symbols:check"
                      sx={{ fontSize: 18, color: 'text.secondary', ml: 1 }}
                    />
                  )}
                </Stack>
              </MenuItem>
            );
          })}
        </Menu>

        <Stack direction="row" sx={{ gap: 1 }}>
          <Button shape="square" color="error">
            <IconifyIcon icon="material-symbols:delete-outline" fontSize={20} />
          </Button>
          <Button shape="square">
            <IconifyIcon icon="material-symbols:more-horiz" color="text.primary" fontSize={20} />
          </Button>
          <Button shape="square" onClick={onClose}>
            <IconifyIcon icon="material-symbols:close" color="text.primary" fontSize={20} />
          </Button>
        </Stack>
      </Stack>
      <Box>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 1,
          }}
        >
          {taskDetailsData.title}
        </Typography>
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            Task created by
          </Typography>
          <Avatar
            src={taskDetailsData.createdBy.avatar}
            sx={{
              width: 24,
              height: 24,
              bgcolor: 'primary.main',
              fontSize: 12,
            }}
          >
            {taskDetailsData.createdBy.name.charAt(0)}
          </Avatar>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
            }}
          >
            {taskDetailsData.createdBy.name}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default TaskHeader;
