'use client';

import { MouseEvent, useCallback, useState } from 'react';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import { useTextTruncation } from 'hooks/useTextTruncation';
import { useSettingsContext } from 'providers/SettingsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import {
  type ProjectListFilter,
  projectMembers,
} from 'components/sections/project/common/projectMemberStyles';
import MembersListMenu from 'components/sections/project/project-list/MembersListMenu';
import ProjectListFilterChips from 'components/sections/project/project-list/ProjectListFilterChips';
import ProjectListMembersBar from 'components/sections/project/project-list/ProjectListMembersBar';
import ProjectListViewToggle from 'components/sections/project/project-list/ProjectListViewToggle';

interface ProjectListHeaderProps {
  workspaceName: string;
  workspaceDescription: string;
  onAddProject?: () => void;
  selectedFilter?: ProjectListFilter;
  defaultSelectedFilter?: ProjectListFilter;
  onFilterChange?: (filter: ProjectListFilter) => void;
  onViewTypeChange?: (viewType: 'list' | 'grid') => void;
  viewType?: 'list' | 'grid';
  inviteButtonIcon?: string;
  onInvite?: () => void;
}

const ProjectListHeader = ({
  workspaceName,
  workspaceDescription,
  onAddProject,
  selectedFilter: controlledSelectedFilter,
  defaultSelectedFilter = 'Running',
  onFilterChange,
  onViewTypeChange,
  viewType = 'list',
  inviteButtonIcon = 'material-symbols:person-add-outline',
  onInvite,
}: ProjectListHeaderProps) => {
  const [internalSelectedFilter, setInternalSelectedFilter] =
    useState<ProjectListFilter>(defaultSelectedFilter);
  const [membersMenuAnchorEl, setMembersMenuAnchorEl] = useState<HTMLElement | null>(null);
  const {
    config: { assetsDir },
  } = useSettingsContext();

  const isFilterControlled = controlledSelectedFilter !== undefined;
  const activeFilter = isFilterControlled ? controlledSelectedFilter : internalSelectedFilter;

  const handleFilterChange = useCallback(
    (filter: ProjectListFilter) => {
      if (!isFilterControlled) {
        setInternalSelectedFilter(filter);
      }
      onFilterChange?.(filter);
    },
    [isFilterControlled, onFilterChange],
  );

  const handleOpenMembersMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setMembersMenuAnchorEl(event.currentTarget);
  }, []);

  const handleCloseMembersMenu = useCallback(() => {
    setMembersMenuAnchorEl(null);
  }, []);

  const { displayText, shouldTruncate, toggleExpanded, isExpanded, expandText, collapseText } =
    useTextTruncation(workspaceDescription, {
      maxLength: 140,
      expandText: 'Read more',
      collapseText: 'Read less',
    });

  return (
    <Box sx={{ p: { xs: 1, md: 4 } }}>
      <MembersListMenu
        open={Boolean(membersMenuAnchorEl)}
        anchorEl={membersMenuAnchorEl}
        onClose={handleCloseMembersMenu}
        members={projectMembers}
      />

      <Box
        sx={{
          mb: 5,
          display: 'grid',
          gridTemplateColumns: { xs: 'auto 1fr', md: 'auto 1fr auto' },
          gridTemplateRows: { xs: 'auto auto auto', md: 'auto auto' },
          gridTemplateAreas: {
            xs: `"avatar title" "description description" "members members"`,
            md: `"avatar title members" ". description description"`,
          },
          columnGap: 2,
          rowGap: { xs: 0.3, md: 1 },
          alignItems: { md: 'center' },
        }}
      >
        <Avatar
          sx={{
            gridArea: 'avatar',
            width: 56,
            height: 56,
            bgcolor: 'success.lighter',
            fontWeight: 600,
            fontSize: 22,
            flexShrink: 0,
            alignSelf: { xs: 'start', md: 'center' },
          }}
        >
          <Image
            src={`${assetsDir}/images/logo/20.svg`}
            height={36}
            width={40}
            alt={workspaceName}
          />
        </Avatar>

        <Typography
          variant="h4"
          sx={{
            gridArea: 'title',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            alignSelf: 'center',
          }}
        >
          {workspaceName}
          <IconifyIcon fontSize={20} icon="material-symbols:star-rounded" color="warning.main" />
        </Typography>

        <Typography
          variant="body2"
          sx={{
            gridArea: 'description',
            color: 'text.secondary',
            mt: { xs: 0.5, md: 0 },
            minWidth: 0,
          }}
        >
          {displayText}
          {shouldTruncate && (
            <Typography
              component="span"
              onClick={toggleExpanded}
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                ml: 0.5,
                fontSize: 'inherit',
                fontWeight: 'inherit',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {isExpanded ? collapseText : expandText}
            </Typography>
          )}
        </Typography>

        <ProjectListMembersBar
          inviteButtonIcon={inviteButtonIcon}
          onOpenMembersMenu={handleOpenMembersMenu}
          onInvite={onInvite}
          sx={{
            gridArea: 'members',
            mt: { xs: 2, md: 0 },
            width: { xs: 1, md: 'auto' },
            justifySelf: { md: 'end' },
            alignSelf: { md: 'center' },
          }}
        />
      </Box>

      <Stack
        sx={{
          gap: 2,
          display: 'grid',
          alignItems: 'center',
          gridTemplateColumns: { xs: '1fr auto', md: 'auto minmax(0, 1fr) auto' },
          gridTemplateAreas: {
            xs: `"button toggle" "filters filters"`,
            md: `"button filters toggle"`,
          },
        }}
      >
        <Box sx={{ gridArea: 'button' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={
              <IconifyIcon
                icon="material-symbols:add"
                fontSize={18}
                sx={{ width: 18, height: 18 }}
              />
            }
            onClick={onAddProject}
            sx={{ flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            Add new project
          </Button>
        </Box>

        <Box sx={{ gridArea: 'filters', minWidth: 0, overflow: { md: 'hidden' } }}>
          <ProjectListFilterChips
            selectedFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
        </Box>

        <Box sx={{ gridArea: 'toggle', justifySelf: 'end' }}>
          <ProjectListViewToggle
            viewType={viewType}
            onViewTypeChange={(nextViewType) => onViewTypeChange?.(nextViewType)}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default ProjectListHeader;
