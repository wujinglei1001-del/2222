import { Divider, Stack } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import TimezoneSelect from '../common/time-tracker-header/TimezoneSelect';
import AssignProject from './AssignProject';

const TimesheetsHeaderActions = () => {
  const { down } = useBreakpoints();

  const downMd = down('md');

  return (
    <Stack
      direction={{ xs: 'row-reverse', sm: 'row' }}
      divider={!downMd && <Divider orientation="vertical" flexItem />}
      sx={{
        gap: { xs: 1.5, md: 1 },
        alignItems: 'center',
        justifyContent: { xs: 'space-between', sm: 'flex-end' },
        flex: '1 1',
      }}
    >
      <TimezoneSelect variant={downMd ? 'button' : 'textfield'} />

      <AssignProject />
    </Stack>
  );
};

export default TimesheetsHeaderActions;
