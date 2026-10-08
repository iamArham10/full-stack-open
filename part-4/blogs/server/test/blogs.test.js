const { beforeEach, after, test } = require("node:test");
const assert = require("assert");
const { mongoose } = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test.only("get blogs", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test.only("unique identified", async () => {
    const blogs = await api.get("/api/blogs");
    const isUnique = () => {
        const ids = new Set();
        for (const blog of blogs) {
            const id = blog.id;
            if (id in ids) {
                return false;
            }
            ids.add(id);
        }

        return true;
    };

    assert(isUnique(), true);
});

after(async () => {
    await mongoose.connection.close();
});
