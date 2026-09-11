import { Box } from '@mui/material';

interface BlockDividerProps {
  isLast: boolean;
}

const BlockDivider = ({ isLast }: BlockDividerProps) => {
  if (isLast) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: -16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1px',
        height: 16,
        bgcolor: 'dividerLight',
        zIndex: 1,
      }}
    />
  );
};

export default BlockDivider;
