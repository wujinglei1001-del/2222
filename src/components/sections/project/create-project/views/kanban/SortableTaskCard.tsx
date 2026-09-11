'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Avatar,
  AvatarGroup,
  Card,
  CardContent,
  Chip,
  Stack,
  Tooltip,
  Typography,
  avatarClasses,
  useTheme,
} from '@mui/material';
import type { ChipOwnProps } from '@mui/material/Chip';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';
import { AvatarItem, labelOptions } from '../../common/helpers';
import type { KanbanTask } from './getKanbanColumns';

const labelColors: Record<string, ChipOwnProps['color']> = {
  Feature: 'primary',
  Bug: 'error',
  Issue: 'warning',
};

const getLabelChipColor = (label: string): ChipOwnProps['color'] => labelColors[label] || 'neutral';

export interface TaskCardContentProps {
  task: KanbanTask;
  globalTaskIndex: number;
  avatarItems: AvatarItem[];
}

export const TaskCardContent = ({ task, globalTaskIndex, avatarItems }: TaskCardContentProps) => {
  const theme = useTheme();
  const label = task.label || labelOptions[globalTaskIndex % labelOptions.length];
  const start = task.startDate ? dayjs(task.startDate) : dayjs().add(globalTaskIndex, 'day');
  const end = task.endDate ? dayjs(task.endDate) : dayjs().add(globalTaskIndex + 1, 'day');
  const visibleAvatars = avatarItems.slice(0, 3);
  const remainingCount = Math.max(0, avatarItems.length - 3);

  return (
    <CardContent
      sx={{
        p: 2,
        pb: `${theme.spacing(2)} !important`,
        pr: 2.5,
        minWidth: 0,
        overflow: 'visible',
      }}
    >
      <Stack sx={{ gap: 1, minWidth: 0 }}>
        <Chip
          label={label}
          variant="soft"
          size="small"
          color={getLabelChipColor(label)}
          sx={{ alignSelf: 'flex-start', textTransform: 'capitalize' }}
        />
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          {task.value}
        </Typography>
        <Stack
          direction="row"
          sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Chip
            icon={
              <IconifyIcon
                icon="material-symbols:calendar-today-outline-rounded"
                sx={{ fontSize: 16, color: 'inherit' }}
              />
            }
            label={`${start.format('D MMM')} - ${end.format('D MMM')}`}
            variant="soft"
            size="small"
            color="primary"
            sx={{ flexShrink: 0 }}
          />
          <Stack direction="row" sx={{ gap: 0.5, alignItems: 'center' }}>
            {visibleAvatars.length > 0 && (
              <AvatarGroup
                max={3}
                sx={{
                  [`& .${avatarClasses.root}`]: {
                    width: 18,
                    height: 18,
                    fontSize: 12,
                    fontWeight: 'medium',
                    bgcolor: 'primary.main',
                  },
                }}
              >
                {visibleAvatars.map((avatarItem) => (
                  <Tooltip key={avatarItem.key} title={avatarItem.name}>
                    <Avatar alt={avatarItem.name} src={avatarItem.avatarUrl}>
                      {avatarItem.avatarUrl ? null : avatarItem.initials}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
            )}
            {remainingCount > 0 && (
              <Chip
                label={`+${remainingCount}`}
                size="small"
                sx={{
                  height: 24,
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </CardContent>
  );
};

export interface SortableTaskCardProps {
  task: KanbanTask;
  taskIndex: number;
  columnIndex: number;
  globalTaskIndex: number;
  avatarItems: AvatarItem[];
}

export const SortableTaskCard = ({
  task,
  taskIndex,
  columnIndex,
  globalTaskIndex,
  avatarItems,
}: SortableTaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', globalTaskIndex, columnIndex, taskIndex },
  });

  return (
    <Card
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
      {...attributes}
      {...listeners}
      sx={{
        borderRadius: 3,
        bgcolor: 'background.elevation2',
        outline: 'none',
        '&:focus': { outline: 'none' },
        '&:hover': { bgcolor: 'background.elevation3' },
      }}
    >
      <TaskCardContent task={task} globalTaskIndex={globalTaskIndex} avatarItems={avatarItems} />
    </Card>
  );
};
