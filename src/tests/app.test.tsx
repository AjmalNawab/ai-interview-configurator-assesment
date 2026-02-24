// src/tests/app.test.tsx
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ConfigurePage from "../pages/ConfigurePage";
import CheckoutPage from "../pages/CheckoutPage";
import { InterviewProvider } from "../context/InterviewContext";

// Test 1: System Design option disabled for Junior difficulty
test("System Design is disabled when Junior is selected", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <InterviewProvider>
        <ConfigurePage />
      </InterviewProvider>
    </MemoryRouter>,
  );

  const difficultySelect = screen.getByLabelText("Difficulty");
  await user.selectOptions(difficultySelect, "Junior");

  const systemDesignOption = screen.getByRole("option", {
    name: "System Design",
  });
  expect(systemDesignOption).toBeDisabled();
});

// Test 2: Coupon input works (basic interaction)
test("Coupon input accepts a code", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <InterviewProvider>
        <CheckoutPage />
        <Toaster position="top-right" />
      </InterviewProvider>
    </MemoryRouter>,
  );

  const couponInput = screen.getByPlaceholderText("Coupon Code");
  await user.type(couponInput, "SAVE10");
  expect(couponInput).toHaveValue("SAVE10");

  const applyButton = screen.getByText("Apply");
  await user.click(applyButton);

  // Optional: If your component shows an error for subtotal <= 30
  // const errorMessage = await screen.findByText(/minimum order of \$30/i);
  // expect(errorMessage).toBeInTheDocument();
});
