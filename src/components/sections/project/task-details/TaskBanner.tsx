'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import { taskDetailsData } from 'data/project/task-details';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import { VisuallyHiddenInput } from 'components/styled/VisuallyHiddenInput';

const TaskBanner = () => {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const previousUrlRef = useRef<string | null>(null);

  const displaySrc = bannerUrl ?? taskDetailsData.bannerImage;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file?.type.startsWith('image/')) return;

    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = null;
    }

    const url = URL.createObjectURL(file);
    previousUrlRef.current = url;
    setBannerUrl(url);
    event.target.value = '';
  };

  useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 160, md: 255 },
        width: 1,
        overflow: 'hidden',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderColor: 'divider',
      }}
    >
      <Image
        src={displaySrc}
        alt="Task banner"
        fill
        sx={{
          objectFit: 'cover',
        }}
      />

      <Button
        component="label"
        variant="soft"
        color="neutral"
        shape="square"
        sx={{ position: 'absolute', top: 16, right: 16 }}
        aria-label="Change banner image"
      >
        <IconifyIcon icon="material-symbols:edit-outline-rounded" fontSize={20} />
        <VisuallyHiddenInput type="file" accept="image/*" onChange={handleFileChange} />
      </Button>
    </Box>
  );
};

export default TaskBanner;
