import { useState, useEffect } from "react";
import { Link, useMatch, Route, Routes, useNavigate } from "react-router-dom";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Blogs from "./components/Blogs";
import LoginForm from "./components/LoginForm";
import ShowMessage from "./components/ShowMessage";
import blogService from "./services/blogs";
import { AppBar, Button, Container, Toolbar } from "@mui/material";

const USER_STORAGE_KEY = "blogUserLogin";
const MESSAGE_TIMEOUT_MS = 3000;

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const navigate = useNavigate();

    const blogMatch = useMatch("/blogs/:id");
    const selectedBlog = blogMatch
        ? blogs.find((blog) => blog.id === blogMatch.params.id)
        : null;

    useEffect(() => {
        blogService.getAll().then(setBlogs);
    }, []);

    useEffect(() => {
        const savedUser = window.localStorage.getItem(USER_STORAGE_KEY);
        if (!savedUser) return;

        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        blogService.setToken(parsedUser.token);
    }, []);

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, MESSAGE_TIMEOUT_MS);
    };

    const replaceBlog = (updatedBlog) => {
        setBlogs((current) =>
            current.map((blog) =>
                blog.id === updatedBlog.id
                    ? {
                          ...updatedBlog,
                          user: updatedBlog.user?.username
                              ? updatedBlog.user
                              : blog.user,
                      }
                    : blog,
            ),
        );
    };

    const handleLogin = (loggedInUser) => {
        window.localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(loggedInUser),
        );
        blogService.setToken(loggedInUser.token);
        setUser(loggedInUser);
        navigate("/");
    };

    const handleLogout = () => {
        window.localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
        blogService.setToken(null);
        navigate("/");
    };

    const handleBlogAdd = async ({ title, author, url }) => {
        try {
            const createdBlog = await blogService.createBlog({
                title,
                author,
                url,
            });
            setBlogs((current) => current.concat(createdBlog));
            navigate("/");
        } catch {
            showMessage("Can't create a blog now", "error");
        }
    };

    const handleBlogLike = async (blog) => {
        if (!user) {
            showMessage("Login to like the blog", "error");
            return;
        }

        try {
            const updatedBlog = await blogService.updateBlog({
                id: blog.id,
                title: blog.title,
                author: blog.author,
                url: blog.url,
                likes: blog.likes + 1,
            });
            replaceBlog(updatedBlog);
        } catch {
            showMessage("Can't like this blog", "error");
        }
    };

    const handleBlogDelete = async (blog) => {
        try {
            await blogService.deleteBlog(blog.id);
            setBlogs((current) => current.filter((b) => b.id !== blog.id));
            navigate("/");
        } catch {
            showMessage("Can't delete this blog", "error");
        }
    };

    return (
        <Container>
            <AppBar position="static">
                <Toolbar>
                    <h3 style={{ marginRight: "auto" }}>Blog App</h3>

                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>

                    {user ? (
                        <>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/create-blog"
                            >
                                Create a new blog
                            </Button>

                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <br />

            <ShowMessage message={message} type={messageType} />

            <Routes>
                <Route path="/" element={<Blogs blogs={blogs} />} />
                <Route
                    path="/create-blog"
                    element={<BlogForm onAdd={handleBlogAdd} />}
                />
                <Route
                    path="/login"
                    element={
                        <LoginForm
                            onLogin={handleLogin}
                            showMessage={showMessage}
                        />
                    }
                />
                <Route
                    path="/blogs/:id"
                    element={
                        selectedBlog ? (
                            <Blog
                                blog={selectedBlog}
                                user={user}
                                onLike={handleBlogLike}
                                onDelete={handleBlogDelete}
                            />
                        ) : (
                            <p>Blog not found</p>
                        )
                    }
                />
            </Routes>
        </Container>
    );
};

export default App;
