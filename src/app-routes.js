import { withNavigationWatcher } from './contexts/navigation';
import { HomePage, PathTestPage, PathViewPage, probesregionconfig, customerconfig} from './pages';


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
  },
  {
    path: '/customer',
    component: customerconfig
  }
];

export default routes.map(route => {
  return {
    ...route,
    component: withNavigationWatcher(route.component)
  };
});
