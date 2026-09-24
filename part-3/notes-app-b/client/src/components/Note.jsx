export default function Note({ note }) {
    return (
        <>
            {note.content}{" "}
            <span
                style={{
                    color: "red",
                    fontStyle: "italic",
                    border: "1px solid red",
                    padding: "2px 2px",
                    borderRadius: "4px",
                }}
            >
                {note.important ? "true" : "false"}
            </span>
        </>
    );
}
