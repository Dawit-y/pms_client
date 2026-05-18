const menuItems = [
  {
    title: 'lookup',
    icon: 'FaCogs',
    permissions: ['lookups.view_lookup', 'lookups.view_lookuptype'],
    submenu: [
      {
        name: 'lookups',
        path: '/lookups',
        permissions: ['lookups.view_lookup'],
      },
      {
        name: 'lookup_types',
        path: '/lookup_types',
        permissions: ['lookups.view_lookuptype'],
      },
      {
        name: 'departments',
        path: '/departments',
        permissions: ['lookups.view_department'],
      },
      {
        name: 'locations',
        path: '/locations',
        permissions: ['locations.view_location'],
      },
    ],
  },
  {
    title: 'project',
    icon: 'FaBriefcase',
    permissions: ['projects.view_project'],
    submenu: [
      {
        name: 'project',
        path: '/project',
        permissions: ['projects.view_project'],
      },
    ],
  },
  {
    title: 'reports',
    icon: 'FaChartBar',
    permissions: ['reports.view_reportjob'],
    submenu: [
      {
        name: 'reports',
        path: '/reports',
        permissions: ['reports.view_reportjob'],
      },
    ],
  },
  {
    title: 'adminstration',
    icon: 'FaUserCog',
    permissions: [
      'accounts.view_user',
      'accounts.view_role',
      'core.view_accesslog',
    ],
    submenu: [
      {
        name: 'users',
        path: '/users',
        permissions: ['accounts.view_user'],
      },
      {
        name: 'roles',
        path: '/roles',
        permissions: ['accounts.view_role'],
      },
      {
        name: 'access_log',
        path: '/access_log',
        permissions: ['core.view_accesslog'],
      },
    ],
  },
];

export { menuItems };
