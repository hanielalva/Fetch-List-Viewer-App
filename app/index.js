import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';

const FetchList = () => {
  const [data, setData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    // Fetch data from the provided URL
    fetch('https://fetch-hiring.s3.amazonaws.com/hiring.json')
      .then((response) => response.json())
      .then((json) => {
        // Filter out items with blank or null names
        const filteredData = json.filter((item) => item.name && item.name.trim() !== '');

        // Group items by "listId"
        const groupedData = {};
        filteredData.forEach((item) => {
          if (!groupedData[item.listId]) {
            groupedData[item.listId] = [];
          }
          groupedData[item.listId].push(item);
        });

        // Sort groups by "listId"
        const sortedGroups = Object.entries(groupedData).sort(([listIdA], [listIdB]) => listIdA - listIdB);

        // Sort items within each group by the number in "name"
        const sortedData = sortedGroups.map(([listId, items]) => {
          const sortedItems = items.sort((a, b) => {
            const numberA = parseInt(a.name.match(/\d+/));
            const numberB = parseInt(b.name.match(/\d+/));
            return numberA - numberB;
          });
          return [listId, sortedItems];
        });

        // Update state with the sorted data
        setData(sortedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('./fetch-logo.jpg')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.header}>Fetch Items List</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <View style={styles.groupContainer}>
            <TouchableOpacity onPress={() => setSelectedGroup(item[0])}>
              <Text style={styles.groupHeader}>List ID: {item[0]}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {selectedGroup && (
        <Modal animationType="slide" transparent={true} visible={!!selectedGroup} onRequestClose={() => setSelectedGroup(null)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ScrollView>
                {data.find((item) => item[0] === selectedGroup)?.[1].map((itemData) => (
                  <Text key={itemData.id} style={styles.modalText}>
                    {itemData.name}
                  </Text>
                ))}
                <TouchableOpacity onPress={() => setSelectedGroup(null)}>
                  <Text style={styles.closeButton}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white', 
  },
  logo: {
    width: '100%', 
    height: 100, 
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FF9900', 
  },
  groupContainer: {
    flex: 1,
    marginBottom: 16,
    backgroundColor: '#FFEBCC', 
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#FF9900', 
    color: 'white', 
    padding: 12,
    textAlign: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  groupItem: {
    marginLeft: 16,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FF9900',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFCC66', 
    borderRadius: 10,
    padding: 16,
    width: '80%',
    maxHeight: '80%',
    elevation: 10, 
  },
  modalText: {
    fontSize: 18,
    color: 'white', 
  },
  closeButton: {
    backgroundColor: '#FF9900', 
    color: 'white', 
    padding: 12,
    textAlign: 'center',
    borderRadius: 10,
    marginTop: 16,
    fontSize: 18,
  },
});

export default FetchList;
