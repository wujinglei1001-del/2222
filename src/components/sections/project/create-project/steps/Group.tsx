'use client';

import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, IconButton, Stack } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import SortableDnd from 'components/base/SortableDnd';
import ColorPicker from 'components/base/color-picker/ColorPicker';
import type { CreateProjectFormValues } from 'components/sections/project/create-project/useCreateProjectStepper';
import StyledTextField from 'components/styled/StyledTextField';

interface GroupRowProps {
  id: string;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

const GroupRow = ({ id, index, onRemove, canRemove }: GroupRowProps) => {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<CreateProjectFormValues>();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const draggingStyle = isDragging ? { opacity: 0.4 } : {};

  return (
    <Stack
      ref={setNodeRef}
      direction="row"
      sx={{
        gap: 1,
        alignItems: 'center',
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
        placeholder="Group name"
        error={Boolean(errors.groups?.[index]?.label)}
        helperText={errors.groups?.[index]?.label?.message}
        {...register(`groups.${index}.label`)}
      />
      <Controller
        name={`groups.${index}.color`}
        control={control}
        render={({ field }) => (
          <ColorPicker id={`group-color-${index}`} value={field.value} onChange={field.onChange} />
        )}
      />
      <IconButton
        aria-label="Remove group"
        disabled={!canRemove}
        onClick={onRemove}
        sx={{ color: 'text.primary' }}
      >
        <IconifyIcon icon="material-symbols:close-rounded" fontSize={20} />
      </IconButton>
    </Stack>
  );
};

const Group = () => {
  const { control } = useFormContext<CreateProjectFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'groups',
  });

  return (
    <Stack sx={{ gap: 1.5 }}>
      <SortableDnd
        items={fields}
        handleDragEnd={(oldIndex, newIndex) => {
          move(oldIndex, newIndex);
        }}
      >
        {fields.map((field, index) => (
          <GroupRow
            key={field.id}
            id={field.id}
            index={index}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
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
  );
};

export default Group;
