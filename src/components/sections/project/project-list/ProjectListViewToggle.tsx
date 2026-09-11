'use client';

import { memo } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

interface ProjectListViewToggleProps {
  viewType: 'list' | 'grid';
  onViewTypeChange: (viewType: 'list' | 'grid') => void;
}

const viewToggleGroupSx = {
  borderRadius: 3,
  gap: 0.5,
  p: 0.5,
  '& .MuiToggleButton-root': {
    border: 'none',
    borderRadius: 2.5,
    marginLeft: '0 !important',
    '&.Mui-selected': {
      borderRadius: 2.5,
    },
  },
};

const ProjectListViewToggle = ({ viewType, onViewTypeChange }: ProjectListViewToggleProps) => (
  <ToggleButtonGroup
    color="primary"
    value={viewType}
    exclusive
    onChange={(_event, newViewType: 'list' | 'grid' | null) => {
      if (newViewType !== null) {
        onViewTypeChange(newViewType);
      }
    }}
    sx={viewToggleGroupSx}
  >
    <ToggleButton value="list" aria-label="List view">
      <IconifyIcon
        icon="material-symbols:view-list-outline-rounded"
        color={viewType === 'list' ? 'primary.dark' : 'text.secondary'}
        fontSize={20}
      />
    </ToggleButton>
    <ToggleButton value="grid" aria-label="Grid view">
      <IconifyIcon
        icon="material-symbols:grid-view-outline-rounded"
        color={viewType === 'grid' ? 'primary.dark' : 'text.secondary'}
        fontSize={20}
      />
    </ToggleButton>
  </ToggleButtonGroup>
);

export default memo(ProjectListViewToggle);
