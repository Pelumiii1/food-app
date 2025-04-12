import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import OrderListItem from "@/src/components/OrderListItem";
import { useAdminOrderList } from "@/src/api/orders";
import { Tabs } from "expo-router";

const Archive = () => {
  const {
    data: orders,
    isLoading,
    error,
  } = useAdminOrderList({ archived: true });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>No Orders Found</Text>;
  }
  return (
    <>
      <Tabs.Screen options={{ title: "Archive" }} />
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{ padding: 10, gap: 10, flex: 1 }}
      />
    </>
  );
};

export default Archive;
