const baseURL = "http://localhost:3001/anecdotes";

async function getAnecdotes() {
    const response = await fetch(baseURL);

    if (!response.ok) {
        throw new Error("Failed to fetch anecdote");
    }

    return await response.json();
}

async function addAnecdotes(content) {
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, votes: 0 }),
    };

    const response = await fetch(baseURL, options);
    if (!response.ok) {
        throw new Error("Failed to add anecdote");
    }

    return await response.json();
}

async function updateAnecdotes(anecdote) {
    const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(anecdote),
    };

    const response = await fetch(`${baseURL}/${anecdote.id}`, options);

    if (!response.ok) {
        throw new Error("Failed to update anecdote");
    }

    return await response.json();
}

export { getAnecdotes, addAnecdotes, updateAnecdotes };
