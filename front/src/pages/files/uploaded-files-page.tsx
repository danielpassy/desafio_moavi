import { FileUploadRecord } from '@/libs/data_types/data';
import { useEffect, useState } from 'react';
import api from '@api';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import time_svc from '@/libs/time_svc';
import { useNavigate } from 'react-router-dom';

export default function UploadFilesPage() {
  const [fileUploadRecord, setFileUploadRecord] = useState<FileUploadRecord[]>(
    [],
  );
  const navigator = useNavigate();

  useEffect(() => {
    api.escalas.listUploadedFiles().then((res: any) => {
      console.log(res);
      setFileUploadRecord(res.files);
    });
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Arquivos enviados
      </Typography>
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
              <TableCell>Data de upload </TableCell>
              <TableCell>Número de entradas </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fileUploadRecord.map((file) => (
              <TableRow
                key={file.id}
                sx={{
                  '&:last-child td, &:last-child th': {
                    border: 0,
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {file.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {file.file_name}
                </TableCell>
                <TableCell component="th" scope="row">
                  às {time_svc(file.uploaded_at).format('HH:mm, DD/MM/YYYY')}
                </TableCell>
                <TableCell component="th" scope="row">
                  {file.number_of_entries}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
