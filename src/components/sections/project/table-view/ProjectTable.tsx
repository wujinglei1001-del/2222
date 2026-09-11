'use client';

import { CSSProperties, Fragment, useMemo, useState } from 'react';
import type { DraggableAttributes } from '@dnd-kit/core';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import {
  ColumnDef,
  ExpandedState,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TableMeta, Task } from 'data/project/table-data';
import IconifyIcon from 'components/base/IconifyIcon';
import { StyledTable, StyledTableHead } from './StyledComponents';
import TableHeaderCell from './TableHeaderCell';
import { taskColumns } from './task-columns';
import useProjectTable from './useProjectTable';

interface ProjectTableProps {
  tableData: Task[];
}

interface DraggableRowProps {
  row: Row<Task>;
  isSelected: boolean;
}

interface TableRowCellsProps {
  row: Row<Task>;
  dragAttributes: DraggableAttributes;
  dragListeners: SyntheticListenerMap | undefined;
}

const isLeadingColumn = (columnId: string) =>
  columnId === 'drag-handle' ||
  columnId === 'select' ||
  columnId === 'expander' ||
  columnId === 'subtask-select';

const getBodyCellClassName = (columnId: string, isSubRow: boolean) => {
  const classNames: string[] = [];
  if (isLeadingColumn(columnId)) classNames.push('leading-icon-cell');
  if (isSubRow && columnId === 'name') classNames.push('subtask-name-cell');
  return classNames.length > 0 ? classNames.join(' ') : undefined;
};

const TableRowCells = ({ row, dragAttributes, dragListeners }: TableRowCellsProps) => {
  const isSubRow = row.depth > 0;

  return (
    <>
      {row
        .getVisibleCells()
        .filter((cell) => isSubRow || cell.column.id !== 'subtask-select')
        .map((cell) => {
          const columnId = cell.column.id;
          const columnSize = cell.column.columnDef.size;
          const isParentNameCell = !isSubRow && columnId === 'name';
          const isDragHandle =
            (!isSubRow && columnId === 'drag-handle') || (isSubRow && columnId === 'expander');
          const nameWidth = isParentNameCell ? 30 + (columnSize ?? 320) : columnSize;

          return (
            <TableCell
              key={cell.id}
              colSpan={isParentNameCell ? 2 : undefined}
              className={getBodyCellClassName(columnId, isSubRow)}
              sx={{
                minWidth: nameWidth,
                maxWidth: nameWidth,
                width: nameWidth,
                overflow: isDragHandle ? 'visible' : 'hidden',
                textOverflow: 'ellipsis',
              }}
              {...(isDragHandle ? { ...dragAttributes, ...dragListeners } : {})}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          );
        })}
    </>
  );
};

const DraggableRow = ({ row, isSelected }: DraggableRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  });

  const isSubRow = row.depth > 0;

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      selected={isSelected}
      sx={
        isSubRow
          ? (theme) => ({
              position: 'relative',
              '& td': {
                borderBottom: 'none',
                position: 'relative',
                zIndex: 1,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                left: theme.spacing(7.5 * row.depth),
                right: 0,
                bottom: 0,
                zIndex: 0,
                borderBottom: `1px solid ${theme.vars.palette.dividerLight}`,
                pointerEvents: 'none',
              },
            })
          : undefined
      }
    >
      <TableRowCells row={row} dragAttributes={attributes} dragListeners={listeners} />
    </TableRow>
  );
};

const ProjectTable = ({ tableData }: ProjectTableProps) => {
  const {
    data,
    editingRowId,
    editingDraft,
    patchEditingDraft,
    startEdit,
    saveEdit,
    cancelEdit,
    deleteRow,
    addNewTask,
    addNewSubtask,
    reorderTasks,
    reorderSubtasks,
  } = useProjectTable(tableData);

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const tableMeta = useMemo<TableMeta>(
    () => ({
      editingRowId,
      editingDraft,
      patchEditingDraft,
      startEdit,
      saveEdit,
      cancelEdit,
      deleteRow,
      addNewSubtask,
    }),
    [
      editingRowId,
      editingDraft,
      patchEditingDraft,
      startEdit,
      saveEdit,
      cancelEdit,
      deleteRow,
      addNewSubtask,
    ],
  );

  const columns = useMemo<ColumnDef<Task>[]>(() => taskColumns, []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    meta: tableMeta,
    state: { sorting, rowSelection, expanded },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    getRowCanExpand: (row) => Boolean(row.original.subTasks),
    getSubRows: (row) => row.subTasks,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const [activeRow, overRow] = [
      table.getRowModel().rows.find((row) => row.id === active.id),
      table.getRowModel().rows.find((row) => row.id === over.id),
    ];

    if (!activeRow || !overRow) return;

    if (activeRow.depth !== overRow.depth) return;

    if (activeRow.depth === 0) {
      const oldIndex = data.findIndex((task) => task.id === activeRow.original.id);
      const newIndex = data.findIndex((task) => task.id === overRow.original.id);

      if (oldIndex !== -1 && newIndex !== -1) reorderTasks(arrayMove(data, oldIndex, newIndex));
    } else {
      const parentRow = activeRow.getParentRow();
      if (parentRow && parentRow.original.subTasks) {
        const oldIndex = parentRow.original.subTasks.findIndex(
          (task) => task.id === activeRow.original.id,
        );
        const newIndex = parentRow.original.subTasks.findIndex(
          (task) => task.id === overRow.original.id,
        );
        if (oldIndex !== -1 && newIndex !== -1) {
          const newSubtasks = arrayMove(parentRow.original.subTasks, oldIndex, newIndex);
          reorderSubtasks(parentRow.original.id!, newSubtasks);
        }
      }
    }
  };

  const renderRows = (rows: Row<Task>[]) => {
    const groupedRows: { [key: string]: Row<Task>[] } = { root: [] };

    rows.forEach((row) => {
      if (row.depth === 0) {
        groupedRows.root.push(row);
      } else {
        const parentId = row.getParentRow()?.id || 'root';
        if (!groupedRows[parentId]) {
          groupedRows[parentId] = [];
        }
        groupedRows[parentId].push(row);
      }
    });

    const renderRowGroup = (rowGroup: Row<Task>[]) => {
      const items = rowGroup.map((row) => row.id);

      return (
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {rowGroup.map((row) => (
            <Fragment key={row.id}>
              <DraggableRow row={row} isSelected={row.getIsSelected()} />
              {row.getIsExpanded() && row.getCanExpand() && (
                <>
                  {groupedRows[row.id] && renderRowGroup(groupedRows[row.id])}
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <Button
                        size="small"
                        color="neutral"
                        onClick={() => addNewSubtask(row.original.id!)}
                        sx={{ ml: 15, gap: 1 }}
                      >
                        <IconifyIcon icon="material-symbols:add" sx={{ fontSize: 16 }} />
                        <Typography variant="body2">Add new subtask</Typography>
                      </Button>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </Fragment>
          ))}
        </SortableContext>
      );
    };

    return renderRowGroup(groupedRows.root);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <TableContainer>
        <StyledTable>
          <StyledTableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeaderCell
                    key={header.id}
                    header={header}
                    className={isLeadingColumn(header.column.id) ? 'leading-icon-cell' : undefined}
                  />
                ))}
              </TableRow>
            ))}
          </StyledTableHead>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              <>
                {renderRows(table.getRowModel().rows)}
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Button
                      size="small"
                      color="neutral"
                      onClick={addNewTask}
                      sx={{ ml: 11.25, gap: 1 }}
                    >
                      <IconifyIcon icon="material-symbols:add" sx={{ fontSize: 16 }} />
                      <Typography variant="body2">Add New Task</Typography>
                    </Button>
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </DndContext>
  );
};

export default ProjectTable;
