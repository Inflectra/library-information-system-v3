import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { AppDispatch, RootState } from '../store';
import { fetchDashboardStats, selectDashboardStats } from '../store/dataSlice';
import { selectUser, logoutUser } from '../store/authSlice';
import { Permissions } from '../types/api';
import { MainTabParamList } from '../navigation/AppNavigator';

type NavigationProp = BottomTabNavigationProp<MainTabParamList, 'Dashboard'>;

const DashboardScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => selectUser(state));
  const dashboardStats = useSelector((state: RootState) => selectDashboardStats(state));
  const { dashboardLoading } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboardStats());
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleNavigateToBooks = () => {
    navigation.navigate('Books');
  };

  const handleNavigateToAuthors = () => {
    navigation.navigate('Authors');
  };

  const handleCreateBook = () => {
    navigation.navigate('Books');
    // Note: We navigate to Books tab, user can then use the + button to create
  };

  const handleCreateAuthor = () => {
    navigation.navigate('Authors');
    // Note: We navigate to Authors tab, user can then use the + button to create
  };

  const getPermissionText = (permission: Permissions) => {
    switch (permission) {
      case Permissions.Reader:
        return 'Reader';
      case Permissions.Editor:
        return 'Editor';
      case Permissions.Admin:
        return 'Admin';
      case Permissions.SuperAdmin:
        return 'Super Admin';
      default:
        return 'Unknown';
    }
  };

  const getPermissionColor = (permission: Permissions) => {
    switch (permission) {
      case Permissions.Reader:
        return '#34C759';
      case Permissions.Editor:
        return '#007AFF';
      case Permissions.Admin:
        return '#FF9500';
      case Permissions.SuperAdmin:
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={dashboardLoading} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{user?.name || user?.username}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.permissionBadge}>
          <Text style={[styles.permissionText, { color: getPermissionColor(user?.permission || Permissions.Reader) }]}>
            Your permissions: {getPermissionText(user?.permission || Permissions.Reader)}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Library Overview</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialIcons name="book" size={40} color="#007AFF" />
            <Text style={styles.statNumber}>
              {dashboardStats?.booksCount ?? '...'}
            </Text>
            <Text style={styles.statLabel}>Books</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="person" size={40} color="#34C759" />
            <Text style={styles.statNumber}>
              {dashboardStats?.authorsCount ?? '...'}
            </Text>
            <Text style={styles.statLabel}>Authors</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="category" size={40} color="#FF9500" />
            <Text style={styles.statNumber}>
              {dashboardStats?.genresCount ?? '...'}
            </Text>
            <Text style={styles.statLabel}>Genres</Text>
          </View>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={handleNavigateToBooks}
            activeOpacity={0.7}
          >
            <MaterialIcons name="search" size={32} color="#007AFF" />
            <Text style={styles.actionText}>Search Books</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={handleNavigateToAuthors}
            activeOpacity={0.7}
          >
            <MaterialIcons name="people" size={32} color="#34C759" />
            <Text style={styles.actionText}>Browse Authors</Text>
          </TouchableOpacity>

          {user?.permission && user.permission >= Permissions.Editor && (
            <>
              <TouchableOpacity 
                style={styles.actionCard} 
                onPress={handleCreateBook}
                activeOpacity={0.7}
              >
                <MaterialIcons name="add-circle" size={32} color="#FF9500" />
                <Text style={styles.actionText}>Add Book</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionCard} 
                onPress={handleCreateAuthor}
                activeOpacity={0.7}
              >
                <MaterialIcons name="person-add" size={32} color="#FF6B6B" />
                <Text style={styles.actionText}>Add Author</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>System Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="account-circle" size={20} color="#666" />
            <Text style={styles.infoText}>Logged in as: {user?.username}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="security" size={20} color="#666" />
            <Text style={styles.infoText}>
              Access Level: {getPermissionText(user?.permission || Permissions.Reader)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="verified-user" size={20} color="#666" />
            <Text style={styles.infoText}>
              Status: {user?.active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  permissionBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  permissionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quickActions: {
    padding: 20,
    paddingTop: 0,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  recentActivity: {
    padding: 20,
    paddingTop: 0,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});

export default DashboardScreen;