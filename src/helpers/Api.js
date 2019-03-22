import axios from 'axios';

const BACKEND_URL = 'https://api-m.marmeladies.com/v1/';
const TEST_TOKEN = 'BqxKJPW-BrOQA3YbNwp54gFaNcpnO9Iv';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    Authorization: `Bearer ${TEST_TOKEN}`,
  },
});

export default api;
