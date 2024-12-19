import { createBrowserRouter } from 'react-router-dom';
import TableSelectDemo from '../pages/TableSelectDemo';
import Users from '../pages/Users';
import UserGroups from '../pages/UserGroups';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Users />,
  },
  {
    path: '/table-select',
    element: <TableSelectDemo />,
  },
  {
    path: '/users/groups',
    element: <UserGroups />,
  }
]);

export default router;
