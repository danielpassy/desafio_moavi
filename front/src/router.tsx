import HistoricoColabodores from '@/pages/historico/historico-colaboradores';
import HomePage from '@/pages/home/home-page';
import UploadedFiles from '@/pages/registros/uploaded-files';
import { createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import NavBar from '@/components/nav-bar';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <NavbarWrapper />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/uploaded-files',
        element: <UploadedFiles />,
      },
      {
        path: '/historico-colaboradores',
        element: <HistoricoColabodores />,
      },
    ],
  },
]);

function NavbarWrapper() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
