'use client';

import { useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  ChipOwnProps,
  Stack,
  Typography,
  avatarClasses,
  tablePaginationClasses,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { gridClasses } from '@mui/x-data-grid/constants';
import { ProjectListItem, projectListData } from 'data/project/project-list';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import DashboardMenu from 'components/common/DashboardMenu';
import DataGridPagination from 'components/pagination/DataGridPagination';

const getStatusBadgeColor = (status: string): ChipOwnProps['color'] => {
  switch (status) {
    case 'Doing':
      return 'primary';
    case 'Done':
      return 'success';
    case 'To do':
      return 'neutral';
    default:
      return 'neutral';
  }
};

const columns: GridColDef<ProjectListItem>[] = [
  {
    field: 'name',
    headerName: 'Name of project',
    minWidth: 280,
    flex: 1,
    headerAlign: 'left',
    renderCell: (params) => (
      <Stack
        direction="row"
        sx={{
          gap: 2,
          alignItems: 'center',
          minWidth: 0,
          width: 1,
        }}
      >
        <IconifyIcon
          icon="material-symbols:star-rounded"
          color="warning.main"
          sx={{ fontSize: 16, flexShrink: 0 }}
        />
        <Image
          src={params.row.thumbnail}
          alt={params.row.name}
          width={64}
          height={40}
          sx={{
            borderRadius: 1,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
          }}
        >
          {params.row.name}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'tasks',
    headerName: 'Tasks',
    width: 100,
    align: 'left',
    headerAlign: 'left',
    sortComparator: (_v1, _v2, param1, param2) => {
      const completed1 = param1.api.getRow(param1.id)?.tasks.completed || 0;
      const total1 = param1.api.getRow(param1.id)?.tasks.total || 0;
      const completed2 = param2.api.getRow(param2.id)?.tasks.completed || 0;
      const total2 = param2.api.getRow(param2.id)?.tasks.total || 0;

      const ratio1 = total1 > 0 ? completed1 / total1 : 0;
      const ratio2 = total2 > 0 ? completed2 / total2 : 0;

      return ratio1 - ratio2;
    },
    renderCell: (params) => (
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: 'center',
        }}
      >
        <IconifyIcon
          icon="material-symbols:check-box-outline"
          sx={{ fontSize: 16, color: 'text.secondary' }}
        />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.row.tasks.completed}/{params.row.tasks.total}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'comments',
    headerName: 'Comments',
    width: 140,
    align: 'left',
    headerAlign: 'left',
    renderCell: (params) => (
      <Stack
        direction="row"
        sx={{
          gap: 0.5,
          alignItems: 'center',
        }}
      >
        <IconifyIcon
          icon="material-symbols:comment-outline-rounded"
          sx={{ fontSize: 16, color: 'text.secondary' }}
        />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.row.comments}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 110,
    align: 'left',
    headerAlign: 'left',
    renderCell: (params) => (
      <Chip
        label={params.row.status}
        variant="soft"
        color={getStatusBadgeColor(params.row.status)}
        sx={{
          textTransform: 'capitalize',
          fontWeight: 500,
        }}
      />
    ),
  },
  {
    field: 'collaborators',
    headerName: 'Collaborators',
    width: 180,
    align: 'left',
    headerAlign: 'left',
    sortComparator: (v1, v2, param1, param2) => {
      const collaborators1 = param1.api.getRow(param1.id)?.collaborators || [];
      const collaborators2 = param2.api.getRow(param2.id)?.collaborators || [];

      return collaborators1.length - collaborators2.length;
    },
    renderCell: (params) => (
      <AvatarGroup
        max={4}
        sx={{
          [`& .${avatarClasses.root}`]: {
            width: 24,
            height: 24,
            fontSize: 12,
          },
        }}
      >
        {params.row.collaborators.map((collaborator, index) => (
          <Avatar key={index} alt={collaborator.name} src={collaborator.avatar} />
        ))}
      </AvatarGroup>
    ),
  },
  {
    field: 'lastOpened',
    headerName: 'Last opened',
    width: 150,
    align: 'left',
    headerAlign: 'left',
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
        }}
      >
        {params.row.lastOpened}
      </Typography>
    ),
  },
  {
    field: 'action',
    headerName: '',
    filterable: false,
    sortable: false,
    width: 60,
    align: 'right',
    headerAlign: 'left',
    renderCell: () => (
      <DashboardMenu
        icon={<IconifyIcon icon="material-symbols:more-horiz" fontSize={18} color="neutral.main" />}
      />
    ),
  },
];

const defaultPageSize = 10;

type ProjectListTableProps = {
  onItemClick?: (projectId: number | string) => void;
};

const ProjectListTable = ({ onItemClick }: ProjectListTableProps) => {
  const [selectedRowId, setSelectedRowId] = useState<(string | number)[]>([
    projectListData[0]?.id || '',
  ]);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedRowId([params.id]);
    if (onItemClick) onItemClick(params.id);
  };

  const getRowClassName = (params: GridRowParams) => {
    return selectedRowId.includes(params.id) ? 'selected-row' : '';
  };

  return (
    <Box sx={{ width: 1, px: { xs: 1, md: 4 }, py: 3 }}>
      <DataGrid
        rowHeight={72}
        rows={projectListData}
        columns={columns}
        pageSizeOptions={[defaultPageSize, 15, 25]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: defaultPageSize,
            },
          },
        }}
        slots={{
          basePagination: (props) => <DataGridPagination showFullPagination {...props} />,
        }}
        onRowClick={handleRowClick}
        getRowClassName={getRowClassName}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders, .MuiDataGrid-columnHeader': {
            borderBottom: 'none',
            bgcolor: 'background.paper',
          },
          [`& .${gridClasses.columnHeaderTitleContainer}`]: {
            overflow: 'hidden',
            minWidth: 0,
          },
          [`& .${gridClasses.columnHeaderTitleContainerContent}`]: {
            overflow: 'hidden',
            minWidth: 0,
            flex: '0 1 auto',
          },
          [`& .${gridClasses.columnHeader}[data-field='name'] .${gridClasses.columnHeaderTitleContainer}`]:
            {
              flex: '0 1 auto',
            },
          [`& .${gridClasses.columnHeaderTitle}`]: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          [`& .${gridClasses.columnHeader}:not([data-field='name']) .${gridClasses.columnHeaderTitle}`]:
            {
              overflow: 'visible',
              textOverflow: 'clip',
            },
          [`& .${gridClasses.columnHeader}`]: {
            px: 2,
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
          '& .MuiDataGrid-row': {
            borderBottom: 'none',
            cursor: 'pointer',
            borderRadius: 4,

            '&:hover': {
              backgroundColor: 'background.elevation1',
            },
            '&.selected-row': {
              borderRadius: 4,
              backgroundColor: 'background.elevation1',
              '&:hover': {
                backgroundColor: 'background.elevation1',
              },
            },
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
            borderTop: 'none',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            background: 'none',
          },
          [`& .${tablePaginationClasses.root}`]: {
            bgcolor: 'background.paper',
            outline: 'none',
            boxShadow: 'none',
          },
        }}
      />
    </Box>
  );
};

export default ProjectListTable;
