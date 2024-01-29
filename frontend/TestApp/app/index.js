import {Platform, StyleSheet, Text, View} from "react-native";
import { Link } from 'expo-router';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';




export default function Page() {

  return (

      <View style={styles.main}>
        <Text style={styles.title}>KickOff</Text>
        <Link style={styles.container} href={"/Navigation/Navigation"}>Enter the app</Link>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  profile:{
    textAlign: "right",
    fontSize: 64,

  },
});
