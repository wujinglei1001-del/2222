'use client';

import { FormProvider } from 'react-hook-form';
import { Box, Button, Grid, Stack } from '@mui/material';
import { useNavContext } from 'layouts/main-layout/NavProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import AutomationReviewBar from 'components/sections/project/automation/AutomationReviewBar';
import ThenThisHappensForm from 'components/sections/project/automation/ThenThisHappensForm';
import WhenThisHappensForm from 'components/sections/project/automation/WhenThisHappensForm';
import useCreateAutomationForm, {
  AutomationFormValues,
} from 'components/sections/project/automation/useCreateAutomationForm';
import ProjectHeader from 'components/sections/project/common/ProjectHeader';

const CreateAutomation = () => {
  const { topbarHeight } = useNavContext();
  const { methods } = useCreateAutomationForm();

  const { handleSubmit } = methods;

  const onSubmit = (data: AutomationFormValues) => {
    console.log('Automation form data:', data);
  };

  const onInvalid = (errors: unknown) => {
    console.log('Automation form invalid:', errors);
  };

  const handleImport = () => {
    console.log('Import automation');
  };

  const handleExport = () => {
    console.log('Export automation');
  };

  const topRightActions = (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexShrink: 0 }}>
      <Button
        variant="soft"
        color="neutral"
        startIcon={
          <IconifyIcon icon="material-symbols:file-upload-outline-rounded" fontSize={20} />
        }
        onClick={handleImport}
      >
        Import
      </Button>
      <Button
        variant="soft"
        color="neutral"
        startIcon={
          <IconifyIcon icon="material-symbols:file-download-outline-rounded" fontSize={20} />
        }
        onClick={handleExport}
      >
        Export
      </Button>
    </Stack>
  );

  return (
    <FormProvider {...methods}>
      <Box>
        <ProjectHeader
          title="Create Automation"
          subtitle="Let's set automations to save you time and streamline your workflow!"
          showTaskDialog={false}
          topActions={topRightActions}
        />

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          sx={({ mixins }) => ({
            minHeight: mixins.contentHeight(topbarHeight),
            display: 'flex',
            flexDirection: 'column',
          })}
        >
          <Box sx={{ p: { xs: 3, md: 5 }, flex: 1, position: 'relative' }}>
            <Box
              sx={{
                display: { xs: 'none', md: 'block' },
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: '1px',
                bgcolor: 'dividerLight',
                transform: 'translateX(-0.5px)',
                pointerEvents: 'none',
              }}
            />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                <WhenThisHappensForm />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                <ThenThisHappensForm />
              </Grid>
            </Grid>
          </Box>

          <AutomationReviewBar />
        </Box>
      </Box>
    </FormProvider>
  );
};

export default CreateAutomation;
