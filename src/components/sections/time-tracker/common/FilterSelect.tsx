import { MenuItem, inputLabelClasses } from '@mui/material';
import StyledTextField from 'components/styled/StyledTextField';

interface FilterSelectProps {
  label: string;
  options: { value: string | number; label: string }[];
}

const FilterSelect = ({ label, options }: FilterSelectProps) => {
  return (
    <StyledTextField
      select
      fullWidth
      defaultValue={0}
      label={label}
      sx={{ [`& .${inputLabelClasses.root}`]: { color: 'text.primary' } }}
    >
      <MenuItem value={0} disabled>
        Select
      </MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default FilterSelect;
