import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/renderWithProviders";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";

const product = {
    id: 1,
    title: "Fjallraven Backpack",
    price: 109.95,
    image: "https://static.vecteezy.com/system/resources/previews/023/459/340/non_2x/school-backpack-isolated-illustration-ai-generative-free-photo.jpg",
};

function CartCountProbe() {
    const { cartCount } = useCart();
    return <p data-testid="cart-count">{cartCount}</p>;
}

const renderCard = () =>
    renderWithProviders(
        <>
            <ProductCard product={product} />
            <CartCountProbe />
        </>,
    );

describe("ProductCard", () => {
    it("renders product title and price", () => {
        renderCard();
        expect(screen.getByText("Fjallraven Backpack")).toBeInTheDocument();
        expect(screen.getByText("$109.95")).toBeInTheDocument();
    });

    it("defaults quantity to 1", () => {
        renderCard();
        expect(screen.getByLabelText(/Quantity for/i)).toHaveValue(1);
    });

    it("increments and decrements via buttons", async () => {
        const user = userEvent.setup();
        renderCard();
        const input = screen.getByLabelText(/Quantity for/i);

        await user.click(screen.getByText("+"));
        expect(input).toHaveValue(2);

        await user.click(screen.getByText("−"));
        expect(input).toHaveValue(1);
    });

    it("never decrements below zero", async () => {
        const user = userEvent.setup();
        renderCard();
        const input = screen.getByLabelText(/Quantity for/i);
        await user.click(screen.getByText("−"));
        await user.click(screen.getByText("−"));
        expect(input).toHaveValue(0);
    });

    it("disables Add To Cart when quantity is 0", async () => {
        const user = userEvent.setup();
        renderCard();
        await user.click(screen.getByText("−"));
        expect(
            screen.getByRole("button", { name: /add to cart/i }),
        ).toBeDisabled();
    });

    it("accepts manual input", async () => {
        const user = userEvent.setup();
        renderCard();
        const input = screen.getByLabelText(/Quantity for/i);
        await user.clear(input);
        await user.type(input, "7");
        expect(input).toHaveValue(7);
    });

    it("clamps negative values to 0", () => {
        renderCard();
        const input = screen.getByLabelText(/Quantity for/i);

        fireEvent.change(input, { target: { value: "-3" } });

        expect(input).toHaveValue(0);
    });

    it("adds the chosen quantity to the cart and resets input", async () => {
        const user = userEvent.setup();
        renderCard();

        await user.click(screen.getByText("+"));
        await user.click(screen.getByRole("button", { name: /add to cart/i }));

        expect(screen.getByTestId("cart-count")).toHaveTextContent("2");
        expect(screen.getByLabelText(/Quantity for/i)).toHaveValue(1);
    });
});
