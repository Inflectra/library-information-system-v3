import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../components/Button';

export const HomeScreen: React.FC = () => {
  const handlePrimaryPress = () => {
    Alert.alert('Success', 'Primary button pressed!');
  };

  const handleSecondaryPress = () => {
    Alert.alert('Info', 'Secondary button pressed!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Mobile App!</Text>
      <Text style={styles.subtitle}>Built with React Native & Expo</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Primary Action" 
          onPress={handlePrimaryPress}
          style={styles.button}
        />
        <Button 
          title="Secondary Action" 
          variant="secondary"
          onPress={handleSecondaryPress}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    marginBottom: 16,
  },
});