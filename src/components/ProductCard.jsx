import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleInput = (e) => {
        const raw = e.target.value;
        if (raw === "" || !/^\d+$/.test(raw)) {
            setQuantity(0);
            return;
        }
        setQuantity(parseInt(raw, 10));
    };

    return (
        <div className="product-card">
            <img
                src={product.image}
                alt={product.title}
                className="product-image"
            />
            <h3 className="product-title">{product.title}</h3>
            <p className="product-price">${product.price.toFixed(2)}</p>

            <div className="quantity-controls">
                <button onClick={() => setQuantity((q) => Math.max(0, q - 1))}>
                    −
                </button>
                <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={handleInput}
                    aria-label={`Quantity for ${product.title}`}
                />
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>

            <button
                className="add-to-cart-btn"
                onClick={() => {
                    addToCart(product, quantity);
                    setQuantity(1);
                }}
                disabled={quantity <= 0}
            >
                Add To Cart
            </button>
        </div>
    );
}
