'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import PageBreadcrumb, { PageBreadcrumbItem } from 'components/sections/common/PageBreadcrumb';
import { toolbarSlotSx } from './projectHeaderStyles';

export interface ProjectHeaderTitleSectionProps {
  title: string;
  subtitle?: string;
  breadcrumb?: PageBreadcrumbItem[];
  topActions?: React.ReactNode;
}

const ProjectHeaderTitleSection = ({
  title,
  subtitle,
  breadcrumb = [],
  topActions,
}: ProjectHeaderTitleSectionProps) => {
  const { down } = useBreakpoints();
  const downSm = down('sm');
  const downLg = down('lg');
  const hasSubtitle = subtitle != null && subtitle !== '';

  const titleBlock = (
    <>
      {breadcrumb.length > 0 && <PageBreadcrumb items={breadcrumb} sx={{ mb: 1 }} />}
      <Typography variant="h4" sx={[downLg && { fontSize: 'h5.fontSize' }]}>
        {title}
      </Typography>
    </>
  );

  const subtitleBlock = hasSubtitle ? (
    <Typography
      variant="subtitle2"
      component="p"
      sx={{
        mt: downSm ? 1 : 0,
        fontWeight: 'regular',
        color: 'text.secondary',
      }}
    >
      {subtitle}
    </Typography>
  ) : null;

  if (!downSm && hasSubtitle) {
    return (
      <Stack sx={{ gap: 1, minWidth: 0 }}>
        <Stack
          direction="row"
          sx={{ gap: 2, alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>{titleBlock}</Box>
          {topActions != null && <Box sx={{ ...toolbarSlotSx, flexShrink: 0 }}>{topActions}</Box>}
        </Stack>
        {subtitleBlock}
      </Stack>
    );
  }

  return (
    <Stack sx={{ gap: 2, minWidth: 0 }}>
      <Box sx={{ minWidth: 0 }}>
        {titleBlock}
        {subtitleBlock}
      </Box>
      {topActions != null && <Box sx={{ ...toolbarSlotSx, width: 1 }}>{topActions}</Box>}
    </Stack>
  );
};

export default ProjectHeaderTitleSection;
