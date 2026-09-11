import type { Theme } from '@mui/material/styles';
import { recentProjects, sharedProjects, userProjects } from 'data/kanban/boards';
import type { AutomationAction, AutomationCondition } from 'types/automations';

export type ConditionTypeOption = {
  value: AutomationCondition['type'];
  label: string;
};

export type ActionTypeOption = {
  value: AutomationAction['type'];
  label: string;
};

export type ActionGroup = {
  group: string;
  options: ActionTypeOption[];
};

export const ACTION_GROUPS: ActionGroup[] = [
  {
    group: 'MOST USED',
    options: [
      { value: 'change_assignees', label: 'Change assignees' },
      { value: 'change_status', label: 'Change status' },
    ],
  },
  {
    group: 'ADD OR MOVE',
    options: [
      { value: 'add_to_group', label: 'Add to group' },
      { value: 'move_to_group', label: 'Move to group' },
      { value: 'move_to_project', label: 'Move to project' },
    ],
  },
  {
    group: 'COMMUNICATION',
    options: [
      { value: 'add_comment', label: 'Add a comment' },
      { value: 'notify_someone', label: 'Notify someone' },
    ],
  },
  {
    group: 'CREATE AND COMPLETE',
    options: [
      { value: 'archive_task_subtask', label: 'Archive task or subtask' },
      { value: 'create_subtask', label: 'Create a subtask' },
      { value: 'create_task', label: 'Create a task' },
      { value: 'delete_task_subtask', label: 'Delete task or subtask' },
      { value: 'duplicate', label: 'Duplicate' },
    ],
  },
  {
    group: 'DATES AND TIMES',
    options: [
      { value: 'change_date', label: 'Change start/end date' },
      { value: 'change_due_date', label: 'Change due date' },
      { value: 'change_start_date', label: 'Change start date' },
    ],
  },
  {
    group: 'TASK MANAGEMENT',
    options: [
      { value: 'change_priority', label: 'Change priority' },
      { value: 'change_label', label: 'Change label' },
    ],
  },
];

export const ACTION_TYPE_OPTIONS: ActionTypeOption[] = ACTION_GROUPS.flatMap(
  (actionGroup) => actionGroup.options,
);

export const getActionTypeLabel = (value: AutomationAction['type']) =>
  ACTION_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value;

export type ConditionTriggerGroup = {
  group: string;
  options: Array<{ value: AutomationCondition['type']; label: string }>;
};

export const CONDITION_TRIGGER_GROUPS: ConditionTriggerGroup[] = [
  {
    group: 'MOST USED',
    options: [
      { value: 'task_or_subtask_created', label: 'Task or subtask created' },
      { value: 'status_changes', label: 'Status Changes' },
    ],
  },
  {
    group: 'ADD OR MOVE',
    options: [
      {
        value: 'existing_task_or_subtask_added_here',
        label: 'Existing task or subtask added here',
      },
      {
        value: 'existing_task_or_subtask_moved_here',
        label: 'Existing task or subtask moved here',
      },
    ],
  },
  {
    group: 'COMMUNICATION',
    options: [{ value: 'comment_is_added', label: 'Comment is added' }],
  },
  {
    group: 'CREATE AND COMPLETE',
    options: [
      { value: 'all_checklists_resolved', label: 'All checklists resolved' },
      {
        value: 'all_immediate_subtasks_resolved',
        label: 'All immediate subtasks resolved',
      },
    ],
  },
  {
    group: 'DATES AND TIMES',
    options: [
      { value: 'due_date_arrives', label: 'Due date arrives' },
      { value: 'due_date_changes', label: 'Due date changes' },
      { value: 'start_date_arrives', label: 'Start date arrives' },
      { value: 'start_date_changes', label: 'Start date changes' },
      { value: 'date_is_before_or_after', label: 'Date is before/after' },
    ],
  },
  {
    group: 'TASK MANAGEMENT',
    options: [
      { value: 'assignee_added', label: 'Assignee added/Assignee removed' },
      { value: 'priority_changes', label: 'Priority changes' },
      { value: 'task_management_status_changes', label: 'Status Changes' },
      { value: 'label_added', label: 'Label added/Label removed' },
      { value: 'task_or_subtask_linked', label: 'Task or subtask linked' },
    ],
  },
];

const CONDITION_TRIGGER_LABELS = Object.fromEntries(
  CONDITION_TRIGGER_GROUPS.flatMap((group) =>
    group.options.map((option) => [option.value, option.label]),
  ),
) as Partial<Record<AutomationCondition['type'], string>>;

export const getConditionTriggerLabel = (value: AutomationCondition['type']) =>
  CONDITION_TRIGGER_LABELS[value] ?? value.replace(/_/g, ' ');

export const CONDITION_TYPE_OPTIONS: ConditionTypeOption[] = CONDITION_TRIGGER_GROUPS.flatMap(
  (group) => group.options,
);

export type ConditionFilterType =
  | 'assignee_is'
  | 'start_date_is'
  | 'due_date_is'
  | 'status_is'
  | 'priority_is'
  | 'label_is';

export const CONDITION_FILTER_TYPES: ConditionFilterType[] = [
  'assignee_is',
  'start_date_is',
  'due_date_is',
  'status_is',
  'priority_is',
  'label_is',
];

export type ConditionFilterOption = {
  value: ConditionFilterType;
  label: string;
};

export const CONDITION_FILTER_OPTIONS: ConditionFilterOption[] = [
  { value: 'assignee_is', label: 'Assignee' },
  { value: 'start_date_is', label: 'Start date' },
  { value: 'due_date_is', label: 'Due date' },
  { value: 'status_is', label: 'Status' },
  { value: 'priority_is', label: 'Priority' },
  { value: 'label_is', label: 'Label' },
];

const CONDITION_FILTER_LABELS = Object.fromEntries(
  CONDITION_FILTER_OPTIONS.map((option) => [option.value, option.label]),
) as Record<ConditionFilterType, string>;

export const getConditionFilterLabel = (value: ConditionFilterType) =>
  CONDITION_FILTER_LABELS[value] ?? value.replace(/_/g, ' ');

export const isConditionFilterType = (
  type: AutomationCondition['type'],
): type is ConditionFilterType => CONDITION_FILTER_TYPES.includes(type as ConditionFilterType);

export const REFERENCE_DATE_OPTIONS = [
  { value: 'start_date', label: 'The start date' },
  { value: 'due_date', label: 'The due date' },
] as const;

export const DATE_OFFSET_UNITS = ['days', 'weeks'] as const;
export const DATE_RELATIONS = ['before', 'after'] as const;
export const DATE_MODES = ['days', 'weeks', 'custom'] as const;

export const DATE_OFFSET_UNIT_OPTIONS: Array<{
  value: NonNullable<AutomationCondition['dateOffsetUnit']>;
  label: string;
}> = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
];

export const DATE_RELATION_OPTIONS: Array<{
  value: NonNullable<AutomationCondition['dateRelation']>;
  label: string;
}> = [
  { value: 'before', label: 'Before' },
  { value: 'after', label: 'After' },
];

export const STATUS_OPTIONS = ['To do', 'In Progress', 'Done'] as const;
export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Urgent'] as const;
export const LABEL_OPTIONS = ['Admin', 'Modification', 'Bug'] as const;
export const GROUP_OPTIONS = ['This week', 'Next week', 'Following week', 'In two weeks'] as const;

export const PROJECT_OPTIONS = Array.from(
  new Set([
    ...recentProjects.boards.map((board) => board.name),
    ...userProjects.boards.map((board) => board.name),
    ...sharedProjects.boards.map((board) => board.name),
  ]),
);

export const getPriorityDotColor = (priority: string) => (theme: Theme) => {
  switch (priority) {
    case 'Low':
      return theme.vars?.palette?.chBlue?.[500] ?? theme.palette.info.main;
    case 'Medium':
      return theme.vars?.palette?.chOrange?.[500] ?? theme.palette.warning.main;
    case 'High':
      return theme.vars?.palette?.chGreen?.[500] ?? theme.palette.success.main;
    case 'Urgent':
      return theme.vars?.palette?.chRed?.[500] ?? theme.palette.error.main;
    default:
      return theme.palette.text.disabled;
  }
};

export const OPERATOR_OPTIONS = [
  { value: 'equals', label: 'Is equal to' },
  { value: 'not_equals', label: 'Is not equal to' },
  { value: 'is_any_of', label: 'Is any of' },
  { value: 'is_all_of', label: 'Is all of' },
  { value: 'is_not_any_of', label: 'Is not any of' },
  { value: 'is_not_all_of', label: 'Is not all of' },
  { value: 'is_set', label: 'Is set' },
  { value: 'is_not_set', label: 'Is not set' },
] as const;

export const ASSIGNEE_OPERATOR_OPTIONS = OPERATOR_OPTIONS.filter(
  (option) => option.value !== 'equals' && option.value !== 'not_equals',
);

export const getOperatorOptionsForFilterType = (type: ConditionFilterType) => {
  if (type === 'assignee_is') {
    return ASSIGNEE_OPERATOR_OPTIONS;
  }

  return OPERATOR_OPTIONS;
};

export const DEFAULT_CONDITIONS: AutomationCondition[] = [
  {
    type: 'task_or_subtask_created',
    field: 'task',
    operator: 'is_set',
    value: '',
  },
  {
    type: 'status_is',
    field: 'status',
    operator: 'is_any_of',
    value: 'Done',
  },
  {
    type: 'priority_is',
    field: 'priority',
    operator: 'equals',
    value: 'High',
  },
];

export const DEFAULT_ACTIONS: AutomationAction[] = [
  { type: 'move_to_group', params: { targetGroup: '' } },
  { type: 'change_date', params: { dateMode: 'weeks', dateOffset: '1', customDate: '' } },
  { type: 'change_priority', params: { fromPriority: 'Low', newPriority: 'High' } },
  { type: 'duplicate', params: { targetProject: '' } },
];
