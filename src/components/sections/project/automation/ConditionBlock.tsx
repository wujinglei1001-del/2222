'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import { AutomationCondition } from 'types/automations';
import IconifyIcon from 'components/base/IconifyIcon';
import ConditionalFieldDropdown from './ConditionalFieldDropdown';
import ConditionFields from './ConditionFields';
import SecondaryConditionFields from './SecondaryConditionFields';
import TriggerDropdown from './TriggerDropdown';
import { type ConditionFilterType, isConditionFilterType } from './common/constants';
import BlockDivider from './shared/BlockDivider';

interface ConditionBlockProps {
  index: number;
  canRemove?: boolean;
  onRemove: () => void;
  isLast: boolean;
  excludedTriggerTypes?: AutomationCondition['type'][];
  excludedFilterTypes?: ConditionFilterType[];
  onTriggerTypeChange: (newType: AutomationCondition['type']) => void;
  onFilterTypeChange: (newType: ConditionFilterType) => void;
}

const ConditionBlock = ({
  index,
  canRemove = true,
  onRemove,
  isLast,
  excludedTriggerTypes = [],
  excludedFilterTypes = [],
  onTriggerTypeChange,
  onFilterTypeChange,
}: ConditionBlockProps) => {
  const { control } = useFormContext();
  const isPrimary = index === 0;

  const conditionType = useWatch({
    control,
    name: `conditions.${index}.type`,
  }) as AutomationCondition['type'];

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Paper background={1} sx={{ p: 3, borderRadius: 2, position: 'relative', outline: 'none' }}>
        <Stack sx={{ gap: 2 }}>
          <Controller
            control={control}
            name={`conditions.${index}.type`}
            render={({ field }) => (
              <Stack sx={{ gap: 1, width: 1 }}>
                {!isPrimary && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Also, with this,
                    </Typography>
                    {canRemove && (
                      <IconButton
                        size="small"
                        onClick={onRemove}
                        sx={{
                          color: 'text.secondary',
                          '&:hover': { color: 'error.main' },
                        }}
                      >
                        <IconifyIcon icon="material-symbols:close-rounded" fontSize={20} />
                      </IconButton>
                    )}
                  </Box>
                )}

                {isPrimary ? (
                  <TriggerDropdown
                    value={field.value}
                    onChange={onTriggerTypeChange}
                    excludedTypes={excludedTriggerTypes}
                  />
                ) : (
                  <ConditionalFieldDropdown
                    value={field.value as ConditionFilterType}
                    onChange={onFilterTypeChange}
                    excludedTypes={excludedFilterTypes}
                  />
                )}
              </Stack>
            )}
          />

          {isPrimary ? (
            <ConditionFields index={index} type={conditionType} />
          ) : (
            isConditionFilterType(conditionType) && (
              <SecondaryConditionFields index={index} type={conditionType} />
            )
          )}
        </Stack>
      </Paper>
      <BlockDivider isLast={isLast} />
    </Box>
  );
};

export default ConditionBlock;
