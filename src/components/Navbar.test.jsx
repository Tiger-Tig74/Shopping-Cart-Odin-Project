import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/renderWithProviders";
import { useCart } from "../context/CartContext";
import Navbar from "./Navbar";

function AddButton() {
    const { addToCart } = useCart();
    return (
        <button onClick={() => addToCart({ id: 99, title: "X", price: 1 }, 3)}>
            seed-cart
        </button>
    );
}

const renderNav = () =>
    renderWithProviders(
        <>
            <Navbar />
            <AddButton />
        </>,
    );

describe("Navbar", () => {
    it("renders all nav links", () => {
        renderNav();
        expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /shop/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /cart/i })).toBeInTheDocument();
    });

    it("omits the count badge when the cart is empty", () => {
        renderNav();
        expect(screen.queryByText(/\(\d+\)/)).not.toBeInTheDocument();
    });

    it("shows the count and updates in real time as items are added", async () => {
        const user = userEvent.setup();
        renderNav();

        await user.click(screen.getByText("seed-cart"));
        expect(screen.getByRole("link", { name: /cart/i })).toHaveTextContent(
            "(3)",
        );
    });
});
