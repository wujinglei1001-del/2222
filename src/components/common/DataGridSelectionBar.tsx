'use client';

import { type ReactNode } from 'react';
import { Box, Grow, Paper, Stack, Typography } from '@mui/material';

interface DataGridSelectionBarProps {
  selectedCount: number;
  customLabel?: ReactNode;
  children?: ReactNode;
}

const DataGridSelectionBar = ({
  selectedCount,
  customLabel,
  children,
}: DataGridSelectionBarProps) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <Grow in timeout={220}>
      <Box
        sx={{
          position: 'sticky',
          bottom: { xs: 16, sm: 20 },
          zIndex: 10,
          mt: 2,
          mb: 2,
          display: 'flex',
          width: 1,
          maxWidth: 620,
          mx: 'auto',
          px: { xs: 3, md: 0 },
        }}
      >
        <Paper
          variant="elevation"
          sx={{
            width: 1,
            px: 2,
            py: 1.5,
            borderRadius: 4,
            bgcolor: 'background.menu',
            boxShadow: (theme) => theme.vars.shadows[6],
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          {customLabel ?? (
            <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
              <strong>{selectedCount}</strong> selected
            </Typography>
          )}

          {children && (
            <Stack
              direction="row"
              sx={{
                gap: 1,
                alignItems: 'center',
              }}
            >
              {children}
            </Stack>
          )}
        </Paper>
      </Box>
    </Grow>
  );
};

export default DataGridSelectionBar;
