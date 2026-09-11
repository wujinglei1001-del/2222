import { users } from 'data/users';
import * as yup from 'yup';
import type { TaskFormData } from '../TaskDialog';

export const validationSchema = yup.object({
  task: yup.string().required('Task is required').min(3, 'Task must be at least 3 characters'),
  group: yup.string().required('Group is required'),
  status: yup.string().required('Status is required'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().required('End date is required'),
  priority: yup.string().required('Priority is required'),
  collaborators: yup
    .array()
    .of(yup.number().required())
    .min(1, 'Select at least one collaborator')
    .required(),
});

export const collaboratorData = [
  { id: 1, user: users[0], checked: true },
  { id: 2, user: users[1], checked: true },
  { id: 3, user: users[2], checked: false },
  { id: 4, user: users[3], checked: false },
  { id: 5, user: users[4], checked: false },
  { id: 6, user: users[5], checked: false },
  { id: 7, user: users[6], checked: false },
];

export const defaultFormValues: TaskFormData = {
  task: '',
  group: 'group-1',
  status: 'This week',
  startDate: new Date(),
  endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  priority: 'Normal',
  collaborators: collaboratorData
    .filter((collaboratorItem) => collaboratorItem.checked)
    .map((collaboratorItem) => collaboratorItem.user.id),
};

export const taskGroupOptions = [
  { value: 'group-1', label: 'Planning Phase' },
  { value: 'group-2', label: 'Developement phase' },
  { value: 'group-3', label: 'Testing & Deployment' },
];

export const taskStatusOptions = [
  { value: 'This week', label: 'This week' },
  { value: 'Completed', label: 'Completed' },
];

export { defaultLabelOptions as taskLabelOptions } from '../labels/labelConfig';

export const taskPriorityOptions = [
  { label: 'Normal', color: 'primary' },
  { label: 'High', color: 'warning' },
  { label: 'Urgent', color: 'error' },
];
