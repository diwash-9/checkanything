import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { currencyCategory } from "@/domain/units/categories/currency";
import Converter from "./Converter";

const ratesPayload = {
  base: "USD",
  date: "2026-10-16",
  source: "test-provider",
  rates: { USD: 1, NPR: 133.45, EUR: 0.92 },
};

function mockRatesResponse() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ratesPayload,
    })),
  );
}

describe("Converter (currency path)", () => {
  beforeEach(() => {
    localStorage.clear();
    mockRatesResponse();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("converts USD to NPR live as rates load", async () => {
    render(<Converter category={currencyCategory} initialValue={100} />);

    const to = await screen.findByLabelText("To");
    await waitFor(() => expect(to).toHaveValue("13,345.00"));
  });

  it("recomputes as the amount changes", async () => {
    const user = userEvent.setup();
    render(<Converter category={currencyCategory} initialValue={1} />);

    const from = await screen.findByLabelText("From");
    const to = screen.getByLabelText("To");
    await waitFor(() => expect(to).toHaveValue("133.45"));

    await user.clear(from);
    await user.type(from, "10");
    await waitFor(() => expect(to).toHaveValue("1,334.50"));
  });

  it("swaps units and carries the result into the input", async () => {
    const user = userEvent.setup();
    render(<Converter category={currencyCategory} initialValue={100} />);

    const to = await screen.findByLabelText("To");
    await waitFor(() => expect(to).toHaveValue("13,345.00"));

    await user.click(screen.getByRole("button", { name: /swap units/i }));

    const from = screen.getByLabelText("From");
    await waitFor(() => expect(from).toHaveValue("13345"));
  });
});
