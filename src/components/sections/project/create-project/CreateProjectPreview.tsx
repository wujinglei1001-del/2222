'use client';

import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  Avatar,
  AvatarGroup,
  Box,
  Paper,
  Stack,
  Tooltip,
  Typography,
  avatarGroupClasses,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { getAvatarItems } from './common/helpers';
import type { CreateProjectFormValues } from './useCreateProjectStepper';
import { usePreviewTasks } from './usePreviewTasks';
import CalendarPreview from './views/CalendarPreview';
import KanbanPreview from './views/KanbanPreview';
import TablePreview from './views/TablePreview';
import TimelinePreview from './views/TimelinePreview';

const CreateProjectPreview = () => {
  const { control } = useFormContext<CreateProjectFormValues>();
  const projectTitle = useWatch({ control, name: 'projectTitle' }) ?? '';
  const statuses = useWatch({ control, name: 'statuses' });
  const collaborators = useWatch({ control, name: 'collaborators' }) ?? [];
  const defaultView = useWatch({ control, name: 'defaultView' });

  const { validTasks, taskValues, groupedTasks, groups, hasGroupingEnabled } =
    usePreviewTasks(control);

  const avatarItems = useMemo(() => getAvatarItems(collaborators), [collaborators]);

  const previewContent = (() => {
    if (defaultView === 'calendar') {
      return (
        <CalendarPreview
          tasks={validTasks}
          groups={groups}
          hasGroupingEnabled={hasGroupingEnabled}
          groupedTasks={groupedTasks}
        />
      );
    }
    if (defaultView === 'table') {
      return (
        <TablePreview
          taskValues={taskValues}
          groups={groups}
          statuses={statuses}
          avatarItems={avatarItems}
          hasGroupingEnabled={hasGroupingEnabled}
          groupedTasks={groupedTasks}
        />
      );
    }
    if (defaultView === 'timeline') {
      return (
        <TimelinePreview
          taskValues={taskValues}
          groups={groups}
          avatarItems={avatarItems}
          hasGroupingEnabled={hasGroupingEnabled}
          groupedTasks={groupedTasks}
        />
      );
    }
    if (defaultView === 'kanban') {
      return (
        <KanbanPreview
          tasks={validTasks}
          groups={groups}
          avatarItems={avatarItems}
          hasGroupingEnabled={hasGroupingEnabled}
          groupedTasks={groupedTasks}
        />
      );
    }
    if (taskValues.length === 0) {
      return (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Add tasks to see them preview here.
        </Typography>
      );
    }
    if (!hasGroupingEnabled) {
      return (
        <div>
          {taskValues.map((task, taskIndex) => (
            <Stack
              key={`${task}-${taskIndex}`}
              direction="row"
              sx={{ gap: 2, borderBottom: 1, borderColor: 'divider', py: 1.5 }}
            >
              <IconifyIcon
                icon="material-symbols:check-circle-outline-rounded"
                fontSize={24}
                color="text.disabled"
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  flex: 1,
                }}
              >
                {task}
              </Typography>
            </Stack>
          ))}
        </div>
      );
    }
    return (
      <Stack sx={{ gap: 3 }}>
        {groupedTasks.map((groupTasks, groupIndex) => {
          const group = groups[groupIndex];
          const groupLabel = group?.label?.trim();

          if (!group || !groupLabel) {
            return (
              <Stack key={`ungrouped-${groupIndex}`} sx={{ gap: 1.25 }}>
                {groupTasks.map((task, taskIndex) => (
                  <Box
                    key={`${task}-${taskIndex}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      py: 1,
                      borderBottom: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <IconifyIcon
                      icon="material-symbols:check-circle-outline-rounded"
                      fontSize={20}
                      color="text.disabled"
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {task}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            );
          }

          return (
            <Box
              key={`${groupLabel}-${groupIndex}`}
              sx={{
                pl: 2.5,
                borderLeft: 3,
                borderColor: group.color || 'divider',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {groupLabel}
              </Typography>
              <Stack sx={{ gap: 1.25 }}>
                {groupTasks.map((task, taskIndex) => (
                  <Box
                    key={`${task}-${taskIndex}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      py: 1,
                      borderBottom: 1,
                      borderColor: 'divider',
                    }}
                  >
                    <IconifyIcon
                      icon="material-symbols:check-circle-outline-rounded"
                      fontSize={20}
                      color="text.disabled"
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {task}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    );
  })();

  return (
    <Paper
      sx={{
        height: 1,
        p: { xs: 3, md: 5 },
        borderRadius: 3,
        outline: 'none !important',
      }}
    >
      <Stack sx={{ gap: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4">{projectTitle || 'Project Name'}</Typography>
          </Box>
          <AvatarGroup
            max={5}
            sx={{
              [`& .${avatarGroupClasses.avatar}`]: {
                fontSize: 36,
                height: 36,
                width: 36,
              },
            }}
          >
            {avatarItems.map((avatarItem) => (
              <Tooltip key={avatarItem.key} title={avatarItem.name}>
                <Avatar alt={avatarItem.name} src={avatarItem.avatarUrl}>
                  {avatarItem.avatarUrl ? null : avatarItem.initials}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
        </Box>
        {previewContent}
      </Stack>
    </Paper>
  );
};

export default CreateProjectPreview;
