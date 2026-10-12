const { describe, test, beforeEach, after } = require("node:test");
const assert = require("assert");
const { mongoose } = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const helper = require("./test_helper");

const api = supertest(app);

describe("when there are initially some blogs are saved", () => {
    let user;
    let token;

    beforeEach(async () => {
        await Blog.deleteMany({});
        await Blog.insertMany(helper.initialBlogs);
        await User.deleteMany({});
        const passwordHash = await bcrypt.hash("sekret", 10);
        user = await new User({ username: "creatoruser", name: "Creator", passwordHash }).save();
        const login = await api
            .post("/api/login")
            .send({ username: "creatoruser", password: "sekret" })
            .expect(200);
        token = login.body.token;
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
                .set("Authorization", `Bearer ${token}`)
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
                .set("Authorization", `Bearer ${token}`)
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

            await api
                .post("/api/blogs")
                .set("Authorization", `Bearer ${token}`)
                .send(blogWithoutUrl)
                .expect(400);
            await api
                .post("/api/blogs")
                .set("Authorization", `Bearer ${token}`)
                .send(blogWithoutAuthor)
                .expect(400);
        });

        test("fails with status code 401 if token is not provided", async () => {
            const newBlog = {
                title: "No token blog",
                author: "Nobody",
                url: "https://example.com/notoken",
            };

            await api.post("/api/blogs").send(newBlog).expect(401);

            const blogsAtEnd = await helper.blogsInDB();
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
        });

        test("a blog is assigned to the user identified by the token", async () => {
            const response = await api
                .post("/api/blogs")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "Blog with creator",
                    author: "Test Author",
                    url: "https://example.com/test",
                    like: 4,
                })
                .expect(201);

            const blogs = await api.get("/api/blogs");
            const created = blogs.body.find((b) => b.title === "Blog with creator");
            assert.strictEqual(created.user.username, "creatoruser");

            const userInDb = await User.findById(user.id);
            assert(userInDb.blogs.map((b) => b.toString()).includes(response.body.id));
        });
    });

    describe("deletion of a blog", () => {
        const createBlog = async () => {
            const response = await api
                .post("/api/blogs")
                .set("Authorization", `Bearer ${token}`)
                .send({ title: "To delete", url: "https://example.com/del" })
                .expect(201);
            return response.body;
        };

        test("succeeds with status code 204 if the creator deletes it", async () => {
            const blog = await createBlog();
            const blogsAtStart = await helper.blogsInDB();

            await api
                .delete(`/api/blogs/${blog.id}`)
                .set("Authorization", `Bearer ${token}`)
                .expect(204);

            const blogsAtEnd = await helper.blogsInDB();
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
        });

        test("fails with status code 401 without a token", async () => {
            const blog = await createBlog();
            await api.delete(`/api/blogs/${blog.id}`).expect(401);
        });

        test("fails with status code 403 if user is not the creator", async () => {
            const blog = await createBlog();
            const passwordHash = await bcrypt.hash("other", 10);
            await new User({ username: "otheruser", passwordHash }).save();
            const login = await api
                .post("/api/login")
                .send({ username: "otheruser", password: "other" })
                .expect(200);

            await api
                .delete(`/api/blogs/${blog.id}`)
                .set("Authorization", `Bearer ${login.body.token}`)
                .expect(403);
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

    after(async () => {
        await Blog.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close();
    });
});
