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
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import geolib from 'geolib';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function SearcheAll() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [inMemoryContacts, setInMemoryContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(10);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestPhoneNumber, setNearestPhoneNumber] = useState(null);

  const searchByName = async () => {
    try {
      const response = await axios.get(`https://your-api-url/searchByName?name=${encodeURIComponent(searchQuery)}`);
      const data = response.data;
      setContacts(data);
      setInMemoryContacts(data);
    } catch (error) {
      console.log('Error searching contacts by name:', error);
    }
  };

  const searchByPhone = async () => {
    try {
      const response = await axios.get(`https://your-api-url/searchByPhone?phoneNumber=${searchQuery}`);
      const data = response.data;
      setContacts(data);
      setInMemoryContacts(data);
    } catch (error) {
      console.log('Error searching contacts by phone number:', error);
    }
  };

  const handlePreviousPage = () => {
    navigation.navigate('SearcheBar');
  };

  const handleNextPage = () => {
    navigation.navigate('');
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

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      // Find the nearest phone number within 100 square meters
      const nearestNumber = contacts.reduce((prev, curr) => {
        if (!curr.phoneNumbers || curr.phoneNumbers.length === 0 || !curr.latitude || !curr.longitude) {
          return prev;
        }

        const distance = geolib.getDistance(
          { latitude: location.coords.latitude, longitude: location.coords.longitude },
          { latitude: curr.latitude, longitude: curr.longitude }
        );

        if (distance <= 100 && (!prev.distance || distance < prev.distance)) {
          return { number: curr.phoneNumbers[0].digits, latitude: curr.latitude, longitude: curr.longitude, distance };
        }

        return prev;
      }, null);

      setNearestPhoneNumber(nearestNumber);

      if (nearestNumber) {
        Alert.alert(
          'Nearest Phone Number',
          `The nearest phone number within 100m is: ${nearestNumber.number}`
        );
      } else {
        Alert.alert('No Phone Number Found', 'There are no phone numbers within 100m');
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const handleGetLocation = () => {
    getLocation();
    navigation.navigate('Location', { userLocation, nearestPhoneNumber });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} />
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="#2f363c"
          style={styles.searchBar}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.locationButton} onPress={handleGetLocation}>
          <Ionicons name="map" size={24} color="#2f363c" />
        </TouchableOpacity>
      </View>
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
          showsVerticalScrollIndicator={false}
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
    backgroundColor: '#fff',
  },
  safeArea: {
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  searchBar: {
    backgroundColor: '#D5FFFF',
    height: 50,
    flex: 1,
    borderRadius: 40,
    fontSize: 16,
    paddingHorizontal: 16,
  },
  locationButton: {
    backgroundColor: '#D5FFFF',
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  searchButton: {
    width: '45%',
    borderRadius: 10,
  },
  contactsContainer: {
    flex: 1,
    marginTop: 10,
  },
  contactContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#2f363c',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactNumber: {
    fontSize: 14,
  },
  noPhoneNumber: {
    fontSize: 14,
    color: 'gray',
  },
  noContactsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noContactsText: {
    fontSize: 16,
    color: 'gray',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  pageText: {
    marginHorizontal: 20,
    fontSize: 16,
  },
});
