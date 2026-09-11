import dayjs, { ManipulateType, OpUnitType } from 'dayjs';

export interface GanttTask {
  id: number;
  label: string;
  from: number;
  to: number;
  resourceId: number;
  amountDone?: number;
  classes?: string[];
  children?: GanttTask[];
  expanded?: boolean;
  draggable?: boolean;
  resizable?: boolean;
}

export interface GanttRow {
  id: number;
  label: string;
  classes?: string;
  expanded?: boolean;
  children?: GanttRow[];
  class?: string;
  iconClass?: string;
  headerHtml?: string;
  draggable?: boolean;
}

const base = dayjs().startOf('day');
export const time = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return base.hour(h).minute(m).valueOf();
};

export const currentStart = time('06:00');
export const currentEnd = time('18:00');

// export const ganttTimeRanges = [
//   {
//     id: 0,
//     from: time('10:00'),
//     to: time('12:00'),
//     classes: null,
//     label: 'Lunch',
//     resizable: false,
//   },
//   {
//     id: 1,
//     from: time('15:00'),
//     to: time('17:00'),
//     classes: null,
//     label: 'Dinner',
//   },
// ];

export const ganttRows: GanttRow[] = [
  {
    id: 10,
    label: 'Accounting',
    // class: 'row-group',
    iconClass: 'fas fa-calculator',
    // Parent rows (level-0) should not be draggable
    children: [
      {
        id: 11,
        label: 'Petunia Mulliner',
        // classes: 'row-gradient',
        draggable: true,
      },
      {
        id: 12,
        label: 'temp Giacovetti',
        draggable: true,
      },
      {
        id: 13,
        label: 'Marlène Lasslett',
        classes: 'row-highlight',
        draggable: true,
      },
      {
        id: 14,
        label: 'Adda Youell',
        draggable: true,
      },
      // {
      //   id: 15,
      //   label: 'Drop Zone - Accounting',
      //   classes: 'drop-zone-hidden',
      //   draggable: false,
      // },
    ],
  },
  {
    id: 20,
    label: 'Business Development',
    class: 'row-group',
    iconClass: 'fas fa-user-tie',
    // Parent rows (level-0) should not be draggable
    children: [
      {
        id: 21,
        label: 'Pietra Fallow',
        draggable: true,
      },
      {
        id: 22,
        label: 'Mariellen Torbard',
        draggable: true,
      },
      {
        id: 23,
        label: 'Renate Humbee',
        draggable: true,
      },
    ],
  },
  {
    id: 30,
    label: 'Engineering',
    class: 'row-group',
    iconClass: 'fas fa-cogs',
    children: [
      {
        id: 31,
        label: 'Alex Chen',
        draggable: true,
      },
      {
        id: 32,
        label: 'Sarah Johnson',
        draggable: true,
      },
      {
        id: 33,
        label: 'Mike Rodriguez',
        draggable: true,
      },
    ],
  },
];

export const ganttTasks: GanttTask[] = [
  {
    id: 1,
    resourceId: 11,
    label: 'LPCVD',
    from: time('9:00'),
    to: time('11:00'),
    draggable: true,
    resizable: true,
  },
  {
    id: 2,
    resourceId: 12,
    label: 'Entrepreneurship',
    from: time('10:00'),
    to: time('12:30'),
    draggable: true,
    resizable: true,
  },
  {
    id: 3,
    resourceId: 13,
    label: 'PET-CT',
    from: time('13:30'),
    to: time('15:00'),
    draggable: true,
    resizable: true,
  },
  {
    id: 4,
    resourceId: 14,
    label: 'Auditing',
    from: time('9:30'),
    to: time('11:30'),
    draggable: true,
    resizable: true,
  },
  {
    id: 5,
    resourceId: 21,
    label: 'Security Clearance',
    from: time('15:15'),
    to: time('16:00'),
    draggable: true,
    resizable: true,
  },
  {
    id: 6,
    resourceId: 22,
    label: 'Policy Analysis',
    from: time('14:00'),
    to: time('17:00'),
    draggable: true,
    resizable: true,
  },
  {
    id: 7,
    resourceId: 23,
    label: 'Xbox 360',
    from: time('13:30'),
    to: time('14:30'),
    draggable: true,
    resizable: true,
  },
  {
    id: 8,
    resourceId: 31,
    label: 'Code Review',
    from: time('8:00'),
    to: time('10:00'),
    draggable: true,
    resizable: true,
  },
  {
    id: 9,
    resourceId: 32,
    label: 'API Development',
    from: time('10:30'),
    to: time('13:00'),
    draggable: true,
    resizable: true,
  },
  {
    id: 10,
    resourceId: 33,
    label: 'Testing',
    from: time('13:30'),
    to: time('16:30'),
    draggable: true,
    resizable: true,
  },
];

export const ganttDependencies = [
  // Accounting group dependencies
  {
    id: 1,
    fromId: 1, // LPCVD
    toId: 2, // Entrepreneurship
  },
  {
    id: 2,
    fromId: 2, // Entrepreneurship
    toId: 3, // PET-CT
  },

  {
    id: 3,
    fromId: 4, // Auditing
    toId: 1, // LPCVD
  },

  // Business Development group dependencies
  {
    id: 4,
    fromId: 5, // Security Clearance
    toId: 6, // Policy Analysis
  },
  {
    id: 5,
    fromId: 7, // Xbox 360
    toId: 5, // Security Clearance
  },

  // Engineering group dependencies
  {
    id: 6,
    fromId: 8, // Code Review
    toId: 9, // API Development
  },
  {
    id: 7,
    fromId: 9, // API Development
    toId: 10, // Testing
  },
];

export const ganttCustomDateAdapter = {
  format(date: number, format: string) {
    if (format === 'DD d') {
      const day = dayjs(date);
      const dayNumber = day.format('DD');
      const dayLetter = day.day();

      const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

      return `${dayNumber} ${dayLetters[dayLetter]}`;
    }

    return dayjs(date).format(format);
  },

  roundTo(date: number, unit: OpUnitType, offset: number): number {
    const manipulateUnit: ManipulateType = unit as ManipulateType;

    const roundedDate = dayjs(date)
      .startOf(unit)
      .add(offset - 15, manipulateUnit);
    return roundedDate.valueOf();
  },
};
