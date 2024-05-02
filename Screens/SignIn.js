import React from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import ButtonSI from '../ButtonSI'; // Adjusted the import path for ButtonSI
import 'react-native-gesture-handler';
/*import axios from 'react-native-axios';*/

const SignIn = ({ navigation }) => {
  /*const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');*/

  /*const handleSignIn = async () => {
    try {
      const response = await axios.post('localhost:7070/auth/signin', {
        email: email,
        password: password,
      });

      // Handle successful sign-in
      console.log(response.data);
      Alert.alert('Success', 'Signed in successfully');
    } catch (error) {
      // Handle sign-in error
      console.error(error);
      Alert.alert('Error', 'Failed to sign in');
    }
  };*/
  return (
    <View style={styles.mainContainer}>
      <Image
        source={require('../assets/book.png')}
        style={styles.image}
      />
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subTitle}>Sign in to your account</Text>
        <TextInput
          placeholder="email"
          style={styles.textInput}
        />
        <TextInput
          placeholder="password"
          style={styles.textInput}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordButtonText}>Forgot your password?</Text>
        </TouchableOpacity>
        <ButtonSI />
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate('SignUp')} // Navigate to SignUp screen
        >
          <Text style={styles.createAccountButtonText}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    width: '80%',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: -50,
  },
  title: {
    fontSize: 70,
    color: '#2B9DF2',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 17,
    color: 'gray',
    marginBottom: 20,
  },
  textInput: {
    padding: 10,
    paddingStart: 30,
    width: '100%',
    height: 50,
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: '#D5FFFF',
  },
  forgotPasswordButton: {
    marginBottom: 20,
  },
  forgotPasswordButtonText: {
    fontSize: 15,
    color: '#2B9DF2',
  },
  createAccountButton: {
    marginBottom: 40,
  },
  createAccountButtonText: {
    fontSize: 15,
    color: '#2B9DF2',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
  },
});

export default SignIn;
