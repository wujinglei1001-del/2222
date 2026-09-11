import type { Slide } from 'yet-another-react-lightbox';
import { Box, Button, Collapse, Grid, Paper, Stack, Typography } from '@mui/material';
import type { ActivityGallery } from 'data/time-tracker/screenshots';
import useLightbox from 'hooks/useLightbox';
import { secondsToHms } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import Lightbox from 'components/base/Lightbox';
import ScreenshotItem from './ScreenshotItem';

interface GalleryItemProps {
  galleryItem: ActivityGallery;
  activeGallery: number | null;
  index: number;
  handleActiveGallery: (index: number) => void;
}

const GalleryItem = ({
  galleryItem,
  activeGallery,
  index,
  handleActiveGallery,
}: GalleryItemProps) => {
  const { openLightbox, ...lightboxProps } = useLightbox();
  const { screenshots, timeRange, workedTime } = galleryItem;

  const lightboxSlides: Slide[] = screenshots.map((item) => ({
    src: item.screenshot,
    type: 'image',
  }));

  return (
    <Stack direction="row" sx={{ gap: 1 }}>
      <Stack sx={{ alignItems: 'center' }}>
        <Box
          sx={{
            my: 3.25,
            width: 24,
            height: 24,
            borderRadius: 999,
            bgcolor: 'action.hover',
            flexShrink: 0,
          }}
        />
        <Box sx={{ borderLeft: '1px solid', borderColor: 'divider', height: 1 }} />
      </Stack>
      <Paper background={1} sx={{ outline: 0, py: 2, px: 3, borderRadius: 4, width: 1 }}>
        <Stack sx={{ gap: 2 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack>
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>{timeRange}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Worked Time: {secondsToHms(workedTime, true)}
              </Typography>
            </Stack>
            <Button shape="square" color="neutral" onClick={() => handleActiveGallery(index)}>
              <IconifyIcon
                icon={
                  index === activeGallery
                    ? 'material-symbols:remove-rounded'
                    : 'material-symbols:add-rounded'
                }
                sx={{ fontSize: 20 }}
              />
            </Button>
          </Stack>
          <Collapse in={index === activeGallery} unmountOnExit>
            <Grid container spacing={2}>
              {screenshots.map((screenshot, idx) => (
                <Grid key={screenshot.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ScreenshotItem screenshot={screenshot} index={idx} openLightbox={openLightbox} />
                </Grid>
              ))}
              <Lightbox
                slides={lightboxSlides}
                extension={['caption', 'fullscreen', 'slideshow', 'thumbnails', 'video', 'zoom']}
                {...lightboxProps}
              />
            </Grid>
          </Collapse>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default GalleryItem;
