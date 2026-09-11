import type { AutomationAction, AutomationCondition } from 'types/automations';
import { ACTION_FIELD_VARIANT, type ActionFieldVariant } from './actionRegistry';
import { getConditionFieldVariant } from './conditionRegistry';
import type { ConditionFilterType } from './constants';

export const buildConditionForFilterType = (
  prev: AutomationCondition | undefined,
  newType: ConditionFilterType,
): AutomationCondition => {
  switch (newType) {
    case 'status_is':
      return {
        type: newType,
        field: 'status',
        operator: 'is_any_of',
        value: typeof prev?.value === 'string' && prev.value ? prev.value : 'Done',
      };
    case 'priority_is':
      return {
        type: newType,
        field: 'priority',
        operator: 'equals',
        value: typeof prev?.value === 'string' && prev.value ? prev.value : 'Low',
      };
    case 'assignee_is':
      return {
        type: newType,
        field: 'assignee',
        operator: 'is_any_of',
        value: Array.isArray(prev?.value) ? prev.value : [],
      };
    case 'label_is':
      return {
        type: newType,
        field: 'label',
        operator: 'equals',
        value: Array.isArray(prev?.value) ? prev.value : [],
      };
    case 'start_date_is':
      return {
        type: newType,
        field: 'start_date',
        operator: 'equals',
        value: '',
        targetDate: prev?.targetDate ?? '',
      };
    case 'due_date_is':
      return {
        type: newType,
        field: 'due_date',
        operator: 'equals',
        value: '',
        targetDate: prev?.targetDate ?? '',
      };
  }
};

export const buildConditionForType = (
  prev: AutomationCondition | undefined,
  newType: AutomationCondition['type'],
): AutomationCondition => {
  const variant = getConditionFieldVariant(newType);

  switch (variant) {
    case 'status_from_to':
      return {
        type: newType,
        field: 'status',
        operator: 'changes_from_to',
        value: '',
        fromValue: prev?.fromValue ?? 'To do',
        toValue: prev?.toValue ?? 'Done',
      };
    case 'priority_from_to':
      return {
        type: newType,
        field: 'priority',
        operator: 'changes_from_to',
        value: '',
        fromValue: prev?.fromValue ?? 'Low',
        toValue: prev?.toValue ?? 'High',
      };
    case 'date_before_after':
      return {
        type: newType,
        field: newType === 'date_is_before_or_after' ? 'start_date' : (prev?.field ?? 'start_date'),
        operator: 'equals',
        value: '',
        dateOffset: prev?.dateOffset ?? '10',
        dateOffsetUnit: prev?.dateOffsetUnit ?? 'days',
        dateRelation: prev?.dateRelation ?? 'before',
        targetDate: prev?.targetDate ?? '',
      };
    case 'assignee':
      return {
        type: newType,
        field: 'assignee',
        operator: 'is_any_of',
        value: Array.isArray(prev?.value) ? prev.value : [],
      };
    case 'label':
      return {
        type: newType,
        field: 'label',
        operator: 'is_any_of',
        value: Array.isArray(prev?.value) ? prev.value : [],
      };
    default:
      return {
        type: newType,
        field: prev?.field ?? 'task',
        operator: prev?.operator ?? 'is_set',
        value: prev?.value ?? '',
      };
  }
};

const PARAM_BUILDERS: Record<
  ActionFieldVariant,
  (prev?: AutomationAction['params']) => AutomationAction['params']
> = {
  group: (prev) => ({ targetGroup: prev?.targetGroup ?? '' }),
  project: (prev) => ({ targetProject: prev?.targetProject ?? '' }),
  date: (prev) => ({
    dateMode: prev?.dateMode ?? 'weeks',
    dateOffset: prev?.dateOffset ?? '1',
    customDate: prev?.customDate ?? '',
  }),
  priority: (prev) => ({
    fromPriority: prev?.fromPriority ?? 'Low',
    newPriority: prev?.newPriority ?? 'High',
  }),
  status: (prev) => ({ status: prev?.status ?? '' }),
  assignees: (prev) => ({
    removeAssignees: prev?.removeAssignees ?? [],
    addAssignees: prev?.addAssignees ?? [],
  }),
  label: (prev) => ({
    addLabels: prev?.addLabels ?? [],
    removeLabels: prev?.removeLabels ?? [],
  }),
  create_task: (prev) => ({
    taskName: prev?.taskName ?? '',
    project: prev?.project ?? '',
    status: prev?.status ?? '',
    description: prev?.description ?? '',
    startDate: prev?.startDate ?? '',
    endDate: prev?.endDate ?? '',
    label: prev?.label ?? '',
  }),
  none: () => ({}),
};

export const buildActionForType = (
  prev: AutomationAction | undefined,
  newType: AutomationAction['type'],
): AutomationAction => ({
  type: newType,
  params: PARAM_BUILDERS[ACTION_FIELD_VARIANT[newType]](prev?.params),
});
