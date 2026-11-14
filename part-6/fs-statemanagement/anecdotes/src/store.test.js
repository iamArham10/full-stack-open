import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./service/anecdotes", () => {
    return {
        getAnecdotes: vi.fn(),
        addAnecdotes: vi.fn(),
        updateAnecdotes: vi.fn(),
        deleteAnecdote: vi.fn(),
    };
});

import { getAnecdotes } from "./service/anecdotes";
import { useAnecdotes, useAnecdotesActions, useAnecdoteStore } from "./store";
import { act, renderHook } from "@testing-library/react";

beforeEach(() => {
    useAnecdoteStore.setState({
        anecdotes: [],
    });

    vi.clearAllMocks();
});

describe("useAnecdoteActions", () => {
    it("anecdotes are initialized", async () => {
        const mockAnecdotes = [
            {
                content: "If it hurts, do it more often",
                id: "47145",
                votes: 2,
            },
            {
                content:
                    "Adding manpower to a late software project makes it later!",
                id: "21149",
                votes: 8,
            },
        ];

        getAnecdotes.mockResolvedValue(mockAnecdotes);

        const { result } = renderHook(() => useAnecdotesActions());

        await act(async () => {
            await result.current.initialize();
        });

        const { result: anecdotes } = renderHook(() => useAnecdotes());
        expect(anecdotes.current.anecdotes).toEqual(mockAnecdotes);
    });

});
