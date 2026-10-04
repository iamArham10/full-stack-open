const express = require("express");
const mongoose = require("mongoose");

const app = express();

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    like: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const mongoUrl = "mongodb://localhost/bloglist";
mongoose.connect(mongoUrl, {
    family: 4,
});

app.use(express.json());

app.get("/api/blogs", (request, response) => {
    Blog.find({}).then((Blogs) => {
        response.json(Blogs);
    });
});

app.post("/api/blogs", (request, response) => {
    const body = request.body;
    const blog = new Blog({
        title: body.title ? body.title : "No title provided",
        author: body.author ? body.author : "No author provided",
        url: body.url ? body.url : "No url provided",
        like: body.like ? body.like : "No like provided",
    });

    blog.save().then((result) => {
        response.status(201).json(result);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running at port:", PORT);
});
