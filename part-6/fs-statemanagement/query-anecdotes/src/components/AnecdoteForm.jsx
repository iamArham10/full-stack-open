import { useAnecdotes } from "../useAnecdotes";
import NotificationContext from "../context/NotificationContext";
import { useContext } from "react";

const AnecdoteForm = () => {
    const { addAnecdote } = useAnecdotes();
    const { setNotification } = useContext(NotificationContext);

    const onCreate = (event) => {
        event.preventDefault();
        const content = event.target.anecdote.value;
        event.target.reset();
        addAnecdote(content);
        setNotification(`anecdote \`${content}\` added`);
        setTimeout(() => {
            setNotification("");
        }, 3000);
    };

    return (
        <div>
            <h3>create new</h3>
            <form onSubmit={onCreate}>
                <input name="anecdote" />
                <button type="submit">create</button>
            </form>
        </div>
    );
};

export default AnecdoteForm;
