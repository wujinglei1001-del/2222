import { Button } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

interface GanttGridToggleButtonProps {
  gridDividerLeft: number;
  isGridExpanded: boolean;
  onToggle: () => void;
}

const GanttGridToggleButton = ({
  gridDividerLeft,
  isGridExpanded,
  onToggle,
}: GanttGridToggleButtonProps) => (
  <Button
    color="neutral"
    shape="circle"
    variant="soft"
    style={{ left: `${gridDividerLeft - 10}px` }}
    sx={({ transitions }) => ({
      position: 'absolute',
      top: 16,
      zIndex: 2,
      transition: transitions.create('left', {
        duration: 50,
        easing: 'ease-in-out',
      }),
      minWidth: 24,
      height: 24,
    })}
    onClick={onToggle}
  >
    {isGridExpanded ? (
      <IconifyIcon flipOnRTL icon="material-symbols:chevron-left-rounded" />
    ) : (
      <IconifyIcon flipOnRTL icon="material-symbols:chevron-right-rounded" />
    )}
  </Button>
);

export default GanttGridToggleButton;
