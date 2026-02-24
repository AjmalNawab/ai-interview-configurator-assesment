import { useContext, useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import InterviewContext from "../context/InterviewContext";
import type { InterviewType, Difficulty, Duration } from "../types/interview.ts";
import { calculateTotal } from "../utils/pricing";

const interviewOptions: InterviewType[] = [
  "Technical",
  "Behavioral",
  "System Design",
  "Mixed",
];
const difficultyOptions: Difficulty[] = ["Junior", "Mid", "Senior", "Lead"];
const durationOptions: Duration[] = [15, 30, 45, 60];

const ConfigurePage = () => {
  const { state, dispatch } = useContext(InterviewContext);
  const [topicInput, setTopicInput] = useState("");

  const price = useMemo(() => {
    if (state.duration && state.difficulty) {
      return calculateTotal(state.duration, state.difficulty, state.addOns);
    }
    return 0;
  }, [state.duration, state.difficulty, state.addOns]);

  // Apply dependency rules and update price whenever options change
  useEffect(() => {
    if (state.interviewType && state.difficulty) {
      // Rule 1: System Design only Senior/Lead
      if (
        state.interviewType === "System Design" &&
        (state.difficulty === "Junior" || state.difficulty === "Mid")
      ) {
        dispatch({ type: "SET_TYPE", payload: undefined });
        toast("System Design is available for Senior and Lead only", {
          icon: "⚠️",
        });
      }

      // Rule 2: Mixed requires >=30 mins
      if (state.interviewType === "Mixed" && state.duration === 15) {
        dispatch({ type: "SET_DURATION", payload: 30 });
        toast("Mixed interviews require at least 30 minutes", {
          icon: "⚠️",
        });
      }

      // Rule 3: Expert Review disabled for 15 min
      if (state.addOns.expertReview && state.duration === 15) {
        dispatch({ type: "SET_ADDONS", payload: { expertReview: false } });
        toast("Expert Review requires at least 30 minutes", {
          icon: "⚠️",
        });
      }

      // Rule 4: Expert Review disabled for Junior
      if (state.addOns.expertReview && state.difficulty === "Junior") {
        dispatch({ type: "SET_ADDONS", payload: { expertReview: false } });
        toast("Expert Review available for Mid level and above", {
          icon: "⚠️",
        });
      }
    }
  }, [
    state.interviewType,
    state.difficulty,
    state.duration,
    state.addOns,
    dispatch,
  ]);

  const toggleAddOn = (key: keyof typeof state.addOns) => {
    dispatch({ type: "SET_ADDONS", payload: { [key]: !state.addOns[key] } });
  };

  const addTopic = (topic: string) => {
    if (!topic) return;
    if (state.topics.includes(topic)) return;
    if (state.topics.length >= 5) return;
    dispatch({ type: "SET_TOPICS", payload: [...state.topics, topic] });
    setTopicInput("");
  };

  const removeTopic = (topic: string) => {
    dispatch({
      type: "SET_TOPICS",
      payload: state.topics.filter((t) => t !== topic),
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Configure Your AI Interview</h1>

      {/* Interview Type */}
      <label className="block mb-2">Interview Type</label>
      <select
        value={state.interviewType || ""}
        onChange={(e) =>
          dispatch({
            type: "SET_TYPE",
            payload: e.target.value as InterviewType,
          })
        }
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select type</option>
        {interviewOptions.map((opt) => (
          <option
            key={opt}
            value={opt}
            disabled={
              opt === "System Design" &&
              (state.difficulty === "Junior" || state.difficulty === "Mid")
            }
          >
            {opt}
          </option>
        ))}
      </select>

      {/* Difficulty */}
      <label className="block mb-2">Difficulty</label>
      <select
        value={state.difficulty || ""}
        onChange={(e) =>
          dispatch({
            type: "SET_DIFFICULTY",
            payload: e.target.value as Difficulty,
          })
        }
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select difficulty</option>
        {difficultyOptions.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      {/* Duration */}
      <label className="block mb-2">Duration</label>
      <select
        value={state.duration || ""}
        onChange={(e) =>
          dispatch({
            type: "SET_DURATION",
            payload: Number(e.target.value) as Duration,
          })
        }
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select duration</option>
        {durationOptions.map((d) => (
          <option key={d} value={d}>
            {d} minutes
          </option>
        ))}
      </select>

      {/* Topics */}
      <label className="block mb-2">Topics</label>
      <div className="flex mb-2">
        <input
          type="text"
          value={topicInput}
          onChange={(e) => setTopicInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTopic(topicInput)}
          placeholder="Type topic and press Enter"
          className="flex-1 p-2 border rounded"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {state.topics.map((t) => (
          <span
            key={t}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-pointer"
            onClick={() => removeTopic(t)}
          >
            {t} ×
          </span>
        ))}
      </div>

      {/* Add-Ons */}
      <label className="block mb-2">Add-Ons</label>
      <div className="flex flex-col mb-4">
        {Object.keys(state.addOns).map((key) => {
          if (key === "expertReview") {
            return (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.addOns.expertReview}
                  onChange={() => toggleAddOn("expertReview")}
                  disabled={state.duration === 15 || state.difficulty === "Junior"}
                />
                Expert Review
              </label>
            );
          }

          return (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={state.addOns[key as keyof typeof state.addOns]}
                onChange={() => toggleAddOn(key as keyof typeof state.addOns)}
              />
              {key}
            </label>
          );
        })}
      </div>

      {/* Price */}
      <div className="text-xl font-bold">
        Total Price: <span className="text-green-600">${price.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ConfigurePage;
