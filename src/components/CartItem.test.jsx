import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/renderWithProviders";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";

const item = { id: 1, title: "Mug", price: 5, image: "m.png", quantity: 2 };

function Seed() {
    const { addToCart } = useCart();
    return (
        <button
            onClick={() =>
                addToCart({ id: 1, title: "Mug", price: 5, image: "m.png" }, 2)
            }
        >
            seed-mug
        </button>
    );
}

function CountProbe({ id = 1 }) {
    const { cartItems } = useCart();
    return (
        <p data-testid="count">
            {cartItems.find((i) => i.id === id)?.quantity ?? 0}
        </p>
    );
}

function SeedQty1() {
    const { addToCart } = useCart();
    return (
        <button
            onClick={() =>
                addToCart({ id: 1, title: "Mug", price: 5, image: "m.png" }, 1)
            }
        >
            seed-mug-1
        </button>
    );
}

const renderItem = async (user) => {
    const result = renderWithProviders(
        <>
            <Seed />
            <CartItem item={item} />
            <CountProbe id={1} />
        </>,
    );
    await user.click(screen.getByText("seed-mug"));
    return result;
};

describe("CartItem", () => {
    it("renders title, unit price, quantity, and subtotal", async () => {
        const user = userEvent.setup();
        await renderItem(user);
        expect(screen.getByText("Mug")).toBeInTheDocument();
        expect(screen.getByText(/\$5\.00 each/)).toBeInTheDocument();
        expect(screen.getByText("$10.00")).toBeInTheDocument();
    });

    it("increment raises the quantity in context", async () => {
        const user = userEvent.setup();
        await renderItem(user);
        await user.click(screen.getByLabelText(/Increase Mug/i));
        expect(screen.getByTestId("count")).toHaveTextContent("3");
    });

    it("decrement lowers the quantity in context", async () => {
        const user = userEvent.setup();
        await renderItem(user);
        await user.click(screen.getByLabelText(/Decrease Mug/i));
        expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    it("decrement at quantity 1 removes the line entirely", async () => {
        const user = userEvent.setup();
        renderWithProviders(
            <>
                <SeedQty1 />
                <CartItem item={{ ...item, quantity: 1 }} />
                <CountProbe id={1} />
            </>,
        );
        await user.click(screen.getByText("seed-mug-1"));
        await user.click(screen.getByLabelText(/Decrease Mug/i));
        expect(screen.getByTestId("count")).toHaveTextContent("0");
    });

    it("remove button clears the line", async () => {
        const user = userEvent.setup();
        await renderItem(user);
        await user.click(screen.getByLabelText(/Remove Mug/i));
        expect(screen.getByTestId("count")).toHaveTextContent("0");
    });
});
