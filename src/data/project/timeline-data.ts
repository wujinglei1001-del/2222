// timeline-data.ts
import { users } from 'data/users';
import dayjs from 'dayjs';

export interface TimelineTask {
  id: string;
  text: string;
  start_date: string;
  end_date: string;
  progress: number;
  parent?: string;
  type?: string;
  priority?: number;
  color?: string;
  open?: boolean;
  readonly?: boolean;
  group?: string;
  completed?: boolean;
  users?: string[];
}

export type FilterCollaborator = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  checked: boolean;
};

// Filter datasets (presentation only)
export const filterCollaborators: FilterCollaborator[] = [
  {
    id: users[0].id,
    name: users[0].name,
    email: users[0].email,
    avatar: users[0].avatar,
    checked: true,
  },
  {
    id: users[1].id,
    name: users[1].name,
    email: users[1].email,
    avatar: users[1].avatar,
    checked: true,
  },
  {
    id: users[2].id,
    name: users[2].name,
    email: users[2].email,
    avatar: users[2].avatar,
    checked: false,
  },
  {
    id: users[3].id,
    name: users[3].name,
    email: users[3].email,
    avatar: users[3].avatar,
    checked: false,
  },
  {
    id: users[4].id,
    name: users[4].name,
    email: users[4].email,
    avatar: users[4].avatar,
    checked: false,
  },
  {
    id: users[5].id,
    name: users[5].name,
    email: users[5].email,
    avatar: users[5].avatar,
    checked: false,
  },
];

export const filterStatuses = [
  { label: 'To do', color: 'neutral' as const },
  { label: 'Doing', color: 'primary' as const },
  { label: 'Done', color: 'success' as const },
];

export const filterPriorities = [
  { label: 'Normal', color: 'primary' as const },
  { label: 'High', color: 'warning' as const },
  { label: 'Urgent', color: 'error' as const },
];

export const roleOptions = [
  { value: 'Member', label: 'Member' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Editor', label: 'Editor' },
  { value: 'Viewer', label: 'Viewer' },
  { value: 'Guest', label: 'Guest' },
];

const fmt = (date: dayjs.Dayjs) => date.format('DD-MM-YYYY');

export const generateTimelineTasks = (): TimelineTask[] => {
  const today = dayjs();

  const startWindow = today.startOf('month');

  const ranges = {
    planning: {
      start: startWindow.add(3, 'day'),
      end: startWindow.add(30, 'day'),
    },
    development: {
      start: startWindow.add(3, 'day'),
      end: today.add(29, 'day'),
    },
    testing: {
      start: startWindow.add(3, 'day'),
      end: today.add(46, 'day'),
    },
  };

  return [
    // Planning
    {
      id: 'group-1',
      text: 'This Month',
      start_date: fmt(ranges.planning.start),
      end_date: fmt(ranges.planning.end),
      progress: 0.5,
      type: 'project',
      group: 'group-1',
      open: true,
    },
    {
      id: 'task-1-1',
      text: 'Requirements Analysis',
      start_date: fmt(ranges.planning.start.subtract(3, 'day')),
      end_date: fmt(ranges.planning.start.add(7, 'day')),
      progress: 0.8,
      parent: 'group-1',
      type: 'task',
      group: 'group-1',
      completed: true,
    },
    {
      id: 'task-1-2',
      text: 'Project Scope Definition',
      start_date: fmt(ranges.planning.start.add(8, 'day')),
      end_date: fmt(ranges.planning.start.add(15, 'day')),
      progress: 0.4,
      parent: 'group-1',
      type: 'task',
      group: 'group-1',
    },
    {
      id: 'task-1-3',
      text: 'Resource Planning',
      start_date: fmt(ranges.planning.start.add(16, 'day')),
      end_date: fmt(ranges.planning.end),
      progress: 0.2,
      parent: 'group-1',
      type: 'task',
      group: 'group-1',
    },

    // Development
    {
      id: 'group-2',
      text: 'Next Month',
      start_date: fmt(ranges.development.start),
      end_date: fmt(ranges.development.end),
      progress: 0.2,
      type: 'project',
      group: 'group-2',
      open: true,
    },
    {
      id: 'task-2-1',
      text: 'Frontend Development',
      start_date: fmt(ranges.development.start),
      end_date: fmt(ranges.development.start.add(10, 'day')),
      progress: 0.3,
      parent: 'group-2',
      type: 'task',
      group: 'group-2',
    },
    {
      id: 'task-2-2',
      text: 'Backend Development',
      start_date: fmt(ranges.development.start.add(5, 'day')),
      end_date: fmt(ranges.development.start.add(14, 'day')),
      progress: 0.1,
      parent: 'group-2',
      type: 'task',
      group: 'group-2',
    },
    {
      id: 'task-2-3',
      text: 'API Integration',
      start_date: fmt(ranges.development.start.add(15, 'day')),
      end_date: fmt(ranges.development.end),
      progress: 0.0,
      parent: 'group-2',
      type: 'task',
      group: 'group-2',
    },

    // Testing
    {
      id: 'group-3',
      text: 'Following Month',
      start_date: fmt(ranges.testing.start),
      end_date: fmt(ranges.testing.end),
      progress: 0.7,
      type: 'project',
      group: 'group-3',
      open: true,
    },
    {
      id: 'task-3-1',
      text: 'Unit Testing',
      start_date: fmt(ranges.testing.start),
      end_date: fmt(ranges.testing.start.add(12, 'day')),
      progress: 0.2,
      parent: 'group-3',
      type: 'task',
      group: 'group-3',
    },
    {
      id: 'task-3-2',
      text: 'Integration Testing',
      start_date: fmt(ranges.testing.start.add(3, 'day')),
      end_date: fmt(ranges.testing.start.add(9, 'day')),
      progress: 0.6,
      parent: 'group-3',
      type: 'task',
      group: 'group-3',
    },
    {
      id: 'task-3-3',
      text: 'Production Deployment',
      start_date: fmt(ranges.testing.start.add(14, 'day')),
      end_date: fmt(ranges.testing.start.add(20, 'day')),
      progress: 0.9,
      parent: 'group-3',
      type: 'task',
      group: 'group-3',
    },
    {
      id: 'task-3-4',
      text: 'Performance Testing',
      start_date: fmt(ranges.testing.start.add(1, 'day')),
      end_date: fmt(ranges.testing.start.add(8, 'day')),
      progress: 0.3,
      parent: 'group-3',
      type: 'task',
      group: 'group-3',
    },
    {
      id: 'task-3-5',
      text: 'User Acceptance Testing',
      start_date: fmt(ranges.testing.start.add(20, 'day')),
      end_date: fmt(ranges.testing.end),
      progress: 0.1,
      parent: 'group-3',
      type: 'task',
      group: 'group-3',
    },
  ];
};

export const timelineTasks = generateTimelineTasks();
