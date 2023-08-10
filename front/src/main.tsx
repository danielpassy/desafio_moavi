import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { SnackBarContextProvider } from '@/hooks/snack-context';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SnackBar from '@/components/snack-bar';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SnackBarContextProvider>
        <SnackBar />
        {/* <NavBar /> */}
        <RouterProvider router={router} />
      </SnackBarContextProvider>
    </LocalizationProvider>
  </StrictMode>,
);
