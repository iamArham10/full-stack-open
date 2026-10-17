import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import ShowMessage from "./components/ShowMessage";
import AddBlog from "./components/AddBlog";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageState, setMessageState] = useState("");

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    }, []);

    useEffect(() => {
        const userJSON = window.localStorage.getItem("blogUserLogin");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUser(user);
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

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const user = await loginService.login({ username, password });
            setUser(user);
            blogService.setToken(user.token);
            window.localStorage.setItem("blogUserLogin", JSON.stringify(user));
            setUsername("");
            setPassword("");
        } catch {
            showMessage("Wrong Credentials", "error");
        }
    };

    const handleLogout = () => {
        window.localStorage.clear();
        setUser(null);
        blogService.setToken(null);
    };

    const handleBlogAdd = async ({ title, author, url }) => {
        try {
            const createdBlog = await blogService.createBlog({
                title,
                author,
                url,
            });
            setBlogs((blogs) => blogs.concat(createdBlog));
        } catch {
            showMessage("Can't create a blog now", "error");
        }
    };

    const loginForm = () => (
        <>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>
                        username
                        <input
                            type="text"
                            value={username}
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        password
                        <input
                            type="password"
                            value={password}
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </label>
                </div>
                <button type="submit">Login</button>
            </form>
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
                    <AddBlog onAdd={handleBlogAdd} />
                </>
            )}

            <h2>blogs</h2>
            <ShowMessage message={message} type={messageState} />
            {user && blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
        </div>
    );
};

export default App;
