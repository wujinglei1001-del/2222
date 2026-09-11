import type { Components, ComponentsOverrides, Theme } from '@mui/material/styles';
import { pickersFilledInputClasses, pickersInputBaseClasses } from '@mui/x-date-pickers';

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey {
    MuiPickersFilledInput: 'root' | 'underline' | 'input' | 'sectionsContainer';
  }

  interface Components {
    MuiPickersFilledInput?: {
      styleOverrides?: ComponentsOverrides<Theme>['MuiPickersFilledInput'];
    };
  }
}

type PickersFilledOwnerState = {
  inputSize?: 'small' | 'medium';
  inputHasLabel?: boolean;
  hasStartAdornment?: boolean;
  hasEndAdornment?: boolean;
};

const PickersFilledInput: Components<Omit<Theme, 'components'>>['MuiPickersFilledInput'] = {
  styleOverrides: {
    root: ({ theme: { vars } }) => ({
      backgroundColor: vars.palette.background.elevation2,
      '&:hover': { backgroundColor: vars.palette.background.elevation3 },
      '&:before, &:after': { display: 'none' },
      [`&.${pickersInputBaseClasses.focused}`]: {
        backgroundColor: vars.palette.primary.lighter,
        boxShadow: `0 0 0 1px ${vars.palette.primary.main}`,
      },
      [`&.${pickersFilledInputClasses.error}`]: {
        backgroundColor: vars.palette.error.lighter,
        boxShadow: `0 0 0 1px ${vars.palette.error.main}`,
      },
      [`&.${pickersFilledInputClasses.disabled}`]: {
        backgroundColor: vars.palette.action.disabledBackground,
        boxShadow: 'none',
        cursor: 'not-allowed',
        '*': { color: vars.palette.action.disabled },
      },
      [`&.${pickersInputBaseClasses.adornedStart}`]: { paddingLeft: 16 },
      [`&.${pickersInputBaseClasses.adornedStart}.${pickersInputBaseClasses.inputSizeSmall}`]: {
        paddingLeft: 12,
      },
      [`&.${pickersInputBaseClasses.adornedEnd}`]: { paddingRight: 10 },
    }),

    sectionsContainer: ({ ownerState }) => {
      const { inputSize, inputHasLabel } = ownerState as PickersFilledOwnerState;
      const isSmall = inputSize === 'small';

      return {
        paddingLeft: isSmall ? 12 : 16,
        paddingRight: isSmall ? 12 : 16,
        paddingTop: inputHasLabel ? (isSmall ? 18 : 22) : isSmall ? 6 : 8,
        paddingBottom: inputHasLabel ? (isSmall ? 4 : 6) : isSmall ? 6 : 8,
        fontSize: 14,
        lineHeight: 1.5,
        [`& .${pickersInputBaseClasses.sectionContent}`]: {
          '&::-webkit-input-placeholder': { opacity: '1 !important' },
          '&::-moz-placeholder': { opacity: '1 !important' },
        },
      };
    },
  },
};

export default PickersFilledInput;
