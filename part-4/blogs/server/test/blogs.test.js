const { describe, test, beforeEach, after } = require("node:test");
const assert = require("assert");
const { mongoose } = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

describe("when there are initially some blogs are saved", () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await Blog.insertMany(helper.initialBlogs);
    });

    test("blogs are returned as json", async () => {
        await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test("all blogs are returned", async () => {
        const response = await api.get("/api/blogs");
        assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test("unique identifier property of blog posts is named id", async () => {
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

    describe("viewing a specific blog", () => {
        test("fails with status code 404 if blog does not exist", async () => {
            const idOfBlogToCheck = await helper.nonExistingId();
            await api.get(`/api/blogs/${idOfBlogToCheck}`).expect(404);
        });
    });

    describe("addition of a new blog", () => {
        test("a valid blog can be added", async () => {
            const newBlog = {
                title: "George R.R Martin Memoir",
                author: "George R.R Martin",
                url: "https://reactpatterns.com/",
                like: 7,
            };

            const initialLength = helper.initialBlogs.length;
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

        test("defaults likes to 0 if missing from request", async () => {
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

        test("fails with status code 400 if title or url are missing", async () => {
            const newBlog = {
                title: "ABC Ahmed Memoir",
                author: "Ahmed Raza",
                url: "https://reactpatterns.com/",
            };

            const { url, ...blogWithoutUrl } = newBlog;
            const { title, ...blogWithoutAuthor } = newBlog;

            await api.post("/api/blogs").send(blogWithoutUrl).expect(400);
            await api.post("/api/blogs").send(blogWithoutAuthor).expect(400);
        });
    });

    describe("deletion of a blog", () => {
        test("succeeds with status code 204 if id is valid", async () => {
            const blogsAtStart = await helper.blogsInDB();
            const blogToDelete = blogsAtStart[0];

            await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

            const blogsAtEnd = await helper.blogsInDB();
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

            const titles = blogsAtEnd.map((b) => b.title);
            assert(!titles.includes(blogToDelete.title));
        });
    });

    describe("updating a blog", () => {
        test("succeeds with status code 200 when updating likes", async () => {
            const blogs = await helper.blogsInDB();
            const blogToUpdate = blogs[0];
            const currentLikes = blogToUpdate.like;

            const response = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send({ like: currentLikes + 1 })
                .expect(200);

            assert.strictEqual(response.body.like, currentLikes + 1);

            const updatedBlog = await api.get(`/api/blogs/${blogToUpdate.id}`);
            assert.strictEqual(updatedBlog.body.like, currentLikes + 1);
        });
    });
});

after(async () => {
    await Blog.deleteMany({});
    await mongoose.connection.close();
});
