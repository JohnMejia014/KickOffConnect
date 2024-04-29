import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  const [errorMessage, setErrorMessage] = useState('');
  const [continuePressed, setContinuePressed] = useState(false);

  const handleButtonPress = (selectedMode) => {
    setMode(selectedMode);
    setErrorMessage('');
    setContinuePressed(false); // Reset continue button state
  };

  const handleContinuePress = () => {
    setContinuePressed(true);
    // Perform any action you want on Continue button press
    // For now, let's call handleSubmit
    handleSubmit();
  };

  const handleSubmit = () => {
    const requestData = {
      username: username,
      password: password,
      email: email,
    };

    if (mode === 'signup') {
      requestData.email = email;
    }
    console.log("logging in");
    const endpoint = mode === 'signup' ? 'signup' : 'login';
    axios
    .post(`http://10.155.229.89:5000/${endpoint}`, requestData)
    .then((response) => {
      console.log("Made it here");
      if (response.data.message === 'User successfully created' || response.data.message === "Login successful") {
          console.log("userinfo signup: ", response.data.userInfo.Items);
          if (mode === 'signup'){
            
            navigation.navigate('AppScreen', { userInfo: response.data.userInfo.Items[0] });

          }
          else{
            console.log("userinfo signup: ", response.data.userInfo);

          navigation.navigate('AppScreen', { userInfo: response.data.userInfo });
          }
      } else {
        setErrorMessage(response.data.message || 'Login failed');
        console.log(response.data);
      }
    })
    .catch((error) => {
      setErrorMessage('An error occurred while communicating with the server');
      console.error(error);
    });
};

  return (
    <LinearGradient
      colors={['#0d47a1', '#1565c0']}
      style={styles.container}
    >
      <SafeAreaView>
        <View style={styles.title}>
          <Text style={styles.titleText}>KickOff Connect</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, mode === 'signup' ? styles.selectedButton : null]}
            onPress={() => handleButtonPress('signup')}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, mode === 'login' ? styles.selectedButton : null]}
            onPress={() => handleButtonPress('login')}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {mode === 'signup' && (
          <TextInput
            id="username"
            onChangeText={setUsername}
            placeholder="Username"
            value={username}
            style={[styles.input, { color: '#ffffff', backgroundColor: 'transparent' }]}
            autoCapitalize="none"
          />
        )}

        <TextInput
          id="email"
          onChangeText={setEmail}
          placeholder="Email"
          value={email}
          style={[styles.input, { color: '#ffffff', backgroundColor: 'transparent' }]}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          id="password"
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
          style={[styles.input, { color: '#0d47a1', backgroundColor: 'transparent' }]}
        />

        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, continuePressed ? styles.selectedButton : null]}
          onPress={handleContinuePress}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },
  titleText: {
    fontSize: 36, // Adjust the font size as needed
    color: '#fff',
    fontWeight: 'bold', // Add fontWeight if needed
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset
    textShadowRadius: 5, // Shadow radius
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    color: '#fff',
  },
  errorMessage: {
    color: 'yellow',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1565c0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  selectedButton: {
    backgroundColor: '#0d47a1',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginScreen;

