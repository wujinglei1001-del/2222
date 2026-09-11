import { LinearProgressProps } from '@mui/material';
import { initialConfig } from 'config';

const image = (index: number) => `${initialConfig.assetsDir}/images/time-tracker/${index}.webp`;

export type Screenshot = {
  id: string;
  timeRange: string;
  active: number;
  activity: { mouse: number; keyboard: number; total: number };
  screenshot: string;
  screens: number;
};

export type ActivityGallery = {
  id: string;
  timeRange: string;
  workedTime: number;
  screenshots: Screenshot[];
};

const activityGallery: ActivityGallery[] = [
  {
    id: '1',
    timeRange: '9:00 am-9:59 am',
    workedTime: 3600,
    screenshots: [
      {
        id: '1-1',
        timeRange: '9:00 am-9:09 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 30 },
        screenshot: image(7),
        screens: 2,
      },
      {
        id: '1-2',
        timeRange: '9:10 am-9:19 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 15 },
        screenshot: image(1),
        screens: 2,
      },
      {
        id: '1-3',
        timeRange: '9:20 am-9:29 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 100 },
        screenshot: image(8),
        screens: 2,
      },
      {
        id: '1-4',
        timeRange: '9:30 am-9:39 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 90 },
        screenshot: image(6),
        screens: 2,
      },
      {
        id: '1-5',
        timeRange: '9:40 am-9:49 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 60 },
        screenshot: image(9),
        screens: 2,
      },
      {
        id: '1-6',
        timeRange: '9:50 am-9:59 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 90 },
        screenshot: image(10),
        screens: 2,
      },
    ],
  },
  {
    id: '2',
    timeRange: '10:00 am-10:59 am',
    workedTime: 3600,
    screenshots: [
      {
        id: '2-1',
        timeRange: '10:00 am-10:09 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 30 },
        screenshot: image(2),
        screens: 2,
      },
      {
        id: '2-2',
        timeRange: '10:10 am-10:19 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 15 },
        screenshot: image(3),
        screens: 2,
      },
      {
        id: '2-3',
        timeRange: '10:20 am-10:29 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 100 },
        screenshot: image(7),
        screens: 2,
      },
      {
        id: '2-4',
        timeRange: '10:30 am-10:39 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 90 },
        screenshot: image(4),
        screens: 2,
      },
      {
        id: '2-5',
        timeRange: '10:40 am-10:49 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 60 },
        screenshot: image(10),
        screens: 2,
      },
      {
        id: '2-6',
        timeRange: '10:50 am-10:59 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 90 },
        screenshot: image(8),
        screens: 2,
      },
    ],
  },
  {
    id: '3',
    timeRange: '11:00 am-11:59 am',
    workedTime: 3600,
    screenshots: [
      {
        id: '3-1',
        timeRange: '11:00 am-11:09 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 30 },
        screenshot: image(1),
        screens: 2,
      },
      {
        id: '3-2',
        timeRange: '11:10 am-11:19 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 15 },
        screenshot: image(2),
        screens: 2,
      },
      {
        id: '3-3',
        timeRange: '11:20 am-11:29 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 100 },
        screenshot: image(3),
        screens: 2,
      },
      {
        id: '3-4',
        timeRange: '11:30 am-11:39 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 90 },
        screenshot: image(4),
        screens: 2,
      },
      {
        id: '3-5',
        timeRange: '11:40 am-11:49 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 60 },
        screenshot: image(5),
        screens: 2,
      },
      {
        id: '3-6',
        timeRange: '11:50 am-11:59 am',
        active: 8,
        activity: { mouse: 100, keyboard: 100, total: 90 },
        screenshot: image(6),
        screens: 2,
      },
    ],
  },
];

const activityPercent = (percent: number): LinearProgressProps['color'] => {
  if (percent < 20) return 'error';
  if (percent < 50) return 'warning';
  return 'success';
};

export { activityGallery, activityPercent };
