import { useOrderDetails } from "@/src/api/orders";
import OrderItemListItem from "@/src/components/OrderItemListItem";
import { supabase } from "@/src/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const OrderPage = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const { data: order, error, isLoading } = useOrderDetails(id);
  const queryClient = useQueryClient();

  useEffect(() => {
    const orders = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["orders", id] });
        }
      )
      .subscribe();

    return () => {
      orders.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch order</Text>;
  }

  return (
    <View style={{ padding: 10 }}>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />
      <View
        style={{
          backgroundColor: "white",
          marginBottom: 10,
          padding: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          borderRadius: 10,
        }}
      >
        <View>
          <Text style={{ fontWeight: "700", fontSize: 17 }}>
            Order #{order.id}
          </Text>
          <Text style={{ color: "grey" }}>
            {dayjs(order.created_at).fromNow()}
          </Text>
        </View>
        <Text>{order.status}</Text>
      </View>
      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};

export default OrderPage;
