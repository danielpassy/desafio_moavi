import { Clear } from '@mui/icons-material';
import { Box, Button, Collapse, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';

export default function HomePage() {
  const [file, setFile] = useState<File[]>([]);

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
  return (
    <div>
      <input
        accept=".csv"
        onChange={addFiles}
        className=""
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
      />
      <label htmlFor="raised-button-file">
        <Button
          variant="contained"
          component="span"
          className="{classes.button}"
        >
          Upload
        </Button>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            mb: 4,
            justifyContent: 'end',
          }}
        >
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
        </Box>
      </label>
    </div>
  );
}
