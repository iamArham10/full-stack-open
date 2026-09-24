import Note from "./Note";

export default function NotesList({ notes }) {
    return (
        <>
            {notes.map((n) => {
                return (
                    <div key={n.id}>
                        <Note note={n} />
                    </div>
                );
            })}
        </>
    );
}
