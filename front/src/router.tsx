import { createBrowserRouter } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import NavBar from '@/components/nav-bar';
import Container from '@mui/material/Container';
import HomePage from '@/pages/home/home-page';
import UploadFilesPage from '@/pages/files/uploaded-files-page';
import HistoricoPage from '@/pages/historico/historico-page';
import GraphPage from '@/pages/grafico/graph-page';

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
        path: '/files',
        element: <UploadFilesPage />,
      },
      {
        path: '/grafico',
        element: <GraphPage />,
      },
      {
        path: '/historico',
        element: <HistoricoPage />,
      },
    ],
  },
]);

function NavbarWrapper() {
  return (
    <>
      <NavBar />
      <Container
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </Container>
    </>
  );
}
