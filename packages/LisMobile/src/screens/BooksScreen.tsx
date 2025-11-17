import React, { useEffect, useState, useCallback } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import { AppDispatch, RootState } from '../store';
import { 
  fetchBooksWithDetails, 
  deleteBook, 
  searchBooks,
  selectBooksWithDetails 
} from '../store/dataSlice';
import { selectUserPermission, canEdit } from '../store/authSlice';
import { BookWithDetails } from '../types/api';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const BooksScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  
  const allBooksWithDetails = useSelector((state: RootState) => selectBooksWithDetails(state));
  const { booksLoading } = useSelector((state: RootState) => state.data);
  const userPermission = useSelector(selectUserPermission);
  
  const canEditBooks = canEdit(userPermission);

  // Enhanced search that looks in book name, author name, and genre
  const booksWithDetails = React.useMemo(() => {
    if (!searchQuery.trim() || !isSearching) {
      return allBooksWithDetails;
    }

    const query = searchQuery.toLowerCase().trim();
    return allBooksWithDetails.filter(book => {
      const bookName = book.name?.toLowerCase() || '';
      const authorName = book.authorName?.toLowerCase() || '';
      const genreName = book.genreName?.toLowerCase() || '';
      
      return bookName.includes(query) || 
             authorName.includes(query) || 
             genreName.includes(query);
    });
  }, [allBooksWithDetails, searchQuery, isSearching]);

  useEffect(() => {
    dispatch(fetchBooksWithDetails());
  }, [dispatch]);

  // Refresh data when screen comes into focus (e.g., returning from BookForm)
  useFocusEffect(
    useCallback(() => {
      // Always refresh the full data - search filtering is handled by useMemo
      dispatch(fetchBooksWithDetails());
    }, [dispatch])
  );

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
    // Always refresh the full data from the server
    dispatch(fetchBooksWithDetails());
    // Search filtering will be applied automatically by the useMemo
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      // Search is now handled by the useMemo above - no API call needed
    } else {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    dispatch(fetchBooksWithDetails());
  };

  const handleDeleteBook = (book: BookWithDetails) => {
    Alert.alert(
      'Delete Book',
      `Are you sure you want to delete "${book.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteBook(book.id)).unwrap();
              Alert.alert('Success', 'Book deleted successfully');
            } catch (error: any) {
              const errorMessage = error?.message || 'Failed to delete book';
              Alert.alert('Cannot Delete Book', errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleEditBook = (book: BookWithDetails) => {
    navigation.navigate('BookForm', { bookId: book.id, mode: 'edit' });
  };

  const handleCreateBook = () => {
    navigation.navigate('BookForm', { mode: 'create' });
  };

  const renderBookItem = ({ item }: { item: BookWithDetails }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.name}</Text>
          <Text style={styles.bookAuthor}>by {item.authorName || 'Unknown Author'}</Text>
          <Text style={styles.bookGenre}>{item.genreName || 'Unknown Genre'}</Text>
          {item.outOfPrint && (
            <View style={styles.outOfPrintBadge}>
              <Text style={styles.outOfPrintText}>Out of Print</Text>
            </View>
          )}
        </View>
        
        {canEditBooks && (
          <View style={styles.bookActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditBook(item)}
            >
              <MaterialIcons name="edit" size={20} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteBook(item)}
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
        <Text style={styles.title}>Books</Text>
        {canEditBooks && (
          <TouchableOpacity style={styles.addButton} onPress={handleCreateBook}>
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books, authors, or genres..."
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
          style={[styles.searchButton, booksLoading && styles.searchButtonLoading]} 
          onPress={handleSearch}
          disabled={booksLoading}
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
            <Text style={styles.showAllText}>Show all books</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={booksWithDetails}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={booksLoading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="book" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {isSearching ? 'No books found' : 'No books available'}
            </Text>
            {canEditBooks && !isSearching && (
              <TouchableOpacity style={styles.emptyButton} onPress={handleCreateBook}>
                <Text style={styles.emptyButtonText}>Add First Book</Text>
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
  bookCard: {
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
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 15,
    color: '#666',
    marginBottom: 1,
  },
  bookGenre: {
    fontSize: 13,
    color: '#888',
  },
  outOfPrintBadge: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  outOfPrintText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  bookActions: {
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

export default BooksScreen;