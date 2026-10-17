import { useState } from "react";
import loginService from "../services/login";

export default function LoginForm({ onLogin, showMessage }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const user = await loginService.login({ username, password });
            onLogin(user);
            setUsername("");
            setPassword("");
        } catch {
            showMessage("Wrong Credentials", "error");
        }
    };

    return (
        <div>
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
        </div>
    );
}
