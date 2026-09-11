import { SxProps } from '@mui/material';
import paths from './paths';

export interface SubMenuItem {
  name: string;
  pathName: string;
  key?: string;
  selectionPrefix?: string;
  path?: string;
  active?: boolean;
  icon?: string;
  iconSx?: SxProps;
  items?: SubMenuItem[];
  new?: boolean;
  hasNew?: boolean;
}

export interface MenuItem {
  id: string;
  key?: string;
  subheader: string;
  icon: string;
  iconSx?: SxProps;
  items: SubMenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 'biz',
    subheader: '业务模块',
    icon: 'material-symbols:widgets-outline-rounded',
    items: [
      {
        name: '财务统计',
        path: '/dashboard/finance',
        pathName: 'finance',
        icon: 'material-symbols:finance-mode-outline-rounded',
        active: true,
      },
      {
        name: '多店铺管理',
        path: '/apps/multi-store',
        pathName: 'multi-store',
        icon: 'material-symbols:storefront-outline-rounded',
        active: true,
      },
      {
        name: '快递打单',
        path: '/apps/shipping',
        pathName: 'shipping',
        icon: 'material-symbols:local-shipping-outline-rounded',
        active: true,
      },
      {
        name: '库存管理',
        path: '/apps/inventory',
        pathName: 'inventory',
        icon: 'material-symbols:inventory-2-outline-rounded',
        active: true,
      },
      {
        name: '税务统计',
        path: '/dashboard/tax',
        pathName: 'tax',
        icon: 'material-symbols:receipt-long-outline-rounded',
        active: true,
      },
      {
        name: '电商管理',
        path: paths.ecommerce,
        pathName: 'ecommerce',
        icon: 'material-symbols:shopping-cart-outline-rounded',
        active: true,
      },
    ],
  },
];

export default sitemap;
