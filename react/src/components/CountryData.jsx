import Weather from "./Weather";
export default function CountryData({ countryData }) {
    console.log(countryData.languages);
    return (
        <div>
            <h1>{countryData.name?.common ?? "Not Available"}</h1>
            <p>Capital: {countryData.capital ?? "Not Available"}</p>
            <h3>Languages</h3>
            <ul>
                {Object.values(countryData.languages ?? []).map((value) => (
                    <li key={value}>{value}</li>
                ))}
            </ul>
            <img
                src={countryData.flags?.svg || countryData.flags?.png}
                alt={countryData.flags?.alt && "Not available"}
                height={200}
                width={300}
            />
            <Weather city={countryData.capital?.[0]} />
        </div>
    );
}
