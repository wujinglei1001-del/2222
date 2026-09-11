'use client';

import { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { taskDetailsData } from 'data/project/task-details';
import dayjs, { type Dayjs } from 'dayjs';

const DateSection = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(
    taskDetailsData.startDate ? dayjs(taskDetailsData.startDate) : null,
  );
  const [dueDate, setDueDate] = useState<Dayjs | null>(
    taskDetailsData.dueDate ? dayjs(taskDetailsData.dueDate) : null,
  );

  const datePickerSlotProps = {
    textField: {
      fullWidth: true,
    },
    inputAdornment: {
      position: 'start' as const,
    },
  };

  return (
    <Paper
      sx={{
        overflow: 'hidden',
        height: 1,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        gap: 2,
        p: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          Start date
        </Typography>
        <DatePicker
          format="DD/MM/YY"
          value={startDate}
          onChange={(selectedDateValue) => setStartDate(selectedDateValue)}
          slotProps={datePickerSlotProps}
        />
      </Box>
      <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          Due date
        </Typography>
        <DatePicker
          format="DD/MM/YY"
          value={dueDate}
          onChange={(selectedDateValue) => setDueDate(selectedDateValue)}
          slotProps={datePickerSlotProps}
        />
      </Box>
    </Paper>
  );
};

export default DateSection;
