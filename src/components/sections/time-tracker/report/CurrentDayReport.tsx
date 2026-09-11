import type { CSSProperties, Ref } from 'react';
import { useMemo, useRef } from 'react';
import type { ButtonBaseProps, SxProps, Theme } from '@mui/material';
import { Box, ButtonBase, Divider, Paper, Stack, Typography, useTheme } from '@mui/material';
import { currentDayReport } from 'data/time-tracker/report';
import dayjs from 'dayjs';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import useToggleChartLegends from 'hooks/useToggleChartLegends';
import { formatCompactNumber, secondsToHms } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { useSettingsContext } from 'providers/SettingsProvider';
import ReactEchart from 'components/base/ReactEchart';

echarts.use([TooltipComponent, GridComponent, PieChart, CanvasRenderer, LegendComponent]);

interface CurrentDayReportProps {
  data: typeof currentDayReport;
}

const chartLegends = [
  { label: 'Billable', value: currentDayReport.hours.billable, color: 'chBlue.400' },
  {
    label: 'Non-Billable',
    value: currentDayReport.hours.nonBillable,
    color: 'chBlue.200',
  },
];

type ReportItemProps = {
  label: string;
  value: string | number;
  align: CSSProperties['alignItems'];
};

const ReportItem = ({ label, value, align }: ReportItemProps) => {
  return (
    <Stack sx={{ gap: 0.5, alignItems: { xs: align, md: 'flex-end' } }}>
      <Typography
        variant="subtitle2"
        sx={{
          fontSize: { xs: 'caption.fontSize', sm: 'subtitle2.fontSize' },
          color: 'text.secondary',
          textWrap: { sm: 'nowrap' },
          textAlign: 'center',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, textWrap: { sm: 'nowrap' }, textAlign: 'center' }}
      >
        {value}
      </Typography>
    </Stack>
  );
};

const CurrentDayReport = ({ data }: CurrentDayReportProps) => {
  const chartRef = useRef<null | EChartsReactCore>(null);
  const { down } = useBreakpoints();
  const { legendState, handleLegendToggle } = useToggleChartLegends(chartRef);
  const today = dayjs();
  const downMd = down('md');

  return (
    <Stack sx={{ gap: 4 }}>
      <Typography variant="h5">Report of {today.format('ddd, D MMM, YYYY')}</Typography>
      <Paper background={1} sx={{ outline: 0, p: { xs: 2, sm: 3 }, borderRadius: 6 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          divider={downMd && <Divider flexItem />}
          sx={{ gap: 2, justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Stack
            direction="row"
            sx={{
              width: 1,
              gap: 3,
              alignItems: 'center',
              justifyContent: { xs: 'space-between', md: 'normal' },
            }}
          >
            <BillableHoursChart
              ref={chartRef}
              hours={data.hours}
              sx={{ width: 80, height: '80px !important' }}
            />
            <Stack sx={{ gap: 1, flexGrow: { xs: 1, md: 0 } }}>
              {chartLegends.map(({ label, value, color }) => (
                <LegendButton
                  key={label}
                  label={label}
                  value={value}
                  color={color}
                  onClick={() => handleLegendToggle(label)}
                  sx={{ opacity: legendState[label] ? 0.5 : 1 }}
                />
              ))}
            </Stack>
          </Stack>
          <Stack
            direction="row"
            sx={{
              gap: { xs: 1, sm: 3, lg: 5 },
              justifyContent: { xs: 'space-between' },
              width: 1,
            }}
          >
            <ReportItem
              label="Projects"
              align="flex-start"
              value={currentDayReport.totalProjects}
            />
            <ReportItem
              label="Hours"
              align="flex-start"
              value={`${secondsToHms(
                currentDayReport.hours.billable + currentDayReport.hours.nonBillable,
              )} Hrs`}
            />
            <ReportItem
              label="Earnings"
              align="flex-end"
              value={`$ ${formatCompactNumber(currentDayReport.totalAmount)}`}
            />
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
};

interface BillableHoursChartProps {
  ref?: Ref<null | EChartsReactCore>;
  hours: (typeof currentDayReport)['hours'];
  sx?: SxProps<Theme>;
}

const BillableHoursChart = ({ ref, hours, sx }: BillableHoursChartProps) => {
  const { vars } = useTheme();
  const { getThemeColor } = useSettingsContext();
  const data = [
    { name: 'Billable', value: hours.billable },
    { name: 'Non-Billable', value: hours.nonBillable },
  ];

  const getOptions = useMemo(
    () => ({
      tooltip: { show: false },
      legend: { show: false },
      color: [getThemeColor(vars.palette.chBlue[400]), getThemeColor(vars.palette.chBlue[200])],
      series: [
        {
          type: 'pie',
          radius: ['65%', '95%'],
          itemStyle: { borderRadius: 0 },
          startAngle: 50,
          label: { show: false },
          emphasis: {
            scaleSize: 0,
            label: { show: true, fontWeight: 'bold', formatter: '{d}%' },
          },
          labelLine: { show: false },
          data: data,
        },
      ],
      grid: { outerBoundsMode: 'same', outerBoundsContain: 'axisLabel' },
    }),
    [vars.palette, getThemeColor, data],
  );

  return <ReactEchart ref={ref} echarts={echarts} option={getOptions} sx={sx} />;
};

interface LegendButtonProps extends ButtonBaseProps {
  label: string;
  value: number;
  color: string;
}

const LegendButton = ({ label, value, color, sx, ...rest }: LegendButtonProps) => {
  return (
    <ButtonBase
      disableRipple
      sx={{
        width: 1,
        gap: 2,
        justifyContent: 'normal',
        ...sx,
      }}
      {...rest}
    >
      <Box sx={{ width: 4, height: 22, bgcolor: color, borderRadius: 0.5 }} />
      <Stack direction="row" sx={{ gap: 1.5, width: 1, justifyContent: 'space-between' }}>
        <Typography
          variant="body2"
          noWrap
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            textAlign: 'start',
            textOverflow: 'ellipsis',
            minWidth: 85,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          noWrap
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            textAlign: 'end',
            textOverflow: 'ellipsis',
          }}
        >
          {secondsToHms(value, true)}
        </Typography>
      </Stack>
    </ButtonBase>
  );
};

export default CurrentDayReport;
