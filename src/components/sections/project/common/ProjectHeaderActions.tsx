'use client';

import { useState } from 'react';
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material';
import Button from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material/styles';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import InviteDialog from 'components/common/InviteDialog';
import ProjectMembersAvatarGroup from 'components/sections/project/common/ProjectMembersAvatarGroup';
import StyledTextField from 'components/styled/StyledTextField';
import FilterDialog from './FilterDialog';
import {
  type ProjectHeaderToolbarLayout,
  useProjectHeaderToolbarLayout,
} from './ProjectHeaderToolbarContext';

export type TimelineViewType = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

export interface ProjectHeaderActionsProps {
  view?: TimelineViewType;
  onViewChange?: (view: TimelineViewType) => void;
  onDuplicate?: () => void;
  onExport?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onInvite?: () => void;
  onShare?: () => void;
  onAddClick?: () => void;
  onSearch?: (searchTerm: string) => void;
  addButtonText?: string;
  addButtonIcon?: string;
  searchPlaceholder?: string;
  showFilterDialog?: boolean;
  customActions?: React.ReactNode;
}

const timelineViewOptions: { value: TimelineViewType; label: string }[] = [
  { value: 'dayGridMonth', label: 'Month View' },
  { value: 'timeGridWeek', label: 'Week View' },
  { value: 'timeGridDay', label: 'Day View' },
];

const bottomToolbarActions = [
  {
    key: 'duplicate',
    label: 'Duplicate',
    icon: 'material-symbols:content-copy-outline-rounded',
  },
  {
    key: 'export',
    label: 'Export',
    icon: 'material-symbols:file-export-outline-rounded',
  },
  {
    key: 'archive',
    label: 'Archive',
    icon: 'material-symbols:archive-outline-rounded',
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: 'material-symbols:delete-outline-rounded',
  },
] as const;

type BottomToolbarActionKey = (typeof bottomToolbarActions)[number]['key'];

const getSearchContainerSx = (
  toolbarLayout: ProjectHeaderToolbarLayout,
  downSm: boolean,
): SxProps<Theme> => {
  if (toolbarLayout === 'inline') {
    return {
      gap: 1,
      alignItems: 'center',
      flex: 1,
      minWidth: 0,
    };
  }

  return {
    gap: 1,
    alignItems: 'center',
    flex: downSm ? 1 : '0 1 auto',
    minWidth: 0,
    width: downSm ? 1 : 'auto',
    maxWidth: downSm ? undefined : { sm: 320 },
  };
};

const getSearchFieldSx = (
  toolbarLayout: ProjectHeaderToolbarLayout,
  downSm: boolean,
): SxProps<Theme> => {
  if (toolbarLayout === 'inline') {
    return {
      flex: '1 1 auto',
      minWidth: { xs: 80, sm: 100 },
      maxWidth: { sm: 200, md: 280 },
      width: 'auto',
    };
  }

  return {
    flex: '1 1 auto',
    minWidth: downSm ? 0 : { sm: 100 },
    width: downSm ? 1 : { sm: 'auto' },
    maxWidth: downSm ? undefined : { sm: 280, md: 320 },
  };
};

interface ResponsiveActionButtonProps {
  label: string;
  icon: string;
  onClick?: () => void;
  upXl: boolean;
  iconSx?: SxProps<Theme>;
}

const ResponsiveActionButton = ({
  label,
  icon,
  onClick,
  upXl,
  iconSx,
}: ResponsiveActionButtonProps) => {
  const iconElement = (
    <IconifyIcon
      icon={icon}
      sx={[{ fontSize: 20 }, ...(Array.isArray(iconSx) ? iconSx : iconSx ? [iconSx] : [])]}
    />
  );

  return (
    <Tooltip title={label} disableHoverListener={upXl}>
      <Button
        variant="text"
        size="medium"
        color="neutral"
        shape={upXl ? undefined : 'square'}
        onClick={onClick}
        startIcon={upXl ? iconElement : undefined}
        sx={{ flexShrink: 0 }}
      >
        {upXl ? label : iconElement}
      </Button>
    </Tooltip>
  );
};

interface ProjectFilterActionProps {
  upXl: boolean;
  sx?: SxProps<Theme>;
}

const ProjectFilterAction = ({ upXl, sx }: ProjectFilterActionProps) => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  return (
    <>
      <Box sx={sx}>
        <ResponsiveActionButton
          label="Filter"
          icon="material-symbols:filter-list-rounded"
          onClick={() => setFilterDialogOpen(true)}
          upXl={upXl}
          iconSx={{ color: 'text.primary' }}
        />
      </Box>
      <FilterDialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} />
    </>
  );
};

const ProjectMembersBar = ({ onInvite }: Pick<ProjectHeaderActionsProps, 'onInvite'>) => {
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
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexShrink: 0 }}>
        <ProjectMembersAvatarGroup max={5} avatarSize={36} sx={{ mr: '6px' }} />
        <Divider orientation="vertical" sx={{ height: 16 }} />
        <Button shape="circle" variant="soft" color="neutral" onClick={handleInviteClick}>
          <IconifyIcon icon="material-symbols:person-add-outline" sx={{ fontSize: 20 }} />
        </Button>
      </Stack>
      <InviteDialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} />
    </>
  );
};

export const ProjectTopRightActions = ({
  onInvite,
  onShare,
}: Pick<ProjectHeaderActionsProps, 'onInvite' | 'onShare'>) => {
  const { up } = useBreakpoints();
  const upMd = up('md');
  const shareIcon = <IconifyIcon icon="material-symbols:share-outline" sx={{ fontSize: 20 }} />;

  return (
    <Stack
      direction="row"
      sx={{
        gap: 2,
        alignItems: 'center',
        width: upMd ? 'auto' : 1,
        justifyContent: upMd ? 'flex-end' : 'space-between',
        flexShrink: 0,
      }}
    >
      <ProjectMembersBar onInvite={onInvite} />
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: 'center',
          flexShrink: 0,
          ml: upMd ? undefined : 'auto',
        }}
      >
        <Tooltip title="Share" disableHoverListener={upMd}>
          <Button
            color="neutral"
            variant="soft"
            shape={upMd ? undefined : 'square'}
            startIcon={upMd ? shareIcon : undefined}
            onClick={onShare}
            sx={{ flexShrink: 0 }}
          >
            {upMd ? 'Share' : shareIcon}
          </Button>
        </Tooltip>
        <Button shape="circle" variant="text" color="neutral" sx={{ flexShrink: 0 }}>
          <IconifyIcon icon="material-symbols:more-horiz" sx={{ fontSize: 24 }} />
        </Button>
      </Stack>
    </Stack>
  );
};

export const ProjectBottomRightActions = ({
  view = 'dayGridMonth',
  onViewChange,
  onDuplicate,
  onExport,
  onArchive,
  onDelete,
  showFilterDialog = true,
}: ProjectHeaderActionsProps) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const { up, down } = useBreakpoints();
  const upXl = up('xl');
  const downSm = down('sm');
  const downMd = down('md');

  const actionHandlers: Record<BottomToolbarActionKey, (() => void) | undefined> = {
    duplicate: onDuplicate,
    export: onExport,
    archive: onArchive,
    delete: onDelete,
  };

  const handleViewChange = (newView: TimelineViewType) => {
    onViewChange?.(newView);
  };

  const handleMenuAction = (actionKey: BottomToolbarActionKey) => {
    setMenuAnchorEl(null);
    actionHandlers[actionKey]?.();
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: 1,
          width: downSm ? 1 : 'auto',
          minWidth: 0,
          flexShrink: 0,
        }}
      >
        {showFilterDialog && downSm && <ProjectFilterAction upXl />}

        <Stack
          direction="row"
          sx={{ gap: 1, alignItems: 'center', flexShrink: 0, ml: downSm ? 'auto' : undefined }}
        >
          <StyledTextField
            select
            size="medium"
            value={view}
            onChange={(event) => handleViewChange(event.target.value as TimelineViewType)}
            sx={{ minWidth: 140, width: 140, flexShrink: 0 }}
          >
            {timelineViewOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </StyledTextField>

          {downMd ? (
            <IconButton onClick={(event) => setMenuAnchorEl(event.currentTarget)}>
              <IconifyIcon icon="material-symbols:tune-rounded" sx={{ fontSize: 24 }} />
            </IconButton>
          ) : (
            bottomToolbarActions.map((action) => (
              <ResponsiveActionButton
                key={action.key}
                label={action.label}
                icon={action.icon}
                onClick={actionHandlers[action.key]}
                upXl={upXl}
              />
            ))
          )}
        </Stack>
      </Stack>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {bottomToolbarActions.map((action) => (
          <MenuItem
            key={action.key}
            onClick={() => handleMenuAction(action.key)}
            sx={action.key === 'delete' ? { color: 'error.main' } : undefined}
          >
            <ListItemIcon>
              <IconifyIcon icon={action.icon} sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText>{action.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export const ProjectLeftActions = ({
  onAddClick,
  onSearch,
  addButtonText = 'New Task',
  addButtonIcon = 'mdi:plus',
  searchPlaceholder = 'Search tasks...',
  showFilterDialog = true,
  customActions,
}: Partial<ProjectHeaderActionsProps>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { up, down } = useBreakpoints();
  const upXl = up('xl');
  const downSm = down('sm');
  const toolbarLayout = useProjectHeaderToolbarLayout();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleAddClick = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
    if (onAddClick) {
      onAddClick();
    }
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          gap: 1.25,
          alignItems: 'center',
          flexWrap: 'nowrap',
          width: 1,
          minWidth: 0,
        }}
      >
        <Button
          variant="contained"
          startIcon={<IconifyIcon icon={addButtonIcon} sx={{ fontSize: 20 }} />}
          onClick={handleAddClick}
          sx={{ flexShrink: 0 }}
        >
          {addButtonText}
        </Button>

        <Stack direction="row" sx={getSearchContainerSx(toolbarLayout, downSm)}>
          <StyledTextField
            size="medium"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            sx={getSearchFieldSx(toolbarLayout, downSm)}
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
          />
          {showFilterDialog && !downSm && <ProjectFilterAction upXl={upXl} />}
        </Stack>

        {customActions}
      </Stack>
    </>
  );
};
