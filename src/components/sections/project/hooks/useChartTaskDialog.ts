'use client';

import { useCallback, useMemo, useState } from 'react';
import type { TaskFormData } from 'components/sections/project/common/TaskDialog';

interface UseChartTaskDialogOptions<TTask extends { id: string }> {
  addTask: (task: TTask) => void;
  updateTask: (taskId: string, task: TTask) => void;
  toFormData: (task: TTask) => TaskFormData;
  fromFormData: (formData: TaskFormData, editingTask?: TTask) => TTask;
}

export const useChartTaskDialog = <TTask extends { id: string }>({
  addTask,
  updateTask,
  toFormData,
  fromFormData,
}: UseChartTaskDialogOptions<TTask>) => {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TTask | null>(null);

  const onTaskClick = useCallback((task: TTask) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  }, []);

  const handleOpenCreateDialog = useCallback(() => {
    setEditingTask(null);
    setTaskDialogOpen(true);
  }, []);

  const handleTaskDialogOpenChange = useCallback((open: boolean) => {
    setTaskDialogOpen(open);
    if (!open) {
      setEditingTask(null);
    }
  }, []);

  const handleTaskSubmit = useCallback(
    (formData: TaskFormData) => {
      if (editingTask) {
        updateTask(editingTask.id, fromFormData(formData, editingTask));
        return;
      }

      addTask(fromFormData(formData));
    },
    [addTask, updateTask, fromFormData, editingTask],
  );

  const taskDialogInitialValues = useMemo(
    () => (editingTask ? toFormData(editingTask) : undefined),
    [editingTask, toFormData],
  );

  return {
    taskDialogOpen,
    taskDialogMode: editingTask ? ('edit' as const) : ('create' as const),
    taskDialogInitialValues,
    onTaskClick,
    handleOpenCreateDialog,
    handleTaskDialogOpenChange,
    handleTaskSubmit,
  };
};
