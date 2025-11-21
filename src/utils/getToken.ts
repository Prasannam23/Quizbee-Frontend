
export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  console.log(`Cookie ${name} value:`, match ? match[2] : 'not found');
  return match ? match[2] : null;
};
