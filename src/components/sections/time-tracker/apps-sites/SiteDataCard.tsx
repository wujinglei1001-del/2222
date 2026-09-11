import { Avatar, Box, LinearProgress, Link, Paper, Stack, Typography } from '@mui/material';
import type { SiteData } from 'data/time-tracker/apps-sites';
import { secondsToHms } from 'lib/utils';

interface SiteDataCardProps {
  data: SiteData;
}

const SiteDataCard = ({ data }: SiteDataCardProps) => {
  return (
    <Paper background={1} sx={{ outline: 0, p: 3, borderRadius: 6 }}>
      <Stack sx={{ gap: 1 }}>
        <Stack direction="row" sx={{ gap: { xs: 1, md: 2 }, alignItems: 'center' }}>
          <Avatar src={data.logo} sx={{ width: 48, height: 48 }} />
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
              {data.name}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
            >
              Link:{' '}
              <Link href={data.link} target="_blank" sx={{ fontWeight: 400 }}>
                {data.link}
              </Link>
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction={{ xs: 'row', sm: 'column', md: 'row' }}
          sx={{
            gap: { xs: 2.5, sm: 0.5, md: 2.5 },
            alignItems: { xs: 'center', sm: 'stretch', md: 'center' },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {secondsToHms(data.hours, true)} hrs
          </Typography>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexGrow: 1 }}>
            <LinearProgress
              value={data.progress}
              variant="determinate"
              sx={{ width: 1, height: 8 }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {data.progress}%
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default SiteDataCard;
