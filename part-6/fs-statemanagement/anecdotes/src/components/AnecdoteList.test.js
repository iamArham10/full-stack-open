import { expect, it } from "vitest";
import { useAnecdoteStore } from "../store";
import { render, screen } from "@testing-library/react";
import AnecdoteList from "./AnecdoteList";

it("displayed anecdotes are sorted by votes", () => {
    useAnecdoteStore.setState({
        anecdotes: [
            {
                content: "If it hurts, do it more often",
                id: "1",
                votes: 2,
            },
            {
                content:
                    "Adding manpower to a late software project makes it later!",
                id: "2",
                votes: 8,
            },
            {
                content:
                    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
                id: "3",
                votes: 0,
            },
        ],
    });

    render(<AnecdoteList />);

    const contents = screen
        .getAllByText(/If it hurts|Adding manpower|The first 90/)
        .map((el) => el.textContent);

    expect(contents).toEqual([
        "Adding manpower to a late software project makes it later!",
        "If it hurts, do it more often",
        "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    ]);
});
