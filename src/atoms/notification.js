import { atom, getDefaultStore } from "jotai";
import { useReducerAtom } from "jotai/utils";

const DEFAULT_DURATION = 100000;

export const notificationsAtom = atom([]);

const notificationsReducer = (prev, action) => {
    switch (action.type) {
        case "addNotification":
            return [...prev, action.payload];
        case "removeNotification":
            return prev.filter((notification) => notification.id !== action.payload);
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

export const useNotificationsReducer = () => {
    const [notifications, dispatch] = useReducerAtom(notificationsAtom, notificationsReducer);

    const addNotification = ({ title = "", body = "", type = "info", duration = DEFAULT_DURATION }) => {
        const id = Date.now(); // Use timestamp as a unique ID
        const notification = { id, title, body, type, duration };

        dispatch({ type: "addNotification", payload: notification });

        // Automatically remove notification after the specified duration
        setTimeout(() => {
            dispatch({ type: "removeNotification", payload: id });
        }, duration);
    };

    const removeNotification = (id) => {
        dispatch({ type: "removeNotification", payload: id });
    };

    return {
        notifications,
        addNotification,
        removeNotification,
    };
};

// Non-hook API for triggering notifications outside React components
export const notify = ({ title = "", body = "", type = "info", duration = DEFAULT_DURATION }) => {
    const store = getDefaultStore();
    const id = Date.now();
    const notification = { id, title, body, type, duration };

    // Add notification
    store.set(notificationsAtom, (prev) => [...prev, notification]);

    // Auto-remove after duration
    setTimeout(() => {
        store.set(notificationsAtom, (prev) => prev.filter((n) => n.id !== id));
    }, duration);
};
