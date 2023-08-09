import axios from 'axios';

const AxiosClient = axios.create({
  baseURL: 'http://localhost:8000/api/',
  xsrfHeaderName: 'X-CSRFToken',
  xsrfCookieName: 'csrftoken',
  withCredentials: true,
});

AxiosClient.defaults.headers.common['Content-Type'] = 'application/json';

export function mockasync(data: any) {
  data = JSON.parse(JSON.stringify(data));
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data }), 600);
  });
}

export default AxiosClient;
