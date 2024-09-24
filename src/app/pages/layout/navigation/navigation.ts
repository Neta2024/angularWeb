import { Injectable } from '@angular/core';
import { AuthService } from '../../authentication/auth.service';
import { AuthGuard } from '../../authentication/auth.guard';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  role?: string[];
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  {
    id: 'dashboard',
    title: 'Ginkgo Run',
    type: 'group',
    role: ['ADMIN', 'USER'],
    icon: 'icon-navigation',
    children: [
      // {
      //   id: 'default',
      //   title: 'Demo',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: '/timesheet/default',
      //   icon: 'ti ti-home',
      //   breadcrumbs: false
      // },
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/timesheet/dashboard',
        icon: 'ti ti-dashboard',
        breadcrumbs: true
      },
      {
        id: 'timesheet',
        title: 'Timesheet',
        type: 'item',
        classes: 'nav-item',
        url: '/timesheet/calendar',
        icon: 'ti ti-alarm',
        breadcrumbs: true
      },
      {
        id: 'leavecalendar',
        title: 'Leave Calendar',
        type: 'item',
        classes: 'nav-item',
        url: '/timesheet/leaveCalendar',
        icon: 'ti ti-clipboard',
        breadcrumbs: true
      },
      {
        id: 'holidays',
        title: 'Holidays',
        type: 'item',
        classes: 'nav-item',
        url: '/timesheet/holidays',
        icon: 'ti ti-calendar',
        breadcrumbs: true
      },

      // {
      //   id: 'user management',
      //   title: 'ser management',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: '/timesheet/holidays',
      //   icon: 'ti ti-calendar',
      //   breadcrumbs: true
      // },

      {
        id: 'signout',
        title: 'Sign Out',
        type: 'item',
        classes: 'nav-item',
        url: '/logout',
        icon: 'ti ti-logout',
        breadcrumbs: true
      }
    ]
  },

  {
    id: 'admin',
    title: 'Admin',
    type: 'group',
    role: ['ADMIN'],
    icon: 'icon-navigation',
    children: [
      {
        id: 'management',
        title: 'User Management',
        type: 'item',
        icon: 'ti ti-key',
        classes: 'nav-item',
        url: '/timesheet/user-management',
        breadcrumbs: false,
      }
    ]
  },
  
  // {
  //   id: 'elements',
  //   title: 'Elements',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'typography',
  //       title: 'Typography',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/timesheet/typography',
  //       icon: 'ti ti-typography'
  //     },
  //     {
  //       id: 'color',
  //       title: 'Colors',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/timesheet/color',
  //       icon: 'ti ti-brush'
  //     },
  //     {
  //       id: 'tabler',
  //       title: 'Tabler',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://tabler-icons.io/',
  //       icon: 'ti ti-plant-2',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // },
  // {
  //   id: 'other',
  //   title: 'Other',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/timesheet/sample-page',
  //       classes: 'nav-item',
  //       icon: 'ti ti-brand-chrome'
  //     },
  //     {
  //       id: 'document',
  //       title: 'Document',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://codedthemes.gitbook.io/berry-angular/',
  //       icon: 'ti ti-vocabulary',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // }
];

@Injectable()
export class NavigationItem {
  constructor(private authGuard: AuthGuard){
  }
  get() {
    const userRole = this.authGuard.user?.role.toUpperCase();
    if (userRole === 'USER') {
      NavigationItems.splice(1, 1);
    }

    return NavigationItems;
  }
}
