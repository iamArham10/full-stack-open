import Note from "./Note";

export default function NotesList({ notes, handleDelete }) {
    return (
        <>
            {notes.map((n) => {
                return (
                    <div
                        key={n.id}
                        style={{
                            padding: "2px 0px",
                        }}
                    >
                        <Note note={n} handleDelete={handleDelete} />
                    </div>
                );
            })}
        </>
    );
}
