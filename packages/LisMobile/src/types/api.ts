// API Types based on swagger.json

export interface Author {
  id: number;
  name: string;
  age: number;
}

export interface AuthorCreationParams {
  name: string;
  age: number;
  id?: number;
}

export interface AuthorUpdateParams {
  id: number;
  name?: string;
  age?: number;
}

export interface Book {
  id: number;
  name: string;
  author: number;
  genre: number;
  dateAdded?: string;
  outOfPrint?: boolean;
}

export interface BookCreationParams {
  name: string;
  author: number;
  genre: number;
  dateAdded?: string;
  outOfPrint?: boolean;
  id?: number;
}

export interface BookUpdateParams {
  id: number;
  name?: string;
  author?: number;
  genre?: number;
  dateAdded?: string;
  outOfPrint?: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenreCreationParams {
  name: string;
}

export enum Permissions {
  Reader = 1,
  Editor = 2,
  Admin = 3,
  SuperAdmin = 4
}

export interface User {
  username: string;
  password: string;
  name: string;
  active: boolean;
  permission: Permissions;
}

export interface UserWithToken extends User {
  token: string;
}

export interface UserUpdateParams {
  username: string;
  password?: string;
  name?: string;
  active?: boolean;
  permission?: Permissions;
}

export interface ApiError {
  errorMessage: string;
}

// Extended types for UI
export interface BookWithDetails extends Omit<Book, 'author' | 'genre'> {
  authorName?: string;
  genreName?: string;
  author: number;
  genre: number;
}

export interface DashboardStats {
  authorsCount: number;
  booksCount: number;
  genresCount: number;
}