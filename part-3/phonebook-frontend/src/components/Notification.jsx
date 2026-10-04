export default function Notification({ message, type = "error" }) {
    if (!message) {
        return null;
    }

    const style = {
        color: type === "error" ? "red" : "green",
        background: "lightgrey",
        fontSize: "20px",
        borderStyle: "solid",
        borderRadius: "5px",
        padding: "10px",
        marginBottom: "10px",
    };

    return (
        <div style={style} className={`notification ${type}`}>
            {message}
        </div>
    );
}
