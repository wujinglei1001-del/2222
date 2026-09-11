import { Stack, Typography } from '@mui/material';
import AssigneeConditionFields from '../condition-fields/AssigneeConditionFields';

interface ChangeAssigneesActionFieldsProps {
  index: number;
}

const ChangeAssigneesActionFields = ({ index }: ChangeAssigneesActionFieldsProps) => (
  <Stack sx={{ gap: 2 }}>
    <Stack sx={{ gap: 1 }}>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        Remove assignees
      </Typography>
      <AssigneeConditionFields
        name={`actions.${index}.params.removeAssignees`}
        textFieldLabel=""
        placeholder="Select a user"
        hideSearch
      />
    </Stack>

    <Stack sx={{ gap: 1 }}>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        Add assignees
      </Typography>
      <AssigneeConditionFields
        name={`actions.${index}.params.addAssignees`}
        textFieldLabel=""
        placeholder="Select a user"
        hideSearch
      />
    </Stack>
  </Stack>
);

export default ChangeAssigneesActionFields;
