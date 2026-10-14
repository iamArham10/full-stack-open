const { describe, test, beforeEach, after } = require("node:test");
const assert = require("assert");
const mongoose = require("mongoose");
const User = require("../models/user");
const app = require("../app");
const supertest = require("supertest");

const api = supertest(app);

describe("when no users are present", () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    test("user with less 3 character length username is not created", async () => {
        const user = {
            username: "ab",
            password: "hellokitty",
            name: "newuser",
        };

        await api.post("/api/users").send(user).expect(422);
        assert.strictEqual(await User.countDocuments({}), 0);
    });

    test("user with less 3 character length password not created", async () => {
        const user = {
            username: "correctusername",
            password: "he",
            name: "newuser",
        };

        await api.post("/api/users").send(user).expect(422);
        assert.strictEqual(await User.countDocuments({}), 0);
    });

    test("user with missing username or password is not created", async () => {
        await api.post("/api/users").send({ password: "hellokitty" }).expect(422);
        await api.post("/api/users").send({ username: "validname" }).expect(422);
        assert.strictEqual(await User.countDocuments({}), 0);
    });

    test("user with valid username and password is created", async () => {
        await api
            .post("/api/users")
            .send({ username: "abc", password: "xyz", name: "ok" })
            .expect(201);
        assert.strictEqual(await User.countDocuments({}), 1);
    });

    after(async () => {
        await mongoose.connection.close();
    });
});
