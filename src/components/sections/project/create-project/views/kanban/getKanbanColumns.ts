import { tasksPerGroup } from '../../common/helpers';
import type {
  CreateProjectFormValues,
  CreateProjectTaskValue,
} from '../../useCreateProjectStepper';

export interface KanbanTask extends CreateProjectTaskValue {
  formIndex: number;
  id: string;
}

export interface KanbanColumn {
  tasks: KanbanTask[];
  title: string;
  color: string;
}

export const getKanbanColumns = (
  tasks: KanbanTask[],
  groups: CreateProjectFormValues['groups'],
  groupedTasks: string[][],
  hasGroupingEnabled: boolean,
  getGroupColor: (index: number) => string,
): KanbanColumn[] => {
  if (tasks.length === 0) return [];

  if (!hasGroupingEnabled) {
    return [{ tasks, title: '', color: getGroupColor(0) }];
  }

  const columns: KanbanColumn[] = [];

  for (let i = 0; i < groupedTasks.length; i++) {
    const group = groups[i];
    const groupLabel = group?.label?.trim() || '';
    if (groupedTasks[i]) {
      const columnTasks = groupedTasks[i]
        .map((taskValue) => tasks.find((task) => task.value.trim() === taskValue))
        .filter((task): task is KanbanTask => task !== undefined);
      columns.push({ tasks: columnTasks, title: groupLabel, color: getGroupColor(i) });
    }
  }

  const groupedTasksCount = groupedTasks.length * tasksPerGroup;
  const ungroupedTaskValues = tasks.slice(groupedTasksCount).map((task) => task.value.trim());

  if (ungroupedTaskValues.length > 0) {
    const ungroupedColumnsCount = Math.ceil(ungroupedTaskValues.length / tasksPerGroup);
    for (let i = 0; i < ungroupedColumnsCount; i++) {
      const startIndex = i * tasksPerGroup;
      const endIndex = Math.min(startIndex + tasksPerGroup, ungroupedTaskValues.length);
      const columnTaskValues = ungroupedTaskValues.slice(startIndex, endIndex);
      const columnTasks = columnTaskValues
        .map((taskValue) => tasks.find((task) => task.value.trim() === taskValue))
        .filter((task): task is KanbanTask => task !== undefined);
      columns.push({ tasks: columnTasks, title: '', color: getGroupColor(groupedTasks.length) });
    }
  }

  return columns;
};
