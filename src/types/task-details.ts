import type { Attachment } from 'data/kanban/kanban';
import type { User } from 'types/users';

export type TaskStatus = 'To do' | 'Doing' | 'Done';

export type PriorityValue = 'Normal' | 'High' | 'Urgent';

export type LabelColor = 'primary' | 'warning' | 'error' | 'success' | 'info';

export interface TaskLabel {
  label: string;
  color: LabelColor;
}

export interface CollaboratorAssignment {
  id: string;
  name: string;
  avatar: string;
  checked: boolean;
}

export interface SubtaskAssignee {
  id: number;
  name: string;
  avatar: string;
}

export interface TaskSubtask {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  assignees: SubtaskAssignee[];
}

export interface TaskFileAttachment extends Attachment {
  file?: File;
  size?: string;
}

export interface TaskActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
}

export interface TaskCommentItem {
  id: string;
  name: string;
  time: string;
  text: string;
  likeCount: number;
  liked: boolean;
  author: User;
  verified?: boolean;
  online?: boolean;
}

export interface TaskDetailsData {
  id: string;
  title: string;
  status: TaskStatus;
  bannerImage: string;
  createdBy: { name: string; avatar?: string };
  description: string;
  descriptionHtml: string;
  priority: PriorityValue;
  startDate: string | null;
  dueDate: string | null;
  labels: TaskLabel[];
  collaborators: CollaboratorAssignment[];
  subtasks: TaskSubtask[];
  attachments: TaskFileAttachment[];
  activities: TaskActivityItem[];
  comments: TaskCommentItem[];
}
