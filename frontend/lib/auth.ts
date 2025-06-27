export function getAuthToken() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('API_TOKEN');
    if (token) return token;
  }
  return process.env.NEXT_PUBLIC_API_TOKEN || '';
}

export function isTokenConfigured() {
  return !!getAuthToken();
}