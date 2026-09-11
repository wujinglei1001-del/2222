'use client';

import { useState } from 'react';
import { Box, Grid, Stack, Tab, Tabs } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import TaskActivity from 'components/sections/project/task-details/TaskActivity';
import TaskBanner from 'components/sections/project/task-details/TaskBanner';
import TaskComments from 'components/sections/project/task-details/TaskComments';
import TaskDetailsSection from 'components/sections/project/task-details/TaskDetailsSection/index';
import TaskHeader from 'components/sections/project/task-details/TaskHeader';

type TaskDetailsProps = {
  onClose?: () => void;
};

const TaskDetails = ({ onClose }: TaskDetailsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const { up: upBreakpoint } = useBreakpoints();
  const upLg = upBreakpoint('lg');

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <Box sx={{ flexShrink: 0, bgcolor: 'background.paper', zIndex: 1 }}>
        <TaskHeader onClose={onClose} />
        {!upLg && (
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider' }}
          >
            <Tab label="Details" />
            <Tab label="Comments" />
            <Tab label="Activity Log" />
          </Tabs>
        )}
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <TaskBanner />

        {upLg ? (
          <Grid container sx={{ display: 'flex', minHeight: '100%' }}>
            <Grid size={8} sx={{ display: 'flex', flexDirection: 'column' }}>
              <TaskDetailsSection />
            </Grid>
            <Grid size={4} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <Stack
                sx={{
                  flex: 1,
                  minHeight: 0,
                }}
              >
                <TaskActivity />
                <TaskComments />
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Box>
            {activeTab === 0 && <TaskDetailsSection />}
            {activeTab === 1 && <TaskComments />}
            {activeTab === 2 && <TaskActivity />}
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default TaskDetails;
