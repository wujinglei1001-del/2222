import { GridColumnMenu, GridColumnMenuColumnsItem, GridColumnMenuProps } from '@mui/x-data-grid';

const CustomColumnMenu = (props: GridColumnMenuProps) => {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        columnMenuColumnsItem: GridColumnMenuColumnsItem,
        columnMenuSortItem: null,
        columnMenuFilterItem: null,
        columnMenuHideItem: null,
        columnMenuPinningItem: null,
        columnMenuAggregationItem: null,
      }}
      slotProps={{
        columnMenuColumnsItem: {
          displayOrder: 0,
        },
      }}
    />
  );
};

export default CustomColumnMenu;
