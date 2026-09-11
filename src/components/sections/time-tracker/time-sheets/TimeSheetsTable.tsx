import { useEffect, useMemo, useRef } from 'react';
import type { RefObject } from '@fullcalendar/core/preact.js';
import { Box } from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridRowSelectionModel,
  gridClasses,
} from '@mui/x-data-grid';
import type { GridApiCommunity } from '@mui/x-data-grid/internals';
import type { TimeSheet } from 'data/time-tracker/time-sheets';
import dayjs from 'dayjs';
import DataGridPagination from 'components/pagination/DataGridPagination';
import type { TabType } from '.';
import { getTimeSheetsColumns } from './getTimeSheetsColumns';

const defaultPageSize = 7;

interface TimeSheetsTableProps {
  apiRef: RefObject<GridApiCommunity | null>;
  tab: TabType;
  rows: TimeSheet[];
  selectionModel: GridRowSelectionModel;
  onSelectionChange?: (model: GridRowSelectionModel) => void;
}

const TimeSheetsTable = ({
  apiRef,
  tab,
  rows,
  selectionModel,
  onSelectionChange,
}: TimeSheetsTableProps) => {
  const now = dayjs();
  const timersRef = useRef<
    Record<
      string,
      {
        isRunning: boolean;
        startTime: number | null;
        duration: number;
      }
    >
  >({});

  const updateRow = (id: string) => {
    const timer = timersRef.current[id];
    const row = apiRef.current?.getRow(id);

    if (!row) return;

    let duration = timer?.duration || row.duration;

    if (timer?.isRunning) {
      const live = Math.floor((Date.now() - timer.startTime!) / 1000);
      duration = timer.duration + live;
    }

    const start = timer?.startTime
      ? dayjs(timer.startTime).format('h:mm a')
      : row.time?.start || '--:--';

    const end =
      !timer?.isRunning && timer?.startTime
        ? dayjs(timer.startTime + duration * 1000).format('h:mm a')
        : '--:--';

    apiRef.current?.updateRows([
      {
        id,
        duration,
        time: {
          start,
          end,
        },
      },
    ]);
  };

  const handleToggleTimer = (id: string) => {
    const timers = timersRef.current;
    const current = timers[id];

    if (!current || !current.isRunning) {
      // START
      timers[id] = {
        isRunning: true,
        startTime: Date.now(),
        duration: 0,
      };
    } else {
      // STOP
      const elapsed = Math.floor((Date.now() - current.startTime!) / 1000);

      timers[id] = {
        isRunning: false,
        startTime: current.startTime,
        duration: current.duration + elapsed,
      };
    }

    updateRow(id);
  };

  const columns: GridColDef<TimeSheet>[] = useMemo(
    () =>
      getTimeSheetsColumns({
        tab,
        now,
        timersRef,
        handleToggleTimer,
      }),
    [tab, now],
  );

  const columnVisibilityModel = useMemo(() => {
    switch (tab) {
      case 'daily':
        return {
          activity: true,
          idle: true,
          manual: true,
          time: true,
          duration: true,
          'time-track': true,
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          total: false,
          january: false,
          february: false,
          march: false,
          april: false,
          may: false,
          june: false,
          july: false,
          august: false,
          september: false,
          october: false,
          november: false,
          december: false,
        };
      case 'weekly':
        return {
          activity: false,
          idle: false,
          manual: false,
          time: false,
          duration: false,
          'time-track': false,
          sunday: true,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          total: true,
          january: false,
          february: false,
          march: false,
          april: false,
          may: false,
          june: false,
          july: false,
          august: false,
          september: false,
          october: false,
          november: false,
          december: false,
        };
      case 'monthly':
        return {
          activity: false,
          idle: false,
          manual: false,
          time: false,
          duration: false,
          'time-track': false,
          sunday: false,
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          total: true,
          january: true,
          february: true,
          march: true,
          april: true,
          may: true,
          june: true,
          july: true,
          august: true,
          september: true,
          october: true,
          november: true,
          december: true,
        };
    }
  }, [tab]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timers = timersRef.current;

      Object.keys(timers).forEach((id) => {
        if (timers[id].isRunning) updateRow(id);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: 1 }}>
      <DataGrid
        rowHeight={64}
        rows={rows}
        apiRef={apiRef}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        pageSizeOptions={[defaultPageSize]}
        rowSelectionModel={selectionModel}
        initialState={{ pagination: { paginationModel: { pageSize: defaultPageSize } } }}
        checkboxSelection
        onRowSelectionModelChange={onSelectionChange}
        slots={{
          basePagination: (props) => <DataGridPagination showFullPagination {...props} />,
        }}
        sx={({ spacing }) => ({
          [`& .${gridClasses.columnHeaders}`]: {
            minWidth: 1,
            [`& .${gridClasses.columnHeader}`]: {
              '&:not(.action-header)': { p: `0 ${spacing(1.25)}` },
              '&.action-header': { pl: spacing(1.25) },
            },
          },
          [`& .${gridClasses.row}`]: {
            [`& .${gridClasses.cell}`]: {
              '&.aurora-data-grid-cell': {
                '&:not(.action-cell)': { p: `0 ${spacing(1.25)}` },
                '&.action-cell': { pl: spacing(1.25) },
              },
            },
          },
        })}
      />
    </Box>
  );
};

export default TimeSheetsTable;
