export default function Note({ note, handleDelete }) {
    return (
        <>
            {note.content}{" "}
            <span
                style={{
                    color: note.important ? "blue" : "red",
                    fontStyle: "italic",
                }}
            >
                {note.important ? "true" : "false"}
            </span>
            <button
                style={{
                    backgroundColor: "#e53e3e",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "3px 8px",
                    fontSize: "12px",
                    cursor: "pointer",
                    marginLeft: "8px",
                }}
                onClick={() => {
                    handleDelete(note.id);
                }}
            >
                delete
            </button>
        </>
    );
}
