import { useAnecdotes, useAnecdotesActions } from "../store.js";
export default function AnecdoteList() {
    const { vote } = useAnecdotesActions();
    return (
        <div>
            {useAnecdotes()
                .toSorted((a1, a2) => a2.votes - a1.votes)
                .map((anecdote) => (
                    <div key={anecdote.id}>
                        <div>{anecdote.content}</div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => vote(anecdote.id)}>
                                vote
                            </button>
                        </div>
                    </div>
                ))}
        </div>
    );
}
