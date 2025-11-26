export const getToken = (): string | null => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token ?? 'not found');
  return token;
};
  