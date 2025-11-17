# Library Information System - Mobile App

A comprehensive React Native mobile application for managing a library system, built with Expo for iOS and Android platforms. This app provides role-based access control and full CRUD operations for books, authors, and users.

## Features

### 🔐 Authentication & Authorization
- Secure login with JWT token management
- Role-based access control (Reader, Editor, Admin)
- Persistent authentication state
- Test accounts for different permission levels

### 📚 Book Management
- View all books with author and genre details
- Search books by name
- Create, edit, and delete books (Editor+ permissions)
- Track publication status (out of print)
- Date tracking for when books were added

### 👥 Author Management
- Browse all authors with age information
- Search authors by name
- Create, edit, and delete authors (Editor+ permissions)
- Full CRUD operations with validation

### 🏷️ Genre Management
- View all available genres
- Create and delete genres (Editor+ permissions)

### 👨‍💼 Admin Features
- User management (Admin only)
- Create new users with different permission levels
- View user statistics and status
- System administration tools

### 📊 Dashboard
- Library overview with statistics
- Quick access to main features
- User permission display
- System information

## User Roles & Permissions

### Reader (Permission Level 1)
- **Username/Password:** `borrower/borrower`
- **Access:** View-only access to books, authors, and genres
- **Restrictions:** Cannot create, edit, or delete any content

### Editor (Permission Level 2)
- **Username/Password:** `librarian/librarian`
- **Access:** All Reader permissions plus:
  - Create, edit, and delete books
  - Create, edit, and delete authors
  - Create and delete genres

### Admin (Permission Level 3)
- **Username/Password:** `admin/admin`
- **Access:** All Editor permissions plus:
  - Access to Admin section
  - User management (create, view users)
  - System administration

## Technical Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Navigation:** React Navigation 6
- **UI Components:** React Native Paper
- **Data Persistence:** Redux Persist with AsyncStorage
- **API Integration:** RESTful API with JWT authentication
- **Date Handling:** React Native DateTimePicker

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio
- API server running (see API Configuration section)

## Installation

1. **Clone the repository and install dependencies:**
```bash
npm install
```

2. **Install Expo CLI globally (if not already installed):**
```bash
npm install -g @expo/cli
```

3. **Configure API endpoint:**
   - Open `src/config/api.ts`
   - Update `API_BASE_URL` to point to your API server
   - For local development, you might need to use your computer's IP address instead of localhost

## API Configuration

The app expects a REST API server running with the endpoints defined in the swagger.json file. 

**Important:** Update the API base URL in `src/config/api.ts`:

```typescript
// For local development on physical device
export const API_BASE_URL = 'http://192.168.1.100:3000';

// For simulator/emulator
export const API_BASE_URL = 'http://localhost:3000';
```

## Running the App

### Development Server
```bash
npm start
```

### Platform-specific Commands
```bash
# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web browser (limited functionality)
npm run web
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
│   └── api.ts          # API endpoints and base URL
├── navigation/         # Navigation configuration
│   └── AppNavigator.tsx
├── screens/            # Screen components
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── BooksScreen.tsx
│   ├── BookFormScreen.tsx
│   ├── AuthorsScreen.tsx
│   ├── AuthorFormScreen.tsx
│   ├── AdminScreen.tsx
│   └── UserFormScreen.tsx
├── services/           # API services
│   └── api.ts          # API client
├── store/              # Redux store configuration
│   ├── index.ts        # Store setup
│   ├── authSlice.ts    # Authentication state
│   └── dataSlice.ts    # Data management state
└── types/              # TypeScript type definitions
    └── api.ts          # API response types
```

## Key Features Implementation

### Authentication Flow
1. User enters credentials on login screen
2. App sends Basic Auth request to `/users/login`
3. Server returns user data with JWT token
4. Token is stored securely and used for subsequent requests
5. App checks token validity on startup

### Role-Based Access Control
- UI elements are conditionally rendered based on user permissions
- API requests include proper authorization headers
- Permission checks prevent unauthorized actions

### Data Management
- Redux Toolkit for state management
- Optimistic updates for better UX
- Error handling with user-friendly messages
- Refresh functionality on all list screens

### Search Functionality
- Real-time search for books and authors
- Search state management
- Clear search functionality

## Testing

The app includes three test accounts with different permission levels:

1. **Reader Account**
   - Username: `borrower`
   - Password: `borrower`
   - Can only view data

2. **Editor Account**
   - Username: `librarian`
   - Password: `librarian`
   - Can manage books and authors

3. **Admin Account**
   - Username: `admin`
   - Password: `admin`
   - Full access including user management

## Building for Production

### Using Expo Application Services (EAS)

1. **Install EAS CLI:**
```bash
npm install -g @expo/eas-cli
```

2. **Configure EAS:**
```bash
eas build:configure
```

3. **Build for platforms:**
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both platforms
eas build --platform all
```

## Troubleshooting

### Common Issues

1. **API Connection Issues:**
   - Ensure API server is running
   - Check API_BASE_URL in `src/config/api.ts`
   - For physical devices, use computer's IP address instead of localhost

2. **Authentication Problems:**
   - Clear app data/storage
   - Check network connectivity
   - Verify API server is responding to auth endpoints

3. **Build Issues:**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Clear Expo cache: `expo start --clear`

### Development Tips

- Use Expo Go app for quick testing on physical devices
- Enable remote debugging for better development experience
- Use React Native Debugger for Redux state inspection

## API Endpoints Used

The app integrates with the following API endpoints:

- **Authentication:** `/users/login`, `/users/logout`, `/users/keepalive`
- **Books:** `/books`, `/books/count`, `/books/find`, `/books/{id}`
- **Authors:** `/authors`, `/authors/count`, `/authors/find`, `/authors/{id}`
- **Genres:** `/genres`, `/genres/count`, `/genres/{id}`
- **Users:** `/users`, `/users/update` (Admin only)

## Contributing

1. Follow TypeScript best practices
2. Use proper error handling
3. Implement proper loading states
4. Follow the existing code structure
5. Test with different user permission levels

## License

MIT License - see LICENSE file for details