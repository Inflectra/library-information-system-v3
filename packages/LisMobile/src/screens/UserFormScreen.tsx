import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';

import { AppDispatch } from '../store';
import { createUser } from '../store/dataSlice';
import { User, Permissions } from '../types/api';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'UserForm'>;

const UserFormScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  const [permission, setPermission] = useState<Permissions>(Permissions.Reader);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp>();

  const handleSubmit = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a full name');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const userData: User = {
        username: username.trim().toLowerCase(),
        password: password,
        name: name.trim(),
        active,
        permission,
      };

      await dispatch(createUser(userData)).unwrap();
      Alert.alert('Success', 'User created successfully');
      navigation.goBack();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to create user';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionDescription = (perm: Permissions) => {
    switch (perm) {
      case Permissions.Reader:
        return 'Can only view data';
      case Permissions.Editor:
        return 'Can create, edit, and delete books & authors';
      case Permissions.Admin:
        return 'Full access including user management';
      case Permissions.SuperAdmin:
        return 'Super admin privileges';
      default:
        return '';
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
            <Text style={styles.label}>Username *</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password (min 6 characters)"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter full name"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Permission Level *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={permission}
                onValueChange={setPermission}
                style={styles.picker}
              >
                <Picker.Item 
                  label={`Reader - ${getPermissionDescription(Permissions.Reader)}`} 
                  value={Permissions.Reader} 
                />
                <Picker.Item 
                  label={`Editor - ${getPermissionDescription(Permissions.Editor)}`} 
                  value={Permissions.Editor} 
                />
                <Picker.Item 
                  label={`Admin - ${getPermissionDescription(Permissions.Admin)}`} 
                  value={Permissions.Admin} 
                />
                <Picker.Item 
                  label={`Super Admin - ${getPermissionDescription(Permissions.SuperAdmin)}`} 
                  value={Permissions.SuperAdmin} 
                />
              </Picker>
            </View>
            <Text style={styles.permissionDescription}>
              {getPermissionDescription(permission)}
            </Text>
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>Active User</Text>
            <Switch
              value={active}
              onValueChange={setActive}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={active ? '#007AFF' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Creating User...' : 'Create User'}
            </Text>
          </TouchableOpacity>

          <View style={styles.helpText}>
            <Text style={styles.helpTextTitle}>Permission Levels:</Text>
            <Text style={styles.helpTextContent}>
              • <Text style={styles.bold}>Reader:</Text> View-only access to all data
            </Text>
            <Text style={styles.helpTextContent}>
              • <Text style={styles.bold}>Editor:</Text> Can manage books and authors
            </Text>
            <Text style={styles.helpTextContent}>
              • <Text style={styles.bold}>Admin:</Text> Full access including user management
            </Text>
            <Text style={styles.helpTextContent}>
              • <Text style={styles.bold}>Super Admin:</Text> Highest level of access
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
  permissionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
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
    marginBottom: 20,
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
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  helpTextTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helpTextContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '600',
    color: '#333',
  },
});

export default UserFormScreen;