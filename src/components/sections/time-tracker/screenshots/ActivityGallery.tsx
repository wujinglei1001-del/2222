import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { type ActivityGallery as ActivityGalleryType } from 'data/time-tracker/screenshots';
import GalleryItem from './GalleryItem';
import TopButtonGroup from './TopButtonGroup';

interface ActivityGalleryProps {
  activityGallery: ActivityGalleryType[];
}

const ActivityGallery = ({ activityGallery }: ActivityGalleryProps) => {
  const [activeGallery, setActiveGallery] = useState<number | null>(0);

  const handleActiveGallery = (index: number) =>
    setActiveGallery((current) => (current === index ? null : index));

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack
        direction="row"
        sx={{
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Activity Gallery
        </Typography>

        <TopButtonGroup />
      </Stack>
      <Stack sx={{ gap: 2 }}>
        {activityGallery.map((galleryItem, index) => (
          <GalleryItem
            key={galleryItem.id}
            galleryItem={galleryItem}
            activeGallery={activeGallery}
            index={index}
            handleActiveGallery={handleActiveGallery}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default ActivityGallery;
