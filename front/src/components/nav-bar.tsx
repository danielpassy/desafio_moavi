import { AppBar, Toolbar, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Folder, History, Home, ShowChart, Upload } from '@mui/icons-material';

export default function NavBar() {
  const navigator = useNavigate();

  return (
    <AppBar color="primary" sx={{ position: 'unset', mb: 3 }}>
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          textColor: 'white',
        }}
      >
        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => navigator('/')}
            variant="outlined"
            sx={{ color: ' white' }}
            startIcon={<Upload />}
          >
            Enviar arquivos
          </Button>
          <Button
            onClick={() => navigator('/files')}
            size="large"
            sx={{ color: ' white', m: 'auto' }}
            startIcon={<Folder />}
          >
            Arquivos Enviados
          </Button>
          <Button
            onClick={() => navigator('/grafico')}
            size="large"
            sx={{ color: ' white', m: 'auto' }}
            startIcon={<ShowChart />}
          >
            Gráfico de presença
          </Button>
          <Button
            onClick={() => navigator('/historico')}
            size="large"
            sx={{ color: ' white', m: 'auto' }}
            startIcon={<History />}
          >
            Registro presença
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
