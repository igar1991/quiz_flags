import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import {THEME} from "./THEME"

export const Header = ({ title, status, backUp, life }) => {
  return (
    <View style={styles.container}>
      {status !== "main" && (
        <View
          style={{
            flex: 1,
            marginLeft: 10,
            paddingBottom: 8,
            position: "absolute",
            alignSelf: "flex-start",
          }}
        >
          <TouchableOpacity onPress={backUp}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
      <View
          style={{
            flex: 1,
            paddingBottom: 10,
            paddingRight: 10,
            position: "absolute",
            alignSelf: "flex-end",
            flexDirection: "row"
          }}
        >
      <Text style={[styles.text, {marginRight: 10}]} >{life}</Text><AntDesign name="heart" size={24} color="red" />
      </View>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 70,
    backgroundColor: THEME.main,
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontFamily: "Lemon",
  },
});
