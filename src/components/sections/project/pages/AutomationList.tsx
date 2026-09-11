'use client';

import { SyntheticEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { Box, Button, Chip, Menu, MenuItem, Stack, Tab, Typography } from '@mui/material';
import { automationsData } from 'data/project/automations';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import AutomationCard from 'components/sections/project/automation/AutomationCard';
import ProjectHeader from 'components/sections/project/common/ProjectHeader';
import { ProjectLeftActions } from 'components/sections/project/common/ProjectHeaderActions';

interface TextSelectOption {
  value: string;
  label: string;
}

interface TextSelectButtonProps {
  value: string;
  options: TextSelectOption[];
  onChange: (value: string) => void;
  endIcon?: React.ReactNode;
}

const TextSelectButton = ({ value, options, onChange, endIcon }: TextSelectButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const selectedLabel = options.find((option) => option.value === value)?.label ?? value;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    handleClose();
  };

  return (
    <>
      <Button
        variant="text"
        color="neutral"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        endIcon={endIcon}
        sx={{ flexShrink: 0 }}
      >
        {selectedLabel}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === value}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const AutomationList = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [createdByFilter, setCreatedByFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const filteredAutomations = useMemo(() => {
    let filtered = automationsData;

    if (searchTerm) {
      filtered = filtered.filter(
        (auto) =>
          auto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auto.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filter === 'active') {
      filtered = filtered.filter((auto) => auto.isActive);
    } else if (filter === 'inactive') {
      filtered = filtered.filter((auto) => !auto.isActive);
    }

    if (sortBy === 'latest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === 'oldest') {
      filtered = [...filtered].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    }

    return filtered;
  }, [searchTerm, filter, sortBy]);

  const inactiveCount = automationsData.filter((auto) => !auto.isActive).length;
  const activeCount = automationsData.filter((auto) => auto.isActive).length;

  const handleTabChange = (_: SyntheticEvent, newValue: string) => {
    setFilter(newValue as 'all' | 'active' | 'inactive');
  };

  const handleToggle = (id: number, isActive: boolean) => {
    console.log(`Automation ${id} toggled to ${isActive}`);
  };

  const handleEdit = (id: number) => {
    console.log(`navigate to edit automation ${id}`);
  };

  const handleDuplicate = (id: number) => {
    console.log(`Duplicate automation ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Delete automation ${id}`);
  };

  const handleAddAutomation = () => {
    router.push(`${paths.projectManagement}/automations/create`);
  };

  const handleImport = () => {
    console.log('Import clicked');
  };

  const handleExport = () => {
    console.log('Export clicked');
  };

  const topRightActions = (
    <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center' }}>
      <Button
        variant="soft"
        color="neutral"
        startIcon={
          <IconifyIcon icon="material-symbols:file-upload-outline-rounded" fontSize={20} />
        }
        onClick={handleImport}
      >
        Import
      </Button>
      <Button
        variant="soft"
        color="neutral"
        startIcon={
          <IconifyIcon icon="material-symbols:file-download-outline-rounded" fontSize={20} />
        }
        onClick={handleExport}
      >
        Export
      </Button>
    </Stack>
  );

  const bottomRightActions = (
    <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center', flexWrap: 'wrap' }}>
      <TextSelectButton
        value={createdByFilter}
        onChange={setCreatedByFilter}
        options={[
          { value: 'all', label: 'Created by: All' },
          { value: 'me', label: 'Created by: Me' },
        ]}
      />

      <TextSelectButton
        value={sortBy}
        onChange={setSortBy}
        endIcon={<IconifyIcon icon="material-symbols:swap-vert-rounded" sx={{ fontSize: 16 }} />}
        options={[
          { value: 'latest', label: 'Sort by: Latest' },
          { value: 'oldest', label: 'Sort by: Oldest' },
        ]}
      />
    </Stack>
  );

  return (
    <Box>
      <ProjectHeader
        title="Project Automations"
        subtitle="Explore various project automations to enhance efficiency and save time!"
        showTaskDialog={false}
        topActions={topRightActions}
        toolbar={{
          left: (
            <ProjectLeftActions
              onAddClick={handleAddAutomation}
              onSearch={setSearchTerm}
              addButtonText="Add automation"
              addButtonIcon="mdi:plus"
              searchPlaceholder="Search automation"
              showFilterDialog={false}
            />
          ),
          right: bottomRightActions,
        }}
      />
      <Box sx={{ p: { xs: 3, md: 5 } }}>
        <TabContext value={filter}>
          <TabList onChange={handleTabChange}>
            <Tab
              label="All"
              value="all"
              sx={{
                textTransform: 'none',
              }}
            />
            <Tab
              label={
                <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
                  <span>Active</span>
                  <Chip
                    label={activeCount}
                    color="info"
                    size="small"
                    sx={{
                      height: 20,
                      width: 20,
                    }}
                  />
                </Stack>
              }
              value="active"
              sx={{
                textTransform: 'none',
              }}
            />
            <Tab
              label={
                <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
                  <span>Inactive</span>
                  <Chip
                    label={inactiveCount}
                    size="small"
                    color="info"
                    sx={{
                      height: 20,
                      width: 20,
                    }}
                  />
                </Stack>
              }
              value="inactive"
              sx={{
                textTransform: 'none',
              }}
            />
          </TabList>
        </TabContext>

        <Stack sx={{ gap: 2, mt: 3 }}>
          {filteredAutomations.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                }}
              >
                No automations found
              </Typography>
            </Box>
          ) : (
            filteredAutomations.map((automation) => (
              <AutomationCard
                key={automation.id}
                automation={automation}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default AutomationList;
