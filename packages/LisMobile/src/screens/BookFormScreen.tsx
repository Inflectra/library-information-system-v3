import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp as NavigationRouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

import { AppDispatch, RootState } from '../store';
import {
  createBook,
  updateBook,
  fetchAuthors,
  fetchGenres,
  selectAuthors,
  selectGenres,
  selectBooks,
} from '../store/dataSlice';
import { BookCreationParams, BookUpdateParams } from '../types/api';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'BookForm'>;
type RouteProps = NavigationRouteProp<RootStackParamList, 'BookForm'>;

const BookFormScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<number | string>('');
  const [selectedGenre, setSelectedGenre] = useState<number | string>('');
  const [outOfPrint, setOutOfPrint] = useState(false);
  const [dateAdded, setDateAdded] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthorPicker, setShowAuthorPicker] = useState(false);
  const [showGenrePicker, setShowGenrePicker] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const authors = useSelector((state: RootState) => selectAuthors(state));
  const genres = useSelector((state: RootState) => selectGenres(state));
  const books = useSelector((state: RootState) => selectBooks(state));

  const { bookId, mode } = route.params;
  const isEditMode = mode === 'edit';

  useEffect(() => {
    // Always fetch authors and genres to ensure fresh data
    dispatch(fetchAuthors());
    dispatch(fetchGenres());
  }, [dispatch]);



  useEffect(() => {
    // If editing, populate form with existing book data
    if (isEditMode && bookId) {
      const book = books.find(b => b.id === bookId);
      if (book) {
        setName(book.name);
        setSelectedAuthor(book.author);
        setSelectedGenre(book.genre);
        setOutOfPrint(book.outOfPrint || false);
        if (book.dateAdded) {
          setDateAdded(new Date(book.dateAdded));
        }
      }
    }
  }, [isEditMode, bookId, books]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a book name');
      return;
    }

    if (!selectedAuthor || selectedAuthor === '') {
      Alert.alert('Error', 'Please select an author');
      return;
    }

    if (!selectedGenre || selectedGenre === '') {
      Alert.alert('Error', 'Please select a genre');
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode && bookId) {
        const updateData: BookUpdateParams = {
          id: bookId,
          name: name.trim(),
          author: selectedAuthor as number,
          genre: selectedGenre as number,
          outOfPrint,
          dateAdded: dateAdded.toISOString(),
        };
        await dispatch(updateBook(updateData)).unwrap();
        Alert.alert('Success', 'Book updated successfully');
      } else {
        const createData: BookCreationParams = {
          name: name.trim(),
          author: selectedAuthor as number,
          genre: selectedGenre as number,
          outOfPrint,
          dateAdded: dateAdded.toISOString(),
        };
        await dispatch(createBook(createData)).unwrap();
        Alert.alert('Success', 'Book created successfully');
      }
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = error?.message || `Failed to ${isEditMode ? 'update' : 'create'} book`;
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateAdded(selectedDate);
    }
  };

  const getAuthorLabel = () => {
    if (!selectedAuthor || selectedAuthor === '') return 'Select an author';
    const author = authors.find(a => a.id === selectedAuthor);
    return author ? `${author.name} (Age: ${author.age})` : 'Select an author';
  };

  const getGenreLabel = () => {
    if (!selectedGenre || selectedGenre === '') return 'Select a genre';
    const genre = genres.find(g => g.id === selectedGenre);
    return genre ? genre.name : 'Select a genre';
  };

  const renderAuthorPicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowAuthorPicker(true)}
          >
            <Text style={[styles.pickerButtonText, !selectedAuthor && styles.placeholderText]}>
              {getAuthorLabel()}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
          </TouchableOpacity>

          <Modal
            visible={showAuthorPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowAuthorPicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Author</Text>
                  <TouchableOpacity onPress={() => setShowAuthorPicker(false)}>
                    <Text style={styles.modalClose}>Done</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={authors.slice().sort((a, b) => a.name.localeCompare(b.name))}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedAuthor(item.id);
                        setShowAuthorPicker(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>
                        {item.name} (Age: {item.age})
                      </Text>
                      {selectedAuthor === item.id && (
                        <MaterialIcons name="check" size={24} color="#007AFF" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </>
      );
    }

    return (
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedAuthor}
          onValueChange={setSelectedAuthor}
          style={styles.picker}
        >
          <Picker.Item label="Select an author" value="" />
          {authors
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(author => (
              <Picker.Item
                key={author.id}
                label={`${author.name} (Age: ${author.age})`}
                value={author.id}
              />
            ))}
        </Picker>
      </View>
    );
  };

  const renderGenrePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowGenrePicker(true)}
          >
            <Text style={[styles.pickerButtonText, !selectedGenre && styles.placeholderText]}>
              {getGenreLabel()}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
          </TouchableOpacity>

          <Modal
            visible={showGenrePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowGenrePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Genre</Text>
                  <TouchableOpacity onPress={() => setShowGenrePicker(false)}>
                    <Text style={styles.modalClose}>Done</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={genres.slice().sort((a, b) => a.name.localeCompare(b.name))}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setSelectedGenre(item.id);
                        setShowGenrePicker(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{item.name}</Text>
                      {selectedGenre === item.id && (
                        <MaterialIcons name="check" size={24} color="#007AFF" />
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </>
      );
    }

    return (
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedGenre}
          onValueChange={setSelectedGenre}
          style={styles.picker}
        >
          <Picker.Item label="Select a genre" value="" />
          {genres
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(genre => (
              <Picker.Item
                key={genre.id}
                label={genre.name}
                value={genre.id}
              />
            ))}
        </Picker>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Book Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter book name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Author *</Text>
          {renderAuthorPicker()}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Genre *</Text>
          {renderGenrePicker()}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date Added</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <MaterialIcons name="date-range" size={20} color="#666" />
            <Text style={styles.dateText}>
              {dateAdded.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateAdded}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <View style={styles.switchGroup}>
          <Text style={styles.label}>Out of Print</Text>
          <Switch
            value={outOfPrint}
            onValueChange={setOutOfPrint}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={outOfPrint ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitButtonText}>
            {isLoading 
              ? (isEditMode ? 'Updating...' : 'Creating...') 
              : (isEditMode ? 'Update Book' : 'Create Book')
            }
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  pickerButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalClose: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default BookFormScreen;