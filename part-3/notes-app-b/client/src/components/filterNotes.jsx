export default function FilterNotes({ searchQuery, onSearchChange }) {
    return (
        <div style={{ margin: "16px 0" }}>
            <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                style={{
                    width: "100%",
                    maxWidth: "320px",
                    padding: "8px 12px",
                    fontSize: "14px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    outline: "none",
                    boxSizing: "border-box",
                }}
            />
        </div>
    );
}

