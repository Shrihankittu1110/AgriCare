export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  const backendBase = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
    : 'https://agricare-mc0n.onrender.com';

  return `${backendBase.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`;
};
