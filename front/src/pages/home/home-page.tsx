import { Clear } from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Typography,
  Container,
} from '@mui/material';

import { ChangeEventHandler, useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import api from '@api';
import useSnackbar from '@/hooks/snack-context';

export default function HomePage() {
  const [file, setFile] = useState<File[]>([]);
  const snackbar = useSnackbar();

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const filesArray = Array.from([...file, ...Array.from(fileList)]);
      setFile(filesArray);
    }
  };

  const deleteFile = (targetFile: File) => {
    setFile(file.filter((f) => f !== targetFile));
  };

  const uploadFiles = async () => {
    try {
      await api.escalas.uploadFiles(file);
      setFile([]);
      snackbar.displayMsg('Upload realizado com sucesso', 'success');
    } catch (error: any) {
      console.log(error);
      snackbar.displayMsg(
        `Erro ao realizar upload: ${error.response.data.error}`,
        'error',
      );
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Envie arquivo CSV
      </Typography>

      {inputFileButton(addFiles)}

      {file ? (
        <Box
          sx={{
            my: 2,
            p: 2,
            display: 'inline-block',
            flexDirection: 'row',
            justifyContent: 'beginning',
          }}
        >
          {fileDisplay(file, deleteFile)}
        </Box>
      ) : null}

      <Button
        disabled={file.length === 0}
        onClick={uploadFiles}
        variant="contained"
        component="span"
      >
        Upload
      </Button>
    </>
  );
}
function inputFileButton(
  addFiles: ChangeEventHandler<HTMLInputElement> | undefined,
) {
  return (
    <>
      <input
        accept=".csv"
        onChange={addFiles}
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span">
          Upload
        </Button>
      </label>
    </>
  );
}

function fileDisplay(file: File[], deleteFile: (targetFile: File) => void) {
  return (
    <TransitionGroup>
      {file.map((file) => (
        <Collapse sx={{ my: '8px' }} key={file.name}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption">{file.name}</Typography>
            <IconButton
              onClick={() => {
                deleteFile(file);
              }}
              color="inherit"
              aria-label="trips"
              sx={{ mr: 0 }}
            >
              <Clear />
            </IconButton>
          </Box>
        </Collapse>
      ))}
    </TransitionGroup>
  );
}
