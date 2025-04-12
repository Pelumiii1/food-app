import { createContext, PropsWithChildren, useContext, useState } from "react";
import { CartItem, Product } from "../types";
import { randomUUID } from "expo-crypto";
import { useInsertOrder } from "../api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../api/order-items";

type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
};

export const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { mutate: insertOrder, error } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();
  const router = useRouter();

  const addItem = (product: Product, size: CartItem["size"]) => {
    const existingItem = items.find(
      (item) => item.product === product && item.size === size
    );
    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      size,
      quantity: 1,
      product_id: product.id,
    };
    setItems([newCartItem, ...items]);
  };

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    const updatedItems = items
      .map((item) =>
        item.id !== itemId
          ? item
          : {
              ...item,
              quantity: item.quantity + amount,
            }
      )
      .filter((item) => item.quantity > 0);
    setItems(updatedItems);
  };

  const total = items.reduce(
    (sum, items) => (sum += items.product.price * items.quantity),
    0
  );

  const clearCart = () => {
    setItems([]);
  };

  const checkout = () => {
    insertOrder(
      { total },
      {
        onSuccess: saveOrderItems,
      }
    );
  };

  const saveOrderItems = (order: any) => {
    const orderItems = items.map((cartItem) => ({
      order_id: order.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      size: cartItem.size,
    }));

    insertOrderItems(orderItems, {
      onSuccess() {
        clearCart();
        router.push(`/(user)/orders/${order.id}`);
      },
    });
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, total, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => useContext(CartContext);
