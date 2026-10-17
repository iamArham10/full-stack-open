import { useState, useEffect, useRef } from "react";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import Togglable from "./components/Togglable";
import ShowMessage from "./components/ShowMessage";
import LoginForm from "./components/LoginForm";
import Blogs from "./components/Blogs";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messageState, setMessageState] = useState("");
    const blogFormRef = useRef();

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
    }

    const blogForm = () => (
        <>
            <Togglable ref={blogFormRef} buttonLabel="create new blog">
                <BlogForm onAdd={handleBlogAdd} />
            </Togglable>
        </>
    );

    const loginForm = () => (
        <>
            <Togglable buttonLabel="login">
                <LoginForm onLogin={handleLogin} showMessage={showMessage} />
            </Togglable>
        </>
    );

    return (
        <div>
            {!user && loginForm()}
            {user && (
                <>
                    <h3>
                        {user.username} logged in{" "}
                        <button onClick={handleLogout}>logout</button>
                    </h3>
                    <h2>add blog</h2>
                    {blogForm()}
                </>
            )}
            <h2>blogs</h2>
            <ShowMessage message={message} type={messageState} />
            {user && (
                <Blogs
                    blogs={blogs}
                    user={user}
                    onLike={handleBlogLike}
                    onDelete={handleBlogDelete}
                />
            )}
        </div>
    );
};

export default App;
