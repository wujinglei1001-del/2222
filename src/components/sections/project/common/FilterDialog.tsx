'use client';

import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  dialogClasses,
  inputBaseClasses,
  listItemButtonClasses,
} from '@mui/material';
import { filterCollaborators, filterPriorities, filterStatuses } from 'data/project/timeline-data';
import DateRangePicker from 'components/base/DateRangePicker';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
}

const options = ['Within 1 week', 'Within 1 month', 'Within 2 months', 'Within 6 months'];

const FilterDialog = ({ open, onClose }: FilterDialogProps) => {
  const [customDateRange, setCustomDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedCollaborators, setSelectedCollaborators] = useState<number[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const handleSelectPriority = (label: string) => {
    setSelectedPriority((prev) => (prev === label ? null : label));
  };

  const handleSelectCollaborator = (id: number) => {
    setSelectedCollaborators((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id],
    );
  };

  const handleSelect = (label: string) => {
    setSelected((prev) => (prev === label ? null : label));
  };

  const handleResetAll = () => {
    setCustomDateRange([null, null]);
    setSelected(null);
    setSelectedCollaborators([]);
    setSelectedPriority(null);
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      sx={{
        [`& .${dialogClasses.paper}`]: {
          borderRadius: 6,
          m: 0,
          p: 0,
          maxWidth: { sm: '375px !important' },
          maxHeight: 'calc(100vh - 160px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          outline: 'none',
          '&:focus-visible': {
            outline: 'none',
          },
        },
        [`& .${dialogClasses.container}`]: {
          py: 5,
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5,
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle1" component="span" sx={{ fontWeight: 700 }}>
          Filter
        </Typography>
        <IconButton onClick={onClose} size="small">
          <IconifyIcon icon="material-symbols:close" sx={{ fontSize: 20, color: 'neutral.dark' }} />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ flexShrink: 0 }} />

      <Box sx={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
        <DialogContent sx={{ py: { xs: 3 }, px: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, px: 3 }}>
            Collaborators
          </Typography>

          <StyledTextField
            placeholder="Search with a keyword"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon
                      icon="material-symbols:search"
                      sx={{ color: 'text.secondary', fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ mb: 2, px: 3 }}
          />

          <List
            disablePadding
            sx={{
              [`& .${listItemButtonClasses.root}`]: {
                px: 3.5,
                py: 0.5,
                borderRadius: 0,
              },
            }}
          >
            {filterCollaborators.map((collaborator) => (
              <ListItemButton
                key={collaborator.id}
                onClick={() => handleSelectCollaborator(collaborator.id)}
                sx={{
                  borderRadius: 1,
                  bgcolor: selectedCollaborators.includes(collaborator.id)
                    ? 'action.selected'
                    : 'transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Checkbox
                    edge="start"
                    checked={selectedCollaborators.includes(collaborator.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>

                <Avatar
                  src={collaborator.avatar}
                  alt={collaborator.name}
                  sx={{ width: 24, height: 24, mr: 1 }}
                />

                <ListItemText
                  primary={collaborator.name}
                  slotProps={{ primary: { variant: 'subtitle2', sx: { fontWeight: 400 } } }}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <Divider />
        <DialogContent sx={{ py: { xs: 3 }, px: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, px: 3 }}>
            Due date
          </Typography>
          <List
            disablePadding
            sx={{ [`& .${listItemButtonClasses.root}`]: { px: 3.5, py: 0.5, borderRadius: 0 } }}
          >
            {options.map((label) => (
              <ListItemButton
                key={label}
                onClick={() => handleSelect(label)}
                sx={{
                  borderRadius: 1,
                  bgcolor: selected === label ? 'action.selected' : 'transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Checkbox edge="start" checked={selected === label} tabIndex={-1} disableRipple />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  slotProps={{ primary: { variant: 'subtitle2', sx: { fontWeight: 400 } } }}
                />
              </ListItemButton>
            ))}

            {/* Custom Option */}
            <ListItemButton
              onClick={() => handleSelect('Custom')}
              sx={{
                borderRadius: 1,
                bgcolor: selected === 'Custom' ? 'action.selected' : 'transparent',
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox
                  edge="start"
                  checked={selected === 'Custom'}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                primary="Custom"
                slotProps={{
                  primary: { variant: 'body2' },
                }}
              />
            </ListItemButton>
          </List>

          {selected === 'Custom' && (
            <Box sx={{ px: 3, pt: 1, width: '100%', boxSizing: 'border-box' }}>
              <DateRangePicker
                selected={customDateRange[0] || undefined}
                startDate={customDateRange[0] || undefined}
                endDate={customDateRange[1] || undefined}
                onChange={(dates) => setCustomDateRange(dates)}
                withPortal
                isClearable
                dateFormat="MM/dd/yy"
                placeholderText="Select Date Range"
                customInput={
                  <StyledTextField
                    fullWidth
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconifyIcon
                              icon="material-symbols:calendar-month-outline-rounded"
                              sx={{ color: 'text.secondary' }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                }
                sx={{
                  width: '100%',
                  '& .react-datepicker-wrapper': {
                    width: '100%',
                  },
                  [`& .react-datepicker-wrapper.clearable`]: {
                    [`& .${inputBaseClasses.root}`]: { paddingLeft: 2 },
                  },
                }}
              />
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogContent sx={{ p: { xs: 3 } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            Status
          </Typography>
          <Stack sx={{ gap: 1 }}>
            {filterStatuses.map((status) => (
              <Chip key={status.label} size="medium" color={status.color} label={status.label} />
            ))}
          </Stack>
        </DialogContent>
        <Divider />
        <DialogContent sx={{ py: { xs: 3 }, px: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, px: 3 }}>
            Priority
          </Typography>

          <List
            disablePadding
            sx={{
              [`& .${listItemButtonClasses.root}`]: {
                px: 3.5,
                py: 0.5,
                borderRadius: 0,
              },
            }}
          >
            {filterPriorities.map((priority) => (
              <ListItemButton
                key={priority.label}
                onClick={() => handleSelectPriority(priority.label)}
                sx={{
                  borderRadius: 1,
                  bgcolor: selectedPriority === priority.label ? 'action.selected' : 'transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Checkbox
                    edge="start"
                    checked={selectedPriority === priority.label}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>

                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: `${priority.color}.main`,
                    mr: 0.5,
                  }}
                />

                <ListItemText
                  primary={priority.label}
                  slotProps={{
                    primary: { variant: 'subtitle2', sx: { fontWeight: 400 } },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Box>

      <Divider sx={{ flexShrink: 0 }} />
      <DialogActions
        sx={{
          py: 1.5,
          px: { xs: 3 },
          flexShrink: 0,
          justifyContent: 'space-between',
        }}
      >
        <Button color="neutral" variant="text" onClick={handleResetAll}>
          Reset all
        </Button>
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={onClose} color="neutral">
            Cancel
          </Button>
          <Button color="primary" variant="text">
            Confirm
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
