import { useEffect } from "react";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import AnecdotesFilter from "./components/AnecdotesFilter";
import { useAnecdotesActions } from "./store";

const App = () => {
    const { initialize } = useAnecdotesActions();

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <div>
            <h2>Anecdotes</h2>
            <AnecdotesFilter />
            <AnecdoteList />
            <AnecdoteForm />
        </div>
    );
};

export default App;
