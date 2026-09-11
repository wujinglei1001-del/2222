export interface AutomationCondition {
  type:
    | 'status_changes'
    | 'status_is'
    | 'priority_is'
    | 'assignee_is'
    | 'label_is'
    | 'start_date_is'
    | 'due_date_is'
    | 'task_or_subtask_created'
    | 'existing_task_or_subtask_added_here'
    | 'existing_task_or_subtask_moved_here'
    | 'comment_is_added'
    | 'all_checklists_resolved'
    | 'all_immediate_subtasks_resolved'
    | 'due_date_arrives'
    | 'due_date_changes'
    | 'start_date_arrives'
    | 'start_date_changes'
    | 'date_is_before_or_after'
    | 'start_date_before_after'
    | 'due_date_before_after'
    | 'assignee_added'
    | 'assignee_removed'
    | 'priority_changes'
    | 'task_management_status_changes'
    | 'label_added'
    | 'label_removed'
    | 'task_or_subtask_linked';
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'is_any_of'
    | 'is_all_of'
    | 'is_not_any_of'
    | 'is_not_all_of'
    | 'is_set'
    | 'is_not_set'
    | 'changes_from_to';
  value: string | string[];
  fromValue?: string;
  toValue?: string;
  dateOffset?: string;
  dateOffsetUnit?: 'days' | 'weeks';
  dateRelation?: 'before' | 'after';
  targetDate?: string;
}

export interface AutomationAction {
  type:
    | 'move_to_group'
    | 'add_to_group'
    | 'move_to_project'
    | 'change_assignees'
    | 'change_status'
    | 'add_comment'
    | 'notify_someone'
    | 'archive_task_subtask'
    | 'create_subtask'
    | 'create_task'
    | 'delete_task_subtask'
    | 'duplicate'
    | 'change_due_date'
    | 'change_start_date'
    | 'change_date'
    | 'change_priority'
    | 'change_label';
  params: {
    targetGroup?: string;
    dateOffset?: string;
    dateMode?: 'days' | 'weeks' | 'custom';
    customDate?: string;
    fromPriority?: string;
    newPriority?: string;
    targetProject?: string;
    addAssignees?: string[];
    removeAssignees?: string[];
    addLabels?: string[];
    removeLabels?: string[];
    taskName?: string;
    project?: string;
    status?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    label?: string;
  };
}

export interface Automation {
  id: number;
  name: string;
  isActive: boolean;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  createdAt: string;
  createdBy: string;
  description: string;
}
