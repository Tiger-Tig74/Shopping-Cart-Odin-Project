import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/renderWithProviders";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";

const items = [
    { id: 1, title: "Mug", price: 5, image: "m.png" },
    { id: 2, title: "Pen", price: 2, image: "p.png" },
];

function Seed() {
    const { addToCart } = useCart();
    return (
        <>
            <button onClick={() => addToCart(items[0], 2)}>add-mug-2</button>
            <button onClick={() => addToCart(items[1], 3)}>add-pen-3</button>
        </>
    );
}

const renderPage = () =>
    renderWithProviders(
        <>
            <Seed />
            <Cart />
        </>,
    );

describe("Cart page", () => {
    it("shows empty state when cart has nothing", () => {
        renderWithProviders(<Cart />);
        expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: /go to shop/i }),
        ).toBeInTheDocument();
    });

    it("renders each cart line with title and subtotal", async () => {
        const user = userEvent.setup();
        renderPage();
        await user.click(screen.getByText("add-mug-2"));
        await user.click(screen.getByText("add-pen-3"));

        expect(screen.getByText("Mug")).toBeInTheDocument();
        expect(screen.getByText("Pen")).toBeInTheDocument();
        expect(screen.getByText("$10.00")).toBeInTheDocument();
        expect(screen.getByText("$6.00")).toBeInTheDocument();
    });

    it("displays the correct total", async () => {
        const user = userEvent.setup();
        renderPage();
        await user.click(screen.getByText("add-mug-2"));
        await user.click(screen.getByText("add-pen-3"));
        expect(screen.getByText(/Total: \$16\.00/)).toBeInTheDocument();
    });

    it("decrementing a line at qty 1 removes it from the page", async () => {
        const user = userEvent.setup();
        renderPage();
        await user.click(screen.getByText("add-mug-2"));
        await user.click(screen.getByText("add-pen-3"));

        await user.click(screen.getByLabelText(/Decrease Mug/i));
        await user.click(screen.getByLabelText(/Decrease Mug/i));

        expect(screen.queryByText("Mug")).not.toBeInTheDocument();
        expect(screen.getByText(/Total: \$6\.00/)).toBeInTheDocument();
    });

    it("clear cart returns to empty state", async () => {
        const user = userEvent.setup();
        renderPage();
        await user.click(screen.getByText("add-mug-2"));
        await user.click(screen.getByRole("button", { name: /clear cart/i }));
        expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });
});
