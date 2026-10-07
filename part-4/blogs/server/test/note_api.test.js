const { test, after } = require("node:test");
const assert = require("assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("notes are returned as json", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test("all notes are required", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, 2);
});

test("a specific note is within the returned notes", async () => {
    const response = await api.get("api/blogs");

    const content = response.body.map((e) => e.content);

    assert.strictEqual(content);
});

after(async () => {
    await mongoose.connection.close();
});
