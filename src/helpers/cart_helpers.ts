import { Cart } from "../data/cart_model";

export const countCartItems = (cart: Cart): number => {
    return cart.lines.reduce((total, line) => total + line.quantity, 0);
}