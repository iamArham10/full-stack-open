import { useEffect, useState } from "react";
import ListPhoneBook from "./components/ListPhoneBook.jsx";
import {
    createPhone,
    deletePhone,
    getPhoneBook,
    updatePhone,
} from "./server/phoneBook.js";

import "./App.css";

function App() {
    const [phones, setPhones] = useState([]);
    const [newName, setNewName] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [filter, setFilter] = useState("");

    useEffect(() => {
        getPhoneBook().then((initialPhones) => {
            setPhones(initialPhones);
        });
    }, []);

    const handleAddPerson = (event) => {
        event.preventDefault();

        if (!newName || !newPhone) {
            alert("Please enter both name and number");
            return;
        }

        const existingPerson = phones.find(
            (p) => p.name.toLowerCase() === newName.trim().toLowerCase()
        );

        if (existingPerson) {
            const confirmUpdate = window.confirm(
                `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
            );

            if (confirmUpdate) {
                const updatedPerson = {
                    ...existingPerson,
                    phone: newPhone,
                };

                updatePhone(existingPerson.id, updatedPerson)
                    .then((returnedPerson) => {
                        setPhones(
                            phones.map((p) =>
                                p.id === existingPerson.id ? returnedPerson : p
                            )
                        );
                        setNewName("");
                        setNewPhone("");
                    })
                    .catch(() => {
                        alert(`Failed to update ${existingPerson.name}`);
                    });
            }
            return;
        }

        const newPerson = {
            name: newName,
            phone: newPhone,
        };

        createPhone(newPerson)
            .then((returnedPerson) => {
                setPhones(phones.concat(returnedPerson));
                setNewName("");
                setNewPhone("");
            })
            .catch(() => {
                alert("Failed to add contact");
            });
    };

    const handleDelete = (id, name) => {
        const confirmDelete = window.confirm(`Delete ${name}?`);

        if (confirmDelete) {
            deletePhone(id)
                .then(() => {
                    setPhones(phones.filter((p) => p.id !== id));
                })
                .catch(() => {
                    alert(`Failed to delete ${name}`);
                });
        }
    };

    const phonesToShow = phones.filter((person) => {
        const query = filter.toLowerCase();
        const matchesName = person.name
            ? person.name.toLowerCase().includes(query)
            : false;
        const matchesPhone = person.phone
            ? person.phone.toLowerCase().includes(query)
            : false;
        return matchesName || matchesPhone;
    });

    return (
        <div style={{ margin: "20px" }}>
            <h2>Phonebook</h2>

            <div>
                filter shown with:{" "}
                <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            <h3>Add a new</h3>
            <form onSubmit={handleAddPerson}>
                <div>
                    name:{" "}
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </div>
                <div>
                    number:{" "}
                    <input
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>

            <h3>Numbers</h3>
            <ListPhoneBook phones={phonesToShow} onDelete={handleDelete} />
        </div>
    );
}

export default App;
