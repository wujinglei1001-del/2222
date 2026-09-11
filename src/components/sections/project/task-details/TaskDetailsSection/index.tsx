'use client';

import { Grid } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import Collaborators from './Collaborators';
import DateSection from './DateSection';
import Description from './Description';
import FilesSection from './FilesSection';
import LabelSection from './LabelSection';
import Priority from './Priority';
import Subtasks from './Subtasks';

const TaskDetailsSection = () => {
  const { down: downBreakpoint, only: onlyBreakpoint } = useBreakpoints();
  const isXs = downBreakpoint('sm');
  const isSm = onlyBreakpoint('sm');
  const isMd = onlyBreakpoint('md');

  return (
    <Grid
      container
      sx={{
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      {!isMd && !isXs && (
        <Grid size={12}>
          <Description />
        </Grid>
      )}

      {!isXs && (
        <Grid container size={12}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Priority />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <DateSection />
          </Grid>
        </Grid>
      )}

      <Grid container size={12}>
        {isXs ? (
          <>
            <Grid size={12}>
              <LabelSection />
            </Grid>
            <Grid size={12}>
              <Description />
            </Grid>
            <Grid size={12}>
              <Collaborators />
            </Grid>
          </>
        ) : (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <LabelSection />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Collaborators />
            </Grid>
          </>
        )}
      </Grid>

      {isMd && (
        <Grid size={12}>
          <Description />
        </Grid>
      )}

      {!isXs && !isSm && (
        <Grid size={12}>
          <Subtasks />
        </Grid>
      )}

      <Grid size={12} sx={{ flex: 1, minHeight: 0 }}>
        <FilesSection />
      </Grid>

      {!isXs && isSm && (
        <Grid size={12}>
          <Subtasks />
        </Grid>
      )}

      {isXs && (
        <>
          <Grid container size={12}>
            <Grid size={12}>
              <Priority />
            </Grid>
            <Grid size={12}>
              <DateSection />
            </Grid>
          </Grid>
          <Grid size={12}>
            <Subtasks />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default TaskDetailsSection;
