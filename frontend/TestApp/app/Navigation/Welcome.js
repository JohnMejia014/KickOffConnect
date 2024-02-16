import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Welcome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Welcome;
