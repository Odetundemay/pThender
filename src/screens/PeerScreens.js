import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";

const yourAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc4MTM2NDYyLCJpYXQiOjE2NzgxMjU2NjIsImp0aSI6IjQyZTJmZWUwMjJmNDQzMjFiYmNmZTkxM2RhYjkwNzQ0IiwidXNlcl9pZCI6ImI4NmVlYWMxLWYwNDctNGU4OS04OWM3LTY4OTU1MDVmZmE2MCJ9.Z4XFTGfnRk8gqCO-vElCu6eoxz3KoMO4LwVXroxj3nk";

const PeerScreens = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const url = `https://thender.onrender.com/search/?q=${query}&p=${page}&s=1`;

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${yourAccessToken}`,
        "Content-Type": "application/json",
      },
    };

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setResults(data);
      })
      .catch((error) => console.log(error));
  };

  const renderItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 18 }}>{item.username}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Search for user"
        style={{ padding: 10, borderColor: "black", borderWidth: 1 }}
        onChangeText={(text) => setQuery(text)}
      />
      <TouchableOpacity
        onPress={handleSearch}
        style={{ backgroundColor: "blue", padding: 10, marginTop: 10 }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Search</Text>
      </TouchableOpacity>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default PeerScreens;
