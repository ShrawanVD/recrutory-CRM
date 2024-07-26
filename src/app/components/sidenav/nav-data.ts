export const navbarData = [
  {
    routeLink: 'client',
    icon: 'fas fa-chart-bar', // changed 'fal' to 'fas'
    label: 'Clients'
  },
  {
    routeLink: 'master',
    icon: 'fas fa-list',
    label: 'Master-Sheet'
  },
  {
    routeLink: 'todays-task',
    icon: 'fas fa-tasks',
    label: `Today's-Task`
  },
  {
    routeLink: 'selected',
    icon: 'fas fa-check',
    label: 'Selected-Sheet'
  },
  {
    routeLink: 'add-member',
    icon: 'fas fa-user-plus', // changed 'fal' to 'fas'
    label: 'Add Member',
    isAdmin: true
  },
  {
    routeLink: 'settings',
    icon: 'fas fa-cog', // changed 'fal' to 'fas'
    label: 'Settings'
  }
];