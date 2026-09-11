import { users } from 'data/users';
import type { CreateProjectFormValues } from '../useCreateProjectStepper';

export const tasksPerGroup = 4;

export const labelOptions = ['Feature', 'Bug', 'Issue'] as const;

export const getNextTaskId = (tasks: { id?: string }[]): string => {
  const max = Math.max(
    0,
    ...tasks
      .map((task) => parseInt((task?.id ?? '').replace(/^task-/, ''), 10))
      .filter((parsedNumber) => !Number.isNaN(parsedNumber)),
  );
  return `task-${max + 1}`;
};

export interface AvatarItem {
  key: number | string;
  name: string;
  avatarUrl: string;
  initials: string;
}

export const getInitials = (fullName?: string) => {
  return (fullName || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
};

export const getAvatarItems = (
  collaborators: CreateProjectFormValues['collaborators'],
): AvatarItem[] => {
  return collaborators
    .filter((collaborator) =>
      Boolean(collaborator?.email || typeof collaborator?.userId === 'number'),
    )
    .map((collaborator) => {
      const email = (collaborator.email || '').toLowerCase();
      const matchedUser = users.find((user) => user.email.toLowerCase() === email);
      const name = collaborator.name || matchedUser?.name || collaborator.email;
      const avatarUrl = collaborator.avatar || matchedUser?.avatar || '';

      return {
        key: `user-${collaborator.userId}`,
        name,
        avatarUrl,
        initials: getInitials(name),
      };
    });
};
