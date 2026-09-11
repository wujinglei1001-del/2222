import { SxProps, Theme } from '@mui/material';

export const projectHeaderPaperSx = {
  overflow: 'hidden',
  borderRadius: 0,
} as const;

export const toolbarSlotSx: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 1,
  minWidth: 0,
};

export const inlineToolbarLeftSlotSx: SxProps<Theme> = {
  ...toolbarSlotSx,
  flex: '1 1 auto',
  minWidth: 0,
};

export const stackedToolbarLeftSlotSx: SxProps<Theme> = {
  ...toolbarSlotSx,
  width: 1,
  minWidth: 0,
};

export const desktopTitleRowSx = {
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: { xs: 'flex-start', sm: 'flex-end' },
} as const;

export const topActionsSlotSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexShrink: 0,
  minWidth: 0,
  ml: 'auto',
};

export const inlineToolbarRowSx: SxProps<Theme> = {
  gap: 1,
  width: 1,
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'nowrap',
  minWidth: 0,
};

export const inlineToolbarRightSlotSx: SxProps<Theme> = {
  ...toolbarSlotSx,
  flexShrink: 0,
  justifyContent: 'flex-end',
  ml: 'auto',
};

export const stackedToolbarRightSlotSx: SxProps<Theme> = {
  ...toolbarSlotSx,
  width: 1,
  minWidth: 0,
};
