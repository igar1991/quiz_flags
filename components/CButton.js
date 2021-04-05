import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import {THEME} from "./THEME"



export const CButton = (props) => {
    const { title = 'Enter', style = {}, textStyle = {}, onPress, icon } = props;    

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]} disabled={style.backgroundColor==THEME.red?true:false}>
            <Text style={[styles.text, textStyle]}>{props.title}</Text>
            {icon&&<View
          style={{
            flexDirection: "row",
            paddingRight: 10,
            position: "absolute",
            alignSelf: "flex-end",
          }}
        >
      <Text style={[styles.text, {marginRight: 5}]} >+1</Text><AntDesign name="heart" size={24} color="red" />
      </View>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: THEME.second,
        marginBottom: 10
    },

    text: {
        fontSize: 16,
        textTransform: 'uppercase',
        color: '#FFFFFF',
        fontFamily: "Lemon",

    },
});