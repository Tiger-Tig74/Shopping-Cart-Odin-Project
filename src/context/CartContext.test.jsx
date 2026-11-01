import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "./CartContext";

const sampleProduct = { id: 1, title: "Shirt", price: 19.99, image: "x.png" };
const anotherProduct = { id: 2, title: "Hat", price: 9.5, image: "y.png" };

function Probe() {
    const {
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        increment,
        decrement,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();

    return (
        <div>
            <p data-testid="count">{cartCount}</p>
            <p data-testid="total">{cartTotal.toFixed(2)}</p>
            <p data-testid="items">{JSON.stringify(cartItems)}</p>
            <button onClick={() => addToCart(sampleProduct, 2)}>
                add-sample-2
            </button>
            <button onClick={() => addToCart(anotherProduct, 1)}>
                add-another-1
            </button>
            <button onClick={() => increment(1)}>inc-1</button>
            <button onClick={() => decrement(1)}>dec-1</button>
            <button onClick={() => updateQuantity(1, 10)}>set-1-10</button>
            <button onClick={() => updateQuantity(1, 0)}>set-1-0</button>
            <button onClick={() => removeFromCart(2)}>remove-2</button>
            <button onClick={clearCart}>clear</button>
        </div>
    );
}

const renderProbe = () =>
    render(
        <CartProvider>
            <Probe />
        </CartProvider>,
    );

describe("CartContext", () => {
    it("starts empty", () => {
        renderProbe();
        expect(screen.getByTestId("count")).toHaveTextContent("0");
        expect(screen.getByTestId("total")).toHaveTextContent("0.00");
    });

    it("adds a new item with the given quantity", async () => {
        const user = userEvent.setup();
        renderProbe();
        await user.click(screen.getByText("add-sample-2"));
        expect(screen.getByTestId("count")).toHaveTextContent("2");
        const items = JSON.parse(screen.getByTestId("items").textContent);
        expect(items).toHaveLength(1);
        expect(items[0]).toMatchObject({ id: 1, quantity: 2 });
    });

    it("increments quantity when adding an existing product", async () => {
        const user = userEvent.setup();
        renderProbe();
        await user.click(screen.getByText("add-sample-2"));
        await user.click(screen.getByText("add-sample-2"));
        const items = JSON.parse(screen.getByTestId("items").textContent);
        expect(items).toHaveLength(1);
        expect(items[0].quantity).toBe(4);
    });

    it("computes cartTotal across multiple items", async () => {
        const user = userEvent.setup();
        renderProbe();
        await user.click(screen.getByText("add-sample-2"));
        await user.click(screen.getByText("add-another-1"));
        expect(screen.getByTestId("total")).toHaveTextContent("49.48");
    });

    it("increment adds one to a line", async () => {
        const user = userEvent.setup();
        renderProbe();
        await user.click(screen.getByText("add-sample-2"));
        await user.click(screen.getByText("inc-1"));
        const items = JSON.parse(screen.getByTestId("items").textContent);
        expect(items[0].quantity).toBe(3);
    });

    it("decrement removes the line when it would hit zero", async () => {
        const user = userEvent.setup();
        renderProbe();
        await user.click(screen.getByText("add-another-1"));
        await user.click(screen.getByText("dec-1"));
        expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    it("updateQuantity to 0 removes the item", async () => {
        const user = userEvent.setup();
        renderProbe();
        await user.click(screen.getByText("add-sample-2"));
        await user.click(screen.getByText("set-1-0"));
        expect(screen.getByTestId("count")).toHaveTextContent("0");
        expect(
            JSON.parse(screen.getByTestId("items").textContent),
        ).toHaveLength(0);
    });

    it("updateQuantity sets an exact value", async () => {
        const user = userEvent.setup();
        renderProbe();
        await user.click(screen.getByText("add-sample-2"));
        await user.click(screen.getByText("set-1-10"));
        expect(screen.getByTestId("count")).toHaveTextContent("10");
    });

    it("removeFromCart drops a specific item", async () => {
        const user = userEvent.setup();
        renderProbe();
        await user.click(screen.getByText("add-sample-2"));
        await user.click(screen.getByText("add-another-1"));
        await user.click(screen.getByText("remove-2"));
        const items = JSON.parse(screen.getByTestId("items").textContent);
        expect(items).toHaveLength(1);
        expect(items[0].id).toBe(1);
    });

    it("clearCart empties everything", async () => {
        const user = userEvent.setup();
        renderProbe();
        await user.click(screen.getByText("add-sample-2"));
        await user.click(screen.getByText("add-another-1"));
        await user.click(screen.getByText("clear"));
        expect(screen.getByTestId("count")).toHaveTextContent("0");
    });

    it("persists to localStorage and rehydrates on remount", async () => {
        const user = userEvent.setup();
        const { unmount } = renderProbe();
        await user.click(screen.getByText("add-sample-2"));
        unmount();

        renderProbe();
        expect(screen.getByTestId("count")).toHaveTextContent("2");
    });

    it("throws when useCart is used outside provider", () => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        function Orphan() {
            useCart();
            return null;
        }
        expect(() => render(<Orphan />)).toThrow(/CartProvider/);
        spy.mockRestore();
    });
});
