import { useState } from 'react';
import { Button, ButtonBase, Stack, inputBaseClasses } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import IconifyIcon from 'components/base/IconifyIcon';

const DateNavigator = () => {
  const [date, setDate] = useState(dayjs());

  const handlePrevDate = () => setDate((prev) => prev.subtract(1, 'day'));
  const handleNextDate = () => setDate((prev) => prev.add(1, 'day'));

  return (
    <Stack
      className="date-navigator-wrapper"
      direction="row"
      sx={{ gap: 1, flexGrow: { xs: 1, sm: 0 }, alignItems: 'center' }}
    >
      <Stack
        className="date-navigator-arrows-wrapper"
        direction="row"
        sx={{ gap: 0.5, alignItems: 'center' }}
      >
        <Button
          className="date-navigator-arrow-prev"
          variant="soft"
          size="small"
          color="neutral"
          shape="circle"
          onClick={handlePrevDate}
        >
          <IconifyIcon
            flipOnRTL
            icon="material-symbols:arrow-back-rounded"
            sx={{ fontSize: 20, color: 'neutral.dark' }}
          />
        </Button>

        <Button
          className="date-navigator-arrow-next"
          variant="soft"
          size="small"
          color="neutral"
          shape="circle"
          onClick={handleNextDate}
        >
          <IconifyIcon
            flipOnRTL
            icon="material-symbols:arrow-forward-rounded"
            sx={{ fontSize: 20, color: 'neutral.dark' }}
          />
        </Button>
      </Stack>
      <DatePicker
        className="date-navigator-date-picker"
        value={date}
        format="dd,DD MMM,YYYY"
        onChange={(date) => setDate(dayjs(date))}
        slots={{
          openPickerButton: ({ sx, ...params }) => (
            <ButtonBase {...params} sx={{ fontSize: 'inherit', ...sx }}>
              <IconifyIcon icon="material-symbols:calendar-month-outline-rounded" />
            </ButtonBase>
          ),
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            sx: {
              minWidth: { sm: 160, md: 164 },
              maxWidth: { sm: 160, md: 200, lg: 250 },
              [`& .${inputBaseClasses.input}:not(.${inputBaseClasses.adornedStart} > .${inputBaseClasses.input})`]:
                { pr: 0 },
            },
          },
        }}
      />
    </Stack>
  );
};

export default DateNavigator;
