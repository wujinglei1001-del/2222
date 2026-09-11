const currentDayReport = {
  hours: {
    billable: 144000,
    nonBillable: 18000,
  },
  totalProjects: 10,
  totalAmount: 7200000,
};

export type TotalAmount = {
  id: number;
  project: {
    name: string;
    task: string;
    color: string;
  };
  totalHours: number;
  billableHours: number;
  amount: number;
};

const totalAmountDetails: TotalAmount[] = [
  {
    id: 1,
    project: {
      name: 'Website Redesign',
      task: 'Create wireframes',
      color: 'chBlue.400',
    },
    totalHours: 14400,
    billableHours: 4530,
    amount: 12450,
  },
  {
    id: 2,
    project: {
      name: 'Mobile App Development',
      task: 'Build login and auth module',
      color: 'chBlue.200',
    },
    totalHours: 12645,
    billableHours: 15615,
    amount: 9999,
  },
  {
    id: 3,
    project: {
      name: 'Content Marketing',
      task: 'Plan Q2 blog topics',
      color: 'chRed.200',
    },
    totalHours: 4530,
    billableHours: 21300,
    amount: 11300,
  },
  {
    id: 4,
    project: {
      name: 'Lead Gen Campaign',
      task: 'Set up tracking in Google Analytics',
      color: 'chOrange.100',
    },
    totalHours: 24625,
    billableHours: 9910,
    amount: 10200,
  },
  {
    id: 5,
    project: {
      name: 'Sprint Q2 - Product Build',
      task: 'Develop dashboard module',
      color: 'chLightBlue.200',
    },
    totalHours: 9915,
    billableHours: 12645,
    amount: 8750,
  },
  {
    id: 6,
    project: {
      name: 'Sprint Q2 - Product Build',
      task: 'Develop dashboard module',
      color: 'chLightBlue.100',
    },
    totalHours: 18910,
    billableHours: 22225,
    amount: 7900,
  },
  {
    id: 7,
    project: {
      name: 'Prospect Engagement Initiative',
      task: 'Set up tracking in Google Analytics',
      color: 'chGreen.200',
    },
    totalHours: 24624,
    billableHours: 9910,
    amount: 10200,
  },
];

export { currentDayReport, totalAmountDetails };
