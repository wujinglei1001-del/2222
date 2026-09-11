import { type PropsWithChildren, useState } from 'react';
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { TimeField } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';
import { Fragment } from 'react/jsx-runtime';
import IconifyIcon from 'components/base/IconifyIcon';

interface SelectTimeProps extends ButtonProps {
  fromTime: string;
  toTime: string;
}

const SelectTime = ({
  fromTime,
  toTime,
  children,
  sx,
  ...rest
}: PropsWithChildren<SelectTimeProps>) => {
  const today = dayjs();
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState<Dayjs | null>(dayjs(fromTime, 'HH:mm'));
  const [to, setTo] = useState<Dayjs | null>(dayjs(toTime, 'HH:mm'));

  const [handleOpen, handleClose] = [() => setOpen(true), () => setOpen(false)];

  const duration = from && to ? to.diff(from, 'minute') : null;

  const durationValue =
    duration !== null && duration >= 0 ? dayjs().startOf('day').add(duration, 'minute') : null;
  return (
    <Fragment>
      <Button
        variant="soft"
        color="neutral"
        size="large"
        fullWidth
        onClick={handleOpen}
        sx={{ textAlign: 'end', ...sx }}
        {...rest}
      >
        {children}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 6,
              maxWidth: 460,
              width: 1,
            },
          },
        }}
      >
        <DialogTitle
          component="h6"
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box component="span">Select Time</Box>
          <Button shape="circle" color="neutral" onClick={handleClose}>
            <IconifyIcon
              icon="material-symbols:close"
              sx={{ fontSize: 20, color: 'neutral.dark' }}
            />
          </Button>
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Stack sx={{ gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Today, {today.format('DD MMM, YYYY')}
            </Typography>
            <Grid container spacing={2}>
              <Grid container spacing={1} size={8}>
                <Grid size={6}>
                  <TimeField
                    label="From"
                    value={from}
                    onChange={(newValue) => setFrom(newValue)}
                    format="h:mm A"
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid size={6}>
                  <TimeField
                    label="To"
                    value={to}
                    onChange={(newValue) => setTo(newValue)}
                    format="h:mm A"
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
              <Grid size={4}>
                <TimeField
                  label="Duration"
                  format="H:mm"
                  value={durationValue}
                  readOnly
                  slotProps={{
                    textField: { fullWidth: true, slotProps: { htmlInput: { readOnly: true } } },
                  }}
                />
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button color="neutral" size="large" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" size="large" onClick={handleClose}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default SelectTime;
