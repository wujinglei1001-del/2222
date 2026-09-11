import { Automation } from 'types/automations';

export type { Automation, AutomationAction, AutomationCondition } from 'types/automations';

export const automationsData: Automation[] = [
  {
    id: 1,
    name: 'Automation #1: Status update',
    isActive: true,
    conditions: [
      {
        type: 'status_changes',
        field: 'status',
        operator: 'changes_from_to',
        value: '',
        fromValue: 'To do',
        toValue: 'Done',
      },
      { type: 'status_is', field: 'status', operator: 'equals', value: 'Done' },
      { type: 'priority_is', field: 'priority', operator: 'equals', value: 'High' },
    ],
    actions: [
      { type: 'move_to_group', params: { targetGroup: 'Next week' } },
      { type: 'change_date', params: { dateOffset: '1 week after trigger' } },
      { type: 'change_priority', params: { newPriority: 'High' } },
      { type: 'duplicate', params: { targetProject: 'Another project' } },
    ],
    createdAt: '2024-01-15T10:30:00',
    createdBy: 'John Doe',
    description:
      'When Status changes, and Status: Done, and Priority: High, then Move to group: Next week, and Change date: 1 week after trigger, and Change priority: High, and Duplicate to: Another project',
  },
  {
    id: 2,
    name: 'Automation #1: Status update',
    isActive: false,
    conditions: [
      {
        type: 'status_changes',
        field: 'status',
        operator: 'changes_from_to',
        value: '',
        fromValue: 'To do',
        toValue: 'Done',
      },
      { type: 'status_is', field: 'status', operator: 'equals', value: 'Done' },
      { type: 'priority_is', field: 'priority', operator: 'equals', value: 'High' },
    ],
    actions: [
      { type: 'move_to_group', params: { targetGroup: 'Next week' } },
      { type: 'change_date', params: { dateOffset: '1 week after trigger' } },
      { type: 'change_priority', params: { newPriority: 'High' } },
      { type: 'duplicate', params: { targetProject: 'Another project' } },
    ],
    createdAt: '2024-01-14T09:20:00',
    createdBy: 'Jane Smith',
    description:
      'When Status changes, and Status: Done, and Priority: High, then Move to group: Next week, and Change date: 1 week after trigger, and Change priority: High, and Duplicate to: Another project',
  },
  {
    id: 3,
    name: 'Automation #1: Status update',
    isActive: false,
    conditions: [
      {
        type: 'status_changes',
        field: 'status',
        operator: 'changes_from_to',
        value: '',
        fromValue: 'To do',
        toValue: 'Done',
      },
      { type: 'status_is', field: 'status', operator: 'equals', value: 'Done' },
      { type: 'priority_is', field: 'priority', operator: 'equals', value: 'High' },
    ],
    actions: [
      { type: 'move_to_group', params: { targetGroup: 'Next week' } },
      { type: 'change_date', params: { dateOffset: '1 week after trigger' } },
      { type: 'change_priority', params: { newPriority: 'High' } },
      { type: 'duplicate', params: { targetProject: 'Another project' } },
    ],
    createdAt: '2024-01-13T14:15:00',
    createdBy: 'Bob Johnson',
    description:
      'When Status changes, and Status: Done, and Priority: High, then Move to group: Next week, and Change date: 1 week after trigger, and Change priority: High, and Duplicate to: Another project',
  },
  {
    id: 4,
    name: 'Automation #1: Status update',
    isActive: false,
    conditions: [
      {
        type: 'status_changes',
        field: 'status',
        operator: 'changes_from_to',
        value: '',
        fromValue: 'To do',
        toValue: 'Done',
      },
      { type: 'status_is', field: 'status', operator: 'equals', value: 'Done' },
      { type: 'priority_is', field: 'priority', operator: 'equals', value: 'High' },
    ],
    actions: [
      { type: 'move_to_group', params: { targetGroup: 'Next week' } },
      { type: 'change_date', params: { dateOffset: '1 week after trigger' } },
      { type: 'change_priority', params: { newPriority: 'High' } },
      { type: 'duplicate', params: { targetProject: 'Another project' } },
    ],
    createdAt: '2024-01-12T11:45:00',
    createdBy: 'Alice Williams',
    description:
      'When Status changes, and Status: Done, and Priority: High, then Move to group: Next week, and Change date: 1 week after trigger, and Change priority: High, and Duplicate to: Another project',
  },
  {
    id: 5,
    name: 'Automation #1: Status update',
    isActive: false,
    conditions: [
      {
        type: 'status_changes',
        field: 'status',
        operator: 'changes_from_to',
        value: '',
        fromValue: 'To do',
        toValue: 'Done',
      },
      { type: 'status_is', field: 'status', operator: 'equals', value: 'Done' },
      { type: 'priority_is', field: 'priority', operator: 'equals', value: 'High' },
    ],
    actions: [
      { type: 'move_to_group', params: { targetGroup: 'Next week' } },
      { type: 'change_date', params: { dateOffset: '1 week after trigger' } },
      { type: 'change_priority', params: { newPriority: 'High' } },
      { type: 'duplicate', params: { targetProject: 'Another project' } },
    ],
    createdAt: '2024-01-11T16:30:00',
    createdBy: 'Charlie Brown',
    description:
      'When Status changes, and Status: Done, and Priority: High, then Move to group: Next week, and Change date: 1 week after trigger, and Change priority: High, and Duplicate to: Another project',
  },
  {
    id: 6,
    name: 'Automation #1: Status update',
    isActive: false,
    conditions: [
      {
        type: 'status_changes',
        field: 'status',
        operator: 'changes_from_to',
        value: '',
        fromValue: 'To do',
        toValue: 'Done',
      },
      { type: 'status_is', field: 'status', operator: 'equals', value: 'Done' },
      { type: 'priority_is', field: 'priority', operator: 'equals', value: 'High' },
    ],
    actions: [
      { type: 'move_to_group', params: { targetGroup: 'Next week' } },
      { type: 'change_date', params: { dateOffset: '1 week after trigger' } },
      { type: 'change_priority', params: { newPriority: 'High' } },
      { type: 'duplicate', params: { targetProject: 'Another project' } },
    ],
    createdAt: '2024-01-10T08:20:00',
    createdBy: 'Diana Prince',
    description:
      'When Status changes, and Status: Done, and Priority: High, then Move to group: Next week, and Change date: 1 week after trigger, and Change priority: High, and Duplicate to: Another project',
  },
];
