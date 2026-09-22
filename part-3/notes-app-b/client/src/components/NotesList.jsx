import { useEffect, useState } from "react";
import { getNotes } from "../server/notes";

export default function NotesList() {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        async function loadNotes() {
            const notes = await getNotes()
            setNotes(notes)
        }

        loadNotes()
    }, []);

    return (
        <>
            {notes.map((n) => {
                return (
                    <div key={n.id}>
                        {n.content} {n.isImportant ? "true" : "false"}
                    </div>
                );
            })}
        </>
    );
}
