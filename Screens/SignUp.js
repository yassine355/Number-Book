import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal'; // Import CountryPicker
import ButtonSU from '../ButtonSU';
import { useNavigation } from '@react-navigation/native';
import 'react-native-gesture-handler';

export default function SignUp() {
  const navigation = useNavigation();
  const [countryCode, setCountryCode] = useState('US'); // Default country code
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <View style={styles.mainContainer}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subTitle}></Text>
        <TextInput
          placeholder="Full Name"
          style={styles.textInput}
        />
        <View style={styles.phoneInputContainer}>
          <CountryPicker
            countryCode={countryCode}
            withFlagButton={true}
            withCallingCodeButton={true}
            withAlphaFilter={true}
            withCallingCode={true}
            onSelect={(country) => setCountryCode(country.cca2)}
          />
          <TextInput
            countryCode={countryCode}
            withFlagButton={true}
            withCallingCodeButton={true}
            withAlphaFilter={true}
            withCallingCode={true}
            onSelect={(country) => setCountryCode(country.cca2)}
            placeholder="Phone Number"
            style={[styles.textInput, { flex: 1 }]}
            keyboardType="phone-pad"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
          />
        </View>
        <TextInput
          placeholder="Email"
          style={styles.textInput}
        />
        <TextInput
          placeholder="Password"
          style={styles.textInput}
          secureTextEntry={true}
        />
        <TextInput
          placeholder="Confirm Password"
          style={styles.textInput}
          secureTextEntry={true}
        />
        <ButtonSU />
        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.createAccountButtonText}>Already have an account</Text>
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
    fontSize: 40,
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
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
});