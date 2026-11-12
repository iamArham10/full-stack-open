import {
    useAnecdotes,
    useAnecdotesActions,
    useNotificationActions,
} from "../store.js";
export default function AnecdoteList() {
    const { anecdotes } = useAnecdotes();
    const { vote } = useAnecdotesActions();
    const { setNotification } = useNotificationActions();
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
                                onClick={async () => {
                                    await vote(anecdote.id);
                                    setNotification(
                                        `You voted \`${anecdote.content}\``,
                                    );
                                }}
                            >
                                vote
                            </button>
                        </div>
                    </div>
                ))}
        </div>
    );
}
