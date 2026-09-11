'use client';

import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
  dialogClasses,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { TaskDialogFormSections } from './task-dialog/TaskDialogFormSections';
import { defaultFormValues, validationSchema } from './task-dialog/taskDialogConfig';

export interface TaskFormData {
  task: string;
  group: string;
  status: string;
  startDate: Date;
  endDate: Date;
  priority: string;
  collaborators: number[];
}

type TaskDialogMode = 'create' | 'edit';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (taskData: TaskFormData) => void;
  initialValues?: TaskFormData;
  mode?: TaskDialogMode;
}

const TaskDialog = ({
  open,
  onClose,
  onSubmit: onTaskSubmit,
  initialValues,
  mode = 'create',
}: TaskDialogProps) => {
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [collaboratorSearch, setCollaboratorSearch] = useState('');

  const methods = useForm<TaskFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultFormValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (!open) return;
    reset(mode === 'edit' && initialValues ? initialValues : defaultFormValues);
  }, [open, mode, initialValues, reset]);

  const onSubmit = (data: TaskFormData) => {
    if (onTaskSubmit) {
      onTaskSubmit(data);
    }

    onClose();
  };

  return (
    <FormProvider {...methods}>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        sx={{
          [`& .${dialogClasses.paper}`]: {
            borderRadius: 6,
            m: 0,
            p: 0,
            maxWidth: { sm: '375px !important' },
            maxHeight: 'calc(100vh - 160px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            outline: 'none',
            '&:focus-visible': {
              outline: 'none',
            },
          },
          [`& .${dialogClasses.container}`]: {
            py: 5,
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.5,
            flexShrink: 0,
          }}
        >
          <Typography variant="subtitle1" component="span" sx={{ fontWeight: 700 }}>
            {mode === 'edit' ? 'Edit Task' : 'Create Task'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <IconifyIcon
              icon="material-symbols:close"
              sx={{ fontSize: 20, color: 'neutral.dark' }}
            />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ flexShrink: 0 }} />

        <Box sx={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
          <TaskDialogFormSections
            control={control}
            errors={errors}
            collaboratorSearch={collaboratorSearch}
            startDateOpen={startDateOpen}
            endDateOpen={endDateOpen}
            onCollaboratorSearchChange={setCollaboratorSearch}
            onStartDateOpenChange={setStartDateOpen}
            onEndDateOpenChange={setEndDateOpen}
          />
        </Box>

        <Divider sx={{ flexShrink: 0 }} />

        <DialogActions sx={{ py: 1.5, px: { xs: 3 }, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} color="neutral">
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} color="primary" variant="text">
              {mode === 'edit' ? 'Save Changes' : 'Create Task'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default TaskDialog;
