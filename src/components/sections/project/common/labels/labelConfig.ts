import type { LabelColor, TaskLabel } from 'types/task-details';

export type ChColorKey = 'chBlue' | 'chPurple' | 'chGreen' | 'chOrange' | 'chRed';

export interface LabelOption {
  label: string;
  chColor: ChColorKey;
  themeColor: LabelColor;
  checked?: boolean;
}

export const THEME_TO_CH_COLOR: Record<LabelColor, ChColorKey> = {
  primary: 'chBlue',
  warning: 'chOrange',
  error: 'chRed',
  success: 'chGreen',
  info: 'chPurple',
};

export const defaultLabelOptions: LabelOption[] = [
  { label: 'Admin', chColor: 'chBlue', themeColor: 'primary', checked: true },
  { label: 'Modification', chColor: 'chOrange', themeColor: 'warning', checked: true },
  { label: 'Bug', chColor: 'chRed', themeColor: 'error', checked: true },
  { label: 'Solvable', chColor: 'chGreen', themeColor: 'success', checked: false },
];

export const taskLabelToOption = (taskLabel: TaskLabel): LabelOption => ({
  label: taskLabel.label,
  chColor: THEME_TO_CH_COLOR[taskLabel.color],
  themeColor: taskLabel.color,
});

export const optionToTaskLabel = (labelOption: LabelOption): TaskLabel => ({
  label: labelOption.label,
  color: labelOption.themeColor,
});

export const mergeAvailableLabelOptions = (
  existingOptions: LabelOption[],
  taskLabels: TaskLabel[],
): LabelOption[] => {
  const optionByLabel = new Map(existingOptions.map((option) => [option.label, option]));

  taskLabels.forEach((taskLabel) => {
    if (!optionByLabel.has(taskLabel.label)) {
      optionByLabel.set(taskLabel.label, taskLabelToOption(taskLabel));
    }
  });

  return Array.from(optionByLabel.values());
};
