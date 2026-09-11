import type { ReactNode } from 'react';
import { Fragment, useState } from 'react';
import { Box, Button, Drawer, Stack, Toolbar, Typography } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import SimpleBar from 'components/base/SimpleBar';

interface FilterDrawerWrapperProps {
  title?: string;
  children: ReactNode;
  onApply?: () => void;
  onClear?: () => void;
}

const FilterDrawerWrapper = ({
  title = 'Filter',
  children,
  onApply,
  onClear,
}: FilterDrawerWrapperProps) => {
  const { up } = useBreakpoints();
  const upLg = up('lg');
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => setOpen(newOpen);

  return (
    <Fragment>
      <Button
        shape={upLg ? undefined : 'square'}
        variant="soft"
        color="neutral"
        sx={{ gap: 0.5, flexShrink: 0 }}
        onClick={toggleDrawer(true)}
      >
        <IconifyIcon icon="material-symbols:filter-alt-outline" fontSize={20} />
        {upLg && <Box component="span">Filter</Box>}
      </Button>

      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        slotProps={{ paper: { background: 1, sx: { width: 300, height: 1 } } }}
      >
        <Toolbar sx={{ p: { xs: 0 } }}>
          <Stack
            direction="row"
            sx={{ width: 1, justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 1 }}
          >
            <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
            <Button shape="circle" color="neutral" onClick={toggleDrawer(false)}>
              <IconifyIcon icon="material-symbols:close-rounded" sx={{ fontSize: 20 }} />
            </Button>
          </Stack>
        </Toolbar>

        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <SimpleBar sx={{ height: 1, '& .simplebar-mask': { zIndex: 'unset' } }} autoHide={false}>
            <Stack sx={{ gap: 2, p: 3 }}>{children}</Stack>
          </SimpleBar>
        </Box>

        <Toolbar sx={{ p: { xs: 0 }, display: 'block' }}>
          <Stack direction="row" sx={{ gap: 1, py: 3, px: 5, mt: 'auto' }}>
            <Button color="neutral" onClick={onClear}>
              Clear
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                onApply?.();
                toggleDrawer(false)();
              }}
            >
              Apply
            </Button>
          </Stack>
        </Toolbar>
      </Drawer>
    </Fragment>
  );
};

export default FilterDrawerWrapper;
