import { useEffect, useState } from "react";
import ListPhoneBook from "./components/ListPhoneBook.jsx";
import Notification from "./components/Notification.jsx";
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
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    };

    useEffect(() => {
        getPhoneBook().then((initialPhones) => {
            setPhones(initialPhones);
        });
    }, []);

    const handleAddPerson = (event) => {
        event.preventDefault();

        if (!newName || !newPhone) {
            showNotification("Please enter both name and number", "error");
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
                        showNotification(
                            `Updated ${returnedPerson.name}'s number`,
                            "success"
                        );
                    })
                    .catch((error) => {
                        console.log(error.response?.data?.error);
                        const errorMessage =
                            error.response?.data?.error ||
                            `Failed to update ${existingPerson.name}`;
                        showNotification(errorMessage, "error");
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
                showNotification(`Added ${returnedPerson.name}`, "success");
            })
            .catch((error) => {
                console.log(error.response?.data?.error);
                const errorMessage =
                    error.response?.data?.error || "Failed to add contact";
                showNotification(errorMessage, "error");
            });
    };

    const handleDelete = (id, name) => {
        const confirmDelete = window.confirm(`Delete ${name}?`);

        if (confirmDelete) {
            deletePhone(id)
                .then(() => {
                    setPhones(phones.filter((p) => p.id !== id));
                    showNotification(`Deleted ${name}`, "success");
                })
                .catch((error) => {
                    console.log(error.response?.data?.error);
                    const errorMessage =
                        error.response?.data?.error ||
                        `Information of ${name} has already been removed from server`;
                    showNotification(errorMessage, "error");
                    setPhones(phones.filter((p) => p.id !== id));
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

            <Notification
                message={notification?.message}
                type={notification?.type}
            />

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
