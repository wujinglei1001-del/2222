'use client';

import { useCallback, useMemo } from 'react';
import { Control, useFieldArray, useWatch } from 'react-hook-form';
import { tasksPerGroup } from './common/helpers';
import type { CreateProjectFormValues, CreateProjectTaskValue } from './useCreateProjectStepper';

export interface ValidTask extends CreateProjectTaskValue {
  formIndex: number;
  id: string;
}

export const usePreviewTasks = (control: Control<CreateProjectFormValues>) => {
  const { move } = useFieldArray({ control, name: 'tasks' });
  const tasks = useWatch({ control, name: 'tasks' }) ?? [];
  const groups = useWatch({ control, name: 'groups' }) ?? [];

  const validTasks = useMemo<ValidTask[]>(() => {
    return tasks
      .map((task, index) => ({
        ...task,
        formIndex: index,
        id: task?.id || `task-${index}-${task?.value?.slice(0, 8) ?? ''}`,
      }))
      .filter((task) => task?.value?.trim()) as ValidTask[];
  }, [tasks]);

  const taskValues = useMemo(
    () => validTasks.map((task) => task.value.trim()) as string[],
    [validTasks],
  );

  const hasGroupingEnabled = groups.length > 0;

  const groupedTasks = useMemo(
    () =>
      validTasks.reduce<string[][]>((acc, task, taskIndex) => {
        const groupIndex = Math.floor(taskIndex / tasksPerGroup);
        if (!acc[groupIndex]) acc[groupIndex] = [];
        acc[groupIndex].push(task.value.trim());
        return acc;
      }, []),
    [validTasks],
  );

  const getFormTaskIndex = useCallback(
    (taskValuesIndex: number) => validTasks[taskValuesIndex]?.formIndex,
    [validTasks],
  );

  const handleTaskReorder = useCallback(
    (fromTaskValuesIndex: number, toTaskValuesIndex: number) => {
      const fromFormIndex = getFormTaskIndex(fromTaskValuesIndex);
      let toFormIndex = getFormTaskIndex(toTaskValuesIndex);

      if (fromFormIndex === undefined || fromFormIndex === toFormIndex) return;
      if (toFormIndex === undefined) toFormIndex = tasks.length;

      move(fromFormIndex, toFormIndex);
    },
    [getFormTaskIndex, move, tasks.length],
  );

  return {
    validTasks,
    taskValues,
    groupedTasks,
    groups,
    hasGroupingEnabled,
    getFormTaskIndex,
    handleTaskReorder,
  };
};
