import type { Components, ComponentsOverrides, Interpolation, Theme } from '@mui/material';
import { inputAdornmentClasses } from '@mui/material';
import type { PickersTextFieldProps } from '@mui/x-date-pickers';
import {
  pickersFilledInputClasses,
  pickersInputBaseClasses,
  pickersOutlinedInputClasses,
  pickersSectionListClasses,
} from '@mui/x-date-pickers';

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey {
    MuiPickersTextField: 'root';
  }

  interface Components {
    MuiPickersTextField?: {
      variants?: {
        props:
          | Partial<PickersTextFieldProps>
          | ((
              props: Partial<PickersTextFieldProps> & {
                ownerState: Partial<PickersTextFieldProps>;
              },
            ) => boolean);
        style: Interpolation<{ theme: Omit<Theme, 'components'> }>;
      }[];
      defaultProps?: Partial<PickersTextFieldProps>;
      styleOverrides?: ComponentsOverrides<Theme>['MuiPickersTextField'];
    };
  }

  interface PickersTextFieldPropsSizeOverrides {
    large: true;
  }
  interface PickersInputBasePropsSizeOverrides {
    large: true;
  }
}

const PickersTextField: Components<Omit<Theme, 'components'>>['MuiPickersTextField'] = {
  variants: [
    {
      props: { size: 'large' },
      style: ({ theme: { spacing, shape } }) => ({
        [`& .${pickersInputBaseClasses.root}`]: { borderRadius: Number(shape.borderRadius) * 2 },
        [`& .${pickersFilledInputClasses.root}`]: {
          [`& .${pickersSectionListClasses.root}`]: {
            paddingTop: spacing(2.875),
            paddingBottom: spacing(0.875),
            paddingLeft: spacing(2.5),
            [`& .${pickersSectionListClasses.section}`]: { height: spacing(3), fontSize: 16 },
          },
        },
        [`& .${pickersOutlinedInputClasses.root}`]: {
          paddingLeft: spacing(2.5),
          [`& .${pickersSectionListClasses.root}`]: {
            paddingTop: spacing(1.875),
            paddingBottom: spacing(1.875),
            [`& .${pickersSectionListClasses.section}`]: { height: spacing(3), fontSize: 16 },
          },
          [`& .${pickersOutlinedInputClasses.notchedOutline}`]: { padding: '0 14px' },
        },
      }),
    },
  ],
  defaultProps: { variant: 'filled' },
  styleOverrides: {
    root: ({ theme: { spacing, shape } }) => ({
      minWidth: 0,
      [`& .${pickersInputBaseClasses.root}`]: {
        borderRadius: Number(shape.borderRadius) * 2,
        [`&.${pickersInputBaseClasses.inputSizeSmall}`]: { borderRadius: shape.borderRadius },
        [`& .${pickersSectionListClasses.root}`]: {
          [`& .${pickersSectionListClasses.section}`]: { height: spacing(2.5) },
        },
        [`& .${pickersSectionListClasses.root}:has(~ .${inputAdornmentClasses.positionEnd})`]: {
          paddingRight: 0,
        },
      },
    }),
  },
};

export default PickersTextField;
