'use client';

import { useState } from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { type PriorityValue, priorityOptions, taskDetailsData } from 'data/project/task-details';

const Priority = () => {
  const [selected, setSelected] = useState<PriorityValue>(taskDetailsData.priority);

  return (
    <Paper sx={{ height: 1, p: { xs: 2, md: 3 } }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          mb: 1.5,
        }}
      >
        Priority
      </Typography>
      <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
        {priorityOptions.map(({ value, label, dotColor }) => (
          <Chip
            key={value}
            size="large"
            variant="soft"
            label={
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    bgcolor: dotColor,
                    flexShrink: 0,
                  }}
                />
                {label}
              </Box>
            }
            onClick={() => setSelected(value)}
            sx={{
              ...(selected === value
                ? { bgcolor: 'action.selected' }
                : { bgcolor: 'background.elevation1' }),
              flex: 1,
              cursor: 'pointer',
              border: 'none',
              borderRadius: 2,
            }}
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default Priority;
