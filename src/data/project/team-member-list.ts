import { initialConfig } from 'config';
import { users } from 'data/users';

export type TeamMemberRole = 'Admin' | 'Moderator' | 'Member';

export interface TeamMemberListItem {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  designation: string;
  lastActive: string;
  role: TeamMemberRole;
}

export interface TeamMemberListOverview {
  teamName: string;
  teamAvatar?: string;
  createdOn: string;
  owner: {
    name: string;
    avatar?: string;
  };
  totalProjects: number;
  runningProjects: number;
  doneProjects: number;
}

export const teamMemberListOverview: TeamMemberListOverview = {
  teamName: 'ThemeWagon',
  teamAvatar: `${initialConfig.assetsDir}/images/logo/20.svg`,
  createdOn: '24 January, 2024',
  owner: {
    name: 'Tyrion Lannister',
    avatar: users[3]?.avatar,
  },
  totalProjects: 6,
  runningProjects: 4,
  doneProjects: 2,
};

export const teamMemberListData: TeamMemberListItem[] = [
  {
    id: 1,
    name: 'Daenerys Targaryen',
    email: 'daenerys.targaryen@westeros.com',
    avatar: users[0]?.avatar,
    designation: 'Tech Innovator',
    lastActive: '5 seconds ago',
    role: 'Admin',
  },
  {
    id: 2,
    name: 'Jon Snow',
    email: 'jon.snow@thewall.com',
    avatar: users[1]?.avatar,
    designation: 'Experience Guru',
    lastActive: '1 minute ago',
    role: 'Moderator',
  },
  {
    id: 3,
    name: 'Sansa Stark',
    email: 'sansa.stark@winterfell.com',
    avatar: users[2]?.avatar,
    designation: 'Design Wizard',
    lastActive: '3 minutes ago',
    role: 'Member',
  },
  {
    id: 4,
    name: 'Tyrion Lannister',
    email: 'tyrion.lannister@casterlyrock.com',
    avatar: users[3]?.avatar,
    designation: 'Interaction Pro',
    lastActive: '10 seconds ago',
    role: 'Admin',
  },
  {
    id: 5,
    name: 'Arya Stark',
    email: 'arya.stark@bravos.com',
    avatar: users[4]?.avatar,
    designation: 'Product Visionary',
    lastActive: '15 seconds ago',
    role: 'Moderator',
  },
  {
    id: 6,
    name: 'Bran Stark',
    email: 'bran.stark@winterfell.com',
    avatar: users[5]?.avatar,
    designation: 'UX Trailblazer',
    lastActive: '30 seconds ago',
    role: 'Member',
  },
  {
    id: 7,
    name: 'Cersei Lannister',
    email: 'cersei.lannister@king-slanding.com',
    avatar: users[6]?.avatar,
    designation: 'Digital Artist',
    lastActive: '45 seconds ago',
    role: 'Member',
  },
  {
    id: 8,
    name: 'Jaime Lannister',
    email: 'jaime.lannister@casterlyrock.com',
    avatar: users[7]?.avatar,
    designation: 'Creative Designer',
    lastActive: '2 minutes ago',
    role: 'Moderator',
  },
  {
    id: 9,
    name: 'Brienne of Tarth',
    email: 'brienne.tarth@tarth.com',
    avatar: users[8]?.avatar,
    designation: 'Web Designer',
    lastActive: '20 seconds ago',
    role: 'Admin',
  },
  {
    id: 10,
    name: 'Petyr Baelish',
    email: 'petyr.baelish@king-slanding.com',
    avatar: users[9]?.avatar,
    designation: 'Brand Strategist',
    lastActive: '4 minutes ago',
    role: 'Admin',
  },
];
