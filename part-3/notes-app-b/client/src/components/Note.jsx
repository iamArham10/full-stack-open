export default function Note({ note }) {
    return (
        <>
            {note.content} {note.important ? "true" : "false"}
        </>
    );
}
