'use client';

import { JSX, PropsWithChildren, ReactNode } from 'react';
import { Paper, PaperProps, Stack, SxProps, Typography } from '@mui/material';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import PageBreadcrumb, { PageBreadcrumbItem } from 'components/sections/common/PageBreadcrumb';

interface PageHeaderProps {
  title?: string;
  breadcrumb?: PageBreadcrumbItem[];
  description?: string;
  titleSectionComponent?: ReactNode;
  actionComponent?: JSX.Element;
  footerComponent?: ReactNode;
  sx?: SxProps;
  paperProps?: PaperProps;
}

const PageHeader = ({
  title,
  breadcrumb = [],
  description,
  titleSectionComponent,
  actionComponent,
  footerComponent,
  sx,
  paperProps,
}: PropsWithChildren<PageHeaderProps>) => {
  const { down } = useBreakpoints();
  const downLg = down('lg');
  const hasFooter = footerComponent != null;

  return (
    <Paper {...paperProps} sx={{ px: { xs: 3, md: 5 }, py: 3, ...paperProps?.sx }}>
      <Stack sx={{ gap: hasFooter ? 2 : 0, minWidth: 0 }}>
        {titleSectionComponent ?? (
          <Stack
            direction={{ sm: 'row' }}
            sx={{
              gap: 2,
              alignItems: { sm: 'flex-end' },
              justifyContent: 'space-between',
              minWidth: 0,
              ...sx,
            }}
          >
            <div style={{ minWidth: 0 }}>
              {breadcrumb.length > 0 && <PageBreadcrumb items={breadcrumb} sx={{ mb: 1 }} />}
              {title != null && (
                <Typography variant="h4" sx={[downLg && { fontSize: 'h5.fontSize' }]}>
                  {title}
                </Typography>
              )}
              {description && (
                <Typography
                  variant="subtitle2"
                  component="p"
                  sx={{
                    mt: 1,
                    fontWeight: 'regular',
                    color: 'text.secondary',
                  }}
                >
                  {description}
                </Typography>
              )}
            </div>

            {actionComponent}
          </Stack>
        )}

        {footerComponent}
      </Stack>
    </Paper>
  );
};

export default PageHeader;
