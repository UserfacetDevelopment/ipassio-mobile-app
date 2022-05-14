import React, { Component } from "react";
import { useSelector } from "react-redux";
import { View, StatusBar } from "react-native";
import { ProgressDialog } from "react-native-simple-dialogs";
import {loaderState } from '../reducers/loader.slice';

export default function DialogLoader() {
    const {loading} = useSelector(loaderState)

  return (
    <View>
      {loading ? (
        <StatusBar backgroundColor="#aaa" barStyle="light-content" />
      ) : null}
      <ProgressDialog
        visible={loading}
        activityIndicatorColor={"red"}
        message="Please wait.."
      />
    </View>
  );
}
