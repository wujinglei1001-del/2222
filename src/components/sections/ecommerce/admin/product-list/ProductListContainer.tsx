import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';
import { Button, IconButton, MenuItem, Stack } from '@mui/material';
import Grid from '@mui/material/Grid';
import { GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { ProductListAdmin } from 'types/ecommerce';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import DataGridSelectionBar from 'components/common/DataGridSelectionBar';
import SearchTextField from 'components/common/SearchTextField';
import StyledTextField from 'components/styled/StyledTextField';
import ProductsTable from './ProductsTable';
import FilterSection from './filters/FilterSection';

const emptySelection: GridRowSelectionModel = {
  type: 'include',
  ids: new Set(),
};

const ProductListContainer = () => {
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(emptySelection);
  const [bulkStatus, setBulkStatus] = useState<ProductListAdmin['status']>('active');
  const apiRef = useGridApiRef();

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      apiRef.current?.setQuickFilterValues([e.target.value]);
    },
    [apiRef],
  );

  const handleDateSearch = useCallback(
    (newValue: Dayjs | null) => {
      if (newValue) {
        const formattedDate = newValue.format('D MMM, YY');
        apiRef.current?.setQuickFilterValues([formattedDate]);
      } else {
        apiRef.current?.setQuickFilterValues([]);
      }
    },
    [apiRef],
  );

  const handleToggleFilterPanel = (e: MouseEvent<HTMLButtonElement>) => {
    const clickedEl = e.currentTarget;

    if (filterButtonEl && filterButtonEl === clickedEl) {
      setFilterButtonEl(null);
      apiRef.current?.hideFilterPanel();

      return;
    }

    setFilterButtonEl(clickedEl);
    apiRef.current?.showFilterPanel();
  };

  return (
    <Grid container spacing={{ xs: 2, md: 4 }}>
      <Grid size={12}>
        <Stack
          direction={{ xl: 'row' }}
          sx={{
            columnGap: 1,
            rowGap: 2,
            justifyContent: 'space-between',
          }}
        >
          <Stack
            direction="row"
            sx={{
              gap: 1,
              flexGrow: 1,
              alignItems: 'center',
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
          >
            <Button
              href={paths.adminProductListing}
              variant="contained"
              color="primary"
              sx={{ flexShrink: 0 }}
            >
              Add product
            </Button>

            <SearchTextField
              fullWidth
              placeholder="Search product"
              onChange={handleSearch}
              sx={{
                maxWidth: {
                  sm: 360,
                  xl: 220,
                },
                mr: { sm: 4, md: 11, lg: 0 },
                order: { xs: 1, sm: 0 },
              }}
            />
            <DatePicker
              format="D MMM, YY"
              onChange={handleDateSearch}
              slotProps={{
                textField: {
                  variant: 'filled',
                  fullWidth: true,
                  sx: { maxWidth: 180, ml: { xs: 'auto', xl: 'unset' } },
                },
                field: { clearable: true },
                inputAdornment: {
                  position: 'start',
                },
              }}
              sx={{ ml: { xs: 'auto', xl: 0 } }}
            />
          </Stack>

          <FilterSection apiRef={apiRef} handleToggleFilterPanel={handleToggleFilterPanel} />
        </Stack>
      </Grid>
      <Grid size={12}>
        <ProductsTable
          apiRef={apiRef}
          filterButtonEl={filterButtonEl}
          selectionModel={selectionModel}
          onSelectionChange={setSelectionModel}
        />

        <DataGridSelectionBar selectedCount={selectionModel.ids.size}>
          <StyledTextField
            select
            size="small"
            value={bulkStatus}
            onChange={(event) =>
              setBulkStatus(event.target.value as ProductListAdmin['status'])
            }
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="archive">Archive</MenuItem>
          </StyledTextField>

          <IconButton
            color="error"
            size="small"
            onClick={() => setSelectionModel(emptySelection)}
          >
            <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={20} />
          </IconButton>
        </DataGridSelectionBar>
      </Grid>
    </Grid>
  );
};

export default ProductListContainer;
