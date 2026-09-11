export const SEARCH_SUBHEADER_HEIGHT = 72;

export const searchSubheaderSx = {
  position: 'sticky',
  top: 0,
  zIndex: 3,
  bgcolor: 'background.paper',
  px: 1.5,
  pt: 1.5,
  pb: 1.5,
  minHeight: SEARCH_SUBHEADER_HEIGHT,
  boxSizing: 'border-box',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
} as const;

export const getGroupSubheaderSx = (isFirstGroup: boolean, hideSearch = false) => ({
  position: 'sticky',
  top: hideSearch ? 0 : SEARCH_SUBHEADER_HEIGHT,
  zIndex: 2,
  bgcolor: 'background.paper',
  flexShrink: 0,
  pt: isFirstGroup ? 2 : 1,
  pb: 1,
  mb: 0,
  lineHeight: 1.2,
  typography: 'overline',
  fontWeight: 500,
  color: 'text.disabled',
});

export const groupedMenuProps = {
  disableAutoFocusItem: true,
  anchorOrigin: { vertical: 'bottom', horizontal: 'left' } as const,
  transformOrigin: { vertical: 'top', horizontal: 'left' } as const,
  slotProps: {
    paper: { sx: { mt: 1, maxHeight: 520 } },
    list: { sx: { pt: 0 } },
  },
};
