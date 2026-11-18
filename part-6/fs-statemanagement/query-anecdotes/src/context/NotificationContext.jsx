import { createContext, useState } from "react";

const NotificationContext = createContext();

export default NotificationContext;

export const NotificationContextProvider = (props) => {
    const [notification, setNotification] = useState("");

    const notify = (notification) => {
        setNotification(notification);
        setTimeout(() => {
            setNotification("");
        }, 2000);
    };

    return (
        <NotificationContext.Provider value={{ notification, notify }}>
            {props.children}
        </NotificationContext.Provider>
    );
};
