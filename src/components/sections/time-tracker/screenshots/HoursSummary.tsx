import { Grid, Paper, Stack, Typography } from '@mui/material';

const hours = [
  {
    id: 1,
    name: 'AVG. Activity',
    value: '64%',
  },
  {
    id: 2,
    name: 'Active Time',
    value: '06:00:00 hrs',
  },
  {
    id: 3,
    name: 'Total Time',
    value: '08:00:00 hrs',
  },
  {
    id: 4,
    name: 'Start-Stop Timer',
    value: '9:00 am-5:00 pm',
  },
];

const HoursSummary = () => {
  return (
    <Paper background={1} sx={{ outline: 0, p: 3, borderRadius: 6 }}>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {hours.map((hour) => (
          <Grid
            key={hour.id}
            size={{ xs: 12, sm: 6, md: 3 }}
            sx={{ order: { xs: hour.id, sm: hour.id === 1 ? 3 : hour.id, md: hour.id } }}
          >
            <Stack
              sx={{
                height: 1,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h6" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                {hour.value}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                {hour.name}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default HoursSummary;
