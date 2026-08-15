import getWeather from "../services/weather";
import { useEffect, useState } from "react";
export default function Weather({ city }) {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        getWeather(city).then((data) => {
            setWeather(data);
        });
    }, [city]);
    if (!weather) {
        return <p>Not available</p>;
    }

    return (
        <>
            {weather && (
                <div>
                    <h2>Weather in {city}</h2>
                    <p>Temperature: {weather.main.temp} Celsius</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                    />
                    <p>Wind: {weather.wind.speed} m/s</p>
                </div>
            )}{" "}
        </>
    );
}
