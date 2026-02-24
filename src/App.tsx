import { Routes, Route, Navigate } from "react-router-dom";
import ConfigurePage from "./pages/ConfigurePage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import QuestionsPage from "./pages/QuestionsPage.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/configure" />} />
      <Route path="/configure" element={<ConfigurePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/questions" element={<QuestionsPage />} />
    </Routes>
  );
}

export default App;
