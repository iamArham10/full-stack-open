const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {
        username: 1,
        name: 1,
    });
    response.json(blogs);
});

blogRouter.post("/", async (request, response, next) => {
    try {
        const { title, author, url, like, likes } = request.body || {};

        const user = request.user ? request.user : null;

        if (!user) {
            return response.status(400).end({ error: "Not Authenticated" });
        }

        const blog = new Blog({
            title,
            author,
            url,
            like: like ?? likes ?? 0,
            user: user ? user._id : undefined,
        });

        const savedBlog = await blog.save();

        if (user) {
            user.blogs = user.blogs.concat(savedBlog._id);
            await user.save();
        }

        response.status(201).json(savedBlog);
    } catch (error) {
        next(error);
    }
});

blogRouter.get("/:id", async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id);
        if (blog) {
            response.json(blog);
        } else {
            response.status(404).end();
        }
    } catch (error) {
        next(error);
    }
});

blogRouter.delete("/:id", async (request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id);
        response.status(204).end();
    } catch (error) {
        next(error);
    }
});

blogRouter.put("/:id", async (request, response, next) => {
    try {
        const { title, author, url, like, likes } = request.body;
        const newLikes = like ?? likes;

        const blog = await Blog.findById(request.params.id);
        if (!blog) {
            return response.status(404).end();
        }

        blog.title = title ? title : blog.title;
        blog.author = author ? author : blog.author;
        blog.url = url ? url : blog.url;
        blog.like = newLikes !== undefined ? newLikes : blog.like;

        const savedBlog = await blog.save();
        response.json(savedBlog);
    } catch (error) {
        next(error);
    }
});

module.exports = blogRouter;
