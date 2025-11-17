// API Configuration
// Update this URL to point to your actual API server
export const API_BASE_URL = 'https://v3.libraryinformationsystem.org/api';

// For testing with a local server, you might need to use your computer's IP address
// instead of localhost when running on a physical device
// Example: export const API_BASE_URL = 'http://192.168.1.100:3000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  LOGOUT: '/users/logout',
  KEEP_ALIVE: '/users/keepalive',

  // Authors
  AUTHORS: '/authors',
  AUTHORS_COUNT: '/authors/count',
  AUTHORS_FIND: '/authors/find',

  // Books
  BOOKS: '/books',
  BOOKS_COUNT: '/books/count',
  BOOKS_FIND: '/books/find',

  // Genres
  GENRES: '/genres',
  GENRES_COUNT: '/genres/count',

  // Users
  USERS: '/users',
  USERS_UPDATE: '/users/update',

  // Test
  TEST: '/users/test',
  ORG: '/users/org',
};