'use client';

import { ReactNode } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  SxProps,
  Theme,
  Typography,
} from '@mui/material';
import { TeamMemberListOverview } from 'data/project/team-member-list';
import IconifyIcon from 'components/base/IconifyIcon';

interface TeamMemberOverviewCardProps {
  overview: TeamMemberListOverview;
  memberCount: number;
  adminCount: number;
  moderatorCount: number;
}

interface OverviewStats extends TeamMemberOverviewCardProps {
  runningPct: number;
  donePct: number;
}

const noShrink = { flexShrink: 0 };

const mdGridSx = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr)',
  gridTemplateRows: 'auto auto auto',
  gap: 2,
  columnGap: 3,
  width: 1,
} as const;

const gridCell = (column: number, row: number) => ({
  gridColumn: column,
  gridRow: row,
});

const getProjectPercentages = (overview: TeamMemberListOverview) => {
  const runningPct =
    overview.totalProjects > 0 ? (overview.runningProjects / overview.totalProjects) * 100 : 0;
  const donePct =
    overview.totalProjects > 0 ? (overview.doneProjects / overview.totalProjects) * 100 : 0;

  return { runningPct, donePct };
};

const StatRow = ({
  label,
  value,
  sx,
}: {
  label: string;
  value: string | number;
  sx?: SxProps<Theme>;
}) => (
  <Stack
    direction="row"
    sx={{ flexWrap: 'nowrap', justifyContent: 'space-between', width: 1, ...sx }}
  >
    <Typography variant="subtitle2" sx={noShrink}>
      {label}
    </Typography>
    <Typography variant="subtitle2" sx={{ color: 'text.secondary', ...noShrink }}>
      {value}
    </Typography>
  </Stack>
);

const WrapRow = ({
  label,
  sx,
  children,
}: {
  label: string;
  sx?: SxProps<Theme>;
  children: ReactNode;
}) => (
  <Stack
    direction="row"
    sx={{
      flexWrap: 'wrap',
      width: 1,
      gap: 0.5,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      ...sx,
    }}
  >
    <Typography variant="subtitle2" sx={noShrink}>
      {label}
    </Typography>
    {children}
  </Stack>
);

const GridDivider = ({ column }: { column: number }) => (
  <Divider orientation="vertical" flexItem sx={{ gridColumn: column, gridRow: '1 / -1', mx: 0 }} />
);

const OwnerRow = ({
  avatar,
  name,
  avatarSize = 28,
}: {
  avatar?: string;
  name: string;
  avatarSize?: number;
}) => (
  <Stack direction="row" sx={{ justifyContent: 'space-between', width: 1, alignItems: 'center' }}>
    <Typography variant="subtitle2">Owner:</Typography>
    <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
      <Avatar src={avatar} sx={{ width: avatarSize, height: avatarSize }} />
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        {name}
      </Typography>
    </Stack>
  </Stack>
);

const ViewProjectsButton = () => (
  <Button
    variant="text"
    color="primary"
    endIcon={<IconifyIcon icon="material-symbols:chevron-right-rounded" fontSize={20} />}
    sx={{ alignSelf: 'flex-start' }}
  >
    View projects
  </Button>
);

const ProjectStats = ({
  runningProjects,
  doneProjects,
  runningPct,
  donePct,
  labelsSx,
  barSx,
}: {
  runningProjects: number;
  doneProjects: number;
  runningPct: number;
  donePct: number;
  labelsSx?: SxProps<Theme>;
  barSx?: SxProps<Theme>;
}) => (
  <Stack sx={{ gap: 1 }}>
    <Stack
      direction="row"
      sx={{ flexWrap: 'nowrap', justifyContent: 'space-between', width: 1, ...labelsSx }}
    >
      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, ...noShrink }}>
        Running:{' '}
        <Box component="span" sx={{ fontWeight: 400 }}>
          {runningProjects}
        </Box>
      </Typography>
      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600, ...noShrink }}>
        Done:{' '}
        <Box component="span" sx={{ fontWeight: 400 }}>
          {doneProjects}
        </Box>
      </Typography>
    </Stack>
    <Stack
      direction="row"
      sx={{
        width: 1,
        gap: '2px',
        height: 8,
        borderRadius: 0.5,
        overflow: 'hidden',
        ...barSx,
      }}
    >
      <Box sx={{ width: `${runningPct}%`, bgcolor: 'primary.main' }} />
      <Box sx={{ width: `${donePct}%`, bgcolor: 'success.main' }} />
    </Stack>
  </Stack>
);

const OverviewMdGrid = ({ stats }: { stats: OverviewStats }) => {
  const { overview, memberCount, adminCount, moderatorCount, runningPct, donePct } = stats;

  return (
    <Stack sx={{ display: { xs: 'none', md: 'flex', lg: 'none' }, gap: 2 }}>
      <Box sx={mdGridSx}>
        <WrapRow label="Team created on:" sx={gridCell(1, 1)}>
          <Typography
            variant="subtitle2"
            sx={{ color: 'text.secondary', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {overview.createdOn}
          </Typography>
        </WrapRow>

        <StatRow label="No. of members:" value={memberCount} sx={gridCell(1, 2)} />

        <GridDivider column={2} />

        <WrapRow label="Owner:" sx={{ ...gridCell(3, 1), gap: 1, alignItems: 'center' }}>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', gap: 1, flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            <Avatar src={overview.owner.avatar} sx={{ width: 24, height: 24, flexShrink: 0 }} />
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
              {overview.owner.name}
            </Typography>
          </Stack>
        </WrapRow>

        <StatRow label="No. of admins:" value={adminCount} sx={gridCell(3, 2)} />
        <StatRow label="No. of moderators:" value={moderatorCount} sx={gridCell(3, 3)} />

        <GridDivider column={4} />

        <StatRow label="Total Projects" value={overview.totalProjects} sx={gridCell(5, 1)} />
        <ProjectStats
          runningProjects={overview.runningProjects}
          doneProjects={overview.doneProjects}
          runningPct={runningPct}
          donePct={donePct}
          labelsSx={gridCell(5, 2)}
          barSx={{ ...gridCell(5, 3), alignSelf: 'start' }}
        />
      </Box>

      <ViewProjectsButton />
    </Stack>
  );
};

const OverviewStacked = ({ stats }: { stats: OverviewStats }) => {
  const { overview, memberCount, adminCount, moderatorCount, runningPct, donePct } = stats;

  return (
    <Stack sx={{ gap: 2, display: { xs: 'flex', md: 'none', lg: 'flex' } }}>
      <StatRow label="Team created on:" value={overview.createdOn} />
      <StatRow label="No. of members:" value={memberCount} />

      <Divider sx={{ my: 1 }} />

      <OwnerRow avatar={overview.owner.avatar} name={overview.owner.name} />
      <StatRow label="No. of admins:" value={adminCount} />
      <StatRow label="No. of moderators:" value={moderatorCount} />

      <Divider sx={{ my: 1 }} />

      <StatRow label="Total Projects" value={overview.totalProjects} />
      <ProjectStats
        runningProjects={overview.runningProjects}
        doneProjects={overview.doneProjects}
        runningPct={runningPct}
        donePct={donePct}
      />

      <ViewProjectsButton />
    </Stack>
  );
};

const TeamMemberOverviewCard = ({
  overview,
  memberCount,
  adminCount,
  moderatorCount,
}: TeamMemberOverviewCardProps) => {
  const { runningPct, donePct } = getProjectPercentages(overview);
  const stats = { overview, memberCount, adminCount, moderatorCount, runningPct, donePct };

  return (
    <Paper background={1} sx={{ width: 1, borderRadius: 4, p: 3, outline: 'none' }}>
      <OverviewMdGrid stats={stats} />
      <OverviewStacked stats={stats} />
    </Paper>
  );
};

export default TeamMemberOverviewCard;
