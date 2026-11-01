import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

export default function Cart() {
    const { cartItems, cartTotal, cartCount, clearCart } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <h1>Your Cart</h1>
                <p>Your cart is empty.</p>
                <Link to="/shop">Go to Shop</Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            <p>{cartCount} item(s) in cart</p>
            <ul className="cart-list">
                {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </ul>
            <div className="cart-summary">
                <strong>Total: ${cartTotal.toFixed(2)}</strong>
                <button onClick={clearCart}>Clear Cart</button>
            </div>
        </div>
    );
}
