import { Container, Paper, Stack } from '@mui/material';
import { activityGallery } from 'data/time-tracker/screenshots';
import ActivityGallery from './ActivityGallery';
import HoursSummary from './HoursSummary';

const TimeTrackerScreenshotsMain = () => {
  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <Container maxWidth="md" disableGutters>
        <Stack sx={{ gap: 5 }}>
          <HoursSummary />
          <ActivityGallery activityGallery={activityGallery} />
        </Stack>
      </Container>
    </Paper>
  );
};

export default TimeTrackerScreenshotsMain;
