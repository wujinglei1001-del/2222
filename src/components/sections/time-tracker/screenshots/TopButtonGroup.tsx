import { type SyntheticEvent, useState } from 'react';
import { Tab, Tabs, tabClasses, tabsClasses } from '@mui/material';
import { cssVarRgba } from 'lib/utils';

const TopButtonGroup = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => setValue(newValue);

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      sx={(theme) => ({
        width: 'fit-content',
        p: 0.5,
        borderRadius: 1.5,
        flexShrink: 0,
        bgcolor: 'background.elevation1',
        [`& .${tabsClasses.list}`]: { gap: 0 },
        [`& .${tabsClasses.indicator}`]: {
          height: 1,
          bgcolor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.15),
          borderRadius: 1,
        },
        [`& .${tabClasses.root}`]: {
          color: 'text.primary',
          fontWeight: 600,
          textTransform: 'none',
          px: 2,
          [`&.${tabClasses.selected}`]: { color: 'primary.dark' },
        },
      })}
    >
      <Tab label="10 min" value={0} disableRipple />
      <Tab label="30 min" value={1} disableRipple />
      <Tab label="All" value={2} disableRipple />
    </Tabs>
  );
};

export default TopButtonGroup;
