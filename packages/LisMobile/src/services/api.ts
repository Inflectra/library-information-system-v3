import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Author,
  AuthorCreationParams,
  AuthorUpdateParams,
  Book,
  BookCreationParams,
  BookUpdateParams,
  Genre,
  GenreCreationParams,
  User,
  UserWithToken,
  UserUpdateParams,
  ApiError,
} from '../types/api';
import { API_BASE_URL } from '../config/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('auth_token');
    }
    return this.token;
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ errorMessage: 'Network error' }));
      throw new Error(errorData.errorMessage || `HTTP ${response.status}`);
    }

    // Check if response has content
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');
    
    // If no content or content-length is 0, return empty object for successful operations
    if (contentLength === '0' || !contentType?.includes('application/json')) {
      return {} as T;
    }

    // Try to parse JSON, but handle empty responses gracefully
    const text = await response.text();
    if (!text.trim()) {
      return {} as T;
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      // If JSON parsing fails but response was successful, return empty object
      return {} as T;
    }
  }

  private async makeDeleteRequest(endpoint: string): Promise<void> {
    const token = await this.getToken();
    
    const config: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage || `HTTP ${response.status}`);
      } catch (parseError) {
        // If we can't parse the error response, check for common HTTP status codes
        if (response.status === 405) {
          throw new Error('Cannot delete: This item is referenced by other records');
        } else if (response.status === 404) {
          throw new Error('Item not found');
        } else if (response.status === 403) {
          throw new Error('Permission denied');
        } else {
          throw new Error(`Delete failed: HTTP ${response.status}`);
        }
      }
    }
    
    // Delete successful, no need to parse response
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<UserWithToken> {
    const credentials = btoa(`${username}:${password}`);
    
    const response = await fetch(`${this.baseURL}/users/login`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ errorMessage: 'Login failed' }));
      throw new Error(errorData.errorMessage || 'Login failed');
    }

    const userData = await response.json();
    await this.setToken(userData.token);
    return userData;
  }

  async logout(): Promise<boolean> {
    try {
      const result = await this.makeRequest<boolean>('/users/logout');
      await this.clearToken();
      return result;
    } catch (error) {
      await this.clearToken();
      throw error;
    }
  }

  async keepAlive(): Promise<boolean> {
    return this.makeRequest<boolean>('/users/keepalive');
  }

  // Authors endpoints
  async getAuthors(): Promise<Author[]> {
    return this.makeRequest<Author[]>('/authors');
  }

  async getAuthor(idOrName: string | number): Promise<Author> {
    return this.makeRequest<Author>(`/authors/${idOrName}`);
  }

  async findAuthors(namePart?: string): Promise<Author[]> {
    const query = namePart ? `?namePart=${encodeURIComponent(namePart)}` : '';
    return this.makeRequest<Author[]>(`/authors/find${query}`);
  }

  async createAuthor(author: AuthorCreationParams): Promise<Author> {
    return this.makeRequest<Author>('/authors', {
      method: 'POST',
      body: JSON.stringify(author),
    });
  }

  async updateAuthor(author: AuthorUpdateParams): Promise<Author> {
    return this.makeRequest<Author>('/authors', {
      method: 'PUT',
      body: JSON.stringify(author),
    });
  }

  async deleteAuthor(id: number): Promise<void> {
    await this.makeDeleteRequest(`/authors/${id}`);
  }

  async getAuthorsCount(): Promise<number> {
    return this.makeRequest<number>('/authors/count');
  }

  // Books endpoints
  async getBooks(): Promise<Book[]> {
    return this.makeRequest<Book[]>('/books');
  }

  async getBook(idOrName: string | number): Promise<Book> {
    return this.makeRequest<Book>(`/books/${idOrName}`);
  }

  async findBooks(namePart?: string): Promise<Book[]> {
    const query = namePart ? `?namePart=${encodeURIComponent(namePart)}` : '';
    return this.makeRequest<Book[]>(`/books/find${query}`);
  }

  async createBook(book: BookCreationParams): Promise<Book> {
    return this.makeRequest<Book>('/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  }

  async updateBook(book: BookUpdateParams): Promise<Book> {
    return this.makeRequest<Book>('/books', {
      method: 'PUT',
      body: JSON.stringify(book),
    });
  }

  async deleteBook(id: number): Promise<void> {
    await this.makeDeleteRequest(`/books/${id}`);
  }

  async getBooksCount(): Promise<number> {
    return this.makeRequest<number>('/books/count');
  }

  // Genres endpoints
  async getGenres(): Promise<Genre[]> {
    return this.makeRequest<Genre[]>('/genres');
  }

  async getGenre(idOrName: string | number): Promise<Genre> {
    return this.makeRequest<Genre>(`/genres/${idOrName}`);
  }

  async createGenre(genre: GenreCreationParams): Promise<Genre> {
    return this.makeRequest<Genre>('/genres', {
      method: 'POST',
      body: JSON.stringify(genre),
    });
  }

  async deleteGenre(id: number): Promise<void> {
    await this.makeDeleteRequest(`/genres/${id}`);
  }

  async getGenresCount(): Promise<number> {
    return this.makeRequest<number>('/genres/count');
  }

  // Users endpoints
  async getUsers(): Promise<User[]> {
    return this.makeRequest<User[]>('/users');
  }

  async getUser(username: string): Promise<User> {
    return this.makeRequest<User>(`/users/${username}`);
  }

  async createUser(user: User): Promise<User | boolean> {
    return this.makeRequest<User | boolean>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(user: UserUpdateParams): Promise<User | boolean> {
    return this.makeRequest<User | boolean>('/users/update', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // Test endpoints
  async selfTest(): Promise<string> {
    return this.makeRequest<string>('/users/test');
  }

  async getOrg(): Promise<string> {
    return this.makeRequest<string>('/users/org');
  }
}

export const apiService = new ApiService();