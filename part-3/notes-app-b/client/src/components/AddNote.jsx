import { useState } from "react";
import { addNote } from "../server/notes";

export default function AddNote({ onNoteAdded }) {
    const [content, setContent] = useState("");
    const [important, setImportant] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newNote = await addNote({ content, important });
        onNoteAdded(newNote);
        setContent("");
        setImportant(false);
    };

    return (
        <form action="handleSubmit" onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                    }}
                />
                <label>
                    {" "}
                    important
                    <input
                        type="checkbox"
                        value={important}
                        onChange={(e) => setImportant(e.target.checked)}
                    />
                </label>{" "}
                <label>
                    <button type="submit">submit</button>
                </label>
            </div>
        </form>
    );
}
