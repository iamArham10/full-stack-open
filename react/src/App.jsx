import { useEffect, useState } from "react";
import Search from "./components/Search";
import { getCountries } from "./services/countries";
import ListCountries from "./components/CountriesList";
import CountryData from "./components/CountryData";

function App() {
    const [countries, setCountries] = useState([]);
    const [query, setQuery] = useState(null);

    useEffect(() => {
        getCountries()
            .then((data) => {
                setCountries(data);
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    }, []);

    const filteredCountries = countries.filter((country) =>
        query
            ? country.name.common.toLowerCase().includes(query.toLowerCase())
            : false,
    );

    return (
        <div>
            <Search setQuery={setQuery} />
            {filteredCountries.length > 1 && (
                <ListCountries countries={filteredCountries} />
            )}
            {filteredCountries.length === 1 && (
                <CountryData countryData={filteredCountries[0]} />
            )}
        </div>
    );
}

export default App;
