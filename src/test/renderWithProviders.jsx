import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../context/CartContext";

export function renderWithProviders(
    ui,
    { route = "/", initialEntries = [route], ...options } = {},
) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <CartProvider>{ui}</CartProvider>
        </MemoryRouter>,
        options,
    );
}
