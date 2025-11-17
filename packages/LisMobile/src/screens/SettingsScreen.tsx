import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

import { API_BASE_URL } from '../config/api';

const SettingsScreen: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveApiUrl = async () => {
    if (!apiUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid API URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(apiUrl);
    } catch {
      Alert.alert('Error', 'Please enter a valid URL (e.g., http://192.168.1.100:3000)');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('api_base_url', apiUrl.trim());
      Alert.alert(
        'Success', 
        'API URL saved. Please restart the app for changes to take effect.',
        [
          {
            text: 'OK',
            onPress: () => {
              // You could implement app restart logic here
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save API URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefault = () => {
    setApiUrl(API_BASE_URL);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="settings" size={32} color="#007AFF" />
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>API Base URL</Text>
          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="http://192.168.1.100:3000"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          <Text style={styles.helpText}>
            Enter the base URL of your API server. For local development on a physical device, 
            use your computer's IP address instead of localhost.
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleSaveApiUrl}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Saving...' : 'Save API URL'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleResetToDefault}
          >
            <Text style={styles.secondaryButtonText}>Reset to Default</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Information</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="computer" size={20} color="#666" />
            <Text style={styles.infoText}>Current API URL: {apiUrl}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="info" size={20} color="#666" />
            <Text style={styles.infoText}>
              Make sure your API server is running and accessible from this device
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Common API URLs</Text>
        
        <TouchableOpacity 
          style={styles.presetButton}
          onPress={() => setApiUrl('http://localhost:3000')}
        >
          <Text style={styles.presetButtonText}>http://localhost:3000</Text>
          <Text style={styles.presetButtonSubtext}>For simulators/emulators</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.presetButton}
          onPress={() => setApiUrl('http://192.168.1.100:3000')}
        >
          <Text style={styles.presetButtonText}>http://192.168.1.100:3000</Text>
          <Text style={styles.presetButtonSubtext}>Example for physical devices</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.presetButton}
          onPress={() => setApiUrl('http://10.0.2.2:3000')}
        >
          <Text style={styles.presetButtonText}>http://10.0.2.2:3000</Text>
          <Text style={styles.presetButtonSubtext}>Android emulator localhost</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
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
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  buttonGroup: {
    gap: 12,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  presetButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  presetButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  presetButtonSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default SettingsScreen;