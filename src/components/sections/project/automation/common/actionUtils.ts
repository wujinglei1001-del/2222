import dayjs from 'dayjs';
import type { AutomationAction } from 'types/automations';
import type { ValidationError } from 'yup';
import { getActionFieldVariant } from './actionRegistry';
import { getActionTypeLabel } from './constants';

const formatShortDate = (isoDate: string) => dayjs(isoDate).format('D MMM');

type ValidateContext = {
  createError: (error: { path: string; message: string }) => ValidationError;
  basePath: string;
};

export const validateActionParams = (
  action: AutomationAction,
  params: AutomationAction['params'],
  context: ValidateContext,
): boolean | ValidationError => {
  const variant = getActionFieldVariant(action.type);
  const { createError, basePath } = context;

  switch (variant) {
    case 'group':
      if (!params.targetGroup?.trim()) {
        return createError({ path: `${basePath}.targetGroup`, message: 'Group is required' });
      }
      return true;
    case 'project':
      if (!params.targetProject?.trim()) {
        return createError({
          path: `${basePath}.targetProject`,
          message: 'Target project is required',
        });
      }
      return true;
    case 'date': {
      const mode = params.dateMode ?? 'weeks';
      if (mode === 'custom') {
        if (!params.customDate?.trim()) {
          return createError({
            path: `${basePath}.customDate`,
            message: 'Custom date is required',
          });
        }
        return true;
      }
      if (!params.dateOffset?.trim()) {
        return createError({ path: `${basePath}.dateOffset`, message: 'Offset is required' });
      }
      return true;
    }
    case 'priority':
      if (!params.fromPriority?.trim()) {
        return createError({
          path: `${basePath}.fromPriority`,
          message: 'From priority is required',
        });
      }
      if (!params.newPriority?.trim()) {
        return createError({ path: `${basePath}.newPriority`, message: 'To priority is required' });
      }
      return true;
    case 'status':
      if (!params.status?.trim()) {
        return createError({ path: `${basePath}.status`, message: 'Status is required' });
      }
      return true;
    case 'create_task':
      if (!params.taskName?.trim()) {
        return createError({ path: `${basePath}.taskName`, message: 'Task name is required' });
      }
      return true;
    default:
      return true;
  }
};

export const formatActionChipByType = (action: AutomationAction): string => {
  const label = getActionTypeLabel(action.type);
  const { params } = action;
  const variant = getActionFieldVariant(action.type);

  switch (variant) {
    case 'group':
      return `${label}: ${params.targetGroup || 'Select a group'},`;
    case 'project':
      return action.type === 'duplicate'
        ? `Duplicate to: ${params.targetProject || 'Select a group'}`
        : `${label}: ${params.targetProject || 'Select a project'},`;
    case 'date': {
      const mode = params.dateMode ?? 'weeks';
      if (mode === 'custom') {
        const dateText = params.customDate ? formatShortDate(params.customDate) : 'Select date';
        return `${label}: ${dateText},`;
      }
      const offset = params.dateOffset || '1';
      const unit = mode === 'days' ? 'day' : 'week';
      const plural = offset === '1' ? unit : `${unit}s`;
      return `${label}: ${offset} ${plural} after trigger,`;
    }
    case 'priority':
      return params.newPriority ? `${label}: ${params.newPriority},` : `${label},`;
    case 'status':
      return params.status ? `${label}: ${params.status},` : `${label},`;
    case 'assignees': {
      const add = params.addAssignees?.length ?? 0;
      const remove = params.removeAssignees?.length ?? 0;
      return add || remove ? `${label}: +${add}/-${remove},` : `${label},`;
    }
    case 'label': {
      const add = params.addLabels?.length ?? 0;
      const remove = params.removeLabels?.length ?? 0;
      return add || remove ? `${label}: +${add}/-${remove},` : `${label},`;
    }
    case 'create_task':
      return params.taskName ? `${label}: ${params.taskName},` : `${label},`;
    default:
      return `${label},`;
  }
};
