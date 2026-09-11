import type { AutomationCondition } from 'types/automations';

export type ConditionFieldVariant =
  | 'status_from_to'
  | 'priority_from_to'
  | 'date_before_after'
  | 'assignee'
  | 'label'
  | 'conditional_filter'
  | 'none';

export const CONDITION_FIELD_VARIANT: Record<AutomationCondition['type'], ConditionFieldVariant> = {
  task_or_subtask_created: 'none',
  status_changes: 'status_from_to',
  existing_task_or_subtask_added_here: 'none',
  existing_task_or_subtask_moved_here: 'none',
  comment_is_added: 'none',
  all_checklists_resolved: 'none',
  all_immediate_subtasks_resolved: 'none',
  due_date_arrives: 'none',
  due_date_changes: 'none',
  start_date_arrives: 'none',
  start_date_changes: 'none',
  date_is_before_or_after: 'date_before_after',
  assignee_added: 'assignee',
  assignee_removed: 'none',
  priority_changes: 'priority_from_to',
  task_management_status_changes: 'status_from_to',
  label_added: 'label',
  label_removed: 'none',
  task_or_subtask_linked: 'none',
  status_is: 'conditional_filter',
  priority_is: 'conditional_filter',
  assignee_is: 'conditional_filter',
  label_is: 'conditional_filter',
  start_date_is: 'conditional_filter',
  due_date_is: 'conditional_filter',
  start_date_before_after: 'date_before_after',
  due_date_before_after: 'date_before_after',
};

export const getConditionFieldVariant = (type: AutomationCondition['type']) =>
  CONDITION_FIELD_VARIANT[type];
