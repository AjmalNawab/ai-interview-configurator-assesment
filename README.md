# AI Interview Configurator

A React + TypeScript + Vite web app to configure and simulate AI-powered interviews. Users can select interview type, difficulty, duration, topics, and add-ons, then view a dynamic summary with total price updates.

---

## Features

- Select interview **type**: Technical, Behavioral, System Design, Mixed
- Select **difficulty**: Junior, Mid, Senior, Lead
- Choose **duration**: 15, 30, 45, or 60 minutes
- Add **topics** dynamically
- Optional **add-ons**: AI Follow-up, Performance Report, Video Recording, Expert Review
- **Checkout page** calculates total cost and handles coupon logic
- Responsive UI using Tailwind CSS
- Unit tests for key functionality

---

## Setup & Run Instructions

1. **Clone the repository**

   ```bash
   git clone <your-repo-link>
   cd ai-interview-configurator

   Install dependencies
   ```

npm install

Run the project

npm run dev

Open http://localhost:5173
in your browser.

Run tests

npm run test
State Management Approach

The project uses React Context API with useReducer:

Context API provides global state accessible across components (ConfigurePage, CheckoutPage).

useReducer handles state updates in a predictable way, especially for multiple fields like difficulty, topics, and add-ons.

Reason for choice: Simple, lightweight, and fits the small-to-medium scale of this project without adding external dependencies like Redux.
