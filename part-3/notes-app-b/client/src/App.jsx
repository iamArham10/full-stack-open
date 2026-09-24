import NotesList from "./components/NotesList";
import AddNote from "./components/AddNote";
import { useEffect, useState } from "react";
import { getNotes } from "./server/notes";

function App() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            const notes = await getNotes();
            setNotes(notes);
        };

        fetchNotes();
    }, []);

    function onNoteAdded(newNote) {
        setNotes((prevNotes) => prevNotes.concat(newNote));
    }

    return (
        <>
            <h1>Add a Note</h1>
            <AddNote onNoteAdded={onNoteAdded} />
            <h2>Your Notes</h2>
            <NotesList notes={notes} />
        </>
    );
}

export default App;
