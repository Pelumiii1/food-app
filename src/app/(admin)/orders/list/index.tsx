import { Text, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import OrderListItem from "@/src/components/OrderListItem";
import { useAdminOrderList } from "@/src/api/orders";
import { supabase } from "@/src/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

const OrdersScreen = () => {
  const {
    data: orders,
    isLoading,
    error,
  } = useAdminOrderList({ archived: false });

  const queryClient = useQueryClient();

  useEffect(() => {
    const ordersSubscription = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["orders"] });
        }
      )
      .subscribe();
    return () => {
      ordersSubscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>No Orders Found</Text>;
  }

  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{ padding: 10, gap: 10 }}
    />
  );
};

export default OrdersScreen;
