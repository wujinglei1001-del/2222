import { users } from 'data/users';
import { User } from 'types/users';

export type TaskStatus = 'Running' | 'Completed' | 'Pending' | 'Delayed';
export type TaskLabel = 'Issue' | 'Feature' | 'Update' | 'Bug';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type Task = {
  id: string;
  name: string;
  collaborator: User[];
  status: TaskStatus;
  label: TaskLabel;
  priority: TaskPriority;
  dependingOn: string;
  startDate: string;
  dueDate: string;
  subTasks?: Task[];
};

export type TableMeta = {
  editingRowId: string | null;
  editingDraft: Partial<Task>;
  patchEditingDraft: (patch: Partial<Task>) => void;
  startEdit: (rowId: string) => void;
  saveEdit: (rowId: string) => void;
  cancelEdit: () => void;
  deleteRow: (rowId: string) => void;
  addNewSubtask: (parentId: string) => void;
};

export const thisMonthTasks: Task[] = [
  {
    id: '0',
    name: 'Plan and organize the design review meeting.',
    collaborator: [users[15], users[5], users[13]],
    status: 'Running',
    label: 'Feature',
    priority: 'Medium',
    dependingOn: 'Prepare all design drafts before final submission.',
    startDate: '2025-03-03',
    dueDate: '2025-03-15',
  },
  {
    id: '1',
    name: 'Finalize sprint backlog for the current iteration.',
    collaborator: [users[2], users[1], users[3], users[12], users[14]],
    status: 'Pending',
    label: 'Update',
    priority: 'High',
    dependingOn: 'Wait for feedback from QA before final merge.',
    startDate: '2025-03-05',
    dueDate: '2025-03-22',
    subTasks: [
      {
        id: '1.0',
        name: 'Fix critical UI bugs from latest release.',
        collaborator: [users[4], users[8], users[7]],
        status: 'Running',
        label: 'Bug',
        priority: 'Critical',
        dependingOn: 'Dependent on API bug fix.',
        startDate: '2025-03-06',
        dueDate: '2025-03-12',
      },
      {
        id: '1.1',
        name: 'Integrate user analytics module.',
        collaborator: [users[9], users[0]],
        status: 'Running',
        label: 'Feature',
        priority: 'Medium',
        dependingOn: 'Requires backend endpoints from analytics team.',
        startDate: '2025-03-08',
        dueDate: '2025-03-20',
      },
      {
        id: '1.2',
        name: 'Optimize image loading performance.',
        collaborator: [users[9], users[0]],
        status: 'Pending',
        label: 'Update',
        priority: 'Low',
        dependingOn: 'Wait for updated CDN configuration.',
        startDate: '2025-03-09',
        dueDate: '2025-03-19',
      },
    ],
  },
  {
    id: '2',
    name: 'Prepare documentation for client handoff.',
    collaborator: [users[9], users[0]],
    status: 'Completed',
    label: 'Issue',
    priority: 'Medium',
    dependingOn: 'Review internal QA report before delivery.',
    startDate: '2025-03-10',
    dueDate: '2025-03-18',
  },
  {
    id: '3',
    name: 'Conduct team retrospective meeting.',
    collaborator: [users[4], users[8], users[7]],
    status: 'Running',
    label: 'Update',
    priority: 'Low',
    dependingOn: 'All sprint tasks should be completed first.',
    startDate: '2025-03-11',
    dueDate: '2025-03-13',
  },
];

export const nextMonthTasks: Task[] = [
  {
    id: '0',
    name: 'Launch the beta version of the new dashboard.',
    collaborator: [users[2], users[3], users[14]],
    status: 'Running',
    label: 'Feature',
    priority: 'High',
    dependingOn: 'Finalize frontend QA checklist before release.',
    startDate: '2025-04-02',
    dueDate: '2025-04-18',
    subTasks: [
      {
        id: '0.0',
        name: 'Refine authentication flow and token refresh.',
        collaborator: [users[9], users[0]],
        status: 'Running',
        label: 'Bug',
        priority: 'High',
        dependingOn: 'Needs backend JWT patch first.',
        startDate: '2025-04-03',
        dueDate: '2025-04-10',
      },
      {
        id: '0.1',
        name: 'Implement responsive design for tablet view.',
        collaborator: [users[5], users[7]],
        status: 'Running',
        label: 'Update',
        priority: 'Medium',
        dependingOn: 'Wait for design team’s final layout specs.',
        startDate: '2025-04-04',
        dueDate: '2025-04-15',
      },
    ],
  },
  {
    id: '1',
    name: 'Prepare financial report for Q2 planning.',
    collaborator: [users[11], users[6]],
    status: 'Pending',
    label: 'Issue',
    priority: 'High',
    dependingOn: 'Collect data from all regional managers.',
    startDate: '2025-04-10',
    dueDate: '2025-04-25',
  },
  {
    id: '2',
    name: 'Set up monitoring and alerting pipeline.',
    collaborator: [users[4], users[8]],
    status: 'Running',
    label: 'Feature',
    priority: 'Critical',
    dependingOn: 'Dependent on infra team’s environment setup.',
    startDate: '2025-04-08',
    dueDate: '2025-04-21',
  },
];

export const followingMonthTasks: Task[] = [
  {
    id: '0',
    name: 'Run usability testing for onboarding flow.',
    collaborator: [users[12], users[5], users[6]],
    status: 'Running',
    label: 'Feature',
    priority: 'Medium',
    dependingOn: 'Collect feedback before final UI pass.',
    startDate: '2025-05-05',
    dueDate: '2025-05-20',
    subTasks: [
      {
        id: '0.0',
        name: 'Prepare test scripts for usability interviews.',
        collaborator: [users[4], users[8]],
        status: 'Completed',
        label: 'Update',
        priority: 'Low',
        dependingOn: 'Confirm testing schedule with users.',
        startDate: '2025-05-06',
        dueDate: '2025-05-10',
      },
      {
        id: '0.1',
        name: 'Summarize results and create presentation slides.',
        collaborator: [users[9], users[0]],
        status: 'Pending',
        label: 'Issue',
        priority: 'Medium',
        dependingOn: 'Dependent on final interview recordings.',
        startDate: '2025-05-11',
        dueDate: '2025-05-17',
      },
    ],
  },
  {
    id: '1',
    name: 'Upgrade all dependencies to the latest versions.',
    collaborator: [users[3], users[11]],
    status: 'Running',
    label: 'Update',
    priority: 'Medium',
    dependingOn: 'Check for breaking changes in MUI v7.',
    startDate: '2025-05-08',
    dueDate: '2025-05-14',
  },
  {
    id: '2',
    name: 'Deploy production release for v3.0.',
    collaborator: [users[7], users[12], users[5]],
    status: 'Pending',
    label: 'Feature',
    priority: 'High',
    dependingOn: 'Wait for final QA approval.',
    startDate: '2025-05-15',
    dueDate: '2025-05-25',
  },
  {
    id: '3',
    name: 'Conduct customer feedback analysis.',
    collaborator: [users[0], users[9], users[3]],
    status: 'Running',
    label: 'Issue',
    priority: 'Low',
    dependingOn: 'Collect survey results before meeting.',
    startDate: '2025-05-12',
    dueDate: '2025-05-18',
  },
];
