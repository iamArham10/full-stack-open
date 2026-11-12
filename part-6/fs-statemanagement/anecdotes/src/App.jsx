import { useEffect } from "react";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import AnecdotesFilter from "./components/AnecdotesFilter";
import { useAnecdotesActions, useNotification } from "./store";
import Notification from "./components/Notification";

const App = () => {
    const { initialize } = useAnecdotesActions();
    const notification = useNotification();

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <div>
            <h2>Anecdotes</h2>
            <Notification notification={notification} />
            <AnecdotesFilter />
            <AnecdoteList />
            <AnecdoteForm />
        </div>
    );
};

export default App;
