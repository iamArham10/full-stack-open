import { useEffect, useState } from "react";
import { getNotes } from "../server/notes";
import Note from "./Note";

export default function NotesList() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        async function loadNotes() {
            const notes = await getNotes();
            setNotes(notes);
        }

        loadNotes();
    }, []);

    return (
        <>
            {notes.map((n) => {
                return (
                    <div key={n.id}>
                        <Note note={n} />
                    </div>
                );
            })}
        </>
    );
}
