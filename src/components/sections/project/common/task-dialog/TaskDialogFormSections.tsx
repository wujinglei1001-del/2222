'use client';

import { useState } from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  DialogContent,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  chipClasses,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import type { LabelColor } from 'types/task-details';
import IconifyIcon from 'components/base/IconifyIcon';
import CreateLabelDialog from 'components/sections/project/common/labels/CreateLabelDialog';
import LabelPicker from 'components/sections/project/common/labels/LabelPicker';
import {
  type LabelOption,
  defaultLabelOptions,
  taskLabelToOption,
} from 'components/sections/project/common/labels/labelConfig';
import StyledTextField from 'components/styled/StyledTextField';
import type { TaskFormData } from '../TaskDialog';
import {
  collaboratorData,
  taskGroupOptions,
  taskPriorityOptions,
  taskStatusOptions,
} from './taskDialogConfig';

interface FormSectionProps {
  control: Control<TaskFormData>;
  errors: FieldErrors<TaskFormData>;
}

interface CollaboratorsSectionProps extends FormSectionProps {
  collaboratorSearch: string;
  onCollaboratorSearchChange: (value: string) => void;
}

interface DurationSectionProps extends FormSectionProps {
  startDateOpen: boolean;
  endDateOpen: boolean;
  onStartDateOpenChange: (open: boolean) => void;
  onEndDateOpenChange: (open: boolean) => void;
}

export interface TaskDialogFormSectionsProps
  extends CollaboratorsSectionProps, DurationSectionProps {}

interface DateFieldProps extends FormSectionProps {
  name: 'startDate' | 'endDate';
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BasicDetailsSection = ({ control, errors }: FormSectionProps) => (
  <DialogContent sx={{ p: { xs: 3 } }}>
    <Stack sx={{ gap: 1, textAlign: 'left' }}>
      <Controller
        name="task"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            variant="filled"
            fullWidth
            label="Task"
            error={!!errors.task}
            helperText={errors.task?.message}
          />
        )}
      />

      <Controller
        name="group"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            select
            label="Group"
            error={!!errors.group}
            helperText={errors.group?.message}
          >
            {taskGroupOptions.map((groupOption) => (
              <MenuItem key={groupOption.value} value={groupOption.value}>
                {groupOption.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <div>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              select
              label="Status"
              margin="normal"
              sx={{ mb: 0.5 }}
              error={!!errors.status}
              helperText={errors.status?.message}
            >
              {taskStatusOptions.map((statusOption) => (
                <MenuItem key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Button variant="text" size="small" color="primary" sx={{ alignSelf: 'flex-start' }}>
          Edit status
        </Button>
      </div>
    </Stack>
  </DialogContent>
);

const LabelsSection = () => {
  const [availableLabels, setAvailableLabels] = useState<LabelOption[]>(defaultLabelOptions);
  const [selectedLabelNames, setSelectedLabelNames] = useState<string[]>(() =>
    defaultLabelOptions
      .filter((labelOption) => labelOption.checked)
      .map((labelOption) => labelOption.label),
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleToggleLabel = (label: string, checked: boolean) => {
    setSelectedLabelNames((previous) =>
      checked ? [...previous, label] : previous.filter((name) => name !== label),
    );
  };

  const handleCreateLabel = (label: string, color: LabelColor) => {
    const newOption = taskLabelToOption({ label, color });
    setAvailableLabels((previous) => [...previous, newOption]);
    setSelectedLabelNames((previous) => [...previous, label]);
    setCreateDialogOpen(false);
  };

  return (
    <DialogContent sx={{ p: { xs: 3 } }}>
      <LabelPicker
        showTitle
        availableLabels={availableLabels}
        selectedLabels={selectedLabelNames}
        onToggleLabel={handleToggleLabel}
        onCreateLabelClick={() => setCreateDialogOpen(true)}
      />
      <CreateLabelDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateLabel}
      />
    </DialogContent>
  );
};

const PrioritySection = ({ control }: Pick<FormSectionProps, 'control'>) => (
  <DialogContent sx={{ p: { xs: 3 } }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
      Priority
    </Typography>
    <Controller
      name="priority"
      control={control}
      render={({ field: { value, onChange } }) => (
        <Box sx={{ display: 'flex', gap: 1, flex: 1 }}>
          {taskPriorityOptions.map((priorityOption) => {
            const isActive = value === priorityOption.label;
            return (
              <Chip
                key={priorityOption.label}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: `${priorityOption.color}.main`,
                      }}
                    />
                    <Typography variant="caption">{priorityOption.label}</Typography>
                  </Box>
                }
                onClick={() => onChange(priorityOption.label)}
                sx={{
                  flex: 1,
                  border: 'none',
                  borderRadius: 2,
                  px: 1.5,
                  height: 36,
                  bgcolor: isActive ? `background.elevation2` : 'background.elevation1',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: isActive ? `${priorityOption.color}30` : '#e6ebf0',
                  },
                  [`& .${chipClasses.label}`]: {
                    px: 0,
                  },
                }}
              />
            );
          })}
        </Box>
      )}
    />
  </DialogContent>
);

const CollaboratorsSection = ({
  control,
  errors,
  collaboratorSearch,
  onCollaboratorSearchChange,
}: CollaboratorsSectionProps) => (
  <DialogContent sx={{ p: { xs: 3 } }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
      Collaborators
    </Typography>

    <StyledTextField
      value={collaboratorSearch}
      onChange={(event) => onCollaboratorSearchChange(event.target.value)}
      fullWidth
      variant="filled"
      placeholder="Search with a keyword"
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
          endAdornment: collaboratorSearch && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => onCollaboratorSearchChange('')}
                sx={{ p: 0.5 }}
              >
                <IconifyIcon
                  icon="material-symbols:close"
                  sx={{ color: 'text.secondary', fontSize: 16 }}
                />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      sx={{ mb: 2 }}
    />

    <Controller
      name="collaborators"
      control={control}
      render={({ field: { value, onChange } }) => {
        const searchValue = collaboratorSearch.toLowerCase().trim();

        const filteredCollaborators = collaboratorData.filter((collaboratorItem) => {
          if (!searchValue) return true;
          return (
            collaboratorItem.user.name.toLowerCase().includes(searchValue) ||
            collaboratorItem.user.email.toLowerCase().includes(searchValue)
          );
        });

        return (
          <Stack sx={{ gap: 1 }}>
            {filteredCollaborators.length > 0 ? (
              filteredCollaborators.map((collaboratorItem) => {
                const checked = value.includes(collaboratorItem.user.id);
                return (
                  <Box
                    key={collaboratorItem.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 0.5,
                    }}
                  >
                    <Checkbox
                      checked={checked}
                      onChange={() => {
                        if (checked) {
                          onChange(
                            value.filter(
                              (collaboratorId) => collaboratorId !== collaboratorItem.user.id,
                            ),
                          );
                        } else {
                          onChange([...value, collaboratorItem.user.id]);
                        }
                      }}
                    />
                    <Avatar
                      src={collaboratorItem.user.avatar}
                      alt={collaboratorItem.user.name}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                      {collaboratorItem.user.name}
                    </Typography>
                  </Box>
                );
              })
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {searchValue
                    ? 'No collaborators found matching your search'
                    : 'No collaborators available'}
                </Typography>
              </Box>
            )}
          </Stack>
        );
      }}
    />

    {errors.collaborators && (
      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
        {errors.collaborators.message}
      </Typography>
    )}
  </DialogContent>
);

const NoOpenPickerButton = () => null;

const DateField = ({ control, errors, name, label, open, onOpenChange }: DateFieldProps) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { value, onChange } }) => (
      <DatePicker
        label={label}
        format="MM/DD/YY"
        value={dayjs(value)}
        onChange={(newValue) => onChange(newValue ? newValue.toDate() : new Date())}
        open={open}
        onOpen={() => onOpenChange(true)}
        onClose={() => onOpenChange(false)}
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
            error: !!errors[name],
            helperText: errors[name]?.message,
            slotProps: {
              input: {
                startAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="start" onClick={() => onOpenChange(true)} sx={{ p: 0.5 }}>
                      <IconifyIcon
                        icon="material-symbols:calendar-today-outline-rounded"
                        sx={{ color: 'text.secondary', fontSize: 20 }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            },
          },
        }}
        slots={{
          openPickerButton: NoOpenPickerButton,
        }}
      />
    )}
  />
);

const DurationSection = ({
  control,
  errors,
  startDateOpen,
  endDateOpen,
  onStartDateOpenChange,
  onEndDateOpenChange,
}: DurationSectionProps) => (
  <DialogContent sx={{ p: { xs: 3 } }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
      Duration
    </Typography>
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        textAlign: 'left',
      }}
    >
      <DateField
        name="startDate"
        label="Start Date"
        control={control}
        errors={errors}
        open={startDateOpen}
        onOpenChange={onStartDateOpenChange}
      />
      <DateField
        name="endDate"
        label="End Date"
        control={control}
        errors={errors}
        open={endDateOpen}
        onOpenChange={onEndDateOpenChange}
      />
    </Box>
  </DialogContent>
);

export const TaskDialogFormSections = ({
  control,
  errors,
  collaboratorSearch,
  startDateOpen,
  endDateOpen,
  onCollaboratorSearchChange,
  onStartDateOpenChange,
  onEndDateOpenChange,
}: TaskDialogFormSectionsProps) => (
  <>
    <BasicDetailsSection control={control} errors={errors} />
    <Divider />
    <LabelsSection />
    <Divider />
    <PrioritySection control={control} />
    <Divider />
    <CollaboratorsSection
      control={control}
      errors={errors}
      collaboratorSearch={collaboratorSearch}
      onCollaboratorSearchChange={onCollaboratorSearchChange}
    />
    <Divider />
    <DurationSection
      control={control}
      errors={errors}
      startDateOpen={startDateOpen}
      endDateOpen={endDateOpen}
      onStartDateOpenChange={onStartDateOpenChange}
      onEndDateOpenChange={onEndDateOpenChange}
    />
  </>
);
