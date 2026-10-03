import PhoneEntry from "./PhoneEntry.jsx";

export default function ListPhoneBook({ phones, onDelete }) {
    return (
        <div>
            {phones?.map((p) => {
                return (
                    <PhoneEntry
                        key={p.id}
                        person={p}
                        onDelete={onDelete}
                    />
                );
            })}
        </div>
    );
}
