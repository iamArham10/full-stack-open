import { useAnecdotes, useAnecdotesActions } from "../store.js";
export default function AnecdoteList() {
    const { anecdotes } = useAnecdotes();
    const { vote } = useAnecdotesActions();
    return (
        <div>
            {anecdotes
                .toSorted((a1, a2) => a2.votes - a1.votes)
                .map((anecdote) => (
                    <div key={anecdote.id}>
                        <div>{anecdote.content}</div>
                        <div>
                            has {anecdote.votes}
                            <button
                                onClick={async () => await vote(anecdote.id)}
                            >
                                vote
                            </button>
                        </div>
                    </div>
                ))}
        </div>
    );
}
