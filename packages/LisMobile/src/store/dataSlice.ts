import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
  DashboardStats,
  BookWithDetails
} from '../types/api';
import { apiService } from '../services/api';

export interface DataState {
  // Authors
  authors: Author[];
  authorsLoading: boolean;
  authorsError: string | null;
  
  // Books
  books: Book[];
  booksWithDetails: BookWithDetails[];
  booksLoading: boolean;
  booksError: string | null;
  
  // Genres
  genres: Genre[];
  genresLoading: boolean;
  genresError: string | null;
  
  // Users (admin only)
  users: User[];
  usersLoading: boolean;
  usersError: string | null;
  
  // Dashboard stats
  dashboardStats: DashboardStats | null;
  dashboardLoading: boolean;
  dashboardError: string | null;
}

const initialState: DataState = {
  authors: [],
  authorsLoading: false,
  authorsError: null,
  
  books: [],
  booksWithDetails: [],
  booksLoading: false,
  booksError: null,
  
  genres: [],
  genresLoading: false,
  genresError: null,
  
  users: [],
  usersLoading: false,
  usersError: null,
  
  dashboardStats: null,
  dashboardLoading: false,
  dashboardError: null,
};

// Dashboard thunks
export const fetchDashboardStats = createAsyncThunk(
  'data/fetchDashboardStats',
  async () => {
    const [authorsCount, booksCount, genresCount] = await Promise.all([
      apiService.getAuthorsCount(),
      apiService.getBooksCount(),
      apiService.getGenresCount(),
    ]);
    
    return {
      authorsCount,
      booksCount,
      genresCount,
    };
  }
);

// Author thunks
export const fetchAuthors = createAsyncThunk('data/fetchAuthors', async () => {
  return await apiService.getAuthors();
});

export const createAuthor = createAsyncThunk(
  'data/createAuthor',
  async (author: AuthorCreationParams) => {
    return await apiService.createAuthor(author);
  }
);

export const updateAuthor = createAsyncThunk(
  'data/updateAuthor',
  async (author: AuthorUpdateParams) => {
    return await apiService.updateAuthor(author);
  }
);

export const deleteAuthor = createAsyncThunk(
  'data/deleteAuthor',
  async (id: number) => {
    await apiService.deleteAuthor(id);
    return id;
  }
);

export const searchAuthors = createAsyncThunk(
  'data/searchAuthors',
  async (searchTerm: string) => {
    return await apiService.findAuthors(searchTerm);
  }
);

// Book thunks
export const fetchBooks = createAsyncThunk('data/fetchBooks', async () => {
  return await apiService.getBooks();
});

export const fetchBooksWithDetails = createAsyncThunk(
  'data/fetchBooksWithDetails',
  async (_, { getState }) => {
    const books = await apiService.getBooks();
    const state = getState() as { data: DataState };
    
    // If we don't have authors and genres, fetch them
    let authors = state.data.authors;
    let genres = state.data.genres;
    
    if (authors.length === 0) {
      authors = await apiService.getAuthors();
    }
    if (genres.length === 0) {
      genres = await apiService.getGenres();
    }
    
    // Combine book data with author and genre names
    const booksWithDetails: BookWithDetails[] = books.map(book => {
      const author = authors.find(a => a.id === book.author);
      const genre = genres.find(g => g.id === book.genre);
      
      return {
        ...book,
        authorName: author?.name,
        genreName: genre?.name,
      };
    });
    
    return { books, booksWithDetails, authors, genres };
  }
);

export const createBook = createAsyncThunk(
  'data/createBook',
  async (book: BookCreationParams) => {
    return await apiService.createBook(book);
  }
);

export const updateBook = createAsyncThunk(
  'data/updateBook',
  async (book: BookUpdateParams) => {
    return await apiService.updateBook(book);
  }
);

export const deleteBook = createAsyncThunk(
  'data/deleteBook',
  async (id: number) => {
    await apiService.deleteBook(id);
    return id;
  }
);

export const searchBooks = createAsyncThunk(
  'data/searchBooks',
  async (searchTerm: string, { getState }) => {
    const books = await apiService.findBooks(searchTerm);
    const state = getState() as { data: DataState };
    
    // Get authors and genres from state
    let authors = state.data.authors;
    let genres = state.data.genres;
    
    // If we don't have authors and genres, fetch them
    if (authors.length === 0) {
      authors = await apiService.getAuthors();
    }
    if (genres.length === 0) {
      genres = await apiService.getGenres();
    }
    
    // Combine book data with author and genre names
    const booksWithDetails: BookWithDetails[] = books.map(book => {
      const author = authors.find(a => a.id === book.author);
      const genre = genres.find(g => g.id === book.genre);
      
      return {
        ...book,
        authorName: author?.name,
        genreName: genre?.name,
      };
    });
    
    return { books, booksWithDetails, authors, genres };
  }
);

// Genre thunks
export const fetchGenres = createAsyncThunk('data/fetchGenres', async () => {
  return await apiService.getGenres();
});

export const createGenre = createAsyncThunk(
  'data/createGenre',
  async (genre: GenreCreationParams) => {
    return await apiService.createGenre(genre);
  }
);

export const deleteGenre = createAsyncThunk(
  'data/deleteGenre',
  async (id: number) => {
    await apiService.deleteGenre(id);
    return id;
  }
);

// User thunks (admin only)
export const fetchUsers = createAsyncThunk('data/fetchUsers', async () => {
  return await apiService.getUsers();
});

export const createUser = createAsyncThunk(
  'data/createUser',
  async (user: User) => {
    return await apiService.createUser(user);
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.authorsError = null;
      state.booksError = null;
      state.genresError = null;
      state.usersError = null;
      state.dashboardError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.error.message || 'Failed to fetch dashboard stats';
      })
      
      // Authors
      .addCase(fetchAuthors.pending, (state) => {
        state.authorsLoading = true;
        state.authorsError = null;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.authorsLoading = false;
        state.authors = action.payload;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.authorsLoading = false;
        state.authorsError = action.error.message || 'Failed to fetch authors';
      })
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.authors.push(action.payload);
      })
      .addCase(updateAuthor.fulfilled, (state, action) => {
        const index = state.authors.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.authors[index] = action.payload;
        }
      })
      .addCase(deleteAuthor.fulfilled, (state, action) => {
        state.authors = state.authors.filter(a => a.id !== action.payload);
      })
      .addCase(searchAuthors.fulfilled, (state, action) => {
        state.authors = action.payload;
      })
      
      // Books
      .addCase(fetchBooks.pending, (state) => {
        state.booksLoading = true;
        state.booksError = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.booksLoading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.booksLoading = false;
        state.booksError = action.error.message || 'Failed to fetch books';
      })
      .addCase(fetchBooksWithDetails.pending, (state) => {
        state.booksLoading = true;
        state.booksError = null;
      })
      .addCase(fetchBooksWithDetails.fulfilled, (state, action) => {
        state.booksLoading = false;
        state.books = action.payload.books;
        state.booksWithDetails = action.payload.booksWithDetails;
        if (action.payload.authors.length > 0) {
          state.authors = action.payload.authors;
        }
        if (action.payload.genres.length > 0) {
          state.genres = action.payload.genres;
        }
      })
      .addCase(fetchBooksWithDetails.rejected, (state, action) => {
        state.booksLoading = false;
        state.booksError = action.error.message || 'Failed to fetch books';
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter(b => b.id !== action.payload);
        state.booksWithDetails = state.booksWithDetails.filter(b => b.id !== action.payload);
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.books = action.payload.books;
        state.booksWithDetails = action.payload.booksWithDetails;
        if (action.payload.authors.length > 0) {
          state.authors = action.payload.authors;
        }
        if (action.payload.genres.length > 0) {
          state.genres = action.payload.genres;
        }
      })
      
      // Genres
      .addCase(fetchGenres.pending, (state) => {
        state.genresLoading = true;
        state.genresError = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genresLoading = false;
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.genresLoading = false;
        state.genresError = action.error.message || 'Failed to fetch genres';
      })
      .addCase(createGenre.fulfilled, (state, action) => {
        state.genres.push(action.payload);
      })
      .addCase(deleteGenre.fulfilled, (state, action) => {
        state.genres = state.genres.filter(g => g.id !== action.payload);
      })
      
      // Users
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.error.message || 'Failed to fetch users';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        if (typeof action.payload !== 'boolean') {
          state.users.push(action.payload);
        }
      });
  },
});

export const { clearErrors } = dataSlice.actions;

// Selectors
export const selectAuthors = (state: { data: DataState }) => state.data.authors;
export const selectBooks = (state: { data: DataState }) => state.data.books;
export const selectBooksWithDetails = (state: { data: DataState }) => state.data.booksWithDetails;
export const selectGenres = (state: { data: DataState }) => state.data.genres;
export const selectUsers = (state: { data: DataState }) => state.data.users;
export const selectDashboardStats = (state: { data: DataState }) => state.data.dashboardStats;

export default dataSlice.reducer;