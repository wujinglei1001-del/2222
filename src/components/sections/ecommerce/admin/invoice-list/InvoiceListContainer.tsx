import { ChangeEvent, useCallback, useState } from 'react';
import { Button, IconButton, InputAdornment, Stack } from '@mui/material';
import { GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import DateRangePicker from 'components/base/DateRangePicker';
import IconifyIcon from 'components/base/IconifyIcon';
import DataGridSelectionBar from 'components/common/DataGridSelectionBar';
import SearchTextField from 'components/common/SearchTextField';
import InvoicesTable from 'components/sections/ecommerce/admin/invoice-list/InvoicesTable';
import StyledTextField from 'components/styled/StyledTextField';

const emptySelection: GridRowSelectionModel = {
  type: 'include',
  ids: new Set(),
};

const InvoiceListContainer = () => {
  const apiRef = useGridApiRef();
  const { only } = useBreakpoints();
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(emptySelection);

  const onlyXs = only('xs');

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      apiRef.current?.setQuickFilterValues([e.target.value]);
    },
    [apiRef],
  );

  return (
    <>
      <Stack
        direction="row"
        sx={{
          gap: 1,
          mb: 4,
          alignItems: { sm: 'center' },
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ flexShrink: 0 }}
          startIcon={<IconifyIcon icon="material-symbols:add-rounded" />}
        >
          {!onlyXs ? 'Generate new invoice' : 'New'}
        </Button>

        <SearchTextField
          fullWidth
          onChange={handleSearch}
          placeholder="Search"
          sx={{
            width: { xs: 1, sm: 300 },
            flexBasis: { xs: '100%', sm: 'unset' },
            order: { xs: 1, sm: 0 },
          }}
        />

        <DateRangePicker
          sx={{ ml: 'auto', minWidth: { md: 240, lg: 300 } }}
          onChange={(date) => console.log(date)}
          placeholderText="Date Range"
          customInput={
            <StyledTextField
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon
                        icon="material-symbols:calendar-today-outline"
                        color="text.secondary"
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          }
        />
      </Stack>

      <InvoicesTable
        apiRef={apiRef}
        selectionModel={selectionModel}
        onSelectionChange={setSelectionModel}
      />

      <DataGridSelectionBar selectedCount={selectionModel.ids.size}>
        <Button size="small" color="neutral" shape="square" sx={{ flexShrink: 0 }}>
          <IconifyIcon icon="material-symbols:download-rounded" fontSize={18} />
        </Button>

        <IconButton color="error" size="small" onClick={() => setSelectionModel(emptySelection)}>
          <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={20} />
        </IconButton>
      </DataGridSelectionBar>
    </>
  );
};

export default InvoiceListContainer;
