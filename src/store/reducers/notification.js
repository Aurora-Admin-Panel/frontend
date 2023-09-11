import { createSlice } from "@reduxjs/toolkit";

let nextNotificationId = 1;

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: []
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.push(action.payload);
        },
        removeNotification: (state, action) => {
            state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
        }
    }
});

export const showNotification = ({ title = "", body = "", type = 'info', duration = 5000 }) => {
    return (dispatch) => {
        const id = nextNotificationId++;
        dispatch(notificationSlice.actions.addNotification({ id, title, body, type, duration }));
    };
};

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;