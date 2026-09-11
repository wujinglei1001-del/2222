'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Box, Button, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import type { CreateProjectFormValues } from 'components/sections/project/create-project/useCreateProjectStepper';

const viewOptions = [
  {
    id: 'calendar',
    label: 'Calendar View',
    icon: 'material-symbols-light:calendar-month-outline-rounded',
  },
  {
    id: 'table',
    label: 'Table view',
    icon: 'material-symbols-light:table-rows-outline',
  },
  {
    id: 'kanban',
    label: 'Kanban view',
    icon: 'material-symbols-light:view-kanban-outline-rounded',
  },
  {
    id: 'timeline',
    label: 'Timeline View',
    icon: 'material-symbols-light:view-timeline-outline-rounded',
  },
];

const DefaultView = () => {
  const { control } = useFormContext<CreateProjectFormValues>();

  return (
    <Stack sx={{ gap: 3 }}>
      <Controller
        name="defaultView"
        control={control}
        render={({ field }) => (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 0.5,
            }}
          >
            {viewOptions.map((view) => {
              const isSelected = field.value === view.id;

              return (
                <Button
                  key={view.id}
                  onClick={() => field.onChange(view.id)}
                  variant="soft"
                  color="neutral"
                  sx={{
                    p: { xs: 1.5, xl: 3 },
                    borderRadius: 4,
                    bgcolor: isSelected ? 'primary.lighter' : 'background.elevation1',
                    '&:hover': {
                      bgcolor: 'primary.lighter',
                    },
                  }}
                >
                  <Stack sx={{ gap: 1.5, alignItems: 'center' }}>
                    <IconifyIcon icon={view.icon} fontSize={32} sx={{ color: 'text.secondary' }} />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        textAlign: 'center',
                        fontWeight: 400,
                        fontSize: { xs: 12, xl: 14 },
                        whiteSpace: 'nowrap',
                        lineHeight: 1.2,
                      }}
                    >
                      {view.label}
                    </Typography>
                  </Stack>
                </Button>
              );
            })}
          </Box>
        )}
      />
    </Stack>
  );
};

export default DefaultView;
