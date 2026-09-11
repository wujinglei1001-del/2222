import { SyntheticEvent, useState } from 'react';
import {
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  tabClasses,
  tabsClasses,
} from '@mui/material';
import { appsSitesHours } from 'data/time-tracker/apps-sites';
import { cssVarRgba } from 'lib/utils';
import ProjectHoursSection from './ProjectHoursSection';

const TimeTrackerAppsSitesMain = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => setValue(newValue);

  const renderTop = () => (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
        gap: 1,
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
      }}
    >
      <Typography variant="h5">Usage Overview</Typography>

      <Tabs
        value={value}
        onChange={handleChange}
        sx={(theme) => ({
          width: 'fit-content',
          p: 0.5,
          borderRadius: 1.5,
          flexShrink: 0,
          bgcolor: 'background.elevation1',
          [`& .${tabsClasses.list}`]: { gap: 0 },
          [`& .${tabsClasses.indicator}`]: {
            height: 1,
            bgcolor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.15),
            borderRadius: 1,
          },
          [`& .${tabClasses.root}`]: {
            color: 'text.primary',
            fontWeight: 600,
            textTransform: 'none',
            px: 2,
            [`&.${tabClasses.selected}`]: { color: 'primary.dark' },
          },
        })}
      >
        <Tab label="App" value={0} disableRipple />
        <Tab label="URL" value={1} disableRipple />
        <Tab label="All" value={2} disableRipple />
      </Tabs>
    </Stack>
  );

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <Container maxWidth="md" disableGutters>
        {renderTop()}

        <Stack sx={{ gap: 3 }}>
          {appsSitesHours.map((item) => (
            <ProjectHoursSection key={item.id} project={item} />
          ))}
        </Stack>
      </Container>
    </Paper>
  );
};

export default TimeTrackerAppsSitesMain;
