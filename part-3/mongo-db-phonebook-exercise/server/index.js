const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

let phoneBook = [
    {
        id: 0,
        name: "Arham",
        phone: "+92-324-5521508",
    },
    {
        id: 1,
        name: "Ada Lovelace",
        phone: "+39-44-5323523",
    },
    {
        id: 2,
        name: "Dan Abramov",
        phone: "+12-43-234345",
    },
    {
        id: 3,
        name: "Mary Poppendieck",
        phone: "+39-23-6423122",
    },
    {
        id: 4,
        name: "Grace Hopper",
        phone: "+1-555-234-5678",
    },
    {
        id: 5,
        name: "Alan Turing",
        phone: "+44-20-7946-0958",
    },
    {
        id: 6,
        name: "Linus Torvalds",
        phone: "+1-555-987-6543",
    },
];

// 1. Get all
app.get(["/phone", "/api/persons"], (_req, res) => {
    res.json(phoneBook);
});

// 2. Get specific
app.get(["/phone/:id", "/api/persons/:id"], (req, res) => {
    const id = req.params.id;
    const phone = phoneBook.find((p) => String(p.id) === String(id));

    if (phone) {
        return res.json(phone);
    }

    res.status(404).json({ error: "person not found" });
});

// 3. Delete
app.delete(["/phone/:id", "/api/persons/:id"], (req, res) => {
    const id = req.params.id;
    const phone = phoneBook.find((p) => String(p.id) === String(id));

    if (phone) {
        phoneBook = phoneBook.filter((p) => String(p.id) !== String(id));
        return res.status(204).end();
    }

    res.status(404).json({ error: "person not found" });
});

// 4. Post
app.post(["/phone", "/api/persons"], (req, res) => {
    const body = req.body;

    if (!body || !body.name || (!body.phone && !body.number)) {
        return res.status(400).json({ error: "name or phone missing" });
    }

    const phoneValue = body.phone || body.number;
    let existingPerson = phoneBook.find(
        (p) => p.name.toLowerCase() === body.name.toLowerCase()
    );

    if (existingPerson) {
        const updatedPerson = { ...existingPerson, phone: phoneValue };
        phoneBook = phoneBook.map((p) =>
            p.id === existingPerson.id ? updatedPerson : p
        );
        return res.json(updatedPerson);
    }

    const maxId =
        phoneBook.length > 0
            ? Math.max(...phoneBook.map((p) => Number(p.id) || 0))
            : 0;

    const newPerson = {
        id: maxId + 1,
        name: body.name,
        phone: phoneValue,
    };

    phoneBook = phoneBook.concat(newPerson);
    res.status(201).json(newPerson);
});

// 5. Put (update)
app.put(["/phone/:id", "/api/persons/:id"], (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const person = phoneBook.find((p) => String(p.id) === String(id));

    if (!person) {
        return res.status(404).json({ error: "person not found" });
    }

    const updatedPerson = {
        ...person,
        name: body.name || person.name,
        phone: body.phone || body.number || person.phone,
    };

    phoneBook = phoneBook.map((p) =>
        String(p.id) === String(id) ? updatedPerson : p
    );
    res.json(updatedPerson);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Running server on port: ${PORT}`);
});
