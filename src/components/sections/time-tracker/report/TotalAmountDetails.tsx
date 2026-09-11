import { useMemo } from 'react';
import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { DataGrid, type GridColDef, gridClasses } from '@mui/x-data-grid';
import type { TotalAmount } from 'data/time-tracker/report';
import useNumberFormat from 'hooks/useNumberFormat';
import { secondsToHms } from 'lib/utils';
import DataGridPagination from 'components/pagination/DataGridPagination';

interface TotalAmountDetailsProps {
  data: TotalAmount[];
}

const TotalAmountDetails = ({ data }: TotalAmountDetailsProps) => {
  const { currencyFormat } = useNumberFormat();
  const totalRow: Omit<TotalAmount, 'project'> & { project: string } = {
    id: 0,
    project: 'Total',
    totalHours: data.reduce((acc, item) => acc + item.totalHours, 0),
    billableHours: data.reduce((acc, item) => acc + item.billableHours, 0),
    amount: data.reduce((acc, item) => acc + item.amount, 0),
  };

  const colorBar = [
    ...data.map((item) => ({
      color: item.project.color,
      percentage: ((item.totalHours / totalRow.totalHours) * 100).toFixed(2),
    })),
  ];

  const columns: GridColDef<TotalAmount | (Omit<TotalAmount, 'project'> & { project: string })>[] =
    useMemo(
      () => [
        {
          field: 'project',
          headerName: 'Project',
          headerClassName: 'project-header',
          cellClassName: 'project-cell',
          flex: 1.79,
          minWidth: 280,
          renderCell: (params) => {
            return params.row.id !== 0 ? (
              <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 0.5,
                    bgcolor: (params.row as TotalAmount).project.color,
                  }}
                />
                <Stack sx={{ gap: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                    {(params.row as TotalAmount).project.name}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {(params.row as TotalAmount).project.task}
                  </Typography>
                </Stack>
              </Stack>
            ) : (
              <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
                <Box sx={{ width: 16, height: 16 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                  Total
                </Typography>
              </Stack>
            );
          },
        },
        {
          field: 'totalHours',
          headerName: 'Total Hours',
          headerClassName: 'total-hours-header',
          cellClassName: 'total-hours-cell',
          flex: 1,
          minWidth: 120,
          renderCell: (params) => (
            <Typography
              variant="body2"
              sx={{
                fontWeight: params.row.id === 0 ? 500 : 400,
                color: params.row.id === 0 ? 'text.primary' : 'text.secondary',
              }}
            >
              {secondsToHms(params.row.totalHours, true)}
            </Typography>
          ),
        },
        {
          field: 'billableHours',
          headerName: 'Billable Hours',
          headerClassName: 'billable-hours-header',
          cellClassName: 'billable-hours-cell',
          flex: 1,
          minWidth: 120,
          renderCell: (params) => (
            <Typography
              variant="body2"
              sx={{
                fontWeight: params.row.id === 0 ? 500 : 400,
                color: params.row.id === 0 ? 'text.primary' : 'text.secondary',
              }}
            >
              {secondsToHms(params.row.billableHours, true)}
            </Typography>
          ),
        },
        {
          field: 'amount',
          headerName: 'Amount',
          headerClassName: 'amount-header',
          cellClassName: 'amount-cell',
          flex: 1.22,
          minWidth: 120,
          headerAlign: 'right',
          align: 'right',
          renderCell: (params) => (
            <Typography
              variant="body2"
              sx={{
                fontWeight: params.row.id === 0 ? 500 : 400,
                color: params.row.id === 0 ? 'text.primary' : 'text.secondary',
              }}
            >
              {currencyFormat(params.row.amount, { maximumFractionDigits: 0 })}
            </Typography>
          ),
        },
      ],
      [],
    );

  const combinedData = [totalRow, ...data];

  const renderTop = () => (
    <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        Total Amount Details
      </Typography>
      <Button variant="soft" color="neutral">
        Export
      </Button>
    </Stack>
  );

  const renderColorBar = () => (
    <Box sx={{ display: 'inline-flex', height: 16, width: 1, borderRadius: 1, overflow: 'hidden' }}>
      {colorBar.map((item, index) => (
        <Tooltip key={index} title={`${item.percentage}%`}>
          <Box
            sx={{
              height: 1,
              width: `${item.percentage}%`,
              bgcolor: item.color,
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );

  const renderTable = () => (
    <Stack sx={{ width: 1 }}>
      <DataGrid
        rowHeight={64}
        rows={combinedData}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 8 } } }}
        pageSizeOptions={[8, combinedData.length]}
        slots={{
          basePagination: (props) => (
            <DataGridPagination showAllHref="#!" showFullPagination {...props} />
          ),
        }}
        sx={({ spacing }) => ({
          [`& .${gridClasses.columnHeaders}`]: {
            [`& .${gridClasses.columnHeader}`]: {
              '&:not(.amount-header, .project-header)': { p: `0 ${spacing(1.25)}` },
              '&.amount-header': { pl: spacing(1.25) },
              '&.project-header': { pr: spacing(1.25) },
            },
          },
          [`& .${gridClasses.row}`]: {
            [`& .${gridClasses.cell}`]: {
              '&.aurora-data-grid-cell': {
                '&:not(.amount-cell, .project-cell)': { p: `0 ${spacing(1.25)}` },
                '&.amount-cell': { pl: spacing(1.25) },
                '&.project-cell': { pr: spacing(1.25) },
              },
            },
          },
        })}
      />
    </Stack>
  );

  return (
    <Stack sx={{ gap: 3 }}>
      {renderTop()}
      {renderColorBar()}
      {renderTable()}
    </Stack>
  );
};

export default TotalAmountDetails;
