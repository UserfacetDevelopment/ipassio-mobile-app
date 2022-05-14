import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

//const {width}= Dimensions.get("screen").width;
const Card = (props : any)=> {
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};
const styles = StyleSheet.create({
  card: {
    marginVertical:5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 4
  }
});
export default Card;