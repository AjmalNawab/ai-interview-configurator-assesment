import { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { InterviewConfig } from "../types/interview";

type Action =
  | { type: "SET_TYPE"; payload: InterviewConfig["interviewType"] }
  | { type: "SET_DIFFICULTY"; payload: InterviewConfig["difficulty"] }
  | { type: "SET_TOPICS"; payload: string[] }
  | { type: "SET_DURATION"; payload: InterviewConfig["duration"] }
  | { type: "SET_ADDONS"; payload: Partial<InterviewConfig["addOns"]> }
  | { type: "SET_ALL"; payload: InterviewConfig }
  | { type: "RESET" };

const initialState: InterviewConfig = {
  interviewType: undefined,
  difficulty: undefined,
  topics: [],
  duration: undefined,
  addOns: {
    aiFollowUp: false,
    performanceReport: false,
    videoRecording: false,
    expertReview: false,
  },
};

const InterviewContext = createContext<{
  state: InterviewConfig;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

function reducer(state: InterviewConfig, action: Action): InterviewConfig {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, interviewType: action.payload };
    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.payload };
    case "SET_TOPICS":
      return { ...state, topics: action.payload };
    case "SET_DURATION":
      return { ...state, duration: action.payload };
    case "SET_ADDONS":
      return { ...state, addOns: { ...state.addOns, ...action.payload } };
    case "SET_ALL":
      return { ...action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    // Load from localStorage if less than 30 minutes old
    const saved = localStorage.getItem("interviewConfig");
    if (saved) {
      const parsed = JSON.parse(saved) as {
        data: InterviewConfig;
        timestamp: number;
      };
      const now = new Date().getTime();
      if (now - parsed.timestamp < 30 * 60 * 1000) {
        return parsed.data;
      } else {
        localStorage.removeItem("interviewConfig");
        return init;
      }
    }
    return init;
  });

  useEffect(() => {
    localStorage.setItem(
      "interviewConfig",
      JSON.stringify({ data: state, timestamp: new Date().getTime() }),
    );
  }, [state]);

  return (
    <InterviewContext.Provider value={{ state, dispatch }}>
      {children}
    </InterviewContext.Provider>
  );
};

export default InterviewContext;
