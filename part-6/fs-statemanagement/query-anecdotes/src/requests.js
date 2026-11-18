const BASE_URL = "http://localhost:3001/anecdotes";

async function getAnecdotes() {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch anecdotes");
    }

    return response.json();
}

async function addAnecdote(anecdote) {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(anecdote),
    };

    const response = await fetch(BASE_URL, options);

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to add anecdote");
    }

    return response.json();
}

async function updateAnecdote(anecdote) {
    const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(anecdote),
    };

    const response = await fetch(`${BASE_URL}/${anecdote.id}`, options);

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update anecdote");
    }

    return response.json();
}

export { getAnecdotes, addAnecdote, updateAnecdote };
