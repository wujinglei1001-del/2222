'use client';

import { useDeferredValue, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Button, Chip, Container, Paper, Stack, Typography, chipClasses } from '@mui/material';
import { formatActionChipLabel, formatConditionChipLabel } from './common/formatters';
import type { AutomationFormValues } from './useCreateAutomationForm';

const AutomationReviewBar = () => {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<AutomationFormValues>();

  const conditions = useWatch({ control, name: 'conditions' }) ?? [];
  const actions = useWatch({ control, name: 'actions' }) ?? [];

  const deferredConditions = useDeferredValue(conditions);
  const deferredActions = useDeferredValue(actions);

  const conditionChipLabels = useMemo(
    () => deferredConditions.map(formatConditionChipLabel),
    [deferredConditions],
  );

  const actionChipLabels = useMemo(
    () => deferredActions.map(formatActionChipLabel),
    [deferredActions],
  );

  const renderChipsWithAnd = (labels: string[]) => {
    return labels.flatMap((label, idx) => {
      const items = [
        <Chip
          key={`${idx}-${label}`}
          label={
            <Typography variant="body2" component="span">
              {label}
            </Typography>
          }
          size="large"
          sx={{
            bgcolor: 'neutral.lighter',
            maxWidth: 1,
            [`& .${chipClasses.label}`]: {
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            },
          }}
        />,
      ];
      if (idx < labels.length - 1) {
        items.push(
          <Typography
            key={`${idx}-and`}
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            and
          </Typography>,
        );
      }
      return items;
    });
  };

  return (
    <Paper
      background={1}
      sx={({ mixins }) => ({
        position: 'sticky',
        zIndex: 999,
        width: 1,
        bottom: 0,
        minHeight: mixins.footer.sm,
        display: 'flex',
        alignItems: 'center',
      })}
    >
      <Container
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 5 },
          py: 2,
        }}
      >
        <Stack
          direction={{ xs: 'column', xl: 'row' }}
          sx={{
            alignItems: { xs: 'stretch', xl: 'center' },
            gap: { xs: 4, sm: 2 },
          }}
        >
          <Stack
            direction="row"
            sx={{
              gap: 1,
              flexWrap: 'wrap',
              alignItems: 'center',
              flex: 1,
              minWidth: 0,
              width: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              When
            </Typography>
            {renderChipsWithAnd(conditionChipLabels)}
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
              }}
            >
              then
            </Typography>
            {renderChipsWithAnd(actionChipLabels)}
          </Stack>

          <Stack
            direction="row"
            sx={{
              gap: 2,
              alignItems: { xs: 'stretch', sm: 'center' },
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              flexShrink: 0,
              ml: { xs: 0, sm: 'auto' },
              alignSelf: { xs: 'stretch', sm: 'flex-end' },
            }}
          >
            <Button
              variant="text"
              color="neutral"
              sx={{
                flex: { xs: 1, sm: '0 0 auto' },
              }}
            >
              Save draft
            </Button>
            <Button
              variant="text"
              color="neutral"
              sx={{
                flex: { xs: 1, sm: '0 0 auto' },
              }}
            >
              Discard changes
            </Button>
            <Button variant="contained" type="submit" fullWidth disabled={isSubmitting}>
              Create automation
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Paper>
  );
};

export default AutomationReviewBar;
