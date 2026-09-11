import { Fragment, useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';

const options = [
  { value: 'timezone', label: 'Timezone' },
  { value: 'gmt', label: 'GMT' },
  { value: 'est', label: 'EST' },
  { value: 'cet', label: 'CET' },
] as const;

interface TimezoneSelectProps {
  variant?: 'button' | 'textfield';
}

const TimezoneSelect = ({ variant = 'textfield' }: TimezoneSelectProps) => {
  const [timezone, setTimezone] = useState('timezone');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (variant === 'button') {
    return (
      <Fragment>
        <Button
          shape="square"
          variant="soft"
          color="neutral"
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <IconifyIcon icon="material-symbols:language" sx={{ fontSize: 20 }} />
        </Button>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {options.map((option) => (
            <MenuItem
              key={option.value}
              disabled={option.value === 'timezone'}
              selected={option.value === timezone}
              onClick={() => {
                setTimezone(option.value);
                setAnchorEl(null);
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </Fragment>
    );
  }

  return (
    <StyledTextField
      select
      value={timezone}
      onChange={(e) => setTimezone(e.target.value)}
      sx={{ minWidth: { xs: 160, sm: 120, lg: 150, xl: 160 } }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} disabled={option.value === 'timezone'} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default TimezoneSelect;
