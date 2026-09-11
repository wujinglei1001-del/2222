import { Container, Divider, Paper, Stack } from '@mui/material';
import { currentDayReport, totalAmountDetails } from 'data/time-tracker/report';
import CurrentDayReport from './CurrentDayReport';
import TotalAmountDetails from './TotalAmountDetails';

const TimeTrackerReportMain = () => {
  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <Container maxWidth="md" disableGutters>
        <Stack divider={<Divider flexItem />} sx={{ gap: 5 }}>
          <CurrentDayReport data={currentDayReport} />
          <TotalAmountDetails data={totalAmountDetails} />
        </Stack>
      </Container>
    </Paper>
  );
};

export default TimeTrackerReportMain;
