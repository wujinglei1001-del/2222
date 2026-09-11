'use client';

import { type SyntheticEvent, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { type GridRowSelectionModel, useGridApiRef } from '@mui/x-data-grid';
import { timeSheets } from 'data/time-tracker/time-sheets';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import DataGridSelectionBar from 'components/common/DataGridSelectionBar';
import TimeSheetsTableHeader from './TableHeader';
import TimeSheetsTable from './TimeSheetsTable';

export type TabType = 'daily' | 'weekly' | 'monthly';

const getRowSelectionCount = (
  selectionModel: GridRowSelectionModel,
  totalRowCount: number,
): number => {
  if (selectionModel.type === 'include') {
    return selectionModel.ids.size;
  }

  return Math.max(0, totalRowCount - selectionModel.ids.size);
};

const TimeSheetsTableContainer = () => {
  const { only } = useBreakpoints();
  const [tab, setTab] = useState<TabType>('daily');
  const apiRef = useGridApiRef();
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: 'include',
    ids: new Set(),
  });

  const onlyXs = only('xs');

  const handleChange = (_: SyntheticEvent, newValue: TabType) => setTab(newValue);

  const handleSelectionChange = (newModel: GridRowSelectionModel) => {
    setSelectionModel(newModel);
  };

  const handleClearSelection = () => {
    setSelectionModel({
      type: 'include',
      ids: new Set(),
    });
  };

  const selectedCount = getRowSelectionCount(selectionModel, timeSheets.length);

  return (
    <Stack sx={{ gap: 3 }}>
      <TimeSheetsTableHeader tab={tab} handleChange={handleChange} />
      <Box>
        <TimeSheetsTable
          apiRef={apiRef}
          tab={tab}
          rows={timeSheets}
          selectionModel={selectionModel}
          onSelectionChange={handleSelectionChange}
        />
        <DataGridSelectionBar
          selectedCount={selectedCount}
          customLabel={
            <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
              <strong>{selectedCount}</strong> of <strong>{timeSheets.length}</strong> selected
            </Typography>
          }
        >
          <Stack direction="row" sx={{ gap: 0.5 }}>
            <Button
              shape={onlyXs ? 'square' : undefined}
              size="small"
              color="neutral"
              sx={{ gap: 1 }}
            >
              <IconifyIcon icon="material-symbols:edit-outline" sx={{ fontSize: 18 }} />
              {!onlyXs && (
                <Typography variant="button" sx={{ fontWeight: 600 }}>
                  Edit
                </Typography>
              )}
            </Button>
            <Button
              shape={onlyXs ? 'square' : undefined}
              size="small"
              color="neutral"
              sx={{ gap: 1 }}
            >
              <IconifyIcon icon="material-symbols:ios-share-rounded" sx={{ fontSize: 18 }} />
              {!onlyXs && (
                <Typography variant="button" sx={{ fontWeight: 600 }}>
                  Export
                </Typography>
              )}
            </Button>
            <Button
              shape={onlyXs ? 'square' : undefined}
              size="small"
              color="error"
              onClick={handleClearSelection}
              sx={{ gap: 1 }}
            >
              <IconifyIcon icon="material-symbols:delete-outline" sx={{ fontSize: 18 }} />
              {!onlyXs && (
                <Typography variant="button" sx={{ fontWeight: 600 }}>
                  Delete
                </Typography>
              )}
            </Button>
          </Stack>
        </DataGridSelectionBar>
      </Box>
    </Stack>
  );
};

export default TimeSheetsTableContainer;
