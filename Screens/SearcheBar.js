import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Button,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Contacts from 'expo-contacts';
import SearchAll from './SearchAll';

export default function App() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [inMemoryContacts, setInMemoryContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);

  useEffect(() => {
    setIsLoading(true);
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your contacts.',
          [{ text: 'OK' }]
        );
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      });

      console.log(data);
      setContacts(data);
      setInMemoryContacts(data);
      setIsLoading(false);
    } catch (error) {
      console.log('Error loading contacts:', error);
      // Handle the error, e.g., show an error message to the user
    }
  };

  const filterByName = (contact) => {
    const contactLowercase = (
      contact.firstName +
      ' ' +
      contact.lastName
    ).toLowerCase();

    const searchTermLowercase = searchQuery.toLowerCase();

    return contactLowercase.indexOf(searchTermLowercase) > -1;
  };

  const filterByPhone = (contact) => {
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      const contactPhoneNumber = contact.phoneNumbers[0].digits;
      const searchTermLowercase = searchQuery.toLowerCase();

      return contactPhoneNumber.indexOf(searchTermLowercase) > -1;
    }

    return false;
  };

  const searchByName = () => {
    const filteredContacts = inMemoryContacts.filter(filterByName);
    setContacts(filteredContacts);
  };

  const searchByPhone = () => {
    const filteredContacts = inMemoryContacts.filter(filterByPhone);
    setContacts(filteredContacts);
  };

  const handlePreviousPage = () => {
    navigation.navigate('PreviousPage'); // Replace 'PreviousPage' with the name of the previous screen
  };

  const handleNextPage = () => {
    navigation.navigate('SearchAll'); // Replace 'NextPage' with the name of the next screen
  };

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  const renderItem = ({ item }) => (
    <View style={styles.contactContainer}>
      <Text style={styles.contactName}>
        {item.firstName} {item.lastName}
      </Text>
      {item.phoneNumbers && item.phoneNumbers.length > 0 ? (
        <Text style={styles.contactNumber}>{item.phoneNumbers[0].digits}</Text>
      ) : (
        <Text style={styles.noPhoneNumber}>No phone number</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} />
      <TextInput
        placeholder="Search "
        placeholderTextColor="#2f363c"
        style={styles.searchBar}
        onChangeText={setSearchQuery}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.searchButton}>
          <Button
            title="Search by Name"
            onPress={searchByName}
            color="#2f363c"
          />
        </View>
        <View style={styles.searchButton}>
          <Button
            title="Search by Phone"
            onPress={searchByPhone}
            color="#2f363c"
          />
        </View>
      </View>
      <View style={styles.contactsContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2f363c" />
          </View>
        ) : null}
        <FlatList
          data={currentContacts}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={() => (
            <View style={styles.noContactsContainer}>
              <Text style={styles.noContactsText}>No Contacts Found</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false} // Hide the scrolling bar
        />
      </View>
      <View style={styles.footer}>
        <Button
          title="Previous"
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
        />
        <Text
          style={styles.pageText}
        >
          Page {currentPage}
        </Text>
        <Button
          title="Next"
          onPress={handleNextPage}
          disabled={indexOfLastContact >= contacts.length}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    backgroundColor: '#ffffff',
  },
  searchBar: {
    backgroundColor: '#D5FFFF',
    height: 50,
    width: 250,
    borderRadius: 40,
    alignSelf: 'center',
    fontSize: 16,
    padding: 10,
    paddingLeft: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  searchButton: {
    borderRadius: 40,
    paddingHorizontal: 10,
  },
  contactsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
  },
  contactContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2f363c',
  },
  contactNumber: {
    fontSize: 14,
    color: '#2f363c',
  },
  noPhoneNumber: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContactsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noContactsText: {
    fontSize: 18,
    color: '#2f363c',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  pageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});