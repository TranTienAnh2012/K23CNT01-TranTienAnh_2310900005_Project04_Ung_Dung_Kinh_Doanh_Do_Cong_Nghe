import axios from './tta_axios';

export const authApi = {
  login: (data) => axios.post('/api/tta_auth/login', data),
};
