import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import {THEME} from "./THEME";
import { FontAwesome } from '@expo/vector-icons';



export const Test = (props) => {
    const { title = '', style = {}, textStyle = {}, onPress, lock } = props;

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]} disabled={lock} >
            <Text style={[styles.text, textStyle]}>{lock?<FontAwesome name="lock" size={50} color={THEME.main} />: title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 100,
        width: 100,
        marginTop: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: THEME.second
    },

    text: {
        fontSize: 50,
        textTransform: 'uppercase',
        color: '#FFFFFF',
        fontFamily: "Lemon",
    },
});