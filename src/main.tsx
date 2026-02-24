import { InterviewProvider } from "./context/InterviewContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <InterviewProvider>
        <App />
      </InterviewProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
