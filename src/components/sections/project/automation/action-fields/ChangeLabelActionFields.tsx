import { Stack, Typography } from '@mui/material';
import LabelConditionFields from '../condition-fields/LabelConditionFields';

interface ChangeLabelActionFieldsProps {
  index: number;
}

const ChangeLabelActionFields = ({ index }: ChangeLabelActionFieldsProps) => (
  <Stack sx={{ gap: 2 }}>
    <Stack sx={{ gap: 1 }}>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        Add Label
      </Typography>
      <LabelConditionFields
        name={`actions.${index}.params.addLabels`}
        textFieldLabel=""
        placeholder="Select a label"
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
        Remove Label
      </Typography>
      <LabelConditionFields
        name={`actions.${index}.params.removeLabels`}
        textFieldLabel=""
        placeholder="Select a label"
        hideSearch
      />
    </Stack>
  </Stack>
);

export default ChangeLabelActionFields;
