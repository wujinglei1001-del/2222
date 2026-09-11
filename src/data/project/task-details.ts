import { initialConfig } from 'config';
import { users } from 'data/users';
import type { PriorityValue, TaskDetailsData, TaskStatus } from 'types/task-details';

export type {
  CollaboratorAssignment,
  LabelColor,
  PriorityValue,
  SubtaskAssignee,
  TaskActivityItem,
  TaskCommentItem,
  TaskDetailsData,
  TaskFileAttachment,
  TaskLabel,
  TaskStatus,
  TaskSubtask,
} from 'types/task-details';

const detailsImage = (index: number) =>
  `${initialConfig.assetsDir}/images/project/details/${index}.webp`;

const createdByAvatar = `${initialConfig.assetsDir}/images/avatar/11.webp`;

// ---------------------------------------------------------------------------
// Static options (used by UI)
// ---------------------------------------------------------------------------

export const statusOptions: {
  label: TaskStatus;
  value: TaskStatus;
  color: 'neutral' | 'info' | 'success';
}[] = [
  { label: 'To do', value: 'To do', color: 'neutral' },
  { label: 'Doing', value: 'Doing', color: 'info' },
  { label: 'Done', value: 'Done', color: 'success' },
];

export const priorityOptions: { value: PriorityValue; label: string; dotColor: string }[] = [
  { value: 'Normal', label: 'Normal', dotColor: 'primary.main' },
  { value: 'High', label: 'High', dotColor: 'warning.main' },
  { value: 'Urgent', label: 'Urgent', dotColor: 'error.main' },
];

// ---------------------------------------------------------------------------
// Single task details payload (realistic API response)
// ---------------------------------------------------------------------------

const defaultDescription =
  'The EcoSmart Initiative is a project designed to promote sustainable living in cities. It integrates green technologies into daily life, encouraging residents to adopt eco-friendly habits. Key features include installing solar panels, gardens, and launching a city-wide recycling program. The initiative will also offer workshops on topics like composting, water conservation, and energy efficiency, empowering residents to positively impact the environment. Additionally, it will partner with local businesses to encourage green practices, such as discounts for using reusable bags. Overall, the EcoSmart Initiative strives to foster a cleaner and healthier urban environment.';

export const taskDetailsData: TaskDetailsData = {
  id: 'task-1',
  title: 'Find joy in the little things that happen every single day.',
  status: 'Done',
  bannerImage: detailsImage(1),
  createdBy: { name: 'Mary Ann', avatar: createdByAvatar },
  description: defaultDescription,
  descriptionHtml: `<p>${defaultDescription}</p>`,
  priority: 'Normal',
  startDate: null,
  dueDate: null,
  labels: [
    { label: 'Admin', color: 'primary' },
    { label: 'Modification', color: 'warning' },
    { label: 'Bug', color: 'error' },
    { label: 'Feature', color: 'success' },
    { label: 'Documentation', color: 'info' },
    { label: 'Review', color: 'primary' },
    { label: 'Urgent', color: 'error' },
  ],
  collaborators: users.map((user, index) => ({
    id: String(user.id),
    name: user.name,
    avatar: user.avatar,
    checked: index < 2,
  })),
  subtasks: [
    {
      id: 'subtask-1',
      title: 'Quick Fix',
      description: 'A fast way to tackle issues effectively.',
      checked: false,
      assignees: users.slice(0, 4).map((u) => ({ id: u.id, name: u.name, avatar: u.avatar })),
    },
    {
      id: 'subtask-2',
      title: 'Team Meeting',
      description: 'Sync on progress and blockers.',
      checked: false,
      assignees: users.slice(1, 2).map((u) => ({ id: u.id, name: u.name, avatar: u.avatar })),
    },
    {
      id: 'subtask-3',
      title: 'Wrap-Up',
      description: 'Finalize and document decisions.',
      checked: false,
      assignees: users.slice(2, 4).map((u) => ({ id: u.id, name: u.name, avatar: u.avatar })),
    },
    {
      id: 'subtask-4',
      title: 'Feedback Cycle',
      description: 'Collect and incorporate feedback.',
      checked: false,
      assignees: [],
    },
    {
      id: 'subtask-5',
      title: 'Daily Check-In',
      description: 'A quick look at our progress and daily challenges.',
      checked: true,
      assignees: users.slice(5, 6).map((u) => ({ id: u.id, name: u.name, avatar: u.avatar })),
    },
    {
      id: 'subtask-6',
      title: 'Project Launch',
      description: 'The kickoff event where we share our goals and plans.',
      checked: true,
      assignees: users.slice(6, 8).map((u) => ({ id: u.id, name: u.name, avatar: u.avatar })),
    },
  ],
  attachments: [
    {
      id: '1',
      filename: 'Image.jpeg',
      image: detailsImage(2),
      time: '',
      addedBy: '',
      size: '35.5 kb',
    },
    {
      id: '2',
      filename: 'Image.jpeg',
      image: detailsImage(1),
      time: '',
      addedBy: '',
      size: '35.5 kb',
    },
    {
      id: '3',
      filename: 'File.pdf',
      time: '',
      addedBy: '',
      size: '120 kb',
      icon: 'material-symbols:picture-as-pdf-outline-rounded',
    },
  ],
  activities: [
    {
      id: '1',
      user: users[1].name,
      action: 'Created a new task',
      time: new Date(Date.now() - 2000).toISOString(),
    },
    {
      id: '2',
      user: users[1].name,
      action: 'Added a file',
      time: new Date(Date.now() - 2000).toISOString(),
    },
    {
      id: '3',
      user: users[1].name,
      action: 'Added a response',
      time: new Date(Date.now() - 86400 * 1000).toISOString(),
    },
    {
      id: '4',
      user: users[1].name,
      action: 'Updated status',
      time: new Date(Date.now() - 30 * 86400 * 1000).toISOString(),
    },
    {
      id: '5',
      user: users[1].name,
      action: 'Moved to In Progress',
      time: new Date('2023-08-24T10:00:00').toISOString(),
    },
  ],
  comments: [
    {
      id: '1',
      name: users[2].name,
      time: new Date().toISOString(),
      text: "This project is going exceptionally well, and I can't wait to see how it continues to thrive. The potential for growth is limitless!",
      likeCount: 2,
      liked: false,
      author: users[2],
      verified: true,
      online: true,
    },
    {
      id: '2',
      name: users[1].name,
      time: new Date().toISOString(),
      text: "I'm thrilled about the upcoming steps in this project; it's a wonderful opportunity for us to create a positive impact.",
      likeCount: 4,
      liked: false,
      author: users[3],
      verified: true,
      online: true,
    },
    {
      id: '3',
      name: users[4].name,
      time: new Date().toISOString(),
      text: "The initial phases went smoothly, and now we're gaining incredible momentum and achieving remarkable results.",
      likeCount: 2,
      liked: false,
      author: users[2],
      online: true,
    },
    {
      id: '4',
      name: users[2].name,
      time: new Date().toISOString(),
      text: "The progress has been outstanding, and we're continuously learning and adapting to ensure we keep advancing effortlessly.",
      likeCount: 4,
      liked: false,
      author: users[1],
      online: true,
    },
    {
      id: '5',
      name: users[1].name,
      time: new Date().toISOString(),
      text: "I'm very confident about the current direction, and I have complete faith in the team to manage the workload seamlessly.",
      likeCount: 3,
      liked: true,
      author: users[4],
      online: false,
    },
  ],
};
