'use client';

import { useCallback, useEffect, useState } from 'react';
import { Task } from 'data/project/table-data';
import dayjs from 'dayjs';

type UseProjectTableReturn = {
  data: Task[];
  editingRowId: string | null;
  editingDraft: Partial<Task>;
  patchEditingDraft: (patch: Partial<Task>) => void;
  startEdit: (rowId: string) => void;
  saveEdit: (rowId: string) => void;
  cancelEdit: () => void;
  deleteRow: (rowId: string) => void;
  addNewTask: () => void;
  addNewSubtask: (parentId: string) => void;
  reorderTasks: (newOrder: Task[]) => void;
  reorderSubtasks: (parentId: string, newSubtasks: Task[]) => void;
};

const useProjectTable = (tableData: Task[]): UseProjectTableReturn => {
  const [data, setData] = useState<Task[]>(tableData);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<Partial<Task>>({});
  const [pendingEditId, setPendingEditId] = useState<string | null>(null);

  const patchEditingDraft = useCallback((patch: Partial<Task>) => {
    setEditingDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const startEdit = useCallback(
    (rowId: string) => {
      const row = findRowById(data, rowId);
      if (!row) return;
      setEditingRowId(rowId);
      setEditingDraft({ ...row });
    },
    [data],
  );

  const saveEdit = useCallback(
    (rowId: string) => {
      if (editingRowId !== rowId) return;

      if (!editingDraft || Object.keys(editingDraft).length === 0) {
        setEditingRowId(null);
        setEditingDraft({});
        return;
      }

      setData((currentData) =>
        replaceRowById(currentData, rowId, (existing) => ({ ...existing, ...editingDraft })),
      );
      setEditingRowId(null);
      setEditingDraft({});
    },
    [editingDraft, editingRowId],
  );

  const cancelEdit = useCallback(() => {
    setEditingRowId(null);
    setEditingDraft({});
  }, []);

  const deleteRow = useCallback(
    (rowId: string) => {
      setData((currentData) => deleteRowById(currentData, rowId));
      if (editingRowId === rowId) {
        setEditingRowId(null);
        setEditingDraft({});
      }
    },
    [editingRowId],
  );

  const addNewTask = useCallback(() => {
    setData((prev) => {
      const newId = (parseInt(prev[prev.length - 1].id) + 1).toString();
      const newTask: Task = {
        id: newId,
        name: 'Name of the Task',
        collaborator: [],
        status: 'Running',
        label: 'Issue',
        priority: 'Medium',
        dependingOn: 'Depending on...',
        startDate: dayjs().format('YYYY-MM-DD'),
        dueDate: dayjs().format('YYYY-MM-DD'),
      };
      setPendingEditId(newId);
      return [...prev, newTask];
    });
  }, []);

  const addNewSubtask = useCallback((parentId: string) => {
    setData((prev) => {
      const subTaskList = prev.find((task) => task.id === parentId)?.subTasks || [];
      const newId = (parseFloat(subTaskList[subTaskList.length - 1].id) + 0.1).toString();
      const newSubtask: Task = {
        id: newId,
        name: 'Name of the Subtask',
        collaborator: [],
        status: 'Running',
        label: 'Issue',
        priority: 'Medium',
        dependingOn: 'Depending on...',
        startDate: dayjs().format('YYYY-MM-DD'),
        dueDate: dayjs().format('YYYY-MM-DD'),
      };
      setPendingEditId(newId);
      return replaceRowById(prev, parentId, (parent) => ({
        ...parent,
        subTasks: [...(parent.subTasks || []), newSubtask],
      }));
    });
  }, []);

  const reorderTasks = useCallback((newOrder: Task[]) => setData(newOrder), []);

  const reorderSubtasks = useCallback((parentId: string, newSubtasks: Task[]) => {
    setData((prev) =>
      replaceRowById(prev, parentId, (parent) => ({
        ...parent,
        subTasks: newSubtasks,
      })),
    );
  }, []);

  useEffect(() => {
    if (pendingEditId) {
      const row = findRowById(data, pendingEditId);
      if (row) {
        startEdit(pendingEditId);
        setPendingEditId(null);
      }
    }
  }, [data, pendingEditId, startEdit]);

  return {
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
  };
};

export default useProjectTable;

const findRowById = (rows: Task[], id: string): Task | undefined => {
  for (const row of rows) {
    if (row.id === id) return row;
    if (row.subTasks?.length) {
      const found = findRowById(row.subTasks, id);
      if (found) return found;
    }
  }
  return undefined;
};

const replaceRowById = (rows: Task[], id: string, updater: (row: Task) => Task): Task[] => {
  return rows.map((row) => {
    if (row.id === id) return updater(row);
    if (row.subTasks?.length) {
      return { ...row, subTasks: replaceRowById(row.subTasks, id, updater) };
    }
    return row;
  });
};

const deleteRowById = (rows: Task[], id: string): Task[] => {
  const out: Task[] = [];
  for (const row of rows) {
    if (row.id === id) continue;
    if (row.subTasks?.length) {
      out.push({ ...row, subTasks: deleteRowById(row.subTasks, id) });
    } else {
      out.push(row);
    }
  }
  return out;
};
