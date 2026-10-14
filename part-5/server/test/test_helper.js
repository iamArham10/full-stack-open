const Blog = require("../models/blog");

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

const blogsInDB = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};

const nonExistingId = async () => {
    const blog = new Blog({
        title: "willremovethissoon",
        url: "https://example.com",
    });
    await blog.save();
    await blog.deleteOne();
    return blog._id.toString();
};

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDB,
};
