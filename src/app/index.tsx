import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Button from "../components/button";
import { Link, Redirect } from "expo-router";
import { useAuth } from "../provider/AuthProvider";
import { supabase } from "../lib/supabase";

const index = () => {
  const { session, loading, isAdmin } = useAuth();

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!session) {
    return <Redirect href={"/signin"} />;
  }

  if (!isAdmin) {
    return <Redirect href={"/(user)"} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <Link href={"/(user)"} asChild>
        <Button text="User" />
      </Link>
      <Link href={"/(admin)"} asChild>
        <Button text="Admin" />
      </Link>

      {session && (
        <Button
          onPress={() => supabase.auth.signOut()}
          disabled={loading}
          text={loading ? "Signing Out" : "Sign Out"}
        />
      )}
    </View>
  );
};

export default index;
