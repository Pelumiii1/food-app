import { Text, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import OrderListItem from "@/src/components/OrderListItem";
import { useAdminOrderList, useMyOrderList } from "@/src/api/orders";

const OrdersScreen = () => {
  const { data: orders, isLoading, error } = useMyOrderList();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>No Orders Found</Text>;
  }
  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => (
        <Text>
          <OrderListItem order={item} />
        </Text>
      )}
      contentContainerStyle={{ padding: 10, gap: 10 }}
    />
  );
};

export default OrdersScreen;
