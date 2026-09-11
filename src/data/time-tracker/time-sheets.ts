type TimeSheet = {
  id: number;
  project: {
    name: string;
    task: string;
  };
  client: string;
  billable: boolean;
  activity: number;
  idle: number;
  manual: number;
  time: {
    start: string;
    end: string;
  };
  duration: number;
  weeklyTimes: {
    sunday: number;
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
  };
  total: number;
  monthlyTimes: {
    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;
  };
};

const timeSheets: TimeSheet[] = [
  {
    id: 1,
    project: {
      name: 'Website Redesign',
      task: 'Create wireframes',
    },
    client: 'Acme Corp',
    billable: true,
    activity: 50,
    idle: 8,
    manual: 2,
    time: {
      start: '8:00 am',
      end: '9:00 am',
    },
    duration: 9009,
    weeklyTimes: {
      sunday: 18000,
      monday: 16200,
      tuesday: 12600,
      wednesday: 21600,
      thursday: 7200,
      friday: 15300,
      saturday: 11700,
    },
    total: 30600,
    monthlyTimes: {
      january: 18000,
      february: 16200,
      march: 12600,
      april: 21600,
      may: 7200,
      june: 15300,
      july: 8100,
      august: 9000,
      september: 9300,
      october: 12000,
      november: 9900,
      december: 21300,
    },
  },
  {
    id: 2,
    project: {
      name: 'Mobile App Development',
      task: 'Build login and auth module',
    },
    client: 'ZenMobile',
    billable: true,
    activity: 50,
    idle: 8,
    manual: 2,
    time: {
      start: '8:30 am',
      end: '9:30 am',
    },
    duration: 7200,
    weeklyTimes: {
      sunday: 9015,
      monday: 13550,
      tuesday: 15330,
      wednesday: 18045,
      thursday: 26410,
      friday: 29725,
      saturday: 28300,
    },
    total: 43200,
    monthlyTimes: {
      january: 18000,
      february: 16200,
      march: 12600,
      april: 21600,
      may: 7200,
      june: 15300,
      july: 12600,
      august: 9900,
      september: 9300,
      october: 12000,
      november: 9000,
      december: 11700,
    },
  },
  {
    id: 3,
    project: {
      name: 'Content Marketing',
      task: 'Plan Q2 blog topics',
    },
    client: 'Internal',
    billable: false,
    activity: 75,
    idle: 12,
    manual: 5,
    time: {
      start: '1:00 pm',
      end: '2:00 pm',
    },
    duration: 4500,
    weeklyTimes: {
      sunday: 9015,
      monday: 13550,
      tuesday: 15330,
      wednesday: 18045,
      thursday: 26410,
      friday: 30925,
      saturday: 27935,
    },
    total: 43200,
    monthlyTimes: {
      january: 18000,
      february: 16200,
      march: 12600,
      april: 21600,
      may: 7200,
      june: 15300,
      july: 12600,
      august: 9900,
      september: 9300,
      october: 12000,
      november: 9000,
      december: 11700,
    },
  },
  {
    id: 4,
    project: {
      name: 'Lead Gen Campaign',
      task: 'Set up tracking in Google Analytics',
    },
    client: 'Brightleaf Tech',
    billable: false,
    activity: 50,
    idle: 8,
    manual: 2,
    time: {
      start: '10:00 am',
      end: '11:00 am',
    },
    duration: 2700,
    weeklyTimes: {
      sunday: 5415,
      monday: 9045,
      tuesday: 13515,
      wednesday: 16200,
      thursday: 22520,
      friday: 27935,
      saturday: 3600,
    },
    total: 36000,
    monthlyTimes: {
      january: 18000,
      february: 16200,
      march: 12600,
      april: 21600,
      may: 7200,
      june: 15300,
      july: 12600,
      august: 18000,
      september: 9300,
      october: 12000,
      november: 11700,
      december: 9000,
    },
  },
  {
    id: 5,
    project: {
      name: 'CRM Implementation',
      task: 'Set up automation and workflows',
    },
    client: 'NexaTech',
    billable: true,
    activity: 75,
    idle: 12,
    manual: 5,
    time: {
      start: '11:00 am',
      end: '12:00 am',
    },
    duration: 11700,
    weeklyTimes: {
      sunday: 9015,
      monday: 13515,
      tuesday: 16245,
      wednesday: 6220,
      thursday: 18610,
      friday: 9000,
      saturday: 7500,
    },
    total: 26750,
    monthlyTimes: {
      january: 18000,
      february: 16200,
      march: 12600,
      april: 21600,
      may: 7200,
      june: 15300,
      july: 8700,
      august: 7060,
      september: 7800,
      october: 13200,
      november: 14700,
      december: 9900,
    },
  },
  {
    id: 6,
    project: {
      name: 'Sprint Q2 - Product Build',
      task: 'Develop dashboard module',
    },
    client: 'Internal',
    billable: true,
    activity: 75,
    idle: 15,
    manual: 5,
    time: {
      start: '7:00 am',
      end: '8:00 am',
    },
    duration: 10800,
    weeklyTimes: {
      sunday: 9015,
      monday: 13515,
      tuesday: 16245,
      wednesday: 18000,
      thursday: 4810,
      friday: 10225,
      saturday: 13200,
    },
    total: 26100,
    monthlyTimes: {
      january: 18000,
      february: 16200,
      march: 12600,
      april: 21600,
      may: 7200,
      june: 15300,
      july: 14400,
      august: 15300,
      september: 10800,
      october: 13500,
      november: 16200,
      december: 7200,
    },
  },
  {
    id: 7,
    project: {
      name: 'Sprint Q2 - Product Build',
      task: 'Develop dashboard module',
    },
    client: 'UrbanSpace Interiors',
    billable: true,
    activity: 50,
    idle: 8,
    manual: 2,
    time: {
      start: '3:00 pm',
      end: '4:00 pm',
    },
    duration: 1800,
    weeklyTimes: {
      sunday: 9015,
      monday: 13515,
      tuesday: 5445,
      wednesday: 15610,
      thursday: 7555,
      friday: 17400,
      saturday: 900,
    },
    total: 36000,
    monthlyTimes: {
      january: 18000,
      february: 16200,
      march: 12600,
      april: 21600,
      may: 7200,
      june: 15300,
      july: 9000,
      august: 7060,
      september: 7800,
      october: 13200,
      november: 14700,
      december: 9900,
    },
  },
];

export { timeSheets };
export type { TimeSheet };
