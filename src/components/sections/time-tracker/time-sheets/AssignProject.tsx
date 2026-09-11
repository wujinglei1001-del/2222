import { Fragment, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import * as yup from 'yup';
import IconifyIcon from 'components/base/IconifyIcon';

export interface AssignProjectFormValues {
  project: string;
  task: string;
  client: string;
  billable: boolean;
}

export const assignProjectSchema = yup.object({
  project: yup.string().required('This field is required'),
  task: yup.string().required('This field is required'),
  client: yup.string().required('This field is required'),
  billable: yup.boolean().required('This field is required'),
});

const AssignProject = () => {
  const { only } = useBreakpoints();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignProjectFormValues>({
    resolver: yupResolver(assignProjectSchema),
    defaultValues: {
      billable: false,
    },
  });

  const onlyXs = only('xs');

  const snackbar = useSnackbar();
  const [open, setOpen] = useState(false);

  const [handleOpen, handleClose] = [() => setOpen(true), () => setOpen(false)];

  const onSubmit: SubmitHandler<AssignProjectFormValues> = (data) => {
    console.log({ data });
    snackbar.enqueueSnackbar('Project assigned successfully!', { variant: 'success' });
    handleClose();
  };

  return (
    <Fragment>
      <Button
        variant="contained"
        startIcon={<IconifyIcon icon="material-symbols:add-2-rounded" sx={{ fontSize: 20 }} />}
        onClick={handleOpen}
        sx={{ flexGrow: 1, flexShrink: 0, maxWidth: 150 }}
      >
        Assign Project
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: handleSubmit(onSubmit),
            sx: {
              borderRadius: 6,
              maxWidth: 460,
              width: 1,
            },
          },
        }}
      >
        <DialogTitle
          component="h6"
          sx={{
            pt: 3,
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box component="span">Assign a Project</Box>
          <Button shape="circle" color="neutral" onClick={handleClose}>
            <IconifyIcon
              icon="material-symbols:close"
              sx={{ fontSize: 20, color: 'neutral.dark' }}
            />
          </Button>
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <DialogContentText variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Please select a project from the list to attach your timesheet. This will help us track
            your hours accurately.
          </DialogContentText>

          <Grid container spacing={2}>
            <Grid container size={12} spacing={1}>
              <Grid size={12}>
                <Controller
                  control={control}
                  name="project"
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      select
                      label="Project"
                      defaultValue=""
                      error={!!errors.project}
                      helperText={errors.project?.message}
                      {...field}
                    >
                      <MenuItem value="" disabled>
                        Project
                      </MenuItem>
                      <MenuItem value="website-Redesign">Website Redesign</MenuItem>
                      <MenuItem value="mobile-app-development">Mobile App Development</MenuItem>
                      <MenuItem value="content-Marketing">Content Marketing</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  control={control}
                  name="task"
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      select
                      label="Task"
                      defaultValue=""
                      error={!!errors.task}
                      helperText={errors.task?.message}
                      {...field}
                    >
                      <MenuItem value="" disabled>
                        Task
                      </MenuItem>
                      <MenuItem value="create-wireframes">Create wireframes</MenuItem>
                      <MenuItem value="plan-Q2-blog-topics">Plan Q2 blog topics</MenuItem>
                      <MenuItem value="set-up-automation-workflows">
                        Set up automation workflows
                      </MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
            <Grid container size={12} spacing={2} sx={{ alignItems: 'center' }}>
              <Grid size={8}>
                <Controller
                  control={control}
                  name="client"
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      select
                      label="Client"
                      defaultValue=""
                      error={!!errors.client}
                      helperText={errors.client?.message}
                      {...field}
                    >
                      <MenuItem value="" disabled>
                        Client
                      </MenuItem>
                      <MenuItem value="acme-corp">Acme Corp</MenuItem>
                      <MenuItem value="zen-mobile">ZenMobile</MenuItem>
                      <MenuItem value="nexatech">NexaTech</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={4}>
                <Controller
                  control={control}
                  name="billable"
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox checked={field.value} {...field} />}
                      label="Billable"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button color="neutral" size={onlyXs ? 'medium' : 'large'} onClick={handleClose}>
            Discard
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size={onlyXs ? 'medium' : 'large'}
          >
            Add To TimeSheet
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default AssignProject;
