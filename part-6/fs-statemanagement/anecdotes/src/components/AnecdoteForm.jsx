import { useAnecdotesActions } from "../store";

export default function AnecdoteForm() {
    const { add } = useAnecdotesActions();

    const handleAdd = (e) => {
        e.preventDefault();
        const content = e.target.anecdote.value.trim();
        if (content !== "") {
            add(content);
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
