'use client';

import { Stack } from '@mui/material';
import TimeTrackerHeader from 'components/sections/time-tracker/common/time-tracker-header';
import TimeTrackerReportMain from 'components/sections/time-tracker/report';

const Report = () => {
  return (
    <Stack sx={{ height: 1 }}>
      <TimeTrackerHeader
        title="Report"
        breadcrumb={[
          { label: 'Home', url: '#!' },
          { label: 'Time tracker', url: '#!' },
          { label: 'Report', active: true },
        ]}
        disableSearchbar
      />
      <TimeTrackerReportMain />
    </Stack>
  );
};

export default Report;
