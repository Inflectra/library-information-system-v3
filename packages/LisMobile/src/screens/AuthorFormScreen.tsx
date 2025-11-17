import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp as NavigationRouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { AppDispatch, RootState } from '../store';
import {
  createAuthor,
  updateAuthor,
  selectAuthors,
} from '../store/dataSlice';
import { AuthorCreationParams, AuthorUpdateParams } from '../types/api';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'AuthorForm'>;
type RouteProps = NavigationRouteProp<RootStackParamList, 'AuthorForm'>;

const AuthorFormScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const authors = useSelector((state: RootState) => selectAuthors(state));

  const { authorId, mode } = route.params;
  const isEditMode = mode === 'edit';

  useEffect(() => {
    // If editing, populate form with existing author data
    if (isEditMode && authorId) {
      const author = authors.find(a => a.id === authorId);
      if (author) {
        setName(author.name);
        setAge(author.age.toString());
      }
    }
  }, [isEditMode, authorId, authors]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an author name');
      return;
    }

    const ageNumber = parseInt(age);
    if (!age.trim() || isNaN(ageNumber) || ageNumber < 0 || ageNumber > 3000) {
      Alert.alert('Error', 'Please enter a valid age (0-3000)');
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode && authorId) {
        const updateData: AuthorUpdateParams = {
          id: authorId,
          name: name.trim(),
          age: ageNumber,
        };
        await dispatch(updateAuthor(updateData)).unwrap();
        Alert.alert('Success', 'Author updated successfully');
      } else {
        const createData: AuthorCreationParams = {
          name: name.trim(),
          age: ageNumber,
        };
        await dispatch(createAuthor(createData)).unwrap();
        Alert.alert('Success', 'Author created successfully');
      }
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = error?.message || `Failed to ${isEditMode ? 'update' : 'create'} author`;
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Author Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter author name"
              autoCapitalize="words"
              autoFocus
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter age"
              keyboardType="numeric"
              maxLength={4}
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
                : (isEditMode ? 'Update Author' : 'Create Author')
              }
            </Text>
          </TouchableOpacity>

          <View style={styles.helpText}>
            <Text style={styles.helpTextContent}>
              * Required fields
            </Text>
            <Text style={styles.helpTextContent}>
              Age should be between 0 and 3000 years
            </Text>
            <Text style={styles.helpTextContent}>
              (Supports fictional, mythological, and historical characters)
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
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
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  helpText: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  helpTextContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default AuthorFormScreen;