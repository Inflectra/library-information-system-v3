import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { AppDispatch, RootState } from '../store';
import { 
  fetchAuthors, 
  deleteAuthor, 
  searchAuthors,
  selectAuthors 
} from '../store/dataSlice';
import { selectUserPermission, canEdit } from '../store/authSlice';
import { Author } from '../types/api';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const AuthorsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  
  const authors = useSelector((state: RootState) => selectAuthors(state));
  const { authorsLoading } = useSelector((state: RootState) => state.data);
  const userPermission = useSelector(selectUserPermission);
  
  const canEditAuthors = canEdit(userPermission);

  useEffect(() => {
    dispatch(fetchAuthors());
  }, [dispatch]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else if (isSearching) {
        // Clear search when query is empty
        handleClearSearch();
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    if (isSearching) {
      handleSearch();
    } else {
      dispatch(fetchAuthors());
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        await dispatch(searchAuthors(searchQuery.trim())).unwrap();
        // Keep isSearching true to show search indicator
      } catch (error: any) {
        const errorMessage = error?.message || 'Failed to search authors';
        Alert.alert('Search Error', errorMessage);
        setIsSearching(false);
      }
    } else {
      setIsSearching(false);
      dispatch(fetchAuthors());
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    dispatch(fetchAuthors());
  };

  const handleDeleteAuthor = (author: Author) => {
    Alert.alert(
      'Delete Author',
      `Are you sure you want to delete "${author.name}"?\n\nNote: Authors with books in the system cannot be deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteAuthor(author.id)).unwrap();
              Alert.alert('Success', 'Author deleted successfully');
            } catch (error: any) {
              const errorMessage = error?.message || 'Failed to delete author';
              Alert.alert('Cannot Delete Author', errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleEditAuthor = (author: Author) => {
    navigation.navigate('AuthorForm', { authorId: author.id, mode: 'edit' });
  };

  const handleCreateAuthor = () => {
    navigation.navigate('AuthorForm', { mode: 'create' });
  };

  const renderAuthorItem = ({ item }: { item: Author }) => (
    <View style={styles.authorCard}>
      <View style={styles.authorHeader}>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.name}</Text>
          <Text style={styles.authorAge}>Age: {item.age}</Text>
        </View>
        
        {canEditAuthors && (
          <View style={styles.authorActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditAuthor(item)}
            >
              <MaterialIcons name="edit" size={20} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteAuthor(item)}
            >
              <MaterialIcons name="delete" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Authors</Text>
        {canEditAuthors && (
          <TouchableOpacity style={styles.addButton} onPress={handleCreateAuthor}>
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search authors by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {(searchQuery || isSearching) && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <MaterialIcons name="clear" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.searchButton, authorsLoading && styles.searchButtonLoading]} 
          onPress={handleSearch}
          disabled={authorsLoading}
        >
          <MaterialIcons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {isSearching && (
        <View style={styles.searchIndicator}>
          <Text style={styles.searchIndicatorText}>
            Search results for "{searchQuery}"
          </Text>
          <TouchableOpacity onPress={handleClearSearch}>
            <Text style={styles.showAllText}>Show all authors</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={authors}
        renderItem={renderAuthorItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={authorsLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="person" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {isSearching ? 'No authors found' : 'No authors available'}
            </Text>
            {canEditAuthors && !isSearching && (
              <TouchableOpacity style={styles.emptyButton} onPress={handleCreateAuthor}>
                <Text style={styles.emptyButtonText}>Add First Author</Text>
              </TouchableOpacity>
            )}
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonLoading: {
    backgroundColor: '#ccc',
  },
  searchIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchIndicatorText: {
    fontSize: 14,
    color: '#1976d2',
  },
  showAllText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  authorCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  authorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  authorAge: {
    fontSize: 16,
    color: '#666',
  },
  authorActions: {
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

export default AuthorsScreen;