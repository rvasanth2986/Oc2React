import { withNavigationWatcher } from './contexts/navigation';
import { HomePage, PathTestPage, PathViewPage, probesregionconfig } from './pages';


const routes = [
  {
    path: '/probes',
    component: probesregionconfig
  },
  {
    path: '/pathtest',
    component: PathTestPage
  },
  {
    path: '/home',
    component: HomePage
  },
  {
    path: '/pathview',
    component: PathViewPage
  }
];

export default routes.map(route => {
  return {
    ...route,
    component: withNavigationWatcher(route.component)
  };
});
