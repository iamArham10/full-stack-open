import { Button, TextField } from "@mui/material";
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
                <TextField
                    label="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    label="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
                <TextField
                    label="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <Button type="submit">add</Button>
            </form>
        </div>
    );
}
