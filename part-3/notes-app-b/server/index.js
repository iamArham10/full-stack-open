const express = require("express");
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

app.use(express.json());

app.get("/notes", (req, res) => {
    return res.send(notes);
});

app.get("/notes/:id", (req, res) => {
    const id = req.params.id;
    const note = notes.find((n) => n.id === id);

    if (!note) {
        return res.status(404).send(`note with id: ${id} not found`);
    } else {
        return res.json(note);
    }
});

app.delete("/notes/:id", (req, res) => {
    const id = req.params.id;

    const note = notes.find((n) => n.id === id);

    if (note) {
        notes = notes.filter((n) => n.id !== id);
        return res.status(204).end();
    } else {
        return res.status(404).send(`note with id: ${id} does not exists`);
    }
});

app.listen(3000, () => {
    console.log(`Server running on port ${3000}`);
});
