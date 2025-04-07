import { createBrowserRouter } from 'react-router-dom';
import { CoursesPage } from './pages/CoursesPage';
import { BasketPage } from './pages/BasketPage';
import { MyCoursesPage } from './pages/MyCoursesPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Layout } from './components/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <CoursesPage />,
      },
      {
        path: '/courses',
        element: <CoursesPage />,
      },
      {
        path: '/basket',
        element: <BasketPage />,
      },
      {
        path: '/my-courses',
        element: <MyCoursesPage />,
      },
      {
        path: '/admin',
        element: <AdminDashboard />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
    ],
  },
]); 