import { useState } from "react";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useAnecdotes } from "./useAnecdotes";
import NotificationContext from "./context/NotificationContext";

const App = () => {
    const { anecdotes, isPending, updateAnecdote } = useAnecdotes();
    const [notification, setNotification] = useState("");

    if (isPending) {
        return (
            <div>anecdote service not availabe due to problems in server</div>
        );
    }

    const handleVote = (anecdote) => {
        updateAnecdote(anecdote);
        setNotification(`anecdote \`${anecdote.content}\` voted`);
        setTimeout(() => {
            setNotification("");
        }, 3000);
    };

    return (
        <div>
            <NotificationContext value={{ notification, setNotification }}>
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
            </NotificationContext>
        </div>
    );
};

export default App;
