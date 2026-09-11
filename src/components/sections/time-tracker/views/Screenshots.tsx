'use client';

import { Stack } from '@mui/material';
import TimeTrackerHeader from 'components/sections/time-tracker/common/time-tracker-header';
import TimeTrackerScreenshotsMain from 'components/sections/time-tracker/screenshots';

const Screenshots = () => {
  return (
    <Stack sx={{ height: 1 }}>
      <TimeTrackerHeader
        title="Screenshots"
        breadcrumb={[
          { label: 'Home', url: '#!' },
          { label: 'Time tracker', url: '#!' },
          { label: 'Screenshots', active: true },
        ]}
      />
      <TimeTrackerScreenshotsMain />
    </Stack>
  );
};

export default Screenshots;
