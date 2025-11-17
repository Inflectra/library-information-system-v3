import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';

import { RootState, AppDispatch } from '../store';
import { checkAuthStatus, selectIsAuthenticated, selectUserPermission, canAdmin } from '../store/authSlice';

// Screens
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import BooksScreen from '../screens/BooksScreen';
import BookFormScreen from '../screens/BookFormScreen';
import AuthorsScreen from '../screens/AuthorsScreen';
import AuthorFormScreen from '../screens/AuthorFormScreen';
import AdminScreen from '../screens/AdminScreen';
import UserFormScreen from '../screens/UserFormScreen';

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  BookForm: { bookId?: number; mode: 'create' | 'edit' };
  AuthorForm: { authorId?: number; mode: 'create' | 'edit' };
  UserForm: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Books: undefined;
  Authors: undefined;
  Admin: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  const userPermission = useSelector(selectUserPermission);
  const showAdminTab = canAdmin(userPermission);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Books') {
            iconName = 'book';
          } else if (route.name === 'Authors') {
            iconName = 'person';
          } else if (route.name === 'Admin') {
            iconName = 'admin-panel-settings';
          } else {
            iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Books" component={BooksScreen} />
      <Tab.Screen name="Authors" component={AuthorsScreen} />
      {showAdminTab && (
        <Tab.Screen name="Admin" component={AdminScreen} />
      )}
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen 
              name="BookForm" 
              component={BookFormScreen}
              options={{ 
                headerShown: true,
                title: 'Book Form',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen 
              name="AuthorForm" 
              component={AuthorFormScreen}
              options={{ 
                headerShown: true,
                title: 'Author Form',
                headerBackTitleVisible: false,
              }}
            />
            <Stack.Screen 
              name="UserForm" 
              component={UserFormScreen}
              options={{ 
                headerShown: true,
                title: 'Create User',
                headerBackTitleVisible: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;