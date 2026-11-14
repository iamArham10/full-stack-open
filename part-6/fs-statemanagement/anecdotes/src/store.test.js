import { beforeEach, describe, expect, it } from "vitest";
import { useAnecdoteStore } from "./store";

beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [] });
});

describe("anecdote Store", () => {
    it("initial state is 0", () => {
        expect(useAnecdoteStore.getState().anecdotes.length).toBe(0);
    });
});
