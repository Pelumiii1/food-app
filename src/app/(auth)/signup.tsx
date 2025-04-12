import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Link, Stack } from "expo-router";
import Colors from "@/src/constants/Colors";
import Button from "@/src/components/button";
import { supabase } from "@/src/lib/supabase";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign up" }} />
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="john@email.com"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        onPress={signUpWithEmail}
        text={loading ? "Creating account..." : "Create Account"}
        disabled={loading}
      />
      <Link href="/signin" style={styles.textButton}>
        Sign in
      </Link>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "grey",
  },
  label: {
    color: "grey",
    fontSize: 16,
  },
});
