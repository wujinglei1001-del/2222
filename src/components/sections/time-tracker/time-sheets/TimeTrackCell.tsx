import { Button, type ButtonProps } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const TimeTrackCell = ({
  sx,
  isRunning,
  onClick,
  ...rest
}: ButtonProps & { isRunning: boolean }) => {
  return (
    <Button
      variant="soft"
      color={isRunning ? 'primary' : 'neutral'}
      startIcon={<IconifyIcon icon="material-symbols:timer-outline-rounded" />}
      onClick={onClick}
      {...rest}
      sx={{ ...sx }}
    >
      {isRunning ? 'Stop' : 'Start'}
    </Button>
  );
};

export default TimeTrackCell;
