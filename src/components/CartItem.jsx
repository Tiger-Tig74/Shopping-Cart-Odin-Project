import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
    const { increment, decrement, removeFromCart } = useCart();

    return (
        <li className="cart-item">
            <img
                src={item.image}
                alt={item.title}
                className="cart-item-image"
            />
            <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p>${item.price.toFixed(2)} each</p>
            </div>
            <div className="cart-item-controls">
                <button
                    onClick={() => decrement(item.id)}
                    aria-label={`Decrease ${item.title}`}
                >
                    &minus;
                </button>
                <span aria-label={`Quantity of ${item.title}`}>
                    {item.quantity}
                </span>
                <button
                    onClick={() => increment(item.id)}
                    aria-label={`Increase ${item.title}`}
                >
                    &#43;
                </button>
            </div>
            <p className="cart-item-subtotal">
                ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button
                onClick={() => removeFromCart(item.id)}
                aria-label={`Remove ${item.title}`}
            >
                Remove
            </button>
        </li>
    );
}
