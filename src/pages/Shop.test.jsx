import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import Shop from "./Shop";

const fakeProducts = [
    { id: 1, title: "Widget", price: 10, image: "a.png" },
    { id: 2, title: "Gadget", price: 20, image: "b.png" },
];

beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("Shop", () => {
    it("shows loading state initially", () => {
        fetch.mockReturnValue(new Promise(() => {}));
        renderWithProviders(<Shop />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("renders a ProductCard per product after fetch", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(fakeProducts),
        });
        renderWithProviders(<Shop />);
        expect(await screen.findByText("Widget")).toBeInTheDocument();
        expect(screen.getByText("Gadget")).toBeInTheDocument();
        expect(fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products");
    });

    it("shows an error message when the request fails", async () => {
        fetch.mockResolvedValue({ ok: false, status: 500 });
        renderWithProviders(<Shop />);
        expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();
    });

    it("shows an error message when fetch rejects", async () => {
        fetch.mockRejectedValue(new Error("network down"));
        renderWithProviders(<Shop />);
        expect(await screen.findByText(/network down/i)).toBeInTheDocument();
    });
});
