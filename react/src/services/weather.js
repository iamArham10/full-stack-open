import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export default function getWeather(city) {
    return axios
        .get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`)
        .then((response) => response.data);
}
