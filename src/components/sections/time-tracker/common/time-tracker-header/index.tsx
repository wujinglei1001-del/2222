import { Activity } from 'react';
import type { PaperProps } from '@mui/material';
import { Grid, InputAdornment, Paper, Stack, Typography } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import PageBreadcrumb from 'components/sections/common/PageBreadcrumb';
import StyledTextField from 'components/styled/StyledTextField';
import FilterDrawer from '../FilterDrawer';
import DateNavigator from './DateNavigator';
import TimezoneSelect from './TimezoneSelect';

interface TimeTrackerHeaderProps extends PaperProps {
  title: string;
  breadcrumb: { label: string; url?: string; active?: boolean }[];
  disableSearchbar?: boolean;
}

export default function TimeTrackerHeader({
  title,
  breadcrumb,
  sx,
  disableSearchbar = false,
  ...rest
}: TimeTrackerHeaderProps) {
  const { down, only } = useBreakpoints();
  const [downLg, onlyXs] = [down('lg'), only('xs')];
  return (
    <Paper {...rest} sx={{ px: { xs: 3, md: 5 }, py: 3, ...sx }}>
      <Stack sx={{ gap: 2 }}>
        <div>
          <PageBreadcrumb items={breadcrumb} sx={{ mb: 1 }} />
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h4" sx={[downLg && { fontSize: 'h5.fontSize' }]}>
              {title}
            </Typography>
            {onlyXs && <TimezoneSelect variant="button" />}
          </Stack>
        </div>
        <Grid container rowSpacing={{ xs: 1 }} columnSpacing={{ xs: 2, sm: 1 }}>
          <Grid size={{ xs: 'grow', sm: 'auto' }}>
            <DateNavigator />
          </Grid>
          <Grid size={{ xs: 12, sm: 'grow' }} sx={{ order: { xs: 1, sm: 0 } }}>
            <Stack
              direction="row"
              sx={{
                gap: 1,
                flexGrow: 1,
                order: { xs: 1, sm: 0 },
                justifyContent: { sm: 'space-between' },
              }}
            >
              {!onlyXs && <TimezoneSelect />}

              <Activity mode={disableSearchbar ? 'hidden' : 'visible'}>
                <StyledTextField
                  id="settings-search-box"
                  type="search"
                  placeholder="Search"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:search-rounded" />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ maxWidth: { sm: 140, md: 180, lg: 200, xl: 230 } }}
                />
              </Activity>
            </Stack>
          </Grid>
          <Grid>
            <FilterDrawer />
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
}
