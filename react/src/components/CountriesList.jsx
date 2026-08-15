import { useState } from "react";
import CountryData from "./CountryData";

export default function ListCountries({ countries }) {
    const countryNames = countries.map((country) => country.name.common);
    const [showCountry, setShowCountry] = useState(null);

    const handleShow = (countryName) => {
        setShowCountry(countryName);
    };

    return countryNames.map((countryName) => (
        <li key={countryName}>
            <div>
                {countryName}{" "}
                <button
                    onClick={() => {
                        handleShow(countryName);
                    }}
                >
                    show
                </button>
            </div>
            <div>
                {countryName === showCountry && (
                    <>
                        <button
                            onClick={() => {
                                setShowCountry(null);
                            }}
                            style={{
                                backgroundColor: "black",
                                color: "white",
                            }}
                        >
                            Hide
                        </button>{" "}
                        <CountryData
                            countryData={countries.find(
                                (country) =>
                                    country.name.common === showCountry,
                            )}
                        />
                    </>
                )}
            </div>
        </li>
    ));
}
