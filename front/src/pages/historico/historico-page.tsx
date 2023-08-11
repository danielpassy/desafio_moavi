import { useEffect, useState } from 'react';
import api from '@api';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { EscalaRecord } from '@/libs/data_types/data';
import time_svc from '@/libs/time_svc';
import { DatePicker } from '@mui/x-date-pickers';

export default function HistoricoPage() {
  const [escalas, setEscalas] = useState<EscalaRecord[]>([]);
  const [initialDay, setInitialDay] = useState(time_svc('2023-04-30'));
  const [endDay, setendDay] = useState(time_svc('2023-06-30'));

  useEffect(() => {
    const getData = async () => {
      const res = await api.escalas.getEscalas(
        initialDay.format('YYYY-MM-DD'),
        endDay.format('YYYY-MM-DD'),
      );
      setEscalas(res.escalas);
    };
    getData();
  }, [initialDay, endDay]);

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Registros de entrada e saída
      </Typography>
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}
        >
          <DatePicker
            label="Data Inicial"
            format="DD/MM/YYYY"
            value={initialDay}
            onChange={(newVal) =>
              setInitialDay(newVal ?? time_svc('2023-05-30'))
            }
          />
          <Box sx={{ width: '5vw' }} />
          <DatePicker
            label="Data Final"
            format="DD/MM/YYYY"
            value={endDay}
            onChange={(newVal) => setendDay(newVal ?? time_svc('2023-05-30'))}
          />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table
          sx={{
            minWidth: 650,
          }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Id </TableCell>
              <TableCell>Nome do Arquivo </TableCell>
              <TableCell>Data da marcação </TableCell>
              <TableCell>Registro do colaborador </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {escalas.map((escala) => (
              <TableRow
                key={escala.id}
                sx={{
                  '&:last-child td, &:last-child th': {
                    border: 0,
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {escala.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {escala.file.file_name}
                </TableCell>
                <TableCell component="th" scope="row">
                  às {time_svc(escala.timestamp).format('HH:mm, DD/MM/YYYY')}
                </TableCell>
                <TableCell component="th" scope="row">
                  {escala.matricula_colaborador}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
