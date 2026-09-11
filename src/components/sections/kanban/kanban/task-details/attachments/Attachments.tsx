'use client';

import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Attachment as AttachmentType } from 'data/kanban/kanban';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import Attachment from 'components/base/Attachment';
import IconifyIcon from 'components/base/IconifyIcon';
import FileUploadArea from './FileUploadArea';

dayjs.extend(advancedFormat);

const Attachments = () => {
  const { watch } = useFormContext();
  const attachments = watch('attachments');

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Attachments
      </Typography>
      <Box sx={{ mb: 3 }}>
        {attachments.map((item: AttachmentType) => (
          <Attachment
            key={item.id}
            data={{ filename: item.filename, image: item.image, icon: item.icon }}
            secondaryContent={
              <>
                <Typography variant="body2">
                  Added by <Link href="#!">{item.addedBy}</Link>
                </Typography>
                <Stack sx={{ gap: 0.5, alignItems: 'center' }}>
                  <IconifyIcon
                    icon="material-symbols:schedule-outline-rounded"
                    sx={{ color: 'text.secondary', fontSize: 16 }}
                  />
                  <Typography variant="body2">
                    {dayjs(item.time).format('Do MMM, h:mm A')}
                  </Typography>
                </Stack>
              </>
            }
          />
        ))}
      </Box>
      <FileUploadArea />
    </Paper>
  );
};

export default Attachments;
