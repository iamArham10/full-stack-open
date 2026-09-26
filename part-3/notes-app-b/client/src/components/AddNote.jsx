import { useState } from "react";
import { addNote } from "../server/notes";

export default function AddNote({ onNoteAdded }) {
    const [content, setContent] = useState("");
    const [important, setImportant] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            const newNote = await addNote({
                content: content.trim(),
                important,
            });
            onNoteAdded(newNote);
            setContent("");
            setImportant(false);
        } catch (error) {
            console.error("Failed to add note:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    value={content}
                    placeholder="Enter note..."
                    onChange={(e) => {
                        setContent(e.target.value);
                    }}
                />
                <label>
                    {" "}
                    important
                    <input
                        type="checkbox"
                        checked={important}
                        onChange={(e) => setImportant(e.target.checked)}
                    />
                </label>{" "}
                <button type="submit">submit</button>
            </div>
        </form>
    );
}
