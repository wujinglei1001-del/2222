'use client';

import { Paper, Stack } from '@mui/material';
import PageHeader from 'components/sections/ecommerce/admin/common/PageHeader';
import TimeSheetsTableContainer from 'components/sections/time-tracker/time-sheets';
import TimesheetsHeaderActions from 'components/sections/time-tracker/time-sheets/HeaderActions';

const TimeSheets = () => {
  return (
    <Stack sx={{ height: 1 }}>
      <PageHeader
        title="Timesheets"
        breadcrumb={[
          { label: 'Home', url: '#!' },
          { label: 'Time tracker', url: '#!' },
          { label: 'Timesheets', active: true },
        ]}
        actionComponent={<TimesheetsHeaderActions />}
      />

      <Paper sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
        <TimeSheetsTableContainer />
      </Paper>
    </Stack>
  );
};

export default TimeSheets;
