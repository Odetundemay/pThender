import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";

const SearchScreen = ({ results, loading }) => {
  const defaultAvatar = require("../assets/defaultavatar.jpeg");

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image
        source={item.profile_picture || defaultAvatar}
        resizeMode="contain"
        style={{
          width: 50,
          height: 50,
          borderRadius: 25, // half of 50
        }}
      />

      <Text style={{ fontSize: 18 }}>{item.username}</Text>
      <TouchableOpacity
        onPress={() => handleSend(item.id)}
        style={{
          paddingVertical: 5,
          paddingHorizontal: 15,
          borderRadius: 20,
          padding: 10,
          backgroundColor: "#f1f1f1",
        }}
      >
        <Text style={{ fontSize: 16 }}>Send</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : results.length === 0 ? (
        <Text>No results found.</Text>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 10,
    marginLeft: 15,
  },
  item: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 15,
  },
});

export default SearchScreen;
