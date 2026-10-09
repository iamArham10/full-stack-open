const { beforeEach, after, test } = require("node:test");
const assert = require("assert");
const { mongoose } = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        like: 7,
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        like: 5,
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        like: 12,
    },
];

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
});

test.only("get blogs", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test.only("unique identified", async () => {
    const response = await api.get("/api/blogs");
    const blogs = response.body;

    const isUnique = () => {
        const ids = new Set();
        for (const blog of blogs) {
            const id = blog.id;
            if (ids.has(id)) {
                return false;
            }
            ids.add(id);
        }

        return true;
    };

    assert.strictEqual(isUnique(), true);
});

test.only("blog creation", async () => {
    const newBlog = {
        title: "George R.R Martin Memoir",
        author: "George R.R Martin",
        url: "https://reactpatterns.com/",
        like: 7,
    };

    const initialLength = initialBlogs.length;
    await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const blogs = response.body;
    assert.strictEqual(blogs.length, initialLength + 1);

    const titles = blogs.map((b) => b.title);
    assert(titles.includes("George R.R Martin Memoir"));
});

test.only("test like property missing leads to 0 like", async () => {
    const newBlog = {
        title: "ABC Ahmed Memoir",
        author: "Ahmed Raza",
        url: "https://reactpatterns.com/",
    };

    const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

    const createdBlog = response.body;
    assert.strictEqual(createdBlog.like, 0);
});

after(async () => {
    await Blog.deleteMany({});
    await mongoose.connection.close();
});
