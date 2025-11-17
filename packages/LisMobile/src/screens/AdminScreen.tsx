import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { AppDispatch, RootState } from '../store';
import { fetchUsers, selectUsers } from '../store/dataSlice';
import { User, Permissions } from '../types/api';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AdminScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  
  const users = useSelector((state: RootState) => selectUsers(state));
  const { usersLoading } = useSelector((state: RootState) => state.data);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  const handleCreateUser = () => {
    navigation.navigate('UserForm');
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

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userUsername}>@{item.username}</Text>
          <View style={styles.userDetails}>
            <View style={[styles.permissionBadge, { backgroundColor: getPermissionColor(item.permission) }]}>
              <Text style={styles.permissionText}>
                {getPermissionText(item.permission)}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: item.active ? '#34C759' : '#FF3B30' }]}>
              <Text style={styles.statusText}>
                {item.active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.userActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Info', 'User editing not implemented in this demo')}
          >
            <MaterialIcons name="edit" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateUser}>
          <MaterialIcons name="person-add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <MaterialIcons name="people" size={32} color="#007AFF" />
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>
        
        <View style={styles.statCard}>
          <MaterialIcons name="verified-user" size={32} color="#34C759" />
          <Text style={styles.statNumber}>
            {users.filter(u => u.active).length}
          </Text>
          <Text style={styles.statLabel}>Active Users</Text>
        </View>
        
        <View style={styles.statCard}>
          <MaterialIcons name="admin-panel-settings" size={32} color="#FF9500" />
          <Text style={styles.statNumber}>
            {users.filter(u => u.permission >= Permissions.Admin).length}
          </Text>
          <Text style={styles.statLabel}>Admins</Text>
        </View>
      </View>

      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.username}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={usersLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="people" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No users found</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleCreateUser}>
              <Text style={styles.emptyButtonText}>Create First User</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
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
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  userDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  permissionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  permissionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  userActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AdminScreen;