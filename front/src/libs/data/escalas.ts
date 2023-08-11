import httpClient from '@/libs/data/http';

export default {
  listUploadedFiles: () => httpClient.get('/files/').then((res) => res.data),
  getEscalas: (initDay: string, endDay: string) =>
    httpClient
      .get('/escalas/', { params: { initDay, endDay } })
      .then((res) => res.data),
  uploadFiles: (files: File[]) => {
    const formData = new FormData();
    formData.append('file', files[0]);
    files.map((file) => formData.append('files', file));
    return httpClient
      .post('/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },
};
