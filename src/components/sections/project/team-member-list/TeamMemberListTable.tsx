'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Link,
  MenuItem,
  Stack,
  Typography,
  tablePaginationClasses,
} from '@mui/material';
import {
  DataGrid,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColDef,
  GridRowSelectionModel,
  GridRowSpacingParams,
  gridClasses,
} from '@mui/x-data-grid';
import { TeamMemberListItem, TeamMemberRole } from 'data/project/team-member-list';
import IconifyIcon from 'components/base/IconifyIcon';
import CustomColumnMenu from 'components/common/CustomColumnMenu';
import DashboardMenu from 'components/common/DashboardMenu';
import DataGridPagination from 'components/pagination/DataGridPagination';
import StyledTextField from 'components/styled/StyledTextField';

interface TeamMemberListTableProps {
  data: TeamMemberListItem[];
  selectionModel: GridRowSelectionModel;
  onSelectionChange?: (model: GridRowSelectionModel) => void;
}

const defaultPageSize = 10;

const checkboxColumnWidth = 64;
const actionColumnWidth = 64;

const columnMinWidths = {
  name: 220,
  designation: 150,
  lastActive: 130,
  role: 180,
} as const;

const actionMenuIcon = (
  <IconifyIcon icon="material-symbols:more-horiz" fontSize={18} color="neutral.main" />
);

const TeamMemberListTable = ({
  data,
  selectionModel,
  onSelectionChange,
}: TeamMemberListTableProps) => {
  const [roleByKey, setRoleByKey] = useState<Record<string, TeamMemberRole>>(() => {
    const map: Record<string, TeamMemberRole> = {};
    data.forEach((member) => {
      map[String(member.id)] = member.role;
    });
    return map;
  });

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: params.isFirstVisible ? 16 : 0,
      bottom: params.isLastVisible ? 24 : 8,
    };
  }, []);

  const columns: GridColDef<TeamMemberListItem>[] = useMemo(
    () => [
      {
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        width: checkboxColumnWidth,
        minWidth: checkboxColumnWidth,
        maxWidth: checkboxColumnWidth,
        disableColumnMenu: true,
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 3,
        minWidth: columnMinWidths.name,
        disableColumnMenu: true,
        headerAlign: 'left',
        renderCell: (params) => {
          const { name, email, avatar } = params.row;
          return (
            <Stack
              direction="row"
              sx={{ gap: 1.5, alignItems: 'center', py: 1, minWidth: 0, width: 1 }}
            >
              <Avatar src={avatar} alt={name} sx={{ width: 24, height: 24, flexShrink: 0 }} />
              <Stack sx={{ gap: 0.5, minWidth: 0, overflow: 'hidden' }}>
                <Typography variant="subtitle2" noWrap sx={{ textOverflow: 'ellipsis' }}>
                  <Link href="#!">{name}</Link>
                </Typography>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    color: 'text.secondary',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {email}
                </Typography>
              </Stack>
            </Stack>
          );
        },
      },
      {
        field: 'designation',
        headerName: 'Designation',
        flex: 1,
        minWidth: columnMinWidths.designation,
        disableColumnMenu: true,
        headerAlign: 'left',
        renderCell: (params) => (
          <Typography
            variant="body2"
            noWrap
            sx={{ fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {params.row.designation}
          </Typography>
        ),
      },
      {
        field: 'lastActive',
        headerName: 'Last Active',
        flex: 1,
        minWidth: columnMinWidths.lastActive,
        disableColumnMenu: true,
        headerAlign: 'left',
        renderCell: (params) => (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              whiteSpace: 'nowrap',
            }}
          >
            {params.row.lastActive}
          </Typography>
        ),
      },
      {
        field: 'role',
        headerName: 'Role',
        flex: 1,
        minWidth: columnMinWidths.role,
        cellClassName: 'role-cell',
        disableColumnMenu: true,
        headerAlign: 'left',
        renderCell: (params) => {
          const memberId = String(params.row.id);
          return (
            <StyledTextField
              select
              size="small"
              value={roleByKey[memberId] || params.row.role}
              onChange={(e) => {
                setRoleByKey((prev) => ({
                  ...prev,
                  [memberId]: e.target.value as TeamMemberRole,
                }));
              }}
              onClick={(event) => event.stopPropagation()}
              sx={{ width: 1, minWidth: 0 }}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Moderator">Moderator</MenuItem>
              <MenuItem value="Member">Member</MenuItem>
            </StyledTextField>
          );
        },
      },
      {
        field: 'action',
        headerName: '',
        headerClassName: 'action-header',
        cellClassName: 'action-cell',
        disableColumnMenu: false,
        filterable: false,
        sortable: false,
        width: actionColumnWidth,
        minWidth: actionColumnWidth,
        maxWidth: actionColumnWidth,
        align: 'center',
        headerAlign: 'center',
        renderCell: () => <DashboardMenu icon={actionMenuIcon} />,
      },
    ],
    [roleByKey],
  );

  return (
    <Box
      sx={{
        width: 1,
        minWidth: 0,
        px: { xs: 3, md: 0 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DataGrid
        rowHeight={68}
        rows={data}
        columns={columns}
        disableColumnResize
        pageSizeOptions={[defaultPageSize, 15, 25]}
        rowSelectionModel={selectionModel}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: defaultPageSize,
            },
          },
        }}
        checkboxSelection
        disableRowSelectionExcludeModel
        getRowSpacing={getRowSpacing}
        onRowSelectionModelChange={onSelectionChange}
        disableColumnMenu={false}
        slots={{
          basePagination: (props) => <DataGridPagination showFullPagination {...props} />,
          columnMenu: CustomColumnMenu,
          columnMenuIcon: () => (
            <IconifyIcon icon="material-symbols:more-horiz" fontSize={18} color="neutral.main" />
          ),
        }}
        sx={{
          '--DataGrid-containerBackground': 'transparent',
          border: 'none',
          width: 1,
          [`& .${gridClasses['filler--horizontal']}`]: {
            backgroundColor: 'transparent',
            border: 'none',
          },
          [`& .${gridClasses.scrollbarFiller}`]: {
            display: 'none',
          },
          [`& .${gridClasses.columnHeaders} .${gridClasses.filler}`]: {
            backgroundColor: 'transparent',
            border: 'none',
          },
          [`& .${gridClasses.columnHeader}.action-header`]: {
            p: '0 !important',
            [`& .${gridClasses.columnHeaderDraggableContainer}`]: {
              justifyContent: 'center',
            },
            [`& .${gridClasses.columnHeaderTitleContainer}`]: {
              display: 'none',
            },
            [`& .${gridClasses.menuIcon}`]: {
              margin: 0,
              display: 'flex !important',
              justifyContent: 'center',
              alignItems: 'center',
            },
            [`& .${gridClasses.menuIconButton}`]: {
              opacity: '1 !important',
              visibility: 'visible !important',
            },
          },
          [`& .${gridClasses.cell}.action-cell`]: {
            p: '0 !important',
            justifyContent: 'center',
            overflow: 'visible',
          },
          [`& .${gridClasses.cell}.role-cell`]: {
            overflow: 'visible',
          },
          '& .MuiDataGrid-columnHeaders, .MuiDataGrid-columnHeader': {
            borderBottom: 'none',
            bgcolor: 'background.paper',
          },
          [`& .${gridClasses.columnHeaders}`]: {
            minWidth: 1,
          },
          [`& .${gridClasses.row}`]: {
            borderBottom: 'none',
            borderRadius: 4,
            bgcolor: 'background.elevation1',
            '&:hover': {
              backgroundColor: 'primary.lighter',
            },
          },
          '& .MuiDataGrid-row.Mui-selected': {
            bgcolor: 'primary.lighter',
            '&:hover': {
              bgcolor: 'primary.lighter',
            },
          },
          [`& .${gridClasses.columnHeader}`]: {
            px: 2,
          },
          [`& .${gridClasses.columnHeaderTitle}`]: {
            whiteSpace: 'nowrap',
          },
          [`& .${gridClasses.cell}.aurora-data-grid-cell`]: {
            px: 2,
          },
          [`& .${gridClasses.columnHeader} .${gridClasses.sortButton}`]: {
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },
          [`& .${gridClasses.sortIcon}`]: {
            width: 18,
            height: 18,
            fontSize: 18,
          },
          [`& .${gridClasses.columnHeader}:not(.${gridClasses['columnHeader--sorted']}):hover .${gridClasses.sortButton} > *`]:
            {
              opacity: 1,
            },
          '& .MuiDataGrid-virtualScroller': {
            bgcolor: 'transparent',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            borderTop: 'none',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            background: 'none !important',
          },
          [`& .${tablePaginationClasses.root}`]: {
            background: 'none !important',
          },
        }}
      />
    </Box>
  );
};

export default TeamMemberListTable;
