'use client';

import { useId } from 'react';
import { Icon, IconProps } from '@iconify/react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { allIconNames, registerIcons } from 'lib/iconify/iconify-register';

export interface IconifyProps extends Omit<IconProps, 'color'> {
  sx?: SxProps<Theme>;
  flipOnRTL?: boolean;
  icon: string;
  color?: string;
}

export const IconifyIcon = ({ icon, flipOnRTL = false, color, sx, ...rest }: IconifyProps) => {
  const uniqueId = useId();

  registerIcons();

  if (!allIconNames.includes(icon)) {
    if (!icon.startsWith('noto')) {
      console.warn(
        [
          `Icon "${icon}" is currently loaded online, which may cause flickering effects.`,
          `To ensure a smoother experience, please register your icon collection for offline use.`,
          `More information is available at: https://aurora.themewagon.com/documentation/icons`,
        ].join('\n'),
      );
    }
  }

  const iconNameClass = icon.split(':').join('-');

  return (
    <Box
      component={Icon}
      className={`iconify ${iconNameClass}`}
      {...rest}
      icon={icon}
      id={uniqueId}
      ssr
      sx={[
        {
          color: color,
        },
        flipOnRTL && {
          transform: (theme) => (theme.direction === 'rtl' ? 'scaleX(-1)' : 'none'),
        },
        { verticalAlign: 'baseline' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
};

export default IconifyIcon;
