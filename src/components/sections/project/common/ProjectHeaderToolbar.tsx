'use client';

import { Box, Stack } from '@mui/material';
import { ProjectHeaderToolbarLayoutProvider } from './ProjectHeaderToolbarContext';
import {
  inlineToolbarLeftSlotSx,
  inlineToolbarRightSlotSx,
  inlineToolbarRowSx,
  stackedToolbarLeftSlotSx,
  stackedToolbarRightSlotSx,
} from './projectHeaderStyles';

export interface ProjectHeaderToolbarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  stacked?: boolean;
}

const ProjectHeaderToolbar = ({ left, right, stacked = false }: ProjectHeaderToolbarProps) => {
  if (left == null && right == null) {
    return null;
  }

  const toolbarLayout = stacked ? 'stacked' : 'inline';

  if (stacked) {
    return (
      <ProjectHeaderToolbarLayoutProvider value={toolbarLayout}>
        <Stack sx={{ gap: 2, width: 1, minWidth: 0 }}>
          {left != null && <Box sx={stackedToolbarLeftSlotSx}>{left}</Box>}
          {right != null && <Box sx={stackedToolbarRightSlotSx}>{right}</Box>}
        </Stack>
      </ProjectHeaderToolbarLayoutProvider>
    );
  }

  return (
    <ProjectHeaderToolbarLayoutProvider value={toolbarLayout}>
      <Stack direction="row" sx={inlineToolbarRowSx}>
        {left != null && <Box sx={inlineToolbarLeftSlotSx}>{left}</Box>}
        {right != null && <Box sx={inlineToolbarRightSlotSx}>{right}</Box>}
      </Stack>
    </ProjectHeaderToolbarLayoutProvider>
  );
};

export default ProjectHeaderToolbar;
