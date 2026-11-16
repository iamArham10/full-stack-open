import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useAnecdotes } from "./useAnecdotes";

const App = () => {
    const { anecdotes, isPending, addAnecdote, updateAnecdote } =
        useAnecdotes();

    if (isPending) {
        return (
            <div>anecdote service not availabe due to problems in server</div>
        );
    }

    const handleVote = (anecdote) => {
        updateAnecdote(anecdote);
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

