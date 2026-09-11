import type { ComponentType } from 'react';
import { Typography } from '@mui/material';
import type { AutomationAction } from 'types/automations';
import ChangeAssigneesActionFields from './action-fields/ChangeAssigneesActionFields';
import ChangeDateActionFields from './action-fields/ChangeDateActionFields';
import ChangeLabelActionFields from './action-fields/ChangeLabelActionFields';
import ChangePriorityActionFields from './action-fields/ChangePriorityActionFields';
import CreateTaskSubtaskActionFields from './action-fields/CreateTaskSubtaskActionFields';
import GroupSelectActionFields from './action-fields/GroupSelectActionFields';
import StatusSelectActionFields from './action-fields/StatusSelectActionFields';
import { type ActionFieldVariant, getActionFieldVariant } from './common/actionRegistry';

interface ActionFieldProps {
  index: number;
  type: AutomationAction['type'];
}

const NoConfigActionFields = () => (
  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
    No additional configuration required.
  </Typography>
);

const FIELD_COMPONENTS: Record<ActionFieldVariant, ComponentType<{ index: number }>> = {
  group: ({ index }) => <GroupSelectActionFields index={index} paramKey="targetGroup" />,
  project: ({ index }) => <GroupSelectActionFields index={index} paramKey="targetProject" />,
  date: ChangeDateActionFields,
  priority: ChangePriorityActionFields,
  status: StatusSelectActionFields,
  assignees: ChangeAssigneesActionFields,
  label: ChangeLabelActionFields,
  create_task: CreateTaskSubtaskActionFields,
  none: NoConfigActionFields,
};

const ActionFields = ({ index, type }: ActionFieldProps) => {
  const FieldComponent = FIELD_COMPONENTS[getActionFieldVariant(type)];
  return <FieldComponent index={index} />;
};

export default ActionFields;
