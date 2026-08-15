import axios from "axios";

const URL = `https://studies.cs.helsinki.fi/restcountries/api/all`;

export function getCountries() {
    return axios.get(URL).then((response) => response.data);
}
