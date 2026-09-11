'use client';

import { useState } from 'react';
import { Box, IconButton, Paper, Stack, Switch, Typography } from '@mui/material';
import { Automation } from 'types/automations';
import IconifyIcon from 'components/base/IconifyIcon';
import { parseAutomationDescription } from './common/formatters';

interface AutomationCardProps {
  automation: Automation;
  onToggle?: (id: number, isActive: boolean) => void;
  onEdit?: (id: number) => void;
  onDuplicate?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const AutomationCard = ({
  automation,
  onToggle,
  onEdit,
  onDuplicate,
  onDelete,
}: AutomationCardProps) => {
  const [isActive, setIsActive] = useState(automation.isActive);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newActive = event.target.checked;
    setIsActive(newActive);
    onToggle?.(automation.id, newActive);
  };

  return (
    <Paper
      background={1}
      sx={{
        p: 3,
        borderRadius: 4,
        outline: 'none',
        position: 'relative',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'background.elevation2',
          '.automation-actions': {
            opacity: 1,
            pointerEvents: 'auto',
          },
        },
      }}
    >
      <Stack direction="row" sx={{ gap: 2, alignItems: 'flex-start' }}>
        <Switch checked={isActive} onChange={handleToggle} sx={{ mt: 0.5 }} />

        <Stack sx={{ gap: 1, flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600 }}>{automation.name}</Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.75,
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: 0.5,
              rowGap: 0.75,
            }}
          >
            {parseAutomationDescription(automation.description).map((segment, index) => (
              <Box
                key={index}
                component="span"
                sx={{
                  fontWeight: segment.isSemibold ? 600 : 400,
                  color: segment.isSemibold ? 'text.primary' : 'inherit',
                }}
              >
                {segment.text.trim()}
              </Box>
            ))}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        className="automation-actions"
        direction="row"
        onClick={(event) => {
          event.stopPropagation();
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        sx={{
          gap: 0.5,
          alignItems: 'center',
          position: 'absolute',
          right: 24,
          top: 24,
          pl: 2,
          opacity: 0,
          pointerEvents: 'none',
          transition: (theme) =>
            theme.transitions.create(['opacity'], {
              duration: theme.transitions.duration.short,
              easing: theme.transitions.easing.easeIn,
            }),
        }}
      >
        <IconButton
          size="small"
          onClick={() => onEdit?.(automation.id)}
          sx={{ color: 'text.secondary' }}
        >
          <IconifyIcon icon="material-symbols:edit-outline-rounded" fontSize={20} />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDuplicate?.(automation.id)}
          sx={{ color: 'text.secondary' }}
        >
          <IconifyIcon
            icon="material-symbols:control-point-duplicate-outline-rounded"
            fontSize={20}
          />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete?.(automation.id)}
          sx={{ color: 'error.main' }}
        >
          <IconifyIcon icon="material-symbols:delete-outline-rounded" fontSize={20} />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default AutomationCard;
