import { useState } from "react";
import { addNote } from "../server/notes";

export default function AddNote() {
    const [text, setText] = useState("");
    const [important, setImportant] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        addNote({ text, important });
    };

    return (
        <form action="handleSubmit" onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value.trim());
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
