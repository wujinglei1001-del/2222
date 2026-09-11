'use client';

import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { DragEndEvent } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import SortableDnd from 'components/base/SortableDnd';
import ColorPicker from 'components/base/color-picker/ColorPicker';
import type { CreateProjectFormValues } from 'components/sections/project/create-project/useCreateProjectStepper';
import StyledTextField from 'components/styled/StyledTextField';

type StatusGroupKey = 'incomplete' | 'active' | 'completed';

interface StatusRowProps {
  id: string;
  group: StatusGroupKey;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
  colorPickerId: string;
}

const StatusRow = ({ id, group, index, onRemove, canRemove, colorPickerId }: StatusRowProps) => {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<CreateProjectFormValues>();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const draggingStyle = isDragging ? { opacity: 0.4 } : {};
  const groupErrors = errors.statuses?.[group];

  return (
    <Stack
      ref={setNodeRef}
      direction="row"
      sx={{
        alignItems: 'center',
        gap: 1,
        transform: CSS.Translate.toString(transform),
        transition,
        ...draggingStyle,
      }}
    >
      <Button
        variant="text"
        color="neutral"
        shape="square"
        {...attributes}
        {...listeners}
        sx={{ cursor: 'grab', minWidth: 36 }}
      >
        <IconifyIcon icon="material-symbols:drag-indicator" fontSize={20} />
      </Button>

      <StyledTextField
        fullWidth
        placeholder="Pending"
        error={Boolean(groupErrors?.[index]?.label)}
        helperText={groupErrors?.[index]?.label?.message}
        {...register(`statuses.${group}.${index}.label`)}
      />

      <Controller
        name={`statuses.${group}.${index}.color`}
        control={control}
        render={({ field }) => (
          <ColorPicker id={colorPickerId} value={field.value} onChange={field.onChange} />
        )}
      />

      <IconButton
        aria-label="Remove status"
        disabled={!canRemove}
        onClick={onRemove}
        sx={{ color: 'text.primary' }}
      >
        <IconifyIcon icon="material-symbols:close-rounded" fontSize={20} />
      </IconButton>
    </Stack>
  );
};

interface StatusGroupProps {
  title: string;
  group: StatusGroupKey;
}

const StatusGroup = ({ title, group }: StatusGroupProps) => {
  const { control } = useFormContext<CreateProjectFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `statuses.${group}`,
  });

  const handleDragEnd = (oldIndex: number, newIndex: number, _event: DragEndEvent) => {
    move(oldIndex, newIndex);
  };

  return (
    <div>
      <Typography
        variant="overline"
        sx={{
          color: 'text.secondary',
        }}
      >
        {title}
      </Typography>
      <Stack sx={{ gap: 1.5, mt: 1 }}>
        <SortableDnd items={fields} handleDragEnd={handleDragEnd}>
          {fields.map((field, index) => (
            <StatusRow
              key={field.id}
              id={field.id}
              group={group}
              index={index}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
              colorPickerId={`status-${group}-${index}`}
            />
          ))}
        </SortableDnd>

        <Button
          variant="text"
          color="primary"
          sx={{ alignSelf: 'flex-start' }}
          startIcon={<IconifyIcon icon="material-symbols:add-rounded" fontSize={20} />}
          onClick={() => append({ label: '', color: '#E0E0E0' })}
        >
          Add another
        </Button>
      </Stack>
    </div>
  );
};

const Status = () => {
  useFormContext<CreateProjectFormValues>();

  return (
    <Stack sx={{ gap: 2.5 }}>
      <StatusGroup title="INCOMPLETE" group="incomplete" />
      <StatusGroup title="ACTIVE" group="active" />
      <StatusGroup title="COMPLETED" group="completed" />
    </Stack>
  );
};

export default Status;
