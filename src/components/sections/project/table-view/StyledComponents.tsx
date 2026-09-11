'use client';

import Table from '@mui/material/Table';
import { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { tableRowClasses } from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

export const StyledTable = styled(Table, {
  shouldForwardProp: (prop) => prop !== 'dense',
})<{ dense?: boolean }>(({ theme, dense }) => ({
  [`& .${tableRowClasses.root}`]: {
    '& td, & th': {
      '&:first-of-type': {
        paddingLeft: theme.spacing(0.75),
      },
      '&:last-of-type': {
        paddingRight: theme.spacing(0.75),
      },
    },
  },
  [`& .${tableCellClasses.root}`]: {
    paddingLeft: theme.spacing(0.75),
    paddingRight: theme.spacing(0.75),
    paddingTop: theme.spacing(dense ? 0.75 : 1),
    paddingBottom: theme.spacing(dense ? 0.75 : 1),
    whiteSpace: 'nowrap',
  },
  '& .leading-icon-cell': {
    width: 30,
    minWidth: 30,
    maxWidth: 30,
    boxSizing: 'border-box',
    paddingLeft: `${theme.spacing(0.5)} !important`,
    paddingRight: `${theme.spacing(0.5)} !important`,
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    overflow: 'visible',
    verticalAlign: 'middle',
    lineHeight: 0,
  },
  '& .subtask-name-cell': {
    paddingLeft: '12px !important',
  },
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& th': {
    backgroundColor: theme.vars.palette.background.default,
    borderBottom: `1px solid ${theme.vars.palette.dividerLight}`,
  },
}));
