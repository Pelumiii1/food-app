import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import Button from "@/src/components/button";
import { useCart } from "@/src/provider/CartProvider";
import { PizzaSize } from "@/src/types";
import { useProduct } from "@/src/api/products";
import { defaultPizzaImage } from "@/src/constants/Images";
import RemoteImage from "@/src/components/RemoteImage";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const ProductDetailsScreen = () => {
  const router = useRouter();
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  // Fetch Product Details
  const { data: product, error, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

  const addToCart = () => {
    if (!product) {
      return;
    }
    addItem(product, selectedSize);
    router.push("/cart");
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Product not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product?.name }} />
      <RemoteImage
        path={product.image}
        fallback={defaultPizzaImage}
        style={styles.image}
      />
      <Text>Select size</Text>

      <View style={styles.sizes}>
        {sizes.map((size, index) => (
          <Pressable
            key={index}
            style={[
              styles.size,
              {
                backgroundColor: selectedSize === size ? "gainsboro" : "white",
              },
            ]}
            onPress={() => setSelectedSize(size)}
          >
            <Text
              style={[
                styles.sizeText,
                { color: selectedSize === size ? "black" : "grey" },
              ]}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.price}>${product.price}</Text>
      <Button text="Add to cart" onPress={addToCart} />
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10,
  },
  price: { fontSize: 18, fontWeight: "bold", marginTop: "auto" },
  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  size: {
    backgroundColor: "gainsboro",
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: { fontSize: 20, fontWeight: "bold" },
});
