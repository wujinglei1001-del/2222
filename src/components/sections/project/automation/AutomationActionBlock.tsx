'use client';

import { Controller, FieldArrayWithId, useFormContext, useWatch } from 'react-hook-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, InputAdornment, Paper, Stack } from '@mui/material';
import { AutomationAction } from 'types/automations';
import IconifyIcon from 'components/base/IconifyIcon';
import ActionDropdown from './ActionDropdown';
import ActionFields from './ActionFields';
import BlockDivider from './shared/BlockDivider';

export interface AutomationFormValuesForActions {
  actions: AutomationAction[];
}

interface AutomationActionBlockProps {
  item: FieldArrayWithId<AutomationFormValuesForActions, 'actions', 'id'>;
  index: number;
  canRemove: boolean;
  onRemove: (index: number) => void;
  isLast: boolean;
  excludedTypes: AutomationAction['type'][];
  onTypeChange: (newType: AutomationAction['type']) => void;
}

const AutomationActionBlock = ({
  item,
  index,
  canRemove,
  onRemove,
  isLast,
  excludedTypes,
  onTypeChange,
}: AutomationActionBlockProps) => {
  const { control } = useFormContext<AutomationFormValuesForActions>();
  const isPrimary = index === 0;

  const actionType = useWatch({
    name: `actions.${index}.type`,
    control,
  }) as AutomationAction['type'];

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
    disabled: isPrimary,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        zIndex: 1,
        position: 'relative',
        transform: transform
          ? CSS.Transform.toString({ ...transform, scaleX: 1, scaleY: 1 })
          : undefined,
        transition,
      }}
      {...attributes}
    >
      <Paper background={1} sx={{ p: 3, borderRadius: 2, position: 'relative', outline: 'none' }}>
        <Stack sx={{ gap: 2 }}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
            <Stack direction="row" sx={{ alignItems: 'center', flex: 1, minWidth: 0 }}>
              {!isPrimary && (
                <InputAdornment position="start" {...listeners}>
                  <IconifyIcon
                    sx={{ cursor: 'grab', color: 'text.secondary', mr: 1 }}
                    icon="material-symbols-light:drag-indicator"
                    fontSize={20}
                  />
                </InputAdornment>
              )}

              <Controller
                control={control}
                name={`actions.${index}.type`}
                render={({ field }) => (
                  <ActionDropdown
                    value={field.value}
                    onChange={onTypeChange}
                    excludedTypes={excludedTypes}
                  />
                )}
              />
            </Stack>

            {canRemove && (
              <IconButton
                size="small"
                onClick={() => onRemove(index)}
                sx={{ color: 'text.secondary', flexShrink: 0, '&:hover': { color: 'error.main' } }}
              >
                <IconifyIcon icon="material-symbols:close-rounded" fontSize={20} />
              </IconButton>
            )}
          </Stack>

          <ActionFields index={index} type={actionType} />
        </Stack>
      </Paper>
      <BlockDivider isLast={isLast} />
    </Box>
  );
};

export default AutomationActionBlock;
