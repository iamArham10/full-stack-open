import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import ShowMessage from "./components/ShowMessage";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messageState, setMessageState] = useState("");

    useEffect(() => {
        blogService.getAll().then((blogs) => setBlogs(blogs));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await loginService.login({ username, password });
            setUser(user);
            window.localStorage.setItem("blogUserLogin", JSON.stringify(user));
            setUsername("");
            setPassword("");
        } catch {
            setMessage("Wrong Credentials");
            setMessageState("error");
            setTimeout(() => {
                setMessage("");
                setMessageState("");
            }, 3000);
        }
    };

    useEffect(() => {
        const userJSON = window.localStorage.getItem("blogUserLogin");
        if (userJSON) {
            const user = JSON.parse(userJSON);
            setUser(user);
        }
    }, []);

    const loginForm = () => (
        <>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
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
            <h2>blogs</h2>
            <ShowMessage message={message} type={messageState} />
            {user && blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
        </div>
    );
};

export default App;
