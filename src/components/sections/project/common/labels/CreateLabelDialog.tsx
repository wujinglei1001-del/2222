'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  dialogClasses,
} from '@mui/material';
import type { LabelColor } from 'types/task-details';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import type { ChColorKey } from './labelConfig';

const CH_VARIANTS = [100, 200, 500] as const;

const LABEL_COLOR_GROUPS: { chKey: ChColorKey; themeColor: LabelColor }[] = [
  { chKey: 'chBlue', themeColor: 'primary' },
  { chKey: 'chPurple', themeColor: 'info' },
  { chKey: 'chGreen', themeColor: 'success' },
  { chKey: 'chOrange', themeColor: 'warning' },
  { chKey: 'chRed', themeColor: 'error' },
];

const LABEL_COLOR_PALETTE = LABEL_COLOR_GROUPS.flatMap(({ chKey, themeColor }) =>
  CH_VARIANTS.map((variant) => ({ chKey, variant, themeColor })),
);

interface CreateLabelDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (label: string, color: LabelColor) => void;
}

const CreateLabelDialog = ({ open, onClose, onCreate }: CreateLabelDialogProps) => {
  const [labelTitle, setLabelTitle] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const handleCreate = () => {
    const trimmed = labelTitle.trim();
    if (!trimmed) return;
    const entry = LABEL_COLOR_PALETTE[selectedColorIndex];
    onCreate(trimmed, entry.themeColor);
    setLabelTitle('');
    setSelectedColorIndex(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          <IconButton onClick={onClose} size="small" aria-label="Back">
            <IconifyIcon
              icon="material-symbols:arrow-back"
              sx={{ fontSize: 20, color: 'text.primary' }}
            />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Create new label
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="Close">
            <IconifyIcon
              icon="material-symbols:close"
              sx={{ fontSize: 20, color: 'text.primary' }}
            />
          </IconButton>
        </Stack>

        <div>
          <StyledTextField
            fullWidth
            placeholder="Label title"
            value={labelTitle}
            onChange={(event) => setLabelTitle(event.target.value)}
            variant="filled"
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 1.25,
              mb: 4,
            }}
          >
            {LABEL_COLOR_PALETTE.map(({ chKey, variant }, index) => (
              <Box
                key={`${chKey}-${variant}`}
                onClick={() => setSelectedColorIndex(index)}
                sx={(theme) => ({
                  height: 36,
                  borderRadius: 1,
                  bgcolor: theme.vars.palette[chKey]?.[variant],
                  border: 2,
                  borderColor: selectedColorIndex === index ? 'primary.main' : 'transparent',
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.9 },
                })}
              />
            ))}
          </Box>

          <Button
            fullWidth
            variant="soft"
            color="neutral"
            onClick={handleCreate}
            disabled={!labelTitle.trim()}
          >
            Create label
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLabelDialog;
