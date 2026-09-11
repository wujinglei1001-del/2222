import { Box, Typography } from '@mui/material';

const Page = () => {
  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        财务统计
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        页面内容建设中。
      </Typography>
    </Box>
  );
};

export default Page;
