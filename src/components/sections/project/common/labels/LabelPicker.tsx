'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import type { LabelOption } from './labelConfig';

interface LabelPickerProps {
  availableLabels: LabelOption[];
  selectedLabels: string[];
  onToggleLabel: (label: string, checked: boolean) => void;
  onCreateLabelClick: () => void;
  showTitle?: boolean;
  visibleCount?: number;
}

const LabelPicker = ({
  availableLabels,
  selectedLabels,
  onToggleLabel,
  onCreateLabelClick,
  showTitle = false,
  visibleCount = 4,
}: LabelPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllLabels, setShowAllLabels] = useState(false);

  const filteredLabels = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    if (!normalizedQuery) return availableLabels;

    return availableLabels.filter((labelOption) =>
      labelOption.label.toLowerCase().includes(normalizedQuery),
    );
  }, [availableLabels, searchQuery]);

  const visibleLabels = showAllLabels ? filteredLabels : filteredLabels.slice(0, visibleCount);
  const hasHiddenLabels = filteredLabels.length > visibleCount && !showAllLabels;

  return (
    <Stack sx={{ gap: 2 }}>
      {showTitle && (
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Add label
        </Typography>
      )}

      <StyledTextField
        placeholder="Search label"
        fullWidth
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
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
      />

      <Stack sx={{ gap: 1 }}>
        {visibleLabels.length > 0 ? (
          visibleLabels.map((labelOption) => {
            const isChecked = selectedLabels.includes(labelOption.label);

            return (
              <Box key={labelOption.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  checked={isChecked}
                  onChange={(event) => onToggleLabel(labelOption.label, event.target.checked)}
                />
                <Box
                  onClick={() => onToggleLabel(labelOption.label, !isChecked)}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${labelOption.chColor}.200`,
                    color: `${labelOption.themeColor}.dark`,
                    fontWeight: 500,
                    fontSize: 14,
                    height: 36,
                    borderRadius: 2,
                    cursor: 'pointer',
                  }}
                >
                  {labelOption.label}
                </Box>
                <IconButton size="small" aria-label={`Edit ${labelOption.label}`}>
                  <IconifyIcon icon="material-symbols:edit-outline-rounded" />
                </IconButton>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
            No labels found
          </Typography>
        )}

        {hasHiddenLabels && (
          <Button variant="text" onClick={() => setShowAllLabels(true)}>
            Show more
          </Button>
        )}
      </Stack>

      <Button variant="soft" color="neutral" fullWidth onClick={onCreateLabelClick}>
        Create new label
      </Button>
    </Stack>
  );
};

export default LabelPicker;
