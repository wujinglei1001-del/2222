'use client';

import { useState } from 'react';
import { Dialog, DialogContent, IconButton, Stack, Typography, dialogClasses } from '@mui/material';
import type { LabelColor, TaskLabel } from 'types/task-details';
import IconifyIcon from 'components/base/IconifyIcon';
import CreateLabelDialog from './CreateLabelDialog';
import LabelPicker from './LabelPicker';
import { type LabelOption, optionToTaskLabel, taskLabelToOption } from './labelConfig';

interface AddLabelDialogProps {
  open: boolean;
  onClose: () => void;
  availableLabels: LabelOption[];
  selectedLabels: TaskLabel[];
  onAvailableLabelsChange: (labels: LabelOption[]) => void;
  onSelectedLabelsChange: (labels: TaskLabel[]) => void;
}

const AddLabelDialog = ({
  open,
  onClose,
  availableLabels,
  selectedLabels,
  onAvailableLabelsChange,
  onSelectedLabelsChange,
}: AddLabelDialogProps) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const selectedLabelNames = selectedLabels.map((taskLabel) => taskLabel.label);

  const handleToggleLabel = (label: string, checked: boolean) => {
    if (checked) {
      const labelOption = availableLabels.find((option) => option.label === label);
      if (!labelOption) return;
      onSelectedLabelsChange([...selectedLabels, optionToTaskLabel(labelOption)]);
      return;
    }

    onSelectedLabelsChange(selectedLabels.filter((taskLabel) => taskLabel.label !== label));
  };

  const handleCreateLabel = (label: string, color: LabelColor) => {
    const newOption = taskLabelToOption({ label, color });
    onAvailableLabelsChange([...availableLabels, newOption]);
    onSelectedLabelsChange([...selectedLabels, { label, color }]);
    setCreateDialogOpen(false);
  };

  const handleClose = () => {
    setCreateDialogOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        sx={{
          [`& .${dialogClasses.paper}`]: {
            borderRadius: 6,
            maxWidth: 375,
          },
        }}
      >
        <DialogContent sx={{ p: { xs: 3 } }}>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <IconButton onClick={handleClose} size="small" aria-label="Back">
              <IconifyIcon
                icon="material-symbols:arrow-back"
                sx={{ fontSize: 20, color: 'text.primary' }}
              />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Add label
            </Typography>
            <IconButton onClick={handleClose} size="small" aria-label="Close">
              <IconifyIcon
                icon="material-symbols:close"
                sx={{ fontSize: 20, color: 'text.primary' }}
              />
            </IconButton>
          </Stack>

          <LabelPicker
            availableLabels={availableLabels}
            selectedLabels={selectedLabelNames}
            onToggleLabel={handleToggleLabel}
            onCreateLabelClick={() => setCreateDialogOpen(true)}
          />
        </DialogContent>
      </Dialog>

      <CreateLabelDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreateLabel}
      />
    </>
  );
};

export default AddLabelDialog;
