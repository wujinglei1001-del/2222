'use client';

import { Stack } from '@mui/material';
import TimeTrackerAppsSitesMain from 'components/sections/time-tracker/apps-sites';
import TimeTrackerHeader from 'components/sections/time-tracker/common/time-tracker-header';

const AppsSites = () => {
  return (
    <Stack sx={{ height: 1 }}>
      <TimeTrackerHeader
        title="Apps & Sites"
        breadcrumb={[
          { label: 'Home', url: '#!' },
          { label: 'Time tracker', url: '#!' },
          { label: 'Apps & Sites', active: true },
        ]}
      />
      <TimeTrackerAppsSitesMain />
    </Stack>
  );
};

export default AppsSites;
