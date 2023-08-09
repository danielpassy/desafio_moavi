import HomePage from '@/pages/home/home-page';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
]);
