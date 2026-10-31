import { Alert } from "@mui/material";
export default function ShowMessage({ message, type = "notError" }) {
    if (message === "") {
        return null;
    }

    return (
        <Alert
            style={{ marginTop: 10, marginBottom: 10 }}
            severity={type === "error" ? type : "success"}
        >
            {message}
        </Alert>
    );
}
