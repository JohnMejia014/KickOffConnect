import {Platform, StyleSheet, Text, View} from "react-native";
import { Link } from 'expo-router';




export default function Page() {
  return (

      <View style={styles.main}>

        <Text style={styles.title}>Hello World</Text>

        <Link style={styles.container} href={"/components/profile"}>User Profile</Link>

        <Link style={styles.container} href={"/imageUpload"}>Choose image</Link>
        <Link style={styles.container} href ={"/components/SignIn"}>Sign in</Link>
        <Link style={styles.container} href ={"/components/SignUp"}>Sign up</Link>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
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
