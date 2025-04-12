import { useOrderDetails, useUpdateOrder } from "@/src/api/orders";
import OrderItemListItem from "@/src/components/OrderItemListItem";
import Colors from "@/src/constants/Colors";
import { OrderStatusList } from "@/src/types";
import dayjs from "dayjs";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

const OrderPage = () => {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const { data: order, error, isLoading } = useOrderDetails(id);
  const { mutate: updateOrder } = useUpdateOrder();

  const updateStatus = (status: string) => {
    updateOrder({ id: id, updatedFields: { status } });
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch order</Text>;
  }

  return (
    <View style={{ padding: 10 }}>
      <Stack.Screen options={{ title: `Order ${order.id}` }} />
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
        ListFooterComponent={() => (
          <>
            <Text style={{ fontWeight: "bold" }}>Status</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => updateStatus(status)}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor:
                      order.status === status
                        ? Colors.light.tint
                        : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color:
                        order.status === status ? "white" : Colors.light.tint,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      />
    </View>
  );
};

export default OrderPage;
