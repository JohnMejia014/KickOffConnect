import { StyleSheet, Text, View } from "react-native";
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View>
      <View style={styles.main}>
        <Text style={styles.title}>Hello World</Text>
        <Link href={"/profile"}>User Profile</Link>

        <Link href={"/imageUpload"}>Choose image</Link>
      </View>
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
    maxWidth: 960,
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
});
