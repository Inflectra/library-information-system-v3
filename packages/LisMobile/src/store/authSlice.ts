import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserWithToken, Permissions } from '../types/api';
import { apiService } from '../services/api';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    const response = await apiService.login(username, password);
    return response;
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await apiService.logout();
});

export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async () => {
  const token = await apiService.getToken();
  if (token) {
    await apiService.keepAlive();
    return token;
  }
  throw new Error('No token found');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserWithToken>) => {
        state.isLoading = false;
        state.user = {
          username: action.payload.username,
          password: action.payload.password,
          name: action.payload.name,
          active: action.payload.active,
          permission: action.payload.permission,
        };
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Check auth status
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUserPermission = (state: { auth: AuthState }) => state.auth.user?.permission;

// Permission helpers
export const hasPermission = (userPermission: Permissions | undefined, requiredPermission: Permissions): boolean => {
  if (userPermission === undefined) return false;
  return userPermission >= requiredPermission;
};

export const canRead = (userPermission: Permissions | undefined): boolean => 
  hasPermission(userPermission, Permissions.Reader);

export const canEdit = (userPermission: Permissions | undefined): boolean => 
  hasPermission(userPermission, Permissions.Editor);

export const canAdmin = (userPermission: Permissions | undefined): boolean => 
  hasPermission(userPermission, Permissions.Admin);

export default authSlice.reducer;