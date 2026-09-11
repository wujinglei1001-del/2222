'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import * as yup from 'yup';
import { labelOptions } from './common/helpers';
import { validationSchemas } from './validationSchemas';

export interface CreateProjectTaskValue {
  value: string;
  id?: string;
  label?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateProjectStatusItemValue {
  label: string;
  color: string;
}

export interface CreateProjectStatusesValue {
  incomplete: CreateProjectStatusItemValue[];
  active: CreateProjectStatusItemValue[];
  completed: CreateProjectStatusItemValue[];
}

export interface CreateProjectGroupItemValue {
  label: string;
  color: string;
}

export interface CreateProjectCollaboratorValue {
  email: string;
  userId?: number;
  name?: string;
  avatar?: string;
}

export interface CreateProjectFormValues {
  projectTitle: string;
  tasks: CreateProjectTaskValue[];
  groups: CreateProjectGroupItemValue[];
  statuses: CreateProjectStatusesValue;
  teamId: string;
  collaborators: CreateProjectCollaboratorValue[];
  defaultView?: string;
}

const useCreateProjectStepper = (activeStep: number) => {
  const theme = useTheme();
  const methods = useForm<CreateProjectFormValues>({
    resolver: yupResolver(validationSchemas[activeStep] as yup.AnyObjectSchema),
    defaultValues: {
      projectTitle: '',
      tasks: [
        {
          value: '',
          id: 'task-initial',
          label: labelOptions[0],
          startDate: dayjs().toISOString(),
          endDate: dayjs().add(1, 'day').toISOString(),
        },
      ],
      groups: [{ label: '', color: theme.palette.primary.main }],
      statuses: {
        incomplete: [{ label: 'Pending', color: theme.palette.grey[200] }],
        active: [{ label: 'Doing', color: theme.palette.primary.main }],
        completed: [{ label: 'Done', color: theme.palette.success.main }],
      },
      teamId: '',
      collaborators: [{ email: '', userId: undefined, name: '', avatar: '' }],
      defaultView: undefined,
    },
    mode: 'onSubmit',
  });

  return methods;
};

export default useCreateProjectStepper;
