import NotesList from "./components/NotesList";
import AddNote from "./components/AddNote";
import FilterNotes from "./components/filterNotes";
import { useEffect, useState } from "react";
import { getNotes, deleteNote } from "./server/notes";

function App() {
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const initialNotes = await getNotes();
                setNotes(initialNotes);
            } catch (error) {
                console.error("Failed to fetch initial notes:", error);
            }
        };

        fetchNotes();
    }, []);

    function onNoteAdded(newNote) {
        setNotes((prevNotes) => prevNotes.concat(newNote));
        setSearchQuery("");
    }

    async function handleDelete(id) {
        try {
            await deleteNote({ id });
            setNotes((prevNotes) =>
                prevNotes.filter((note) => String(note.id) !== String(id)),
            );
            setSearchQuery("");
        } catch (error) {
            console.error("Failed to delete note:", error);
        }
    }

    const notesToShow = searchQuery.trim()
        ? notes.filter((note) =>
              note.content?.toLowerCase().includes(searchQuery.trim().toLowerCase()),
          )
        : notes;

    return (
        <>
            <h3>Add a Note</h3>
            <AddNote onNoteAdded={onNoteAdded} />
            <h2>Your Notes</h2>
            <FilterNotes
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />
            <NotesList notes={notesToShow} handleDelete={handleDelete} />
        </>
    );
}

export default App;
