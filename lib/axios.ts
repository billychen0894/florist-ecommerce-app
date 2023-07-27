import axios from 'axios';

const BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosWithAuth = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
