import api from './api';

export const forgotPassword = async (data) => {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
};
