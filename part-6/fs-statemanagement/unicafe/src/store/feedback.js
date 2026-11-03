import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

const useFeedbackStore = create((set) => ({
    good: 0,
    neutral: 0,
    bad: 0,
    actions: {
        setGood: () => set((state) => ({ good: state.good + 1 })),
        setNeutral: () => set((state) => ({ neutral: state.neutral + 1 })),
        setBad: () => set((state) => ({ bad: state.bad + 1 })),
    },
}));

export const useFeedBack = () =>
    useFeedbackStore(
        useShallow((state) => ({
            good: state.good,
            neutral: state.neutral,
            bad: state.bad,
        })),
    );

export const useFeedbackControls = () =>
    useFeedbackStore((state) => state.actions);
