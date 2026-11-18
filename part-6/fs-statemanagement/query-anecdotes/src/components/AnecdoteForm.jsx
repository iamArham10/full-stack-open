import { useAnecdotes } from "../useAnecdotes";
import NotificationContext from "../context/NotificationContext";
import { useContext } from "react";

const AnecdoteForm = () => {
    const { addAnecdote } = useAnecdotes();
    const { notify } = useContext(NotificationContext);

    const onCreate = (event) => {
        event.preventDefault();
        const content = event.target.anecdote.value;
        event.target.reset();

        addAnecdote(content, {
            onSuccess: () => notify(`anecdote \`${content}\` added`),
            onError: (error) => notify(error.message),
        });
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
