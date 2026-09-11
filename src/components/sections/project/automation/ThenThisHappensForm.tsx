'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, Stack, Typography } from '@mui/material';
import { AutomationAction } from 'types/automations';
import IconifyIcon from 'components/base/IconifyIcon';
import SortableDnd from 'components/base/SortableDnd';
import AutomationActionBlock, { AutomationFormValuesForActions } from './AutomationActionBlock';
import { buildActionForType } from './common/builders';
import { ACTION_TYPE_OPTIONS } from './common/constants';
import { getUnusedOptions } from './common/helpers';

const ThenThisHappensForm = () => {
  const { control, getValues } = useFormContext<AutomationFormValuesForActions>();

  const { fields, append, remove, move, update } = useFieldArray({
    name: 'actions',
    control,
  });

  const usedTypes = fields.map((action) => action.type);
  const unusedOptions = getUnusedOptions(
    ACTION_TYPE_OPTIONS,
    usedTypes,
    undefined,
    (option) => option.value,
  );

  const handleActionTypeChange = (index: number, newType: AutomationAction['type']) => {
    update(index, buildActionForType(getValues(`actions.${index}`), newType));
  };

  return (
    <Stack sx={{ gap: 3, maxWidth: 375, width: '100%' }}>
      <Typography
        variant="h6"
        sx={{ color: 'text.secondary', fontWeight: 600, textAlign: 'center' }}
      >
        Then this will happen afterwards
      </Typography>
      <SortableDnd
        items={fields}
        handleDragEnd={(oldIndex, newIndex) => {
          if (oldIndex === 0 || newIndex === 0) return;
          move(oldIndex, newIndex);
        }}
      >
        <Stack sx={{ gap: 2, position: 'relative' }}>
          {fields.map((item, index) => (
            <AutomationActionBlock
              key={item.id}
              item={item}
              index={index}
              canRemove={index !== 0}
              onRemove={remove}
              isLast={index === fields.length - 1}
              excludedTypes={usedTypes.filter((_, actionIndex) => actionIndex !== index)}
              onTypeChange={(newType) => handleActionTypeChange(index, newType)}
            />
          ))}
        </Stack>
      </SortableDnd>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
        <Button
          variant="soft"
          color="neutral"
          disabled={unusedOptions.length === 0}
          onClick={() => append(buildActionForType(undefined, unusedOptions[0].value))}
          sx={{ minWidth: 36, width: 36, height: 36, borderRadius: '50%', p: 0 }}
        >
          <IconifyIcon icon="material-symbols:add-circle-outline-rounded" fontSize={20} />
        </Button>
      </Box>
    </Stack>
  );
};

export default ThenThisHappensForm;
