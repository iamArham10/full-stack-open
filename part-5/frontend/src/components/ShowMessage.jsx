export default function ShowMessage({ message, type = "notError" }) {
    if (message === "") {
        return;
    }
    return (
        <div>
            <p style={type === "error" ? { color: "red" } : { color: "blue" }}>
                {message}
            </p>
        </div>
    );
}
