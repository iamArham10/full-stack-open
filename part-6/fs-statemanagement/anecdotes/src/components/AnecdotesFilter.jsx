import { useAnecdotes, useAnecdotesActions } from "../store";

export default function AnecdotesFilter() {
    const { setFilter } = useAnecdotesActions();
    const handleFilter = (e) => {
        e.preventDefault();
        setFilter(e.target.value);
    };
    return (
        <div>
            {" "}
            <input
                type="text"
                value={useAnecdotes().filter}
                onChange={handleFilter}
                placeholder="Search anecdotes"
            />
            <br />
            <br />
        </div>
    );
}
