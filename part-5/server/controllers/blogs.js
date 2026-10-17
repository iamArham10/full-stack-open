const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {
        username: 1,
        name: 1,
    });
    response.json(blogs);
});

blogRouter.post("/", userExtractor, async (request, response, next) => {
    try {
        const { title, author, url, likes } = request.body || {};

        const user = request.user;

        const blog = new Blog({
            title,
            author,
            url,
            likes: likes ?? 0,
            user: user._id,
        });

        const savedBlog = await blog.save();

        user.blogs = user.blogs.concat(savedBlog._id);
        await user.save();

        const populatedBlog = await savedBlog.populate("user", {
            username: 1,
            name: 1,
        });
        response.status(201).json(populatedBlog);
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

blogRouter.delete("/:id", userExtractor, async (request, response, next) => {
    try {
        const blogToDelete = await Blog.findById(request.params.id);
        if (!blogToDelete) {
            return response.status(404).json({ error: "Invalid blog id" });
        }

        const user = request.user;

        if (!blogToDelete.user || blogToDelete.user.toString() !== user._id.toString()) {
            return response
                .status(403)
                .json({ error: "only the creator can delete a blog" });
        }

        await Blog.findByIdAndDelete(blogToDelete._id);
        user.blogs = user.blogs.filter(
            (id) => id.toString() !== blogToDelete._id.toString(),
        );
        await user.save();
        response.status(204).end();
    } catch (error) {
        next(error);
    }
});

blogRouter.put("/:id", async (request, response, next) => {
    try {
        const { title, author, url, likes } = request.body;

        const blog = await Blog.findById(request.params.id);
        if (!blog) {
            return response.status(404).end();
        }

        blog.title = title ? title : blog.title;
        blog.author = author ? author : blog.author;
        blog.url = url ? url : blog.url;
        blog.likes = likes !== undefined ? likes : blog.likes;

        const savedBlog = await blog.save();
        const populatedBlog = await savedBlog.populate("user", {
            username: 1,
            name: 1,
        });
        response.json(populatedBlog);
    } catch (error) {
        next(error);
    }
});

module.exports = blogRouter;
