const express = require("express");

const app = express();
app.use(express.json());

const phoneBookData = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/api/persons", (req, res) => {
    res.json(phoneBookData);
});

app.get("/info", (req, res) => {
    let data = `<h2>The response has info for ${phoneBookData.length}</h2>`;
    data += `${new Date().toString()}`;
    res.send(data);
});

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const person = phoneBookData.find((p) => p.id === id);
    if (person) {
        return res.json(person);
    }
    res.status(404).json({ error: "Person not found" });
});

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    const index = phoneBookData.findIndex((p) => p.id === id);
    if (index === -1) {
        return res.status(404).json({
            error: `Person with given id: ${id} not found`,
        });
    }
    phoneBookData.splice(index, 1);
    res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    const data = req.body;
    if (!data.name || !data.number) {
        return res.status(400).json({ error: "Provide name and number" });
    }

    const exists = phoneBookData.some((element) => element.name === data.name);
    if (exists) {
        return res
            .status(400)
            .json({ error: "Person with this name already exists" });
    }

    const person = {
        id: String(Math.floor(Math.random() * 1000)),
        name: data.name,
        number: data.number,
    };
    phoneBookData.push(person);

    res.status(201).json(person);
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
