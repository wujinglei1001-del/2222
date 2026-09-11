'use client';

import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Box, Button, MenuItem, Stack, Typography } from '@mui/material';
import { AutomationCondition } from 'types/automations';
import IconifyIcon from 'components/base/IconifyIcon';
import StyledTextField from 'components/styled/StyledTextField';
import ConditionBlock from './ConditionBlock';
import { buildConditionForFilterType, buildConditionForType } from './common/builders';
import {
  CONDITION_FILTER_OPTIONS,
  type ConditionFilterType,
  isConditionFilterType,
} from './common/constants';
import { getUnusedOptions } from './common/helpers';
import type { AutomationFormValues } from './useCreateAutomationForm';

interface WhenThisHappensFormProps {
  entityType?: string;
}

const WhenThisHappensForm = ({ entityType = 'Tasks' }: WhenThisHappensFormProps) => {
  const { control, getValues } = useFormContext<AutomationFormValues>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'conditions',
  });

  const conditions = useWatch({ control, name: 'conditions' }) ?? [];

  const usedFilterTypes = conditions
    .slice(1)
    .map((condition) => condition.type)
    .filter(isConditionFilterType);

  const getExcludedFilterTypes = (currentIndex: number) =>
    conditions.flatMap((condition, conditionIndex) =>
      conditionIndex !== currentIndex && conditionIndex > 0 && isConditionFilterType(condition.type)
        ? [condition.type]
        : [],
    );

  const unusedFilterOptions = getUnusedOptions(
    CONDITION_FILTER_OPTIONS,
    usedFilterTypes,
    undefined,
    (option) => option.value,
  );

  const handleTriggerTypeChange = (index: number, newType: AutomationCondition['type']) => {
    update(index, buildConditionForType(getValues(`conditions.${index}`), newType));
  };

  const handleFilterTypeChange = (index: number, newType: ConditionFilterType) => {
    update(index, buildConditionForFilterType(getValues(`conditions.${index}`), newType));
  };

  return (
    <Stack sx={{ gap: { xs: 2, lg: 3 }, maxWidth: 375, width: '100%' }}>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        sx={{
          gap: 1,
          alignItems: { xs: 'stretch', lg: 'center' },
          width: 1,
        }}
      >
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexShrink: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            When this happens
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.disabled' }}>
            with
          </Typography>
        </Stack>
        <StyledTextField
          select
          defaultValue={entityType}
          sx={{ width: { xs: 1, lg: 'auto' }, minWidth: { lg: 120 } }}
        >
          <MenuItem value="Tasks">Tasks</MenuItem>
          <MenuItem value="Subtasks">Subtasks</MenuItem>
        </StyledTextField>
      </Stack>
      <Stack sx={{ gap: 2, position: 'relative' }}>
        {fields.map((field, index) => (
          <ConditionBlock
            key={field.id}
            index={index}
            canRemove={index !== 0}
            onRemove={() => remove(index)}
            isLast={index === fields.length - 1}
            excludedTriggerTypes={[]}
            excludedFilterTypes={getExcludedFilterTypes(index)}
            onTriggerTypeChange={(newType) => handleTriggerTypeChange(index, newType)}
            onFilterTypeChange={(newType) => handleFilterTypeChange(index, newType)}
          />
        ))}
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
        <Button
          variant="soft"
          color="neutral"
          disabled={unusedFilterOptions.length === 0}
          onClick={() =>
            append(buildConditionForFilterType(undefined, unusedFilterOptions[0].value))
          }
          sx={{ minWidth: 36, width: 36, height: 36, borderRadius: '50%', p: 0 }}
        >
          <IconifyIcon icon="material-symbols:add-circle-outline-rounded" fontSize={20} />
        </Button>
      </Box>
    </Stack>
  );
};

export default WhenThisHappensForm;
