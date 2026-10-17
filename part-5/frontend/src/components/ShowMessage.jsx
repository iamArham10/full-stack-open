export default function ShowMessage({ message, type = "notError" }) {
    if (message === "") {
        return null;
    }

    const color = type === "error" ? "red" : "blue";

    return (
        <div>
            <p style={{ color }}>{message}</p>
        </div>
    );
}
