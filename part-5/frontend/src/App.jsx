import { useState, useEffect, useRef } from "react";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import Togglable from "./components/Togglable";
import ShowMessage from "./components/ShowMessage";
import LoginForm from "./components/LoginForm";
import Blogs from "./components/Blogs";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messageState, setMessageState] = useState("");
    const blogFormRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    }, []);

    useEffect(() => {
        const userJSON = window.localStorage.getItem("blogUserLogin");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageState(type);
        setTimeout(() => {
            setMessage("");
            setMessageState("");
        }, 3000);
    };

    const handleLogout = () => {
        window.localStorage.clear();
        setUser(null);
        blogService.setToken(null);
        blogFormRef.current.toggleVisibility();
        navigate("/");
    };

    const handleBlogAdd = async ({ title, author, url }) => {
        try {
            const createdBlog = await blogService.createBlog({
                title,
                author,
                url,
            });
            setBlogs((blogs) => blogs.concat(createdBlog));
            blogFormRef.current.toggleVisibility();
        } catch {
            showMessage("Can't create a blog now", "error");
        }
    };

    const handleBlogLike = async (blog) => {
        const updatedBlog = await blogService.updateBlog({
            id: blog.id,
            title: blog.title,
            author: blog.author,
            url: blog.url,
            likes: blog.likes + 1,
        });
        setBlogs(
            blogs.map((b) =>
                b.id === updatedBlog.id
                    ? {
                          ...updatedBlog,
                          user: updatedBlog.user?.username
                              ? updatedBlog.user
                              : b.user,
                      }
                    : b,
            ),
        );
    };

    const handleBlogDelete = async (blog) => {
        try {
            await blogService.deleteBlog(blog.id);
            setBlogs(blogs.filter((b) => b.id !== blog.id));
        } catch {
            showMessage("Can't delete this blog", "error");
        }
    };

    function handleLogin(user) {
        window.localStorage.setItem("blogUserLogin", JSON.stringify(user));
        blogService.setToken(user.token);
        setUser(user);
        navigate("/");
    }

    const blogForm = () => (
        <>
            <Togglable ref={blogFormRef} buttonLabel="create new blog">
                <BlogForm onAdd={handleBlogAdd} />
            </Togglable>
        </>
    );

    const padding = {
        padding: 5,
    };

    return (
        <>
            <div>
                <Link style={padding} to="/">
                    home
                </Link>
                {!user && (
                    <Link style={padding} to="/login">
                        login
                    </Link>
                )}
                {user && <button onClick={handleLogout}>logout</button>}
            </div>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Blogs
                            blogs={blogs}
                            user={user}
                            onLike={handleBlogLike}
                            onDelete={handleBlogDelete}
                        />
                    }
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
            </Routes>
        </>
    );
};

export default App;
