import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  formControlLabelClasses,
} from '@mui/material';

interface FilterFormGroupProps {
  label: string;
  options: { value: string | number; label: string }[];
}

const FilterFormGroup = ({ label, options }: FilterFormGroupProps) => {
  return (
    <FormControl sx={{ ml: 2 }}>
      <FormLabel sx={{ mb: 1, typography: 'caption', fontWeight: 500, color: 'text.primary' }}>
        {label}
      </FormLabel>

      <FormGroup defaultValue="all" sx={{ pl: 2 }}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Checkbox />}
            label={option.label}
            sx={{
              [`& .${formControlLabelClasses.label}`]: {
                fontSize: 'caption.fontSize',
                mt: '0 !important',
                alignSelf: 'center',
              },
            }}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
};

export default FilterFormGroup;
