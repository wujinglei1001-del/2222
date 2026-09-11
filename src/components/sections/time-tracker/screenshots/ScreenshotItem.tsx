import { useState } from 'react';
import {
  Box,
  type BoxProps,
  Button,
  Checkbox,
  Chip,
  Grow,
  LinearProgress,
  Paper,
  type PaperProps,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import type { Screenshot } from 'data/time-tracker/screenshots';
import { activityPercent } from 'data/time-tracker/screenshots';
import { cssVarRgba } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

interface ScreenshotItemProps {
  screenshot: Screenshot;
  index: number;
  openLightbox: (index: number) => void;
}

const ScreenshotItem = ({ screenshot, index, openLightbox }: ScreenshotItemProps) => {
  const [isHovered, setisHovered] = useState(false);
  return (
    <ScreenshotItemWrapper>
      <FigureWrapper
        onMouseEnter={() => setisHovered(true)}
        onMouseLeave={() => setisHovered(false)}
      >
        <Image
          src={screenshot.screenshot}
          alt={screenshot.id}
          fill
          sx={{ height: 1, width: 1, objectFit: 'cover' }}
        />
        <Chip
          label={`${screenshot.screens} Screens`}
          color="neutral"
          sx={{ position: 'absolute', bottom: 8, right: 16 }}
        />
        <Grow in={isHovered} timeout={300} mountOnEnter unmountOnExit>
          <HoverEffectBox>
            <Stack
              direction="row"
              sx={{
                px: 2,
                position: 'absolute',
                top: 8,
                width: 1,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Checkbox />
              <Button shape="square" size="small" color="neutral" sx={{ color: 'common.white' }}>
                <IconifyIcon icon="material-symbols:delete-outline" sx={{ fontSize: 18 }} />
              </Button>
            </Stack>
            <Button
              size="small"
              variant="soft"
              color="neutral"
              onClick={() => openLightbox(index)}
              sx={{ placeSelf: 'center' }}
            >
              View Image
            </Button>
          </HoverEffectBox>
        </Grow>
      </FigureWrapper>
      <Stack sx={{ gap: 2, p: 2, flexGrow: 1 }}>
        <Stack
          direction="row"
          sx={{
            columnGap: { xs: 1, md: 2 },
            rowGap: 1,
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {screenshot.timeRange}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {`Active ${screenshot.active} min`}
          </Typography>
        </Stack>
        <div>
          <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
            <ActivityIconText
              icon="material-symbols:mouse-outline"
              value={`${screenshot.activity.mouse}%`}
            />
            <ActivityIconText
              icon="material-symbols:keyboard-alt-outline-rounded"
              value={`${screenshot.activity.keyboard}%`}
            />
          </Stack>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
            <LinearProgress
              value={screenshot.activity.total}
              variant="determinate"
              color={activityPercent(screenshot.activity.total)}
              sx={{ flexGrow: 1, height: 8 }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {`${screenshot.activity.total}%`}
            </Typography>
          </Stack>
        </div>
      </Stack>
    </ScreenshotItemWrapper>
  );
};

export default ScreenshotItem;

const ActivityIconText = ({ icon, value }: { icon: string; value: string }) => {
  return (
    <Typography
      variant="caption"
      sx={{
        fontWeight: 500,
        color: 'text.secondary',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.25,
      }}
    >
      <IconifyIcon icon={icon} sx={{ fontSize: 20 }} />
      <Box component="span">{value}</Box>
    </Typography>
  );
};

const ScreenshotItemWrapper = styled((props: PaperProps) => <Paper background={2} {...props} />)({
  outline: 0,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  borderBottomLeftRadius: 16,
  borderBottomRightRadius: 16,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

const FigureWrapper = styled((props: BoxProps) => <Box component="figure" {...props} />)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: 0,
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 10',
  cursor: 'pointer',
});

const HoverEffectBox = styled(Box)(({ theme: { vars } }) => ({
  position: 'absolute',
  inset: 0,
  borderRadius: 8,
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  backgroundColor: cssVarRgba(vars.palette.common.blackChannel, 0.5),
  display: 'grid',
}));
