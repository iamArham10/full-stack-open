import {
    useAnecdotes,
    useAnecdotesActions,
    useNotificationActions,
} from "../store.js";

export default function AnecdoteList() {
    const { anecdotes } = useAnecdotes();
    const { vote, remove } = useAnecdotesActions();
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
                                    vote(anecdote.id);
                                    setNotification(
                                        `You voted \`${anecdote.content}\``,
                                    );
                                }}
                            >
                                vote
                            </button>
                            <button
                                onClick={async () => {
                                    await remove(anecdote.id);
                                    setNotification(
                                        `You deleted \`${anecdote.content}\``,
                                    );
                                }}
                            >
                                delete
                            </button>
                        </div>
                    </div>
                ))}
        </div>
    );
}
