import { chipClasses } from '@mui/material/Chip';
import { listItemClasses } from '@mui/material/ListItem';
import { listItemButtonClasses } from '@mui/material/ListItemButton';
import type { ComponentsOverrides, Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles';
import type { PickersLayoutProps } from '@mui/x-date-pickers/PickersLayout';
import type { PickerValidDate } from '@mui/x-date-pickers/models';

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey {
    MuiPickersLayout:
      'root' | 'landscape' | 'contentWrapper' | 'toolbar' | 'actionBar' | 'tabs' | 'shortcuts';
  }

  interface ComponentsPropsList {
    MuiPickersLayout: Partial<PickersLayoutProps<PickerValidDate>>;
  }

  interface Components {
    MuiPickersLayout?: {
      defaultProps?: Partial<PickersLayoutProps<PickerValidDate>>;
      styleOverrides?: Partial<ComponentsOverrides<Theme>['MuiPickersLayout']>;
    };
  }
}

const PickersLayout: Components<Omit<Theme, 'components'>>['MuiPickersLayout'] = {
  styleOverrides: {
    shortcuts: ({ theme }) => ({
      maxHeight: 'unset !important',
      alignSelf: 'stretch',
      height: '100%',
      overflow: 'visible',
      maxWidth: 220,
      padding: theme.spacing(1),
      marginRight: theme.spacing(2),
      boxSizing: 'border-box',
      borderRight: `1px solid ${theme.vars.palette.divider}`,

      [`& .${listItemClasses.root}`]: {
        padding: 0,
        marginBottom: theme.spacing(1),
      },

      [`& .${listItemButtonClasses.root}`]: {
        borderRadius: theme.spacing(1),
        '&:hover': {
          backgroundColor: theme.vars.palette.action.hover,
        },
      },

      [`& .${chipClasses.root}`]: {
        width: '100%',
        height: 24,

        justifyContent: 'flex-start',
        borderRadius: theme.spacing(1),
        backgroundColor: theme.vars.palette.background.elevation2,
        border: 'none',
        [`& .${chipClasses.label}`]: {
          fontWeight: 400,
          fontSize: 14,
          color: theme.vars.palette.text.secondary,
        },
        '&:hover': {
          backgroundColor: theme.vars.palette.primary.lighter,
        },
      },
    }),
  },
};

export default PickersLayout;
