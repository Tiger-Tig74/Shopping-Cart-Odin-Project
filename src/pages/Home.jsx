import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home-page">
            <h1>Welcome to the Shop</h1>
            <p>Browse our catalog and fill your cart.</p>
            <Link to="/shop" className="cta-button">
                Start Shopping
            </Link>
        </div>
    );
}
