const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", (request, response) => {
    Blog.find({}).then((blogs) => {
        response.json(blogs);
    });
});

blogRouter.post("/", (request, response, next) => {
    const blog = new Blog(request.body);

    blog.save()
        .then((result) => {
            response.json(result);
        })
        .catch((error) => next(error));
});

blogRouter.get("/:id", (request, response, next) => {
    const id = request.params.id;
    Blog.findById(id)
        .then((blog) => {
            response.json(blog);
        })
        .catch((error) => next(error));
});

blogRouter.delete("/:id", (request, response, next) => {
    Blog.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch((error) => {
            next(error);
        });
});

blogRouter.put("/:id", (request, response, next) => {
    const { title, author, url, like } = request.body;

    Blog.findById(request.params.id)
        .then((blog) => {
            if (!blog) {
                return response.status(404).end();
            }
            blog.title = title ? title : blog.title;
            blog.author = author ? author : blog.author;
            blog.url = url ? url : blog.url;
            blog.like = like !== undefined ? like : blog.like;
            
            blog.save()
                .then(savedBlog => {
                    response.json(savedBlog);
                })
                .catch(error => next(error));
        })
        .catch((error) => next(error));
});

module.exports = blogRouter;
