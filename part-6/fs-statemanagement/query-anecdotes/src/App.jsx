import { useContext, useRef, useState } from "react";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useAnecdotes } from "./useAnecdotes";
import NotificationContext from "./context/NotificationContext";

const App = () => {
    const { anecdotes, isPending, isError, updateAnecdote } = useAnecdotes();
    const { notify } = useContext(NotificationContext);

    if (isPending) {
        return <div>loading data...</div>;
    }

    if (isError) {
        return (
            <div>anecdote service not available due to problems in server</div>
        );
    }

    const handleVote = (anecdote) => {
        updateAnecdote(anecdote, {
            onSuccess: () => notify(`anecdote \`${anecdote.content}\` voted`),
            onError: (error) => notify(error.message),
        });
    };

    return (
        <div>
            <h3>Anecdote app</h3>

            <Notification />
            <AnecdoteForm />

            {anecdotes.map((anecdote) => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>
                            vote
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default App;
