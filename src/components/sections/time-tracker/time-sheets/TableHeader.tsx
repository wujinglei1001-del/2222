import type { SyntheticEvent } from 'react';
import {
  Button,
  Grid,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  inputBaseClasses,
  tabClasses,
  tabsClasses,
} from '@mui/material';
import { cssVarRgba } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import DateRangePicker from 'components/base/DateRangePicker';
import IconifyIcon from 'components/base/IconifyIcon';
import SearchTextField from 'components/common/SearchTextField';
import StyledTextField from 'components/styled/StyledTextField';
import type { TabType } from '.';
import TableFilter from './TableFilter';

interface TimeSheetsTableHeaderProps {
  tab: TabType;
  handleChange: (event: SyntheticEvent, newValue: TabType) => void;
}

const TimeSheetsTableHeader = ({ tab, handleChange }: TimeSheetsTableHeaderProps) => {
  const { only } = useBreakpoints();

  const isXs = only('xs');

  return (
    <div>
      <Tabs
        value={tab}
        onChange={handleChange}
        sx={(theme) => ({
          width: 'fit-content',
          p: 0.5,
          borderRadius: 1.5,
          flexShrink: 0,
          bgcolor: 'background.elevation1',
          mb: 2,
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
            [`&.${tabClasses.selected}`]: { color: 'primary.dark' },
          },
        })}
      >
        <Tab label="Daily" value="daily" disableRipple />
        <Tab label="Weekly" value="weekly" disableRipple />
        <Tab label="Monthly" value="monthly" disableRipple />
      </Tabs>

      <Grid container spacing={1}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
              <Button variant="soft" size="small" color="neutral" shape="circle">
                <IconifyIcon
                  flipOnRTL
                  icon="material-symbols:arrow-back-rounded"
                  sx={{ fontSize: 20, color: 'neutral.dark' }}
                />
              </Button>

              <Button variant="soft" size="small" color="neutral" shape="circle">
                <IconifyIcon
                  flipOnRTL
                  icon="material-symbols:arrow-forward-rounded"
                  sx={{ fontSize: 20, color: 'neutral.dark' }}
                />
              </Button>
            </Stack>

            <DateRangePicker
              dateFormat={tab === 'monthly' ? 'MMM, yyyy' : 'd MMM, yyyy'}
              isClearable
              placeholderText="Select Date Range"
              withPortal={isXs}
              customInput={
                <StyledTextField
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon
                            icon="material-symbols:calendar-month-outline-rounded"
                            sx={{ color: 'text.secondary' }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              }
              sx={{
                width: 1,
                maxWidth: { sm: 275 },
                [`& .react-datepicker-wrapper.clearable`]: {
                  [`& .${inputBaseClasses.root}`]: { paddingLeft: 2 },
                },
              }}
            />
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" sx={{ gap: 1, justifyContent: { sm: 'flex-end' } }}>
            <SearchTextField
              id="settings-search-box"
              placeholder="Search member"
              fullWidth
              sx={{ maxWidth: { sm: 230 } }}
            />

            <TableFilter />
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};

export default TimeSheetsTableHeader;
