import NotesList from "./components/NotesList";
import AddNote from "./components/AddNote";

function App() {
    return (
        <>
            <h1>Add a Note</h1>
            <AddNote />
            <h2>Your Notes</h2>
            <NotesList />
        </>
    );
}

export default App;
