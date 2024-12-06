import Cookies from 'js-cookie';

export const getAuthHeaders = async () => {
  const token = Cookies.get('accessToken');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
