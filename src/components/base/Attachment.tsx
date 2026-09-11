import type { ReactNode } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { cssVarRgba } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';

export interface AttachmentData {
  filename: string;
  image?: string;
  icon?: string;
}

interface AttachmentProps {
  data: AttachmentData;
  secondaryContent?: ReactNode;
  actions?: ReactNode;
}

const Attachment = ({ data, secondaryContent, actions }: AttachmentProps) => (
  <Card
    sx={{
      p: 2,
      mb: 1,
      outline: 'none',
      bgcolor: 'background.elevation1',
      borderRadius: 4,
    }}
  >
    <Stack direction="row" sx={{ gap: 2, alignItems: { xs: 'flex-start', md: 'center' } }}>
      {data.image && (
        <CardMedia
          component="img"
          image={data.image}
          sx={{ height: 48, width: 48, borderRadius: 2 }}
        />
      )}

      {data.icon && (
        <Stack
          direction="row"
          sx={(theme) => ({
            height: 48,
            width: 48,
            flexShrink: 0,
            borderRadius: 2,
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.15),
          })}
        >
          <IconifyIcon icon={data.icon} sx={{ color: 'primary.main', fontSize: 24 }} />
        </Stack>
      )}

      <CardContent sx={{ p: 0 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {data.filename}
        </Typography>
        {secondaryContent && (
          <Stack direction="row" sx={{ mt: 0.5, gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            {secondaryContent}
          </Stack>
        )}
      </CardContent>

      <CardActions sx={{ p: 0, ml: 'auto' }}>
        {actions ?? (
          <Button shape="square" variant="text" size="small" color="neutral">
            <IconifyIcon
              icon="material-symbols:more-horiz"
              sx={{ color: 'text.primary', fontSize: 18 }}
            />
          </Button>
        )}
      </CardActions>
    </Stack>
  </Card>
);

export default Attachment;
