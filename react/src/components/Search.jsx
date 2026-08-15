export default function Search({ setQuery }) {
    const handleChange = (e) => {
        setQuery(e.target.value.trim().toLowerCase());
    };

    return (
        <div>
            Find Countries <input type="search" onChange={handleChange} />
        </div>
    );
}
