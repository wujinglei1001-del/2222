'use client';

// hooks/useRowDragDrop.ts
import { useEffect, useRef } from 'react';

type DropPosition = 'before' | 'after';

interface UseRowDragDropOptions {
  // note: third arg is position ('before' | 'after')
  onRowReorder?: (
    draggedId: number | string,
    targetId: number | string,
    position: DropPosition,
  ) => void;
  enabled?: boolean;
}

export const useRowDragDrop = ({ onRowReorder, enabled = true }: UseRowDragDropOptions) => {
  const draggedRowRef = useRef<HTMLElement | null>(null);
  const draggedRowIdRef = useRef<number | string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const getDropPosition = (e: DragEvent, row: HTMLElement): DropPosition => {
      const rect = row.getBoundingClientRect();
      const clientY = (e as DragEvent).clientY ?? (e as any).pageY ?? 0;
      const offsetY = clientY - rect.top;
      return offsetY > rect.height / 2 ? 'after' : 'before';
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      const row = target?.closest('.sg-table-row') as HTMLElement | null;
      if (!row) return;

      const isDraggable = row.classList.contains('sg-table-row-level-1');
      if (!isDraggable) return;

      draggedRowRef.current = row;

      const rowId = row.getAttribute('data-row-id');
      if (rowId) {
        draggedRowIdRef.current = parseInt(rowId, 10);
      } else {
        const rowText = row.textContent?.trim();
        if (rowText) draggedRowIdRef.current = rowText;
      }

      row.classList.add('dragging');

      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        // some browsers require some text to be set
        e.dataTransfer.setData('text/plain', '');
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';

      const target = e.target as HTMLElement | null;
      const row = target?.closest('.sg-table-row') as HTMLElement | null;
      if (!row || row === draggedRowRef.current) return;
      if (!row.classList.contains('sg-table-row-level-1')) return;

      // compute before/after and set classes for visual feedback
      const pos = getDropPosition(e, row);

      // clear previous indicators
      row.classList.remove('drag-over', 'drag-over-before', 'drag-over-after');

      // always keep original compatibility class
      row.classList.add('drag-over');

      if (pos === 'after') row.classList.add('drag-over-after');
      else row.classList.add('drag-over-before');
    };

    const handleDragLeave = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      const row = target?.closest('.sg-table-row') as HTMLElement | null;
      if (!row) return;
      row.classList.remove('drag-over', 'drag-over-before', 'drag-over-after');
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();

      const target = e.target as HTMLElement | null;
      const targetRow = target?.closest('.sg-table-row') as HTMLElement | null;

      if (!targetRow || !draggedRowRef.current) return;
      if (!targetRow.classList.contains('sg-table-row-level-1')) return;
      if (!draggedRowIdRef.current) return;

      const pos = getDropPosition(e, targetRow);

      const targetRowId = targetRow.getAttribute('data-row-id');
      const targetRowText = targetRow.textContent?.trim();

      const targetId: number | string = targetRowId
        ? parseInt(targetRowId, 10)
        : (targetRowText as any);
      const draggedId: number | string =
        typeof draggedRowIdRef.current === 'number'
          ? draggedRowIdRef.current
          : (draggedRowIdRef.current as any);

      if (onRowReorder && draggedId !== targetId) {
        onRowReorder(draggedId, targetId, pos);
      }

      // cleanup visuals + refs
      targetRow.classList.remove('drag-over', 'drag-over-before', 'drag-over-after');
      draggedRowRef.current.classList.remove('dragging');
      draggedRowRef.current = null;
      draggedRowIdRef.current = null;
    };

    const handleDragEnd = () => {
      document.querySelectorAll('.sg-table-row').forEach((row) => {
        row.classList.remove('dragging', 'drag-over', 'drag-over-before', 'drag-over-after');
      });
      draggedRowRef.current = null;
      draggedRowIdRef.current = null;
    };

    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('dragend', handleDragEnd);

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('dragend', handleDragEnd);
    };
  }, [enabled, onRowReorder]);

  return {
    makeRowDraggable: (rowElement: HTMLElement, rowId: number) => {
      rowElement.setAttribute('draggable', 'true');
      rowElement.setAttribute('data-row-id', rowId.toString());
      rowElement.classList.add('draggable-row');
    },
  };
};
