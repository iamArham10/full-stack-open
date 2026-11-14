import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./service/anecdotes", () => {
    return {
        getAnecdotes: vi.fn(),
        addAnecdotes: vi.fn(),
        updateAnecdotes: vi.fn(),
        deleteAnecdote: vi.fn(),
    };
});

import { getAnecdotes, updateAnecdotes } from "./service/anecdotes";
import { useAnecdotes, useAnecdotesActions, useAnecdoteStore } from "./store";
import { act, renderHook } from "@testing-library/react";

beforeEach(() => {
    useAnecdoteStore.setState({
        anecdotes: [],
        filter: "",
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

    it("anecdotes are filtered correctly", async () => {
        const anecdotes = [
            {
                id: "1",
                votes: 0,
                content: "a",
            },
            {
                id: "2",
                votes: 2,
                content: "b",
            },
            {
                id: "3",
                votes: 0,
                content: "ab",
            },
        ];

        getAnecdotes.mockResolvedValue(anecdotes);

        const { result } = renderHook(() => useAnecdotesActions());
        await act(async () => {
            await result.current.initialize();
        });

        const { result: anecdoteResult } = renderHook(() => useAnecdotes());

        expect(anecdoteResult.current.filter).toBe("");
        expect(anecdoteResult.current.anecdotes.length).toBe(anecdotes.length);

        await act(async () => {
            await result.current.setFilter("a");
        });

        const { result: filteredAnecdotes } = renderHook(() => useAnecdotes());

        expect(filteredAnecdotes.current.filter).toBe("a");
        expect(filteredAnecdotes.current.anecdotes).toEqual([
            anecdotes[0],
            anecdotes[2],
        ]);
    });

    it("anecdotes can be voted", async () => {
        const anecdotesMock = [
            {
                id: "1",
                votes: 3,
                content: "ab",
            },
        ];

        getAnecdotes.mockResolvedValue(anecdotesMock);
        updateAnecdotes.mockImplementation(async (anecdote) => anecdote);

        const { result } = renderHook(() => useAnecdotesActions());

        await act(async () => {
            await result.current.initialize();
        });

        const { result: anecdotesHook } = renderHook(() => useAnecdotes());

        expect(anecdotesHook.current.anecdotes.length).toBe(1);
        expect(anecdotesHook.current.anecdotes[0].votes).toBe(3);

        // voting it
        await act(async () => {
            await result.current.vote("1");
        });

        expect(anecdotesHook.current.anecdotes[0].votes).toBe(4);
    });
});
