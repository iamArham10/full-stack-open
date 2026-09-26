const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

let notes = [
    {
        id: "0",
        content: "this is my first note",
        important: true,
    },
    {
        id: "1",
        content: "HTML is easy",
        important: true,
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false,
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true,
    },
    {
        id: "4",
        content:
            "REST is an architectural style for designing networked applications",
        important: false,
    },
    {
        id: "5",
        content:
            "Middleware functions can be used for handling request and response objects",
        important: true,
    },
    {
        id: "6",
        content: "Node.js allows running JavaScript on the server side",
        important: false,
    },
];

const app = express();

app.use(cors());
app.use(express.json());

morgan.token("body", (req) => {
    return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
    morgan((tokens, req, res) => {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens["response-time"](req, res) + "ms",
            tokens.body(req, res),
        ]
            .filter(Boolean)
            .join(" ");
    }),
);

app.get("/notes", (req, res) => {
    return res.json(notes);
});

app.get("/notes/:id", (req, res) => {
    const id = req.params.id;
    const note = notes.find((n) => String(n.id) === String(id));

    if (!note) {
        return res.status(404).json({ error: `note with id: ${id} not found` });
    }
    return res.json(note);
});

app.post("/notes", (req, res) => {
    const body = req.body;

    if (!body || !body.content || typeof body.content !== "string" || !body.content.trim()) {
        return res.status(400).json({ error: "content missing" });
    }

    const maxId = notes.length > 0
        ? Math.max(...notes.map((n) => Number(n.id) || 0))
        : 0;

    const note = {
        id: String(maxId + 1),
        content: body.content.trim(),
        important: Boolean(body.important),
    };

    notes = notes.concat(note);
    return res.status(201).json(note);
});

app.put("/notes/:id", (req, res) => {
    const id = req.params.id;
    const body = req.body;

    const note = notes.find((n) => String(n.id) === String(id));
    if (!note) {
        return res.status(404).json({ error: `note with id: ${id} not found` });
    }

    const updatedNote = {
        ...note,
        content: body.content !== undefined ? body.content : note.content,
        important: body.important !== undefined ? Boolean(body.important) : note.important,
    };

    notes = notes.map((n) => (String(n.id) === String(id) ? updatedNote : n));
    return res.json(updatedNote);
});

app.delete("/notes/:id", (req, res) => {
    const id = req.params.id;

    const note = notes.find((n) => String(n.id) === String(id));

    if (note) {
        notes = notes.filter((n) => String(n.id) !== String(id));
        return res.status(204).end();
    } else {
        return res.status(404).json({ error: `note with id: ${id} does not exist` });
    }
});

const unknownEndpoint = (req, res) => {
    return res.status(404).json({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
