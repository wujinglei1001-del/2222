import dayjs from 'dayjs';

export interface GanttTask {
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
  duration?: number;
  assignee?: string;
  department?: string;
  milestone?: boolean;
}

export interface GanttResource {
  id: string;
  text: string;
  type?: string;
  parent?: string;
  color?: string;
  capacity?: number;
  department?: string;
}

export interface GanttLink {
  id: string;
  source: string;
  target: string;
  type: string;
  lag?: number;
}

const fmt = (date: dayjs.Dayjs) => date.format('DD-MM-YYYY');

export const generateGanttTasks = (): GanttTask[] => {
  const today = dayjs();
  const startWindow = today.startOf('month');

  const planningStart = startWindow.add(21, 'day');
  const planningEnd = planningStart.add(21, 'day');

  const developmentStart = planningEnd;
  const developmentEnd = developmentStart.add(27, 'day');

  const testingStart = developmentEnd.subtract(6, 'day');
  const testingEnd = testingStart.add(13, 'day');

  return [
    {
      id: 'group-1',
      text: 'Planning Phase',
      start_date: fmt(planningStart),
      end_date: fmt(planningEnd),
      progress: 0.4,
      type: 'project',
      priority: 1,
      group: 'group-1',
      open: true,
    },
    {
      id: 'task-1-1',
      text: 'Requirements Analysis',
      start_date: fmt(planningStart),
      end_date: fmt(planningStart.add(13, 'day')),
      progress: 0.8,
      parent: 'group-1',
      type: 'task',
      priority: 1,
      group: 'group-1',
      completed: true,
    },
    {
      id: 'task-1-2',
      text: 'Project Scope Definition',
      start_date: fmt(planningStart.add(7, 'day')),
      end_date: fmt(planningStart.add(20, 'day')),
      progress: 0.6,
      parent: 'group-1',
      type: 'task',
      priority: 2,
      group: 'group-1',
      completed: false,
    },
    {
      id: 'task-1-3',
      text: 'Resource Planning Resource Planning Resource Planning',
      start_date: fmt(planningStart.add(15, 'day')),
      end_date: fmt(planningEnd),
      progress: 0.3,
      parent: 'group-1',
      type: 'task',
      priority: 3,
      group: 'group-1',
    },

    {
      id: 'group-2',
      text: 'Development Phase',
      start_date: fmt(developmentStart),
      end_date: fmt(developmentEnd),
      progress: 0.1,
      type: 'project',
      priority: 2,
      group: 'group-2',
      open: true,
    },
    {
      id: 'task-2-1',
      text: 'Frontend Development',
      start_date: fmt(developmentStart),
      end_date: fmt(developmentStart.add(20, 'day')),
      progress: 0.1,
      parent: 'group-2',
      type: 'task',
      priority: 1,
      group: 'group-2',
      completed: true,
    },
    {
      id: 'task-2-2',
      text: 'Backend Development',
      start_date: fmt(developmentStart.add(7, 'day')),
      end_date: fmt(developmentEnd),
      progress: 0.15,
      parent: 'group-2',
      type: 'task',
      priority: 2,
      group: 'group-2',
    },
    {
      id: 'task-2-3',
      text: 'API Integration',
      start_date: fmt(developmentStart.add(14, 'day')),
      end_date: fmt(developmentEnd),
      progress: 0.9,
      parent: 'group-2',
      type: 'task',
      priority: 3,
      group: 'group-2',
    },

    {
      id: 'group-3',
      text: 'Testing & Deployment',
      start_date: fmt(testingStart),
      end_date: fmt(testingEnd),
      progress: 0.9,
      type: 'project',
      priority: 3,
      group: 'group-3',
      open: true,
    },
    {
      id: 'task-3-1',
      text: 'Unit Testing',
      start_date: fmt(testingStart),
      end_date: fmt(testingStart.add(6, 'day')),
      progress: 0.1,
      parent: 'group-3',
      type: 'task',
      priority: 1,
      group: 'group-3',
    },
    {
      id: 'task-3-2',
      text: 'Integration Testing',
      start_date: fmt(testingStart.add(3, 'day')),
      end_date: fmt(testingStart.add(10, 'day')),
      progress: 0.55,
      parent: 'group-3',
      type: 'task',
      priority: 2,
      group: 'group-3',
    },
    {
      id: 'task-3-3',
      text: 'Production Deployment',
      start_date: fmt(testingStart.add(7, 'day')),
      end_date: fmt(testingEnd),
      progress: 0.82,
      parent: 'group-3',
      type: 'task',
      priority: 3,
      group: 'group-3',
    },
  ];
};

export const ganttTasks = generateGanttTasks();

export const ganttResources: GanttResource[] = [
  {
    id: 'resource-1',
    text: 'Project Manager',
    type: 'resource',
    color: '#4CAF50',
  },
  {
    id: 'resource-2',
    text: 'UI/UX Designer',
    type: 'resource',
    color: '#FF9800',
  },
  {
    id: 'resource-3',
    text: 'Frontend Developer',
    type: 'resource',
    color: '#9C27B0',
  },
  {
    id: 'resource-4',
    text: 'Backend Developer',
    type: 'resource',
    color: '#F44336',
  },
  {
    id: 'resource-5',
    text: 'QA Engineer',
    type: 'resource',
    color: '#607D8B',
  },
  {
    id: 'resource-6',
    text: 'DevOps Engineer',
    type: 'resource',
    color: '#795548',
  },
];

export const ganttLinks: GanttLink[] = [
  {
    id: 'link-1',
    source: 'task-1-1',
    target: 'task-1-2',
    type: '0',
  },
  {
    id: 'link-2',
    source: 'task-1-2',
    target: 'task-1-3',
    type: '0',
  },

  {
    id: 'link-3',
    source: 'task-1-3',
    target: 'task-2-1',
    type: '0',
  },

  {
    id: 'link-4',
    source: 'task-2-1',
    target: 'task-2-3',
    type: '0',
  },
  {
    id: 'link-5',
    source: 'task-2-2',
    target: 'task-2-3',
    type: '0',
  },

  {
    id: 'link-6',
    source: 'task-2-3',
    target: 'task-3-1',
    type: '0',
  },

  {
    id: 'link-7',
    source: 'task-3-1',
    target: 'task-3-2',
    type: '0',
  },
  {
    id: 'link-8',
    source: 'task-3-2',
    target: 'task-3-3',
    type: '0',
  },
];

export const ganttAssignments = [
  { task: 'group-1', resource: 'resource-1' },
  { task: 'task-1-1', resource: 'resource-1' },
  { task: 'task-1-2', resource: 'resource-1' },
  { task: 'task-1-3', resource: 'resource-1' },

  { task: 'group-2', resource: 'resource-1' },
  { task: 'task-2-1', resource: 'resource-3' },
  { task: 'task-2-2', resource: 'resource-4' },
  { task: 'task-2-3', resource: 'resource-4' },

  { task: 'group-3', resource: 'resource-1' },
  { task: 'task-3-1', resource: 'resource-5' },
  { task: 'task-3-2', resource: 'resource-5' },
  { task: 'task-3-3', resource: 'resource-6' },
];
