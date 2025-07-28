class NotificationManager extends EventTarget {
    constructor() {
        super();
        this.notifications = [];
    }

    addNotification({ title = "", body = "", type = "info", duration = 5000 }) {
        const id = Date.now(); // Use timestamp as a unique ID
        const notification = { id, title, body, type, duration };
        this.notifications.push(notification);
        this.dispatchEvent(new CustomEvent('notification', { detail: this.notifications }));

        setTimeout(() => {
            this.removeNotification(id);
        }, duration);
    }

    removeNotification(id) {
        this.notifications = this.notifications.filter(notification => notification.id !== id);
        this.dispatchEvent(new CustomEvent('notification', { detail: this.notifications }));
    }

    getNotifications() {
        return this.notifications;
    }
}

const notificationManager = new NotificationManager();
export default notificationManager;
