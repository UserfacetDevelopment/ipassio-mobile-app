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
    marginVertical:8,
    shadowColor: 'rgba(186, 197, 208, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8
  }
});
export default Card;