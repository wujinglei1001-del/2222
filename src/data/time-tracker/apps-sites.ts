import { initialConfig } from 'config';

const logo = (index: number) => `${initialConfig.assetsDir}/images/logo/${index}.svg`;

type SiteData = {
  id: number;
  name: string;
  logo: string;
  link: string;
  hours: number;
  progress: number;
};

type AppsSitesHour = {
  id: number;
  project: string;
  task: string;
  sites: Array<SiteData>;
};

const appsSitesHours: Array<AppsSitesHour> = [
  {
    id: 1,
    project: 'Website Redesign',
    task: 'Create wireframes',
    sites: [
      {
        id: 1,
        name: 'Google',
        logo: logo(30),
        link: 'https://www.google.com/search?gs_ssp=eJzj4tTP1TcwMU02T1JgNGB0YPBiS8_PT89JBQBASQXT&q=google&rlz=1C1GCEU_enBD1160BD1160&oq=goo&gs_lcrp=EgZjaHJvbWUqEwgBEC4YgwEYxwEYsQMY0QMYgAQyBggAEEUYOTITCAEQLhiDARjHARixAxjRAxiABDIGCAIQRRg7MgYIAxBFGDsyDAgEECMYJxiABBiKBTINCAUQABiDARixAxiABDINCAYQABiDARixAxiABDIHCAcQABiPAjIHCAgQABiPAtIBCTMyODdqMGoxNagCCLACAfEFPHB291ZuLsI&sourceid=chrome&ie=UTF-8',
        hours: 7210,
        progress: 75,
      },
      {
        id: 2,
        name: 'Behance',
        logo: logo(31),
        link: 'https://www.behance.net/search/projects?search=creative+design',
        hours: 5405,
        progress: 90,
      },
      {
        id: 3,
        name: 'Dribble',
        logo: logo(32),
        link: 'https://dribbble.com/search?q=design&source=header',
        hours: 3600,
        progress: 65,
      },
      {
        id: 4,
        name: 'Facebook',
        logo: logo(34),
        link: 'https://www.facebook.com/search/top?q=facebook',
        hours: 2700,
        progress: 88,
      },
      {
        id: 5,
        name: 'Outlook',
        logo: logo(33),
        link: 'https://outlook.live.com/',
        hours: 900,
        progress: 95,
      },
      {
        id: 6,
        name: 'ThemeWagon',
        logo: logo(35),
        link: 'https://themewagon.com/themes/',
        hours: 10510,
        progress: 70,
      },
      {
        id: 7,
        name: 'MailBluster',
        logo: logo(36),
        link: 'https://www.mailbluster.com/search?query=mailbluster&source=chrome&lang=en',
        hours: 6315,
        progress: 82,
      },
    ],
  },
  {
    id: 2,
    project: 'Lead Gen Campaign',
    task: 'Set up tracking in Google Analytics',
    sites: [
      {
        id: 1,
        name: 'Google',
        logo: logo(30),
        link: 'https://www.google.com/search?gs_ssp=eJzj4tTP1TcwMU02T1JgNGB0YPBiS8_PT89JBQBASQXT&q=google&rlz=1C1GCEU_enBD1160BD1160&oq=goo&gs_lcrp=EgZjaHJvbWUqEwgBEC4YgwEYxwEYsQMY0QMYgAQyBggAEEUYOTITCAEQLhiDARjHARixAxjRAxiABDIGCAIQRRg7MgYIAxBFGDsyDAgEECMYJxiABBiKBTINCAUQABiDARixAxiABDINCAYQABiDARixAxiABDIHCAcQABiPAjIHCAgQABiPAtIBCTMyODdqMGoxNagCCLACAfEFPHB291ZuLsI&sourceid=chrome&ie=UTF-8',
        hours: 7210,
        progress: 75,
      },
      {
        id: 2,
        name: 'ThemeWagon',
        logo: logo(35),
        link: 'https://themewagon.com/themes/',
        hours: 10510,
        progress: 70,
      },
      {
        id: 3,
        name: 'Dribble',
        logo: logo(32),
        link: 'https://dribbble.com/search?q=design&source=header',
        hours: 3600,
        progress: 65,
      },
      {
        id: 4,
        name: 'Behance',
        logo: logo(31),
        link: 'https://www.behance.net/search/projects?search=creative+design',
        hours: 5405,
        progress: 90,
      },
    ],
  },
];

export { appsSitesHours };
export type { AppsSitesHour, SiteData };
