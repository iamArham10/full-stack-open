export default function PhoneEntry({ person, onDelete }) {
    return (
        <div>
            {person.name}: {person.phone}{" "}
            <button onClick={() => onDelete(person.id, person.name)}>
                delete
            </button>
        </div>
    );
}
