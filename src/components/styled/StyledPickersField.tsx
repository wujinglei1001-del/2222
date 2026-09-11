'use client';

import { formLabelClasses, inputLabelClasses, styled } from '@mui/material';
import type { PickersTextFieldProps } from '@mui/x-date-pickers';
import {
  PickersTextField,
  pickersInputBaseClasses,
  pickersSectionListClasses,
} from '@mui/x-date-pickers';

const StyledPickersField = styled(({ ref, sx, ...rest }: PickersTextFieldProps) => (
  <PickersTextField sx={[...(Array.isArray(sx) ? sx : [sx])]} ref={ref} {...rest} />
))(({ theme: { typography, spacing, shape }, size }) => ({
  [`& .${formLabelClasses.root}`]: {
    fontWeight: typography.fontWeightMedium,
    transform: 'none',
    position: 'static',
    marginBottom: spacing(0.5),
    marginLeft: spacing(2),
    fontSize: 12,
    ['&.MuiInputLabel-sizeLarge']: { marginLeft: spacing(2.5) },
    [`&.${inputLabelClasses.sizeSmall}`]: { marginLeft: spacing(1.5) },
    [`&.${inputLabelClasses.shrink}`]: { transform: 'none !important' },
  },
  [`& .${pickersInputBaseClasses.root}`]: {
    borderRadius: Number(shape.borderRadius) * 2,
    [`& .${pickersSectionListClasses.root}`]: {
      paddingTop: 8,
      paddingRight: 0,
      paddingBottom: 8,
      paddingLeft: 16,
      [`& .${pickersSectionListClasses.section}`]: {
        lineHeight: spacing(2.5),
        [`& .${pickersSectionListClasses.sectionContent}`]: {
          lineHeight: spacing(2.5),
          ...(size === 'large' && { verticalAlign: 'middle' }),
        },
      },
    },
    [`&.${pickersInputBaseClasses.inputSizeSmall}`]: {
      borderRadius: shape.borderRadius,
      [`& .${pickersSectionListClasses.root}`]: {
        paddingTop: 6,
        paddingRight: 0,
        paddingBottom: 6,
        paddingLeft: 12,
      },
      [`& .${pickersSectionListClasses.section}`]: {
        lineHeight: spacing(2.25),
        [`& .${pickersSectionListClasses.sectionContent}`]: { lineHeight: spacing(2.25) },
      },
    },
    [`&.MuiPickersInputBase-sizeLarge`]: {
      borderRadius: shape.borderRadius,
      [`& .${pickersSectionListClasses.root}`]: {
        paddingTop: 6,
        paddingRight: 0,
        paddingBottom: 6,
        paddingLeft: 20,
      },
      [`& .${pickersSectionListClasses.section}`]: {
        lineHeight: spacing(3.75),
        [`& .${pickersSectionListClasses.sectionContent}`]: { lineHeight: spacing(3.75) },
      },
    },
  },
}));

export default StyledPickersField;
