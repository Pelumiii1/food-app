import { StatusBar } from "expo-status-bar";
import { FlatList, Platform, Text, View } from "react-native";
import { useCart } from "../provider/CartProvider";
import CartListItem from "../components/CartListItem";
import Button from "../components/button";

const CartScreen = () => {
  const { items, total, checkout } = useCart();
  return (
    <View style={{ padding: 10 }}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
      <Text style={{ marginTop: 20, fontSize: 20, fontWeight: 500 }}>
        Total:${total}
      </Text>
      <Button text="Checkout" onPress={checkout} />
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
};

export default CartScreen;
