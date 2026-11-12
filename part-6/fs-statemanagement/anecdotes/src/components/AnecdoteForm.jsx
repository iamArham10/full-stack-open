import { useAnecdotesActions } from "../store";
import { useNotificationActions } from "../store";

export default function AnecdoteForm() {
    const { add } = useAnecdotesActions();
    const { setNotification } = useNotificationActions();

    const handleAdd = (e) => {
        e.preventDefault();
        const content = e.target.anecdote.value.trim();
        if (content !== "") {
            add(content);
            setNotification("New Anecodete Added");
        }
    };

    return (
        <div>
            <h2>Create new</h2>
            <form onSubmit={handleAdd}>
                <input name="anecdote" data-testid="new" />
                <button type="submit">create</button>
            </form>
        </div>
    );
}
