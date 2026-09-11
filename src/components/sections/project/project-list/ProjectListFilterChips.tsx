'use client';

import { memo } from 'react';
import { Button, Stack, SxProps, Theme } from '@mui/material';
import {
  PROJECT_LIST_FILTERS,
  type ProjectListFilter,
} from 'components/sections/project/common/projectMemberStyles';

interface ProjectListFilterChipsProps {
  selectedFilter: ProjectListFilter;
  onFilterChange: (filter: ProjectListFilter) => void;
  sx?: SxProps<Theme>;
}

const ProjectListFilterChips = ({
  selectedFilter,
  onFilterChange,
  sx,
}: ProjectListFilterChipsProps) => (
  <Stack
    direction="row"
    sx={{
      gap: 1,
      flexWrap: { xs: 'wrap', md: 'nowrap' },
      alignItems: 'center',
      ...sx,
    }}
  >
    {PROJECT_LIST_FILTERS.map((filter) => (
      <Button
        key={filter}
        size="small"
        variant="soft"
        color={selectedFilter === filter ? 'primary' : 'neutral'}
        onClick={() => onFilterChange(filter)}
        sx={{
          borderRadius: 3,
          textTransform: 'none',
          fontSize: 13,
          py: 0.5,
          px: 1.5,
          flexShrink: 0,
        }}
      >
        {filter}
      </Button>
    ))}
  </Stack>
);

export default memo(ProjectListFilterChips);
