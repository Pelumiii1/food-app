import { supabase } from "@/src/lib/supabase";
import { useMutation } from "@tanstack/react-query";

export const useInsertOrderItems = () => {
  return useMutation({
    async mutationFn(items: any) {
      const { error, data: newOrder } = await supabase
        .from("order_items")
        .insert(items)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return newOrder;
    },
  });
};
