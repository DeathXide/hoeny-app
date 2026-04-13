import { useShallow } from 'zustand/react/shallow';
import { useCartStore } from '@/store/cartStore';

/**
 * Convenience hook that wraps cartStore with useShallow to prevent
 * unnecessary re-renders when selecting multiple fields.
 */
export const useCart = () => {
  return useCartStore(
    useShallow((state) => ({
      distributorId: state.distributorId,
      distributorName: state.distributorName,
      items: state.items,
      totalItems: state.totalItems,
      subtotal: state.subtotal,
      gstRate: state.gstRate,
      gstAmount: state.gstAmount,
      totalAmount: state.totalAmount,
      setDistributor: state.setDistributor,
      addItem: state.addItem,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
      incrementQuantity: state.incrementQuantity,
      decrementQuantity: state.decrementQuantity,
      clearCart: state.clearCart,
    }))
  );
};
