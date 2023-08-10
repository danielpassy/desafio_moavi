import HistoricoColabodores from '@/pages/historico/historico-colaboradores';
import HomePage from '@/pages/home/home-page';
import UploadedFiles from '@/pages/registros/uploaded-files';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
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
]);
