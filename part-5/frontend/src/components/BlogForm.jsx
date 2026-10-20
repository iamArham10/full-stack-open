import { useState } from "react";

const formStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.5rem",
};

export default function BlogForm({ onAdd }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [url, setUrl] = useState("");

    const handleAddBlog = async (event) => {
        event.preventDefault();
        await onAdd({ title, author, url });
    };

    return (
        <div>
            <form onSubmit={handleAddBlog} style={formStyle}>
                <label>
                    Title:{" "}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="title"
                    />
                </label>
                <label>
                    Author:{" "}
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="author"
                    />
                </label>
                <label>
                    Url:{" "}
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="url"
                    />
                </label>
                <button type="submit">add</button>
            </form>
        </div>
    );
}
