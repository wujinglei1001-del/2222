import { Box, Stack, Typography } from '@mui/material';
import { PRIORITY_OPTIONS, getPriorityDotColor } from '../common/constants';
import FromToSelectConditionFields from './FromToSelectConditionFields';

interface PriorityChangesConditionFieldsProps {
  index: number;
}

const renderPriorityValue = (selected: unknown) => {
  const value = String(selected ?? '');
  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          bgcolor: getPriorityDotColor(value),
          flexShrink: 0,
        }}
      />
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
};

const PriorityChangesConditionFields = ({ index }: PriorityChangesConditionFieldsProps) => (
  <FromToSelectConditionFields
    index={index}
    options={PRIORITY_OPTIONS}
    renderValue={renderPriorityValue}
    renderOption={(priority) => (
      <>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            mr: 1.5,
            bgcolor: getPriorityDotColor(priority),
            flexShrink: 0,
          }}
        />
        {priority}
      </>
    )}
  />
);

export default PriorityChangesConditionFields;
